"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  ShieldAlert, 
  Activity, 
  Zap, 
  Globe, 
  Cpu, 
  RefreshCw, 
  Lock,
  Network,
  Waves,
  DollarSign,
  Terminal,
  History,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { SystemMode } from "@/lib/kernel/types";

export default function SovereignControlPlane() {
  const { mode, setSystemMode, events, planes, emitEvent, processNextEvent, uptime } = useKernel();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleModeChange = (newMode: SystemMode) => {
    setSystemMode(newMode);
    emitEvent('SECURITY', 'MODE_TRANSITION', 1, { from: mode, to: newMode });
  };

  const triggerMockEvent = () => {
    const planes: any[] = ['CIVIC', 'FINANCE', 'SECURITY', 'INFRA'];
    const randomPlane = planes[Math.floor(Math.random() * planes.length)];
    emitEvent(randomPlane, 'MANUAL_TEST_EVENT', 3, { data: 'Synthetic trigger' });
  };

  useEffect(() => {
    if (events.some(e => e.status === 'QUEUED')) {
      const timer = setTimeout(() => processNextEvent(), 1000);
      return () => clearTimeout(timer);
    }
  }, [events, processNextEvent]);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2">
              <Globe className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0" />
              <span className="truncate">SHURUKKHA-OS v1.2</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-secondary/50 p-1 rounded-lg border border-white/5">
              {(['NORMAL', 'EMERGENCY', 'LOCKDOWN', 'RECOVERY'] as SystemMode[]).map((m) => (
                <Button 
                  key={m}
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "text-[9px] md:text-[10px] h-7 px-2 md:px-3 font-bold transition-all", 
                    mode === m && m === 'NORMAL' && "bg-green-500/20 text-green-400",
                    mode === m && m === 'EMERGENCY' && "bg-yellow-500/20 text-yellow-400",
                    mode === m && m === 'LOCKDOWN' && "bg-red-500/20 text-red-400",
                    mode === m && m === 'RECOVERY' && "bg-blue-500/20 text-blue-400"
                  )}
                  onClick={() => handleModeChange(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
            <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[9px] md:text-xs">
              {mode}
            </Badge>
          </div>
        </header>

        <main className="flex-1 space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1">Kernel Orchestration</h2>
              <p className="text-sm text-muted-foreground">Deterministic event processing across operational planes.</p>
            </div>
            <Button size="sm" onClick={triggerMockEvent} className="cyan-glow text-[10px] font-bold w-full md:w-auto">
              <Terminal className="mr-1 h-3 w-3" /> Emit Event
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(Object.keys(planes) as Array<keyof typeof planes>).map((plane) => (
              <Card key={plane} className="glass-panel border-white/5">
                <CardContent className="p-4 md:p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{plane} PLANE</p>
                      <p className="text-xl md:text-2xl font-headline font-bold">{planes[plane].status}</p>
                    </div>
                    <div className={cn(
                      "p-2 rounded-lg bg-secondary/50",
                      planes[plane].status === 'OPTIMAL' ? 'text-green-400' : 'text-yellow-400'
                    )}>
                      <Activity className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span>LOAD</span>
                      <span>{planes[plane].load}%</span>
                    </div>
                    <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${planes[plane].load}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            <div className="xl:col-span-2 space-y-6 md:space-y-8">
              <Card className="glass-panel border-l-4 border-l-accent">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-accent" />
                      Deterministic Event Queue
                    </div>
                    <Badge variant="outline" className="text-[9px]">
                      {events.filter(e => e.status === 'QUEUED').length} Pending
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">Kernel-ordered execution path.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <ScrollArea className="h-[300px] md:h-[400px] pr-4">
                    <div className="space-y-3">
                      {events.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground italic text-xs">
                          Kernel idle.
                        </div>
                      )}
                      {[...events].reverse().map((event, i) => (
                        <div key={event.id} className={cn(
                          "flex items-center gap-3 md:gap-4 p-3 rounded-lg border transition-all",
                          event.status === 'QUEUED' ? "bg-accent/5 border-accent/20 animate-pulse" : "bg-secondary/20 border-white/5 opacity-60"
                        )}>
                          <div className={cn(
                            "w-1 h-8 md:w-1.5 md:h-10 rounded-full shrink-0",
                            event.plane === 'SECURITY' ? 'bg-red-500' :
                            event.plane === 'CIVIC' ? 'bg-blue-400' :
                            event.plane === 'FINANCE' ? 'bg-green-400' : 'bg-accent'
                          )} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 truncate">
                              <Badge variant="outline" className="text-[7px] md:text-[8px] uppercase shrink-0">{event.plane}</Badge>
                              <span className="text-[10px] md:text-xs font-bold text-white truncate">{event.type}</span>
                            </div>
                            <p className="text-[9px] md:text-[10px] text-muted-foreground font-mono truncate">
                              TS: {new Date(event.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="text-right space-y-1 shrink-0">
                            <Badge className="text-[7px] md:text-[8px] block font-mono">P: {event.priority}</Badge>
                            <span className={cn(
                              "text-[8px] uppercase font-bold block",
                              event.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'
                            )}>{event.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-accent" />
                    Priority Resolver
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-3">
                    <p className="text-[10px] font-bold text-accent uppercase truncate">Mode: {mode}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground">Conflict Policy</span>
                        <span className="font-bold">Deterministic</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Active Overrides</p>
                    <div className="flex flex-col gap-2">
                      {mode === 'EMERGENCY' && <div className="text-[10px] text-yellow-400 font-bold flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> CIVIC PRIORITY</div>}
                      {mode === 'LOCKDOWN' && <div className="text-[10px] text-red-400 font-bold flex items-center gap-1"><Lock className="h-3 w-3" /> SECURE GATE</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
