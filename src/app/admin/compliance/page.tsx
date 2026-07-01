
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
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, where, addDoc } from "firebase/firestore";
import { useKernel } from "@/components/kernel/KernelProvider";
import { processPaymentCredit } from "@/services/payment-service";
import { runAutomatedReconciliation } from "@/services/reconciliation-cron";
import { cn } from "@/lib/utils";
import { OperationalMetric, SystemAlert } from "@/lib/kernel/types";

export default function AdminCompliancePage() {
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isCronRunning, setIsCronRunning] = useState(false);
  const [cronLogs, setCronLogs] = useState<string[]>([]);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { emitEvent, mode } = useKernel();
  const firestore = useFirestore();
  const { user } = useUser();

  // 1. Documents Queue
  const docsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'verification_docs'), orderBy('submittedAt', 'desc'), limit(50));
  }, [firestore]);
  const { data: remoteDocs, loading: docsLoading } = useCollection<any>(docsQuery);

  // 2. Optimized Anomaly Queue
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

  // 3. Operational Events for Alert Feed
  const alertsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'events'),
      where('priority', '<=', 2),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [firestore]);
  const { data: systemAlerts } = useCollection<any>(alertsQuery);

  // Mock Operational Metrics (In production these would be aggregated from DB)
  const operationalMetrics: OperationalMetric[] = [
    { id: 'm1', label: 'Payment Success', value: '99.4%', type: 'GAUGE', trend: 'UP', status: 'NORMAL' },
    { id: 'm2', label: 'Stuck Payments', value: anomalies?.length || 0, type: 'COUNTER', trend: 'NEUTRAL', status: (anomalies?.length || 0) > 5 ? 'CRITICAL' : 'NORMAL' },
    { id: 'm3', label: 'Mesh Integrity', value: '100%', type: 'GAUGE', trend: 'NEUTRAL', status: 'NORMAL' },
    { id: 'm4', label: 'Escrow Depth', value: '$428k', type: 'GAUGE', trend: 'UP', status: 'NORMAL' },
  ];

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

  const handleManualReplay = async (payment: any) => {
    if (!firestore || !user?.uid) return;
    setIsProcessing(payment.id);
    try {
      const result = await processPaymentCredit(firestore, payment, 'MANUAL', user.uid);
      emitEvent('FINANCE', 'MANUAL_CREDIT_REPLAY', 2, { paymentId: payment.id, opId: result.operationId });
      toast({ title: "Manual Replay Success" });
      setSelectedAnomalyId(null);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Replay Failed", description: err.message });
    } finally {
      setIsProcessing(null);
    }
  };

  const triggerMeshScan = async () => {
    if (!firestore) return;
    setIsCronRunning(true);
    setCronLogs(["Starting automated mesh scan...", "Mode: DETECT_AND_REPLAY"]);
    try {
      const results = await runAutomatedReconciliation(firestore, 'DETECT_AND_REPLAY');
      setCronLogs(prev => [...results.logs, ...prev, `Scan finished. Replayed: ${results.replayed}`]);
      emitEvent('FINANCE', 'MESH_RECONCILIATION_RUN', 3, { scanned: results.scanned, replayed: results.replayed });
      toast({ title: "Mesh Scan Complete" });
    } catch (err: any) {
      setCronLogs(prev => [`[FATAL] ${err.message}`, ...prev]);
    } finally {
      setIsCronRunning(false);
    }
  };

  const selectedAnomaly = useMemo(() => 
    anomalies?.find(a => a.id === selectedAnomalyId), 
  [anomalies, selectedAnomalyId]);

  const filteredDocs = useMemo(() => {
    if (!remoteDocs) return [];
    return remoteDocs.filter(d => d.userName?.toLowerCase().includes(search.toLowerCase()));
  }, [remoteDocs, search]);

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
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">MODE: {mode}</Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          
          {/* KPI Metrics Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {operationalMetrics.map((metric) => (
               <Card key={metric.id} className={cn(
                 "glass-panel border-l-4 transition-all",
                 metric.status === 'CRITICAL' ? 'border-l-red-500 bg-red-500/5' : 'border-l-accent'
               )}>
                 <CardContent className="p-4 flex justify-between items-end">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                       <p className={cn("text-2xl font-headline font-bold", metric.status === 'CRITICAL' ? 'text-red-400' : 'text-white')}>
                          {metric.value}
                       </p>
                    </div>
                    <div className={cn(
                      "p-2 rounded-lg bg-background/50",
                      metric.trend === 'UP' ? 'text-green-400' : 'text-muted-foreground'
                    )}>
                       {metric.trend === 'UP' ? <TrendingUp className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>

          <Tabs defaultValue="reconciliation" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
               <TabsTrigger value="kyb" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">KYB Queue</TabsTrigger>
               <TabsTrigger value="reconciliation" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full flex gap-2">
                 Operational Anomaly Detection {anomalies?.length > 0 && <span className="h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] animate-pulse">{anomalies.length}</span>}
               </TabsTrigger>
            </TabsList>

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
                    ) : filteredDocs.length === 0 ? (
                      <div className="p-20 text-center italic text-xs opacity-30">Queue is empty.</div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {filteredDocs.map((doc: any) => (
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

            <TabsContent value="reconciliation" className="space-y-6">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                       <ShieldAlert className="h-6 w-6 text-red-500" />
                       Operational Command
                    </h2>
                    <p className="text-xs text-muted-foreground italic">"Incident Response Level: GATED_PRODUCTION"</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] uppercase font-bold border-white/10 cyan-glow"
                    onClick={triggerMeshScan}
                    disabled={isCronRunning}
                  >
                    {isCronRunning ? <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
                    Re-scan Mesh
                  </Button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Alert Rail & Incident Feed */}
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="glass-panel border-accent/20 bg-accent/5">
                        <CardHeader className="border-b border-white/10 pb-3">
                           <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest text-accent">
                              <Bell className="h-4 w-4" />
                              Live Alert Rail
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                           <ScrollArea className="h-[400px]">
                              <div className="divide-y divide-white/5">
                                 {(!systemAlerts || systemAlerts.length === 0) ? (
                                   <div className="p-10 text-center text-[10px] text-muted-foreground italic uppercase">No active alerts.</div>
                                 ) : systemAlerts.map((alert: any) => (
                                   <div key={alert.id} className="p-4 space-y-2 hover:bg-white/5 transition-all">
                                      <div className="flex justify-between items-start">
                                         <Badge className={cn(
                                           "text-[7px] font-bold uppercase",
                                           alert.priority <= 2 ? 'bg-red-500' : 'bg-yellow-500/20 text-yellow-500'
                                         )}>
                                           {alert.priority <= 2 ? 'CRITICAL' : 'WARNING'}
                                         </Badge>
                                         <span className="text-[8px] font-mono opacity-50">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                      </div>
                                      <p className="text-[11px] font-bold text-white">{alert.type}</p>
                                      <p className="text-[9px] text-muted-foreground italic leading-tight">
                                        Seal: {alert.id.substring(0, 14)}...
                                      </p>
                                   </div>
                                 ))}
                              </div>
                           </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-white/5 bg-black/40">
                        <CardHeader className="pb-2">
                           <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                             <Clock className="h-3 w-3" /> System Heartbeat
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex justify-between text-[10px]">
                              <span className="text-muted-foreground uppercase">Cron Health</span>
                              <span className="text-green-400 font-bold">STABLE</span>
                           </div>
                           <div className="flex justify-between text-[10px]">
                              <span className="text-muted-foreground uppercase">API Latency</span>
                              <span className="text-accent font-bold">27.5ms</span>
                           </div>
                        </CardContent>
                    </Card>
                  </div>

                  {/* Anomaly Feed */}
                  <div className="lg:col-span-8 space-y-6">
                    <Card className="glass-panel border-red-500/20 bg-red-500/5">
                        <CardHeader className="border-b border-red-500/10">
                          <CardTitle className="text-sm flex items-center gap-2 text-red-400 uppercase tracking-widest">
                            <Activity className="h-4 w-4" />
                            Live Anomaly Feed
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          {anomaliesLoading ? (
                            <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin opacity-20" /></div>
                          ) : anomalies?.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <ShieldCheck className="h-12 w-12 text-green-500/20 mx-auto" />
                                <p className="italic text-xs text-muted-foreground uppercase tracking-widest">System Integrity Optimal.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-red-500/10">
                                {anomalies.map((p: any) => (
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
                    
                    {/* Playbook Inspector (Shows only when selected) */}
                    {selectedAnomaly && (
                      <Card className="glass-panel border-accent/30 bg-accent/5 shadow-2xl animate-fade-in">
                        <CardHeader className="border-b border-white/10">
                           <div className="flex justify-between items-center">
                              <Badge className="bg-red-500 text-white font-bold text-[8px] uppercase tracking-widest">CRITICAL INCIDENT</Badge>
                              <span className="text-[9px] font-mono text-muted-foreground">ID: {selectedAnomaly.id.substring(0, 14)}...</span>
                           </div>
                           <CardTitle className="text-xl font-headline italic uppercase tracking-tighter text-white mt-2">
                              Incident Playbook
                           </CardTitle>
                           <CardDescription className="text-xs uppercase font-bold text-accent">STUCK_PAYMENT_RECOVERY</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                <Terminal className="h-3 w-3" /> Recommended Actions
                              </p>
                              <div className="space-y-3">
                                 {[
                                   "Verify provider status via external terminal.",
                                   "Confirm user identity and account balance.",
                                   "Initiate Exactly-once Transactional Replay.",
                                   "Validate double-entry ledger state."
                                 ].map((step, i) => (
                                   <div key={i} className="flex items-start gap-3 text-[11px] text-white/80 italic">
                                      <div className="w-4 h-4 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[9px] font-bold text-accent shrink-0 mt-0.5">{i+1}</div>
                                      <span>{step}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="space-y-3">
                                <Button 
                                    className="w-full h-12 bg-accent text-background font-bold text-[11px] uppercase tracking-widest cyan-glow"
                                    onClick={() => handleManualReplay(selectedAnomaly)}
                                    disabled={isProcessing === selectedAnomaly.id}
                                >
                                    {isProcessing === selectedAnomaly.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                                    Execute Safe Replay
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button variant="outline" className="h-10 text-[9px] font-bold border-red-500/20 text-red-400 hover:bg-red-500/10 uppercase">
                                      <Lock className="mr-2 h-3.5 w-3.5" /> Freeze Account
                                  </Button>
                                  <Button variant="outline" className="h-10 text-[9px] font-bold border-white/10 uppercase">
                                      <Eye className="mr-2 h-3.5 w-3.5" /> Full Audit Log
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 flex gap-3">
                                <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                  Executing a replay will trigger an atomic balancing update. Ensure provider confirmation before authorization.
                                </p>
                              </div>
                           </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
               </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}
