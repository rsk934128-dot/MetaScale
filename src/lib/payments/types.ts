
export type PaymentProvider = 'STRIPE' | 'BKASH' | 'BINANCE_PAY';

export type PaymentStatus = 
  | 'CREATED' 
  | 'USER_PAYING' 
  | 'PAID'      // Webhook verified
  | 'CREDITED'  // User balance updated
  | 'SETTLED'   // Funds moved to final treasury
  | 'FAILED' 
  | 'EXPIRED';

export interface NormalizedPaymentEvent {
  orderId: string;
  userId: string;
  externalTxnId: string; // The primary ID from the provider
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  eventTime: number;
  providerEventId?: string; // Unique ID for the webhook delivery itself
  metadata?: Record<string, any>;
}

export interface InboundPaymentDoc {
  id: string;
  orderId: string;
  userId: string;
  externalTxnId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
  creditedAt?: number;
  settledAt?: number;
  isCredited: boolean; // Exactly-once guard
  metadata: Record<string, any>;
}

export interface WebhookResponse {
  received: boolean;
  status: number;
  error?: string;
}
