
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
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MOCK_NODES = Array.from({ length: 42 }, (_, i) => ({
  id: `NODE-${i + 1 < 10 ? '0' : ''}${i + 1}`,
  status: Math.random() > 0.1 ? 'ONLINE' : 'DEGRADED',
  load: Math.floor(Math.random() * 60) + 20,
  latency: Math.floor(Math.random() * 15) + 5,
}));

export default function InfrastructureMeshPage() {
  const [isSyncing, setIsSyncing] = useState(false);
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
              <h2 className="text-3xl font-headline font-bold mb-2">42-Node Distributed Grid</h2>
              <p className="text-muted-foreground">Monitoring self-healing network capacity and geo-distributed anycast nodes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Grid Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">100%</div>
                <p className="text-[10px] text-accent mt-1 uppercase font-bold tracking-tighter">Availability: Optimal</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Mesh Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42.8%</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">Avg Capacity Used</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Latency (Anycast)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.4ms</div>
                <p className="text-[10px] text-blue-400 mt-1 uppercase font-bold tracking-tighter">Global Response Time</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Compute Power</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.8 Petahash</div>
                <p className="text-[10px] text-green-400 mt-1 uppercase font-bold tracking-tighter">Consensus Engine Active</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel">
               <CardHeader>
                 <CardTitle className="text-sm">Self-Healing Protocols</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 {[
                   { name: "Node Failover", status: "Armed" },
                   { name: "Anycast Rerouting", status: "Active" },
                   { name: "Mesh Balancing", status: "Standby" }
                 ].map((p, i) => (
                   <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                      <span className="text-[10px] font-bold uppercase">{p.name}</span>
                      <Badge variant="outline" className="text-[8px] bg-accent/10 text-accent">{p.status}</Badge>
                   </div>
                 ))}
               </CardContent>
            </Card>

            <Card className="lg:col-span-2 glass-panel border-accent/20">
               <CardHeader>
                 <CardTitle className="text-sm">Global Traffic Analysis</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="h-40 border border-white/5 rounded-xl bg-black/20 relative flex items-center justify-center">
                    <p className="text-xs text-muted-foreground italic">Interactive Flow Visualizer (Simulation Mode)</p>
                    {/* Abstract connection lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                      <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="hsl(var(--accent))" strokeWidth="1" strokeDasharray="5,5" />
                      <line x1="90%" y1="10%" x2="10%" y2="90%" stroke="hsl(var(--accent))" strokeWidth="1" strokeDasharray="5,5" />
                    </svg>
                 </div>
               </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
