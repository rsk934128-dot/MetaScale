
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
import { sendFinancialAlert } from '@/lib/telegram';

/**
 * Core Domain Service: Atomic Payment Credit Logic
 * Updated v1.4: Integrated Telegram Settlement Notifications.
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
          recentActivityCount: 0,
          averageTxnAmount: 500,
        },
        networkMetadata: {
          latency: 8.4
        }
      });

      if (riskCheck.riskScore > 80) {
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

        return { status: 'BLOCKED_BY_GOVERNANCE', reason: riskCheck.reasoning };
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
      return { status: 'ALREADY_CREDITED', paymentId };
    }

    const userRefInner = doc(firestore, 'users', event.userId);
    const userSnapInner = await transaction.get(userRefInner);
    if (!userSnapInner.exists()) {
      throw new Error(`USER_NOT_FOUND: ${event.userId}`);
    }

    transaction.update(userRefInner, {
      balance: increment(event.amount),
      updatedAt: serverTimestamp()
    });

    const creditOpId = `${trigger.toLowerCase()}_${timestamp}_${event.externalTxnId.slice(-6)}`;
    const historyEntry = {
      status: 'CREDITED' as PaymentStatus,
      timestamp: timestamp,
      trigger: trigger,
      reason: 'Automated settlement credit',
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

    return { status: 'SUCCESS_CREDITED', paymentId };
  });

  // Notify Telegram after transaction commits
  if (result.status === 'SUCCESS_CREDITED' && userData?.telegramLinked && userData?.telegramChatId) {
    await sendFinancialAlert(userData.telegramChatId, 'SETTLED', {
      amount: event.amount,
      currency: event.currency,
      provider: event.provider,
      externalTxnId: event.externalTxnId,
      seal: event.orderId
    });
  }

  return result;
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
      metadata: { reconciledVia: 'SOVEREIGN_SETTLEMENT_CONTROLLER' }
    };

    transaction.update(linkRef, {
      status: 'PAID',
      paidAt: timestamp,
      externalTxnId: externalTxnId
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
      routingReason: "Reconciled via Settlement Controller v1.2"
    });

    return { status: 'READY_FOR_CREDIT', normalizedEvent };
  });
}
