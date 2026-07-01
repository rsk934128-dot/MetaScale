
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

export type ReconciliationStatus = 'NOT_REQUIRED' | 'PENDING' | 'MATCHED' | 'MISMATCHED';

export type AnomalyFlag = 
  | 'PAIDNOTCREDITED' 
  | 'STALE_CREATED' 
  | 'MISMATCH_AMOUNT' 
  | 'MISMATCH_CURRENCY' 
  | 'DUPLICATEEXTERNALTXN' 
  | 'INVALID_TRANSITION' 
  | 'SIGNATUREFAILUREREVIEW';

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

export interface InboundPaymentDoc extends NormalizedPaymentEvent {
  id: string; // provider + externalTxnId
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
  creditedAt?: number;
  settledAt?: number;
  isCredited: boolean;
  creditOperationId?: string;
  reconciliationStatus: ReconciliationStatus;
  anomalyFlags: AnomalyFlag[];
  statusHistory: {
    status: PaymentStatus;
    timestamp: number;
    reason?: string;
    trigger?: 'WEBHOOK' | 'RECONCILIATION' | 'MANUAL';
    replayedBy?: string;
  }[];
}
