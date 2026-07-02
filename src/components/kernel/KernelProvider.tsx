
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { KernelState, SovereignEvent, SystemMode, PlaneType, PlaneState, HeartbeatStatus, BootStatus } from '@/lib/kernel/types';
import { resolveEventPriority, isTransitionAllowed } from '@/lib/kernel/priority-engine';
import { validateDirective } from '@/lib/kernel/governance-engine';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, doc, setDoc, query, orderBy, limit, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';
import { runAutomatedReconciliation } from '@/services/reconciliation-cron';
import { bootManager } from '@/lib/kernel/boot-manager';

interface KernelContextType extends KernelState {
  emitEvent: (plane: PlaneType, type: string, priority: number, payload: any) => void;
  setSystemMode: (mode: SystemMode) => void;
  processNextEvent: () => void;
  rollbackEvent: (eventId: string) => void;
  startAutonomousWorker: () => void;
  heartbeat: HeartbeatStatus[];
  isAutonomousActive: boolean;
}

const KernelContext = createContext<KernelContextType | undefined>(undefined);

const INITIAL_PLANES: Record<PlaneType, PlaneState> = {
  CIVIC: { status: 'OPTIMAL', load: 12, latency: 4, lastSync: Date.now() },
  FINANCE: { status: 'OPTIMAL', load: 45, latency: 12, lastSync: Date.now() },
  SECURITY: { status: 'OPTIMAL', load: 8, latency: 2, lastSync: Date.now() },
  INFRA: { status: 'OPTIMAL', load: 42, latency: 8, lastSync: Date.now() },
  OPERATIONS: { status: 'OPTIMAL', load: 10, latency: 5, lastSync: Date.now() },
};

