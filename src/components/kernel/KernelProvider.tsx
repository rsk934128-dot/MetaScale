
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { KernelState, SovereignEvent, SystemMode, PlaneType, PlaneState } from '@/lib/kernel/types';
import { resolveEventPriority, isTransitionAllowed } from '@/lib/kernel/priority-engine';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, doc, setDoc, query, orderBy, limit, addDoc, getDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface KernelContextType extends KernelState {
  emitEvent: (plane: PlaneType, type: string, priority: number, payload: any) => void;
  setSystemMode: (mode: SystemMode) => void;
  processNextEvent: () => void;
  rollbackEvent: (eventId: string) => void;
}

const KernelContext = createContext<KernelContextType | undefined>(undefined);

const INITIAL_PLANES: Record<PlaneType, PlaneState> = {
  CIVIC: { status: 'OPTIMAL', load: 12, latency: 4, lastSync: Date.now() },
  FINANCE: { status: 'OPTIMAL', load: 45, latency: 12, lastSync: Date.now() },
  SECURITY: { status: 'OPTIMAL', load: 8, latency: 2, lastSync: Date.now() },
  INFRA: { status: 'OPTIMAL', load: 42, latency: 8, lastSync: Date.now() },
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

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('timestamp', 'desc'), limit(50));
  }, [firestore]);

  const { data: remoteEvents } = useCollection<SovereignEvent>(eventsQuery);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    };

    if (firestore) {
      const eventRef = doc(firestore, 'events', systemSeal);
      setDoc(eventRef, newEvent).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: eventRef.path,
          operation: 'create',
          requestResourceData: newEvent,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      if (user?.uid) {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        // Add internal notification
        if (resolvedPriority <= 2 || type.includes('EMERGENCY')) {
          const notifRef = collection(firestore, 'users', user.uid, 'notifications');
          const notification = {
            id: systemSeal,
            title: `Kernel Trigger: ${type}`,
            message: `Priority ${resolvedPriority} event detected in ${plane} plane.`,
            type: resolvedPriority === 1 ? 'CRITICAL' : 'WARNING',
            read: false,
            timestamp: Date.now(),
          };
          addDoc(notifRef, notification);

          // TRIGGER TELEGRAM ALERT
          if (userData?.telegramLinked && userData?.telegramChatId) {
            const BOT_TOKEN = "7827860503:AAEVNXEe3mPUtPudIBT_S5aE1aHr56efaiA";
            const text = `<b>🚨 KERNEL ALERT</b>\n\n<b>Type:</b> ${type}\n<b>Plane:</b> ${plane}\n<b>Priority:</b> ${resolvedPriority}\n<b>Seal:</b> <code>${systemSeal}</code>\n\n<i>System Mode: ${localMode}</i>`;
            
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: userData.telegramChatId,
                text: text,
                parse_mode: 'HTML'
              }),
            }).catch(e => console.error("Telegram notify failed"));
          }
        }
      }
    }

    if (priority <= 2 || type.includes('PAYOUT')) {
      toast({
        title: `Kernel Event: ${type}`,
        description: `Source: ${plane} | Seal: ${systemSeal}`,
        variant: plane === 'SECURITY' ? 'destructive' : 'default',
      });
    }
  }, [firestore, localMode, toast, user?.uid]);

  const setSystemMode = useCallback((newMode: SystemMode) => {
    if (localMode === newMode) return;
    if (!isTransitionAllowed(localMode, newMode)) {
      toast({
        title: "Illegal Transition",
        description: `Cannot move from ${localMode} to ${newMode}`,
        variant: "destructive"
      });
      return;
    }
    
    setLocalMode(newMode);
    emitEvent('SECURITY', 'MODE_TRANSITION', 1, { from: localMode, to: newMode });
  }, [localMode, emitEvent, toast]);

  const processNextEvent = useCallback(() => {
    if (!remoteEvents || !firestore) return;
    const nextQueued = remoteEvents.find(e => e.status === 'QUEUED');
    if (!nextQueued) return;

    const eventRef = doc(firestore, 'events', nextQueued.id);
    setDoc(eventRef, { ...nextQueued, status: 'COMPLETED' }, { merge: true }).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: eventRef.path,
        operation: 'update',
        requestResourceData: { status: 'COMPLETED' },
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [remoteEvents, firestore]);

  const rollbackEvent = useCallback((eventId: string) => {
    if (!firestore) return;
    const eventRef = doc(firestore, 'events', eventId);
    setDoc(eventRef, { status: 'ROLLED_BACK' }, { merge: true }).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: eventRef.path,
        operation: 'update',
        requestResourceData: { status: 'ROLLED_BACK' },
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore]);

  const stateValue: KernelContextType = {
    mode: localMode,
    events: remoteEvents || [],
    planes: INITIAL_PLANES,
    uptime,
    emitEvent,
    setSystemMode,
    processNextEvent,
    rollbackEvent
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
