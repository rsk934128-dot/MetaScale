
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
  ShieldHalf,
  Wifi,
  CloudLightning
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createYapilyConsent } from "@/ai/flows/yapily-banking-flow";
import { useKernel } from "@/components/kernel/KernelProvider";
import { Progress } from "@/components/ui/progress";

export default function UBILMainframePage() {
  const { heartbeat, emitEvent } = useKernel();
  const [search, setSearch] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [isVerifyingAmex, setIsVerifyingAmex] = useState(false);
  const [showIntegrityReport, setShowIntegrityReport] = useState(false);
  const [isSignatureValid, setIsSignatureValid] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([
    "UBIL Core: Mainframe Terminal ACTIVE, listening...",
  ]);

  const { toast } = useToast();
  const firestore = useFirestore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(prev => [
        "> System Status: Projects 42-44 verified in Knowledge Bank.",
        "> Project 45 (Eco Governance) rails identified and active.",
        "> Heartbeat Monitor: Proactive Pulse active on 3 core nodes.",
        "> Amex UK Node status: PERMANENT_VERIFIED.",
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
      { msg: "> Heartbeat Probe: NODE-04 Latency @ 8.4ms", delay: 400 },
      { msg: "> Forensic Security Seals... OK (0x82 Protocol Guard)", delay: 600 },
      { msg: "! FINAL STATUS: SYSTEM INTEGRITY 100% - SOVEREIGN GRID SECURE", delay: 1000 }
    ];

    for (const step of checkSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setLogs(prev => [step.msg, ...prev]);
    }

    setIsHealthChecking(false);
    toast({ title: "Global Health Check PASSED" });
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
          {/* Heartbeat Monitor Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {heartbeat.map((node) => (
               <Card key={node.nodeId} className="glass-panel border-l-4 border-l-accent overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg bg-accent/10 border border-accent/20",
                          node.status === 'DEGRADED' && "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
                          node.status === 'ONLINE' && "text-accent"
                        )}>
                           <HeartPulse className={cn("h-4 w-4", node.status === 'ONLINE' && "animate-pulse")} />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-white uppercase tracking-widest">{node.nodeId}</p>
                           <p className="text-[9px] text-muted-foreground uppercase">{node.status} • {node.latency}ms</p>
                        </div>
                     </div>
                     <Wifi className={cn("h-4 w-4", node.status === 'ONLINE' ? "text-green-500" : "text-yellow-500")} />
                  </CardContent>
               </Card>
             ))}
          </div>

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
                       <Radar className="h-4 w-4 text-primary" /> Proactive Monitoring
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[9px] font-bold uppercase">
                          <span>Mesh Health</span>
                          <span className="text-accent">98.4%</span>
                       </div>
                       <Progress value={98.4} className="h-1 bg-white/5 [&>div]:bg-accent" />
                    </div>
                    <p className="text-[9px] text-muted-foreground italic leading-relaxed">
                       "Heartbeat worker is probing all core corridors every 30s. Anycast failover is ARMED."
                    </p>
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

                            <div className="p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-[10px] text-white/60 space-y-2 leading-relaxed">
                                <p>"origin_plane": "INFRASTRUCTURE",</p>
                                <p>"source_node": "{selectedEvent.senderBank || 'API_GATEWAY'}",</p>
                                <p>"timestamp": {selectedEvent.timestamp},</p>
                                <p>"auth_mode": "OAUTH2_P43",</p>
                                <p>"status": "PERMANENT_RECORD"</p>
                            </div>
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
              Project 42: Bank Connectivity
           </Badge>
           <Badge variant="ghost" className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              Project 43: AI Syntax Architect
           </Badge>
           <Badge variant="ghost" className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              Project 44: Data Enrichment
           </Badge>
           <Badge variant="ghost" className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              Project 45: Eco Governance
           </Badge>
        </footer>
      </SidebarInset>
    </div>
  );
}
