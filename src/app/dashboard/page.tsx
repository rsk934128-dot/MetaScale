
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
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { SystemMode } from "@/lib/kernel/types";
import { Progress } from "@/components/ui/progress";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

export default function SovereignControlPlane() {
  const { mode, setSystemMode, events, emitEvent, processNextEvent, isAutonomousActive } = useKernel();
  const [isSyncing, setIsSyncing] = useState(false);
  const firestore = useFirestore();

  const isLive = useMemo(() => {
    return events.some(e => e.type === 'COMMERCIAL_CHANNELS_OPEN' && e.status === 'COMPLETED');
  }, [events]);

  // Live Payment Ledger Sync
  const paymentsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'payments'), orderBy('eventTime', 'desc'), limit(10));
  }, [firestore]);
  const { data: recentPayments } = useCollection<any>(paymentsQuery);

  const handleSyncAllNodes = () => {
    setIsSyncing(true);
    emitEvent('INFRA', 'GLOBAL_MESH_SYNC', 2, { scope: '42_NODES', protocol: 'ANYCAST_V2' });
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 uppercase italic tracking-tighter text-accent">
              <Globe className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0 animate-logo-spin" />
              <span className="truncate">Mission Control</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isAutonomousActive && (
               <Badge variant="outline" className="hidden sm:flex border-green-500/20 text-green-400 text-[8px] font-mono animate-pulse">
                  <Scale className="mr-1 h-3 w-3" /> FISCAL_OPTIMIZER: ACTIVE
               </Badge>
            )}
            <Button size="sm" onClick={handleSyncAllNodes} disabled={isSyncing} className="cyan-glow text-[10px] font-bold h-8 bg-accent text-background px-2 md:px-3">
              {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1 md:mr-1.5" /> : <Zap className="h-3 w-3 mr-1 md:mr-1.5" />}
              <span className="hidden xs:inline">Sync Mesh</span>
              <span className="xs:hidden">Sync</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
             <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
                <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                   <CardTitle className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-accent" /> Yield
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0">
                   <div className="text-xl md:text-3xl font-headline font-bold text-white">3.5%</div>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
                <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                   <CardTitle className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Target className="h-3 w-3 text-primary" /> Velocity
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0">
                   <div className="text-xl md:text-3xl font-headline font-bold text-white">92.4%</div>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
                <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                   <CardTitle className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Network className="h-3 w-3 text-blue-400" /> Mesh
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0">
                   <div className="text-xl md:text-3xl font-headline font-bold text-white">42/42</div>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
                <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                   <CardTitle className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3 text-green-400" /> Audit
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0">
                   <div className="text-xl md:text-3xl font-headline font-bold text-white">100%</div>
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-7 space-y-6">
               <Card className="glass-panel border-white/5 relative overflow-hidden h-[300px] md:h-[500px] flex flex-col">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  <CardHeader className="border-b border-white/5 bg-white/5 relative z-10 p-4">
                     <div className="flex justify-between items-center">
                        <CardTitle className="text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-2">
                           <Globe className="h-4 w-4 text-accent" />
                           Global Anycast Grid
                        </CardTitle>
                        <Badge variant="outline" className="text-[7px] md:text-[8px] font-mono border-green-500/30 text-green-400">
                          {isLive ? "LIVE_OP" : "NOMINAL"}
                        </Badge>
                     </div>
                  </CardHeader>
                  <CardContent className="flex-1 relative z-10 flex items-center justify-center p-4">
                     <div className="relative w-full max-w-2xl aspect-[2/1] bg-black/20 rounded-2xl md:rounded-3xl border border-white/5 shadow-inner overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                           <div className="w-[80%] h-[80%] rounded-full border border-dashed border-accent/20 animate-logo-spin" />
                        </div>
                        <div className="absolute inset-0 p-4 md:p-12">
                           <div className="grid grid-cols-6 gap-3 md:gap-8 h-full place-items-center">
                              {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="relative">
                                   <div className={cn(
                                     "w-1 md:w-1.5 h-1 md:h-1.5 rounded-full shadow-[0_0_10px_currentColor] animate-pulse",
                                     i % 7 === 0 ? "text-primary" : i % 5 === 0 ? "text-green-400" : "text-accent"
                                   )} />
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 space-y-1">
                           <p className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">Active Node-04 (UK)</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-5 space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl h-[400px] md:h-[500px] flex flex-col">
                  <CardHeader className="p-4 md:p-6 border-b border-white/10">
                     <CardTitle className="text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-2 text-accent">
                        <CreditCard className="h-4 w-4" />
                        Payment Ledger
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                     <ScrollArea className="h-full">
                        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                           {(!recentPayments || recentPayments.length === 0) ? (
                             <div className="h-40 flex items-center justify-center text-[9px] uppercase font-bold text-muted-foreground italic opacity-20">Awaiting Signals...</div>
                           ) : recentPayments.map((payment) => (
                             <div key={payment.id} className="p-2 md:p-3 rounded-lg border border-white/5 bg-secondary/20 flex items-start gap-2 md:gap-3 transition-all hover:border-accent/30">
                                <div className={cn(
                                  "w-1 h-6 md:h-8 rounded-full mt-1 shrink-0",
                                  payment.status === 'PAID' || payment.status === 'CREDITED' ? 'bg-green-400' : 'bg-red-400'
                                )} />
                                <div className="flex-1 min-w-0">
                                   <div className="flex justify-between items-center mb-0.5">
                                      <span className="text-[8px] md:text-[9px] font-bold text-white uppercase truncate">{payment.provider}</span>
                                      <span className="text-[8px] font-mono text-accent">+{payment.amount}</span>
                                   </div>
                                   <div className="flex items-center justify-between gap-1.5">
                                      <span className="text-[7px] md:text-[8px] text-muted-foreground truncate">ID: {payment.externalTxnId.substring(0, 8)}...</span>
                                      <Badge variant="ghost" className="text-[6px] md:text-[7px] px-1 py-0 border-white/10 uppercase opacity-50">{payment.status}</Badge>
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
      </SidebarInset>
    </div>
  );
}
