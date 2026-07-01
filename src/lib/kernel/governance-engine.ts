
/**
 * @fileOverview Sovereign Governance Engine (Policy-as-Code).
 * Enforces deterministic guardrails on all agentic and system directives.
 * Updated v1.3: Hunter Mode & Risk-Based Blocking.
 */

import { SovereignEvent, KernelState, PlaneType, SystemMode } from './types';

export interface GovernanceResult {
  allowed: boolean;
  reason?: string;
  remediation?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * Validates a directive against the Sovereign Mesh Policy.
 */
export function validateDirective(event: SovereignEvent, state: { mode: SystemMode, planes: Record<PlaneType, any> }): GovernanceResult {
  // Rule 1: Emergency Lockdown Protocol
  if (state.mode === 'LOCKDOWN' && event.plane !== 'SECURITY') {
    return {
      allowed: false,
      reason: "Kernel is in LOCKDOWN mode. Non-security signals are unauthorized.",
      remediation: "Transition system to RECOVERY or NORMAL mode to resume.",
      severity: 'CRITICAL'
    };
  }

  // Rule 2: Multi-Sig Liquidity Guard (Threshold: $1000)
  if (event.type === 'BRIDGE_OUTBOUND_DISPATCHED' || event.type === 'OUTBOUND_PAYOUT') {
    const amount = event.payload?.amount || 0;
    const multiSigThreshold = 1000;

    if (amount >= multiSigThreshold && !event.payload?.isMultiSigAuthorized) {
      // Logic handled in dispatcher
    }
  }

  // Rule 3: Predictive Anomaly Block (Hunter Mode)
  if (event.status === 'BLOCKED_BY_GOVERNANCE' && event.category === 'PREDICTIVE_ANOMALY') {
    return {
      allowed: false,
      reason: `Proactive block by Hunter Mode: ${event.payload?.reason || 'High risk profile detected.'}`,
      remediation: "Requires manual identity binding verification and Imperial seal.",
      severity: 'CRITICAL'
    };
  }

  // Rule 4: Autonomous Budget Guardrail for Agents
  if (event.type === 'AGENT_BUDGET_ADJUST' || (event.plane === 'FINANCE' && event.payload?.amount)) {
    const requestedAmount = event.payload?.amount || 0;
    const maxAutonomousLimit = 2000;

    if (requestedAmount > maxAutonomousLimit && !event.payload?.confirmed) {
      return {
        allowed: false,
        reason: `Directive exceeds autonomous budget cap of $${maxAutonomousLimit}.`,
        remediation: "Requires manual Imperial Directive seal for high-value disbursement.",
        severity: 'HIGH'
      };
    }
  }

  return { allowed: true, severity: 'LOW' };
}
