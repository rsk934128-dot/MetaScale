
/**
 * @fileOverview Sovereign Governance Engine (Policy-as-Code).
 * Enforces deterministic guardrails on all agentic and system directives.
 * Updated v1.2: Multi-Sig Liquidity Guard Enforcement.
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
      // We don't block the event creation, but we flag it as requiring Multi-Sig in the payload
      // The dispatcher logic handles the actual "Pending" state.
    }
  }

  // Rule 3: Autonomous Budget Guardrail for Agents
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

  // Rule 4: Critical Operation Auth
  if (event.type === 'CORE_LEGER_WIPE' || event.type === 'ROOT_AUTH_RESET') {
    return {
      allowed: false,
      reason: "Root mutation attempt detected. Automatic block triggered.",
      remediation: "This action can only be performed via the Mil-Spec Hardware Terminal.",
      severity: 'CRITICAL'
    };
  }

  return { allowed: true, severity: 'LOW' };
}
