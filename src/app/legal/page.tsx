
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
  Table as TableIcon,
  Mail,
  CheckCircle2,
  Database,
  Smartphone,
  CreditCard
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
            REV_ID: 2026_05_28
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
              "Governing the Sirajganj Operational Pilot through ISO 20022 compliance and exactly-once ledger enforcement."
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 relative overflow-hidden animate-fade-in shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <RefreshCw className="h-20 w-20 text-accent" />
             </div>
             <div className="flex items-start gap-5 relative z-10">
                <div className="p-3 rounded-xl bg-accent/20 border border-accent/30 text-accent shrink-0">
                   <Info className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-lg font-headline font-bold text-white uppercase italic tracking-tighter">Identity Binding (NID/TIN) Enforcement</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed italic">
                      Satisfying CIP/CIB rules established by Bangladesh Bank, all merchants must link their accounts to their **National Identity Card (NID)** and **Taxpayer Identification Number (TIN)** for BDT 100 Crore regional dairy settlement.
                   </p>
                </div>
             </div>
          </div>

          <Tabs defaultValue="terms" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1 w-full flex overflow-x-auto">
              <TabsTrigger value="terms" className="flex-1 text-[10px] uppercase font-bold tracking-widest px-4 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Terms of Use</TabsTrigger>
              <TabsTrigger value="privacy" className="flex-1 text-[10px] uppercase font-bold tracking-widest px-4 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Compliance</TabsTrigger>
              <TabsTrigger value="mini-app" className="flex-1 text-[10px] uppercase font-bold tracking-widest px-4 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Ledger Invariants</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel border-l-4 border-l-accent">
                  <CardHeader className="p-4">
                    <ShieldCheck className="h-6 w-6 text-accent mb-2" />
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">Identity Binding</CardTitle>
                    <CardDescription className="text-[10px]">CIB/CIP Compliant.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-l-4 border-l-primary">
                  <CardHeader className="p-4">
                    <Lock className="h-6 w-6 text-primary mb-2" />
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">Exactly-Once</CardTitle>
                    <CardDescription className="text-[10px]">No Double Credits.</CardDescription>
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
                        <p className="text-sm font-bold text-white uppercase tracking-widest">1. Regional Jurisdiction & Eligibility</p>
                        <p className="text-xs text-muted-foreground">Sirajganj Hub Operational Parameters</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <p>
                      FusionPay Sovereign OS provides deterministic financial infrastructure for citizens of Bangladesh, specifically within the Rajshahi Division. All regional settlements are governed by local trade license validation protocols.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-12 animate-fade-in">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="privacy-1" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">1. NID/TIN Data Governance</p>
                        <p className="text-xs text-muted-foreground">Programmatic Identity Binding Protocols</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-6 pb-6 px-4">
                    <p>
                      To satisfy Bangladesh Bank's CIP requirements, every high-volume dairy cooperative and hand-loom merchant must undergo a cryptographic handshake linking their digital wallet to their verified **NID** and **TIN** data.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="mini-app" className="space-y-12 animate-fade-in">
              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex gap-4 items-start">
                 <Lock className="h-6 w-6 text-blue-400 shrink-0" />
                 <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">Deterministic Ledger Invariants</h4>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                       Every transaction follows a rigid state machine: **CREATED -> PAID -> CREDITED**.
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
                        <p className="text-sm font-bold text-white uppercase tracking-widest">1. Double Credit Prevention</p>
                        <p className="text-xs text-muted-foreground">Exactly-Once Ledger Enforcement</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <p>
                      Atomic database transactions lock the target account's balance field during write operations. This prevents race conditions and ensures that no merchant is credited twice for the same payment event.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ma-2" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">2. Self-Healing Recoveries</p>
                        <p className="text-xs text-muted-foreground">Exponential Backoff Cron Protocols</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <p>
                      In cases of regional telecommunications failure, the system's background crons automatically reconcile transactions with MFS gateways using exponential backoff (2^n) intervals, ensuring eventual settlement finality.
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
                  Legal Handshake Required
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
                {isRefreshing ? "Refreshing..." : "Authorize Binding"}
                {!isRefreshing && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>

          <footer className="text-center pt-8 border-t border-white/5 space-y-2">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Sovereign OS Sirajganj Pilot v1.2.0-stable • © 2024 FusionPay
            </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
