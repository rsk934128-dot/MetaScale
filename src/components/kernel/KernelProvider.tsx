
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { KernelState, SovereignEvent, SystemMode, PlaneType, PlaneState } from '@/lib/kernel/types';
import { resolveEventPriority, isTransitionAllowed } from '@/lib/kernel/priority-engine';
import { useToast } from '@/hooks/use-toast';

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

export function KernelProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KernelState>({
    mode: 'NORMAL',
    events: [],
    planes: INITIAL_PLANES,
    uptime: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => ({ ...prev, uptime: prev.uptime + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const emitEvent = useCallback((plane: PlaneType, type: string, priority: number, payload: any) => {
    const newEvent: SovereignEvent = {
      id: Math.random().toString(36).substr(2, 9),
      plane,
      type,
      priority,
      timestamp: Date.now(),
      payload,
      status: 'QUEUED',
    };

    setState(prev => {
      const resolvedPriority = resolveEventPriority(newEvent, prev.mode);
      const updatedEvent = { ...newEvent, priority: resolvedPriority };
      const newEvents = [...prev.events, updatedEvent].sort((a, b) => a.priority - b.priority || a.timestamp - b.timestamp);
      
      return { ...prev, events: newEvents };
    });

    if (priority <= 2) {
      toast({
        title: `Critical Event: ${type}`,
        description: `Source: ${plane} | Priority: ${priority}`,
        variant: plane === 'SECURITY' ? 'destructive' : 'default',
      });
    }
  }, [toast]);

  const setSystemMode = useCallback((newMode: SystemMode) => {
    setState(prev => {
      if (prev.mode === newMode) return prev;
      if (!isTransitionAllowed(prev.mode, newMode)) {
        toast({
          title: "Illegal Transition",
          description: `Cannot move from ${prev.mode} to ${newMode}`,
          variant: "destructive"
        });
        return prev;
      }
      
      toast({
        title: `System Mode: ${newMode}`,
        description: `Kernel transitioning states...`,
      });

      return { ...prev, mode: newMode };
    });
  }, [toast]);

  const processNextEvent = useCallback(() => {
    setState(prev => {
      const pendingIndex = prev.events.findIndex(e => e.status === 'QUEUED');
      if (pendingIndex === -1) return prev;

      const newEvents = [...prev.events];
      newEvents[pendingIndex] = { ...newEvents[pendingIndex], status: 'COMPLETED' };
      
      return { ...prev, events: newEvents };
    });
  }, []);

  const rollbackEvent = useCallback((eventId: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === eventId ? { ...e, status: 'ROLLED_BACK' } : e)
    }));
  }, []);

  return (
    <KernelContext.Provider value={{ ...state, emitEvent, setSystemMode, processNextEvent, rollbackEvent }}>
      {children}
    </KernelContext.Provider>
  );
}

export const useKernel = () => {
  const context = useContext(KernelContext);
  if (!context) throw new Error('useKernel must be used within KernelProvider');
  return context;
};
