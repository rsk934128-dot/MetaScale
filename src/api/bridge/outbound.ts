
'use server';

import { Firestore, doc, setDoc } from 'firebase/firestore';
import { orchestratePayout } from '@/ai/flows/payout-orchestrator';

/**
 * @fileOverview Universal Bridge: Outbound Dispatcher.
 * Handles requests to send money from Sovereign OS to external apps/wallets.
 */

export interface OutboundBridgeRequest {
  targetRail: 'BKASH' | 'NAGAD' | 'SWIFT' | 'PAYPAL' | 'TON';
  recipient: string;
  amount: number;
  currency: string;
  memo?: string;
  requesterId: string;
}

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

  // 2. Trigger Orchestrator
  const result = await orchestratePayout({
    gateway,
    recipientInfo: request.recipient,
    amount: request.amount,
    currency: request.currency,
    memo: request.memo
  });

  // 3. Log to UBIL Core
  const ubilRef = doc(firestore, 'ubil_events', dispatchId);
  await setDoc(ubilRef, {
    id: dispatchId,
    type: 'BRIDGE_OUTBOUND_DISPATCHED',
    status: result.status,
    amount: request.amount,
    currency: request.currency,
    timestamp: timestamp,
    target: request.targetRail,
    txHash: result.txHash,
    routingReason: `Outbound bridge dispatch via ${request.targetRail}`
  });

  return { status: result.status, txHash: result.txHash, dispatchId };
}
