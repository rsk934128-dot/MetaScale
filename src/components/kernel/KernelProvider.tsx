
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
  unlockToffee: (mobile: string) => Promise<void>;
  heartbeat: HeartbeatStatus[];
  isAutonomousActive: boolean;
  isToffeeUnlocked: boolean;
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
  const [isToffeeUnlocked, setIsToffeeUnlocked] = useState(false);
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

    const govCheck = validateDirective(newEvent, { mode: localMode, planes: INITIAL_PLANES });
    
    if (!govCheck.allowed) {
      newEvent.status = 'BLOCKED_BY_GOVERNANCE';
      if (firestore) {
        await setDoc(doc(firestore, 'events', systemSeal), newEvent);
      }
      toast({ variant: 'destructive', title: "Governance Block", description: govCheck.reason });
      return;
    }

    if (firestore) {
      setDoc(doc(firestore, 'events', systemSeal), newEvent).catch(() => {});
    }

    if (priority <= 2) {
      toast({
        title: `Kernel Event: ${type}`,
        description: `Source: ${plane} | Seal: ${systemSeal}`,
      });
    }
  }, [firestore, localMode, toast, user?.uid]);

  const unlockToffee = async (mobile: string) => {
    emitEvent('OPERATIONS', 'TOFFEE_UNLOCK_REQUESTED', 3, { mobile });
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsToffeeUnlocked(true);
    emitEvent('OPERATIONS', 'TOFFEE_CHANNELS_UNLOCKED', 2, { status: 'SUCCESS', node: 'NODE-04-MEDIA' });
    toast({ title: "Toffee Unlocked", description: "All premium channels are now accessible via Sovereign Tunnel." });
  };

  const startAutonomousWorker = useCallback(() => {
    setIsAutonomousActive(true);
    emitEvent('INFRA', 'AUTONOMOUS_WORKER_INITIALIZED', 2, { status: 'STARTED' });
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

  useEffect(() => {
    const timer = setInterval(async () => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    unlockToffee,
    heartbeat,
    isAutonomousActive,
    isToffeeUnlocked
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
