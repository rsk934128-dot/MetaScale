
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
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Sovereign Control Plane (SHURUKKHA-OS v1.2)
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-secondary/50 p-1 rounded-lg border border-white/5">
              {(['NORMAL', 'EMERGENCY', 'LOCKDOWN', 'RECOVERY'] as SystemMode[]).map((m) => (
                <Button 
                  key={m}
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "text-[10px] h-7 px-3 font-bold transition-all", 
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
            <Badge variant="outline" className="border-accent/20 text-accent font-mono">
              UPTIME: {Math.floor(uptime / 60)}m {uptime % 60}s
            </Badge>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto w-full">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-1">Kernel Orchestration</h2>
              <p className="text-muted-foreground">Deterministic event processing across four high-stakes operational planes.</p>
            </div>
            <Button size="sm" onClick={triggerMockEvent} className="cyan-glow text-[10px] font-bold">
              <Terminal className="mr-1 h-3 w-3" /> Emit Synthetic Event
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {(Object.keys(planes) as Array<keyof typeof planes>).map((plane) => (
              <Card key={plane} className="glass-panel border-white/5">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{plane} PLANE</p>
                      <p className="text-2xl font-headline font-bold">{planes[plane].status}</p>
                    </div>
                    <div className={cn(
                      "p-2 rounded-lg bg-secondary/50",
                      planes[plane].status === 'OPTIMAL' ? 'text-green-400' : 'text-yellow-400'
                    )}>
                      <Activity className="h-5 w-5" />
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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <Card className="glass-panel border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-accent" />
                      Deterministic Event Queue
                    </div>
                    <Badge variant="outline" className="text-[9px]">
                      {events.filter(e => e.status === 'QUEUED').length} Pending
                    </Badge>
                  </CardTitle>
                  <CardDescription>Kernel-ordered execution path based on active system priority engine.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {events.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground italic text-xs">
                          Kernel idle. Waiting for plane emission...
                        </div>
                      )}
                      {[...events].reverse().map((event, i) => (
                        <div key={event.id} className={cn(
                          "flex items-center gap-4 p-3 rounded-lg border transition-all",
                          event.status === 'QUEUED' ? "bg-accent/5 border-accent/20 animate-pulse" : "bg-secondary/20 border-white/5 opacity-60"
                        )}>
                          <div className={cn(
                            "w-1.5 h-10 rounded-full",
                            event.plane === 'SECURITY' ? 'bg-red-500' :
                            event.plane === 'CIVIC' ? 'bg-blue-400' :
                            event.plane === 'FINANCE' ? 'bg-green-400' : 'bg-accent'
                          )} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-[8px] uppercase">{event.plane}</Badge>
                              <span className="text-xs font-bold text-white">{event.type}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono">
                              ID: {event.id} | TS: {new Date(event.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge className="text-[8px] block font-mono">PRIORITY: {event.priority}</Badge>
                            <span className={cn(
                              "text-[8px] uppercase font-bold",
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
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-accent" />
                    Priority Resolver Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-3">
                    <p className="text-[10px] font-bold text-accent uppercase">Current Kernel Mode: {mode}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground">Conflict Policy</span>
                        <span className="font-bold">Deterministic</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground">Execution Model</span>
                        <span className="font-bold">Priority Queue</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Active Overrides</p>
                    <div className="flex flex-col gap-2">
                      {mode === 'EMERGENCY' && (
                        <div className="flex items-center gap-2 text-[10px] text-yellow-400 font-bold">
                          <AlertTriangle className="h-3 w-3" /> CIVIC PLANE PRIORITY ACTIVE
                        </div>
                      )}
                      {mode === 'LOCKDOWN' && (
                        <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold">
                          <Lock className="h-3 w-3" /> SECURITY GATE ACTIVE
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-green-400 font-bold">
                        <Activity className="h-3 w-3" /> EVENT LOGGING ACTIVE
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-sm">Plane Dependency Graph</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { node: "Civic → Infra", status: "Linked", health: 100 },
                      { node: "Finance → Security", status: "Gated", health: 100 },
                      { node: "Security → Global", status: "Root", health: 100 }
                    ].map((dep, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20 border border-white/5">
                        <span className="text-[10px] font-bold">{dep.node}</span>
                        <Badge variant="outline" className="text-[8px] bg-green-500/10 text-green-400">
                          {dep.status}
                        </Badge>
                      </div>
                    ))}
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
