
import { PaymentProvider, NormalizedPaymentEvent } from './types';
import { normalizeBinanceEvent } from './binance-pay';

/**
 * Provider-agnostic Gateway Router with Deterministic Redaction
 */
export function normalizeEvent(provider: PaymentProvider, payload: any): NormalizedPaymentEvent {
  switch (provider) {
    case 'BINANCE_PAY':
      return normalizeBinanceEvent(payload);
    case 'STRIPE':
      return {
        orderId: payload.data?.object?.metadata?.orderId || payload.id,
        userId: payload.data?.object?.metadata?.userId || 'UNKNOWN',
        externalTxnId: payload.id,
        provider: 'STRIPE',
        amount: (payload.data?.object?.amount || 0) / 100,
        currency: payload.data?.object?.currency?.toUpperCase() || 'USD',
        status: payload.type === 'payment_intent.succeeded' ? 'PAID' : 'FAILED',
        eventTime: Date.now(),
        providerEventId: payload.id, // Stripe event ID
        metadata: { type: payload.type }
      };
    case 'BKASH':
      return {
        orderId: payload.merchantInvoiceNumber || payload.paymentID,
        userId: payload.userId || 'UNKNOWN',
        externalTxnId: payload.trxID,
        provider: 'BKASH',
        amount: parseFloat(payload.amount || '0'),
        currency: 'BDT',
        status: payload.transactionStatus === 'Completed' ? 'PAID' : 'FAILED',
        eventTime: Date.now(),
        providerEventId: payload.trxID,
        metadata: { paymentID: payload.paymentID }
      };
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}

/**
 * Deterministic Redaction Policy
 * Ensures PII and Secrets are never stored in the ledger subcollections.
 */
export function redactSensitiveData(payload: any): any {
  if (!payload || typeof payload !== 'object') return payload;
  
  const redacted = { ...payload };
  const sensitiveKeys = [
    'signature', 'authorization', 'client_secret', 'token', 'cvv', 
    'password', 'email', 'mobile', 'phone', 'payerEmail', 'payerMobile'
  ];
  
  Object.keys(redacted).forEach(key => {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  });
  
  return redacted;
}
