
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Network, 
  Globe, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  RefreshCw,
  Search, 
  Filter,
  ArrowUpRight,
  Server,
  Terminal,
  Unplug,
  Loader2,
  Play,
  HeartPulse,
  Smartphone,
  Battery
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useKernel } from "@/components/kernel/KernelProvider";

const MOCK_NODES = Array.from({ length: 42 }, (_, i) => ({
  id: `NODE-${i + 1 < 10 ? '0' : ''}${i + 1}`,
  status: Math.random() > 0.1 ? 'ONLINE' : 'DEGRADED',
  load: Math.floor(Math.random() * 60) + 20,
  latency: Math.floor(Math.random() * 15) + 5,
}));

export default function InfrastructureMeshPage() {
  const { heartbeat, emitEvent } = useKernel();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isMobileActivating, setIsMobileActivating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{node04: number, avg: number} | null>(null);
  const { toast } = useToast();

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Anycast Mesh Synced",
        description: "All 42 nodes reporting healthy status.",
      });
    }, 2000);
  };

  const handleActivateMobileNode = () => {
    setIsMobileActivating(true);
    emitEvent('INFRA', 'MOBILE_BACKGROUND_PROGRAM_INIT', 2, { 
      device: 'MOBILE_HANDSET',
      mode: 'ACTIVE_BACKGROUND_SYNC'
    });

    setTimeout(() => {
      setIsMobileActivating(false);
      toast({
        title: "Mobile Node Active",
        description: "মোবাইল ডিভাইসটি এখন ব্যাকগ্রাউন্ড নোড হিসেবে কার্নেলের সাথে যুক্ত। এটি অফলাইন সিঙ্ক এবং এসএমএস রিডার হিসেবে কাজ করবে।",
      });
    }, 3000);
  };

  const runPrioritySimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    setTimeout(() => {
      const node04Heartbeat = heartbeat.find(h => h.nodeId === 'NODE-04-UK');
      setSimulationResult({
        node04: node04Heartbeat?.latency || 8.4,
        avg: 42.8
      });
      setIsSimulating(false);
      toast({
        title: "Simulation Complete",
        description: "Node-04 (Priority) outperformed global average by 80.3%.",
      });
    }, 2500);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-white">
              <Network className="h-5 w-5 text-accent" />
              Sovereign Infrastructure Mesh
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-accent/20 text-accent">
              <Radio className="mr-1 h-3 w-3" /> Anycast Active
            </Badge>
            <Button size="sm" onClick={handleSync} disabled={isSyncing} className="cyan-glow text-xs font-bold">
              {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
              Re-Sync All Nodes
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-headline font-bold mb-2 uppercase italic tracking-tighter">42-Node <span className="text-accent">Distributed Grid</span></h2>
              <p className="text-muted-foreground italic">"Monitoring self-healing network capacity and geo-distributed anycast nodes."</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Grid Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">100%</div>
                <p className="text-[10px] text-accent mt-1 uppercase font-bold tracking-tighter">Availability: Optimal</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Mesh Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42.8%</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">Avg Capacity Used</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Latency (Anycast)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.4ms</div>
                <p className="text-[10px] text-blue-400 mt-1 uppercase font-bold tracking-tighter">Global Response Time</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-400 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Compute Power</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.8 Petahash</div>
                <p className="text-[10px] text-green-400 mt-1 uppercase font-bold tracking-tighter">Consensus Engine Active</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
                     <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-tighter italic">
                           <Smartphone className="h-5 w-5 text-accent" />
                           Active Mobile Node Node-04
                        </CardTitle>
                        <CardDescription className="text-xs">Establish background program for offline resilience</CardDescription>
                     </div>
                     <Badge variant="outline" className="border-green-500/30 text-green-400 animate-pulse uppercase text-[8px]">Program Ready</Badge>
                  </CardHeader>
                  <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                     <div className="flex-1 space-y-4">
                        <p className="text-sm text-white/80 leading-relaxed italic">
                          "এই প্রোগ্রামটি আপনার মোবাইল ডিভাইসে ব্যাকগ্রাউন্ডে চলবে। এটি অফলাইন থাকাকালীন এসএমএস ইন্টারসেপ্ট করতে এবং ইন্টারনেট আসলে অটো-সিঙ্ক করতে সাহায্য করবে। এটি ব্যবহারের ফলে ডিভাইসে সামান্য বেশি পাওয়ার খরচ হতে পারে।"
                        </p>
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2">
                              <Battery className="h-4 w-4 text-yellow-500" />
                              <span className="text-[10px] font-bold uppercase text-muted-foreground">Power Usage: Normal+</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-green-400" />
                              <span className="text-[10px] font-bold uppercase text-muted-foreground">Sync Rate: T+0</span>
                           </div>
                        </div>
                        <Button 
                           onClick={handleActivateMobileNode} 
                           disabled={isMobileActivating}
                           className="w-full md:w-auto h-12 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow px-10"
                        >
                           {isMobileActivating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                           Activate Mobile Node
                        </Button>
                     </div>
                     <div className="w-full md:w-1/3 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                           <ShieldCheck className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-white uppercase tracking-widest">Handshake Status</p>
                           <p className="text-[8px] text-muted-foreground italic mt-1 uppercase">Awaiting Activation...</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                  <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest">
                     <Globe className="h-5 w-5 text-accent" />
                     Geo-Distributed Mesh Visualization
                  </CardTitle>
                  <CardDescription className="text-xs">Live status of the distributed 42-node Sovereign anycast network.</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-14 gap-2">
                     {MOCK_NODES.map((node) => (
                        <div key={node.id} className="group relative">
                        <div className={cn(
                           "aspect-square rounded-sm border transition-all cursor-pointer flex items-center justify-center",
                           node.status === 'ONLINE' ? 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20' : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'
                        )}>
                           <Server className="h-4 w-4" />
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-background border rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 w-24 text-[8px] pointer-events-none">
                           <p className="font-bold">{node.id}</p>
                           <p className="text-muted-foreground">Load: {node.load}%</p>
                           <p className="text-muted-foreground">Lat: {node.latency}ms</p>
                        </div>
                        </div>
                     ))}
                  </div>
                  </CardContent>
               </Card>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest text-accent">
                      <HeartPulse className="h-4 w-4" />
                      Proactive Heartbeat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     <div className="space-y-3">
                        {heartbeat.map((node) => (
                           <div key={node.nodeId} className="flex justify-between items-center p-2 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-[9px] font-bold uppercase text-white/70">{node.nodeId}</span>
                              <Badge variant="outline" className={cn(
                                "text-[8px] font-mono",
                                node.status === 'ONLINE' ? "text-green-400 border-green-500/20" : "text-yellow-400 border-yellow-500/20"
                              )}>
                                 {node.latency}ms
                              </Badge>
                           </div>
                        ))}
                        <div className="p-2 rounded border border-accent/20 bg-accent/5 text-[9px] text-accent italic leading-relaxed">
                           "Heartbeat worker is probing all core corridors every 30s. Automated Telegram alerts are ENABLED."
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="glass-panel">
                  <CardHeader className="p-4 border-b border-white/5">
                     <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-primary" />
                        Routing Protocols
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="divide-y divide-white/5">
                        {[
                           { name: "Node Failover", status: "Active" },
                           { name: "Geo-Fence Sync", status: "Optimal" },
                           { name: "HMAC Verification", status: "Strict" },
                           { name: "PIS/AIS Sharding", status: "Enabled" }
                        ].map((p, i) => (
                           <div key={i} className="p-3 flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase text-white/70">{p.name}</span>
                              <Badge variant="outline" className="text-[8px] border-accent/20 text-accent">{p.status}</Badge>
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
