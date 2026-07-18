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
  Activity as ActivityIcon,
  Trash2,
  LockOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, where, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { useKernel } from "@/components/kernel/KernelProvider";
import { manuallyResolvePayment } from "@/services/payment-service";
import { cn } from "@/lib/utils";
import { OperationalMetric, SystemAlert } from "@/lib/kernel/types";
import { runForensicCognition } from "@/ai/flows/forensic-analyst";

export default function AdminCompliancePage() {
  const [userSearch, setUserSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [isAnalyzingHistory, setIsAnalyzingHistory] = useState(false);
  const [smartInsights, setSmartInsights] = useState<any>(null);
  
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const firestore = useFirestore();
  const { user: adminUser } = useUser();

  // 1. Citizen Registry
  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('lastLogin', 'desc'), limit(50));
  }, [firestore]);
  const { data: citizens, loading: usersLoading } = useCollection<any>(usersQuery);

  // 2. Global Activity Feed
  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('timestamp', 'desc'), limit(30));
  }, [firestore]);
  const { data: globalActivity } = useCollection<any>(eventsQuery);

  // 3. Anomaly Queue (Stuck Payments)
  const anomaliesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'payments'), 
      where('manualReviewRequired', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
  }, [firestore]);
  const { data: anomalies, loading: anomaliesLoading } = useCollection<any>(anomaliesQuery);

  const selectedAnomaly = useMemo(() => {
    return anomalies?.find(a => a.id === selectedAnomalyId);
  }, [anomalies, selectedAnomalyId]);

  const operationalMetrics: OperationalMetric[] = [
    { id: 'm1', label: 'Citizens', value: citizens?.length || 0, type: 'GAUGE', trend: 'UP', status: 'NORMAL' },
    { id: 'm2', label: 'Anomalies', value: anomalies?.length || 0, type: 'COUNTER', trend: 'NEUTRAL', status: (anomalies?.length || 0) > 0 ? 'WARN' : 'NORMAL' },
    { id: 'm3', label: 'Grid Nodes', value: 42, type: 'GAUGE', trend: 'NEUTRAL', status: 'NORMAL' },
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
        await updateDoc(userRef, { verificationStatus: 'VERIFIED', trustScore: 95 });
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

  const handleAnomalyResolution = async (action: 'APPROVE' | 'REJECT') => {
    if (!firestore || !selectedAnomaly || !adminUser) return;
    setIsProcessing(selectedAnomaly.id);

    try {
      const res = await manuallyResolvePayment(firestore, selectedAnomaly.id, action, adminUser.uid);
      
      emitEvent('SECURITY', `ANOMALY_${action}`, 1, { 
        paymentId: selectedAnomaly.id, 
        adminId: adminUser.uid,
        amount: selectedAnomaly.amount
      });

      toast({ 
        title: action === 'APPROVE' ? "Payment Settled" : "Payment Rejected", 
        description: `Imperial override successful for ${selectedAnomaly.id}` 
      });
      setSelectedAnomalyId(null);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Resolution Failed", description: err.message });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRunCognitiveAnalysis = async () => {
    if (!globalActivity) return;
    setIsAnalyzingHistory(true);
    try {
      const result = await runForensicCognition({
        currentIncident: "Analyze overall system health and recent anomalies.",
        historicalLogs: globalActivity.map((ev: any) => ({
          id: ev.id,
          type: ev.type,
          node: "NODE-04",
          msg: JSON.stringify(ev.payload),
          timestamp: ev.timestamp,
          plane: ev.plane
        })),
        context: "Sovereign OS Administrative Oversight. Resolving stuck payment corridors."
      });
      setSmartInsights(result);
      toast({ title: "Forensic Insights Generated" });
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
              <span className="truncate uppercase tracking-tight">Sovereign Resolution Center</span>
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
              <span className="hidden xs:inline">AI Forensic Audit</span>
              <span className="xs:hidden">AI Audit</span>
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 md:space-y-8">
          
          {/* AI Auditor Insights */}
          {smartInsights && (
            <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden animate-fade-in shadow-2xl relative">
               <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-[10px] md:text-xs flex items-center gap-2 text-accent uppercase tracking-widest">
                     <BrainCircuit className="h-4 w-4" /> Cognitive System Audit
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="md:w-1/4 space-y-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6 text-center md:text-left">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Stability Index</p>
                        <p className="text-2xl md:text-4xl font-headline font-bold text-white">{smartInsights.confidenceIndex}%</p>
                        <Badge className={smartInsights.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                           {smartInsights.riskLevel} THREAT
                        </Badge>
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                           <p className="text-[9px] font-bold text-accent uppercase">RCA (Root Cause)</p>
                           <p className="text-[11px] md:text-xs text-white/90 leading-relaxed italic border-l-2 border-accent/30 pl-3">
                              "{smartInsights.rootCauseAnalysis}"
                           </p>
                        </div>
                        <div className="p-2 md:p-3 rounded-lg bg-primary/10 border border-primary/20">
                           <p className="text-[8px] font-bold text-primary uppercase mb-1">Recommended Imperial Action</p>
                           <p className="text-[10px] md:text-[11px] text-white font-bold">{smartInsights.recommendedStrategy}</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          )}

          {/* KPI Mini-Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
             {operationalMetrics.map((metric) => (
               <Card key={metric.id} className={cn("glass-panel border-l-4 transition-all hover:scale-105", metric.status === 'WARN' ? 'border-l-yellow-500' : 'border-l-accent')}>
                 <CardContent className="p-3 md:p-4 flex justify-between items-end">
                    <div className="space-y-0.5 min-w-0">
                       <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase truncate">{metric.label}</p>
                       <p className="text-lg md:text-2xl font-headline font-bold text-white">{metric.value}</p>
                    </div>
                    {metric.trend && (
                      <div className={cn("text-[10px] font-bold", metric.trend === 'UP' ? 'text-green-400' : 'text-muted-foreground')}>
                        {metric.trend === 'UP' ? <TrendingUp className="h-3 w-3" /> : <ActivityIcon className="h-3 w-3" />}
                      </div>
                    )}
                 </CardContent>
               </Card>
             ))}
          </div>

          <Tabs defaultValue="anomalies" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-white/5 w-full justify-start overflow-x-auto h-12 p-1">
               <TabsTrigger value="anomalies" className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-4 md:px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Anomalies</TabsTrigger>
               <TabsTrigger value="citizens" className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-4 md:px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Citizens</TabsTrigger>
               <TabsTrigger value="activity" className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-4 md:px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="anomalies" className="space-y-4">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 space-y-4">
                    <Card className="glass-panel border-red-500/20 bg-red-500/5 overflow-hidden flex flex-col h-[500px]">
                        <CardHeader className="p-4 border-b border-red-500/10 bg-red-500/10">
                          <CardTitle className="text-[10px] md:text-xs flex items-center gap-2 text-red-400 uppercase tracking-widest">
                            <ActivityIcon className="h-4 w-4" /> Manual Review Queue
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                          <ScrollArea className="h-full">
                            {anomaliesLoading ? (
                              <div className="p-12 flex justify-center opacity-30"><Loader2 className="h-8 w-8 animate-spin" /></div>
                            ) : anomalies?.length === 0 ? (
                              <div className="p-20 text-center space-y-4 opacity-30">
                                  <ShieldCheck className="h-10 w-10 text-green-500 mx-auto" />
                                  <p className="italic text-[10px] text-muted-foreground uppercase tracking-widest">No signals pending review.</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-red-500/10">
                                  {anomalies?.map((p: any) => (
                                    <div 
                                      key={p.id} 
                                      className={cn(
                                        "p-4 flex items-center justify-between gap-4 hover:bg-red-500/10 cursor-pointer border-l-4 transition-all",
                                        selectedAnomalyId === p.id ? "border-l-accent bg-red-500/10" : "border-l-transparent"
                                      )}
                                      onClick={() => setSelectedAnomalyId(p.id)}
                                    >
                                        <div className="flex gap-3 min-w-0">
                                          <div className="p-2 rounded-lg bg-black/40 border border-red-500/20 text-red-400 shrink-0"><History className="h-4 w-4" /></div>
                                          <div className="space-y-0.5 min-w-0">
                                              <p className="text-xs font-bold text-white uppercase truncate">{p.provider} • ${p.amount}</p>
                                              <p className="text-[8px] text-muted-foreground uppercase font-mono truncate">{p.externalTxnId}</p>
                                          </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                    </div>
                                  ))}
                              </div>
                            )}
                          </ScrollArea>
                        </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-7">
                     <Card className="glass-panel border-white/5 h-[500px] flex flex-col bg-black/40">
                        {selectedAnomaly ? (
                          <>
                            <CardHeader className="p-6 border-b border-white/5">
                               <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                     <CardTitle className="text-xl font-headline font-bold text-white uppercase italic tracking-tighter">Imperial Oversight</CardTitle>
                                     <CardDescription className="text-xs uppercase font-bold tracking-widest text-accent">ID: {selectedAnomaly.id}</CardDescription>
                                  </div>
                                  <Badge className="bg-red-500 text-white font-bold">{selectedAnomaly.riskScore}% RISK</Badge>
                               </div>
                            </CardHeader>
                            <CardContent className="p-6 flex-1 space-y-6 overflow-y-auto">
                               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  <div className="p-3 rounded-xl bg-secondary/30 border border-white/5">
                                     <p className="text-[9px] font-bold text-muted-foreground uppercase">Amount</p>
                                     <p className="text-lg font-bold text-white">${selectedAnomaly.amount}</p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-secondary/30 border border-white/5">
                                     <p className="text-[9px] font-bold text-muted-foreground uppercase">Citizen UID</p>
                                     <p className="text-[10px] font-mono text-accent truncate">{selectedAnomaly.userId}</p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-secondary/30 border border-white/5">
                                     <p className="text-[9px] font-bold text-muted-foreground uppercase">Provider</p>
                                     <p className="text-[10px] font-bold text-white">{selectedAnomaly.provider}</p>
                                  </div>
                               </div>

                               <div className="space-y-2">
                                  <p className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-2">
                                     <ShieldAlert className="h-3 w-3" /> Anomaly Reason
                                  </p>
                                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 italic text-sm text-white/90 leading-relaxed shadow-inner">
                                     "{selectedAnomaly.reason || 'Manual review required by Governor Protocol.'}"
                                  </div>
                               </div>

                               <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex gap-4 items-center">
                                  <div className="p-2 rounded-lg bg-accent/20 text-accent"><Info className="h-5 w-5" /></div>
                                  <p className="text-[11px] text-white/80 leading-tight">
                                     আপনি যদি এই পেমেন্টটি <b>Approve</b> করেন, তবে এটি সাথে সাথে ইউজারের ব্যালেন্সে যোগ হয়ে যাবে এবং সিস্টেম একে <b>SETTLED</b> হিসেবে মার্ক করবে।
                                  </p>
                               </div>
                            </CardContent>
                            <CardFooter className="p-6 border-t border-white/5 bg-white/5 flex gap-4">
                               <Button 
                                  variant="ghost" 
                                  className="flex-1 h-12 text-red-400 border border-red-500/20 uppercase font-bold text-[10px] tracking-widest hover:bg-red-500/10"
                                  onClick={() => handleAnomalyResolution('REJECT')}
                                  disabled={!!isProcessing}
                               >
                                  Reject & Lock
                               </Button>
                               <Button 
                                  className="flex-2 h-12 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow px-12"
                                  onClick={() => handleAnomalyResolution('APPROVE')}
                                  disabled={!!isProcessing}
                               >
                                  {isProcessing === selectedAnomaly.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                                  Authorize Settlement
                               </Button>
                            </CardFooter>
                          </>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                             <Lock className="h-16 w-16 text-accent" />
                             <p className="text-xs uppercase font-bold tracking-[0.4em]">Select an anomaly for Imperial Override</p>
                          </div>
                        )}
                     </Card>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="citizens" className="space-y-4">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-headline font-bold uppercase italic tracking-tighter">Citizen <span className="text-accent">Registry</span></h2>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search identity mesh..." className="pl-10 bg-secondary/30 border-white/5 h-10 text-sm" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
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
                              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold shadow-inner">
                                {citizen.displayName?.[0] || 'U'}
                              </div>
                              <div className="space-y-1 min-w-0">
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white uppercase truncate">{citizen.displayName}</span>
                                    <Badge variant="outline" className={cn(
                                       "text-[7px] uppercase px-1.5",
                                       citizen.role === 'ADMIN' ? "border-primary text-primary" : "border-accent/30 text-accent"
                                    )}>{citizen.role}</Badge>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-mono truncate">{citizen.email}</p>
                                    <span className="text-[8px] text-muted-foreground opacity-30">•</span>
                                    <span className="text-[9px] font-bold text-white/50">Score: {citizen.trustScore}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {citizen.role !== 'ADMIN' && (
                                <Button variant="ghost" size="sm" className="h-8 text-[9px] uppercase font-bold px-3 border border-primary/20 text-primary hover:bg-primary/10" onClick={() => handleUserAction(citizen.id, 'MAKE_ADMIN')}><ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Make Admin</Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 text-[9px] uppercase font-bold px-3 border border-accent/20 text-accent hover:bg-accent/10" onClick={() => handleUserAction(citizen.id, 'ACTIVATE')}><UserCheck className="h-3.5 w-3.5 mr-1.5" /> Verify</Button>
                              <Button variant="ghost" size="sm" className="h-8 text-[9px] uppercase font-bold px-3 border border-red-500/20 text-red-500 hover:bg-red-500/10" onClick={() => handleUserAction(citizen.id, 'FREEZE')}><ShieldX className="h-3.5 w-3.5 mr-1.5" /> Lockdown</Button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
               <Card className="glass-panel border-white/5 bg-black/20 overflow-hidden h-[600px] flex flex-col">
                  <CardHeader className="p-4 border-b border-white/5">
                     <CardTitle className="text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                        <History className="h-4 w-4 text-accent" /> Live System Directives
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1">
                     <ScrollArea className="h-full">
                        <div className="divide-y divide-white/5">
                           {globalActivity?.map((ev: any) => (
                             <div key={ev.id} className="p-3 md:p-5 flex items-start gap-3 md:gap-5 hover:bg-white/5 transition-colors">
                                <div className={cn(
                                  "p-2.5 rounded-xl bg-black/40 border border-white/5 shrink-0 shadow-inner",
                                  ev.plane === 'FINANCE' ? "text-green-400" : ev.plane === 'SECURITY' ? "text-red-400" : "text-blue-400"
                                )}>
                                   {ev.plane === 'FINANCE' ? <DollarSign className="h-4 w-4" /> : ev.plane === 'SECURITY' ? <ShieldAlert className="h-4 w-4" /> : <ActivityIcon className="h-4 w-4" />}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1.5">
                                   <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">{ev.type}</span>
                                      <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground opacity-50">{new Date(ev.timestamp).toLocaleString()}</span>
                                   </div>
                                   <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                      <pre className="text-[9px] md:text-[11px] text-muted-foreground whitespace-pre-wrap break-all italic leading-relaxed">
                                         {JSON.stringify(ev.payload, null, 2)}
                                      </pre>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <Badge variant="ghost" className="text-[7px] p-0 uppercase opacity-30 font-mono">ID: {ev.id}</Badge>
                                      <span className="text-[7px] opacity-20">•</span>
                                      <Badge variant="ghost" className="text-[7px] p-0 uppercase opacity-30 font-mono">Status: {ev.status}</Badge>
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}
