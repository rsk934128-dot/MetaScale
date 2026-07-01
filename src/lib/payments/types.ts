
export type PaymentProvider = 'STRIPE' | 'BKASH' | 'BINANCE_PAY';

export type PaymentStatus = 
  | 'CREATED' 
  | 'USER_PAYING' 
  | 'PAID'      // Webhook verified provider status
  | 'CREDITED'  // Internal side-effect (wallet update) completed
  | 'SETTLED'   // Final reconciliation done
  | 'FAILED' 
  | 'EXPIRED';

export interface NormalizedPaymentEvent {
  orderId: string;
  userId: string;
  externalTxnId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  eventTime: number;
  providerEventId?: string; // Unique ID from provider for this specific delivery
  metadata?: Record<string, any>;
}

export interface InboundPaymentDoc {
  id: string; // provider + externalTxnId
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
  isCredited: boolean; // Exactly-once side-effect guard
  creditOperationId?: string; // Link to the specific credit event
  metadata: Record<string, any>;
  anomalyFlag?: boolean;
}

export interface WebhookResponse {
  received: boolean;
  status: number;
  error?: string;
}
