
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Network, 
  Globe, 
  Activity, 
  ShieldCheck, 
  Users2, 
  Zap, 
  Lock, 
  Scale,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MOCK_NODES = [
  { id: "Rubelpay", type: "Owner", score: 75.4, status: "Limited", links: 3 },
  { id: "Vendor-UK-01", type: "Partner", score: 88.0, status: "Full", links: 1 },
  { id: "Subsidiary-BD", type: "Sub", score: 42.1, status: "Hard Block", links: 1 },
  { id: "Global-Treasury", type: "Core", score: 98.2, status: "Full", links: 5 },
];

export default function NetworkIntelligence() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleNetworkSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Network Trust Map Rebuilt",
        description: "Synchronized federated KYB with 4 partner nodes.",
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
              Sovereign Financial Network (SSFN-ITP)
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-accent/20 text-accent">
              <Globe className="mr-1 h-3 w-3" /> 4 Active Nodes
            </Badge>
            <Button size="sm" onClick={handleNetworkSync} disabled={isSyncing} className="cyan-glow text-xs font-bold">
              {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
              Re-Negotiate Trust
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Inter-Entity Trust Map</h2>
              <p className="text-muted-foreground">Managing autonomous trust corridors and federated KYB synchronization.</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search node or wallet..." className="pl-9 h-9 bg-secondary/30" />
               </div>
               <Button variant="outline" size="sm"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Network Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">82.1</div>
                <p className="text-[10px] text-accent mt-1 uppercase font-bold tracking-tighter">Corridor Stability: Optimal</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Pending Negotiatons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">Avg Response Time: 4h</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Propagation Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">High</div>
                <p className="text-[10px] text-red-400 mt-1 uppercase font-bold">1 Node Under Critical Review</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Settled Volume (Network)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1.24M</div>
                <p className="text-[10px] text-green-400 mt-1 uppercase font-bold">+12% vs Prev Cycle</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Dynamic Trust Graph
                </CardTitle>
                <CardDescription>Visualizing bidirectional trust and risk propagation across the network.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] border border-white/5 rounded-xl bg-black/20 relative flex items-center justify-center overflow-hidden">
                   {/* Mock Graph Visualization */}
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                   
                   <div className="relative z-10 w-full max-w-lg p-12">
                      <div className="grid grid-cols-2 gap-20">
                         {MOCK_NODES.map((node, i) => (
                           <div key={i} className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: `${i*0.2}s` }}>
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                                node.status === 'Full' ? 'bg-green-500/10 border-green-500 cyan-glow' : 
                                node.status === 'Limited' ? 'bg-yellow-500/10 border-yellow-500' : 
                                'bg-red-500/10 border-red-500'
                              }`}>
                                 {node.type === 'Owner' ? <Users2 className="h-8 w-8 text-yellow-500" /> : <Globe className="h-8 w-8 text-accent" />}
                              </div>
                              <div className="text-center">
                                 <p className="text-xs font-bold text-white">{node.id}</p>
                                 <p className="text-[9px] text-muted-foreground uppercase">{node.status} ({node.score})</p>
                              </div>
                           </div>
                         ))}
                      </div>
                      
                      {/* Abstract connection lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: -1 }}>
                         <line x1="25%" y1="25%" x2="75%" y2="75%" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="5,5" />
                         <line x1="25%" y1="75%" x2="75%" y2="25%" stroke="hsl(var(--accent))" strokeWidth="1" />
                         <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="hsl(var(--accent))" strokeWidth="1" opacity="0.5" />
                      </svg>
                   </div>

                   <div className="absolute bottom-4 right-4 space-y-2">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> <span className="text-[10px]">Trusted Corridor</span></div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> <span className="text-[10px]">Restricted Flow</span></div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-[10px]">Disconnected</span></div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Trust Negotiator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        "Evaluating trust upgrade for 'Vendor-UK-01'. Proposed Mutual Score: 84. Suggesting Instant Settlement Corridor activation."
                     </p>
                     <Button className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                        Approve Corridor
                     </Button>
                  </CardContent>
               </Card>

               <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lock className="h-4 w-4 text-red-400" />
                      Federated KYB Sync
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     {[
                       { node: "Rubelpay", provider: "Sumsub", status: "Synced" },
                       { node: "Vendor-UK", provider: "Manual", status: "Outdated" },
                       { node: "Sub-BD", provider: "Vault", status: "Synced" }
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                          <span className="text-[10px] font-bold">{item.node}</span>
                          <Badge variant="outline" className={`text-[8px] ${item.status === 'Synced' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {item.status}
                          </Badge>
                       </div>
                     ))}
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
