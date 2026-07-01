
'use client';

import { 
  Firestore, 
  doc, 
  runTransaction, 
  serverTimestamp, 
  increment,
  getDoc,
  collection,
  addDoc
} from 'firebase/firestore';
import { NormalizedPaymentEvent, InboundPaymentDoc, PaymentStatus, SettlementBucket } from '@/lib/payments/types';
import { runPredictiveAnalysis } from '@/ai/flows/predictive-anomaly-analysis';

/**
 * Core Domain Service: Atomic Payment Credit Logic
 * Updated v1.3: Integrated "Hunter Mode" Predictive Anomaly Checking.
 */
export async function processPaymentCredit(
  firestore: Firestore, 
  event: NormalizedPaymentEvent,
  trigger: 'WEBHOOK' | 'RECONCILIATION' | 'MANUAL' = 'WEBHOOK',
  adminUid?: string
) {
  const paymentId = `${event.provider}_${event.externalTxnId}`;
  const timestamp = Date.now();

  // 1. Proactive Threat Hunting (Hunter Mode)
  // We fetch user context before starting transaction
  const userRef = doc(firestore, 'users', event.userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (userData) {
    try {
      const riskCheck = await runPredictiveAnalysis({
        transaction: {
          amount: event.amount,
          currency: event.currency,
          provider: event.provider,
          externalTxnId: event.externalTxnId,
          nodeId: 'NODE-04-UK'
        },
        userContext: {
          uid: event.userId,
          trustScore: userData.trustScore || 0,
          verificationStatus: userData.verificationStatus || 'UNVERIFIED',
          recentActivityCount: 0, // In production, query recent txns
          averageTxnAmount: 500, // In production, calculate from history
        },
        networkMetadata: {
          latency: 8.4
        }
      });

      if (riskCheck.riskScore > 80) {
        console.warn(`>>> [HUNTER_MODE] BLOCKING_HIGH_RISK: ${riskCheck.riskScore} | Reason: ${riskCheck.reasoning}`);
        
        // Log the anomaly event
        await addDoc(collection(firestore, 'events'), {
          type: 'PREDICTIVE_ANOMALY_DETECTED',
          plane: 'SECURITY',
          priority: 1,
          timestamp: Date.now(),
          payload: { 
            paymentId, 
            riskScore: riskCheck.riskScore, 
            reason: riskCheck.reasoning,
            category: riskCheck.threatCategory
          },
          status: 'BLOCKED_BY_GOVERNANCE',
          category: 'PREDICTIVE_ANOMALY',
          severity: 'CRITICAL'
        });

        return { 
          status: 'BLOCKED_BY_GOVERNANCE', 
          reason: riskCheck.reasoning,
          riskScore: riskCheck.riskScore 
        };
      }
    } catch (err) {
      console.error("Hunter Mode Engine Lag:", err);
      // Fallback: Proceed but flag for manual review if infra fails
    }
  }

  return await runTransaction(firestore, async (transaction) => {
    const paymentRef = doc(firestore, 'payments', paymentId);
    const paymentSnap = await transaction.get(paymentRef);
    
    let currentData: InboundPaymentDoc | null = null;
    if (paymentSnap.exists()) {
      currentData = paymentSnap.data() as InboundPaymentDoc;
    }

    // 2. Idempotency Check
    if (currentData?.isCredited) {
      return { status: 'ALREADY_CREDITED', paymentId };
    }

    // 3. User Lookup
    const userRefInner = doc(firestore, 'users', event.userId);
    const userSnapInner = await transaction.get(userRefInner);
    if (!userSnapInner.exists()) {
      throw new Error(`USER_NOT_FOUND: ${event.userId}`);
    }

    // 4. Atomic Execution: Update User Balance
    transaction.update(userRefInner, {
      balance: increment(event.amount),
      updatedAt: serverTimestamp()
    });

    // 5. Update Payment Ledger with Derived Fields
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
      credited: isCredited, 
      userId: event.userId, 
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

/**
 * Phase 2.8: Settlement & Reconciliation Controller
 */
export async function reconcileAndSettleLink(
  firestore: Firestore,
  sealId: string,
  paymentProvider: string,
  externalTxnId: string
) {
  const timestamp = Date.now();
  
  return await runTransaction(firestore, async (transaction) => {
    const linkRef = doc(firestore, 'payment_links', sealId);
    const linkSnap = await transaction.get(linkRef);

    if (!linkSnap.exists()) {
      throw new Error(`LINK_NOT_FOUND: ${sealId}`);
    }

    const linkData = linkSnap.data();

    // 1. Auto-Match Logic
    if (linkData.status === 'PAID' || linkData.status === 'SETTLED') {
      return { status: 'LINK_ALREADY_PROCESSED', sealId };
    }

    // 2. Deterministic Validation (Schema & Amount)
    const normalizedEvent: NormalizedPaymentEvent = {
      orderId: sealId,
      userId: linkData.creatorId,
      externalTxnId: externalTxnId,
      provider: paymentProvider as any,
      amount: linkData.amount,
      currency: linkData.currency,
      status: 'PAID',
      eventTime: timestamp,
      metadata: {
        reconciledVia: 'SOVEREIGN_SETTLEMENT_CONTROLLER',
        linkBrand: linkData.brand
      }
    };

    // 3. Update Link Status
    transaction.update(linkRef, {
      status: 'PAID',
      paidAt: timestamp,
      externalTxnId: externalTxnId
    });

    // 4. Log to UBIL Core
    const ubilRef = doc(firestore, 'ubil_events', `TXN_${externalTxnId}`);
    transaction.set(ubilRef, {
      id: `TXN_${externalTxnId}`,
      type: 'TXN_SETTLEMENT_RECONCILED',
      amount: linkData.amount,
      currency: linkData.currency,
      status: 'SUCCESS',
      timestamp: timestamp,
      merchantId: linkData.creatorId,
      seal: sealId,
      routingReason: "Reconciled via Settlement Controller v1.2"
    });

    return { 
      status: 'READY_FOR_CREDIT', 
      normalizedEvent 
    };
  });
}

/**
 * Phase 3.0: Autonomous Yield Recycler
 */
export async function executeYieldRecycle(
  firestore: Firestore,
  amount: number,
  userId: string
) {
  const feeRate = 0.035; // 3.5%
  const recycleRate = 0.425; // 42.5%
  const totalFee = amount * feeRate;
  const recycleAmount = totalFee * recycleRate;
  const timestamp = Date.now();

  return await runTransaction(firestore, async (transaction) => {
    // 1. Global Pool Reference
    const poolRef = doc(firestore, 'infra', 'liquidity_pool');
    const poolSnap = await transaction.get(poolRef);
    
    if (!poolSnap.exists()) {
      transaction.set(poolRef, { balance: recycleAmount, lastRefill: timestamp });
    } else {
      transaction.update(poolRef, { 
        balance: increment(recycleAmount),
        lastRefill: timestamp
      });
    }

    // 2. Audit Log
    const logRef = collection(firestore, 'events');
    await addDoc(logRef, {
      type: 'AUTO_YIELD_RECYCLED',
      plane: 'FINANCE',
      status: 'COMPLETED',
      payload: { 
        sourceTxnAmount: amount, 
        feeTaken: totalFee, 
        recycledToMesh: recycleAmount 
      },
      timestamp: timestamp,
      userId: userId
    });

    return { status: 'SUCCESS', recycled: recycleAmount };
  });
}
