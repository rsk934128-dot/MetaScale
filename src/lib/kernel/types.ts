
export type SystemMode = 'NORMAL' | 'EMERGENCY' | 'LOCKDOWN' | 'RECOVERY';

export type PlaneType = 'CIVIC' | 'FINANCE' | 'SECURITY' | 'INFRA' | 'OPERATIONS';

export type EventStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED' | 'ROLLED_BACK';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentCategory = 
  | 'STUCK_PAYMENT' 
  | 'DUPLICATE_CREDIT' 
  | 'WEBHOOK_FAILURE' 
  | 'AMOUNT_MISMATCH' 
  | 'INFRA_FAILURE'
  | 'ADMIN_ABUSE'
  | 'LATENCY_SPIKE'
  | 'METRIC_THRESHOLD_EXCEEDED';

export interface SovereignEvent {
  id: string;
  plane: PlaneType;
  type: string;
  priority: number; // 1 (Highest) - 10 (Lowest)
  timestamp: number;
  payload: any;
  status: EventStatus;
  message?: string;
  severity?: IncidentSeverity;
  category?: IncidentCategory;
}

export interface PlaneState {
  status: 'OPTIMAL' | 'DEGRADED' | 'ISOLATED';
  load: number;
  latency: number;
  lastSync: number;
}

export interface KernelState {
  mode: SystemMode;
  events: SovereignEvent[];
  planes: Record<PlaneType, PlaneState>;
  uptime: number;
}

/**
 * Phase 2.9: Operational Metrics & Alerting
 */
export type MetricType = 'COUNTER' | 'GAUGE' | 'HISTOGRAM';

export interface OperationalMetric {
  id: string;
  label: string;
  value: number | string;
  type: MetricType;
  trend?: 'UP' | 'DOWN' | 'NEUTRAL';
  status: 'NORMAL' | 'WARN' | 'CRITICAL';
}

export interface SystemAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: number;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  category: string;
}

/**
 * Extended Finance Event Types for Global Settlement & Reversal
 */
export type FinanceEventType = 
  | 'PAYOUT_INITIATED' 
  | 'PAYOUT_EXECUTED' 
  | 'PAYOUT_FAILED' 
  | 'TREASURY_SYNC' 
  | 'KYB_UPDATE'
  | 'REFUND_INITIATED'
  | 'REVERSAL_COMPLETED'
  | 'TX_HASH_LINKED'
  | 'MARKETPLACE_LINK_GENERATED'
  | 'YIELD_RECYCLE_ADJUSTED'
  | 'BANK_ACCOUNT_LINKED'
  | 'STRATEGY_REPORT_GENERATED'
  | 'VIRTUAL_CARD_ISSUED';
