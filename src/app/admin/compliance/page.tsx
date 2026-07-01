
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
  Globe
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

export default function AdminCompliancePage() {
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isCronRunning, setIsCronRunning] = useState(false);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  
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
    { id: 'm1', label: 'Active Citizens', value: citizens?.length || 0, type: 'GAUGE', trend: 'UP', status: 'NORMAL' },
    { id: 'm2', label: 'Success Rate', value: '98.2%', type: 'GAUGE', trend: 'UP', status: 'NORMAL' },
    { id: 'm3', label: 'Stuck Payouts', value: anomalies?.length || 0, type: 'COUNTER', trend: 'NEUTRAL', status: (anomalies?.length || 0) > 0 ? 'WARN' : 'NORMAL' },
    { id: 'm4', label: 'Mesh Pulse', value: '8.4ms', type: 'GAUGE', trend: 'NEUTRAL', status: 'NORMAL' },
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

  const handleVerify = async (docData: any, status: 'APPROVED' | 'REJECTED') => {
    if (!firestore) return;
    setIsProcessing(docData.id);
    try {
      await updateDoc(doc(firestore, 'verification_docs', docData.id), { status });
      await updateDoc(doc(firestore, 'users', docData.userId), { 
        verificationStatus: status === 'APPROVED' ? 'VERIFIED' : 'FLAGGED',
        trustScore: status === 'APPROVED' ? 98.4 : 45.0
      });
      emitEvent('SECURITY', 'DOCUMENT_VERIFICATION_RESOLVED', 2, { docId: docData.id, status });
      toast({ title: status === 'APPROVED' ? "Approved" : "Rejected" });
    } catch (err) {
      toast({ variant: "destructive", title: "Action Failed" });
    } finally {
      setIsProcessing(null);
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
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Gavel className="h-5 w-5 text-accent" />
              Sovereign Command Center
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">System Live</span>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full space-y-8">
          
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {operationalMetrics.map((metric) => (
               <Card key={metric.id} className={cn("glass-panel border-l-4 transition-all", metric.status === 'WARN' ? 'border-l-yellow-500' : 'border-l-accent')}>
                 <CardContent className="p-4 flex justify-between items-end">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                       <p className="text-2xl font-headline font-bold text-white">{metric.value}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 text-accent">
                       <Activity className="h-4 w-4" />
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>

          <Tabs defaultValue="citizens" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
               <TabsTrigger value="citizens" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">Citizen Registry</TabsTrigger>
               <TabsTrigger value="activity" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">Global Activity</TabsTrigger>
               <TabsTrigger value="kyb" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">KYB Queue</TabsTrigger>
               <TabsTrigger value="anomalies" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full flex gap-2">
                 Anomalies {anomalies?.length > 0 && <Badge className="bg-red-500 h-4 min-w-4 flex items-center justify-center p-0 text-[8px]">{anomalies.length}</Badge>}
               </TabsTrigger>
            </TabsList>

            {/* Tab 1: Citizen Registry */}
            <TabsContent value="citizens" className="space-y-6">
               <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-headline font-bold">System Users</h2>
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or email..." className="pl-10 bg-secondary/30 border-white/5" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                  </div>
               </div>
               
               <Card className="glass-panel border-white/5 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {usersLoading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin opacity-20" /></div>
                      ) : filteredCitizens.map((citizen: any) => (
                        <div key={citizen.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                           <div className="flex gap-4 items-center">
                              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold">
                                {citizen.displayName?.[0] || 'U'}
                              </div>
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white uppercase">{citizen.displayName}</span>
                                    <Badge variant="outline" className="text-[8px] border-accent/30 text-accent uppercase">{citizen.role}</Badge>
                                 </div>
                                 <p className="text-[10px] text-muted-foreground font-mono">{citizen.email}</p>
                                 <div className="flex items-center gap-4 text-[9px] font-bold uppercase text-muted-foreground/60">
                                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Balance: ${citizen.balance?.toFixed(2)}</span>
                                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Trust: {citizen.trustScore}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/10 hover:text-accent" onClick={() => handleUserAction(citizen.id, 'ACTIVATE')}><UserCheck className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleUserAction(citizen.id, 'FREEZE')}><ShieldX className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => handleUserAction(citizen.id, 'MAKE_ADMIN')}><Lock className="h-4 w-4" /></Button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* Tab 2: Activity Feed */}
            <TabsContent value="activity" className="space-y-6">
               <Card className="glass-panel border-white/5 bg-black/20">
                  <CardHeader>
                     <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                        <History className="h-4 w-4 text-accent" />
                        Live Execution Feed
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <ScrollArea className="h-[600px]">
                        <div className="divide-y divide-white/5">
                           {globalActivity?.map((ev: any) => (
                             <div key={ev.id} className="p-4 flex items-start gap-4 group hover:bg-white/5">
                                <div className={cn(
                                  "p-2 rounded bg-black/40 border border-white/5",
                                  ev.plane === 'FINANCE' ? "text-green-400" : ev.plane === 'SECURITY' ? "text-red-400" : "text-blue-400"
                                )}>
                                   {ev.plane === 'FINANCE' ? <DollarSign className="h-4 w-4" /> : ev.plane === 'SECURITY' ? <ShieldAlert className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                                </div>
                                <div className="flex-1 space-y-1">
                                   <div className="flex justify-between">
                                      <span className="text-[10px] font-bold text-white uppercase">{ev.type}</span>
                                      <span className="text-[9px] font-mono text-muted-foreground">{new Date(ev.timestamp).toLocaleString()}</span>
                                   </div>
                                   <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                                      {JSON.stringify(ev.payload).substring(0, 150)}...
                                   </p>
                                   <Badge variant="ghost" className="text-[7px] font-mono opacity-50 border-white/5">{ev.plane} PLANE • SEAL_{ev.id.substring(0, 8)}</Badge>
                                </div>
                             </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* Tab 3: KYB Queue */}
            <TabsContent value="kyb" className="space-y-6">
               <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-headline font-bold">Verification Queue</h2>
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search citizen name..." className="pl-10 bg-secondary/30 border-white/5" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
               </div>
               
               <Card className="glass-panel border-white/5">
                  <CardContent className="p-0">
                    {docsLoading ? (
                      <div className="p-12 flex flex-col items-center opacity-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : remoteDocs?.length === 0 ? (
                      <div className="p-20 text-center italic text-xs opacity-30">Queue is empty.</div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {remoteDocs.map((doc: any) => (
                          <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                             <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center"><FileText className="h-6 w-6 text-accent" /></div>
                                <div className="space-y-1">
                                   <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold text-white uppercase">{doc.userName}</span>
                                      <Badge className={cn("text-[8px] uppercase", doc.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500')}>{doc.status}</Badge>
                                   </div>
                                   <p className="text-[10px] text-muted-foreground font-mono">TIN: {doc.metadata?.tin} | NID: {doc.metadata?.nid}</p>
                                </div>
                             </div>
                             {doc.status === 'PENDING' && (
                               <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="text-[10px] border-red-500/30 text-red-400" onClick={() => handleVerify(doc, 'REJECTED')} disabled={!!isProcessing}><XCircle className="mr-1 h-3 w-3" /> Reject</Button>
                                  <Button size="sm" className="text-[10px] bg-accent text-background" onClick={() => handleVerify(doc, 'APPROVED')} disabled={!!isProcessing}><CheckCircle2 className="mr-1 h-3 w-3" /> Approve</Button>
                               </div>
                             )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
               </Card>
            </TabsContent>

            {/* Tab 4: Anomalies (Existing Logic) */}
            <TabsContent value="anomalies" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-6">
                    <Card className="glass-panel border-red-500/20 bg-red-500/5">
                        <CardHeader className="border-b border-red-500/10">
                          <CardTitle className="text-sm flex items-center gap-2 text-red-400 uppercase tracking-widest">
                            <Activity className="h-4 w-4" />
                            Live Anomaly Feed
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          {anomalies?.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <ShieldCheck className="h-12 w-12 text-green-500/20 mx-auto" />
                                <p className="italic text-xs text-muted-foreground uppercase tracking-widest">System Integrity Optimal.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-red-500/10">
                                {anomalies?.map((p: any) => (
                                  <div 
                                    key={p.id} 
                                    className={cn(
                                      "p-6 flex items-center justify-between group hover:bg-red-500/10 transition-all cursor-pointer border-l-4",
                                      selectedAnomalyId === p.id ? "border-l-accent bg-red-500/10" : "border-l-transparent"
                                    )}
                                    onClick={() => setSelectedAnomalyId(p.id)}
                                  >
                                      <div className="flex gap-4">
                                        <div className="p-3 rounded-lg bg-black/40 border border-red-500/20 text-red-400"><History className="h-5 w-5" /></div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-white uppercase">{p.provider} • ${p.amount}</p>
                                            <div className="flex gap-2 items-center">
                                              <Badge variant="outline" className="text-[7px] border-red-500/20 text-red-400 uppercase">{p.settlementBucket}</Badge>
                                              <span className="text-[8px] text-muted-foreground italic font-mono">Retries: {p.replayCount || 0}</span>
                                            </div>
                                        </div>
                                      </div>
                                      <ArrowRight className={cn("h-4 w-4 text-muted-foreground transition-transform", selectedAnomalyId === p.id && "translate-x-2 text-accent")} />
                                  </div>
                                ))}
                            </div>
                          )}
                        </CardContent>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="glass-panel border-accent/20 bg-accent/5">
                        <CardHeader className="border-b border-white/10 pb-3">
                           <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest text-accent">
                              <Bell className="h-4 w-4" />
                              Critical Signals
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                           <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 flex gap-3">
                              <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                "Monitoring 42 anycast nodes for signal integrity and citizen success rate."
                              </p>
                           </div>
                           <Button className="w-full text-[10px] font-bold h-10 border border-white/10 uppercase" onClick={() => setIsCronRunning(!isCronRunning)}>
                              {isCronRunning ? "Pause Auto-Heal" : "Start Auto-Heal"}
                           </Button>
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
