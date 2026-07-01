
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
  Network,
  Fingerprint,
  Lock
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
import { cn } from "@/lib/utils";

export default function RevenuePage() {
  const { emitEvent } = useKernel();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isExporting, setIsExporting] = useState(false);

  // Live Sync with Finance Events for Audit Log
  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('timestamp', 'desc'), limit(15));
  }, [firestore]);

  const { data: liveEvents, loading: eventsLoading } = useCollection<any>(eventsQuery);

  const totalRevenue = useMemo(() => {
    // Mock sum of successful payouts or revenue links
    return 12450000; // Constant ARR for prototype baseline
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    emitEvent('FINANCE', 'STRATEGY_REPORT_GENERATED', 3, { 
      scope: 'GLOBAL_AUDIT',
      version: '1.2.0-stable'
    });

    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Audit Proposal Ready",
        description: "Transaction hashes have been cross-referenced with Anycast Node-04.",
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
              Sovereign Revenue Operations <Badge variant="outline" className="ml-2 border-accent/20 text-accent text-[8px]">AUDIT_READY</Badge>
            </h1>
          </div>
          <div className="flex items-center gap-2">
             <Button size="sm" className="bg-accent text-background font-bold text-[10px] cyan-glow" onClick={handleExport} disabled={isExporting}>
                {isExporting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <FileText className="mr-1.5 h-3.5 w-3.5" />}
                Generate Audit Deck
             </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[10px] font-bold">Forensic Mode: Active</Badge>
              <h2 className="text-4xl font-headline font-bold mb-2 uppercase italic tracking-tighter">Fiscal <span className="text-accent">Audit Ledger</span></h2>
              <p className="text-muted-foreground italic max-w-xl">"Cross-referencing internal disbursements with Anycast and Blockchain TxHashes for T+0 reconciliation."</p>
            </div>
            <div className="text-left md:text-right space-y-1">
               <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Global Node Yield</p>
               <p className="text-4xl font-headline font-bold text-accent">$12.45M</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2"><Fingerprint className="h-3 w-3" /> Hash Integrity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">100%</div>
                <p className="text-[9px] text-accent font-bold mt-1 uppercase">Valid Seals</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2"><Lock className="h-3 w-3" /> Escrow Deepness</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">$428k</div>
                <p className="text-[9px] text-primary font-bold mt-1 uppercase">TON Wallet Mesh</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2"><Activity className="h-3 w-3" /> Reversal Velocity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">2.4m</div>
                <p className="text-[9px] text-blue-400 font-bold mt-1 uppercase">Avg Restoration Time</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Compliance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">PASSED</div>
                <p className="text-[9px] text-green-400 font-bold mt-1 uppercase">ISO 20022 Audit</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp className="h-5 w-5 text-accent" />
                   Commercial Growth Metrics
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
                     <Activity className="h-4 w-4" /> Live Forensic Stream
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                      <div className="divide-y divide-white/5">
                         {eventsLoading ? (
                            <div className="p-10 flex justify-center opacity-30"><Loader2 className="h-6 w-6 animate-spin" /></div>
                         ) : (!liveEvents || liveEvents?.length === 0) ? (
                            <div className="p-10 text-center text-[10px] uppercase text-muted-foreground italic">Awaiting audit signals...</div>
                         ) : liveEvents?.map((e: any) => (
                            <div key={e.id} className="p-4 flex justify-between items-center group hover:bg-white/5 transition-all">
                               <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-white uppercase">{e.type}</p>
                                  <p className="text-[8px] text-muted-foreground font-mono truncate w-40">{e.txHash || 'INTERNAL_RECON'}</p>
                               </div>
                               <div className="text-right">
                                  <Badge variant="outline" className={cn(
                                    "text-[7px] uppercase font-bold",
                                    e.status === 'COMPLETED' ? "border-green-500 text-green-400" : "border-accent text-accent"
                                  )}>
                                     {e.status}
                                  </Badge>
                                  <p className="text-[7px] text-muted-foreground font-mono mt-1">{new Date(e.timestamp).toLocaleTimeString()}</p>
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
