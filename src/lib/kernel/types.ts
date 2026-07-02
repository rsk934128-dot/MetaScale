
export type SystemMode = 'NORMAL' | 'EMERGENCY' | 'LOCKDOWN' | 'RECOVERY';

export type PlaneType = 'CIVIC' | 'FINANCE' | 'SECURITY' | 'INFRA' | 'OPERATIONS';

export type EventStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED' | 'ROLLED_BACK' | 'BLOCKED_BY_GOVERNANCE';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentCategory = 
  | 'STUCK_PAYMENT' 
  | 'DUPLICATE_CREDIT' 
  | 'WEBHOOK_FAILURE' 
  | 'AMOUNT_MISMATCH' 
  | 'INFRA_FAILURE'
  | 'ADMIN_ABUSE'
  | 'LATENCY_SPIKE'
  | 'METRIC_THRESHOLD_EXCEEDED'
  | 'HEARTBEAT_FAILURE'
  | 'LIQUIDITY_DRIFT'
  | 'YIELD_RECYCLE_FAIL'
  | 'AGENT_DIRECTIVE_BLOCK'
  | 'BUDGET_OVERRUN'
  | 'GOVERNANCE_VIOLATION'
  | 'POLICY_ENFORCEMENT'
  | 'BRIDGE_BREACH'
  | 'SYNC_DRIFT'
  | 'PREDICTIVE_ANOMALY';

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
  userId?: string;
}

export interface PlaneState {
  status: 'OPTIMAL' | 'DEGRADED' | 'ISOLATED';
  load: number;
  latency: number;
  lastSync: number;
}

/**
 * Sovereign OS Boot & Service Types
 */
export type ServiceStatus = 'OFFLINE' | 'INITIALIZING' | 'ONLINE' | 'FAILED';

export interface BootStatus {
  ready: boolean;
  services: Record<string, ServiceStatus>;
  lastUpdate: number;
}

export interface KernelState {
  mode: SystemMode;
  events: SovereignEvent[];
  planes: Record<PlaneType, PlaneState>;
  uptime: number;
  boot: BootStatus;
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

export interface HeartbeatStatus {
  nodeId: string;
  latency: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastCheck: number;
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
  | 'VIRTUAL_CARD_ISSUED'
  | 'LIQUIDITY_SHIFT_EXECUTED'
  | 'AUTO_YIELD_RECYCLED'
  | 'AGENT_DIRECTIVE_SYNCED'
  | 'GOVERNANCE_BLOCK'
  | 'BRIDGE_INBOUND_RECEIVED'
  | 'BRIDGE_OUTBOUND_DISPATCHED'
  | 'BRIDGE_SYNC_STABILIZED'
  | 'PREDICTIVE_RISK_CHECK';
