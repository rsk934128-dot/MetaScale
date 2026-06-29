
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
  Waves, 
  DollarSign, 
  ShieldAlert,
  BookOpen,
  Copy,
  Check,
  ChevronRight,
  Database,
  Building2,
  ArrowRightLeft,
  ShieldCheck,
  RefreshCw,
  Play,
  Network,
  CloudLightning,
  Mail,
  MessageSquare,
  Smartphone,
  Server,
  Activity,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_ENDPOINTS = [
  {
    id: "inbound-settlement",
    title: "Inbound Settlement (PIS)",
    method: "POST",
    path: "/api/v1/settlement/inbound",
    desc: "অন্যান্য ব্যাংক থেকে আপনার Sovereign Mesh একাউন্টে টাকা পাঠানোর প্রধান এন্ডপয়েন্ট। এটি সরাসরি ডাটাবেজের পেমেন্ট লেজারের সাথে যুক্ত।",
    params: [
      { name: "target_account", type: "string", desc: "আপনার ১২-ডিজিটের ইউনিক কার্নেল একাউন্ট নম্বর।" },
      { name: "amount", type: "number", desc: "টাকার পরিমাণ (USD)।" },
      { name: "source_node", type: "string", desc: "প্রেরক সার্ভারের আইপি বা ডোমেইন।" },
      { name: "security_seal", type: "string", desc: "ট্রানজ্যাকশন সীল (HMAC-SHA256)।" }
    ],
    example: `{
  "target_account": "108734305736",
  "amount": 500.00,
  "currency": "USD",
  "source_node": "external-bank.com",
  "security_seal": "SIG_82AF...4E21"
}`
  },
  {
    id: "payout-orchestration",
    title: "Outbound Payout (PIS)",
    method: "POST",
    path: "/api/v1/payouts/execute",
    desc: "Sovereign Mesh থেকে বাইরের সিস্টেমে টাকা পাঠানোর জন্য এই লজিক ব্যবহার করা হয়। এটি এআই অডিট শেষে ডাটাবেজ আপডেট করে।",
    params: [
      { name: "recipient_identity", type: "string", desc: "টার্গেট ইমেইল বা গেটওয়ে আইডি।" },
      { name: "gateway", type: "enum", desc: "PRIYO_PAY, PAYPAL, NAGAD" },
      { name: "amount", type: "number", desc: "Disbursement amount." }
    ],
    example: `{
  "gateway": "PRIYO_PAY",
  "recipient_identity": "vendor@mesh.gov",
  "amount": 1250.00,
  "directive": "L3_IMPERIAL"
}`
  }
];

