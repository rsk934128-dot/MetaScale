
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Code2, 
  Terminal, 
  Globe, 
  Lock, 
  Zap, 
  ShieldCheck, 
  RefreshCw,
  Play,
  CreditCard,
  History,
  Database,
  Check,
  ShieldAlert,
  Activity,
  Key,
  Shield,
  RotateCw,
  ShieldX,
  BookOpen,
  FileCode,
  Milestone,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API_ENDPOINTS = [
  {
    id: "stripe-intent",
    title: "Create Payment Intent",
    method: "POST",
    path: "/api/v1/stripe/create-intent",
    desc: "Stripe-standard পেমেন্ট ইন্টেন্ট তৈরি করতে এই এপিআই ব্যবহার করুন। এটি সম্পূর্ণ সিকিউর এবং সার্ভার-সাইডে প্রসেস করা হয়।",
    headers: [
      { name: "X-Sovereign-Signature", desc: "SHA-256 HMAC payload signature." }
    ],
    example: `{
  "action": "create-payment-intent",
  "amount": 2000,
  "currency": "usd"
}`
  },
  {
    id: "bank-list",
    title: "Institution Discovery",
    method: "GET",
    path: "/api/v1/banking/institutions",
    desc: "Yapily Direct API ব্যবহার করে সাপোর্ট করা ১৪,০০০+ ব্যাংকের লিস্ট পেতে এটি ব্যবহার করুন।",
    example: `GET /api/v1/banking/institutions?country_code=GB`
  }
];

