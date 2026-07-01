
'use server';

import { Firestore, doc, setDoc } from 'firebase/firestore';
import { reconcileAndSettleLink } from '@/services/payment-service';

/**
 * @fileOverview Universal Bridge: Inbound Gateway.
 * Processes incoming payment requests from external third-party apps.
 * Follows ISO 20022 compliant message structure.
 */

export interface InboundBridgePayload {
  sourceAppId: string;
  signature: string;
  amount: number;
  currency: string;
  paymentSeal?: string; // If provided, maps to an existing link
  externalTxnId: string;
  timestamp: number;
}

export async function processInboundBridge(
  firestore: Firestore,
  payload: InboundBridgePayload
) {
  const timestamp = Date.now();
  const bridgeSeal = `BRIDGE_IN_${payload.externalTxnId}`;

  // 1. Verify Signature (Mocked for Prototype)
  const isValid = payload.signature.length > 10;
  if (!isValid) throw new Error("UNAUTHORIZED_BRIDGE_SIGNATURE");

  // 2. Check for Seal Matching
  if (payload.paymentSeal) {
    return await reconcileAndSettleLink(
      firestore,
      payload.paymentSeal,
      `BRIDGE_${payload.sourceAppId}`,
      payload.externalTxnId
    );
  }

  // 3. Generic Inbound Signal (No specific link)
  const ubilRef = doc(firestore, 'ubil_events', bridgeSeal);
  await setDoc(ubilRef, {
    id: bridgeSeal,
    type: 'BRIDGE_INBOUND_SIGNAL',
    status: 'RECEIVED',
    amount: payload.amount,
    currency: payload.currency,
    timestamp: timestamp,
    source: payload.sourceAppId,
    routingReason: `Inbound bridge pulse from ${payload.sourceAppId}`
  });

  return { status: 'SIGNAL_LOGGED', bridgeSeal };
}
