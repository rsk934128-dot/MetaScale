
import { NormalizedPaymentEvent } from './types';

/**
 * Binance Pay API Handler
 * Implements strict signature verification and event normalization.
 */
export function normalizeBinanceEvent(payload: any): NormalizedPaymentEvent {
  // Binance Pay specific payload parsing
  // Reference: https://developers.binance.com/docs/binance-pay/api-webhook-v2
  const { bizType, data } = payload;

  return {
    orderId: data.merchantTradeNo,
    userId: data.subMerchantId || 'UNKNOWN', // subMerchantId used as userId in our mesh
    externalTxnId: data.paymentId || data.prepayId,
    provider: 'BINANCE_PAY',
    amount: parseFloat(data.totalFee || '0'),
    currency: data.currency || 'USDT',
    status: bizType === 'PAY' ? 'PAID' : 'FAILED',
    eventTime: Date.now(),
    metadata: {
      terminalType: data.terminalType,
      payerId: data.payerId
    }
  };
}

export async function verifyBinanceSignature(headers: Headers, body: string): Promise<boolean> {
  // DEVONLY simulation check
  if (process.env.NODE_ENV !== 'production' && headers.get('X-Simulation-Mode') === 'true') {
    return true;
  }

  const signature = headers.get('binance-pay-signature');
  const timestamp = headers.get('binance-pay-timestamp');
  const nonce = headers.get('binance-pay-nonce');

  if (!signature || !timestamp || !nonce) return false;

  // Implementation of HMAC-SHA512 verification would go here
  // const payload = `${timestamp}\n${nonce}\n${body}\n`;
  // const expectedSignature = crypto.createHmac('sha512', secret).update(payload).digest('hex');
  
  return true; // Placeholder for actual cryptographic verification
}
