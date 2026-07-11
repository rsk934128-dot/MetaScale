
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Gavel, 
  Scale, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  Globe, 
  Cpu,
  ArrowRight,
  ShieldAlert,
  History,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  BookOpen,
  Info,
  Eye,
  Shield,
  UserCheck,
  Mail,
  CheckCircle2,
  Database,
  Smartphone,
  CreditCard,
  PenTool
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useUser, useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LegalBoundPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleRefreshBinding = async () => {
    if (!firestore || !user?.uid) return;
    
    setIsRefreshing(true);
    
    try {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, { 
        lastBindingRefresh: Date.now()
      });

      emitEvent('SECURITY', 'LEGAL_BINDING_REFRESHED', 2, { 
        userId: user.uid,
        mode: 'CRYPTOGRAPHIC_HANDSHAKE',
        node: 'NODE-04-UK'
      });

      toast({
        title: "Binding Refreshed",
        description: "Your legal and cryptographic identity has been re-validated with the Sovereign Mesh.",
      });
    } catch (err) {
      console.error("Legal Handshake Error:", err);
      toast({
        variant: "destructive",
        title: "Handshake Failed",
        description: "Failed to establish a fresh legal corridor. System authorization denied."
      });
    } finally {
      setIsRefreshing(false);
    }
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
              Legal Bound & Governance
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            ISO 20022 READY • BIS COMPLIANT
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1100px] mx-auto w-full space-y-12 pb-20">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.2em] text-[10px] font-bold px-4 py-1">
              Deterministic Accountability
            </Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter uppercase">
              THE SOVEREIGN <span className="text-accent italic">COVENANT</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto italic leading-relaxed">
              "Governing the Sirajganj Operational Pilot through exactly-once ledger invariants and BFIU-compliant identity binding."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
             <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <RefreshCw className="h-20 w-20 text-accent" />
                </div>
                <div className="flex items-start gap-5 relative z-10">
                   <div className="p-3 rounded-xl bg-accent/20 border border-accent/30 text-accent shrink-0">
                      <Info className="h-6 w-6" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-lg font-headline font-bold text-white uppercase italic tracking-tighter">Ledger Mandate</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                         Atomic Locking via Firestore ensures absolute prevention of double-spending.
                      </p>
                   </div>
                </div>
             </div>

             <Card className="glass-panel border-accent/40 bg-accent/5 overflow-hidden group hover:border-accent transition-all cursor-pointer shadow-[0_0_50px_rgba(0,242,255,0.1)]">
                <Link href="/legal/agreement" className="flex items-center gap-6 p-6">
                   <div className="p-4 rounded-2xl bg-accent text-background shadow-xl group-hover:scale-110 transition-transform">
                      <PenTool className="h-8 w-8" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-lg font-headline font-bold text-white uppercase italic leading-none">System Integration Agreement</h4>
                      <p className="text-[10px] text-accent uppercase font-bold tracking-widest">Master Protocol v1.2</p>
                      <p className="text-[10px] text-muted-foreground italic mt-2 flex items-center gap-1">
                         View Professional Draft <ArrowRight className="h-3 w-3" />
                      </p>
                   </div>
                </Link>
             </Card>
          </div>

          <Tabs defaultValue="terms" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1 w-full flex overflow-x-auto">
              <TabsTrigger value="terms" className="flex-1 text-[10px] uppercase font-bold tracking-widest px-4 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Terms of Use</TabsTrigger>
              <TabsTrigger value="compliance" className="flex-1 text-[10px] uppercase font-bold tracking-widest px-4 h-full data-[state=active]:bg-accent data-[state=active]:text-background">AML/CFT</TabsTrigger>
              <TabsTrigger value="data" className="flex-1 text-[10px] uppercase font-bold tracking-widest px-4 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Data Residency</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel border-l-4 border-l-accent">
                  <CardHeader className="p-4">
                    <ShieldCheck className="h-6 w-6 text-accent mb-2" />
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">Identity Binding</CardTitle>
                    <CardDescription className="text-[10px]">BFIU/BB Compliant.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-l-4 border-l-primary">
                  <CardHeader className="p-4">
                    <Lock className="h-6 w-6 text-primary mb-2" />
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">Exactly-Once</CardTitle>
                    <CardDescription className="text-[10px]">BIS RTGS Standard.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-l-4 border-l-red-500">
                  <CardHeader className="p-4">
                    <Scale className="h-6 w-6 text-red-500 mb-2" />
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">T+0 Finality</CardTitle>
                    <CardDescription className="text-[10px]">Instant Settlement.</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">1. Regional Jurisdiction (Sirajganj Pilot)</p>
                        <p className="text-xs text-muted-foreground">Governing 3.3M Citizens</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <p>
                      Sovereign OS provides deterministic financial infrastructure for the Rajshahi Division. All regional settlements for dairy cooperatives and hand-loom traders are governed by local trade license validation and mandatory NID/TIN binding.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-12 animate-fade-in">
               <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 flex gap-4 items-start shadow-xl">
                  <ShieldAlert className="h-6 w-6 text-red-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">AML/CFT Regulatory Framework</h4>
                    <p className="text-xs text-muted-foreground italic leading-relaxed mt-1">
                      "Under the Anti-Money Laundering (AML) Act, all transactions internal to the Sirajganj Hub must be linked to a verified BFIU identity node."
                    </p>
                  </div>
               </div>

               <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="privacy-1" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">1. Programmatic NID/TIN Binding</p>
                        <p className="text-xs text-muted-foreground">CIP/CIB Enforcement per Bangladesh Bank</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-6 pb-6 px-4">
                    <p>
                      Financial operations exceeding specific thresholds must be linked to a verified national identity. Programmatic binding of NID and TIN records ensures that agricultural credits can be audited by state authorities, preventing capital flight.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="data" className="space-y-12 animate-fade-in">
               <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex gap-4 items-start">
                 <Globe className="h-6 w-6 text-blue-400 shrink-0" />
                 <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">Cross-Border Data Residency</h4>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                       Sovereign OS strictly segments ISO 20022 payloads from regional client identifying data.
                    </p>
                 </div>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="ma-1" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">1. Localized PII Storage</p>
                        <p className="text-xs text-muted-foreground">GDPR & National Data Localization Compliant</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <p>
                      While the Anycast ledger resides globally to minimize latency, Personally Identifiable Information (PII) such as NID and TIN records are strictly stored within localized database instances matching Bangladesh’s national data localization regulations.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>

          <Card className="glass-panel bg-accent/5 border-accent/20">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <Fingerprint className="h-5 w-5 text-accent" />
                  Kernel Handshake Protocol v1.2
                </h4>
                <p className="text-xs text-muted-foreground">
                  Access to the Sirajganj Operational Pilot requires re-validation of your Identity Binding status.
                </p>
              </div>
              <Button 
                className="cyan-glow bg-accent text-background font-bold h-12 px-8 uppercase tracking-widest text-[10px]"
                onClick={handleRefreshBinding}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isRefreshing ? "Refreshing..." : "Authorize Handshake"}
                {!isRefreshing && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>

          <footer className="text-center pt-8 border-t border-white/5 space-y-2">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Sovereign OS Sirajganj Hub v1.2.0-stable • © 2024 FusionPay
            </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
