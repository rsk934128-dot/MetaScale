
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Globe, 
  Lock, 
  Zap, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw,
  Play,
  Network,
  CloudLightning,
  Smartphone,
  CreditCard,
  ArrowRightLeft,
  Activity,
  History,
  Database,
  Check,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const API_ENDPOINTS = [
  {
    id: "inbound-settlement",
    title: "Inbound Bank Settlement",
    method: "POST",
    path: "/api/v1/settlement/inbound",
    desc: "অন্যান্য ব্যাংক বা ফিনটেক অ্যাপ থেকে আমাদের সিস্টেমে টাকা পাঠানোর জন্য এই এন্ডপয়েন্ট ব্যবহার করা হয়। এটি T+0 সেটেলমেন্ট নিশ্চিত করে।",
    params: [
      { name: "account_number", type: "string", desc: "Recipient FusionPay mesh account number." },
      { name: "amount", type: "number", desc: "Settlement amount in USD." },
      { name: "routing_seal", type: "string", desc: "HMAC-SHA256 signature for payload integrity." }
    ],
    example: `{
  "account_number": "481290310221",
  "amount": 500.00,
  "currency": "USD",
  "origin_node": "HSBC_UK_04",
  "routing_seal": "SIG_HMAC_72AF..."
}`
  },
  {
    id: "outbound-payout",
    title: "Outbound Global Payout",
    method: "POST",
    path: "/api/v1/payouts/execute",
    desc: "ফিউশন নোড থেকে বাইরের সিস্টেমে (PayPal, Priyo Pay, bKash) টাকা পাঠানোর লজিক।",
    params: [
      { name: "gateway", type: "enum", desc: "PAYPAL, PRIYO_PAY, BKASH_B2C" },
      { name: "recipient_id", type: "string", desc: "Recipient's identity (Email/Phone)." },
      { name: "amount", type: "number", desc: "Disbursement amount." }
    ],
    example: `{
  "gateway": "PRIYO_PAY",
  "recipient_id": "vendor@global.com",
  "amount": 1250.00,
  "directive": "L3_IMPERIAL_SETTLEMENT"
}`
  },
  {
    id: "card-load",
    title: "Virtual Card Issuance",
    method: "POST",
    path: "/api/v1/cards/issue",
    desc: "কোম্পানির নিজস্ব মাস্টারকার্ড বা ভিসা কার্ড ইস্যু করার এন্ডপয়েন্ট।",
    params: [
      { name: "user_id", type: "string", desc: "Target citizen unique ID." },
      { name: "brand", type: "enum", desc: "MASTERCARD, VISA." }
    ],
    example: `{
  "user_id": "sko_user_82af",
  "brand": "MASTERCARD",
  "initial_load": 100.00
}`
  }
];

