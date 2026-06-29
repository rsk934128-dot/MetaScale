
"use client";

import { useState, useEffect, useMemo } from "react";
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
  AlertTriangle,
  Rocket,
  TrendingUp,
  Target,
  Database,
  Braces,
  ArrowUpRight,
  ShieldCheck,
  Server,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { SystemMode } from "@/lib/kernel/types";
import { Progress } from "@/components/ui/progress";

export default function SovereignControlPlane() {
  const { mode, setSystemMode, events, planes, emitEvent, processNextEvent, uptime } = useKernel();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleModeChange = (newMode: SystemMode) => {
    setSystemMode(newMode);
    emitEvent('SECURITY', 'MODE_TRANSITION', 1, { from: mode, to: newMode });
  };

  const handleSyncAllNodes = () => {
    setIsSyncing(true);
    emitEvent('INFRA', 'GLOBAL_MESH_SYNC', 2, { scope: '42_NODES', protocol: 'ANYCAST_V2' });
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  useEffect(() => {
    if (events.some(e => e.status === 'QUEUED')) {
      const timer = setTimeout(() => processNextEvent(), 800);
      return () => clearTimeout(timer);
    }
  }, [events, processNextEvent]);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 uppercase italic tracking-tighter">
              <Globe className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0 animate-logo-spin" />
              <span className="truncate">Sovereign Mission Control</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex border-accent/20 text-accent font-mono text-[10px]">
              EXECUTION_MODE: ACTIVE
            </Badge>
            <div className="hidden md:flex bg-secondary/50 p-1 rounded-lg border border-white/5">
              {(['NORMAL', 'EMERGENCY', 'LOCKDOWN'] as SystemMode[]).map((m) => (
                <Button 
                  key={m}
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "text-[9px] h-7 px-2 font-bold transition-all", 
                    mode === m && m === 'NORMAL' && "bg-green-500/20 text-green-400",
                    mode === m && m === 'EMERGENCY' && "bg-yellow-500/20 text-yellow-400",
                    mode === m && m === 'LOCKDOWN' && "bg-red-500/20 text-red-400"
                  )}
                  onClick={() => handleModeChange(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
            <Button size="sm" onClick={handleSyncAllNodes} disabled={isSyncing} className="cyan-glow text-[10px] font-bold h-8">
              {isSyncing ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Zap className="h-3.5 w-3.5 mr-1.5" />}
              Sync Mesh
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
          {/* Top Level Execution Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-accent" /> Commercial Yield
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-headline font-bold text-white">3.5%</div>
                   <p className="text-[9px] text-accent font-bold mt-1 uppercase">P45 Deterministic Yield</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Target className="h-3 w-3 text-primary" /> Sales Velocity
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-headline font-bold text-white">92.4%</div>
                   <p className="text-[9px] text-primary font-bold mt-1 uppercase">Efficiency Optimal</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Network className="h-3 w-3 text-blue-400" /> Mesh Integrity
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-headline font-bold text-white">42/42</div>
                   <p className="text-[9px] text-blue-400 font-bold mt-1 uppercase">Anycast Nodes Ready</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3 text-green-400" /> Compliance
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-headline font-bold text-white">100%</div>
                   <p className="text-[9px] text-green-400 font-bold mt-1 uppercase">ISO 20022 Verified</p>
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Center Panel: Global Mesh Visualization */}
            <div className="lg:col-span-8 space-y-8">
               <Card className="glass-panel border-white/5 relative overflow-hidden h-[500px] flex flex-col">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  <CardHeader className="border-b border-white/5 bg-white/5 relative z-10">
                     <div className="flex justify-between items-center">
                        <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                           <Globe className="h-4 w-4 text-accent" />
                           Global Anycast Grid (Project 42)
                        </CardTitle>
                        <Badge variant="outline" className="text-[8px] font-mono border-green-500/30 text-green-400">STATUS: NOMINAL</Badge>
                     </div>
                  </CardHeader>
                  <CardContent className="flex-1 relative z-10 flex items-center justify-center">
                     <div className="relative w-full max-w-2xl aspect-[2/1] bg-black/20 rounded-3xl border border-white/5 shadow-inner overflow-hidden group">
                        {/* Abstract World Map with 42 Nodes */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                           <div className="w-[80%] h-[80%] rounded-full border border-dashed border-accent/20 animate-logo-spin" />
                           <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-accent/10 animate-logo-spin reverse" />
                        </div>
                        
                        {/* Simulated Nodes */}
                        <div className="absolute inset-0 p-12">
                           <div className="grid grid-cols-6 gap-8 h-full place-items-center">
                              {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="relative">
                                   <div className={cn(
                                     "w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] animate-pulse",
                                     i % 7 === 0 ? "text-primary" : i % 5 === 0 ? "text-green-400" : "text-accent"
                                   )} style={{ animationDelay: `${i * 0.2}s` }} />
                                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-current opacity-0 group-hover:opacity-20 transition-opacity" />
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="absolute bottom-6 left-6 space-y-1">
                           <p className="text-[10px] font-bold text-white uppercase tracking-widest">Active Corridor: Node-04 (UK)</p>
                           <p className="text-[8px] text-muted-foreground uppercase font-mono">LATENCY: 8.4ms | PACKET_LOSS: 0.00%</p>
                        </div>
                        <div className="absolute bottom-6 right-6">
                           <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest text-accent hover:bg-accent/10">
                              Expand Mesh View <ArrowUpRight className="ml-1.5 h-3 w-3" />
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-panel border-white/5">
                     <CardHeader className="p-4 pb-2 border-b border-white/5">
                        <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                           <Braces className="h-4 w-4 text-primary" />
                           P43: Syntax Architect
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-4 space-y-4">
                        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                           <div className="flex justify-between text-[9px] font-bold uppercase">
                              <span className="text-muted-foreground">Output Status</span>
                              <span className="text-green-400">READY</span>
                           </div>
                           <p className="text-[10px] text-white/80 italic leading-relaxed">
                              "B2B Outreach sequence for European corridor is architected and signed via ISO 20022 protocol."
                           </p>
                        </div>
                        <Button variant="outline" className="w-full h-8 text-[9px] font-bold uppercase border-primary/20 text-primary hover:bg-primary/10">
                           Open Architect <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                     </CardContent>
                  </Card>

                  <Card className="glass-panel border-white/5">
                     <CardHeader className="p-4 pb-2 border-b border-white/5">
                        <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                           <Database className="h-4 w-4 text-accent" />
                           P44: Data Enrichment
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                           <div className="flex justify-between text-[9px] font-bold uppercase">
                              <span className="text-muted-foreground">Metadata Density</span>
                              <span className="text-accent">92.4%</span>
                           </div>
                           <Progress value={92} className="h-1 bg-accent/10 [&>div]:bg-accent" />
                        </div>
                        <div className="p-2 rounded bg-secondary/30 text-[9px] text-white/60 italic leading-relaxed border border-white/5">
                           "14,200 entities resolved across global mesh corridors."
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>

            {/* Sidebar Panels: Execution Intelligence & Events */}
            <div className="lg:col-span-4 space-y-8">
               <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl">
                  <CardHeader className="p-6 border-b border-white/10">
                     <CardTitle className="text-sm uppercase tracking-[0.2em] flex items-center gap-2 text-accent">
                        <Activity className="h-4 w-4" />
                        Execution Intelligence
                     </CardTitle>
                     <CardDescription className="text-[10px] italic">Deterministic ROI Monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                     <div className="space-y-4">
                        {[
                          { label: "Gross Margin", val: "78.2%", target: 80, color: "text-green-400" },
                          { label: "CAC/LTV Ratio", val: "1:4.8", target: 70, color: "text-primary" },
                          { label: "Sales Velocity", val: "Optimal", target: 100, color: "text-accent" }
                        ].map((item, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase text-white/70">{item.label}</span>
                                <span className={cn("text-xs font-bold font-mono", item.color)}>{item.val}</span>
                             </div>
                             <Progress value={item.target} className="h-1 bg-white/5" />
                          </div>
                        ))}
                     </div>

                     <div className="pt-4 border-t border-white/5">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center space-y-4 relative group overflow-hidden">
                           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><Rocket className="h-10 w-10 text-accent" /></div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">Current Goal</p>
                              <p className="text-sm font-headline font-bold text-white uppercase italic">Digital Financial Empire Q4</p>
                           </div>
                           <Button className="w-full h-10 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow">
                              Authorize Scalability Shift
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5 flex flex-col h-[400px]">
                  <CardHeader className="p-4 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                     <CardTitle className="text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <History className="h-3.5 w-3.5 text-muted-foreground" />
                        Deterministic Event Queue
                     </CardTitle>
                     <Badge variant="outline" className="text-[8px] font-mono opacity-50">{events.filter(e => e.status === 'QUEUED').length} PENDING</Badge>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                     <ScrollArea className="h-full pr-4">
                        <div className="p-2 space-y-2">
                           {events.length === 0 ? (
                             <div className="h-40 flex items-center justify-center text-[9px] uppercase font-bold text-muted-foreground italic opacity-20">Kernel Standby...</div>
                           ) : [...events].reverse().slice(0, 15).map((event) => (
                             <div key={event.id} className={cn(
                               "p-3 rounded-lg border flex items-start gap-3 transition-all",
                               event.status === 'QUEUED' ? "bg-accent/5 border-accent/20 animate-pulse" : "bg-secondary/20 border-white/5 opacity-60"
                             )}>
                                <div className={cn(
                                  "w-1 h-6 rounded-full mt-1 shrink-0",
                                  event.plane === 'SECURITY' ? 'bg-red-500' :
                                  event.plane === 'FINANCE' ? 'bg-green-400' : 'bg-accent'
                                )} />
                                <div className="flex-1 min-w-0">
                                   <div className="flex justify-between items-center mb-1">
                                      <span className="text-[8px] font-bold text-white uppercase truncate">{event.type}</span>
                                      <span className="text-[7px] text-muted-foreground font-mono">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                   </div>
                                   <div className="flex items-center gap-1.5">
                                      <Badge variant="outline" className="text-[6px] px-1 py-0 border-white/10 uppercase opacity-50">{event.plane}</Badge>
                                      <span className="text-[7px] text-muted-foreground truncate">{event.id}</span>
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>

        <footer className="p-6 border-t border-white/5 bg-secondary/10 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-accent/30 text-accent font-mono text-[9px] px-3 py-1">
                 PROJECT_42_SECURE: OK
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[9px] px-3 py-1">
                 PROJECT_43_SIGNED: OK
              </Badge>
              <Badge variant="outline" className="border-blue-400/30 text-blue-400 font-mono text-[9px] px-3 py-1">
                 PROJECT_44_ENRICHED: OK
              </Badge>
           </div>
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Sovereign OS • Commercial Infrastructure v1.2.0-stable
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
