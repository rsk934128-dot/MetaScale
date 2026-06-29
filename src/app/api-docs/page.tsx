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
  ShieldCheck
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
    desc: "অন্যান্য ব্যাংক থেকে Sovereign Mesh একাউন্টে টাকা পাঠানোর এন্ডপয়েন্ট।",
    params: [
      { name: "target_account", type: "string", desc: "Sovereign ১২-ডিজিট একাউন্ট নম্বর।" },
      { name: "amount", type: "number", desc: "টাকার পরিমাণ (USD/BDT)।" },
      { name: "source_bank", type: "string", desc: "প্রেরক ব্যাংকের নাম বা BIC কোড।" },
      { name: "external_ref", type: "string", desc: "বাহ্যিক ট্রানজ্যাকশন রেফারেন্স।" }
    ],
    example: `{
  "target_account": "108734305736",
  "amount": 5000.00,
  "currency": "USD",
  "source_bank": "HSBC-GLOBAL",
  "external_ref": "TXN_9921028"
}`
  },
  {
    id: "entity-verification",
    title: "Entity Verification (AIS)",
    method: "GET",
    path: "/api/v1/entity/verify/{account_number}",
    desc: "কোনো একাউন্ট নম্বর ভ্যালিড কিনা এবং তার ট্রাস্ট স্কোর চেক করার জন্য।",
    params: [
      { name: "account_number", type: "path", desc: "১২-ডিজিট আইডেন্টিটি নম্বর।" },
      { name: "api_key", type: "header", desc: "আপনার অ্যাপের সিক্রেট কি।" }
    ],
    example: `// Response Example
{
  "status": "VERIFIED",
  "trust_score": 98.4,
  "jurisdiction": "BD",
  "clearance": "L3_DETERMINISTIC"
}`
  },
  {
    id: "payout-orchestration",
    title: "Payout Orchestrator",
    method: "POST",
    path: "/api/v1/payouts/execute",
    desc: "Sovereign Mesh থেকে বাইরের ব্যাংকে বা প্রিয় পে-তে টাকা পাঠানোর এন্ডপয়েন্ট।",
    params: [
      { name: "gateway", type: "enum", desc: "PAYPAL, PRIYO_PAY, PAYONEER" },
      { name: "amount", type: "number", desc: "USD equivalent" },
      { name: "recipient_email", type: "string", desc: "Target identity email" }
    ],
    example: `{
  "gateway": "PRIYO_PAY",
  "amount": 1250,
  "recipient_email": "vendor@mesh.gov",
  "security_seal": "FALLBACK_P180_X92"
}`
  }
];

