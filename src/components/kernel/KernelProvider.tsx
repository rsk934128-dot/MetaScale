
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { KernelState, SovereignEvent, SystemMode, PlaneType, PlaneState, HeartbeatStatus } from '@/lib/kernel/types';
import { resolveEventPriority, isTransitionAllowed } from '@/lib/kernel/priority-engine';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, doc, setDoc, query, orderBy, limit, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { sendTelegramMessage } from '@/lib/telegram';

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

  // Background Heartbeat Loop (Simulated Proactive Monitoring)
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
      
      // Every 30 seconds, simulate a heartbeat check
      if (uptime > 0 && uptime % 30 === 0) {
        setHeartbeat(prev => prev.map(node => {
          const newLatency = Math.max(5, node.latency + (Math.random() * 10 - 5));
          const newStatus = newLatency > 60 ? 'DEGRADED' : 'ONLINE';
          
          if (newStatus === 'DEGRADED' && node.status === 'ONLINE') {
            emitEvent('INFRA', 'HEARTBEAT_LATENCY_WARNING', 3, { nodeId: node.nodeId, latency: newLatency });
          }
          
          return { ...node, latency: Number(newLatency.toFixed(2)), status: newStatus, lastCheck: Date.now() };
        }));
      }

      // Autonomous Cycle Simulation
      if (isAutonomousActive && uptime % 60 === 0) {
        emitEvent('INFRA', 'AUTONOMOUS_DISCOVERY_SCAN', 4, { mode: 'ACTIVE', results: 'Scanning for endpoints...' });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [uptime, isAutonomousActive]);

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

    if (firestore) {
      const eventRef = doc(firestore, 'events', systemSeal);
      setDoc(eventRef, newEvent).catch(async (error) => {
        console.error("Kernel Event Error:", error);
      });

      if (user?.uid) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          if (resolvedPriority <= 2 || type.includes('EMERGENCY') || type.includes('FAILED') || type.includes('WARNING') || type === 'DAILY_INTEGRITY_PULSE') {
            const notifRef = collection(firestore, 'users', user.uid, 'notifications');
            const notification = {
              id: systemSeal,
              title: `Kernel Trigger: ${type}`,
              message: `Priority ${resolvedPriority} event detected in ${plane} plane.`,
              type: resolvedPriority === 1 ? 'CRITICAL' : 'WARNING',
              read: false,
              timestamp: Date.now(),
            };
            addDoc(notifRef, notification).catch(() => {});

            if (userData?.telegramLinked && userData?.telegramChatId) {
              const alertEmoji = resolvedPriority === 1 ? "🚨" : "📊";
              const header = `<b>${alertEmoji} KERNEL ALERT</b>\n\n<b>Type:</b> ${type}\n<b>Plane:</b> ${plane}\n\n`;
              const text = `${header}<b>Payload:</b> <code>${JSON.stringify(payload)}</code>`;
              await sendTelegramMessage(userData.telegramChatId, text);
            }
          }
        } catch (err) {
          console.warn("Kernel: Could not fetch user profile for notifications.", err);
        }
      }
    }

    if (priority <= 2 || type.includes('PAYOUT') || type.includes('HEARTBEAT')) {
      toast({
        title: `Kernel Event: ${type}`,
        description: `Source: ${plane} | Seal: ${systemSeal}`,
        variant: plane === 'SECURITY' ? 'destructive' : 'default',
      });
    }
  }, [firestore, localMode, toast, user?.uid]);

  const startAutonomousWorker = useCallback(() => {
    setIsAutonomousActive(true);
    emitEvent('INFRA', 'AUTONOMOUS_WORKER_INITIALIZED', 2, { status: 'STARTED', cycle: '24H_ACTIVE' });
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

    const eventRef = doc(firestore, 'events', nextQueued.id);
    updateDoc(eventRef, { status: 'COMPLETED' }).catch(() => {});
  }, [remoteEvents, firestore]);

  const rollbackEvent = useCallback((eventId: string) => {
    if (!firestore) return;
    const eventRef = doc(firestore, 'events', eventId);
    updateDoc(eventRef, { status: 'ROLLED_BACK' }).catch(() => {});
  }, [firestore]);

  const stateValue: KernelContextType = {
    mode: localMode,
    events: remoteEvents || [],
    planes: INITIAL_PLANES,
    uptime,
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