export default function APIDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isBreachDetected, setIsBreachDetected] = useState(false);
  const [testLogs, setTestLogs] = useState<{msg: string, type: 'info' | 'success' | 'error' | 'warning'}[]>([]);
  const { toast } = useToast();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRotateKey = () => {
    setIsTesting(true);
    setTestLogs([{ msg: "Initiating Global Key Rotation Sequence...", type: 'info' }]);
    
    setTimeout(() => {
      setIsBreachDetected(false);
      setTestLogs(prev => [
        ...prev, 
        { msg: "Revoking compromised HMAC Secret: 0x82...AF", type: 'warning' },
        { msg: "Generating fresh MIL-SPEC Secret (256-bit entropy)...", type: 'info' },
        { msg: "System Recovery: Handshake stabilized. Breach state cleared.", type: 'success' }
      ]);
      setIsTesting(false);
      toast({ title: "HMAC Secret Rotated", description: "All secure nodes updated with fresh keys." });
    }, 2000);
  };

  const runSimulation = (type: string, mode: string = 'SUCCESS') => {
    setIsTesting(true);
    setTestLogs([{ msg: `Initializing ${type} handshake protocol...`, type: 'info' }]);
    
    setTimeout(() => {
      if (mode === 'BAD_SIG') {
        setTestLogs(prev => [...prev, { msg: "Security Breach: Invalid HMAC Signature detected!", type: 'error' }]);
        setIsBreachDetected(true);
      } else {
        setTestLogs(prev => [...prev, { msg: "Signature Verified: OK", type: 'success' }, { msg: "Node-04 Sync Complete.", type: 'info' }]);
      }
      setIsTesting(false);
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
              <Code2 className="h-5 w-5 text-accent" />
              Sovereign API & Integration Guide
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            ISO 20022 READY • MIL-SPEC SECURITY
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          {/* Recovery Alert */}
          {isBreachDetected && (
            <div className="p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/30 animate-pulse flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <ShieldAlert className="h-8 w-8 text-red-500" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-headline font-bold text-red-400">Security Breach Detected (0x82)</h3>
                    <p className="text-xs text-muted-foreground italic">Signature mismatch detected. System corridor isolated.</p>
                  </div>
               </div>
               <Button variant="outline" size="sm" className="border-red-500/20 text-red-400" onClick={handleRotateKey}>
                  <RotateCw className={cn("mr-2 h-3.5 w-3.5", isTesting && "animate-spin")} /> Rotate Secret
               </Button>
            </div>
          )}

          <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
              <h2 className="text-4xl font-headline font-bold tracking-tighter uppercase italic text-white">Integration <span className="text-accent">Oracle</span></h2>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed italic">
                "FusionPay v1.2 provides institutional-grade Stripe integration. Never expose secret keys in client code."
              </p>
            </div>

            <Card className="glass-panel border-accent/20 bg-accent/5 p-6 w-full xl:w-[480px] shrink-0">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-accent" />
                    <p className="text-xs font-bold uppercase text-white tracking-widest">Handshake Lab</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-green-500/50 text-green-400">CORE_AUDIT</Badge>
               </div>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="text-[9px] font-bold h-10 bg-accent text-background" onClick={() => runSimulation('STRIPE_INTENT')} disabled={isTesting}>Test Secure Intent</Button>
                    <Button variant="ghost" className="text-[9px] font-bold h-10 border border-red-500/20 text-red-400" onClick={() => runSimulation('STRIPE_INTENT', 'BAD_SIG')} disabled={isTesting}>Simulate Breach</Button>
                  </div>
                  {testLogs.length > 0 && (
                    <div className="p-3 rounded bg-black/60 border border-white/5 font-mono text-[9px] space-y-1.5 h-32 overflow-y-auto">
                        {testLogs.map((log, i) => (
                          <p key={i} className={cn(log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-white/60')}>
                            &gt; {log.msg}
                          </p>
                        ))}
                    </div>
                  )}
               </div>
            </Card>
          </div>

          <Tabs defaultValue="guide" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
              <TabsTrigger value="guide" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">Usage Guide</TabsTrigger>
              <TabsTrigger value="best-practices" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">Best Practices</TabsTrigger>
              <TabsTrigger value="endpoints" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">Endpoints</TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-8 animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-tighter">
                           <BookOpen className="h-5 w-5 text-accent" />
                           Secure Integration
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground italic">
                           আপনার অ্যাপ্লিকেশন থেকে সরাসরি Stripe কল না করে আমাদের Secure Proxy ব্যবহার করুন। এটি `STRIPE_SECRET_KEY` সুরক্ষা নিশ্চিত করে।
                        </p>
                        <div className="space-y-3">
                           {[
                             { title: "Server-side Setup", desc: "Store your keys in .env.local on the server." },
                             { title: "HMAC Calculation", desc: "Every proxy request must be signed with your Team Secret." },
                             { title: "Webhook Verify", desc: "Always verify webhook signatures to ensure authenticity." }
                           ].map((item, i) => (
                             <div key={i} className="flex gap-4 p-3 rounded-lg bg-secondary/20 border border-white/5">
                                <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">{i+1}</div>
                                <div><p className="text-xs font-bold text-white">{item.title}</p><p className="text-[10px] text-muted-foreground">{item.desc}</p></div>
                             </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="glass-panel border-white/5 bg-accent/5">
                     <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-tighter">
                           <Tag className="h-5 w-5 text-accent" />
                           Exchange Deposit (Memo)
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground italic">
                           Binance, OKX বা Bybit-এর মতো এক্সচেঞ্জে TON বা USDT পাঠানোর সময় **Memo/Tag** ব্যবহার করা বাধ্যতামূলক। 
                        </p>
                        <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 font-mono text-[10px] leading-relaxed text-red-400">
                           <p>! WARNING: Sending to CEX without a memo</p>
                           <p>! status: FUND_RECOVERY_IMPOSSIBLE</p>
                           <p>! Action: Use mandatory 'payoutMemo' parameter.</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="best-practices" className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <div className="w-10 h-10 rounded bg-accent/20 flex items-center justify-center text-accent mb-2"><Key className="h-5 w-5" /></div>
                        <CardTitle className="text-sm uppercase tracking-widest">Key Storage</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-[11px] text-muted-foreground italic">Never embed secret keys in client-side code. Use environment variables exclusively.</p>
                     </CardContent>
                  </Card>
                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary mb-2"><Shield className="h-5 w-5" /></div>
                        <CardTitle className="text-sm uppercase tracking-widest">Least Privilege</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-[11px] text-muted-foreground italic">Use Restricted API Keys to grant only the minimum permissions necessary.</p>
                     </CardContent>
                  </Card>
                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <div className="w-10 h-10 rounded bg-green-500/20 flex items-center justify-center text-green-400 mb-2"><History className="h-5 w-5" /></div>
                        <CardTitle className="text-sm uppercase tracking-widest">Rotation</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-[11px] text-muted-foreground italic">Periodically rotate your API keys to minimize risk if a key is compromised.</p>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              {API_ENDPOINTS.map((api) => (
                <Card key={api.id} className="glass-panel border-white/5 overflow-hidden">
                  <CardHeader className="p-6 border-b border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <Badge className="bg-accent text-background font-bold">{api.method}</Badge>
                          <span className="text-xs font-mono text-accent/80">{api.path}</span>
                       </div>
                       <Button variant="ghost" size="icon" onClick={() => handleCopy(api.example, api.id)}>{copiedId === api.id ? <Check className="h-4 w-4 text-green-400" /> : <Code2 className="h-4 w-4" />}</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                     <p className="text-sm text-white/80 mb-4">{api.desc}</p>
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-white/60">
                        {api.example}
                     </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <footer className="pt-20 border-t border-white/5 text-center">
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-50 italic">
                FusionPay Secure API v1.2.0-stable • Institutional Grade Infrastructure
             </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
