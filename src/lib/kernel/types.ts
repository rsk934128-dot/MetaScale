
export type SystemMode = 'NORMAL' | 'EMERGENCY' | 'LOCKDOWN' | 'RECOVERY';

export type PlaneType = 'CIVIC' | 'FINANCE' | 'SECURITY' | 'INFRA';

export type EventStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED' | 'ROLLED_BACK';

export interface SovereignEvent {
  id: string;
  plane: PlaneType;
  type: string;
  priority: number; // 1 (Highest) - 10 (Lowest)
  timestamp: number;
  payload: any;
  status: EventStatus;
  message?: string;
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
 * Extended Finance Event Types
 */
export type FinanceEventType = 
  | 'PAYOUT_INITIATED' 
  | 'PAYOUT_EXECUTED' 
  | 'PAYOUT_FAILED' 
  | 'TREASURY_SYNC' 
  | 'KYB_UPDATE';
