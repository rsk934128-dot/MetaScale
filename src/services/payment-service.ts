import { 
  Firestore, 
  doc, 
  runTransaction, 
  serverTimestamp, 
  increment,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { NormalizedPaymentEvent, InboundPaymentDoc, PaymentStatus, SettlementBucket } from '@/lib/payments/types';
import { runPredictiveAnalysis } from '@/ai/flows/predictive-anomaly-analysis';
import { sendFinancialAlert, sendSecurityAlert } from '@/lib/telegram';

/**
 * Core Domain Service: Atomic Payment Credit Logic
 * Updated v2.2: Added Mesh Account Verification & Secure QR Settlement.
 */

/**
 * Verifies if a scanned address or ID belongs to an authorized mesh citizen.
 */
export async function verifyMeshAccount(firestore: Firestore, identifier: string) {
  // Check if identifier is a UID or Kernel ID
  const usersRef = collection(firestore, 'users');
  let userSnap;

  // Try fetching by UID first
  const docRef = doc(firestore, 'users', identifier);
  userSnap = await getDoc(docRef);

  if (!userSnap.exists()) {
    // Try fetching by Kernel ID
    const q = query(usersRef, where('kernelId', '==', identifier), limit(1));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      userSnap = querySnap.docs[0];
    }
  }

  if (userSnap && userSnap.exists()) {
    const data = userSnap.data();
    return {
      success: true,
      uid: userSnap.id,
      displayName: data.displayName,
      kernelId: data.kernelId,
      trustScore: data.trustScore,
      verificationStatus: data.verificationStatus,
      photoURL: data.photoURL || null
    };
  }

  return { success: false, message: "UNAUTHORIZED_NODE_ADDRESS" };
}

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
    return { status: 'REJECTED_LOCKDOWN_ACTIVE', seal: sealHash };
  }

  // 1. Handshake Integrity Check
  const userRef = doc(firestore, 'users', event.userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (!userData?.telegramLinked && trigger !== 'SIMULATION') {
    await updateDoc(userRef, { verificationStatus: 'FLAGGED', trustScore: 0 });
    return { status: 'REJECTED_HANDSHAKE_REQUIRED', seal: sealHash };
  }

  // 2. Hunter Mode Check
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
        networkMetadata: { latency: 8.4 }
      });

      if (riskCheck.riskScore > 80) {
        await updateDoc(userRef, { verificationStatus: 'FLAGGED', trustScore: 30 });
        if (userData.telegramChatId) {
          await sendSecurityAlert(userData.telegramChatId, 'PREDICTIVE_BLOCK', {
            userId: event.userId,
            reason: riskCheck.reasoning,
            seal: sealHash
          });
        }
        return { status: 'BLOCKED_BY_GOVERNANCE', reason: riskCheck.reasoning, seal: sealHash };
      }
    } catch (err) {
      console.error("Hunter Mode Timeout:", err);
    }
  }

  const result = await runTransaction(firestore, async (transaction) => {
    const paymentRef = doc(firestore, 'payments', paymentId);
    const paymentSnap = await transaction.get(paymentRef);
    
    if (paymentSnap.exists() && paymentSnap.data().isCredited) {
      return { status: 'ALREADY_CREDITED', seal: paymentSnap.data().creditOperationId };
    }

    transaction.update(userRef, {
      balance: increment(event.amount),
      updatedAt: serverTimestamp(),
      lastSeal: sealHash
    });

    const historyEntry = {
      status: 'CREDITED' as PaymentStatus,
      timestamp: timestamp,
      trigger: trigger,
      reason: 'Automated settlement credit via Sovereign Kernel',
    };

    const update: Partial<InboundPaymentDoc> = {
      ...event,
      status: 'CREDITED',
      updatedAt: timestamp,
      creditedAt: timestamp,
      isCredited: true,
      credited: true, 
      creditOperationId: sealHash,
      reconciliationStatus: 'MATCHED',
      id: paymentId,
      statusHistory: [historyEntry],
      replayCount: 0,
      manualReviewRequired: false,
      settlementBucket: 'DONE'
    };

    transaction.set(paymentRef, { ...update, createdAt: timestamp }, { merge: true });

    return { status: 'SUCCESS_CREDITED', paymentId, seal: sealHash };
  });

  // Notify Telegram on Finality
  if (result.status === 'SUCCESS_CREDITED' && trigger !== 'SIMULATION' && userData?.telegramChatId) {
    await sendFinancialAlert(userData.telegramChatId, 'SETTLEMENT_FINALIZED', {
      amount: event.amount,
      currency: event.currency,
      provider: event.provider,
      seal: sealHash
    });
  }

  return result;
}

export async function reconcileAndSettleLink(
  firestore: Firestore,
  sealId: string,
  paymentProvider: string,
  externalTxnId: string
) {
  const timestamp = Date.now();
  const auditSeal = `AUDIT_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  return await runTransaction(firestore, async (transaction) => {
    const linkRef = doc(firestore, 'payment_links', sealId);
    const linkSnap = await transaction.get(linkRef);

    if (!linkSnap.exists()) throw new Error(`LINK_NOT_FOUND: ${sealId}`);
    const linkData = linkSnap.data();

    if (linkData.status === 'PAID') return { status: 'LINK_ALREADY_PROCESSED', sealId };

    const normalizedEvent: NormalizedPaymentEvent = {
      orderId: sealId,
      userId: linkData.creatorId,
      externalTxnId: externalTxnId,
      provider: paymentProvider as any,
      amount: linkData.amount,
      currency: linkData.currency,
      status: 'PAID',
      eventTime: timestamp
    };

    transaction.update(linkRef, {
      status: 'PAID',
      paidAt: timestamp,
      externalTxnId: externalTxnId,
      auditSeal: auditSeal
    });

    const ubilRef = doc(firestore, 'ubil_events', sealId);
    transaction.set(ubilRef, {
      id: sealId,
      type: 'TXN_SETTLEMENT_RECONCILED',
      amount: linkData.amount,
      currency: linkData.currency,
      status: 'SUCCESS',
      timestamp: timestamp,
      merchantId: linkData.creatorId,
      auditSeal: auditSeal,
      routingReason: "Settled via Link Architect"
    });

    return { status: 'READY_FOR_CREDIT', normalizedEvent };
  });
}

export async function simulateStressTest(firestore: Firestore, userId: string, count: number = 10) {
  const results = [];
  for (let i = 0; i < count; i++) {
    const mockEvent: NormalizedPaymentEvent = {
      orderId: `STRESS_${i}`,
      userId: userId,
      externalTxnId: `SIM_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      provider: 'STRIPE', 
      amount: Math.floor(Math.random() * 100) + 1,
      currency: 'USD',
      status: 'PAID',
      eventTime: Date.now()
    };
    results.push(processPaymentCredit(firestore, mockEvent, 'SIMULATION'));
  }
  const finalResults = await Promise.all(results);
  const successCount = finalResults.filter(r => r.status === 'SUCCESS_CREDITED').length;
  return { total: count, success: successCount, integrity: successCount === count ? 'VERIFIED' : 'FAILED' };
}
