
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
  Link as LinkIcon
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
    id: "card-issue",
    title: "Virtual Card Issuance",
    method: "POST",
    path: "/api/v1/cards/issue",
    desc: "নতুন একটি মাস্টারকার্ড বা ভিসা কার্ড তৈরি করতে এবং ওয়ালেট থেকে প্রাথমিক ব্যালেন্স লোড করতে এটি ব্যবহার করুন।",
    headers: [
      { name: "X-Sovereign-Signature", desc: "SHA-256 HMAC payload signature." },
      { name: "X-Idempotency-Key", desc: "Unique UUID to prevent duplicate transactions." }
    ],
    params: [
      { name: "user_id", type: "string", desc: "Target citizen unique ID." },
      { name: "team_id", type: "string", desc: "The unique ID of the organization." },
      { name: "brand", type: "enum", desc: "MASTERCARD, VISA." },
      { name: "initial_load", type: "number", desc: "Starting balance in USD." }
    ],
    example: `{
  "user_id": "sko_user_82af",
  "team_id": "team_UJR6KEPUrWUszD8jdhiyjQgV",
  "brand": "MASTERCARD",
  "initial_load": 100.00
}`
  },
  {
    id: "card-settle",
    title: "Bidirectional Settlement",
    method: "POST",
    path: "/api/v1/cards/settle",
    desc: "কার্ড থেকে মেইন ওয়ালেটে (CARD_TO_MESH) অথবা ওয়ালেট থেকে কার্ডে (MESH_TO_CARD) রিয়েল-টাইম টাকা ট্রান্সফার।",
    headers: [
      { name: "X-Sovereign-Signature", desc: "SHA-256 HMAC payload signature." },
      { name: "X-Idempotency-Key", desc: "Unique UUID to prevent duplicate transactions." }
    ],
    params: [
      { name: "card_id", type: "string", desc: "Target card seal identifier." },
      { name: "direction", type: "enum", desc: "CARD_TO_MESH, MESH_TO_CARD" },
      { name: "amount", type: "number", desc: "Transfer amount." }
    ],
    example: `{
  "card_id": "vcard_991202",
  "direction": "CARD_TO_MESH",
  "amount": 50.00
}`
  },
  {
    id: "payout-execute",
    title: "Global Payout (ISO 20022)",
    method: "POST",
    path: "/api/v1/payouts/execute",
    desc: "FusionPay থেকে বাইরের গেটওয়ে (PayPal, Priyo Pay) বা ব্যাংক একাউন্টে টাকা পাঠানোর জন্য।",
    headers: [
      { name: "X-Sovereign-Signature", desc: "SHA-256 HMAC payload signature." },
      { name: "X-Idempotency-Key", desc: "Unique UUID to prevent duplicate transactions." }
    ],
    params: [
      { name: "gateway", type: "string", desc: "PAYPAL, PRIYO_PAY, SWIFT" },
      { name: "recipient_id", type: "string", desc: "Email or Bank Account No." },
      { name: "amount", type: "number", desc: "Disbursement amount in USD." }
    ],
    example: `{
  "gateway": "PAYPAL",
  "recipient_id": "vendor@global.com",
  "amount": 1250.00
}`
  }
];