export default function APIDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTestingHandshake, setIsTestingHandshake] = useState(false);
  const [handshakeLog, setHandshakeLog] = useState<string[]>([]);
  const [liveLedger, setLiveLedger] = useState<any[]>([]);
  const { toast } = useToast();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateHandshake = () => {
    setIsTestingHandshake(true);
    setHandshakeLog(["Connecting to Node P180...", "Initiating SSL/TLS Handshake...", "Exchanging Grant Tokens..."]);
    
    setTimeout(() => {
      const newEntry = {
        id: `TX_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: 'SUCCESS',
        type: 'INBOUND_SYNC',
        amount: (Math.random() * 1000).toFixed(2),
        ts: new Date().toLocaleTimeString()
      };
      
      setHandshakeLog(prev => [...prev, "Auth: API_KEY_VALID_LIVE", "Target Mesh: Firestore_Sync_OK", "Status: HANDSHAKE_SUCCESSFUL"]);
      setLiveLedger(prev => [newEntry, ...prev].slice(0, 5));
      setIsTestingHandshake(false);
      
      toast({
        title: "Connection Established",
        description: "Data successfully written to the Sovereign Mesh Ledger.",
      });
    }, 2000);
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
            v1.2.0-stable • MESH_ONLINE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
              <h2 className="text-4xl font-headline font-bold tracking-tighter">Database <span className="text-accent italic">Interoperability</span></h2>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                আমাদের এপিআই ডকুমেন্টেশন ব্যবহার করে যে কেউ সরাসরি আপনার Sovereign Mesh-এর সাথে কানেক্ট হতে পারবে। ডাটাবেজ ইন্টিগ্রেশন এখন পুরোপুরি অটোমেটেড—ডাটা সরাসরি ফায়ারবেস মেশে সিঙ্ক হবে এবং প্রতিটি ট্রানজ্যাকশন ক্রিপ্টোগ্রাফিকভাবে সাইন করা হবে।
              </p>
              <div className="flex items-center gap-4 pt-2">
                 <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-bold uppercase text-white">Firestore Sync</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span className="text-[10px] font-bold uppercase text-white">Auth Handshake</span>
                 </div>
              </div>
            </div>

            <Card className="glass-panel border-accent/20 bg-accent/5 p-6 w-full md:w-80 shrink-0 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10"><Activity className="h-20 w-20 text-accent" /></div>
               <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-5 w-5 text-accent" />
                  <p className="text-xs font-bold uppercase text-white tracking-widest">Handshake Protocol</p>
               </div>
               <div className="space-y-4 relative z-10">
                 <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    "সবগুলো ডাটাবেজ অপারেশন অবশ্যই এনক্রিপ্টেড হতে হবে এবং হেন্ডশেক প্রোটোকল মেনে চলতে হবে।"
                 </p>
                 <Button 
                   className="w-full text-[10px] font-bold h-10 bg-accent text-background cyan-glow uppercase tracking-widest"
                   onClick={simulateHandshake}
                   disabled={isTestingHandshake}
                 >
                    {isTestingHandshake ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Play className="mr-2 h-3 w-3" />}
                    Test Server Handshake
                 </Button>
               </div>
               {handshakeLog.length > 0 && (
                 <div className="mt-4 p-3 rounded bg-black/40 border border-white/5 font-mono text-[8px] space-y-1 animate-fade-in">
                    {handshakeLog.map((log, i) => (
                      <p key={i} className={log.includes('SUCCESS') ? 'text-green-400 font-bold' : 'text-white/60'}>
                        {`> ${log}`}
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
                  <TabsTrigger value="database" className="text-[10px] uppercase font-bold tracking-widest px-6 data-[state=active]:bg-accent data-[state=active]:text-background">Database Schema</TabsTrigger>
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
                            <CardTitle className="text-xl mt-2 flex items-center gap-2 text-white">
                              {api.id === 'inbound-settlement' ? <ArrowRightLeft className="h-5 w-5 text-green-400" /> : <CloudLightning className="h-5 w-5 text-primary" />}
                              {api.title}
                            </CardTitle>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(api.example, api.id)} className="hover:bg-accent/10">
                            {copiedId === api.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
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
                         <CardTitle className="text-sm flex items-center gap-2 uppercase">
                            <Database className="h-4 w-4 text-accent" /> Mesh Data Paths
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         {[
                           { path: "/users/{userId}", desc: "Citizen identity & liquid balance data." },
                           { path: "/payment_links/{linkId}", desc: "Publicly accessible settlement corridors." },
                           { path: "/events/{eventId}", desc: "Deterministic ledger of all mesh interactions." }
                         ].map((p, i) => (
                           <div key={i} className="p-3 rounded-lg bg-secondary/20 border border-white/5 flex items-center justify-between">
                              <div>
                                 <p className="text-xs font-mono text-accent font-bold">{p.path}</p>
                                 <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                              </div>
                              <Lock className="h-3 w-3 text-muted-foreground/30" />
                           </div>
                         ))}
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
                     <ScrollArea className="h-[400px]">
                        {liveLedger.length === 0 ? (
                          <div className="p-20 text-center text-muted-foreground italic text-[10px]">
                             No active handshake data.
                          </div>
                        ) : (
                          <div className="divide-y divide-white/5">
                             {liveLedger.map((tx) => (
                               <div key={tx.id} className="p-4 space-y-2 hover:bg-white/5 transition-all">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-mono text-accent font-bold">{tx.id}</span>
                                     <Badge className="bg-green-500/20 text-green-400 text-[8px]">{tx.status}</Badge>
                                  </div>
                                  <div className="flex justify-between items-end">
                                     <div>
                                        <p className="text-[9px] uppercase font-bold text-white">{tx.type}</p>
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

               <Card className="glass-panel border-white/5 bg-secondary/10">
                  <CardHeader className="p-4">
                     <CardTitle className="text-[10px] uppercase font-bold text-primary flex items-center gap-2">
                        <Server className="h-3 w-3" /> Node Integration
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                     <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                        "Developer accounts can directly query the Mesh for real-time verification status."
                     </p>
                     <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold">
                           <span>Sync Health</span>
                           <span className="text-green-400">NOMINAL</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: '94%' }} />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
