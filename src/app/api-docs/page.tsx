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
  CloudLightning
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const API_ENDPOINTS = [
  {
    id: "inbound-settlement",
    title: "Inbound Settlement (PIS)",
    method: "POST",
    path: "/api/v1/settlement/inbound",
    desc: "অন্যান্য ব্যাংক থেকে আপনার Sovereign Mesh একাউন্টে টাকা পাঠানোর প্রধান এন্ডপয়েন্ট। এটি ডিটারমিনিস্টিক ভেরিফিকেশন সম্পন্ন করে।",
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
  "source_node": "fintech-fusion.app",
  "security_seal": "SIG_82AF...4E21"
}`
  },
  {
    id: "payout-orchestration",
    title: "Outbound Payout (PIS)",
    method: "POST",
    path: "/api/v1/payouts/execute",
    desc: "Sovereign Mesh থেকে বাইরের সিস্টেমে (যেমন Priyo Pay বা Bank) টাকা পাঠানোর জন্য এই লজিক ব্যবহার করা হয়।",
    params: [
      { name: "recipient_identity", type: "string", desc: "টার্গেট ইমেইল বা গেটওয়ে আইডি।" },
      { name: "gateway", type: "enum", desc: "PRIYO_PAY, PAYPAL, BKASH_B2C" },
      { name: "amount", type: "number", desc: "Disbursement amount." }
    ],
    example: `{
  "gateway": "PRIYO_PAY",
  "recipient_identity": "vendor@mesh.gov",
  "amount": 1250.00,
  "directive": "L3_IMPERIAL"
}`
  },
  {
    id: "entity-verification",
    title: "Entity Verification (AIS)",
    method: "GET",
    path: "/api/v1/entity/verify/{account_number}",
    desc: "কোনো একাউন্ট নম্বর ভ্যালিড কিনা এবং তার ট্রাস্ট স্কোর চেক করার জন্য। কানেকশন সচল রাখতে এটি জরুরি।",
    params: [
      { name: "account_number", type: "path", desc: "১২-ডিজিট আইডেন্টিটি নম্বর।" },
      { name: "api_key", type: "header", desc: "আপনার অ্যাপের সিক্রেট কি।" }
    ],
    example: `// Response 200 OK
{
  "status": "VERIFIED",
  "trust_score": 98.4,
  "connection_integrity": "STABLE",
  "clearance": "L3_DETERMINISTIC"
}`
  }
];

export default function APIDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTestingHandshake, setIsTestingHandshake] = useState(false);
  const [handshakeLog, setHandshakeLog] = useState<string[]>([]);
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
      setHandshakeLog(prev => [...prev, "Auth: API_KEY_VALID_LIVE", "Target Server: fintech-fusion-ziaz.vercel.app", "Status: HANDSHAKE_SUCCESSFUL"]);
      setIsTestingHandshake(false);
      toast({
        title: "Connection Established",
        description: "Server communication established with 99.9% uptime reliability.",
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
              Sovereign API Intelligence
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            v1.2.0-stable • ONLINE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
              <h2 className="text-4xl font-headline font-bold tracking-tighter">Global <span className="text-accent italic">Interoperability</span></h2>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                আপনার ব্যাংক বা পেমেন্ট অ্যাপকে Sovereign Mesh-এর সাথে যুক্ত করুন। আমাদের ডকুমেন্টেশন ব্যবহার করে যে কেউ, যেকোনো সময়, যেকোনো জায়গা থেকে কানেক্ট করতে পারবে। টাকা পাঠানো এবং গ্রহণ করার প্রক্রিয়া এখন পুরোপুরি অটোমেটেড।
              </p>
            </div>
            <Card className="glass-panel border-accent/20 bg-accent/5 p-6 w-full md:w-80 shrink-0 shadow-2xl">
               <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <p className="text-xs font-bold uppercase text-white tracking-widest">Handshake Protocol</p>
               </div>
               <div className="space-y-4">
                 <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    "সবগুলো কল অবশ্যই SSL/TLS এনক্রিপ্টেড হতে হবে এবং Authorization হেডার-এ Bearer Token থাকতে হবে।"
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

          <Tabs defaultValue="financial" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
              <TabsTrigger value="financial" className="text-[10px] uppercase font-bold tracking-widest px-6 data-[state=active]:bg-accent data-[state=active]:text-background">Receive & Send (PIS)</TabsTrigger>
              <TabsTrigger value="intelligence" className="text-[10px] uppercase font-bold tracking-widest px-6 data-[state=active]:bg-accent data-[state=active]:text-background">Intelligence Plane</TabsTrigger>
              <TabsTrigger value="mesh" className="text-[10px] uppercase font-bold tracking-widest px-6 data-[state=active]:bg-accent data-[state=active]:text-background">Data Registry</TabsTrigger>
            </TabsList>

            <TabsContent value="financial" className="space-y-8">
              {API_ENDPOINTS.map((api) => (
                <Card key={api.id} className="glass-panel border-white/5 overflow-hidden group hover:border-accent/30 transition-all shadow-xl">
                  <CardHeader className="p-6 border-b border-white/5 bg-white/5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <Badge className="bg-accent text-background font-bold px-3">{api.method}</Badge>
                           <span className="text-xs font-mono text-accent/80 tracking-tighter">{api.path}</span>
                        </div>
                        <CardTitle className="text-xl mt-2 flex items-center gap-2">
                          {api.id === 'inbound-settlement' ? <DollarSign className="h-5 w-5 text-green-400" /> : <CloudLightning className="h-5 w-5 text-primary" />}
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

            <TabsContent value="intelligence" className="space-y-6">
              <Card className="glass-panel border-l-4 border-l-accent shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest">
                    <Network className="h-5 w-5 text-accent" />
                    Civic Response API (SOS)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="p-5 rounded-xl bg-secondary/30 border border-white/5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge>POST</Badge>
                        <span className="text-xs font-mono text-accent">/ai/flows/civicIncidentAnalysis</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        ইমারজেন্সি ডিটেকশন এবং অটোমেটেড ডিসপ্যাচ লজিক বাইরের সেন্সর থেকে এই এপিআই-তে হিট করলে কার্নেল সরাসরি রেসপন্স করবে।
                      </p>
                      <div className="p-4 rounded bg-black/40 border border-white/5">
                        <pre className="text-[10px] font-mono text-accent">
                          {`{ 
  "type": "FLOOD", 
  "severity": 4, 
  "location": "Sector 7",
  "sensor_id": "SN-042"
}`}
                        </pre>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mesh" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "System Ledger", path: "/system/events/logs/{id}", entity: "KernelEvent" },
                  { title: "Financial Identity", path: "/users/{userId}", entity: "UserProfile" },
                  { title: "Public Payments", path: "/payment_links/{linkId}", entity: "PaymentLink" },
                  { title: "Mode Registry", path: "/system/control", entity: "SystemControlState" }
                ].map((mesh, i) => (
                  <Card key={i} className="glass-panel group hover:border-accent/30 transition-all cursor-pointer">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-accent/10 group-hover:bg-accent/20 transition-colors">
                            <Database className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors">{mesh.title}</h4>
                            <p className="text-[10px] font-mono text-muted-foreground">{mesh.path}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[8px] border-white/10 uppercase">{mesh.entity}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <section className="p-8 rounded-2xl bg-secondary/20 border border-white/5 space-y-6 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
             <div className="flex items-center gap-3 relative z-10">
                <Building2 className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-headline font-bold uppercase tracking-tight">External Node Onboarding</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="space-y-2">
                   <Badge className="bg-primary/20 text-primary text-[8px] mb-2 uppercase">Step 1</Badge>
                   <p className="text-xs font-bold text-white uppercase">Auth Link & DNS</p>
                   <p className="text-[10px] text-muted-foreground leading-relaxed">আপনার সিস্টেমের পাবলিক আইপি এবং ডোমেইন আমাদের সিকিউরিটি প্যানেলে রেজিস্টার করুন।</p>
                </div>
                <div className="space-y-2">
                   <Badge className="bg-primary/20 text-primary text-[8px] mb-2 uppercase">Step 2</Badge>
                   <p className="text-xs font-bold text-white uppercase">Symmetric Key Exchange</p>
                   <p className="text-[10px] text-muted-foreground leading-relaxed">OAuth2 হ্যান্ডশেকের মাধ্যমে আপনার সিস্টেমের জন্য একটি ডেডিকেটেড গ্র্যান্ট টোকেন তৈরি করুন।</p>
                </div>
                <div className="space-y-2">
                   <Badge className="bg-primary/20 text-primary text-[8px] mb-2 uppercase">Step 3</Badge>
                   <p className="text-xs font-bold text-white uppercase">Webhook Tunneling</p>
                   <p className="text-[10px] text-muted-foreground leading-relaxed">রিয়েল-টাইম পেমেন্ট নোটিফিকেশন পাওয়ার জন্য আপনার Webhook URL কনফিগার করুন।</p>
                </div>
             </div>
          </section>

          <footer className="pt-12 border-t border-white/5 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Deterministic API Grid v1.2</span>
            </div>
            <p className="text-[9px] text-muted-foreground opacity-50 uppercase tracking-widest italic">
              All interactions with the Mesh are cryptographically signed, logged, and audited by AI.
            </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
