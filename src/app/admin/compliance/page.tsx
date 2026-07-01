
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
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";
import { useKernel } from "@/components/kernel/KernelProvider";

export default function AdminCompliancePage() {
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
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
      await updateDoc(doc(firestore, 'verification_docs', docData.id), { status });
      
      // 2. Update user profile status
      const userRef = doc(firestore, 'users', docData.userId);
      await updateDoc(userRef, { 
        verificationStatus: status === 'APPROVED' ? 'VERIFIED' : 'FLAGGED',
        trustScore: status === 'APPROVED' ? 98.4 : 45.0
      });

      emitEvent('SECURITY', 'DOCUMENT_VERIFICATION_RESOLVED', 2, { 
        docId: docData.id, 
        userId: docData.userId, 
        status 
      });

      toast({
        title: status === 'APPROVED' ? "Compliance Approved" : "Request Rejected",
        description: `Citizen ${docData.userName} status has been updated.`,
      });
    } catch (err) {
      toast({ variant: "destructive", title: "Action Failed" });
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
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search TIN, NID or Citizen Name..." 
                className="pl-10 bg-secondary/30 border-white/5 h-10 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Card className="glass-panel border-white/5">
            <CardHeader className="p-6 border-b border-white/5">
               <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-accent" />
                  Stablecoin CIP Verification Queue
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
                               <FileText className="h-6 w-6 text-accent" />
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white uppercase">{doc.userName}</span>
                                  <Badge variant="outline" className="text-[8px] border-white/10 uppercase">{doc.type} BINDING</Badge>
                                  <Badge className={doc.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 text-[8px] uppercase' : 'bg-yellow-500/20 text-yellow-500 text-[8px] uppercase'}>
                                    {doc.status}
                                  </Badge>
                               </div>
                               <p className="text-[11px] text-muted-foreground font-mono">
                                 TIN: {doc.metadata?.tin} | NID: {doc.metadata?.nid}
                               </p>
                               <p className="text-[10px] text-muted-foreground italic uppercase">Submitted: {new Date(doc.submittedAt).toLocaleString()}</p>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2 shrink-0">
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
                                   <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve Binding
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
      </SidebarInset>
    </div>
  );
}
