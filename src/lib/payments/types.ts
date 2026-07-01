
export type PaymentProvider = 'STRIPE' | 'BKASH' | 'BINANCE_PAY';

export type PaymentStatus = 'CREATED' | 'USER_PAYING' | 'PAID' | 'CREDITED' | 'FAILED' | 'EXPIRED';

export interface NormalizedPaymentEvent {
  orderId: string;
  userId: string;
  externalTxnId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  eventTime: number;
  metadata?: Record<string, any>;
}

export interface WebhookResponse {
  received: boolean;
  status: number;
  error?: string;
}
