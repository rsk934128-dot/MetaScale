
'use client';

import { 
  Firestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  limit, 
  doc, 
  updateDoc,
  orderBy
} from 'firebase/firestore';
import { InboundPaymentDoc } from '@/lib/payments/types';
import { processPaymentCredit } from './payment-service';

/**
 * Phase 2.7: Optimized Reconciliation Engine
 * Uses 'settlementBucket' to minimize collection scanning.
 */
export async function runAutomatedReconciliation(
  firestore: Firestore,
  mode: 'DETECT_ONLY' | 'DETECT_AND_REPLAY' | 'DRY_RUN' = 'DETECT_AND_REPLAY'
) {
  const now = Date.now();
  const results = {
    scanned: 0,
    anomaliesFound: 0,
    replayed: 0,
    failed: 0,
    logs: [] as string[]
  };

  try {
    // Phase 2.7 Optimized Query: Using derived 'settlementBucket'
    // Requires Composite Index: (settlementBucket, updatedAt desc)
    const stuckQuery = query(
      collection(firestore, 'payments'),
      where('settlementBucket', '==', 'READY_FOR_REPLAY'),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(stuckQuery);
    results.scanned = snapshot.size;

    for (const d of snapshot.docs) {
      const payment = d.data() as InboundPaymentDoc;
      results.anomaliesFound++;

      if (mode === 'DRY_RUN') {
        results.logs.push(`[DRY_RUN] Candidate: ${payment.id}`);
        continue;
      }

      try {
        const replayResult = await processPaymentCredit(firestore, payment, 'RECONCILIATION', 'SYSTEM_CRON');
        
        if (replayResult.status === 'SUCCESS_CREDITED') {
          results.replayed++;
          results.logs.push(`[SUCCESS] Auto-replayed ${payment.id}`);
        }
      } catch (err: any) {
        results.failed++;
        results.logs.push(`[ERROR] Failed ${payment.id}: ${err.message}`);

        const newCount = (payment.replayCount || 0) + 1;
        const backoffMs = Math.pow(2, newCount) * 5 * 60 * 1000;
        const nextAttempt = now + backoffMs;
        
        // Update with new bucket logic
        const newBucket = newCount >= 5 ? 'FATAL' : 'WAITING_BACKOFF';

        await updateDoc(doc(firestore, 'payments', payment.id), {
          replayCount: newCount,
          lastReplayAttemptAt: now,
          nextReplayAttemptAt: nextAttempt,
          lastError: err.message,
          updatedAt: now,
          settlementBucket: newBucket,
          manualReviewRequired: newBucket === 'FATAL'
        });
      }
    }
  } catch (globalErr: any) {
    results.logs.push(`[FATAL] ${globalErr.message}`);
  }

  return results;
}
