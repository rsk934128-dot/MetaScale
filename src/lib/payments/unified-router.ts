
import { PaymentProvider, NormalizedPaymentEvent } from './types';
import { normalizeBinanceEvent } from './binance-pay';

/**
 * Provider-agnostic Gateway Router
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
      };
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}

export function redactSensitiveData(payload: any): any {
  const redacted = { ...payload };
  const keysToRedact = ['signature', 'authorization', 'client_secret', 'token', 'cvv'];
  
  keysToRedact.forEach(key => {
    if (key in redacted) redacted[key] = '[REDACTED]';
  });
  
  return redacted;
}
