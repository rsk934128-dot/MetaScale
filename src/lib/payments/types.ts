
export type PaymentProvider = 'STRIPE' | 'BKASH' | 'BINANCE_PAY';

export type PaymentStatus = 
  | 'CREATED' 
  | 'USER_PAYING' 
  | 'PAID'      // Webhook verified provider status
  | 'CREDITED'  // Internal side-effect (wallet update) completed
  | 'SETTLED'   // Final reconciliation done
  | 'FAILED' 
  | 'EXPIRED'
  | 'ROLLED_BACK';

export type ReconciliationStatus = 'PENDING' | 'MATCHED' | 'MISMATCHED' | 'INVESTIGATING';

export interface NormalizedPaymentEvent {
  orderId: string;
  userId: string;
  externalTxnId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  eventTime: number;
  providerEventId?: string;
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
  isCredited: boolean;
  creditOperationId?: string;
  reconciliationStatus: ReconciliationStatus;
  anomalyFlags: string[];
  metadata: Record<string, any>;
  statusHistory: {
    status: PaymentStatus;
    timestamp: number;
    reason?: string;
    trigger?: 'WEBHOOK' | 'RECONCILIATION' | 'MANUAL';
  }[];
}
