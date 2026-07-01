
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  XCircle, 
  CheckCircle2, 
  Search, 
  Filter,
  RefreshCw,
  Eye,
  Scale,
  Gavel,
  Zap,
  Fingerprint,
  Info,
  Loader2,
  Activity,
  History,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, where } from "firebase/firestore";
import { useKernel } from "@/components/kernel/KernelProvider";
import { processPaymentCredit } from "@/services/payment-service";
import { cn } from "@/lib/utils";

export default function AdminCompliancePage() {
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const firestore = useFirestore();

  // Documents Queue
  const docsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'verification_docs'), orderBy('submittedAt', 'desc'), limit(50));
  }, [firestore]);
  const { data: remoteDocs, loading: docsLoading } = useCollection<any>(docsQuery);

  // Reconciliation Queue (Stuck Payments)
  const anomaliesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'payments'), 
      where('isCredited', '==', false),
      where('status', '==', 'PAID'),
      limit(20)
    );
  }, [firestore]);
  const { data: anomalies, loading: anomaliesLoading } = useCollection<any>(anomaliesQuery);

  const handleVerify = async (docData: any, status: 'APPROVED' | 'REJECTED') => {
    if (!firestore) return;
    setIsProcessing(docData.id);
    
    try {
      await updateDoc(doc(firestore, 'verification_docs', docData.id), { status });
      const userRef = doc(firestore, 'users', docData.userId);
      await updateDoc(userRef, { 
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
    if (!firestore) return;
    setIsProcessing(payment.id);
    try {
      const result = await processPaymentCredit(firestore, payment, 'MANUAL');
      emitEvent('FINANCE', 'MANUAL_CREDIT_REPLAY', 2, { paymentId: payment.id, opId: result.operationId });
      toast({ title: "Manual Replay Success", description: `Operation ID: ${result.operationId}` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Replay Failed", description: err.message });
    } finally {
      setIsProcessing(null);
    }
  };

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
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">ROLE: ROOT_ADMIN</Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <Tabs defaultValue="kyb" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
               <TabsTrigger value="kyb" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">KYB Verification</TabsTrigger>
               <TabsTrigger value="reconciliation" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full flex gap-2">
                 Reconciliation {anomalies?.length > 0 && <span className="h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] animate-pulse">{anomalies.length}</span>}
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
                  <div>
                    <h2 className="text-2xl font-headline font-bold">Anomaly Detection</h2>
                    <p className="text-xs text-muted-foreground italic">"Paid events missing internal wallet credit."</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold"><RefreshCw className="mr-2 h-3.5 w-3.5" /> Force Scan</Button>
               </div>

               <Card className="glass-panel border-red-500/20 bg-red-500/5">
                  <CardHeader className="border-b border-red-500/10">
                     <CardTitle className="text-sm flex items-center gap-2 text-red-400 uppercase tracking-widest">
                        <AlertTriangle className="h-4 w-4" />
                        Stuck Payments (PAID && !CREDITED)
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     {anomaliesLoading ? (
                       <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin opacity-20" /></div>
                     ) : anomalies?.length === 0 ? (
                       <div className="p-20 text-center italic text-xs text-muted-foreground">No anomalies detected in this cycle.</div>
                     ) : (
                       <div className="divide-y divide-red-500/10">
                          {anomalies.map((p: any) => (
                            <div key={p.id} className="p-6 flex items-center justify-between group">
                               <div className="flex gap-4">
                                  <div className="p-3 rounded-lg bg-black/40 border border-red-500/20 text-red-400"><History className="h-5 w-5" /></div>
                                  <div className="space-y-1">
                                     <p className="text-sm font-bold text-white uppercase">{p.provider} • ${p.amount}</p>
                                     <p className="text-[10px] font-mono text-muted-foreground">TxnID: {p.externalTxnId}</p>
                                     <div className="flex gap-2">
                                        <Badge variant="outline" className="text-[7px] border-red-500/20 text-red-400">UNCREDITED</Badge>
                                        <span className="text-[8px] text-muted-foreground italic">Stuck since: {new Date(p.updatedAt).toLocaleTimeString()}</span>
                                     </div>
                                  </div>
                               </div>
                               <Button 
                                  size="sm" 
                                  className="bg-accent text-background font-bold text-[10px] cyan-glow"
                                  onClick={() => handleManualReplay(p)}
                                  disabled={isProcessing === p.id}
                               >
                                  {isProcessing === p.id ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <RotateCcw className="h-3 w-3 mr-1.5" />}
                                  Safe Replay
                               </Button>
                            </div>
                          ))}
                       </div>
                     )}
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}
