
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

/**
 * Phase 2.7: Optimized Query Buckets
 */
export type SettlementBucket = 'DONE' | 'READY_FOR_REPLAY' | 'WAITING_BACKOFF' | 'FATAL' | 'PENDING_PROVIDER';

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
  
  // Phase 2.6: Self-healing fields
  replayCount: number;
  lastReplayAttemptAt?: number;
  nextReplayAttemptAt?: number;
  lastError?: string;
  
  // Phase 2.7: Derived Query Fields (Index Helpers)
  credited: boolean; // Helper for (!isCredited) queries
  manualReviewRequired: boolean; // Flag for admin focus
  settlementBucket: SettlementBucket; // High-performance query bucket
  primaryAnomaly?: AnomalyFlag;

  statusHistory: {
    status: PaymentStatus;
    timestamp: number;
    reason?: string;
    trigger?: 'WEBHOOK' | 'RECONCILIATION' | 'MANUAL';
    replayedBy?: string;
  }[];
}
