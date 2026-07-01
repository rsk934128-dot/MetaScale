
'use server';

import { Firestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { orchestratePayout } from '@/ai/flows/payout-orchestrator';
import { sendInteractiveAlert } from '@/lib/telegram';

/**
 * @fileOverview Universal Bridge: Outbound Dispatcher with Multi-Sig Guard.
 * Handles requests to send money from Sovereign OS to external apps/wallets.
 * Implements Threshold-Based Multi-Sig Approval via Telegram.
 */

export interface OutboundBridgeRequest {
  targetRail: 'BKASH' | 'NAGAD' | 'SWIFT' | 'PAYPAL' | 'TON';
  recipient: string;
  amount: number;
  currency: string;
  memo?: string;
  requesterId: string;
}

const HIGH_VALUE_THRESHOLD = 1000;

export async function dispatchOutboundBridge(
  firestore: Firestore,
  request: OutboundBridgeRequest
) {
  const timestamp = Date.now();
  const dispatchId = `BRIDGE_OUT_${timestamp}_${Math.random().toString(36).substr(2, 4)}`;

  // 1. Map Bridge Rails to Payout Orchestrator Gateways
  let gateway: 'PAYPAL' | 'PRIYO_PAY' | 'PAYONEER' | 'TELEGRAM_WALLET' = 'PRIYO_PAY';
  if (request.targetRail === 'TON') gateway = 'TELEGRAM_WALLET';
  if (request.targetRail === 'PAYPAL') gateway = 'PAYPAL';

  // 2. Threshold Check for Multi-Sig Guard
  const isHighValue = request.amount >= HIGH_VALUE_THRESHOLD;
  
  // 3. Trigger Orchestrator
  const result = await orchestratePayout({
    gateway,
    recipientInfo: request.recipient,
    amount: request.amount,
    currency: request.currency,
    memo: request.memo
  });

  // 4. Handle Multi-Sig Workflow if needed
  let finalStatus = result.status;
  if (isHighValue && result.status !== 'FAILED') {
    finalStatus = 'PENDING'; // Force to pending for high value
    
    // Fetch user profile to get Telegram Chat ID
    const userRef = doc(firestore, 'users', request.requesterId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (userData?.telegramLinked && userData?.telegramChatId) {
      console.log(`>>> [MULTI-SIG] Triggering Interactive Guard for ${dispatchId}`);
      await sendInteractiveAlert(
        userData.telegramChatId, 
        dispatchId, 
        `${request.amount} ${request.currency}`
      );
    }
  }

  // 5. Log to UBIL Core Ledger
  const ubilRef = doc(firestore, 'ubil_events', dispatchId);
  await setDoc(ubilRef, {
    id: dispatchId,
    type: 'BRIDGE_OUTBOUND_DISPATCHED',
    status: finalStatus,
    amount: request.amount,
    currency: request.currency,
    timestamp: timestamp,
    target: request.targetRail,
    txHash: result.txHash,
    isHighValue: isHighValue,
    routingReason: isHighValue 
      ? `Awaiting Multi-Sig Authorization (Threshold: $${HIGH_VALUE_THRESHOLD})`
      : `Outbound bridge dispatch via ${request.targetRail}`,
    payload: {
      recipient: request.recipient,
      directiveLevel: result.directiveLevel,
      institutionalMetadata: result.institutionalMetadata
    }
  });

  // 6. Security Audit Log
  const eventRef = doc(firestore, 'events', `AUDIT_${dispatchId}`);
  await setDoc(eventRef, {
    id: `AUDIT_${dispatchId}`,
    plane: 'SECURITY',
    type: isHighValue ? 'MULTI_SIG_TRIGGERED' : 'BRIDGE_OUTBOUND_LOGGED',
    priority: isHighValue ? 1 : 2,
    timestamp: timestamp,
    status: 'COMPLETED',
    payload: { dispatchId, amount: request.amount, isHighValue }
  });

  return { 
    status: finalStatus, 
    txHash: result.txHash, 
    dispatchId,
    requiresManualApproval: isHighValue 
  };
}
