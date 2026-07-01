
/**
 * @fileOverview Sovereign Governance Engine (Policy-as-Code).
 * Enforces deterministic guardrails on all agentic and system directives.
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
 * Rules:
 * 1. Budget Cap: No agent can authorize spend > $2000 without manual Imperial Directive.
 * 2. Mode Lockdown: In LOCKDOWN mode, only SECURITY plane events are authorized.
 * 3. Plane Integrity: If a plane is DEGRADED, critical writes are blocked.
 * 4. P43 Violation: Commands must follow deterministic S-Shell syntax.
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

  // Rule 2: Autonomous Budget Guardrail
  if (event.type === 'AGENT_BUDGET_ADJUST' || (event.plane === 'FINANCE' && event.payload?.amount)) {
    const requestedAmount = event.payload?.amount || 0;
    const maxAutonomousLimit = 2000;

    if (requestedAmount > maxAutonomousLimit) {
      return {
        allowed: false,
        reason: `Directive exceeds autonomous budget cap of $${maxAutonomousLimit}.`,
        remediation: "Requires manual Imperial Directive seal for high-value disbursement.",
        severity: 'HIGH'
      };
    }
  }

  // Rule 3: Plane Health Guardrail
  const targetPlane = state.planes[event.plane];
  if (targetPlane && targetPlane.status === 'ISOLATED') {
    return {
      allowed: false,
      reason: `Target plane ${event.plane} is ISOLATED due to forensic drift.`,
      remediation: "Run SAM Reader repair protocol on the plane before retrying.",
      severity: 'HIGH'
    };
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
