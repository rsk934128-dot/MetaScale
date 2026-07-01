
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
  Timestamp
} from 'firebase/firestore';
import { InboundPaymentDoc } from '@/lib/payments/types';
import { processPaymentCredit } from './payment-service';

/**
 * Phase 2.6: Automated Reconciliation Engine
 * This service implements self-healing for payments stuck in 'PAID' state.
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
    // 1. Query for stuck payments (PAID but !isCredited)
    // In production, you would also use an index for nextReplayAttemptAt
    const stuckQuery = query(
      collection(firestore, 'payments'),
      where('status', '==', 'PAID'),
      where('isCredited', '==', false),
      limit(20)
    );

    const snapshot = await getDocs(stuckQuery);
    results.scanned = snapshot.size;

    for (const d of snapshot.docs) {
      const payment = d.data() as InboundPaymentDoc;
      
      // Check if eligible for retry (exponential backoff check)
      if (payment.nextReplayAttemptAt && payment.nextReplayAttemptAt > now) {
        continue;
      }

      results.anomaliesFound++;

      if (mode === 'DRY_RUN') {
        results.logs.push(`[DRY_RUN] Would replay ${payment.id}`);
        continue;
      }

      if (mode === 'DETECT_ONLY') {
        results.logs.push(`[DETECT] Found stuck payment: ${payment.id}`);
        continue;
      }

      // 2. Attempt Safe Replay using Domain Service
      try {
        const replayResult = await processPaymentCredit(firestore, payment, 'RECONCILIATION', 'SYSTEM_CRON');
        
        if (replayResult.status === 'SUCCESS_CREDITED') {
          results.replayed++;
          results.logs.push(`[SUCCESS] Auto-replayed ${payment.id}`);
        } else {
          results.logs.push(`[SKIPPED] ${payment.id}: ${replayResult.status}`);
        }
      } catch (err: any) {
        results.failed++;
        results.logs.push(`[ERROR] Failed replaying ${payment.id}: ${err.message}`);

        // Update retry metadata with backoff
        const newCount = (payment.replayCount || 0) + 1;
        const backoffMs = Math.pow(2, newCount) * 5 * 60 * 1000; // 5, 10, 20... minutes

        await updateDoc(doc(firestore, 'payments', payment.id), {
          replayCount: newCount,
          lastReplayAttemptAt: now,
          nextReplayAttemptAt: now + backoffMs,
          lastError: err.message,
          updatedAt: now
        });
      }
    }
  } catch (globalErr: any) {
    console.error("Cron Fatal Error:", globalErr);
    results.logs.push(`[FATAL] ${globalErr.message}`);
  }

  return results;
}
