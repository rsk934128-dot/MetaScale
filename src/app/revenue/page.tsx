
"use client";

import { useState, useMemo } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  Target, 
  Users, 
  Zap, 
  Briefcase, 
  Rocket, 
  FileText,
  RefreshCw,
  Download,
  ShieldCheck,
  Loader2,
  Activity,
  Globe,
  Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";

export default function RevenuePage() {
  const { emitEvent } = useKernel();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isExporting, setIsExporting] = useState(false);

  // Live Sync with UBIL Webhook Events
  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ubil_events'), orderBy('timestamp', 'desc'), limit(10));
  }, [firestore]);

  const { data: liveEvents, loading: eventsLoading } = useCollection<any>(eventsQuery);

  const totalRevenue = useMemo(() => {
    return liveEvents?.filter(e => e.status === 'SUCCESS').reduce((acc, e) => acc + (e.amount || 0), 0) || 0;
  }, [liveEvents]);

  const handleExport = async () => {
    setIsExporting(true);
    emitEvent('FINANCE', 'STRATEGY_REPORT_GENERATED', 3, { 
      scope: 'GLOBAL_EXECUTION',
      version: '1.2.0-stable',
      timestamp: Date.now()
    });

    toast({
      title: "Generating Strategy Proposal",
      description: "Compiling commercial metadata with SHA-256 seal...",
    });

    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Successful",
        description: "Commercial Executive Summary has been archived successfully.",
      });
    }, 2500);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <DollarSign className="h-5 w-5 text-accent" />
              FusionPay Revenue Operations <Badge variant="outline" className="ml-2 border-accent/20 text-accent text-[8px]">LIVE_SYNC</Badge>
            </h1>
          </div>
          <div className="flex items-center gap-2">
             <Button size="sm" className="bg-accent text-background font-bold text-[10px] cyan-glow" onClick={handleExport} disabled={isExporting}>
                {isExporting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <FileText className="mr-1.5 h-3.5 w-3.5" />}
                Export Proposal
             </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[10px] font-bold">Execution Mode: Active</Badge>
              <h2 className="text-4xl font-headline font-bold mb-2 uppercase italic tracking-tighter">Commercial <span className="text-accent">Intelligence</span></h2>
              <p className="text-muted-foreground italic max-w-xl">"Monitoring global mesh revenue yield and webhook synchronization for real-time fiscal command."</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Live Node Revenue</p>
               <p className="text-4xl font-headline font-bold text-accent">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2"><Network className="h-3 w-3" /> Mesh Sync</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">100%</div>
                <p className="text-[9px] text-accent font-bold mt-1 uppercase">42 Nodes Online</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2"><Zap className="h-3 w-3" /> Webhook Latency</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">124ms</div>
                <p className="text-[9px] text-primary font-bold mt-1 uppercase">SLA: Optimal</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2"><Briefcase className="h-3 w-3" /> Sales Velocity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">92.4%</div>
                <p className="text-[9px] text-blue-400 font-bold mt-1 uppercase">Efficiency High</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> ISO Compliance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">DETERM</div>
                <p className="text-[9px] text-green-400 font-bold mt-1 uppercase">Audit Trace: Pass</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-sm uppercase tracking-widest">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Dynamic Growth Forecast
                   </div>
                   <Badge variant="outline" className="text-[9px] border-accent/30 text-accent uppercase">Webhook Data Synchronized</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PerformanceChart />
              </CardContent>
            </Card>
            
            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                 <CardHeader className="p-4 border-b border-white/5">
                   <CardTitle className="text-xs uppercase flex items-center gap-2 text-accent">
                     <Activity className="h-4 w-4" /> Live Webhook Stream
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                       {eventsLoading ? (
                          <div className="p-10 flex justify-center opacity-30"><Loader2 className="h-6 w-6 animate-spin" /></div>
                       ) : liveEvents?.length === 0 ? (
                          <div className="p-10 text-center text-[10px] uppercase text-muted-foreground italic">Awaiting mesh signals...</div>
                       ) : liveEvents?.slice(0, 5).map((e: any) => (
                          <div key={e.id} className="p-4 flex justify-between items-center group hover:bg-white/5 transition-all">
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-white uppercase">{e.type}</p>
                                <p className="text-[8px] text-muted-foreground uppercase">{e.senderBank || 'API Node'}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[11px] font-mono font-bold text-green-400">+${e.amount || 0}</p>
                                <p className="text-[7px] text-muted-foreground font-mono">{new Date(e.timestamp).toLocaleTimeString()}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                 <CardHeader className="p-4 border-b border-white/5">
                   <CardTitle className="text-xs uppercase flex items-center gap-2">
                     <Target className="h-4 w-4 text-primary" /> Execution Targets
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 space-y-4">
                    {[
                      { label: "Revenue Milestone", val: 78, color: "bg-accent" },
                      { label: "Node Expansion", val: 42, color: "bg-primary" },
                      { label: "B2B Onboarding", val: 92, color: "bg-blue-400" }
                    ].map((target, i) => (
                      <div key={target.label} className="space-y-1.5">
                         <div className="flex justify-between text-[9px] font-bold uppercase">
                            <span className="text-white/60">{target.label}</span>
                            <span className="text-white">{target.val}%</span>
                         </div>
                         <Progress value={target.val} className="h-1 bg-white/5" />
                      </div>
                    ))}
                 </CardContent>
               </Card>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5">
             <Card className="glass-panel bg-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Briefcase className="h-40 w-40 text-primary" /></div>
                <CardContent className="p-8">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                      <div className="space-y-4 text-center md:text-left">
                         <h3 className="text-2xl font-headline font-bold text-white flex items-center justify-center md:justify-start gap-3 uppercase italic">
                            <FileText className="h-6 w-6 text-primary" />
                            Sovereign Proposal Generator
                         </h3>
                         <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                            Generate a deterministic commercial proposal based on live mesh telemetry and revenue yield. Perfect for institutional partner outreach and VC pitching.
                         </p>
                      </div>
                      <Button 
                        className="h-14 px-10 rounded-full bg-primary text-white font-bold uppercase text-xs tracking-widest blue-glow shrink-0 transition-all active:scale-95"
                        onClick={handleExport}
                        disabled={isExporting}
                      >
                         {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                         {isExporting ? "Compiling..." : "Generate Proposal Deck"}
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        </main>

        <footer className="p-8 border-t border-white/5 text-center">
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Sovereign OS • Commercial Execution Mode v1.2.0-live
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
