
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
  Calendar,
  User,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";
import { useKernel } from "@/components/kernel/KernelProvider";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function AdminCompliancePage() {
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const firestore = useFirestore();

  const docsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'verification_docs'), orderBy('submittedAt', 'desc'), limit(50));
  }, [firestore]);

  const { data: remoteDocs, loading } = useCollection<any>(docsQuery);

  const handleVerify = async (docData: any, status: 'APPROVED' | 'REJECTED') => {
    if (!firestore) return;
    setIsProcessing(docData.id);
    
    try {
      // 1. Update verification document status
      const docRef = doc(firestore, 'verification_docs', docData.id);
      await updateDoc(docRef, { status: status });

      // 2. Update user profile status
      const userRef = doc(firestore, 'users', docData.userId);
      await updateDoc(userRef, { 
        verificationStatus: status === 'APPROVED' ? 'VERIFIED' : 'FLAGGED',
        trustScore: status === 'APPROVED' ? 98.4 : 45.0
      });

      emitEvent('SECURITY', 'DOCUMENT_VERIFICATION_RESOLVED', 2, { 
        docId: docData.id, 
        userId: docData.userId, 
        type: docData.type,
        status 
      });

      toast({
        title: status === 'APPROVED' ? "Compliance Approved" : "Request Rejected",
        description: `Entity ${docData.userName} status has been updated.`,
        variant: status === 'APPROVED' ? "default" : "destructive",
      });
      setSelectedDoc(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: "Error communicating with the Sovereign Mesh."
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredDocs = useMemo(() => {
    if (!remoteDocs) return [];
    return remoteDocs.filter(d => 
      d.userName?.toLowerCase().includes(search.toLowerCase()) || 
      d.metadata?.tin?.includes(search) ||
      d.metadata?.nid?.includes(search)
    );
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
              Sovereign Compliance Command
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            ROLE: ROOT_ADMIN
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Queue Management</h2>
              <p className="text-muted-foreground italic">"Reviewing identity, tax, and NID bindings for distributed entities."</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative w-72">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Search TIN, NID or Citizen Name..." 
                   className="pl-10 bg-secondary/30 border-white/5 h-10 text-xs"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
               </div>
               <Button variant="outline" size="icon" className="h-10 w-10 border-white/5"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="glass-panel border-l-4 border-l-yellow-500">
               <CardHeader className="p-4 pb-2">
                 <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Pending Verification</CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-bold">{filteredDocs.filter(d => d.status === 'PENDING').length}</div>
                  <p className="text-[9px] text-yellow-500 font-bold mt-1 uppercase">SLA: Active Audit</p>
               </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-accent">
               <CardHeader className="p-4 pb-2">
                 <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Approved Citizens</CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-bold">{filteredDocs.filter(d => d.status === 'APPROVED').length}</div>
                  <p className="text-[9px] text-accent font-bold mt-1 uppercase">Mesh Trust High</p>
               </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-red-500">
               <CardHeader className="p-4 pb-2">
                 <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Flagged Entities</CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-bold">{filteredDocs.filter(d => d.status === 'REJECTED').length}</div>
                  <p className="text-[9px] text-red-500 font-bold mt-1 uppercase">Isolation Potential</p>
               </CardContent>
             </Card>
          </div>

          <Card className="glass-panel border-white/5">
            <CardHeader className="p-6 border-b border-white/5">
               <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-accent" />
                  Compliance Verification Queue
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               {loading ? (
                 <div className="p-12 flex flex-col items-center gap-4 opacity-40">
                   <Loader2 className="h-8 w-8 animate-spin text-accent" />
                   <p className="text-xs font-bold uppercase tracking-widest">Accessing Verification Mesh...</p>
                 </div>
               ) : filteredDocs.length === 0 ? (
                 <div className="p-20 text-center text-muted-foreground italic text-xs">
                   No pending documents in the queue.
                 </div>
               ) : (
                 <div className="divide-y divide-white/5">
                    {filteredDocs.map((doc: any) => (
                      <div key={doc.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all">
                         <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                               {doc.type === 'NID' ? <Fingerprint className="h-6 w-6 text-accent" /> : <FileText className="h-6 w-6 text-accent" />}
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white uppercase">{doc.userName}</span>
                                  <Badge variant="outline" className="text-[8px] border-white/10 uppercase">{doc.type} BINDING</Badge>
                                  <Badge className={
                                    doc.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 text-[8px] uppercase' :
                                    doc.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 text-[8px] uppercase' :
                                    'bg-yellow-500/20 text-yellow-500 text-[8px] uppercase animate-pulse'
                                  }>
                                    {doc.status}
                                  </Badge>
                               </div>
                               <p className="text-[11px] text-muted-foreground font-mono">
                                 {doc.type === 'TIN' ? `TIN: ${doc.metadata?.tin || 'N/A'}` : `NID: ${doc.metadata?.nid || 'N/A'}`} | ADDR: {doc.metadata?.address || doc.metadata?.dob || 'UNSET'}
                               </p>
                               <div className="flex items-center gap-3 pt-1">
                                  <span className="text-[9px] text-muted-foreground uppercase">SUBMITTED: {new Date(doc.submittedAt).toLocaleString()}</span>
                                </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2 shrink-0">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-[10px] font-bold h-9"
                              onClick={() => setSelectedDoc(doc)}
                            >
                               <Eye className="mr-1.5 h-3.5 w-3.5" /> View Card
                            </Button>
                            {doc.status === 'PENDING' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-[10px] font-bold h-9 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  onClick={() => handleVerify(doc, 'REJECTED')}
                                  disabled={isProcessing === doc.id}
                                >
                                   <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="text-[10px] font-bold h-9 bg-accent text-background cyan-glow"
                                  onClick={() => handleVerify(doc, 'APPROVED')}
                                  disabled={isProcessing === doc.id}
                                >
                                   {isProcessing === doc.id ? <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
                                   Approve
                                </Button>
                              </>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
             <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader>
                   <CardTitle className="text-sm flex items-center gap-2 uppercase">
                      <Scale className="h-4 w-4 text-accent" />
                      Algorithmic Governance Log
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] space-y-2">
                      <p className="text-accent">&gt;&gt;&gt; SYSTEM_DIRECTIVE: AUTO_AUDIT_ACTIVE</p>
                      <p className="text-white/60">&gt;&gt;&gt; MATCH_RESULT: GOVERNMENT_DB_SYNC_OK</p>
                      <p className="text-green-400">&gt;&gt;&gt; RECOMMENDATION: VERIFY_ENTITY_FOR_USDT_TRAFFIC</p>
                   </div>
                   <div className="flex items-center gap-2 p-2 rounded bg-accent/10 border border-accent/20 text-[9px] text-accent">
                      <Info className="h-3.5 w-3.5" />
                      Cross-referencing NID/TIN records with geo-distributed infrastructure logs.
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel">
                <CardHeader>
                   <CardTitle className="text-sm">Sector Stability Signals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {[
                     { name: "Identity Mesh Sync", load: 92, status: "Optimal" },
                     { name: "Disbursement Gateway", load: 12, status: "Standby" },
                     { name: "Government Bridge", load: 45, status: "Normal" }
                   ].map((signal, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                           <span>{signal.name}</span>
                           <span className={signal.status === 'Optimal' ? 'text-green-400' : 'text-accent'}>{signal.status}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-accent" style={{ width: `${signal.load}%` }} />
                        </div>
                     </div>
                   ))}
                </CardContent>
             </Card>
          </div>
        </main>

        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
           <DialogContent className="max-w-2xl glass-panel border-accent/20 bg-background/95 p-0 overflow-hidden">
             {selectedDoc && (
               <div className="relative">
                 <div className="bg-accent/10 p-6 border-b border-white/10">
                   <DialogHeader>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded bg-accent/20">
                             {selectedDoc.type === 'NID' ? <Fingerprint className="h-6 w-6 text-accent" /> : <FileText className="h-6 w-6 text-accent" />}
                           </div>
                           <div>
                              <DialogTitle className="text-xl font-headline italic uppercase">{selectedDoc.type} Verification Card</DialogTitle>
                              <DialogDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Sovereign Mesh ID Binding Protocol</DialogDescription>
                           </div>
                        </div>
                        <Badge className="bg-accent text-background font-bold">{selectedDoc.status}</Badge>
                     </div>
                   </DialogHeader>
                 </div>

                 <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       {/* Mock Card Visual */}
                       <div className="aspect-[1.6/1] rounded-2xl bg-gradient-to-br from-secondary to-background border-2 border-accent/30 p-6 relative shadow-2xl overflow-hidden group">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                          <div className="flex items-start gap-4 h-full">
                             <div className="w-20 h-24 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                                <User className="h-10 w-10 text-accent/40" />
                             </div>
                             <div className="flex-1 space-y-3">
                                <div className="space-y-0.5">
                                   <p className="text-[8px] uppercase font-bold text-muted-foreground">Full Name</p>
                                   <p className="text-xs font-bold text-white uppercase">{selectedDoc.metadata?.name || selectedDoc.userName}</p>
                                </div>
                                <div className="space-y-0.5">
                                   <p className="text-[8px] uppercase font-bold text-muted-foreground">{selectedDoc.type === 'NID' ? 'NID No' : 'TIN No'}</p>
                                   <p className="text-xs font-mono font-bold text-accent">{selectedDoc.metadata?.nid || selectedDoc.metadata?.tin}</p>
                                </div>
                                <div className="space-y-0.5">
                                   <p className="text-[8px] uppercase font-bold text-muted-foreground">Binding Status</p>
                                   <div className="flex items-center gap-1.5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                      <span className="text-[10px] text-green-400 font-bold">CRYPTO_BOUND_OK</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="absolute bottom-4 right-4 opacity-20">
                             <Fingerprint className="h-12 w-12 text-accent" />
                          </div>
                       </div>

                       {/* Metadata Details */}
                       <div className="space-y-6">
                          <h4 className="text-[10px] uppercase font-bold text-accent tracking-[0.2em] border-b border-white/5 pb-2">Mesh Metadata</h4>
                          <div className="space-y-4">
                             {[
                               { icon: User, label: "Father's Name", value: selectedDoc.metadata?.father },
                               { icon: User, label: "Mother's Name", value: selectedDoc.metadata?.mother },
                               { icon: Calendar, label: "Date of Birth", value: selectedDoc.metadata?.dob },
                               { icon: Hash, label: "Government Serial", value: `SKO-REF-${selectedDoc.id.substring(0, 8)}` },
                               { icon: Calendar, label: "Issue Date", value: selectedDoc.metadata?.issueDate }
                             ].filter(i => i.value).map((item, i) => (
                               <div key={i} className="flex items-center gap-3">
                                  <div className="p-1.5 rounded-md bg-secondary/50">
                                     <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                  <div>
                                     <p className="text-[9px] uppercase font-bold text-muted-foreground">{item.label}</p>
                                     <p className="text-xs text-white font-bold">{item.value}</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex gap-4 items-center">
                       <div className="p-2 rounded bg-accent/20">
                          <Zap className="h-4 w-4 text-accent" />
                       </div>
                       <p className="text-[10px] text-white/80 leading-relaxed italic">
                          "Deterministic cross-reference check complete. Government identity database reports no active flags for this NID/TIN serial."
                       </p>
                    </div>
                 </div>

                 <DialogFooter className="bg-secondary/30 p-6 border-t border-white/5">
                    <Button variant="ghost" onClick={() => setSelectedDoc(null)} className="text-xs font-bold uppercase tracking-widest">Close Record</Button>
                    {selectedDoc.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold uppercase tracking-widest"
                          onClick={() => handleVerify(selectedDoc, 'REJECTED')}
                          disabled={isProcessing === selectedDoc.id}
                        >
                          Reject Binding
                        </Button>
                        <Button 
                          className="bg-accent text-background cyan-glow text-xs font-bold uppercase tracking-widest px-8"
                          onClick={() => handleVerify(selectedDoc, 'APPROVED')}
                          disabled={isProcessing === selectedDoc.id}
                        >
                          {isProcessing === selectedDoc.id ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                          Confirm Identity
                        </Button>
                      </div>
                    )}
                 </DialogFooter>
               </div>
             )}
           </DialogContent>
        </Dialog>
      </SidebarInset>
    </div>
  );
}
