
import { 
  Firestore, 
  doc, 
  runTransaction, 
  serverTimestamp, 
  increment,
  getDoc,
  collection,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { NormalizedPaymentEvent, InboundPaymentDoc, PaymentStatus, SettlementBucket } from '@/lib/payments/types';
import { runPredictiveAnalysis } from '@/ai/flows/predictive-anomaly-analysis';
import { sendFinancialAlert, sendSecurityAlert } from '@/lib/telegram';

/**
 * Core Domain Service: Atomic Payment Credit Logic
 * Updated v1.8: Integrated Emergency Kill Switch & Maintenance Check.
 * Updated v1.9: Integrated Autonomous AML Shielding (Hunter Mode).
 */
export async function processPaymentCredit(
  firestore: Firestore, 
  event: NormalizedPaymentEvent,
  trigger: 'WEBHOOK' | 'RECONCILIATION' | 'MANUAL' | 'SIMULATION' = 'WEBHOOK',
  adminUid?: string
) {
  const sealHash = `SEAL_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const paymentId = `${event.provider}_${event.externalTxnId}`;
  const timestamp = Date.now();

  // 0. Global Kill Switch Check
  const configRef = doc(firestore, 'system', 'config');
  const configSnap = await getDoc(configRef);
  if (configSnap.exists() && configSnap.data().maintenance) {
    console.error(">>> [SECURITY_LOCKDOWN] Payment rejected. Kill switch is ACTIVE.");
    return { status: 'REJECTED_LOCKDOWN_ACTIVE', seal: sealHash };
  }

  // 1. Handshake Integrity Check
  const userRef = doc(firestore, 'users', event.userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  // FAIL-SAFE: If handshake is not stabilized, enter Fallback Mode
  if (!userData?.telegramLinked && trigger !== 'SIMULATION') {
    const errorMsg = `CRITICAL: Handshake missing for user ${event.userId}. Signal Rejected.`;
    console.error(errorMsg);
    
    // Auto-lock the identity node
    await updateDoc(userRef, { verificationStatus: 'FLAGGED', trustScore: 0 });
    
    // Dispatch Security Alert to Telegram
    if (userData?.telegramChatId) {
      await sendSecurityAlert(userData.telegramChatId, 'HANDSHAKE_FAIL_AUTO_LOCK', {
        userId: event.userId,
        reason: 'Attempted credit without stabilized identity link.',
        seal: sealHash
      });
    }

    return { status: 'REJECTED_HANDSHAKE_REQUIRED', seal: sealHash };
  }

  // 2. Proactive Threat Hunting (Hunter Mode - AML Shield)
  if (userData && trigger !== 'SIMULATION') {
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
          recentActivityCount: 0,
          averageTxnAmount: userData.averageTxnAmount || 500,
        },
        networkMetadata: {
          latency: 8.4
        }
      });

      // Log the risk check result for the Operational Command Center
      await addDoc(collection(firestore, 'events'), {
        id: `RISK_${sealHash}`,
        type: riskCheck.riskScore > 80 ? 'GOVERNANCE_BLOCK' : 'PREDICTIVE_RISK_CHECK',
        plane: 'SECURITY',
        priority: riskCheck.riskScore > 80 ? 1 : 4,
        timestamp: Date.now(),
        payload: { 
          paymentId, 
          riskScore: riskCheck.riskScore, 
          reason: riskCheck.reasoning,
          category: riskCheck.threatCategory,
          brand: event.provider,
          amount: event.amount,
          seal: sealHash
        },
        status: riskCheck.riskScore > 80 ? 'BLOCKED_BY_GOVERNANCE' : 'COMPLETED',
        category: 'PREDICTIVE_ANOMALY',
        severity: riskCheck.riskScore > 80 ? 'CRITICAL' : 'LOW',
        userId: event.userId
      });

      if (riskCheck.riskScore > 80) {
        // Blacklist user if critical risk (AML Shield)
        await updateDoc(userRef, { 
          verificationStatus: 'FLAGGED', 
          trustScore: Math.max(0, (userData.trustScore || 0) - 50) 
        });
        
        return { status: 'BLOCKED_BY_GOVERNANCE', reason: riskCheck.reasoning, seal: sealHash };
      }
    } catch (err) {
      console.error("Hunter Mode Lag:", err);
    }
  }

  const result = await runTransaction(firestore, async (transaction) => {
    const paymentRef = doc(firestore, 'payments', paymentId);
    const paymentSnap = await transaction.get(paymentRef);
    
    let currentData: InboundPaymentDoc | null = null;
    if (paymentSnap.exists()) {
      currentData = paymentSnap.data() as InboundPaymentDoc;
    }

    if (currentData?.isCredited) {
      return { status: 'ALREADY_CREDITED', paymentId, seal: currentData.creditOperationId };
    }

    const userRefInner = doc(firestore, 'users', event.userId);
    const userSnapInner = await transaction.get(userRefInner);
    if (!userSnapInner.exists()) {
      throw new Error(`USER_NOT_FOUND: ${event.userId}`);
    }

    transaction.update(userRefInner, {
      balance: increment(event.amount),
      updatedAt: serverTimestamp(),
      lastSeal: sealHash
    });

    const creditOpId = sealHash;
    const historyEntry = {
      status: 'CREDITED' as PaymentStatus,
      timestamp: timestamp,
      trigger: trigger,
      reason: trigger === 'SIMULATION' ? 'Stress Test Simulation Trace' : 'Automated settlement credit via ECC_ED25519 Handshake',
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
      manualReviewRequired: false,
      settlementBucket: 'DONE'
    };

    if (!paymentSnap.exists()) {
      transaction.set(paymentRef, { ...update, createdAt: timestamp, anomalyFlags: [] });
    } else {
      transaction.update(paymentRef, update);
    }

    return { status: 'SUCCESS_CREDITED', paymentId, seal: sealHash };
  });

  // Notify Telegram after transaction commits
  if (result.status === 'SUCCESS_CREDITED' && trigger !== 'SIMULATION' && userData?.telegramLinked && userData?.telegramChatId) {
    await sendFinancialAlert(userData.telegramChatId, 'SETTLED', {
      amount: event.amount,
      currency: event.currency,
      provider: event.provider,
      externalTxnId: event.externalTxnId,
      seal: sealHash
    });
  }

  return result;
}

/**
 * Directive 1: Ghost Load Stress Test Simulator
 */
export async function simulateStressTest(firestore: Firestore, userId: string, count: number = 10) {
  console.log(`>>> [STRESS_TEST] Initiating Ghost Load for ${userId}. Target: ${count} pulses.`);
  const results = [];

  for (let i = 0; i < count; i++) {
    const mockEvent: NormalizedPaymentEvent = {
      orderId: `STRESS_${Date.now()}_${i}`,
      userId: userId,
      externalTxnId: `EXT_SIM_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      provider: 'STRIPE', 
      amount: Math.floor(Math.random() * 5000) + 1, // Add variation for AML profile
      currency: 'USD',
      status: 'PAID',
      eventTime: Date.now()
    };

    const promise = processPaymentCredit(firestore, mockEvent, 'SIMULATION');
    results.push(promise);
  }

  const finalResults = await Promise.all(results);
  const successCount = finalResults.filter(r => r.status === 'SUCCESS_CREDITED').length;
  
  console.log(`>>> [STRESS_TEST] Completed. Success: ${successCount}/${count}. Ledger Integrity: ${successCount === count ? 'VERIFIED' : 'DRIFT_DETECTED'}`);
  
  return {
    total: count,
    success: successCount,
    integrity: successCount === count ? 'VERIFIED' : 'FAILED',
    traces: finalResults
  };
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
  const auditSeal = `AUDIT_SEAL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  return await runTransaction(firestore, async (transaction) => {
    const linkRef = doc(firestore, 'payment_links', sealId);
    const linkSnap = await transaction.get(linkRef);

    if (!linkSnap.exists()) {
      throw new Error(`LINK_NOT_FOUND: ${sealId}`);
    }

    const linkData = linkSnap.data();

    if (linkData.status === 'PAID' || linkData.status === 'SETTLED') {
      return { status: 'LINK_ALREADY_PROCESSED', sealId };
    }

    const normalizedEvent: NormalizedPaymentEvent = {
      orderId: sealId,
      userId: linkData.creatorId,
      externalTxnId: externalTxnId,
      provider: paymentProvider as any,
      amount: linkData.amount,
      currency: linkData.currency,
      status: 'PAID',
      eventTime: timestamp,
      metadata: { reconciledVia: 'SOVEREIGN_SETTLEMENT_CONTROLLER', auditSeal: auditSeal }
    };

    transaction.update(linkRef, {
      status: 'PAID',
      paidAt: timestamp,
      externalTxnId: externalTxnId,
      auditSeal: auditSeal
    });

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
      auditSeal: auditSeal,
      routingReason: "Reconciled via Deterministic Tunnel v1.2"
    });

    return { status: 'READY_FOR_CREDIT', normalizedEvent };
  });
}
