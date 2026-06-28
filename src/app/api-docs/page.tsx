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
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const API_ENDPOINTS = [
  {
    id: "civic-analysis",
    title: "Civic Incident Analysis",
    method: "POST",
    path: "/ai/flows/civicIncidentAnalysis",
    desc: "Analyzes civic emergencies and suggests deterministic response strategies.",
    params: [
      { name: "type", type: "enum", desc: "FLOOD, SOS, FIRE, CIVIL_UNREST" },
      { name: "severity", type: "number", desc: "1-5 scale of intensity" },
      { name: "location", type: "string", desc: "GPS or Sector identifier" }
    ],
    example: `{
  "type": "FLOOD",
  "severity": 4,
  "location": "Sector 7, Junction A"
}`
  },
  {
    id: "payout-orchestration",
    title: "Payout Orchestrator",
    method: "POST",
    path: "/ai/flows/payoutFlow",
    desc: "Handles multi-rail financial disbursements with imperial directive validation.",
    params: [
      { name: "gateway", type: "enum", desc: "PAYPAL, PRIYO_PAY, PAYONEER" },
      { name: "amount", type: "number", desc: "USD equivalent" },
      { name: "recipientEmail", type: "string", desc: "Target identity email" }
    ],
    example: `{
  "gateway": "PAYONEER",
  "amount": 1250,
  "recipientEmail": "vendor@mesh.gov"
}`
  },
  {
    id: "kernel-emit",
    title: "Kernel Event Emission",
    method: "INTERNAL",
    path: "kernel.emitEvent()",
    desc: "Directly injects a deterministic event into the Sovereign OS queue.",
    params: [
      { name: "plane", type: "enum", desc: "CIVIC, FINANCE, SECURITY, INFRA" },
      { name: "type", type: "string", desc: "Event identifier (e.g. MODE_TRANSITION)" },
      { name: "priority", type: "number", desc: "1 (High) to 10 (Low)" }
    ],
    example: `emitEvent('SECURITY', 'ISOLATION_TRIGGER', 1, { node: 'PROXY-04' });`
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
          <div className="space-y-4">
            <h2 className="text-4xl font-headline font-bold tracking-tighter">Developer <span className="text-accent italic">Interface</span></h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Access the Sovereign Mesh via deterministic API endpoints. All calls are logged in the Infrastructure Plane and subject to the Priority Resolver.
            </p>
          </div>

          <Tabs defaultValue="intelligence" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5">
              <TabsTrigger value="intelligence">Intelligence Plane (Genkit)</TabsTrigger>
              <TabsTrigger value="kernel">Kernel Core</TabsTrigger>
              <TabsTrigger value="mesh">Data Mesh (Firestore)</TabsTrigger>
            </TabsList>

            <TabsContent value="intelligence" className="space-y-8">
              {API_ENDPOINTS.filter(api => api.method !== 'INTERNAL').map((api) => (
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
                         <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Parameters</h4>
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
                         <pre className="text-[11px] font-mono text-white/80 leading-relaxed overflow-x-auto">
                           {api.example}
                         </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="kernel" className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-accent" />
                    Priority Resolver Logic
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    The Kernel Priority Resolver (DPE) intercepts every event and recalculates its position in the queue based on the active system mode.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { mode: "NORMAL", rule: "All planes execute at requested priority." },
                      { mode: "EMERGENCY", rule: "CIVIC plane boosted to P1/P2. FINANCE deprioritized." },
                      { mode: "LOCKDOWN", rule: "Only SECURITY plane executes. All others restricted to P10." }
                    ].map((r, i) => (
                      <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-2">
                        <Badge variant="outline" className="text-[10px]">{r.mode}</Badge>
                        <p className="text-xs text-white/80 italic">"{r.rule}"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest">Internal Call Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-accent">
                    <p>// Inject high-clearance security event</p>
                    <p>emitEvent('SECURITY', 'NODE_ISOLATION', 1, &lbrace; node: 'NODE-01' &rbrace;);</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mesh" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "System Events", path: "/system/events/logs/{id}", entity: "KernelEvent" },
                  { title: "Active Emergencies", path: "/civic/emergencies/active/{id}", entity: "CivicEmergency" },
                  { title: "Financial Node", path: "/finance/accounts/{id}", entity: "BankAccount" },
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