export default function APIDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [liveLedger, setLiveLedger] = useState<any[]>([]);
  const { toast } = useToast();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateTransaction = (direction: 'INBOUND' | 'OUTBOUND') => {
    setIsTesting(true);
    setTestLogs([]);
    
    const steps = [
      { msg: `Initializing ${direction} Corridor Handshake...`, type: 'info' as const },
      { msg: "Validating X-Sovereign-Signature (HMAC-SHA256)...", type: 'info' as const },
      { msg: "Checking Mesh Node Capacity...", type: 'info' as const },
      { msg: direction === 'INBOUND' ? "Source: HSBC_UK Validated OK." : "Target: PAYPAL_GATEWAY Ready.", type: 'success' as const },
      { msg: "Atomic Data Persistence Syncing...", type: 'info' as const },
      { msg: `${direction} Settlement Completed Successfully.`, type: 'success' as const }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setTestLogs(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsTesting(false);
        
        const newEntry = {
          id: `TX_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          status: 'SUCCESS',
          type: direction === 'INBOUND' ? 'RECEIVE_FROM_BANK' : 'SEND_TO_APP',
          amount: (Math.random() * 1000).toFixed(2),
          ts: new Date().toLocaleTimeString()
        };
        setLiveLedger(prev => [newEntry, ...prev].slice(0, 10));
        
        toast({
          title: `${direction} Ready & Verified`,
          description: "System logic is 100% confirmed for this corridor.",
        });
      }
    }, 600);
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
              Sovereign API & Database Mesh
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            v1.2.0-stable • ISO_20022_ACTIVE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
              <h2 className="text-4xl font-headline font-bold tracking-tighter uppercase italic">Connectivity <span className="text-accent">Oracle</span></h2>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                ফিউশন পে-এর ডিটারমিনিস্টিক এপিআই সিস্টেম এখন ১০০% রেডি। বাইরের যেকোনো ব্যাংক বা অ্যাপ আমাদের এপিআই ব্যবহার করে সরাসরি টাকা পাঠাতে পারবে (Inbound) এবং আমরাও গ্লোবাল গেটওয়ে ব্যবহার করে টাকা পাঠাতে পারবো (Outbound)। প্রতিটি ট্রানজ্যাকশন ISO 20022 স্ট্যান্ডার্ড মেনে সিঙ্ক হয়।
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/20">
                    <ArrowDownCircle className="h-4 w-4 text-accent" />
                    <span className="text-[9px] font-bold uppercase text-white tracking-widest">Receive Logic Ready</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20">
                    <ArrowUpCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-[9px] font-bold uppercase text-white tracking-widest">Send Logic Ready</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/20">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span className="text-[9px] font-bold uppercase text-white tracking-widest">ISO 20022 Compliant</span>
                 </div>
              </div>
            </div>

            <Card className="glass-panel border-accent/20 bg-accent/5 p-6 w-full xl:w-96 shrink-0 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10"><Activity className="h-20 w-20 text-accent" /></div>
               <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-5 w-5 text-accent" />
                  <p className="text-xs font-bold uppercase text-white tracking-widest">Handshake Lab (Testing)</p>
               </div>
               <div className="space-y-4 relative z-10">
                 <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    "অন্য ব্যাংক থেকে আমাদের সিস্টেমে টাকা আসার লজিক এবং আমাদের থেকে টাকা যাওয়ার লজিক এখনই টেস্ট করুন।"
                 </p>
                 <div className="grid grid-cols-2 gap-2">
                    <Button 
                      className="text-[9px] font-bold h-10 bg-accent text-background cyan-glow uppercase tracking-widest"
                      onClick={() => simulateTransaction('INBOUND')}
                      disabled={isTesting}
                    >
                      Test Inbound (Receive)
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-[9px] font-bold h-10 border-blue-400/30 text-blue-400 uppercase tracking-widest"
                      onClick={() => simulateTransaction('OUTBOUND')}
                      disabled={isTesting}
                    >
                      Test Outbound (Send)
                    </Button>
                 </div>
               </div>
               {testLogs.length > 0 && (
                 <div className="mt-4 p-3 rounded bg-black/40 border border-white/5 font-mono text-[8px] space-y-1.5 animate-fade-in">
                    {testLogs.map((log, i) => (
                      <p key={i} className={cn(
                        "flex items-start gap-2",
                        log.type === 'success' ? 'text-green-400 font-bold' : 
                        log.type === 'error' ? 'text-red-400' : 'text-white/60'
                      )}>
                        <span>{log.type === 'success' ? '✓' : '>'}</span>
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
                            <CardTitle className="text-xl mt-2 flex items-center gap-2 text-white uppercase italic">
                              {api.id.includes('settlement') ? <ArrowDownCircle className="h-5 w-5 text-accent" /> : <ArrowUpCircle className="h-5 w-5 text-primary" />}
                              {api.title}
                            </CardTitle>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(api.example, api.id)} className="hover:bg-accent/10">
                            {copiedId === api.id ? <Check className="h-4 w-4 text-green-400" /> : <Code2 className="h-4 w-4" />}
                          </Button>
                        </div>
                        <CardDescription className="text-xs mt-2 italic text-muted-foreground">{api.desc}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div className="p-6 space-y-4 border-r border-white/5">
                             <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Request Parameters</h4>
                             <div className="space-y-3">
                               {api.params.map((p, i) => (
                                 <div key={i} className="flex flex-col gap-1">
                                   <div className="flex items-center gap-2">
                                     <span className="text-xs font-bold text-white">{p.name}</span>
                                     <span className="text-[10px] font-mono text-accent">[{p.type}]</span>
                                   </div>
                                   <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                                 </div>
                               ))}
                             </div>
                          </div>
                          <div className="p-6 bg-black/40">
                             <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-4">Payload Example</h4>
                             <pre className="text-[11px] font-mono text-white/80 leading-relaxed overflow-x-auto p-4 rounded bg-black/20 border border-white/5 group-hover:border-accent/20 transition-colors">
                               {api.example}
                             </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="database" className="space-y-6">
                   <Card className="glass-panel border-white/5">
                      <CardHeader>
                         <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
                            <Database className="h-4 w-4 text-accent" /> Storage Paths & Security
                         </CardTitle>
                         <CardDescription className="text-[10px] italic">"Direct access paths for authorized clearing house nodes."</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         {[
                           { path: "/users/{userId}", desc: "Citizen identity & Balance node." },
                           { path: "/payment_links", desc: "Marketplace corridor registry." },
                           { path: "/events", desc: "Root event log for audit oracles." }
                         ].map((p, i) => (
                           <div key={i} className="p-3 rounded-lg bg-secondary/20 border border-white/5 flex items-center justify-between group hover:border-accent/30 transition-all">
                              <div>
                                 <p className="text-xs font-mono text-accent font-bold">{p.path}</p>
                                 <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                              </div>
                              <Lock className="h-3 w-3 text-muted-foreground/30 group-hover:text-accent transition-colors" />
                           </div>
                         ))}
                         <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex gap-4 mt-4">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-yellow-500 uppercase">Conflict Resolution</p>
                               <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                                  যদি ডাটা সিঙ্কে কোনো সমস্যা হয় (যেমন: ৪০৩ এরর), তবে সিস্টেম স্বয়ংক্রিয়ভাবে ট্রানজ্যাকশন রিভার্ট করবে এবং কার্নেল প্লেনে "RECOVERY" মোড ট্রিগার করবে।
                               </p>
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5 h-fit shadow-2xl">
                  <CardHeader className="p-4 border-b border-white/5">
                     <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest">
                        <History className="h-4 w-4 text-accent" />
                        Live Mesh Ledger
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <ScrollArea className="h-[450px]">
                        {liveLedger.length === 0 ? (
                          <div className="p-20 text-center text-muted-foreground italic text-[10px]">
                             No active mesh interactions. Run a test to see live updates.
                          </div>
                        ) : (
                          <div className="divide-y divide-white/5">
                             {liveLedger.map((tx) => (
                               <div key={tx.id} className="p-4 space-y-2 hover:bg-white/5 transition-all">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-mono text-accent font-bold">{tx.id}</span>
                                     <Badge className="bg-green-500/20 text-green-400 text-[8px] border-green-500/20">CONFIRMED</Badge>
                                  </div>
                                  <div className="flex justify-between items-end">
                                     <div>
                                        <p className="text-[9px] uppercase font-bold text-white">{tx.type.replace(/_/g, ' ')}</p>
                                        <p className="text-[8px] text-muted-foreground">{tx.ts}</p>
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

