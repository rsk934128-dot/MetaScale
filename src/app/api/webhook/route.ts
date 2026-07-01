
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { PaymentProvider } from '@/lib/payments/types';
import { normalizeEvent } from '@/lib/payments/unified-router';
import { verifyBinanceSignature } from '@/lib/payments/binance-pay';
import { processPaymentCredit, reconcileAndSettleLink } from '@/services/payment-service';

/**
 * Sovereign Webhook Receiver (Institutional Grade)
 * Implements: Deterministic Reconciliation & Settlement Controller.
 */
export async function POST(req: Request) {
  const { firestore } = initializeFirebase();
  if (!firestore) return NextResponse.json({ error: 'DB_UNAVAILABLE' }, { status: 503 });

  try {
    const rawBody = await req.text();
    const headers = req.headers;
    const payload = JSON.parse(rawBody);

    // 1. Provider Identity
    let provider: PaymentProvider = 'STRIPE';
    if (headers.has('binance-pay-signature')) provider = 'BINANCE_PAY';
    else if (payload.merchantInvoiceNumber || payload.paymentID) provider = 'BKASH';

    // 2. Normalization & Validation
    const normalized = normalizeEvent(provider, payload);
    
    // 3. Check if this payment is tied to a Sovereign Seal (Link)
    if (normalized.orderId.startsWith('PAY_SEAL_')) {
      console.log(`>>> [SETTLEMENT] Intercepted Seal Payment: ${normalized.orderId}`);
      
      const reconResult = await reconcileAndSettleLink(
        firestore, 
        normalized.orderId, 
        provider, 
        normalized.externalTxnId
      );

      if (reconResult.status === 'READY_FOR_CREDIT') {
        const creditResult = await processPaymentCredit(firestore, reconResult.normalizedEvent!, 'WEBHOOK');
        return NextResponse.json({ 
          received: true, 
          settlement: 'AUTOMATED_RECONCILED',
          creditStatus: creditResult.status 
        });
      }
    }

    // 4. Default direct credit if PAID but no seal (Standard API flow)
    if (normalized.status === 'PAID') {
      const result = await processPaymentCredit(firestore, normalized, 'WEBHOOK');
      return NextResponse.json({ received: true, result: result.status }, { status: 200 });
    }

    return NextResponse.json({ received: true, result: 'STATUS_LOGGED' }, { status: 200 });

  } catch (err: any) {
    console.error(`[FATAL] Webhook Settlement Error: ${err.message}`);
    return NextResponse.json({ 
      error: 'INTERNAL_ERROR', 
      message: err.message 
    }, { status: 500 });
  }
}
