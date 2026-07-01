
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
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useUser, useFirestore } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        trustScore: increment(0.2),
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
      toast({
        variant: "destructive",
        title: "Handshake Failed",
        description: "Failed to establish a fresh legal corridor. Try again."
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
            LAST_UPDATE: 28_MAY_2026
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1000px] mx-auto w-full space-y-12 pb-20">
          <div className="text-center space-y-4">
            <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.2em] text-[10px] font-bold">
              Deterministic Accountability
            </Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter uppercase">
              TERMS OF <span className="text-accent italic">USE</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto italic leading-relaxed">
              "These Terms of Use govern your access to and use of FusionPay Sovereign OS, including certain utilities and features offered by third parties."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader className="p-4">
                <ShieldCheck className="h-6 w-6 text-accent mb-2" />
                <CardTitle className="text-sm font-bold uppercase tracking-tight">Self-Custody</CardTitle>
                <CardDescription className="text-[10px]">User autonomy and responsibility.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="p-4">
                <Lock className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-sm font-bold uppercase tracking-tight">Decentralized</CardTitle>
                <CardDescription className="text-[10px]">Blockchain interaction interface.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500">
              <CardHeader className="p-4">
                <Scale className="h-6 w-6 text-red-500 mb-2" />
                <CardTitle className="text-sm font-bold uppercase tracking-tight">Compliance</CardTitle>
                <CardDescription className="text-[10px]">Governed by the laws of Seychelles.</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="intro" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">1. Introduction & Eligibility</p>
                    <p className="text-xs text-muted-foreground">Scope, Acceptance and Eligibility requirements</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                <p>
                  FusionPay Sovereign OS is a self-custody solution. It enables users to interact with decentralized blockchain networks. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
                </p>
                <div className="space-y-2">
                  <p className="font-bold text-white/80">Eligibility:</p>
                  <ul className="list-disc pl-6 space-y-2 text-[12px]">
                    <li>You must be of legal age in your jurisdiction.</li>
                    <li>You are not located in any Restricted Jurisdictions (Cuba, Iran, North Korea, Syria, etc.).</li>
                    <li>You are not listed on Sanctions Lists.</li>
                    <li>You comply with all applicable laws and regulations in your jurisdiction.</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="risks" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">2. Risk Disclosure</p>
                    <p className="text-xs text-muted-foreground">Technologies, volatility and user autonomy</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                <p>
                  Use of blockchain technologies involves heightened risks, including misuse of cryptographic tools, software failure, and market volatility. You are solely responsible for managing, storing, and transferring your Digital Assets.
                </p>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 font-medium">
                  DeFi Account does not verify or guarantee the legitimacy of any third-party applications, smart contracts, or tokens. Use of these tokens via the wallet interface is at your own risk and discretion.
                </div>
                <p>
                  Tokenized assets like xStocks rely on third-party issuers and custodians. Holding such assets does not confer rights in the underlying company.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="responsibilities" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">3. Your Responsibilities</p>
                    <p className="text-xs text-muted-foreground">Account security, software updates and lawful use</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                <p>
                  You are solely responsible for configuring and using the account in a secure manner. This includes protecting your Recovery Phrase and Passcode. 
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[12px]">
                  <li>You must promptly install all software updates.</li>
                  <li>You agree not to engage in phishing, fraud, or malware distribution.</li>
                  <li>You will not disrupt or interfere with the operation of the OS or its users.</li>
                  <li>You must conduct your own research before engaging in any activity involving Digital Assets.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="solution" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">4. System Solution</p>
                    <p className="text-xs text-muted-foreground">Non-custodial wallet, Private keys and Transfers</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                <p>
                  FusionPay is a non-custodial wallet. This means we do not store, retain, or have access to your private keys or Digital Assets.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-bold text-white/80 mb-1">Recovery Phrase</p>
                    <p className="text-[11px]">Primary method: 24 unique words stored offline by you.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-bold text-white/80 mb-1">Blockchain Ledger</p>
                    <p className="text-[11px]">Sole authoritative record of all Digital Asset transactions.</p>
                  </div>
                </div>
                <p className="mt-4">
                  Transfers to contacts utilize an escrow mechanism. Assets unclaimed within 14 days are automatically returned to the sender.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="utilities" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">5. Third-Party Utilities</p>
                    <p className="text-xs text-muted-foreground">Swaps, NFTs, Apps and Earn Interfaces</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                <p>
                  We provide access to Third-Party Utilities (Swaps, Getgems, Morpho, Affluent, etc.) for your convenience. All such transactions occur directly on-chain between you and the protocol.
                </p>
                <div className="p-3 rounded bg-purple-500/5 border border-purple-500/10 text-[11px] italic">
                  We do not take custody of assets during third-party interactions. We reserve the right to restrict access to these features based on jurisdiction.
                </div>
                <p>
                  Earn Interfaces (Staking, Lending) involve material risks and are governed exclusively by third-party terms.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">6. Legal & Liability</p>
                    <p className="text-xs text-muted-foreground">Warranties, Indemnification and Termination</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                <p>
                  Services are provided "as is". We disclaim all implied warranties. Total liability is limited to the amount paid in the last 12 months or $5,000.
                </p>
                <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] space-y-2">
                  <p className="text-primary uppercase font-bold">Class Action Waiver:</p>
                  <p className="text-white/60">Any dispute or claim must be pursued on an individual basis only. You give up the right to participate in group or representative actions.</p>
                </div>
                <p>
                  These Terms are governed by the laws of Seychelles.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="glass-panel border-white/10 bg-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <Info className="h-4 w-4 text-accent" /> ANNEX I: DEFINITIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <ScrollArea className="h-48 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-muted-foreground">
                  <div><span className="text-white font-bold">Digital Assets:</span> Any digital asset supported on the mesh ledger.</div>
                  <div><span className="text-white font-bold">Recovery Phrase:</span> A set of 24 unique words for primary access.</div>
                  <div><span className="text-white font-bold">Passcode:</span> Four-digit numeric code for local authorization.</div>
                  <div><span className="text-white font-bold">Restricted Jurisdictions:</span> Cuba, Iran, North Korea, Syria and regions with sanctions.</div>
                  <div><span className="text-white font-bold">Sanctions Lists:</span> Restricted persons lists maintained by US, UN, UK or EU.</div>
                  <div><span className="text-white font-bold">Third-Party Utility:</span> External software or protocols accessible via the interface.</div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

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
              <Button 
                className="cyan-glow bg-accent text-background font-bold h-12 px-8 uppercase tracking-widest text-[10px]"
                onClick={handleRefreshBinding}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isRefreshing ? "Refreshing..." : "Refresh Binding"}
                {!isRefreshing && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>

          <footer className="text-center pt-8 border-t border-white/5 space-y-2">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Sovereign Legal Framework v1.2.0-stable • © 2024 FusionPay
            </p>
            <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-muted-foreground opacity-50">
              <span>SHA-256: 4f82...e911</span>
              <span>•</span>
              <span>GOVERNING_LAW: SEYCHELLES</span>
              <span>•</span>
              <span>TS: {Date.now()}</span>
            </div>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
