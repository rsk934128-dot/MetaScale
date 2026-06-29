
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
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const MOCK_NODES = Array.from({ length: 42 }, (_, i) => ({
  id: `NODE-${i + 1 < 10 ? '0' : ''}${i + 1}`,
  status: Math.random() > 0.1 ? 'ONLINE' : 'DEGRADED',
  load: Math.floor(Math.random() * 60) + 20,
  latency: Math.floor(Math.random() * 15) + 5,
}));

export default function InfrastructureMeshPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
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

  const runPrioritySimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    setTimeout(() => {
      setSimulationResult({
        node04: 8.4,
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
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
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
          <div className="flex justify-between items-end">
            <div>
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
               <Card className="glass-panel border-white/5">
                  <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Globe className="h-5 w-5 text-accent" />
                     Geo-Distributed Mesh Visualization
                  </CardTitle>
                  <CardDescription>Live status of the distributed 42-node Sovereign anycast network.</CardDescription>
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
                        {/* Tooltip on hover */}
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

               <Card className="glass-panel border-accent/30 bg-accent/5 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
                  <CardHeader>
                     <div className="flex justify-between items-start">
                        <div>
                           <CardTitle className="text-lg flex items-center gap-2 uppercase italic tracking-tighter">
                              <Zap className="h-5 w-5 text-accent" />
                              Node-04 Priority Simulator
                           </CardTitle>
                           <CardDescription className="text-xs">Compare Anycast Node-04 (UK) performance vs. Global Mesh Average</CardDescription>
                        </div>
                        <Button 
                           size="sm" 
                           className="bg-accent text-background font-bold text-[10px] cyan-glow h-9 px-6"
                           onClick={runPrioritySimulation}
                           disabled={isSimulating}
                        >
                           {isSimulating ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
                           Execute Test
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-4">
                     {isSimulating ? (
                        <div className="py-12 flex flex-col items-center gap-4 opacity-50">
                           <Activity className="h-10 w-10 text-accent animate-pulse" />
                           <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Intercepting Packet Trajectories...</p>
                        </div>
                     ) : simulationResult ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-bold text-accent uppercase">Node-04 Latency (Pro Tier)</p>
                                    <p className="text-xl font-headline font-bold text-white">{simulationResult.node04}ms</p>
                                 </div>
                                 <Progress value={simulationResult.node04 * 2} className="h-1.5 bg-accent/10 [&>div]:bg-accent" />
                              </div>
                              <div className="space-y-2">
                                 <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Global Average (Hobby Tier)</p>
                                    <p className="text-xl font-headline font-bold text-white/60">{simulationResult.avg}ms</p>
                                 </div>
                                 <Progress value={simulationResult.avg} className="h-1.5 bg-white/5 [&>div]:bg-white/40" />
                              </div>
                           </div>
                           <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-center items-center text-center space-y-2 shadow-inner">
                              <div className="p-2 rounded bg-green-500/20 text-green-400">
                                 <ArrowUpRight className="h-6 w-6" />
                              </div>
                              <h4 className="text-2xl font-headline font-bold text-green-400">80.3%</h4>
                              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest leading-relaxed">
                                 LATTENCY OPTIMIZATION <br /> NOMINAL
                              </p>
                           </div>
                        </div>
                     ) : (
                        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-secondary/10">
                           <Unplug className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                           <p className="text-xs text-muted-foreground italic">Ready to run priority routing benchmarks.</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest text-accent">
                      <ShieldCheck className="h-4 w-4" />
                      Infrastructure Audit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                           <span className="text-muted-foreground">Consensus Engine</span>
                           <span className="text-green-400">NOMINAL</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                           <span className="text-muted-foreground">Self-Healing</span>
                           <span className="text-white">ARMED</span>
                        </div>
                        <div className="p-2 rounded border border-accent/20 bg-accent/5 text-[9px] text-accent italic leading-relaxed">
                           "All 42 nodes are currently reporting sub-15ms sync times with the Level 0 Global Ledger."
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

               <Card className="glass-panel border-white/5">
                  <CardHeader className="p-4">
                     <CardTitle className="text-xs uppercase">Compute Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                           <span>EU-Node (Node-04)</span>
                           <span>64%</span>
                        </div>
                        <Progress value={64} className="h-1 bg-white/5 [&>div]:bg-accent" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                           <span>Asia-Node (Node-22)</span>
                           <span>28%</span>
                        </div>
                        <Progress value={28} className="h-1 bg-white/5 [&>div]:bg-primary" />
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
