
import { PaymentProvider, NormalizedPaymentEvent } from './types';

/**
 * Provider-agnostic Gateway Router with Deterministic Redaction
 */
export function normalizeEvent(provider: PaymentProvider, payload: any): NormalizedPaymentEvent {
  switch (provider) {
    case 'BINANCE_PAY':
      const bizData = payload.data || {};
      return {
        orderId: bizData.merchantTradeNo || 'UNKNOWN',
        userId: bizData.subMerchantId || 'UNKNOWN',
        externalTxnId: bizData.paymentId || bizData.prepayId || 'UNKNOWN',
        provider: 'BINANCE_PAY',
        amount: parseFloat(bizData.totalFee || '0'),
        currency: bizData.currency || 'USDT',
        status: (payload.bizType === 'PAY' && bizData.status === 'PAID') ? 'PAID' : 'FAILED',
        eventTime: Date.now(),
        providerEventId: payload.bizId,
        metadata: { bizType: payload.bizType }
      };
    case 'STRIPE':
      const stripeObj = payload.data?.object || {};
      return {
        orderId: stripeObj.metadata?.orderId || stripeObj.id,
        userId: stripeObj.metadata?.userId || 'UNKNOWN',
        externalTxnId: stripeObj.id,
        provider: 'STRIPE',
        amount: (stripeObj.amount || 0) / 100,
        currency: stripeObj.currency?.toUpperCase() || 'USD',
        status: payload.type === 'payment_intent.succeeded' ? 'PAID' : 'FAILED',
        eventTime: Date.now(),
        providerEventId: payload.id,
        metadata: { eventType: payload.type }
      };
    case 'BKASH':
      return {
        orderId: payload.merchantInvoiceNumber || payload.paymentID || 'UNKNOWN',
        userId: payload.userId || 'UNKNOWN',
        externalTxnId: payload.trxID || 'UNKNOWN',
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
 */
export function redactSensitiveData(payload: any): any {
  if (!payload || typeof payload !== 'object') return payload;
  
  const redacted = { ...payload };
  const sensitiveKeys = [
    'signature', 'authorization', 'client_secret', 'token', 'cvv', 
    'password', 'email', 'mobile', 'phone', 'payerEmail', 'payerMobile',
    'certificate', 'nonce'
  ];
  
  Object.keys(redacted).forEach(key => {
    const isSensitive = sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()));
    if (isSensitive) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  });
  
  return redacted;
}
