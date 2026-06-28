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
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function LegalBoundPage() {
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
            HASH_VAL: 0x82AF...4E21
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1000px] mx-auto w-full space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.2em] text-[10px] font-bold">
              Deterministic Accountability
            </Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter">
              THE SOVEREIGN <span className="text-accent italic">COVENANT</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto italic">
              "In code we trust, by law we are bound." Accessing the Sovereign Mesh constitutes a cryptographic acceptance of the following deterministic frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader className="p-4">
                <ShieldCheck className="h-6 w-6 text-accent mb-2" />
                <CardTitle className="text-sm font-bold uppercase tracking-tight">Identity Bound</CardTitle>
                <CardDescription className="text-[10px]">Biometric & Cryptographic linking.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="p-4">
                <Lock className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-sm font-bold uppercase tracking-tight">Data Sovereignty</CardTitle>
                <CardDescription className="text-[10px]">Zero-knowledge mesh storage.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500">
              <CardHeader className="p-4">
                <Scale className="h-6 w-6 text-red-500 mb-2" />
                <CardTitle className="text-sm font-bold uppercase tracking-tight">Algorithmic Law</CardTitle>
                <CardDescription className="text-[10px]">Smart-contract enforcement.</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Article I: System Access</p>
                    <p className="text-xs text-muted-foreground">Terms of Service & Usage Limits</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-4 pb-6">
                <p>
                  Access to the Sovereign OS Kernel is granted only to validated entities. By initializing a session link, you agree that your actions are deterministic and logged within the Infrastructure Plane.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-xs">
                  <li>Unauthorized attempts to bypass the Priority Resolver will result in immediate node isolation.</li>
                  <li>Multi-rail disbursements are subject to Imperial Directive validation for amounts exceeding $1,000.</li>
                  <li>System load management is prioritized based on the active Kernel Mode (NORMAL/EMERGENCY/LOCKDOWN).</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Article II: Data Mesh</p>
                    <p className="text-xs text-muted-foreground">Privacy, Encryption & Anycast Routing</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-4 pb-6">
                <p>
                  Sovereign OS operates on a zero-knowledge basis. Your mission-critical data is encrypted via AES-256-GCM and distributed across 42 anycast nodes globally.
                </p>
                <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] space-y-1">
                  <p className="text-primary">&gt;&gt;&gt; ENCRYPTION_LAYER: ACTIVE</p>
                  <p className="text-white/80">&gt;&gt;&gt; LOG_RETENTION: DETERMINISTIC</p>
                  <p className="text-white/80">&gt;&gt;&gt; JURISDICTION: DISTRIBUTED_ANYCAST</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Article III: Liability</p>
                    <p className="text-xs text-muted-foreground">Algorithmic Risk & Fault Tolerance</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-4 pb-6">
                <p>
                  The Sovereign Kernel Orchestration (S.K.O.) is not liable for autonomous decisions made by AI agents operating within user-defined governance limits. 
                </p>
                <p className="p-3 bg-red-500/5 border border-red-500/20 rounded text-[11px] text-red-400 font-bold">
                  WARNING: LOCKDOWN mode overrides all civilian financial protocols to preserve the core integrity of the civilization stability index.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="glass-panel bg-accent/5 border-accent/20">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <Fingerprint className="h-5 w-5 text-accent" />
                  Identity Re-Verification Required
                </h4>
                <p className="text-xs text-muted-foreground">
                  Your legal binding status expires in 24 hours. A fresh cryptographic handshake is necessary to maintain mesh access.
                </p>
              </div>
              <Button className="cyan-glow bg-accent text-background font-bold h-12 px-8 uppercase tracking-widest text-[10px]">
                Refresh Binding <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <footer className="text-center pt-8 border-t border-white/5 space-y-2">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Sovereign Legal Framework v1.2.0-stable
            </p>
            <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-muted-foreground opacity-50">
              <span>SHA-256: 4f82...e911</span>
              <span>•</span>
              <span>NONCE: 991202</span>
              <span>•</span>
              <span>TS: {Date.now()}</span>
            </div>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
