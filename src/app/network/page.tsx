
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
  Filter,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { negotiateNetworkTrust } from "@/ai/flows/analyze-network-trust";
import { cn } from "@/lib/utils";

const MOCK_NODES = [
  { id: "Rubelpay", type: "Owner", score: 75.4, status: "Limited", links: 3 },
  { id: "Vendor-UK-01", type: "Partner", score: 88.0, status: "Full", links: 1 },
  { id: "Subsidiary-BD", type: "Sub", score: 42.1, status: "Hard Block", links: 1 },
  { id: "Global-Treasury", type: "Core", score: 98.2, status: "Full", links: 5 },
];

export default function NetworkIntelligence() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState<any>(null);
  
  const { toast } = useToast();
  const { emitEvent } = useKernel();

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

  const handleApproveCorridor = async () => {
    setIsApproving(true);
    setNegotiationResult(null);
    
    try {
      // Evaluating trust between Rubelpay (Source) and Vendor-UK-01 (Target)
      const result = await negotiateNetworkTrust({
        sourceEntity: { 
          id: 'Rubelpay', 
          trustScore: 75.4, 
          jurisdiction: 'Bangladesh', 
          complianceStatus: 'VERIFIED' 
        },
        targetEntity: { 
          id: 'Vendor-UK-01', 
          trustScore: 88.0, 
          jurisdiction: 'United Kingdom', 
          complianceStatus: 'VERIFIED' 
        },
        requestedCorridorType: 'instant'
      });

      setNegotiationResult(result);
      
      emitEvent('FINANCE', 'TRUST_CORRIDOR_NEGOTIATED', 2, { 
        status: result.negotiationStatus,
        score: result.mutualTrustScore
      });

      toast({
        title: result.negotiationStatus === 'approved' ? "Corridor Approved" : "Manual Review Required",
        description: `Mutual Trust Score calculated at ${result.mutualTrustScore}.`,
        variant: result.negotiationStatus === 'rejected' ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Negotiation Error",
        description: "The AI Negotiation Engine could not establish a secure corridor.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Network className="h-5 w-5 text-accent" />
              Sovereign Financial Network (SSFN-ITP)
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-accent/20 text-accent">
              <Globe className="mr-1 h-3 w-3" /> 4 Active Nodes
            </Badge>
            <Button size="sm" onClick={handleNetworkSync} disabled={isSyncing} className="cyan-glow text-xs font-bold bg-accent text-background">
              {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
              Re-Negotiate Trust
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2 uppercase italic tracking-tighter">Inter-Entity <span className="text-accent">Trust Map</span></h2>
              <p className="text-muted-foreground italic">"Managing autonomous trust corridors and federated KYB synchronization."</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search node or wallet..." className="pl-9 h-9 bg-secondary/30 border-white/5 text-xs" />
               </div>
               <Button variant="outline" size="sm" className="border-white/5"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Network Integrity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">82.1</div>
                <p className="text-[10px] text-accent mt-1 uppercase font-bold tracking-tighter">Corridor Stability: Optimal</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Pending Negotiatons</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">2</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">Avg Response Time: 4h</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500 bg-red-500/5">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Propagation Risk</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">High</div>
                <p className="text-[10px] text-red-400 mt-1 uppercase font-bold">1 Node Under Critical Review</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-400 bg-green-500/5">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Settled Volume</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">$1.24M</div>
                <p className="text-[10px] text-green-400 mt-1 uppercase font-bold">+12% vs Prev Cycle</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Activity className="h-5 w-5 text-accent" />
                  Dynamic Trust Graph
                </CardTitle>
                <CardDescription className="text-[10px]">Visualizing bidirectional trust and risk propagation across the network.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-12">
                <div className="h-[350px] border border-white/5 rounded-3xl bg-black/20 relative flex items-center justify-center overflow-hidden shadow-inner">
                   <div className="relative z-10 w-full max-w-lg p-12">
                      <div className="grid grid-cols-2 gap-20">
                         {MOCK_NODES.map((node, i) => (
                           <div key={i} className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: `${i*0.2}s` }}>
                              <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-700",
                                node.status === 'Full' ? 'bg-green-500/10 border-green-500 cyan-glow' : 
                                node.status === 'Limited' ? 'bg-yellow-500/10 border-yellow-500' : 
                                'bg-red-500/10 border-red-500'
                              )}>
                                 {node.type === 'Owner' ? <Users2 className="h-8 w-8 text-yellow-500" /> : <Globe className="h-8 w-8 text-accent" />}
                              </div>
                              <div className="text-center">
                                 <p className="text-xs font-bold text-white uppercase tracking-tighter">{node.id}</p>
                                 <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">{node.status} ({node.score})</p>
                              </div>
                           </div>
                         ))}
                      </div>
                      
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: -1 }}>
                         <line x1="25%" y1="25%" x2="75%" y2="75%" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="5,5" />
                         <line x1="25%" y1="75%" x2="75%" y2="25%" stroke="hsl(var(--accent))" strokeWidth="1" />
                         <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="hsl(var(--accent))" strokeWidth="1" opacity="0.5" />
                      </svg>
                   </div>

                   <div className="absolute bottom-4 right-4 space-y-2 p-3 rounded-lg bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_currentColor]" /> <span className="text-[8px] font-bold uppercase text-white/70">Trusted Corridor</span></div>
                      <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_5px_currentColor]" /> <span className="text-[8px] font-bold uppercase text-white/70">Restricted Flow</span></div>
                      <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_currentColor]" /> <span className="text-[8px] font-bold uppercase text-white/70">Disconnected</span></div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest text-accent">
                      <Zap className="h-4 w-4 text-accent" />
                      Trust Negotiator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     <p className="text-[10px] text-white/80 leading-relaxed italic border-l-2 border-accent/30 pl-3">
                        "Evaluating trust upgrade for 'Vendor-UK-01'. Target Score: 88.0. Jurisdiction: UK (Mainnet Corridor)."
                     </p>

                     {negotiationResult ? (
                        <div className="space-y-3 animate-fade-in">
                           <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                              <div className="flex justify-between items-center">
                                 <span className="text-[9px] font-bold text-muted-foreground uppercase">Status</span>
                                 <Badge className={cn(
                                    "text-[8px] uppercase font-bold",
                                    negotiationResult.negotiationStatus === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'
                                 )}>
                                    {negotiationResult.negotiationStatus}
                                 </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-[9px] font-bold text-muted-foreground uppercase">Mutual Score</span>
                                 <span className="text-sm font-headline font-bold text-accent">{negotiationResult.mutualTrustScore}</span>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[8px] font-bold uppercase text-muted-foreground">Constraints</p>
                              {negotiationResult.corridorConstraints.map((c: string, i: number) => (
                                 <div key={i} className="flex items-center gap-2 text-[9px] text-white/60">
                                    <ShieldCheck className="h-2.5 w-2.5 text-accent" /> {c}
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : null}

                     <Button 
                        className="w-full h-10 text-[10px] font-bold cyan-glow bg-accent text-background uppercase tracking-widest"
                        onClick={handleApproveCorridor}
                        disabled={isApproving}
                     >
                        {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
                        {isApproving ? 'Negotiating...' : 'Approve Corridor'}
                     </Button>
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                  <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                      <Lock className="h-4 w-4 text-red-400" />
                      Federated KYB Sync
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="divide-y divide-white/5">
                        {[
                          { node: "Rubelpay", provider: "Sumsub", status: "Synced" },
                          { node: "Vendor-UK", provider: "Manual", status: "Outdated" },
                          { node: "Sub-BD", provider: "Vault", status: "Synced" }
                        ].map((item, i) => (
                          <div key={i} className="p-3 flex justify-between items-center hover:bg-white/5 transition-colors">
                             <span className="text-[10px] font-bold uppercase text-white/70">{item.node}</span>
                             <Badge variant="outline" className={cn(
                                "text-[8px] border-none font-bold uppercase",
                                item.status === 'Synced' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'
                             )}>
                               {item.status}
                             </Badge>
                          </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
        
        <footer className="p-8 border-t border-white/5 text-center">
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Sovereign OS • SSFN Trust Negotiation Layer v1.2.0
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
