
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
  Radar,
  Power,
  Sparkles,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { SystemMode } from "@/lib/kernel/types";
import { Progress } from "@/components/ui/progress";
import { useFirestore, useCollection, useDoc, useUser } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { YieldFlow } from "@/components/charts/YieldFlow";
import { HunterStream } from "@/components/dashboard/HunterStream";
import { useToast } from "@/hooks/use-toast";
import { generateDailyPulse } from "@/ai/flows/daily-integrity-report-flow";
import { sendPulseReport } from "@/lib/telegram";

export default function SovereignControlPlane() {
  const { mode, setSystemMode, events, emitEvent, heartbeat, isAutonomousActive, startAutonomousWorker } = useKernel();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUpdatingKillSwitch, setIsUpdatingKillSwitch] = useState(false);
  const [isSendingPulse, setIsSendingPulse] = useState(false);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const configRef = useMemo(() => firestore ? doc(firestore, 'system', 'config') : null, [firestore]);
  const { data: systemConfig } = useDoc<any>(configRef);

  const ubilEventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ubil_events'), orderBy('timestamp', 'desc'), limit(10));
  }, [firestore]);
  const { data: remoteEvents } = useCollection<any>(ubilEventsQuery);

  const handleSyncAllNodes = () => {
    setIsSyncing(true);
    emitEvent('INFRA', 'GLOBAL_MESH_SYNC', 2, { scope: '42_NODES', protocol: 'ANYCAST_V2' });
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  const handleDispatchPulse = async () => {
    if (!firestore || !user?.uid) return;
    setIsSendingPulse(true);
    
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (!userData?.telegramChatId) {
        toast({ variant: "destructive", title: "Gateway Unlinked", description: "প্রথমে টেলিগ্রাম আইডি লিঙ্ক করুন।" });
        setIsSendingPulse(false);
        return;
      }

      const reportText = await generateDailyPulse({
        activeNodes: heartbeat.filter(n => n.status === 'ONLINE').length,
        newConnections: 42,
        totalTransactions: remoteEvents?.length || 0,
        yieldRecycled: 42.5,
        systemStatus: 'OPERATIONAL (Mil-Spec)'
      });

      await sendPulseReport(userData.telegramChatId, reportText);
      
      emitEvent('FINANCE', 'DAILY_PULSE_DISPATCHED', 3, { chatId: userData.telegramChatId });
      toast({ title: "Pulse Report Dispatched", description: "Executive summary sent to Telegram." });
    } catch (err) {
      toast({ variant: "destructive", title: "Pulse Error", description: "Reasoning node timeout." });
    } finally {
      setIsSendingPulse(false);
    }
  };

  const toggleKillSwitch = async () => {
    if (!firestore || !user) return;
    setIsUpdatingKillSwitch(true);
    
    const nextMaintenanceState = !systemConfig?.maintenance;
    
    try {
      await setDoc(doc(firestore, 'system', 'config'), { 
        maintenance: nextMaintenanceState,
        updatedAt: Date.now(),
        updatedBy: user.email || user.uid,
        source: 'DASHBOARD_OVERRIDE'
      }, { merge: true });

      emitEvent('SECURITY', 'KILL_SWITCH_TRIGGERED', 1, { 
        active: nextMaintenanceState,
        priority: 'CRITICAL',
        authorizedBy: user.email
      });

      toast({
        title: nextMaintenanceState ? "EMERGENCY LOCKDOWN ACTIVE" : "SYSTEM RESTORED",
        description: nextMaintenanceState ? "All payment gateways are now isolated." : "Global rails are back online.",
        variant: nextMaintenanceState ? "destructive" : "default"
      });
    } catch (err: any) {
      console.error("Override Error:", err);
      toast({ 
        variant: "destructive", 
        title: "Override Failed", 
        description: err.code === 'permission-denied' ? "Permission Denied: Admin role required." : "Signal interrupted." 
      });
    } finally {
      setIsUpdatingKillSwitch(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative w-full overflow-x-hidden">
      {systemConfig?.maintenance && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-6 text-center animate-fade-in">
           <div className="max-w-md space-y-6">
              <div className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto animate-pulse">
                <ShieldAlert className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter">Emergency Lockdown</h2>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "Sovereign Kernel is currently isolated via Imperial Kill Switch. No transactions are being authorized."
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                   className="bg-red-500 text-white font-bold h-12 uppercase text-xs"
                   onClick={toggleKillSwitch}
                   disabled={isUpdatingKillSwitch}
                >
                   {isUpdatingKillSwitch ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Power className="h-4 w-4 mr-2" />}
                   Disable Kill Switch
                </Button>
                <p className="text-[9px] text-muted-foreground font-mono">CODE: ISO_LOCKDOWN_P180</p>
              </div>
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
            <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "border-primary/30 text-primary font-bold text-[8px] md:text-[10px] h-8",
                  isSendingPulse && "opacity-50"
                )}
                onClick={handleDispatchPulse}
                disabled={isSendingPulse}
             >
                {isSendingPulse ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                <span className="hidden xs:inline">Daily Pulse</span>
                <span className="xs:hidden">Pulse</span>
             </Button>
            <Button 
              variant="outline"
              size="sm" 
              className={cn(
                "font-bold text-[9px] uppercase h-8 px-4 transition-all",
                systemConfig?.maintenance ? "border-red-500/50 text-red-500" : "border-white/10 text-muted-foreground hover:text-red-400"
              )}
              onClick={toggleKillSwitch}
              disabled={isUpdatingKillSwitch}
            >
              <Power className="h-3 w-3 mr-1.5" />
              Kill Switch
            </Button>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <Button size="sm" onClick={handleSyncAllNodes} disabled={isSyncing} className="cyan-glow text-[10px] font-bold h-8 bg-accent text-background px-4">
              {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <Zap className="h-3 w-3 mr-1.5" />}
              <span className="hidden xs:inline">Sync Nodes</span>
              <span className="xs:hidden">Sync</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 md:p-8 w-full max-w-none">
          <div className="flex items-center gap-4 mb-2">
             <Badge className={cn(
               "h-7 px-4 text-[9px] font-bold uppercase tracking-widest",
               isAutonomousActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
             )}>
                <Bot className="h-3.5 w-3.5 mr-2" />
                Autonomous Controller: {isAutonomousActive ? 'ACTIVE' : 'IDLE'}
             </Badge>
             {!isAutonomousActive && (
               <Button variant="ghost" size="sm" className="h-7 text-[8px] font-bold uppercase text-accent" onClick={startAutonomousWorker}>
                  Activate Night-Watchman
               </Button>
             )}
          </div>

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
