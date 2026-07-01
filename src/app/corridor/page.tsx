"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Network, 
  Globe, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Unplug,
  ArrowRightLeft,
  RefreshCw,
  MapPin,
  Loader2,
  CloudLightning,
  Milestone,
  ArrowUpRight,
  MonitorCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RemittanceCorridorPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Tunnel Synced",
        description: "Remittance corridor state finalized with 4,200+ nodes.",
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-white">
              <Network className="h-5 w-5 text-accent" />
              Remittance Infrastructure
            </h1>
          </div>
          <Badge variant="outline" className="border-green-500/20 text-green-400 font-mono text-[10px]">
             STATUS: SYNCED
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          {/* Corridor Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[10px] font-bold">
                 Legal & Instant Corridor
              </Badge>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter uppercase italic">
                RubelBank: <span className="text-accent">MY-BD Tunnel</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl italic leading-relaxed">
                "Operating a secure and legally compliant bridge for instant remittance between Malaysia and Bangladesh."
              </p>
            </div>
            <Button size="lg" className="cyan-glow bg-accent text-background font-bold px-8 h-14" onClick={handleManualSync} disabled={isSyncing}>
              {isSyncing ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <CloudLightning className="mr-2 h-5 w-5" />}
              {isSyncing ? "Finalizing Handshake..." : "Manual Sync Tunnel"}
            </Button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Nodes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-white">4,200+</div>
                <p className="text-[9px] text-accent font-bold mt-1 uppercase">Distributed Global Grid</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Interbank Rate</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-white">1 MYR = 27.41 BDT</div>
                <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-1 uppercase">
                   <ArrowUpRight className="h-3 w-3" /> Rate Optimized
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tunnel Health</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-white uppercase tracking-tighter">Excellent</div>
                <Progress value={98} className="h-1 mt-2 bg-blue-400/10 [&>div]:bg-blue-400" />
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Volume (24h)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-white">$12.45M</div>
                <p className="text-[9px] text-green-400 font-bold mt-1 uppercase">Legal Flow Validated</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
               {/* Visual Tunnel Visualization */}
               <Card className="glass-panel border-white/5 relative overflow-hidden min-h-[450px] flex flex-col shadow-2xl">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  <CardHeader className="relative z-10 border-b border-white/5 bg-white/5">
                     <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        Remittance Tunnel: Kuala Lumpur ↔ Dhaka
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 relative z-10 flex flex-col items-center justify-center p-12">
                     <div className="w-full max-w-2xl flex items-center justify-between gap-12">
                        <div className="flex flex-col items-center gap-4">
                           <div className="w-24 h-24 rounded-3xl bg-accent/10 border-2 border-accent flex items-center justify-center cyan-glow">
                              <Globe className="h-10 w-10 text-accent" />
                           </div>
                           <p className="text-xs font-bold text-white uppercase tracking-[0.2em]">MY Node</p>
                        </div>
                        
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-accent via-primary to-green-500 relative flex items-center justify-center">
                           <div className="absolute -top-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-white/10 animate-float shadow-2xl">
                              <Zap className="h-3 w-3 text-accent animate-pulse" />
                              <span className="text-[9px] font-bold text-white uppercase tracking-widest">Instant T+0 Tunnel</span>
                           </div>
                           <div className="w-2 h-2 rounded-full bg-white absolute animate-ping shadow-[0_0_10px_white]" />
                        </div>

                        <div className="flex flex-col items-center gap-4">
                           <div className="w-24 h-24 rounded-3xl bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                              <Building2 className="h-10 w-10 text-green-500" />
                           </div>
                           <p className="text-xs font-bold text-white uppercase tracking-[0.2em]">BD Node</p>
                        </div>
                     </div>

                     <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                           <p className="text-[9px] uppercase font-bold text-muted-foreground">Encryption</p>
                           <p className="text-xs text-white font-mono">AES-256-GCM</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                           <p className="text-[9px] uppercase font-bold text-muted-foreground">Compliance</p>
                           <p className="text-xs text-green-400 font-bold uppercase">SEC_REGISTERED</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                           <p className="text-[9px] uppercase font-bold text-muted-foreground">Last Ping</p>
                           <p className="text-xs text-white">0.04ms ago</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardHeader>
                     <CardTitle className="text-xs uppercase flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        Corridor Security
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p className="text-[10px] text-white/80 leading-relaxed italic border-l-2 border-accent/30 pl-3">
                        "Every transaction passing through the MY-BD tunnel is cryptographically signed by the Sovereign Kernel to prevent spoofing."
                     </p>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                           <span className="text-muted-foreground uppercase">Audit Signature</span>
                           <span className="text-accent font-mono">SHA-256_ACTIVE</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                           <span className="text-muted-foreground uppercase">Double-Spend Guard</span>
                           <span className="text-white">ENABLED</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5 overflow-hidden">
                  <CardHeader className="p-4 bg-white/5">
                     <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                        <MonitorCheck className="h-3.5 w-3.5 text-primary" /> System Metrics
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                           <span>Corridor Capacity</span>
                           <span>94%</span>
                        </div>
                        <Progress value={94} className="h-1 bg-white/5 [&>div]:bg-primary" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                           <span>Node Latency</span>
                           <span className="text-green-400">8.4ms</span>
                        </div>
                        <Progress value={12} className="h-1 bg-white/5 [&>div]:bg-green-400" />
                     </div>
                  </CardContent>
               </Card>

               <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 space-y-3 text-center">
                  <Unplug className="h-8 w-8 text-muted-foreground mx-auto opacity-30" />
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                     Protocol: Remit_Tunnel_V2.8 <br />
                     Sovereign Grid Security Standard
                  </p>
               </div>
            </div>
          </div>
        </main>

        <footer className="p-8 border-t border-white/5 text-center">
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Global Corridor Node • Institutional Infrastructure v1.2.0
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
