
'use client';

import { 
  Firestore, 
  doc, 
  runTransaction, 
  serverTimestamp, 
  increment,
  getDoc
} from 'firebase/firestore';
import { NormalizedPaymentEvent, InboundPaymentDoc } from '@/lib/payments/types';

/**
 * Core Domain Service: Atomic Payment Credit Logic
 * Ensures exactly-once credit and handles state transitions.
 */
export async function processPaymentCredit(
  firestore: Firestore, 
  event: NormalizedPaymentEvent,
  trigger: 'WEBHOOK' | 'RECONCILIATION' | 'MANUAL' = 'WEBHOOK'
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

    // 2. Auth/Verification (Already done in route or service)
    // 3. User Lookup
    const userRef = doc(firestore, 'users', event.userId);
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) {
      throw new Error(`USER_NOT_FOUND: ${event.userId}`);
    }

    // 4. Atomic Execution: Balance + Ledger
    transaction.update(userRef, {
      balance: increment(event.amount),
      updatedAt: serverTimestamp()
    });

    const creditOpId = `OP_${timestamp}_${event.externalTxnId.slice(-6)}`;
    const update: Partial<InboundPaymentDoc> = {
      ...event,
      status: 'CREDITED',
      updatedAt: timestamp,
      creditedAt: timestamp,
      isCredited: true,
      creditOperationId: creditOpId,
      reconciliationStatus: 'MATCHED',
      id: paymentId,
    };

    // Construct status entry
    const historyEntry = {
      status: 'CREDITED' as const,
      timestamp: timestamp,
      trigger: trigger,
      reason: trigger === 'MANUAL' ? 'Manual override by admin' : 'Automated webhook credit'
    };

    if (!paymentSnap.exists()) {
      transaction.set(paymentRef, { 
        ...update, 
        createdAt: timestamp,
        statusHistory: [historyEntry],
        anomalyFlags: []
      });
    } else {
      transaction.update(paymentRef, {
        ...update,
        statusHistory: [...(currentData.statusHistory || []), historyEntry]
      });
    }

    return { status: 'SUCCESS_CREDITED', paymentId, operationId: creditOpId };
  });
}
