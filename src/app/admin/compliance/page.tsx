
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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useKernel } from "@/components/kernel/KernelProvider";

const MOCK_PENDING_DOCS = [
  {
    id: "DOC-74232",
    userId: "user_01",
    userName: "SHEIKH FARID",
    type: "TIN",
    status: "PENDING",
    submittedAt: Date.now() - 3600000,
    metadata: {
      tin: "742322402703",
      father: "md.abdul barik sheikh",
      address: "masumpor, shodor 1, Sirajganj, PO: 6700"
    }
  }
];

export default function AdminCompliancePage() {
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const firestore = useFirestore();

  // In real app, we use firestore
  const docsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'verification_docs'), orderBy('submittedAt', 'desc'), limit(50));
  }, [firestore]);

  const { data: remoteDocs } = useCollection(docsQuery);
  const displayedDocs = remoteDocs && remoteDocs.length > 0 ? remoteDocs : MOCK_PENDING_DOCS;

  const handleVerify = async (docId: string, status: 'APPROVED' | 'REJECTED') => {
    setIsProcessing(docId);
    
    emitEvent('SECURITY', 'DOCUMENT_VERIFICATION_RESOLVED', 2, { docId, status });

    setTimeout(() => {
      setIsProcessing(null);
      toast({
        title: status === 'APPROVED' ? "Compliance Approved" : "Request Rejected",
        description: `Entity status has been updated in the Sovereign Mesh.`,
        variant: status === 'APPROVED' ? "default" : "destructive",
      });
    }, 1500);
  };

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
              <p className="text-muted-foreground italic">"Reviewing identity and tax bindings for distributed entities."</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative w-72">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Search TIN or Citizen Name..." 
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
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-[9px] text-yellow-500 font-bold mt-1 uppercase">SLA: 4h Remaining</p>
               </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-accent">
               <CardHeader className="p-4 pb-2">
                 <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Citiziens</CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-bold">1,242</div>
                  <p className="text-[9px] text-accent font-bold mt-1 uppercase">Trust Index: 94.2%</p>
               </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-red-500">
               <CardHeader className="p-4 pb-2">
                 <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Flagged Entities</CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-bold">04</div>
                  <p className="text-[9px] text-red-500 font-bold mt-1 uppercase">Isolation Active</p>
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
               <div className="divide-y divide-white/5">
                  {displayedDocs.map((doc: any) => (
                    <div key={doc.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all">
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                             <FileText className="h-6 w-6 text-accent" />
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white uppercase">{doc.userName}</span>
                                <Badge variant="outline" className="text-[8px] border-white/10 uppercase">{doc.type} BINDING</Badge>
                                <Badge className="bg-yellow-500/20 text-yellow-500 text-[8px] uppercase">PENDING</Badge>
                             </div>
                             <p className="text-[11px] text-muted-foreground font-mono">TIN: {doc.metadata.tin} | ADDR: {doc.metadata.address}</p>
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
                          >
                             <Eye className="mr-1.5 h-3.5 w-3.5" /> View Certificate
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-[10px] font-bold h-9 border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleVerify(doc.id, 'REJECTED')}
                            disabled={isProcessing === doc.id}
                          >
                             <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-[10px] font-bold h-9 bg-accent text-background cyan-glow"
                            onClick={() => handleVerify(doc.id, 'APPROVED')}
                            disabled={isProcessing === doc.id}
                          >
                             {isProcessing === doc.id ? <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
                             Approve Entity
                          </Button>
                       </div>
                    </div>
                  ))}
               </div>
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
                      <p className="text-accent">>>> SYSTEM_DIRECTIVE: AUTO_AUDIT_ACTIVE</p>
                      <p className="text-white/60">>>> SCANNING_PERIMETER: NBR_BOGRA_CIRCLE_009</p>
                      <p className="text-white/60">>>> MATCH_RESULT: CITIZEN_BND_74232_VALID</p>
                      <p className="text-green-400">>>> RECOMMENDATION: APPROVE_FOR_INSTANT_PAYOUTS</p>
                   </div>
                   <div className="flex items-center gap-2 p-2 rounded bg-accent/10 border border-accent/20 text-[9px] text-accent">
                      <Info className="h-3.5 w-3.5" />
                      Automatic audit suggests 98% metadata alignment with government records.
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel">
                <CardHeader>
                   <CardTitle className="text-sm">Sector Stability Signals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {[
                     { name: "Bogra Zone (Taxes)", load: 45, status: "Normal" },
                     { name: "Sirajganj Civic Mesh", load: 12, status: "Optimal" },
                     { name: "Global Treasury Bridge", load: 88, status: "Throttled" }
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
      </SidebarInset>
    </div>
  );
}
