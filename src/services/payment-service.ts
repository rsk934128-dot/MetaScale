
'use client';

import { 
  Firestore, 
  doc, 
  runTransaction, 
  serverTimestamp, 
  increment,
  getDoc
} from 'firebase/firestore';
import { NormalizedPaymentEvent, InboundPaymentDoc, PaymentStatus, SettlementBucket } from '@/lib/payments/types';

/**
 * Core Domain Service: Atomic Payment Credit Logic
 * Phase 2.7: Now populates derived query fields for indexing.
 */
export async function processPaymentCredit(
  firestore: Firestore, 
  event: NormalizedPaymentEvent,
  trigger: 'WEBHOOK' | 'RECONCILIATION' | 'MANUAL' = 'WEBHOOK',
  adminUid?: string
) {
  const paymentId = `${event.provider}_${event.externalTxnId}`;
  const timestamp = Date.now();

  return await runTransaction(firestore, async (transaction) => {
    const paymentRef = doc(firestore, 'payments', paymentId);
    const paymentSnap = await transaction.get(paymentRef);
    
    let currentData: InboundPaymentDoc | null = null;
    if (paymentSnap.exists()) {
      currentData = paymentSnap.data() as InboundPaymentDoc;
    }

    // 1. Idempotency Check
    if (currentData?.isCredited) {
      return { status: 'ALREADY_CREDITED', paymentId };
    }

    // 2. User Lookup
    const userRef = doc(firestore, 'users', event.userId);
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) {
      throw new Error(`USER_NOT_FOUND: ${event.userId}`);
    }

    // 3. Atomic Execution: Update User Balance
    transaction.update(userRef, {
      balance: increment(event.amount),
      updatedAt: serverTimestamp()
    });

    // 4. Update Payment Ledger with Derived Fields
    const creditOpId = `${trigger.toLowerCase()}_${timestamp}_${event.externalTxnId.slice(-6)}`;
    
    const historyEntry = {
      status: 'CREDITED' as PaymentStatus,
      timestamp: timestamp,
      trigger: trigger,
      reason: trigger === 'MANUAL' ? `Manual replay by admin ${adminUid}` : 
              trigger === 'RECONCILIATION' ? 'System automated self-healing' : 
              'Automated webhook credit',
      replayedBy: adminUid
    };

    const isCredited = true;
    const update: Partial<InboundPaymentDoc> = {
      ...event,
      status: 'CREDITED',
      updatedAt: timestamp,
      creditedAt: timestamp,
      isCredited: isCredited,
      credited: isCredited, // Derived boolean for fast indexing
      userId: event.userId, // Ensure userId is indexed
      creditOperationId: creditOpId,
      reconciliationStatus: 'MATCHED',
      id: paymentId,
      statusHistory: currentData ? [...(currentData.statusHistory || []), historyEntry] : [historyEntry],
      replayCount: 0,
      lastError: "",
      manualReviewRequired: false,
      settlementBucket: 'DONE'
    };

    if (!paymentSnap.exists()) {
      transaction.set(paymentRef, { 
        ...update, 
        createdAt: timestamp,
        anomalyFlags: [],
      });
    } else {
      transaction.update(paymentRef, update);
    }

    return { 
      status: 'SUCCESS_CREDITED', 
      paymentId, 
      operationId: creditOpId 
    };
  });
}
