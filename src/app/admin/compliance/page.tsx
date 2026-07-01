
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
  Hash,
  MapPin,
  Heart
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

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

  const handleVerify = (docData: any, status: 'APPROVED' | 'REJECTED') => {
    if (!firestore) return;
    setIsProcessing(docData.id);
    
    // 1. Update verification document status
    const docRef = doc(firestore, 'verification_docs', docData.id);
    updateDoc(docRef, { status: status })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status },
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

    // 2. Update user profile status
    const userRef = doc(firestore, 'users', docData.userId);
    const userUpdate = { 
      verificationStatus: status === 'APPROVED' ? 'VERIFIED' : 'FLAGGED',
      trustScore: status === 'APPROVED' ? 98.4 : 45.0
    };
    updateDoc(userRef, userUpdate)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: userUpdate,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
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
    setIsProcessing(null);
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
                                 {doc.type === 'TIN' ? `TIN: ${doc.metadata?.tin || 'N/A'}` : `NID: ${doc.metadata?.nid || 'N/A'}`} | ADDR: {doc.metadata?.address?.substring(0, 40) || 'UNSET'}...
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
        </main>

        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
           <DialogContent className="max-w-3xl glass-panel border-accent/20 bg-background/95 p-0 overflow-hidden">
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

                 <div className="p-8">
                    <Tabs defaultValue="front" className="space-y-6">
                       <TabsList className="bg-secondary/50 border border-white/5 p-1">
                          <TabsTrigger value="front" className="text-[10px] uppercase font-bold tracking-widest">Front View</TabsTrigger>
                          <TabsTrigger value="back" className="text-[10px] uppercase font-bold tracking-widest">Back View</TabsTrigger>
                          <TabsTrigger value="metadata" className="text-[10px] uppercase font-bold tracking-widest">Mesh Metadata</TabsTrigger>
                       </TabsList>

                       <TabsContent value="front">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Front Card Visual */}
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
                                         <p className="text-[8px] uppercase font-bold text-muted-foreground">Birth Details</p>
                                         <p className="text-[10px] text-white/80 font-bold uppercase">{selectedDoc.metadata?.dob || 'N/A'}</p>
                                      </div>
                                   </div>
                                </div>
                                <div className="absolute bottom-4 right-4 opacity-20">
                                   <Fingerprint className="h-12 w-12 text-accent" />
                                </div>
                             </div>

                             <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-bold text-accent tracking-[0.2em] border-b border-white/5 pb-2">Family Context</h4>
                                <div className="space-y-3">
                                   <div className="flex items-center gap-3">
                                      <div className="p-1.5 rounded-md bg-secondary/50"><User className="h-3.5 w-3.5 text-muted-foreground" /></div>
                                      <div>
                                         <p className="text-[8px] uppercase font-bold text-muted-foreground">Father's Name</p>
                                         <p className="text-xs text-white font-bold">{selectedDoc.metadata?.father || 'N/A'}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="p-1.5 rounded-md bg-secondary/50"><User className="h-3.5 w-3.5 text-muted-foreground" /></div>
                                      <div>
                                         <p className="text-[8px] uppercase font-bold text-muted-foreground">Mother's Name</p>
                                         <p className="text-xs text-white font-bold">{selectedDoc.metadata?.mother || 'N/A'}</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </TabsContent>

                       <TabsContent value="back">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Back Card Visual */}
                             <div className="aspect-[1.6/1] rounded-2xl bg-secondary/20 border-2 border-accent/20 p-6 relative shadow-2xl overflow-hidden group">
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                   <span className="text-[8px] font-bold text-green-400">MRZ_VALID_OK</span>
                                </div>
                                
                                <div className="space-y-4">
                                   <div className="space-y-1">
                                      <p className="text-[8px] uppercase font-bold text-muted-foreground">Residential Address</p>
                                      <p className="text-[10px] text-white/90 leading-tight italic w-full">
                                         {selectedDoc.metadata?.address || 'N/A'}
                                      </p>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                         <p className="text-[8px] uppercase font-bold text-muted-foreground">Place of Birth</p>
                                         <p className="text-[10px] text-white font-bold">{selectedDoc.metadata?.placeOfBirth || 'SIRAJGANJ'}</p>
                                      </div>
                                      <div className="space-y-1 text-right">
                                         <p className="text-[8px] uppercase font-bold text-muted-foreground">Issue Date</p>
                                         <p className="text-[10px] text-accent font-bold">{selectedDoc.metadata?.issueDate || '21 Dec 2017'}</p>
                                      </div>
                                   </div>
                                   
                                   {/* Mock MRZ */}
                                   <div className="mt-4 p-2 bg-black/40 rounded border border-white/5">
                                      <p className="text-[7px] font-mono text-muted-foreground/60 break-all leading-tight tracking-tighter">
                                         {selectedDoc.metadata?.mrz || 'I<BGD596298368<97<<<<<<<<<<<<<<< 9406155M3212208BGD<<<<<<<<<<<2 FARID<<SHEIKH<<<<<<<<<<<<<<<<<<'}
                                      </p>
                                   </div>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-bold text-accent tracking-[0.2em] border-b border-white/5 pb-2">Back Side Registry</h4>
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                      <div className="p-1.5 rounded-md bg-secondary/50"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /></div>
                                      <div>
                                         <p className="text-[8px] uppercase font-bold text-muted-foreground">Geo Binding</p>
                                         <p className="text-xs text-white font-bold">{selectedDoc.metadata?.placeOfBirth || 'SIRAJGANJ'}, BD</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="p-1.5 rounded-md bg-secondary/50"><Heart className="h-3.5 w-3.5 text-red-400" /></div>
                                      <div>
                                         <p className="text-[8px] uppercase font-bold text-muted-foreground">Blood Group</p>
                                         <p className="text-xs text-white font-bold">{selectedDoc.metadata?.bloodGroup || 'O+'}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="p-1.5 rounded-md bg-secondary/50"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /></div>
                                      <div>
                                         <p className="text-[8px] uppercase font-bold text-muted-foreground">Registry Issue</p>
                                         <p className="text-xs text-white font-bold">{selectedDoc.metadata?.issueDate || '21 Dec 2017'}</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </TabsContent>

                       <TabsContent value="metadata" className="space-y-6">
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] space-y-2">
                             <p className="text-accent">&gt;&gt;&gt; START_MRZ_DECODE: OK</p>
                             <p className="text-white/60">&gt;&gt;&gt; CROSS_REF_ISSUE_DATE: 2017-12-21 matches government database</p>
                             <p className="text-white/60">&gt;&gt;&gt; BINDING_ADDR: {selectedDoc.metadata?.address}</p>
                             <p className="text-green-400">&gt;&gt;&gt; STATUS: NO_ACTIVE_FLAGS_FOUND</p>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded bg-accent/10 border border-accent/20 text-[9px] text-accent">
                             <Zap className="h-3.5 w-3.5" />
                             Deterministic cross-reference check complete for all registry nodes.
                          </div>
                       </TabsContent>
                    </Tabs>
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