export default function APIDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<{msg: string, type: 'info' | 'success' | 'error' | 'warning'}[]>([]);
  const [liveLedger, setLiveLedger] = useState<any[]>([]);
  const [lastProcessedKey, setLastProcessedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const runSimulation = (
    type: 'ISSUE' | 'SETTLE' | 'PAYOUT', 
    mode: 'SUCCESS' | 'OVERDRAFT' | 'BAD_SIG' | 'TIMEOUT' | 'DUPLICATE' = 'SUCCESS'
  ) => {
    setIsTesting(true);
    setTestLogs([]);
    
    // Generate a mock idempotency key for the session
    const currentKey = "idemp_" + Math.random().toString(36).substr(2, 6);
    
    let steps: {msg: string, type: 'info' | 'success' | 'error' | 'warning'}[] = [
      { msg: `Initializing ${type} handshake protocol...`, type: 'info' },
      { msg: `Binding Team Context: team_UJR6KEPUrWUszD8jdhiyjQgV...`, type: 'info' },
    ];

    // Idempotency Check
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
      steps.push({ msg: "Handshake Terminated: ACCESS_DENIED_0x82", type: 'error' });
    } else if (mode !== 'DUPLICATE') {
      steps.push({ msg: "Signature Verified: OK", type: 'success' });
      steps.push({ msg: "Synchronizing with Anycast Node UK-01...", type: 'info' });
    }

    if (mode === 'SUCCESS') {
      if (type === 'ISSUE') {
        steps.push({ msg: "Provisioning Virtual Asset: MASTERCARD v1.2", type: 'info' });
        steps.push({ msg: "Settlement Finality: $100.00 loaded from Team Pool.", type: 'success' });
        steps.push({ msg: "Virtual Card Node Activated Successfully.", type: 'success' });
      } else if (type === 'SETTLE') {
        steps.push({ msg: "Bidirectional Pulse: CARD_TO_MESH confirmed.", type: 'success' });
        steps.push({ msg: "Mesh Balance Reconciled at Node 04.", type: 'success' });
      } else if (type === 'PAYOUT') {
        steps.push({ msg: "External Rail: PAYPAL_REST_V2 Handshake active.", type: 'info' });
        steps.push({ msg: "ISO 20022 Message Packet Signed.", type: 'success' });
        steps.push({ msg: "Payout Batch Dispatched: FALLBACK_P180_SUCCESS", type: 'success' });
      }
    } else if (mode === 'OVERDRAFT') {
      steps.push({ msg: "Checking deterministic capacity...", type: 'info' });
      steps.push({ msg: "Critical Failure: ERR_INSUFFICIENT_MESH_BALANCE", type: 'error' });
      steps.push({ msg: "Protocol Reverted: ISO_ERR_204", type: 'error' });
    } else if (mode === 'TIMEOUT') {
      steps.push({ msg: "Connecting to External Gateway...", type: 'info' });
      steps.push({ msg: "Latency Peak: 4500ms detected. Retrying (1/3)...", type: 'warning' });
      steps.push({ msg: "Gateway Node Unreachable: L3_IMPERIAL_SETTLEMENT_TIMEOUT", type: 'error' });
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setTestLogs(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsTesting(false);
        if (mode === 'SUCCESS' || mode === 'DUPLICATE') {
          if (mode === 'SUCCESS') {
            const newEntry = {
              id: type === 'ISSUE' ? `vcard_${Math.floor(100000 + Math.random() * 900000)}` : `TX_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              status: 'SUCCESS',
              type: type === 'SETTLE' ? 'CARD_TO_MESH' : type === 'ISSUE' ? 'ISSUE_CARD' : 'GLOBAL_PAYOUT',
              amount: type === 'PAYOUT' ? '1250.00' : (Math.random() * 1000).toFixed(2),
              ts: new Date().toLocaleTimeString(),
              team: "team_UJR6KEPU...",
              idemp: currentKey
            };
            setLiveLedger(prev => [newEntry, ...prev].slice(0, 10));
            setLastProcessedKey(currentKey);
          }
          toast({ title: mode === 'DUPLICATE' ? "Idempotency Success" : "Simulation Finalized", description: `Logic confirmed for ${type} flow.` });
        } else {
          toast({ variant: "destructive", title: "Simulation Halted", description: "Validation failure (Targeted Edge Case)." });
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
              Sovereign API & Card Mesh
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            v1.2.0-stable • ISO_20022_READY
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
              <h2 className="text-4xl font-headline font-bold tracking-tighter uppercase italic">Handshake <span className="text-accent">Oracle</span></h2>
              <div className="flex flex-wrap gap-3">
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Active Team ID: team_UJR6KEPUrWUszD8jdhiyjQgV</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20 w-fit">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Idempotency: ENFORCED</span>
                 </div>
              </div>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed italic">
                "FusionPay v1.2 provides a deterministic environment for team-based settlement. Every request is verified via SHA-256 and protected by Idempotency Keys to ensure T+0 finality without duplicates."
              </p>
            </div>

            <Card className="glass-panel border-accent/20 bg-accent/5 p-6 w-full xl:w-[480px] shrink-0 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10"><Terminal className="h-20 w-20 text-accent" /></div>
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-accent" />
                    <p className="text-xs font-bold uppercase text-white tracking-widest">Interactive Handshake Lab</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] animate-pulse border-green-500/50 text-green-400">STATEFUL_SIM_v1</Badge>
               </div>
               
               <div className="space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="text-[9px] font-bold h-10 bg-accent text-background cyan-glow uppercase" onClick={() => runSimulation('ISSUE')} disabled={isTesting}>Issue Virtual Card</Button>
                    <Button variant="outline" className="text-[9px] font-bold h-10 border-blue-400/30 text-blue-400 uppercase" onClick={() => runSimulation('SETTLE')} disabled={isTesting}>Test 2-Way Settle</Button>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-3">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"><ShieldAlert className="h-3 w-3 text-red-400" /> Validation Edge Cases</p>
                    <div className="grid grid-cols-2 gap-2">
                       <Button variant="ghost" className="text-[8px] h-8 border border-red-500/20 text-red-400 hover:bg-red-500/10 uppercase" onClick={() => runSimulation('ISSUE', 'OVERDRAFT')} disabled={isTesting}>Overdraft</Button>
                       <Button variant="ghost" className="text-[8px] h-8 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 uppercase" onClick={() => runSimulation('SETTLE', 'BAD_SIG')} disabled={isTesting}>Bad Hash</Button>
                       <Button variant="ghost" className="text-[8px] h-8 border border-orange-500/20 text-orange-400 hover:bg-orange-500/10 uppercase" onClick={() => runSimulation('PAYOUT', 'TIMEOUT')} disabled={isTesting}>Node Timeout</Button>
                       <Button variant="ghost" className="text-[8px] h-8 border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 uppercase" onClick={() => runSimulation('SETTLE', 'DUPLICATE')} disabled={isTesting}>Test Duplicate</Button>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="endpoints" className="space-y-8">
                <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
                  <TabsTrigger value="endpoints" className="text-[10px] uppercase font-bold tracking-widest px-6 data-[state=active]:bg-accent data-[state=active]:text-background">API Endpoints</TabsTrigger>
                  <TabsTrigger value="database" className="text-[10px] uppercase font-bold tracking-widest px-6 data-[state=active]:bg-accent data-[state=active]:text-background">Database Mesh</TabsTrigger>
                </TabsList>

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
                        <CardDescription className="text-xs mt-2 italic text-muted-foreground">{api.desc}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div className="p-6 space-y-6 border-r border-white/5">
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Required Headers</h4>
                                <div className="space-y-3">
                                  {api.headers.map((h, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                      <span className="text-xs font-bold text-accent">{h.name}</span>
                                      <p className="text-[10px] text-muted-foreground italic">{h.desc}</p>
                                    </div>
                                  ))}
                                </div>
                             </div>
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Body Parameters</h4>
                                <div className="space-y-3">
                                  {api.params.map((p, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                      <div className="flex items-center gap-2"><span className="text-xs font-bold text-white">{p.name}</span><span className="text-[10px] font-mono text-accent">[{p.type}]</span></div>
                                      <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                                    </div>
                                  ))}
                                </div>
                             </div>
                          </div>
                          <div className="p-6 bg-black/40">
                             <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-4">Payload Example</h4>
                             <pre className="text-[11px] font-mono text-white/80 leading-relaxed overflow-x-auto p-4 rounded bg-black/20 border border-white/5 group-hover:border-accent/20 transition-colors">{api.example}</pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="database" className="space-y-6">
                   <Card className="glass-panel border-white/5">
                      <CardHeader><CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest"><Database className="h-4 w-4 text-accent" /> Secure Storage Paths</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                         {[{ path: "/users/{userId}", schema: "UserProfile", desc: "Citizen identity bound to organization." }, { path: "/users/{userId}/cards", schema: "VirtualCard", desc: "Team-isolated virtual card vault." }, { path: "/events", schema: "KernelEvent", desc: "Deterministic kernel ledger for auditing." }, { path: "/payment_links", schema: "PaymentLink", desc: "Registry of active settlement corridors." }].map((p, i) => (
                           <div key={i} className="p-3 rounded-lg bg-secondary/20 border border-white/5 flex items-center justify-between group hover:border-accent/30 transition-all">
                              <div>
                                 <p className="text-xs font-mono text-accent font-bold">{p.path}</p>
                                 <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                                 <Badge variant="ghost" className="text-[8px] p-0 font-mono opacity-40">SCHEMA: {p.schema}</Badge>
                              </div>
                              <Lock className="h-3 w-3 text-muted-foreground/30 group-hover:text-accent transition-colors" />
                           </div>
                         ))}
                      </CardContent>
                   </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5 h-fit shadow-2xl overflow-hidden">
                  <CardHeader className="p-4 border-b border-white/5 flex items-center justify-between">
                     <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest"><History className="h-4 w-4 text-accent" /> Live Card Ledger</CardTitle>
                     <div className="flex gap-1 items-center"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-[8px] font-mono text-green-400">SYNCED</span></div>
                  </CardHeader>
                  <CardContent className="p-0">
                     <ScrollArea className="h-[520px]">
                        {liveLedger.length === 0 ? (
                          <div className="p-20 text-center text-muted-foreground italic text-[10px] space-y-4"><Unplug className="h-8 w-8 mx-auto opacity-20" /><p>No active interactions.<br/>Run a handshake test above.</p></div>
                        ) : (
                          <div className="divide-y divide-white/5">
                             {liveLedger.map((tx, i) => (
                               <div key={i} className="p-4 space-y-2 hover:bg-white/5 transition-all animate-fade-in border-l-2 border-l-transparent hover:border-l-accent">
                                  <div className="flex justify-between items-center"><span className="text-[10px] font-mono text-accent font-bold">{tx.id}</span><Badge className="bg-green-500/20 text-green-400 text-[8px]">SUCCESS</Badge></div>
                                  <div className="flex justify-between items-end">
                                     <div>
                                        <p className="text-[9px] uppercase font-bold text-white">{tx.type.replace(/_/g, ' ')}</p>
                                        <p className="text-[8px] text-muted-foreground font-mono">{tx.ts} • {tx.idemp}</p>
                                     </div>
                                     <p className="text-sm font-headline font-bold text-white">${tx.amount}</p>
                                  </div>
                                </div>
                             ))}
                          </div>
                        )}
                     </ScrollArea>
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
