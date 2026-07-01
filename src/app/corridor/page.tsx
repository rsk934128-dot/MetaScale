
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
  MonitorCheck,
  Building2
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
        description: "Remittance corridor state finalized.",
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-white">
              <Network className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              Remittance Mesh
            </h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-8 md:space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[8px] md:text-[10px] font-bold">
                 Legal Tunnel Active
              </Badge>
              <h2 className="text-2xl md:text-5xl font-headline font-bold text-white tracking-tighter uppercase italic">
                RubelBank: <span className="text-accent">MY-BD</span>
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm max-w-2xl italic leading-relaxed">
                "Operating a secure bridge for instant remittance."
              </p>
            </div>
            <Button size="sm" className="w-full md:w-auto md:h-14 cyan-glow bg-accent text-background font-bold px-8" onClick={handleManualSync} disabled={isSyncing}>
              {isSyncing ? <RefreshCw className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <CloudLightning className="mr-2 h-4 w-4 md:h-5 md:w-5" />}
              Sync Tunnel
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                <CardTitle className="text-[8px] md:text-[10px] uppercase font-bold text-muted-foreground">Nodes</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-4 pt-0">
                <div className="text-lg md:text-3xl font-bold text-white">4,200+</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                <CardTitle className="text-[8px] md:text-[10px] uppercase font-bold text-muted-foreground">Rate</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-4 pt-0">
                <div className="text-sm md:text-2xl font-bold text-white">27.41</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                <CardTitle className="text-[8px] md:text-[10px] uppercase font-bold text-muted-foreground">Health</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-4 pt-0">
                <Progress value={98} className="h-1 mt-2" />
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
              <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                <CardTitle className="text-[8px] md:text-[10px] uppercase font-bold text-muted-foreground">Volume</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-4 pt-0">
                <div className="text-sm md:text-2xl font-bold text-white">$12.4M</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
               <Card className="glass-panel border-white/5 relative overflow-hidden min-h-[450px] md:min-h-[500px] flex flex-col shadow-2xl">
                  <div className="absolute inset-0 opacity-5 md:opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  <CardHeader className="relative z-10 border-b border-white/5 bg-white/5 p-4 md:p-6">
                     <CardTitle className="text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        KL ↔ Dhaka Tunnel
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 md:p-12">
                     <div className="w-full flex items-center justify-between gap-4 md:gap-12">
                        <div className="flex flex-col items-center gap-4 md:gap-6">
                           <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-accent/10 border-2 border-accent flex items-center justify-center transition-all group-hover:scale-110">
                              <Globe className="h-8 w-8 md:h-10 md:w-10 text-accent" />
                           </div>
                           <p className="text-[9px] md:text-xs font-bold text-white uppercase tracking-widest">MY</p>
                        </div>
                        
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-accent to-green-500 relative flex items-center justify-center">
                           <div className="absolute -top-10 flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-white/10 shadow-2xl">
                              <Zap className="h-3 w-3 text-accent animate-pulse" />
                              <span className="text-[8px] font-bold text-white uppercase">Instant</span>
                           </div>
                           <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white absolute animate-ping shadow-[0_0_15px_white]" />
                        </div>

                        <div className="flex flex-col items-center gap-4 md:gap-6">
                           <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-green-500/10 border-2 border-green-500 flex items-center justify-center transition-all group-hover:scale-110">
                              <Building2 className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
                           </div>
                           <p className="text-[9px] md:text-xs font-bold text-white uppercase tracking-widest">BD</p>
                        </div>
                     </div>

                     <div className="mt-16 md:mt-24 w-full grid grid-cols-3 gap-3 md:gap-6">
                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 border border-white/5 text-center">
                           <p className="text-[7px] md:text-[9px] uppercase font-bold text-muted-foreground">Cipher</p>
                           <p className="text-[9px] md:text-xs text-white font-mono">AES-256</p>
                        </div>
                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 border border-white/5 text-center">
                           <p className="text-[7px] md:text-[9px] uppercase font-bold text-muted-foreground">Node</p>
                           <p className="text-[9px] md:text-xs text-green-400 font-bold uppercase">SEC_OK</p>
                        </div>
                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 border border-white/5 text-center">
                           <p className="text-[7px] md:text-[9px] uppercase font-bold text-muted-foreground">Ping</p>
                           <p className="text-[9px] md:text-xs text-white">8ms</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardHeader className="p-4">
                     <CardTitle className="text-xs uppercase flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        Security
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                     <div className="flex justify-between items-center text-[9px] md:text-[10px] font-bold">
                        <span className="text-muted-foreground">Audit Sig</span>
                        <span className="text-accent font-mono">ACTIVE</span>
                     </div>
                     <div className="flex justify-between items-center text-[9px] md:text-[10px] font-bold">
                        <span className="text-muted-foreground">Guard</span>
                        <span className="text-white">ENABLED</span>
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
