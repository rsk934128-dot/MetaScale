
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileText, 
  XCircle, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  Gavel, 
  Loader2, 
  History, 
  AlertTriangle, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Play, 
  Terminal, 
  Activity, 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  Eye, 
  Info, 
  TrendingUp, 
  BarChart3, 
  Signal, 
  Clock, 
  Bell, 
  Users, 
  UserCheck, 
  ShieldX, 
  Smartphone, 
  Globe, 
  Sparkles, 
  BrainCircuit, 
  DollarSign,
  Activity as ActivityIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, where, addDoc, getDocs } from "firebase/firestore";
import { useKernel } from "@/components/kernel/KernelProvider";
import { processPaymentCredit } from "@/services/payment-service";
import { runAutomatedReconciliation } from "@/services/reconciliation-cron";
import { cn } from "@/lib/utils";
import { OperationalMetric, SystemAlert } from "@/lib/kernel/types";
import { runForensicCognition } from "@/ai/flows/forensic-analyst";

export default function AdminCompliancePage() {
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isCronRunning, setIsCronRunning] = useState(false);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [isAnalyzingHistory, setIsAnalyzingHistory] = useState(false);
  const [smartInsights, setSmartInsights] = useState<any>(null);
  
  const { toast } = useToast();
  const { emitEvent, mode } = useKernel();
  const firestore = useFirestore();
  const { user: adminUser } = useUser();

  // 1. Citizen Registry (All Users)
  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('lastLogin', 'desc'), limit(50));
  }, [firestore]);
  const { data: citizens, loading: usersLoading } = useCollection<any>(usersQuery);

  // 2. Global Activity Feed (Events)
  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('timestamp', 'desc'), limit(30));
  }, [firestore]);
  const { data: globalActivity } = useCollection<any>(eventsQuery);

  // 3. KYB Documents Queue
  const docsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'verification_docs'), orderBy('submittedAt', 'desc'), limit(20));
  }, [firestore]);
  const { data: remoteDocs, loading: docsLoading } = useCollection<any>(docsQuery);

  // 4. Anomaly Queue
  const anomaliesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'payments'), 
      where('manualReviewRequired', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(10)
    );
  }, [firestore]);
  const { data: anomalies } = useCollection<any>(anomaliesQuery);

  const operationalMetrics: OperationalMetric[] = [
    { id: 'm1', label: 'Citizens', value: citizens?.length || 0, type: 'GAUGE', trend: 'UP', status: 'NORMAL' },
    { id: 'm2', label: 'Success', value: '98.2%', type: 'GAUGE', trend: 'UP', status: 'NORMAL' },
    { id: 'm3', label: 'Anomalies', value: anomalies?.length || 0, type: 'COUNTER', trend: 'NEUTRAL', status: (anomalies?.length || 0) > 0 ? 'WARN' : 'NORMAL' },
    { id: 'm4', label: 'Pulse', value: '8.4ms', type: 'GAUGE', trend: 'NEUTRAL', status: 'NORMAL' },
  ];

  const handleUserAction = async (userId: string, action: 'FREEZE' | 'ACTIVATE' | 'MAKE_ADMIN') => {
    if (!firestore) return;
    setIsProcessing(userId);
    try {
      const userRef = doc(firestore, 'users', userId);
      if (action === 'FREEZE') {
        await updateDoc(userRef, { verificationStatus: 'FLAGGED', trustScore: 0 });
      } else if (action === 'ACTIVATE') {
        await updateDoc(userRef, { verificationStatus: 'VERIFIED', trustScore: 85 });
      } else if (action === 'MAKE_ADMIN') {
        await updateDoc(userRef, { role: 'ADMIN' });
      }
      toast({ title: `Action ${action} Completed` });
      emitEvent('SECURITY', `USER_ACTION_${action}`, 2, { targetUserId: userId });
    } catch (err) {
      toast({ variant: "destructive", title: "Action Failed" });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRunCognitiveAnalysis = async () => {
    if (!globalActivity) return;
    setIsAnalyzingHistory(true);
    try {
      const result = await runForensicCognition({
        currentIncident: "Analyze overall system health.",
        historicalLogs: globalActivity.map((ev: any) => ({
          id: ev.id,
          type: ev.type,
          node: "NODE-04",
          msg: JSON.stringify(ev.payload),
          timestamp: ev.timestamp,
          plane: ev.plane
        })),
        context: "Sovereign OS Administrative Oversight."
      });
      setSmartInsights(result);
      toast({ title: "Insights Generated" });
    } catch (err) {
      toast({ variant: "destructive", title: "Analysis Failed" });
    } finally {
      setIsAnalyzingHistory(false);
    }
  };

  const filteredCitizens = useMemo(() => {
    if (!citizens) return [];
    return citizens.filter(c => 
      c.displayName?.toLowerCase().includes(userSearch.toLowerCase()) || 
      c.email?.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [citizens, userSearch]);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Gavel className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0" />
              <span className="truncate">Sovereign Command</span>
            </h1>
          </div>
          <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/20 text-primary font-bold text-[9px] md:text-[10px] h-8 blue-glow px-2"
              onClick={handleRunCognitiveAnalysis}
              disabled={isAnalyzingHistory}
          >
              {isAnalyzingHistory ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
              <span className="hidden xs:inline">AI Insights</span>
              <span className="xs:hidden">AI</span>
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 md:space-y-8">
          
          {/* Cognitive Insights Panel */}
          {smartInsights && (
            <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden animate-fade-in shadow-2xl relative">
               <CardHeader className="p-4 border-b border-white/5">
                  <CardTitle className="text-[10px] md:text-xs flex items-center gap-2 text-accent uppercase tracking-widest">
                     <BrainCircuit className="h-4 w-4" /> Cognitive Analysis
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="md:w-1/4 space-y-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Confidence</p>
                        <p className="text-2xl md:text-4xl font-headline font-bold text-white">{smartInsights.confidenceIndex}%</p>
                        <Badge className={smartInsights.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                           {smartInsights.riskLevel}
                        </Badge>
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                           <p className="text-[9px] font-bold text-accent uppercase">RCA</p>
                           <p className="text-[11px] md:text-xs text-white/90 leading-relaxed italic border-l-2 border-accent/30 pl-3">
                              "{smartInsights.rootCauseAnalysis}"
                           </p>
                        </div>
                        <div className="p-2 md:p-3 rounded-lg bg-primary/10 border border-primary/20">
                           <p className="text-[8px] font-bold text-primary uppercase mb-1">Strategy</p>
                           <p className="text-[10px] md:text-[11px] text-white font-bold">{smartInsights.recommendedStrategy}</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          )}

          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
             {operationalMetrics.map((metric) => (
               <Card key={metric.id} className={cn("glass-panel border-l-4", metric.status === 'WARN' ? 'border-l-yellow-500' : 'border-l-accent')}>
                 <CardContent className="p-3 md:p-4 flex justify-between items-end">
                    <div className="space-y-0.5 min-w-0">
                       <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase truncate">{metric.label}</p>
                       <p className="text-lg md:text-2xl font-headline font-bold text-white">{metric.value}</p>
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>

          <Tabs defaultValue="citizens" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-white/5 w-full justify-start overflow-x-auto h-12 p-1">
               <TabsTrigger value="citizens" className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-4 md:px-8 h-full">Citizens</TabsTrigger>
               <TabsTrigger value="activity" className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-4 md:px-8 h-full">Activity</TabsTrigger>
               <TabsTrigger value="kyb" className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-4 md:px-8 h-full">KYB</TabsTrigger>
               <TabsTrigger value="anomalies" className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-4 md:px-8 h-full">Anomalies</TabsTrigger>
            </TabsList>

            <TabsContent value="citizens" className="space-y-4">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-headline font-bold">System Users</h2>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-10 bg-secondary/30 border-white/5 h-10 text-sm" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                  </div>
               </div>
               
               <Card className="glass-panel border-white/5 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {usersLoading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin opacity-20" /></div>
                      ) : filteredCitizens.map((citizen: any) => (
                        <div key={citizen.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/5 transition-all">
                           <div className="flex gap-4 items-center">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold">
                                {citizen.displayName?.[0] || 'U'}
                              </div>
                              <div className="space-y-1 min-w-0">
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white uppercase truncate">{citizen.displayName}</span>
                                    <Badge variant="outline" className="text-[7px] border-accent/30 text-accent uppercase px-1">{citizen.role}</Badge>
                                 </div>
                                 <p className="text-[9px] md:text-[10px] text-muted-foreground font-mono truncate">{citizen.email}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-8 text-[9px] uppercase font-bold px-2 hover:bg-accent/10 text-accent" onClick={() => handleUserAction(citizen.id, 'ACTIVATE')}><UserCheck className="h-4 w-4 md:mr-1" /><span className="hidden md:inline">Activate</span></Button>
                              <Button variant="ghost" size="sm" className="h-8 text-[9px] uppercase font-bold px-2 hover:bg-red-500/10 text-red-500" onClick={() => handleUserAction(citizen.id, 'FREEZE')}><ShieldX className="h-4 w-4 md:mr-1" /><span className="hidden md:inline">Freeze</span></Button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
               <Card className="glass-panel border-white/5 bg-black/20 overflow-hidden">
                  <CardHeader className="p-4">
                     <CardTitle className="text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                        <History className="h-4 w-4 text-accent" /> Live Feed
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <ScrollArea className="h-[500px]">
                        <div className="divide-y divide-white/5">
                           {globalActivity?.map((ev: any) => (
                             <div key={ev.id} className="p-3 md:p-4 flex items-start gap-3 md:gap-4 hover:bg-white/5">
                                <div className={cn(
                                  "p-2 rounded bg-black/40 border border-white/5 shrink-0",
                                  ev.plane === 'FINANCE' ? "text-green-400" : ev.plane === 'SECURITY' ? "text-red-400" : "text-blue-400"
                                )}>
                                   {ev.plane === 'FINANCE' ? <DollarSign className="h-3 w-3 md:h-4 md:w-4" /> : ev.plane === 'SECURITY' ? <ShieldAlert className="h-3 w-3 md:h-4 md:w-4" /> : <ActivityIcon className="h-3 w-3 md:h-4 md:w-4" />}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                   <div className="flex justify-between">
                                      <span className="text-[8px] md:text-[10px] font-bold text-white uppercase">{ev.type}</span>
                                      <span className="text-[7px] md:text-[9px] font-mono text-muted-foreground">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                                   </div>
                                   <p className="text-[10px] md:text-[11px] text-muted-foreground italic truncate">
                                      {JSON.stringify(ev.payload)}
                                   </p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="anomalies" className="space-y-4">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-4">
                    <Card className="glass-panel border-red-500/20 bg-red-500/5 overflow-hidden">
                        <CardHeader className="p-4 border-b border-red-500/10">
                          <CardTitle className="text-[10px] md:text-xs flex items-center gap-2 text-red-400 uppercase tracking-widest">
                            <ActivityIcon className="h-4 w-4" /> Live Anomaly Feed
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          {anomalies?.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <ShieldCheck className="h-10 w-10 text-green-500/20 mx-auto" />
                                <p className="italic text-[10px] text-muted-foreground uppercase tracking-widest">Integrity Optimal.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-red-500/10">
                                {anomalies?.map((p: any) => (
                                  <div 
                                    key={p.id} 
                                    className={cn(
                                      "p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-red-500/10 cursor-pointer border-l-4",
                                      selectedAnomalyId === p.id ? "border-l-accent bg-red-500/10" : "border-l-transparent"
                                    )}
                                    onClick={() => setSelectedAnomalyId(p.id)}
                                  >
                                      <div className="flex gap-3 md:gap-4 min-w-0">
                                        <div className="p-2 md:p-3 rounded-lg bg-black/40 border border-red-500/20 text-red-400 shrink-0"><History className="h-4 w-4 md:h-5 md:w-5" /></div>
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-xs md:text-sm font-bold text-white uppercase truncate">{p.provider} • ${p.amount}</p>
                                            <Badge variant="outline" className="text-[6px] md:text-[7px] border-red-500/20 text-red-400 uppercase px-1">{p.settlementBucket}</Badge>
                                        </div>
                                      </div>
                                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                  </div>
                                ))}
                            </div>
                          )}
                        </CardContent>
                    </Card>
                  </div>
               </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}

