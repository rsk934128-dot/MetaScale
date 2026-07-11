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
  ChevronRight,
  CreditCard,
  Scale,
  Hammer,
  Radar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { SystemMode } from "@/lib/kernel/types";
import { Progress } from "@/components/ui/progress";
import { useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { YieldFlow } from "@/components/charts/YieldFlow";
import { HunterStream } from "@/components/dashboard/HunterStream";

export default function SovereignControlPlane() {
  const { mode, setSystemMode, events, emitEvent, processNextEvent, isAutonomousActive } = useKernel();
  const [isSyncing, setIsSyncing] = useState(false);
  const firestore = useFirestore();

  const [isAutoMaintenance, setIsAutoMaintenance] = useState(false);
  useEffect(() => {
    const checkTime = () => {
      const hours = new Date().getUTCHours();
      setIsAutoMaintenance(hours >= 21 || hours < 2);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const configRef = useMemo(() => firestore ? doc(firestore, 'system', 'config') : null, [firestore]);
  const { data: systemConfig } = useDoc<any>(configRef);
  const isMaintenanceActive = systemConfig?.maintenance || isAutoMaintenance;

  const handleSyncAllNodes = () => {
    setIsSyncing(true);
    emitEvent('INFRA', 'GLOBAL_MESH_SYNC', 2, { scope: '42_NODES', protocol: 'ANYCAST_V2' });
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background relative w-full overflow-x-hidden">
      {isMaintenanceActive && (
        <div className="absolute inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-6 text-center animate-fade-in">
           <div className="max-w-md space-y-6">
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center mx-auto animate-pulse">
                <Hammer className="h-10 w-10 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter">System Under Maintenance</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                সোভারেন কার্নেল বর্তমানে আপগ্রেড করা হচ্ছে। শিডিউল: ২১:০০ - ০২:০০ ইউটিসি। জরুরি প্রয়োজনে টেলিগ্রাম কমান্ড ব্যবহার করুন।
              </p>
              <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 font-mono text-[10px] text-accent">
                &gt;&gt; CIRCUIT_BREAKER: ACTIVE (RESTRICTED_MODE)
              </div>
              <Button asChild variant="outline" className="border-accent/20 text-accent font-bold uppercase text-[10px]">
                <a href="https://t.me/Coolrubelbank2bot" target="_blank" rel="noopener noreferrer">Contact Control Bot</a>
              </Button>
           </div>
        </div>
      )}

      <AppSidebar />
      <SidebarInset className="w-full max-w-none">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-8 w-full">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 uppercase italic tracking-tighter text-accent">
              <Radar className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0 animate-pulse" />
              <span className="truncate">Operational Command Center</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSyncAllNodes} disabled={isSyncing} className="cyan-glow text-[10px] font-bold h-8 bg-accent text-background px-4">
              {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <Zap className="h-3 w-3 mr-1.5" />}
              <span className="hidden xs:inline">Sync All Nodes</span>
              <span className="xs:hidden">Sync</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 md:p-8 w-full max-w-none">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full">
             <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-accent" /> Total Yield
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-2xl md:text-4xl font-headline font-bold text-white">$12.4M</div>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Target className="h-3 w-3 text-primary" /> Mesh Efficiency
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-2xl md:text-4xl font-headline font-bold text-white">99.9%</div>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-red-500 bg-red-500/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <ShieldAlert className="h-3 w-3 text-red-400" /> Threats Blocked
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-2xl md:text-4xl font-headline font-bold text-white">142</div>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3 text-green-400" /> Audit Integrity
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-2xl md:text-4xl font-headline font-bold text-white">100%</div>
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full">
            <div className="lg:col-span-8 space-y-6">
               <Card className="glass-panel border-white/5 relative overflow-hidden h-[400px] md:h-[500px] flex flex-col">
                  <CardHeader className="border-b border-white/5 bg-white/5 relative z-10 p-6">
                     <div className="flex justify-between items-center">
                        <CardTitle className="text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                           <Activity className="h-4 w-4 text-accent" />
                           Dynamic Yield Flow
                        </CardTitle>
                        <Badge variant="outline" className="text-[8px] font-mono border-accent/30 text-accent">P43_REASONING_ACTIVE</Badge>
                     </div>
                  </CardHeader>
                  <CardContent className="flex-1 relative z-10 p-6">
                     <YieldFlow />
                  </CardContent>
               </Card>

               <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden">
                  <CardHeader className="p-6 border-b border-white/5">
                     <div className="flex justify-between items-center">
                        <CardTitle className="text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 text-accent">
                           <Network className="h-4 w-4" />
                           Anycast Global Mesh (42 Nodes)
                        </CardTitle>
                     </div>
                  </CardHeader>
                  <CardContent className="p-8">
                     <div className="grid grid-cols-6 md:grid-cols-14 gap-4 md:gap-8 h-full place-items-center opacity-40">
                        {Array.from({ length: 42 }).map((_, i) => (
                          <div key={i} className="relative">
                             <div className={cn(
                               "w-2 md:w-3 h-2 md:h-3 rounded-full shadow-[0_0_10px_currentColor] animate-pulse",
                               i % 7 === 0 ? "text-primary" : "text-accent"
                             )} />
                          </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl h-[400px] md:h-[770px] flex flex-col">
                  <CardHeader className="p-6 border-b border-white/10">
                     <CardTitle className="text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-2 text-accent">
                        <ShieldAlert className="h-4 w-4" />
                        Hunter Mode Live Feed
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 overflow-hidden">
                     <HunterStream />
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}