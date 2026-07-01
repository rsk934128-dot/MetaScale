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
  Database
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
      // Note: We only update lastBindingRefresh. 
      // trustScore is protected by Security Rules and cannot be modified by the client.
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
          <div className="text-center space-y-4">
            <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.2em] text-[10px] font-bold">
              Deterministic Accountability
            </Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter uppercase">
              THE SOVEREIGN <span className="text-accent italic">COVENANT</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto italic leading-relaxed">
              "Governing your access to FusionPay Sovereign OS and our commitment to protecting your digital presence."
            </p>
          </div>

          {/* Rebranding Notice */}
          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 relative overflow-hidden animate-fade-in shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <RefreshCw className="h-20 w-20 text-accent" />
             </div>
             <div className="flex items-start gap-5 relative z-10">
                <div className="p-3 rounded-xl bg-accent/20 border border-accent/30 text-accent shrink-0">
                   <Info className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-lg font-headline font-bold text-white uppercase italic tracking-tighter">System Notice: TON Wallet is now DeFi Account</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed italic">
                      We've renamed TON Wallet to better separate two products inside one Wallet app: the custodial Crypto Wallet and the self-custodial <span className="text-accent font-bold">DeFi Account</span> for more advanced interaction with the TON ecosystem.
                   </p>
                   <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase tracking-widest">
                         <CheckCircle2 className="h-4 w-4" /> No Action Required
                      </div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">
                         Assets, Keys, and History Unchanged.
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <Tabs defaultValue="terms" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1 w-full md:w-auto">
              <TabsTrigger value="terms" className="flex-1 md:flex-none text-[10px] uppercase font-bold tracking-widest px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Terms of Use</TabsTrigger>
              <TabsTrigger value="privacy" className="flex-1 md:flex-none text-[10px] uppercase font-bold tracking-widest px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Privacy Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="space-y-12 animate-fade-in">
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
                <AccordionItem value="item-1" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
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
                      <span className="text-white font-bold">DeFi Account</span> is a self-custody solution supported by TON Space Ltd. It is an interface that enables users to interact with The Open Network blockchain (“TON Blockchain”). DeFi Account does not own, control, or operate the blockchain.
                    </p>
                    <div className="space-y-2">
                      <p className="font-bold text-white/80">Eligibility:</p>
                      <ul className="list-disc pl-6 space-y-2 text-[12px]">
                        <li>You must be of legal age in your jurisdiction.</li>
                        <li>You are not located in Restricted Jurisdictions (Cuba, Iran, North Korea, Syria, etc.).</li>
                        <li>You are not listed on Sanctions Lists.</li>
                        <li>You confirm use with legally obtained Digital Assets.</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
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
                      Use of blockchain involves heightened risks, including misuse of cryptographic tools and software failures. You represent that you have sufficient financial and technical expertise.
                    </p>
                    <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 font-medium">
                      Tokenized assets (xStocks) rely on third-party issuers. Holding xStocks does not confer shareholder voting rights or direct dividends.
                    </div>
                    <p>
                      Digital assets involve market volatility, technical failures, and regulatory uncertainty. Network fees and speeds may fluctuate.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        <Fingerprint className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">3. Your Responsibilities</p>
                        <p className="text-xs text-muted-foreground">Security, backups and lawful use</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <p>
                      You are solely responsible for configuring and using <span className="text-white font-bold">DeFi Account</span> securely. This includes protecting your Recovery Phrase and Passcode.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-[12px]">
                      <li>Maintain up-to-date software.</li>
                      <li>Do not share Recovery Phrases with anyone.</li>
                      <li>Conduct your own research before engaging in activities.</li>
                      <li>Do not violate laws or intellectual property rights.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400">
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">4. DeFi Account Solution</p>
                        <p className="text-xs text-muted-foreground">Self-custody, Private keys and Transfers</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-6 pb-6 px-4">
                    <p>
                      <span className="text-white font-bold">DeFi Account</span> is a non-custodial wallet. We do not store, retain, or have access to your private keys.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="font-bold text-white/80 mb-1">Recovery Phrase</p>
                        <p className="text-[11px]">Primary method: 24 unique words. Secure this at all times.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="font-bold text-white/80 mb-1">Blockchain Ledger</p>
                        <p className="text-[11px]">The sole authoritative ledger of Digital Asset transactions.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <History className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">5. Third-Party Utilities</p>
                        <p className="text-xs text-muted-foreground">Swaps, Earn Interfaces and NFTs</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <p>
                      We provide access to Third-Party Utilities like Omniston, Getgems, and various Earn Interfaces.
                    </p>
                    <div className="p-3 rounded bg-purple-500/5 border border-purple-500/10 text-[11px] italic">
                      Transactions occur directly between you and the third-party protocol via smart contracts. We do not take custody of your assets.
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                        <Gavel className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">6. Legal & Liability</p>
                        <p className="text-xs text-muted-foreground">Warranties, Limitation of Liability and Arbitration</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <p>
                      <span className="text-white font-bold">DeFi Account</span> is provided on an “as is” basis. Total aggregate liability is limited to $5,000.
                    </p>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] space-y-2">
                      <p className="text-primary uppercase font-bold">Class Action Waiver:</p>
                      <p className="text-white/60">Any dispute must be pursued on an individual basis only. You give up the right to initiate a class action.</p>
                    </div>
                    <p>
                      Governed by and construed in accordance with the laws of Seychelles.
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
                      <div><span className="text-white font-bold">Backup:</span> Method via email and Telegram to recover access.</div>
                      <div><span className="text-white font-bold">Digital Assets:</span> Assets supported on TON blockchain, including NFTs.</div>
                      <div><span className="text-white font-bold">Restricted Jurisdictions:</span> Cuba, Iran, North Korea, Syria, unrecognized territories.</div>
                      <div><span className="text-white font-bold">Recovery Phrase:</span> Secret individual set of 24 unique words.</div>
                      <div><span className="text-white font-bold">Third-Party Utility:</span> Software or application operated by a third party.</div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel border-l-4 border-l-blue-400">
                  <CardHeader className="p-4">
                    <Eye className="h-6 w-6 text-blue-400 mb-2" />
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">Transparency</CardTitle>
                    <CardDescription className="text-[10px]">How we collect and use info.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-l-4 border-l-green-400">
                  <CardHeader className="p-4">
                    <UserCheck className="h-6 w-6 text-green-400 mb-2" />
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">User Rights</CardTitle>
                    <CardDescription className="text-[10px]">Access, correction, deletion.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-l-4 border-l-accent">
                  <CardHeader className="p-4">
                    <Shield className="h-6 w-6 text-accent mb-2" />
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">Protection</CardTitle>
                    <CardDescription className="text-[10px]">Encryption and organizational measures.</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="privacy-1" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">1. Information We Collect</p>
                        <p className="text-xs text-muted-foreground">Self-custody and personal information scope</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-6 pb-6 px-4">
                    <p>
                      <span className="text-white font-bold">DeFi Account</span> is a non-custodial wallet. We do not collect private keys or wallet seeds. We will never request these.
                    </p>
                    
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <TableIcon className="h-3.5 w-3.5 text-accent" />
                        Processing Purposes & Data
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { purpose: "Access Provision", basis: "Performance of Contract", data: "IP-address, Telegram ID, Username, Txn History" },
                          { purpose: "Backup Support", basis: "Performance of Contract", data: "Email address, IP-address, Telegram ID" },
                          { purpose: "Third-Party Utilities", basis: "Performance of Contract", data: "Wallet Address, IP, Email (where necessary)" },
                          { purpose: "Product Improvement", basis: "Legitimate Interest", data: "Anonymized page views, session duration" },
                          { purpose: "Security", basis: "Legitimate Interest", data: "IP address, Telegram ID, Usage data" }
                        ].map((row, i) => (
                          <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-accent uppercase">Purpose</p>
                              <p className="text-[11px] text-white/90">{row.purpose}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-muted-foreground uppercase">Basis</p>
                              <p className="text-[11px] italic">{row.basis}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-muted-foreground uppercase">Information</p>
                              <p className="text-[10px] text-white/60 leading-tight">{row.data}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="privacy-2" className="border rounded-xl glass-panel px-4 overflow-hidden border-white/5">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-green-400/10 border-green-400/20 text-green-400">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">2. Your Privacy Rights</p>
                        <p className="text-xs text-muted-foreground">Access, Correction and Portability</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed space-y-4 pb-6 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Right to Know", desc: "Categories and purposes of info collected." },
                        { title: "Right to Access", desc: "Request a copy of info we hold." },
                        { title: "Right to Correction", desc: "Correct inaccurate or incomplete info." },
                        { title: "Right to Deletion", desc: "Request deletion of Personal Information." },
                        { title: "Data Portability", desc: "Receive info in a portable format." }
                      ].map((right, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="font-bold text-white/80 text-[12px] mb-1">{right.title}</p>
                          <p className="text-[11px] leading-relaxed">{right.desc}</p>
                        </div>
                      ))}
                    </div>
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
                  Identity Re-Verification Required
                </h4>
                <p className="text-xs text-muted-foreground">
                  Your legal binding status expires periodically. A fresh cryptographic handshake is necessary to maintain mesh access.
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