const generateSystemSeal = () => {
  return `FALLBACK_P180_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export function KernelProvider({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [localMode, setLocalMode] = useState<SystemMode>('NORMAL');
  const [uptime, setUptime] = useState(0);
  const [isAutonomousActive, setIsAutonomousActive] = useState(false);
  const [boot, setBoot] = useState<BootStatus>({ ready: false, services: {}, lastUpdate: Date.now() });
  
  const [heartbeat, setHeartbeat] = useState<HeartbeatStatus[]>([
    { nodeId: 'NODE-04-UK', latency: 8, status: 'ONLINE', lastCheck: Date.now() },
    { nodeId: 'NODE-22-ASIA', latency: 42, status: 'ONLINE', lastCheck: Date.now() },
    { nodeId: 'NODE-01-US', latency: 15, status: 'ONLINE', lastCheck: Date.now() },
  ]);

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('timestamp', 'desc'), limit(50));
  }, [firestore]);

  const { data: remoteEvents } = useCollection<SovereignEvent>(eventsQuery);

  // --- CORE FUNCTIONS ---

  const emitEvent = useCallback(async (plane: PlaneType, type: string, priority: number, payload: any) => {
    const systemSeal = generateSystemSeal();
    const resolvedPriority = resolveEventPriority({ plane, priority } as any, localMode);
    
    const newEvent: SovereignEvent = {
      id: systemSeal,
      plane,
      type,
      priority: resolvedPriority,
      timestamp: Date.now(),
      payload,
      status: 'QUEUED',
      userId: user?.uid || 'SYSTEM'
    };

    // --- GOVERNANCE CHECK ---
    const govCheck = validateDirective(newEvent, { mode: localMode, planes: INITIAL_PLANES });
    
    if (!govCheck.allowed) {
      console.error(`>>> [GOVERNANCE_BLOCK] ${govCheck.reason}`);
      newEvent.status = 'BLOCKED_BY_GOVERNANCE';
      newEvent.message = govCheck.reason;

      if (firestore) {
        await setDoc(doc(firestore, 'events', systemSeal), newEvent);
        
        const violationSeal = `VIOLATION_${Date.now()}`;
        await setDoc(doc(firestore, 'events', violationSeal), {
          id: violationSeal,
          plane: 'SECURITY',
          type: 'GOVERNANCE_VIOLATION',
          priority: 1,
          timestamp: Date.now(),
          payload: { 
            blockedEvent: type, 
            reason: govCheck.reason, 
            remediation: govCheck.remediation,
            userId: user?.uid 
          },
          status: 'COMPLETED',
          category: 'GOVERNANCE_VIOLATION',
          severity: govCheck.severity
        });

        await setDoc(doc(firestore, 'ubil_events', `GOV_${systemSeal}`), {
          id: systemSeal,
          type: 'GOVERNANCE_BLOCK_LOGGED',
          status: 'BLOCKED',
          timestamp: Date.now(),
          routingReason: govCheck.reason,
          payload: { remediation: govCheck.remediation }
        });
      }

      toast({
        variant: 'destructive',
        title: "Governance Block",
        description: govCheck.reason,
      });
      return;
    }

    // --- AUTHORIZED EXECUTION ---
    if (firestore) {
      const eventRef = doc(firestore, 'events', systemSeal);
      setDoc(eventRef, newEvent).catch(() => {});

      if (payload?.syncToLedger) {
        const ubilRef = doc(firestore, 'ubil_events', `AGENT_${systemSeal}`);
        setDoc(ubilRef, {
           id: systemSeal,
           type: 'AGENT_DIRECTIVE_SYNCED',
           status: 'SUCCESS',
           timestamp: Date.now(),
           routingReason: `Agent Decision Sync: ${type}`,
           payload: payload
        }).catch(() => {});
      }

      if (user?.uid) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          if (resolvedPriority <= 2 || type.includes('EMERGENCY') || type.includes('FAILED')) {
            const notifRef = collection(firestore, 'users', user.uid, 'notifications');
            addDoc(notifRef, {
              id: systemSeal,
              title: `Kernel Trigger: ${type}`,
              message: `Priority ${resolvedPriority} event detected in ${plane} plane.`,
              type: resolvedPriority === 1 ? 'CRITICAL' : 'WARNING',
              read: false,
              timestamp: Date.now(),
            }).catch(() => {});

            if (userData?.telegramLinked && userData?.telegramChatId) {
              const alertEmoji = resolvedPriority === 1 ? "🚨" : "📊";
              const text = `<b>${alertEmoji} KERNEL ALERT</b>\n\n<b>Type:</b> ${type}\n<b>Plane:</b> ${plane}\n<b>Seal:</b> <code>${systemSeal}</code>`;
              await sendTelegramMessage(userData.telegramChatId, text);
            }
          }
        } catch (err) {}
      }
    }

    if (priority <= 2) {
      toast({
        title: `Kernel Event: ${type}`,
        description: `Source: ${plane} | Seal: ${systemSeal}`,
        variant: plane === 'SECURITY' ? 'destructive' : 'default',
      });
    }
  }, [firestore, localMode, toast, user?.uid]);

  const startAutonomousWorker = useCallback(() => {
    setIsAutonomousActive(true);
    emitEvent('INFRA', 'AUTONOMOUS_WORKER_INITIALIZED', 2, { status: 'STARTED', cycle: '60S_POLLING' });
  }, [emitEvent]);

  const setSystemMode = useCallback((newMode: SystemMode) => {
    if (localMode === newMode) return;
    setLocalMode(newMode);
    emitEvent('SECURITY', 'MODE_TRANSITION', 1, { from: localMode, to: newMode });
  }, [localMode, emitEvent]);

  const processNextEvent = useCallback(() => {
    if (!remoteEvents || !firestore) return;
    const nextQueued = remoteEvents.find(e => e.status === 'QUEUED');
    if (!nextQueued) return;
    updateDoc(doc(firestore, 'events', nextQueued.id), { status: 'COMPLETED' }).catch(() => {});
  }, [remoteEvents, firestore]);

  const rollbackEvent = useCallback((eventId: string) => {
    if (!firestore) return;
    updateDoc(doc(firestore, 'events', eventId), { status: 'ROLLED_BACK' }).catch(() => {});
  }, [firestore]);

  // --- INITIALIZATION ---
  useEffect(() => {
    const runBootSequence = async () => {
      try {
        await bootManager.bootSystem();
        setBoot(bootManager.getSystemStatus());
      } catch (err) {
        setSystemMode('LOCKDOWN');
      }
    };
    runBootSequence();
  }, [setSystemMode]);

  // --- BACKGROUND LOOPS ---

  useEffect(() => {
    const timer = setInterval(async () => {
      setUptime(prev => prev + 1);
      
      if (uptime > 0 && uptime % 30 === 0) {
        setHeartbeat(prev => prev.map(node => {
          const newLatency = Math.max(5, node.latency + (Math.random() * 10 - 5));
          const newStatus = newLatency > 60 ? 'DEGRADED' : 'ONLINE';
          return { ...node, latency: Number(newLatency.toFixed(2)), status: newStatus, lastCheck: Date.now() };
        }));
      }

      if (isAutonomousActive && uptime > 0 && uptime % 60 === 0 && firestore) {
        const result = await runAutomatedReconciliation(firestore, 'DETECT_AND_REPLAY');
        if (result.replayed > 0) {
          emitEvent('FINANCE', 'AUTONOMOUS_SETTLEMENT_SUCCESS', 2, { count: result.replayed });
          toast({
            title: "Autonomous Settlement",
            description: `Successfully self-healed ${result.replayed} payment(s).`,
          });
        }
      }

      if (isAutonomousActive && uptime > 0 && uptime % 300 === 0 && firestore) {
        emitEvent('FINANCE', 'LIQUIDITY_SHIFT_EXECUTED', 3, { 
          from: 'NODE-01-US', 
          to: 'NODE-22-ASIA', 
          reason: 'Predictive Demand spike in Asian corridor.' 
        });
      }

    }, 1000);
    return () => clearInterval(timer);
  }, [uptime, isAutonomousActive, firestore, toast, emitEvent]);

  const stateValue: KernelContextType = {
    mode: localMode,
    events: remoteEvents || [],
    planes: INITIAL_PLANES,
    uptime,
    boot,
    emitEvent,
    setSystemMode,
    processNextEvent,
    rollbackEvent,
    startAutonomousWorker,
    heartbeat,
    isAutonomousActive
  };

  return (
    <KernelContext.Provider value={stateValue}>
      {children}
    </KernelContext.Provider>
  );
}

export const useKernel = () => {
  const context = useContext(KernelContext);
  if (!context) throw new Error('useKernel must be used within KernelProvider');
  return context;
};
