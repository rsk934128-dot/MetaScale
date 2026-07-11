
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Gavel, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  Globe, 
  Lock, 
  Cpu, 
  Activity,
  ChevronLeft,
  Stamp,
  PenTool,
  Target,
  Settings2,
  Zap,
  Fingerprint,
  RefreshCw,
  Loader2,
  Code2,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function IntegrationAgreementPage() {
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  
  // Dynamic Content State
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [clientData, setClientData] = useState({
    name: "Authorized Signatory",
    company: "Client Organization",
    date: new Date().toISOString().split('T')[0]
  });

  // Execution State
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [digitalSeal, setDigitalSeal] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleAcceptAndActivate = async () => {
    setIsAccepting(true);
    
    // Simulate Cryptographic Handshake & Provisioning
    const hash = `SHA256_${Math.random().toString(36).substr(2, 16).toUpperCase()}_${Date.now()}`;
    const generatedKey = `sk_live_${Math.random().toString(36).substr(2, 24)}`;

    emitEvent('SECURITY', 'PROVISIONING_INITIATED', 2, { 
      client: clientData.company, 
      scope: 'FULL_MESH_ACCESS' 
    });

    setTimeout(() => {
      setDigitalSeal(hash);
      setApiKey(generatedKey);
      setIsAccepted(true);
      setIsAccepting(false);
      
      emitEvent('FINANCE', 'AGREEMENT_STABILIZED', 1, { 
        seal: hash,
        node: 'NODE-04-UK'
      });

      toast({
        title: "Activation Successful",
        description: "Your Sandbox API Key has been provisioned. Welcome to the Mesh.",
      });
    }, 3000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6 print:hidden">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <FileText className="h-5 w-5 text-accent" />
              Integration Pipeline
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-white/10 text-xs font-bold" onClick={() => setIsConfigOpen(true)}>
              <Settings2 className="mr-2 h-4 w-4" /> Configure Data
            </Button>
            <Button variant="outline" size="sm" className="border-white/10 text-xs font-bold" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-12 max-w-[900px] mx-auto w-full space-y-12 bg-white/5 md:my-10 md:rounded-3xl border border-white/5 shadow-2xl print:bg-white print:text-black print:m-0 print:border-none print:shadow-none">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/10 pb-10 print:border-black/10">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <Logo size="lg" className="print:text-black" />
                   <div className="space-y-0.5">
                      <h2 className="text-2xl font-headline font-bold text-white uppercase italic tracking-tighter print:text-black">FusionPay Global</h2>
                      <p className="text-[10px] uppercase font-bold text-accent tracking-[0.3em] print:text-black/60">Sovereign Mesh Node-04</p>
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-muted-foreground uppercase print:text-black/40">Reference ID: <span className="text-white print:text-black">FP-INT-2026-{digitalSeal?.slice(-4) || 'PENDING'}</span></p>
                   <p className="text-xs font-bold text-muted-foreground uppercase print:text-black/40">Agreement Date: <span className="text-white print:text-black">{clientData.date}</span></p>
                </div>
             </div>
             <div className="text-left md:text-right space-y-2">
                <Badge className="bg-accent/10 text-accent border-accent/30 text-[10px] uppercase font-bold px-4 print:border-black/20 print:text-black">Official Protocol</Badge>
                <h3 className="text-xl font-headline font-bold text-white uppercase tracking-tighter print:text-black">Master System <br/> Integration Agreement</h3>
             </div>
          </div>

          {/* Provisioning Alert for Accepted State */}
          {isAccepted && (
            <Card className="glass-panel border-green-500/20 bg-green-500/5 animate-fade-in print:hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Zap className="h-6 w-6 text-green-400" />
                      <h4 className="text-sm font-bold text-white uppercase">Provisioning Complete</h4>
                   </div>
                   <Badge variant="outline" className="border-green-500/30 text-green-400">STATUS: LIVE_NODE</Badge>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                   <Label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Your Private API Key</Label>
                   <div className="flex items-center gap-3">
                      <code className="text-xs font-mono text-accent bg-accent/5 px-3 py-2 rounded-lg border border-accent/20 flex-1">{apiKey}</code>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { navigator.clipboard.writeText(apiKey!); toast({ title: "Copied" }); }}><RefreshCw className="h-4 w-4" /></Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agreement Body */}
          <div className="space-y-10 text-sm leading-relaxed font-body">
             
             {/* Section 1: Parties */}
             <section className="space-y-4">
                <h4 className="text-lg font-headline font-bold text-white uppercase italic border-l-4 border-accent pl-4 print:text-black print:border-black">
                   I. Parties Involved (অংশগ্রহণকারী পক্ষসমূহ)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs italic text-muted-foreground print:text-black/80">
                   <div className="p-4 rounded-2xl border border-white/5 bg-white/5 print:bg-gray-50 print:border-black/5">
                      <p className="font-bold text-white uppercase mb-2 print:text-black">Provider:</p>
                      <p>FusionPay Global Node (NoorNexus Infrastructure)</p>
                      <p>Sovereign Mesh ID: NODE-04-UK-SKO</p>
                   </div>
                   <div className="p-4 rounded-2xl border border-accent/20 bg-accent/5 print:bg-gray-50 print:border-black/5">
                      <p className="font-bold text-accent uppercase mb-2">Recipient:</p>
                      <p className="text-white font-bold print:text-black">{clientData.company}</p>
                      <p>Authorized Rep: {clientData.name}</p>
                   </div>
                </div>
             </section>

             {/* Section 2: Scope */}
             <section className="space-y-4">
                <h4 className="text-lg font-headline font-bold text-white uppercase italic border-l-4 border-primary pl-4 print:text-black print:border-black">
                   II. Scope of Integration
                </h4>
                <p className="text-muted-foreground italic print:text-black/80">
                   This agreement formalizes the handshake between the Client’s Infrastructure and the FusionPay Sovereign Mesh. The scope includes but is not limited to:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     "Automated Payout Dispatch via SWIFT/TON/Local MFS",
                     "Exactly-Once Ledger Finality (T+0)",
                     "Deterministic Reconciliation & Settlement Control",
                     "ISO 20022 Compliant Financial Messaging"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-white/5 print:bg-gray-50 print:border-black/5">
                        <CheckCircle2 className="h-4 w-4 text-accent print:text-black" />
                        <span className="text-[11px] font-bold text-white/90 print:text-black">{item}</span>
                     </li>
                   ))}
                </ul>
             </section>

             {/* Section 3: SLA */}
             <section className="space-y-4">
                <h4 className="text-lg font-headline font-bold text-white uppercase italic border-l-4 border-green-500 pl-4 print:text-black print:border-black">
                   III. Service Level Agreement (SLA)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <div className="flex justify-between items-end border-b border-white/5 pb-2 print:border-black/10">
                         <p className="text-[11px] font-bold text-muted-foreground uppercase">Target Uptime</p>
                         <p className="text-xl font-headline font-bold text-green-400 print:text-black">99.99%</p>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/5 pb-2 print:border-black/10">
                         <p className="text-[11px] font-bold text-muted-foreground uppercase">Response Latency</p>
                         <p className="text-xl font-headline font-bold text-green-400 print:text-black">&lt; 10ms</p>
                      </div>
                   </div>
                   <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 print:bg-gray-50 print:border-black/10">
                      <p className="text-[10px] text-white/80 leading-relaxed italic print:text-black/80">
                         "FusionPay guarantees exactly-once processing for every transaction. In case of downtime exceeding 0.01%, credits will be applied as per the Eco Governance Policy."
                      </p>
                   </div>
                </div>
             </section>

             {/* Section 4: Authorization */}
             <section className="pt-10 space-y-12 print:pt-20">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest text-center opacity-40 print:text-black">Authorization & Seals</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {/* FusionPay Side */}
                   <div className="space-y-6">
                      <div className="h-24 flex items-center justify-center border-b border-dashed border-white/20 relative print:border-black/20">
                         <div className="absolute top-0 right-0 opacity-20 print:opacity-100">
                            <Stamp className="h-16 w-16 text-accent print:text-gray-300" />
                         </div>
                         <p className="text-2xl font-headline italic text-white/20 print:text-gray-200">Digital Seal Active</p>
                      </div>
                      <div className="text-center md:text-left space-y-1">
                         <p className="text-xs font-bold text-white uppercase print:text-black">Sheikh Farid</p>
                         <p className="text-[9px] text-muted-foreground uppercase tracking-widest print:text-black/60">Master Kernel Governor, NoorNexus</p>
                      </div>
                   </div>

                   {/* Client Side */}
                   <div className="space-y-6">
                      <div className="h-24 flex flex-col items-center justify-center border-b border-dashed border-white/20 relative print:border-black/20">
                         {isAccepted ? (
                            <div className="text-center animate-fade-in">
                               <Fingerprint className="h-12 w-12 text-accent mx-auto mb-1" />
                               <p className="text-[10px] font-mono text-accent uppercase font-bold tracking-tighter">ECC_SIGNED_NODE</p>
                            </div>
                         ) : (
                            <p className="text-xs text-muted-foreground italic print:text-black/40">Requires Acceptance Activation</p>
                         )}
                      </div>
                      <div className="text-center md:text-left space-y-1">
                         <p className="text-xs font-bold text-white uppercase print:text-black">{clientData.name}</p>
                         <p className="text-[9px] text-muted-foreground uppercase tracking-widest print:text-black/60">Authorized Signatory, {clientData.company}</p>
                      </div>
                   </div>
                </div>

                {/* Digital Verification Block */}
                {isAccepted && (
                  <div className="p-6 rounded-2xl bg-black/60 border border-white/10 font-mono text-[9px] space-y-2 animate-fade-in print:bg-gray-50 print:text-black">
                     <p className="text-accent font-bold uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3" /> Integrity Verification Hash
                     </p>
                     <p className="text-white/60 break-all">{digitalSeal}</p>
                     <div className="flex justify-between items-center pt-2">
                        <p className="text-[7px] text-muted-foreground italic">"Verifiable via NoorNexus Sovereign Audit Mesh v1.2"</p>
                        <Badge variant="outline" className="text-[7px] border-accent/20 text-accent">ISO_20022_VERIFIED</Badge>
                     </div>
                  </div>
                )}

                {/* Accept Button Container */}
                {!isAccepted && (
                  <div className="pt-10 flex flex-col items-center gap-6 print:hidden">
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        <p className="text-xs italic">I hereby accept the technical and legal terms of this integration.</p>
                     </div>
                     <Button 
                        size="lg" 
                        className="h-16 px-16 rounded-full bg-accent text-background font-bold uppercase tracking-widest text-xs cyan-glow transition-all hover:scale-105"
                        onClick={handleAcceptAndActivate}
                        disabled={isAccepting}
                     >
                        {isAccepting ? (
                           <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Provisioning Node...</>
                        ) : (
                           <><Zap className="mr-2 h-5 w-5" /> Accept & Activate Protocol</>
                        )}
                     </Button>
                  </div>
                )}
             </section>
          </div>

          {/* Footer Footer */}
          <div className="pt-10 border-t border-white/5 text-center space-y-4 print:border-black/10">
             <div className="flex items-center justify-center gap-3">
                <ShieldCheck className="h-4 w-4 text-accent print:text-black" />
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground print:text-black/40">FusionPay Sovereign OS • 2024</p>
             </div>
             <p className="text-[8px] text-muted-foreground opacity-30 italic print:text-black/20">
                This document is generated by the Sovereign AI Oracle. Verifiable hash: {digitalSeal?.slice(0, 12) || '0x4f82...e911'}
             </p>
          </div>
        </main>
        
        <footer className="p-8 text-center print:hidden">
           <Button asChild variant="ghost" className="text-muted-foreground hover:text-accent">
              <Link href="/legal"><ChevronLeft className="mr-2 h-4 w-4" /> Return to Governance Hub</Link>
           </Button>
        </footer>

        {/* Configuration Dialog */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="max-w-md glass-panel border-accent/20 bg-background/95 p-0 overflow-hidden">
             <div className="bg-accent/10 p-8 border-b border-white/10 text-center">
                <div className="mx-auto w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                   <Target className="h-6 w-6 text-accent" />
                </div>
                <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter">Configure Handshake</DialogTitle>
                <DialogDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Populate Agreement with Dynamic Data</DialogDescription>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Authorized Representative</Label>
                      <Input 
                        placeholder="e.g. John Doe" 
                        className="bg-secondary/30 border-white/5 h-12 text-sm"
                        value={clientData.name}
                        onChange={e => setClientData({...clientData, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Company Name</Label>
                      <Input 
                        placeholder="e.g. Acme Corp" 
                        className="bg-secondary/30 border-white/5 h-12 text-sm"
                        value={clientData.company}
                        onChange={e => setClientData({...clientData, company: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Agreement Date</Label>
                      <Input 
                        type="date"
                        className="bg-secondary/30 border-white/5 h-12 text-sm"
                        value={clientData.date}
                        onChange={e => setClientData({...clientData, date: e.target.value})}
                      />
                   </div>
                </div>
                <Button 
                   className="w-full h-12 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow"
                   onClick={() => setIsConfigOpen(false)}
                >
                   Finalize Document Preview
                </Button>
             </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </div>
  );
}
