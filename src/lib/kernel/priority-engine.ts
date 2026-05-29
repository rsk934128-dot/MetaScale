
import { SovereignEvent, SystemMode, PlaneType } from './types';

/**
 * Deterministic Priority Engine (DPE)
 * Resolves execution order based on system mode and event plane.
 */
export function resolveEventPriority(event: SovereignEvent, currentMode: SystemMode): number {
  let basePriority = event.priority;

  // Rule 1: Security overrides all planes regardless of mode
  if (event.plane === 'SECURITY') {
    return Math.min(basePriority, 1);
  }

  // Rule 2: Emergency Mode adjustments
  if (currentMode === 'EMERGENCY') {
    if (event.plane === 'CIVIC') return Math.min(basePriority, 2);
    if (event.plane === 'FINANCE') return Math.max(basePriority, 8); // Deprioritize finance
  }

  // Rule 3: Lockdown Mode adjustments
  if (currentMode === 'LOCKDOWN') {
    if (event.plane !== 'SECURITY') return 10; // Only security events move fast
  }

  // Rule 4: Infrastructure failure
  if (event.type === 'INFRA_FAILURE') return 1;

  return basePriority;
}

export function isTransitionAllowed(from: SystemMode, to: SystemMode): boolean {
  const transitions: Record<SystemMode, SystemMode[]> = {
    'NORMAL': ['EMERGENCY', 'LOCKDOWN'],
    'EMERGENCY': ['NORMAL', 'LOCKDOWN', 'RECOVERY'],
    'LOCKDOWN': ['RECOVERY'],
    'RECOVERY': ['NORMAL']
  };
  return transitions[from].includes(to);
}
