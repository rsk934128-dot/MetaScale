
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
  Unplug,
  Activity,
  Users,
  Fingerprint,
  Link as LinkIcon,
  Building2,
  AlertTriangle,
  RotateCw,
  ShieldX,
  BookOpen,
  FileCode,
  Milestone,
  Key,
  Eye,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const API_ENDPOINTS = [
  {
    id: "bank-list",
    title: "Institution Discovery",
    method: "GET",
    path: "/api/v1/banking/institutions",
    desc: "Yapily Direct API ব্যবহার করে সাপোর্ট করা ১৪,০০০+ ব্যাংকের লিস্ট পেতে এটি ব্যবহার করুন।",
    headers: [
      { name: "X-Sovereign-Signature", desc: "SHA-256 HMAC payload signature." }
    ],
    params: [
      { name: "country_code", type: "string", desc: "ISO 3166-1 alpha-2 code (e.g. GB, BD)." }
    ],
    example: `GET /api/v1/banking/institutions?country_code=GB`
  },
  {
    id: "bank-consent",
    title: "Create Auth Request",
    method: "POST",
    path: "/api/v1/banking/consent",
    desc: "ব্যাংক অ্যাকাউন্টের ডাটা এক্সেস বা পেমেন্ট ইনিশিয়েট করার জন্য ইউজারের কনসেন্ট নিতে এটি ব্যবহার করুন।",
    headers: [
      { name: "X-Sovereign-Signature", desc: "SHA-256 HMAC payload signature." },
      { name: "X-Idempotency-Key", desc: "Unique UUID to prevent duplicate requests." }
    ],
    params: [
      { name: "institution_id", type: "string", desc: "Target bank identifier." },
      { name: "scope", type: "enum", desc: "AIS, PIS." },
      { name: "callback_url", type: "string", desc: "The URL to redirect after bank auth." }
    ],
    example: `{
  "institution_id": "barclays",
  "scope": "AIS",
  "callback_url": "https://yourapp.com/callback"
}`
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
        { msg: "Synchronizing 42 nodes with new signing rales...", type: 'info' },
        { msg: "System Recovery: Handshake stabilized. Breach state cleared.", type: 'success' }
      ]);
      setIsTesting(false);
      toast({ title: "HMAC Secret Rotated", description: "All secure nodes updated with fresh keys." });
    }, 2000);
  };

  const runSimulation = (
    type: 'ISSUE' | 'SETTLE' | 'PAYOUT' | 'DIRECT_API', 
    mode: 'SUCCESS' | 'OVERDRAFT' | 'BAD_SIG' | 'TIMEOUT' | 'DUPLICATE' = 'SUCCESS'
  ) => {
    setIsTesting(true);
    setTestLogs([]);
    
    const currentKey = "idemp_" + Math.random().toString(36).substr(2, 6);
    
    let steps: {msg: string, type: 'info' | 'success' | 'error' | 'warning'}[] = [
      { msg: `Initializing ${type} handshake protocol...`, type: 'info' },
      { msg: `Binding Team Context: team_UJR6KEPU...`, type: 'info' },
    ];

    if (mode === 'DUPLICATE') {
      steps.push({ msg: "Header Found: X-Idempotency-Key (REUSED_VAL)", type: 'warning' });
      steps.push({ msg: "Cache Lookup: Transaction already processed.", type: 'warning' });
      steps.push({ msg: "Protocol Finalized: Returning Cached Resource (Idempotency Safe)", type: 'success' });
    } else {
      steps.push({ msg: `Header Validated: X-Idempotency-Key (${currentKey})`, type: 'info' });
      steps.push({ msg: "Validating X-Sovereign-Signature (SHA-256)...", type: 'info' });
    }

    if (mode === 'BAD_SIG') {
      steps.push({ msg: "Security Breach: Invalid HMAC Signature detected!", type: 'error' });
      steps.push({ msg: "Error Trace: ACCESS_DENIED_0x82 - Signature Mismatch.", type: 'error' });
    } else if (mode !== 'DUPLICATE') {
      steps.push({ msg: "Signature Verified: OK", type: 'success' });
      steps.push({ msg: "Synchronizing with Anycast Node UK-01 (Priority)...", type: 'info' });
    }

    if (mode === 'SUCCESS') {
      if (type === 'DIRECT_API') {
         steps.push({ msg: "Yapily Mesh Access: Handshake established.", type: 'info' });
         steps.push({ msg: "Protocol Finalized: Node-04 Response 8.4ms", type: 'success' });
      }
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setTestLogs(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsTesting(false);
        if (mode === 'BAD_SIG') {
          setIsBreachDetected(true);
          toast({ variant: "destructive", title: "ACCESS_DENIED_0x82", description: "Breach detected. Recovery required." });
        } else {
          toast({ title: "Simulation Finalized" });
        }
      }
    }, 300);
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
                  <div className="p-3 rounded-xl bg-red-500/20 text-red-500">
                    <ShieldAlert className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-headline font-bold text-red-400">Security Breach Detected (0x82)</h3>
                    <p className="text-xs text-muted-foreground italic">Signature mismatch detected in latest API handshake. System corridor has been isolated.</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-[10px] font-bold uppercase" onClick={handleRotateKey}>
                    <RotateCw className={cn("mr-2 h-3.5 w-3.5", isTesting && "animate-spin")} /> Rotate Secret
                  </Button>
                  <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase">
                    <ShieldX className="mr-2 h-3.5 w-3.5" /> Block Source
                  </Button>
               </div>
            </div>
          )}

          <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
              <h2 className="text-4xl font-headline font-bold tracking-tighter uppercase italic text-white">Integration <span className="text-accent">Oracle</span></h2>
              <div className="flex flex-wrap gap-3">
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Global Endpoint: https://api.fusionpay.mesh/v1</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20 w-fit">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">ISO 20022 Compliant</span>
                 </div>
              </div>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed italic">
                "FusionPay v1.2 is a developer-first infrastructure. Use our HMAC-signed rales to connect your apps to 14,000+ banks with sub-10ms latency."
              </p>
            </div>

            <Card className="glass-panel border-accent/20 bg-accent/5 p-6 w-full xl:w-[480px] shrink-0 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10"><Terminal className="h-20 w-20 text-accent" /></div>
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-accent" />
                    <p className="text-xs font-bold uppercase text-white tracking-widest">Handshake Lab</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-green-500/50 text-green-400">CORE_AUDIT</Badge>
               </div>
               
               <div className="space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="text-[9px] font-bold h-10 bg-accent text-background cyan-glow uppercase" onClick={() => runSimulation('DIRECT_API')} disabled={isTesting}>Test Node-04 Sync</Button>
                    <Button variant="ghost" className="text-[9px] font-bold h-10 border border-red-500/20 text-red-400 hover:bg-red-500/10 uppercase" onClick={() => runSimulation('DIRECT_API', 'BAD_SIG')} disabled={isTesting}>Simulate Breach</Button>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"><ShieldAlert className="h-3 w-3 text-red-400" /> Validation Options</p>
                    <div className="grid grid-cols-2 gap-2">
                       <Button variant="ghost" className="text-[8px] h-8 border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 uppercase" onClick={() => runSimulation('DIRECT_API', 'DUPLICATE')} disabled={isTesting}>Idempotency Test</Button>
                       <Button variant="ghost" className="text-[8px] h-8 border border-accent/20 text-accent uppercase" onClick={handleRotateKey} disabled={isTesting}>Rotate HMAC</Button>
                    </div>
                  </div>
               </div>

               {testLogs.length > 0 && (
                 <div className="mt-4 p-3 rounded bg-black/60 border border-white/5 font-mono text-[9px] space-y-1.5 h-48 overflow-y-auto scrollbar-hide">
                    {testLogs.map((log, i) => (
                      <p key={i} className={cn("flex items-start gap-2 animate-fade-in", log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400 font-bold' : log.type === 'warning' ? 'text-yellow-400 italic' : 'text-white/60')}>
                        <span className="shrink-0">{log.type === 'success' ? '✓' : log.type === 'error' ? '!' : log.type === 'warning' ? '?' : '>'}</span>
                        {log.msg}
                      </p>
                    ))}
                 </div>
               )}
            </Card>
          </div>

          <Tabs defaultValue="guide" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1 flex-wrap overflow-x-auto">
              <TabsTrigger value="guide" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Integration Guide</TabsTrigger>
              <TabsTrigger value="endpoints" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full data-[state=active]:bg-accent data-[state=active]:text-background">API Endpoints</TabsTrigger>
              <TabsTrigger value="best-practices" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Best Practices</TabsTrigger>
              <TabsTrigger value="security" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Security Spec</TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-tighter">
                           <BookOpen className="h-5 w-5 text-accent" />
                           Quick Start: ISO 20022
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           Sovereign OS uses **ISO 20022** standard for all financial messaging. To initiate a connection, follow these deterministic steps:
                        </p>
                        <div className="space-y-3">
                           {[
                             { step: "1", title: "Obtain API Keys", desc: "Generate your Team Secret in Settings." },
                             { step: "2", title: "Calculate HMAC", desc: "Every request must include a SHA-256 signature of the body." },
                             { step: "3", title: "Idempotency", desc: "Use X-Idempotency-Key for T+0 settlement safety." },
                             { step: "4", title: "Webhook Config", desc: "Subscribe to 'payment.status' for real-time finality." }
                           ].map((item, i) => (
                             <div key={i} className="flex gap-4 p-3 rounded-lg bg-secondary/20 border border-white/5 items-start">
                                <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent shrink-0">{item.step}</div>
                                <div>
                                   <p className="text-xs font-bold text-white">{item.title}</p>
                                   <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-tighter">
                           <FileCode className="h-5 w-5 text-primary" />
                           Signature Algorithm (Node.js)
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] leading-relaxed text-white/70 overflow-x-auto">
                           <p className="text-primary">// Example: Generate Sovereign Signature</p>
                           <p>const crypto = require(&apos;crypto&apos;);</p>
                           <p>const secret = &apos;your_shared_secret&apos;;</p>
                           <p>const body = JSON.stringify(payload);</p>
                           <p className="mt-2 text-accent">const signature = crypto</p>
                           <p className="text-accent">  .createHmac(&apos;sha256&apos;, secret)</p>
                           <p className="text-accent">  .update(body)</p>
                           <p className="text-accent">  .digest(&apos;hex&apos;);</p>
                           <p className="mt-4 text-primary">// Header: X-Sovereign-Signature</p>
                        </div>
                        <div className="p-3 rounded bg-accent/10 border border-accent/20 flex gap-2">
                           <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                           <p className="text-[10px] text-muted-foreground italic">"Always keep your secret key in an encrypted environment variable. Never commit it to git."</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-8">
              {API_ENDPOINTS.map((api) => (
                <Card key={api.id} className="glass-panel border-white/5 overflow-hidden group hover:border-accent/30 transition-all shadow-xl">
                  <CardHeader className="p-6 border-b border-white/5 bg-white/5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <Badge className="bg-accent text-background font-bold px-3">{api.method}</Badge>
                           <span className="text-xs font-mono text-accent/80 tracking-tighter">{api.path}</span>
                        </div>
                        <CardTitle className="text-xl mt-2 flex items-center gap-2 text-white uppercase italic"><CreditCard className="h-5 w-5 text-accent" /> {api.title}</CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(api.example, api.id)} className="hover:bg-accent/10">{copiedId === api.id ? <Check className="h-4 w-4 text-green-400" /> : <Code2 className="h-4 w-4" />}</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-6 bg-black/40">
                         <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-4">Implementation Example</h4>
                         <pre className="text-[11px] font-mono text-white/80 leading-relaxed overflow-x-auto p-4 rounded bg-black/20 border border-white/5">{api.example}</pre>
                      </div>
                      <div className="p-6 space-y-4">
                         <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Signature Validation</h4>
                         <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 text-[10px] text-muted-foreground space-y-2 italic">
                            <p>1. Compute HMAC SHA-256 of raw request body using shared secret.</p>
                            <p>2. Compare with value in X-Sovereign-Signature header.</p>
                            <p>3. If mismatch, system returns 401 ACCESS_DENIED_0x82.</p>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="best-practices" className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <div className="w-10 h-10 rounded bg-accent/20 flex items-center justify-center text-accent mb-2">
                           <Key className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-sm uppercase tracking-widest">Key Management</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <p className="text-[11px] text-muted-foreground italic">
                           Secret Keys are like master credentials. Never expose them in client-side code (JavaScript, HTML). Always store them in <strong>.env</strong> variables on protected server nodes.
                        </p>
                        <div className="p-2 rounded bg-black/40 border border-white/5 text-[9px] font-mono text-white/60">
                           NODE_ENV=production <br />
                           SOVEREIGN_SECRET=pk_live_...
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary mb-2">
                           <Shield className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-sm uppercase tracking-widest">Least Privilege</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <p className="text-[11px] text-muted-foreground italic">
                           Use **Restricted API Keys** for specific microservices. A node only handling "Audits" should not have permission to "Initiate Payouts".
                        </p>
                        <Badge variant="outline" className="text-[8px] border-primary/30 text-primary uppercase">MIL-SPEC ENFORCED</Badge>
                     </CardContent>
                  </Card>

                  <Card className="glass-panel border-white/5">
                     <CardHeader>
                        <div className="w-10 h-10 rounded bg-green-500/20 flex items-center justify-center text-green-400 mb-2">
                           <LinkIcon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-sm uppercase tracking-widest">Webhook Integrity</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <p className="text-[11px] text-muted-foreground italic">
                           Always verify webhook signatures before acting on events. Signature verification ensures the payload was not tampered with and originated from the Sovereign Mesh.
                        </p>
                        <Button variant="ghost" className="h-7 text-[8px] uppercase font-bold text-accent px-0 hover:bg-transparent">
                           Verify Algorithm <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                     </CardContent>
                  </Card>
               </div>

               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardHeader>
                     <CardTitle className="text-lg uppercase italic tracking-tighter flex items-center gap-2">
                        <RotateCw className="h-5 w-5 text-accent" /> Key Rotation Protocol
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                          { title: "1. Generate", desc: "Generate a new MIL-SPEC secret key in Dashboard." },
                          { title: "2. Deploy", desc: "Update your application environment variables." },
                          { title: "3. Test", desc: "Verify handshake with fresh key in Sandbox." },
                          { title: "4. Revoke", desc: "Immediately revoke the compromised or old secret key." }
                        ].map((step, i) => (
                          <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                             <p className="text-[10px] font-bold text-accent uppercase">{step.title}</p>
                             <p className="text-[10px] text-muted-foreground italic">{step.desc}</p>
                          </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
               <Card className="glass-panel border-white/5">
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest"><ShieldCheck className="h-4 w-4 text-accent" /> Forensic Handshake Config</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                           <p className="text-[10px] font-bold text-accent uppercase">Security Level</p>
                           <p className="text-2xl font-headline font-bold">MIL-SPEC</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                           <p className="text-[10px] font-bold text-accent uppercase">Rotation</p>
                           <p className="text-2xl font-headline font-bold">30 DAYS</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                           <p className="text-[10px] font-bold text-accent uppercase">Algorithm</p>
                           <p className="text-2xl font-headline font-bold">HMAC-256</p>
                        </div>
                     </div>
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] space-y-2 text-white/70">
                        <p className="text-accent">// Encryption Layer Protocol</p>
                        <p>ALGORITHM: HMAC_SHA256</p>
                        <p>KEY_EXPIRY: 30D (Deterministic)</p>
                        <p className="text-accent mt-4">// Error Thresholds</p>
                        <p>MAX_SIGNATURE_ATTEMPTS: 3</p>
                        <p>AUTO_BLOCK_LATENCY_SPIKE: TRUE</p>
                        <p>FORFEIT_MODE: ISOLATION</p>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>

          {/* Integration Roadmap Footer */}
          <footer className="pt-20 border-t border-white/5 text-center space-y-6 pb-12">
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-accent/50" />
                <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase px-4 flex gap-2">
                   <Milestone className="h-3 w-3" /> Technical Specs v1.2.0-stable
                </Badge>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-50">
                Founded in London. Distributed Globally via Anycast Node-04.
             </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
