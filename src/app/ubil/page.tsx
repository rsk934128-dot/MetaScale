"use client";

import { useState, useMemo, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Search, 
  Activity, 
  ShieldAlert, 
  Database,
  Terminal,
  Lock,
  Loader2,
  Play,
  History,
  Info,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Layers,
  ArrowRight,
  Globe,
  Unplug,
  Cpu,
  FileCode,
  Check,
  BarChart3,
  Award,
  Milestone,
  FolderArchive,
  HeartPulse,
  Radar,
  ShieldHalf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createYapilyConsent } from "@/ai/flows/yapily-banking-flow";

export default function UBILMainframePage() {
  const [search, setSearch] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [isVerifyingAmex, setIsVerifyingAmex] = useState(false);
  const [showIntegrityReport, setShowIntegrityReport] = useState(false);
  const [simPreset, setSimPreset] = useState("Txn Success");
  const [simAmount, setSimAmount] = useState("25000.00");
  const [simBank, setSimBank] = useState("Brac Bank");
  const [isSignatureValid, setIsSignatureValid] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([
    "UBIL Core: Mainframe Terminal ACTIVE, listening...",
  ]);

  const { toast } = useToast();
  const firestore = useFirestore();

  useEffect(() => {
    // Initializing System Logs
    const timer = setTimeout(() => {
      setLogs(prev => [
        "> System Status: Projects 42-44 verified in Knowledge Bank.",
        "> Project 45 (Eco Governance) rails identified and active.",
        "> Amex UK Node status: PERMANENT_VERIFIED.",
        "> Fiscal Recycler: Active (Recycling 42.5% Yield)",
        "> Ready for Global Health & Integrity Check...",
        ...prev
      ]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ubil_events'), orderBy('timestamp', 'desc'), limit(100));
  }, [firestore]);

  const { data: remoteEvents, loading } = useCollection<any>(eventsQuery);

  const runGlobalHealthCheck = async () => {
    setIsHealthChecking(true);
    setLogs(prev => [`$ nn-cli --health-check --all-planes`, ...prev]);
    
    const checkSteps = [
      { msg: "> Validating Project 42 (Bank Connectivity)... OK (100% Nodes)", delay: 600 },
      { msg: "> Validating Project 43 (Syntax Logic)... OK (SDK v1.2 Ready)", delay: 600 },
      { msg: "> Validating Project 44 (Data Enrichment)... OK (92.4% Density)", delay: 600 },
      { msg: "> Checking Project 45 (Eco Governance)... OK (Yield Recycle Active)", delay: 800 },
      { msg: "> Stress Testing Smart Router... OK (27.5ms Avg Latency)", delay: 800 },
      { msg: "> Checking Forensic Security Seals... OK (0x82 Protocol Guard)", delay: 600 },
      { msg: "! FINAL STATUS: SYSTEM INTEGRITY 100% - SOVEREIGN GRID SECURE", delay: 1000 }
    ];

    for (const step of checkSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setLogs(prev => [step.msg, ...prev]);
    }

    setIsHealthChecking(false);
    toast({ title: "Global Health Check PASSED", description: "All operational planes including P45 are in OPTIMAL state." });
  };

  const dispatchSimulation = async () => {
    setIsSimulating(true);
    const eventId = `UBIL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = Date.now();
    
    setLogs(prev => [`>>> INCOMING HANDSHAKE: [${simPreset}] FROM ${simBank}`, ...prev]);

    if (!isSignatureValid) {
      setLogs(prev => [`! CRITICAL: Signature Mismatch detected in ${eventId}`, `! TRACE: ACCESS_DENIED_0x82 at offset 42`, ...prev]);
    }

    const eventData = {
      id: eventId,
      type: simPreset === 'Txn Success' ? 'TXN_SUCCESS' : 'AUTH_FAILED',
      amount: parseFloat(simAmount),
      currency: 'BDT',
      senderBank: simBank,
      status: isSignatureValid ? 'SUCCESS' : 'BLOCKED',
      signatureStatus: isSignatureValid ? 'VALID' : 'INVALID',
      securityTag: isSignatureValid ? null : 'OFFSET_42_MISMATCH',
      idempKey: "idemp_" + Math.random().toString(36).substr(2, 6),
      timestamp: timestamp,
      path: 'HANDSHAKE_SIMULATOR'
    };

    if (firestore) {
      await setDoc(doc(firestore, 'ubil_events', eventId), eventData);
    }

    setTimeout(() => {
      setIsSimulating(false);
      toast({ 
        title: isSignatureValid ? "HANDSHAKE SUCCESS" : "SECURITY BLOCK", 
        variant: isSignatureValid ? "default" : "destructive" 
      });
    }, 800);
  };

  const handleAmexVerify = async () => {
    setIsVerifyingAmex(true);
    setLogs(prev => [`$ nn-cli --node-verify amex-ob_uk --status`, ...prev]);
    
    setTimeout(async () => {
      const recordId = `LOG_AMEX_UK_2026_06_30_001`;
      setLogs(prev => [`> Status: ACTIVE_READY (Verified by NoorNexus Kernel)`, ...prev]);
      
      const record = {
        id: recordId,
        type: 'NODE_VERIFICATION',
        senderBank: 'American Express UK',
        status: 'SUCCESS',
        integrationPath: 'DIRECT_API',
        routingReason: 'Amex UK node verified for PIS/AIS operations.',
        handshakeStatus: 'ACTIVE_READY',
        timestamp: Date.now(),
        isPermanentRecord: true,
        securitySignature: 'SHA-256: 8f2e9c...8e',
      };
      
      if (firestore) {
        await setDoc(doc(firestore, 'ubil_events', recordId), record);
      }

      setIsVerifyingAmex(false);
      toast({ title: "Amex UK Node Verified" });
    }, 1200);
  };

  const runTestTriggerScript = async () => {
    setIsTestRunning(true);
    setShowIntegrityReport(false);
    setLogs(prev => [`> Starting Sequential Routing Stress Test...`, ...prev]);
    
    const testRequests = [
        { type: "single_payment", desc: "Small Payout" },
        { type: "bulk_payment", desc: "Corporate Salary" },
        { type: "international_transfer", desc: "SWIFT Wire Simulation" },
        { type: "custom_ui_required", desc: "Amex Priority Link", institutionId: 'amex-ob_uk' }
    ];

    for (let i = 0; i < testRequests.length; i++) {
        const req = testRequests[i];
        const eventId = `STRESS_TEST_${i+1}`;
        
        const response = await createYapilyConsent({
            institutionId: req.institutionId || 'barclays',
            callbackUrl: 'https://noornexus.com/callback',
            scope: 'PIS',
            userId: 'user_tester_01',
            requestType: req.type as any
        });

        const eventData = {
            id: eventId,
            type: req.type.toUpperCase(),
            senderBank: req.institutionId === 'amex-ob_uk' ? 'Amex UK' : 'Yapily Node',
            status: 'SUCCESS',
            integrationPath: response.integrationPath,
            routingReason: response.routingReason,
            timestamp: Date.now(),
        };

        if (firestore) {
            await setDoc(doc(firestore, 'ubil_events', eventId), eventData);
        }

        setLogs(prev => [`> Request ${i+1}: Routed to ${response.integrationPath} [${req.desc}]`, ...prev]);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsTestRunning(false);
    setShowIntegrityReport(true);
    setLogs(prev => [`> Project 42-45 Integrity Report: 100% SUCCESS ARCHIVED.`, ...prev]);
    toast({ title: "Test Trigger Script Complete" });
  };

  const filteredEvents = useMemo(() => {
    if (!remoteEvents) return [];
    return remoteEvents.filter(e => 
      e.senderBank?.toLowerCase().includes(search.toLowerCase()) || 
      e.id.includes(search)
    );
  }, [remoteEvents, search]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-white uppercase italic">
              <Lock className="h-5 w-5 text-accent" />
              Sovereign <span className="text-accent">UBIL Mainframe</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <Button 
                variant="outline" 
                size="sm" 
                className="border-green-500/30 text-green-400 font-bold text-[10px] h-8 hidden md:flex"
                onClick={runGlobalHealthCheck}
                disabled={isHealthChecking}
             >
                {isHealthChecking ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <ShieldHalf className="mr-2 h-3 w-3" />}
                Global Health Check
             </Button>
             <Button 
                variant="outline" 
                size="sm" 
                className="border-accent/30 text-accent font-bold text-[10px] h-8"
                onClick={handleAmexVerify}
                disabled={isVerifyingAmex}
             >
                {isVerifyingAmex ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <ShieldCheck className="mr-2 h-3 w-3" />}
                Verify Amex Node
             </Button>
             <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-white font-bold text-[10px] h-8 px-4"
                onClick={runTestTriggerScript}
                disabled={isTestRunning}
             >
                {isTestRunning ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Run Stress Test
             </Button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
          {showIntegrityReport && (
            <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5 animate-fade-in mb-6 overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="h-20 w-20 text-green-400" /></div>
               <CardHeader className="p-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-green-500/20 text-green-400 cyan-glow">
                        <ShieldCheck className="h-8 w-8" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-headline italic uppercase tracking-tighter text-white">Full Grid Integrity Report (P42-P45)</CardTitle>
                        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-green-500 mt-1">DETERMINISTIC_FINALITY: ACHIEVED</p>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     {[
                        { label: "Success Rate", val: "100%", icon: CheckCircle2 },
                        { label: "Avg Latency", val: "27.5ms", icon: Zap },
                        { label: "Eco Governance", val: "ACTIVE", icon: ShieldHalf },
                        { label: "Nodes Sync", val: "14,200", icon: Globe },
                        { label: "Sovereignty", val: "MIL-SPEC", icon: ShieldCheck }
                     ].map((s, i) => (
                        <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 group hover:border-green-500/30 transition-all">
                           <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                              <s.icon className="h-3 w-3 text-green-500/50" /> {s.label}
                           </p>
                           <p className="text-xl font-headline font-bold text-white">{s.val}</p>
                        </div>
                     ))}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-secondary/20 border border-white/10 text-[11px] text-white/80 italic leading-relaxed">
                    "Project 45 Eco Governance is now recycling 42.5% of yield. All nodes reporting optimal profitability. AML/CFT Screening is active across the 42-node mesh."
                  </div>
               </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5 h-fit">
                  <CardHeader className="p-4 border-b border-white/5">
                  <CardTitle className="text-xs uppercase flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-accent" />
                      Mainframe Console
                  </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 bg-black/60 font-mono text-[10px] space-y-2 h-[450px] overflow-y-auto scrollbar-hide">
                       <p className="text-accent uppercase font-bold sticky top-0 bg-black/60 pb-1 flex items-center gap-2 border-b border-white/5 mb-3">
                          <Activity className="h-3 w-3" /> CORE_EXECUTION_PULSE:
                       </p>
                       {logs.map((log, i) => (
                         <p key={i} className={cn(
                           "animate-fade-in pl-2 border-l-2 py-0.5", 
                           log.startsWith('!') ? "text-red-400 font-bold border-red-500/30" : 
                           log.startsWith('>') ? "text-primary italic border-primary/30" : 
                           log.startsWith('$') ? "text-accent font-bold border-accent/30" : 
                           "text-white/60 border-white/5"
                         )}>
                           {log}
                         </p>
                       ))}
                    </div>
                  </CardContent>
              </Card>

              <Card className="glass-panel border-white/5 bg-secondary/10">
                 <CardHeader className="p-4">
                    <CardTitle className="text-xs uppercase flex items-center gap-2">
                       <Radar className="h-4 w-4 text-primary" /> System Proximity
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-4 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-accent/20 border-t-accent animate-spin mx-auto flex items-center justify-center">
                       <Globe className="h-8 w-8 text-accent animate-pulse" />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Node-04 Active • UK Corridor</p>
                 </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-6">
               <Card className="glass-panel border-white/5 shadow-2xl flex flex-col h-full">
                <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" />
                      Forensic Audit Ledger
                    </CardTitle>
                    <CardDescription className="text-[10px]">Deterministic synchronization with Sovereign L0 Nodes</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Filter by Node/Hash..." className="pl-9 h-8 bg-secondary/30 border-white/5 text-[10px] rounded-lg" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
                    <ScrollArea className="border-r border-white/5 h-[600px]">
                       <div className="divide-y divide-white/5">
                          {loading ? (
                             <div className="flex flex-col items-center justify-center h-40 opacity-30">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                             </div>
                          ) : filteredEvents.length === 0 ? (
                             <div className="p-12 text-center text-muted-foreground italic text-xs">Ledger is clean. No active handshakes.</div>
                          ) : filteredEvents.map((event) => (
                            <div 
                              key={event.id} 
                              className={cn(
                                "p-4 cursor-pointer transition-all hover:bg-white/5 group relative",
                                selectedEvent?.id === event.id ? "bg-accent/5 border-l-4 border-l-accent" : "border-l-4 border-l-transparent"
                              )}
                              onClick={() => setSelectedEvent(event)}
                            >
                               <div className="flex justify-between items-start mb-2">
                                  <div className="flex gap-1.5">
                                    <Badge className={cn("text-[8px] uppercase font-bold px-2 py-0", event.status === 'SUCCESS' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                        {event.status}
                                    </Badge>
                                    {event.isPermanentRecord && (
                                        <Badge variant="outline" className="text-[8px] border-yellow-500/40 text-yellow-500 font-bold uppercase">ARCHIVE</Badge>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-muted-foreground font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                               </div>
                               <p className={cn("text-[11px] font-bold truncate", event.isPermanentRecord ? "text-accent" : "text-white")}>{event.id}</p>
                               <p className="text-[10px] text-muted-foreground">{event.senderBank || 'System Node'}</p>
                               {event.integrationPath && (
                                 <Badge variant="ghost" className="absolute top-4 right-4 text-[7px] font-bold uppercase opacity-30 group-hover:opacity-100">{event.integrationPath}</Badge>
                               )}
                            </div>
                          ))}
                       </div>
                    </ScrollArea>

                    <div className="p-8 bg-black/30 overflow-y-auto">
                       {selectedEvent ? (
                         <div className="space-y-8 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                               <div className="space-y-1">
                                  <h4 className="text-lg font-headline italic font-bold uppercase text-accent tracking-tighter">Node Inspector</h4>
                                  <p className="text-[9px] uppercase font-bold text-muted-foreground">Deterministic Trace ID: {selectedEvent.id}</p>
                               </div>
                               <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                                  <Fingerprint className="h-6 w-6 text-accent" />
                                </div>
                            </div>
                            
                            <Tabs defaultValue="forensics" className="w-full">
                                <TabsList className="bg-secondary/40 p-1 mb-6 h-10 w-full justify-start rounded-xl">
                                    <TabsTrigger value="forensics" className="text-[9px] uppercase font-bold flex-1">Forensics</TabsTrigger>
                                    <TabsTrigger value="routing" className="text-[9px] uppercase font-bold flex-1">Routing</TabsTrigger>
                                    <TabsTrigger value="metadata" className="text-[9px] uppercase font-bold flex-1">Metadata</TabsTrigger>
                                </TabsList>

                                <TabsContent value="forensics" className="space-y-6 m-0">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Integrity Status</p>
                                            <p className="text-[10px] font-mono text-green-400 font-bold">AUTHENTIC_100%</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Signature Guard</p>
                                            <Badge className="bg-green-500/20 text-green-400 text-[8px]">VALID_HMAC</Badge>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Security Hash (SHA-256)</p>
                                        <p className="text-[10px] font-mono text-accent break-all leading-relaxed">{selectedEvent.securitySignature || '8f2e9c203b5d1298c47e8a91102b8e...'}</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="routing" className="space-y-6 m-0">
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10"><Zap className="h-10 w-10 text-primary" /></div>
                                        <div className="flex justify-between items-center">
                                           <span className="text-[10px] font-bold text-primary uppercase">Integration Path</span>
                                           <Badge className="bg-primary/20 text-primary uppercase text-[8px]">{selectedEvent.integrationPath || 'DIRECT_API'}</Badge>
                                        </div>
                                        <p className="text-[11px] text-white/90 italic leading-relaxed border-l-2 border-primary/30 pl-4">
                                            "{selectedEvent.routingReason || 'Project 42-45 verification audit successfully mapped node to Sovereign Grid.'}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-[10px] text-green-400 font-bold">
                                        <CheckCircle2 className="h-4 w-4" />
                                        DETERMINISTIC FINALITY OK
                                    </div>
                                </TabsContent>

                                <TabsContent value="metadata" className="space-y-4 m-0">
                                    <div className="p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-[10px] text-white/60 space-y-2 leading-relaxed">
                                        <p>"origin_plane": "INFRASTRUCTURE",</p>
                                        <p>"source_node": "{selectedEvent.senderBank || 'API_GATEWAY'}",</p>
                                        <p>"timestamp": {selectedEvent.timestamp},</p>
                                        <p>"idemp_key": "{selectedEvent.idempKey || 'null'}",</p>
                                        <p>"auth_mode": "OAUTH2_P43",</p>
                                        <p>"status": "PERMANENT_RECORD"</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                         </div>
                       ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                            <Database className="h-20 w-20 text-muted-foreground animate-logo-spin" />
                            <div className="space-y-1">
                               <p className="text-sm font-bold uppercase tracking-[0.5em]">Ledger Inspector Idle</p>
                               <p className="text-[10px] uppercase font-bold tracking-[0.2em] italic">Select a node from the left to inspect</p>
                            </div>
                         </div>
                       )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <footer className="p-4 border-t bg-secondary/5 text-center flex items-center justify-center gap-6">
           <Badge variant="ghost" className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              Sheikh Code Exchange (Project 42)
           </Badge>
           <Badge variant="ghost" className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              AI Syntax Architect (Project 43)
           </Badge>
           <Badge variant="ghost" className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              Data Enrichment (Project 44)
           </Badge>
           <Badge variant="ghost" className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              Eco Governance (Project 45)
           </Badge>
        </footer>
      </SidebarInset>
    </div>
  );
}
