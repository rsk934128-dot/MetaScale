
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { 
  doc, 
  runTransaction, 
  serverTimestamp, 
  increment,
  collection 
} from 'firebase/firestore';
import { PaymentProvider, InboundPaymentDoc } from '@/lib/payments/types';
import { normalizeEvent, redactSensitiveData } from '@/lib/payments/unified-router';
import { verifyBinanceSignature } from '@/lib/payments/binance-pay';

/**
 * Sovereign Webhook Listener (Unified Protocol)
 * Implements exactly-once delivery via Firestore Transactions & Idempotency.
 */
export async function POST(req: Request) {
  const { firestore } = initializeFirebase();
  if (!firestore) return NextResponse.json({ error: 'DB Unavailable' }, { status: 503 });

  try {
    // 1. Get RAW body for signature verification
    const rawBody = await req.text();
    const headers = req.headers;
    const payload = JSON.parse(rawBody);

    // 2. Identify and Verify Provider
    let provider: PaymentProvider = 'STRIPE';
    if (headers.has('binance-pay-signature')) provider = 'BINANCE_PAY';
    else if (payload.merchantInvoiceNumber) provider = 'BKASH';

    let isValid = false;
    if (provider === 'BINANCE_PAY') {
      isValid = await verifyBinanceSignature(headers, rawBody);
    } else if (provider === 'STRIPE') {
      // sig = headers.get('stripe-signature');
      isValid = true; // Placeholder for Stripe signature verification
    } else {
      isValid = true; // Placeholder for bKash token verification
    }

    if (!isValid) {
      console.error(`!!! SECURITY: Signature Mismatch for ${provider}`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Normalize & Redact
    const normalized = normalizeEvent(provider, payload);
    const auditPayload = redactSensitiveData(payload);

    // 4. Atomic Transaction: State Machine + User Credit
    await runTransaction(firestore, async (transaction) => {
      const paymentRef = doc(firestore, 'payments', normalized.externalTxnId);
      const paymentSnap = await transaction.get(paymentRef);

      let currentData: Partial<InboundPaymentDoc> = {};
      
      if (paymentSnap.exists()) {
        currentData = paymentSnap.data() as InboundPaymentDoc;
      }

      // Idempotency Check: Don't re-process if already credited
      if (currentData.isCredited) {
        console.log(`>>> IDEMPOTENCY: Already credited ${normalized.externalTxnId}`);
        return;
      }

      // State Machine Guard: Only move to PAID/CREDITED from allowed states
      const allowedToCredit = !currentData.status || ['CREATED', 'USER_PAYING', 'PAID'].includes(currentData.status);
      
      if (normalized.status === 'PAID' && allowedToCredit) {
        const userId = normalized.userId;
        const userRef = doc(firestore, 'users', userId);
        const userSnap = await transaction.get(userRef);

        if (userSnap.exists()) {
          // Exactly-once: Update User Balance
          transaction.update(userRef, { 
            balance: increment(normalized.amount),
            updatedAt: serverTimestamp()
          });

          // Update Payment Main Doc
          const update: Partial<InboundPaymentDoc> = {
            status: 'CREDITED',
            paidAt: normalized.eventTime,
            creditedAt: Date.now(),
            isCredited: true,
            updatedAt: Date.now(),
            amount: normalized.amount,
            currency: normalized.currency,
            provider: normalized.provider,
            userId: userId,
            orderId: normalized.orderId,
            externalTxnId: normalized.externalTxnId,
            metadata: normalized.metadata || {}
          };

          if (!paymentSnap.exists()) {
            transaction.set(paymentRef, { ...update, createdAt: Date.now() });
          } else {
            transaction.update(paymentRef, update);
          }

          // Create Immutable Audit Event in Subcollection
          const eventRef = doc(collection(paymentRef, 'events'), normalized.providerEventId || `EVT_${Date.now()}`);
          transaction.set(eventRef, {
            type: 'WEBHOOK_RECEIVED',
            status: 'SUCCESS',
            payload: auditPayload,
            timestamp: Date.now()
          });

          console.log(`>>> REVENUE_OPS: Settlement Success for ${normalized.orderId}. User ${userId} credited.`);
        } else {
          throw new Error(`User ${userId} not found in Sovereign Mesh`);
        }
      }
    });

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`!!! WEBHOOK_CRITICAL_ERROR: ${err.message}`);
    return NextResponse.json({ error: 'Processing Failed', message: err.message }, { status: 500 });
  }
}
