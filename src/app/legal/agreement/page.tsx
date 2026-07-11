
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export default function IntegrationAgreementPage() {
  const handlePrint = () => {
    window.print();
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
              Integration Agreement
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-white/10 text-xs font-bold" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print Document
            </Button>
            <Button size="sm" className="bg-accent text-background font-bold text-xs cyan-glow">
              <Download className="mr-2 h-4 w-4" /> Export PDF
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
                   <p className="text-xs font-bold text-muted-foreground uppercase print:text-black/40">Reference ID: <span className="text-white print:text-black">FP-INT-2026-042</span></p>
                   <p className="text-xs font-bold text-muted-foreground uppercase print:text-black/40">Date: <span className="text-white print:text-black">{new Date().toLocaleDateString()}</span></p>
                </div>
             </div>
             <div className="text-left md:text-right space-y-2">
                <Badge className="bg-accent/10 text-accent border-accent/30 text-[10px] uppercase font-bold px-4 print:border-black/20 print:text-black">Official Protocol</Badge>
                <h3 className="text-xl font-headline font-bold text-white uppercase tracking-tighter print:text-black">Master System <br/> Integration Agreement</h3>
             </div>
          </div>

          {/* Agreement Body */}
          <div className="space-y-10 text-sm leading-relaxed font-body">
             
             {/* Section 1: Scope */}
             <section className="space-y-4">
                <h4 className="text-lg font-headline font-bold text-white uppercase italic border-l-4 border-accent pl-4 print:text-black print:border-black">
                   I. Scope of Integration (ইন্টিগ্রেশন পরিধি)
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

             {/* Section 2: Technical & Security */}
             <section className="space-y-4">
                <h4 className="text-lg font-headline font-bold text-white uppercase italic border-l-4 border-primary pl-4 print:text-black print:border-black">
                   II. Technical Standards & Security
                </h4>
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 print:bg-gray-50 print:border-black/10">
                   <p className="text-xs text-muted-foreground print:text-black/70 italic">
                      FusionPay utilizes institutional-grade security protocols to ensure the integrity of every fiscal signal.
                   </p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Encryption", val: "AES-256-GCM", icon: Lock },
                        { label: "Protocol", icon: Cpu, val: "ISO 20022" },
                        { label: "Identity", icon: ShieldCheck, val: "ECC_ED25519" },
                        { label: "Sync", icon: Globe, val: "42 Anycast" }
                      ].map((s, i) => (
                        <div key={i} className="text-center space-y-1">
                           <s.icon className="mx-auto h-5 w-5 text-primary print:text-black" />
                           <p className="text-[9px] font-bold text-white uppercase print:text-black">{s.val}</p>
                           <p className="text-[8px] text-muted-foreground uppercase print:text-black/40">{s.label}</p>
                        </div>
                      ))}
                   </div>
                </div>
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
                      <div className="h-24 flex items-center justify-center border-b border-dashed border-white/20 print:border-black/20">
                         <p className="text-xs text-muted-foreground italic print:text-black/40">Place Authorized Signature Here</p>
                      </div>
                      <div className="text-center md:text-left space-y-1">
                         <p className="text-xs font-bold text-white uppercase print:text-black">Client Authority</p>
                         <p className="text-[9px] text-muted-foreground uppercase tracking-widest print:text-black/60">Authorized Signatory</p>
                      </div>
                   </div>
                </div>
             </section>
          </div>

          {/* Footer Footer */}
          <div className="pt-10 border-t border-white/5 text-center space-y-4 print:border-black/10">
             <div className="flex items-center justify-center gap-3">
                <ShieldCheck className="h-4 w-4 text-accent print:text-black" />
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground print:text-black/40">FusionPay Sovereign OS • 2024</p>
             </div>
             <p className="text-[8px] text-muted-foreground opacity-30 italic print:text-black/20">
                This document is generated by the Sovereign AI Oracle. Verifiable hash: 0x4f82...e911
             </p>
          </div>
        </main>
        
        <footer className="p-8 text-center print:hidden">
           <Button asChild variant="ghost" className="text-muted-foreground hover:text-accent">
              <Link href="/legal"><ChevronLeft className="mr-2 h-4 w-4" /> Return to Governance Hub</Link>
           </Button>
        </footer>
      </SidebarInset>
    </div>
  );
}