export default function APIDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
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
              Sovereign API Documentation
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            v1.2.0-stable
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
              <h2 className="text-4xl font-headline font-bold tracking-tighter">Financial <span className="text-accent italic">Interoperability</span></h2>
              <p className="text-muted-foreground text-sm max-w-2xl">
                আপনার ব্যাংক বা অ্যাপকে Sovereign Mesh-এর সাথে যুক্ত করুন। আমাদের এন্ডপয়েন্টগুলো ব্যবহার করে এখনই টাকা পাঠানো এবং রিসিভ করা শুরু করুন।
              </p>
            </div>
            <Card className="glass-panel border-accent/20 bg-accent/5 p-6 w-full md:w-80 shrink-0">
               <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <p className="text-xs font-bold uppercase text-white">Handshake Protocol</p>
               </div>
               <p className="text-[10px] text-muted-foreground italic mb-4 leading-relaxed">
                  "সবগুলো কল অবশ্যই SSL/TLS এনক্রিপ্টেড হতে হবে এবং Authorization হেডার-এ Bearer Token থাকতে হবে।"
               </p>
               <Button className="w-full text-[10px] font-bold h-9 bg-accent text-background cyan-glow">
                  Get API Key
               </Button>
            </Card>
          </div>

          <Tabs defaultValue="financial" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12">
              <TabsTrigger value="financial" className="text-[10px] uppercase font-bold tracking-widest px-6">Financial Integration</TabsTrigger>
              <TabsTrigger value="intelligence" className="text-[10px] uppercase font-bold tracking-widest px-6">Intelligence Plane</TabsTrigger>
              <TabsTrigger value="mesh" className="text-[10px] uppercase font-bold tracking-widest px-6">Data Mesh</TabsTrigger>
            </TabsList>

            <TabsContent value="financial" className="space-y-8">
              {API_ENDPOINTS.map((api) => (
                <Card key={api.id} className="glass-panel border-white/5 overflow-hidden group">
                  <CardHeader className="p-6 border-b border-white/5 bg-white/5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <Badge className="bg-accent text-background font-bold">{api.method}</Badge>
                           <span className="text-xs font-mono text-accent/80">{api.path}</span>
                        </div>
                        <CardTitle className="text-xl mt-2">{api.title}</CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(api.example, api.id)}>
                        {copiedId === api.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <CardDescription className="text-xs mt-2">{api.desc}</CardDescription>
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
                         <pre className="text-[11px] font-mono text-white/80 leading-relaxed overflow-x-auto p-4 rounded bg-black/20 border border-white/5">
                           {api.example}
                         </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest">
                    <Terminal className="h-5 w-5 text-accent" />
                    Civic Response API
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge>POST</Badge>
                        <span className="text-xs font-mono">/ai/flows/civicIncidentAnalysis</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Analyzes civic emergencies and suggests deterministic response strategies.</p>
                      <pre className="text-[10px] font-mono text-accent p-2 bg-black/40 rounded">
                        {`{ "type": "FLOOD", "severity": 4, "location": "Sector 7" }`}
                      </pre>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mesh" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "System Events", path: "/system/events/logs/{id}", entity: "KernelEvent" },
                  { title: "Financial Node", path: "/users/{userId}", entity: "UserProfile" },
                  { title: "Payment Links", path: "/payment_links/{linkId}", entity: "PaymentLink" },
                  { title: "OS Control", path: "/system/control", entity: "SystemControlState" }
                ].map((mesh, i) => (
                  <Card key={i} className="glass-panel group hover:border-accent/30 transition-all">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-accent/10">
                            <Database className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{mesh.title}</h4>
                            <p className="text-[10px] font-mono text-muted-foreground">{mesh.path}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[8px]">{mesh.entity}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <section className="p-8 rounded-2xl bg-secondary/20 border border-white/5 space-y-6">
             <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-headline font-bold">External Node Onboarding</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <p className="text-xs font-bold text-white uppercase">Step 1: Auth Link</p>
                   <p className="text-[10px] text-muted-foreground">আপনার সিস্টেমের পাবলিক আইপি এবং ডোমেইন আমাদের সিকিউরিটি প্যানেলে রেজিস্টার করুন।</p>
                </div>
                <div className="space-y-2">
                   <p className="text-xs font-bold text-white uppercase">Step 2: Key Exchange</p>
                   <p className="text-[10px] text-muted-foreground">OAuth2 হ্যান্ডশেকের মাধ্যমে আপনার সিস্টেমের জন্য একটি ডেডিকেটেড গ্র্যান্ট টোকেন তৈরি করুন।</p>
                </div>
                <div className="space-y-2">
                   <p className="text-xs font-bold text-white uppercase">Step 3: Webhook Bind</p>
                   <p className="text-[10px] text-muted-foreground">রিয়েল-টাইম পেমেন্ট নোটিফিকেশন পাওয়ার জন্য আপনার Webhook URL কনফিগার করুন।</p>
                </div>
             </div>
          </section>

          <footer className="pt-12 border-t border-white/5 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deterministic API Grid v1.2</span>
            </div>
            <p className="text-[9px] text-muted-foreground opacity-50 uppercase tracking-tighter">
              All interactions with the Mesh are cryptographically signed and logged.
            </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
