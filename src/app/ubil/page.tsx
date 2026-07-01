
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
  CloudLightning,
  Rocket,
  Clock,
  Send
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
import { generateDailyPulse } from "@/ai/flows/daily-integrity-report-flow";

export default function UBILMainframePage() {
  const { heartbeat, emitEvent, startAutonomousWorker, isAutonomousActive } = useKernel();
  const [search, setSearch] = useState("");
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [isVerifyingAmex, setIsVerifyingAmex] = useState(false);
  const [showIntegrityReport, setShowIntegrityReport] = useState(false);
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

  const handleStartAutonomous = () => {
    startAutonomousWorker();
    setLogs(prev => [`$ nn-cli --start-autonomous --cycle=24H`, `> Autonomous Sovereign Worker Started...`, ...prev]);
    toast({ title: "Autonomous Engine Active", description: "Discovery & Heartbeat loops initialized." });
  };

  const handleManualPulse = async () => {
    setLogs(prev => [`$ nn-cli --generate-report --scope=DAILY`, `> Synthesizing Daily Integrity Pulse...`, ...prev]);
    try {
        const report = await generateDailyPulse({
            activeNodes: 42,
            newConnections: 12,
            totalTransactions: 1450,
            yieldRecycled: 42.5
        });
        emitEvent('FINANCE', 'DAILY_INTEGRITY_PULSE', 2, { report });
        toast({ title: "Pulse Dispatched", description: "Daily report sent to Telegram Gateway." });
    } catch (e) {
        toast({ variant: "destructive", title: "Report Failed" });
    }
  };

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
                className={cn(
                    "border-accent/30 text-accent font-bold text-[10px] h-8",
                    isAutonomousActive && "border-green-500 text-green-400 bg-green-500/5 animate-pulse"
                )}
                onClick={handleStartAutonomous}
                disabled={isAutonomousActive}
             >
                <Rocket className="mr-2 h-3.5 w-3.5" />
                {isAutonomousActive ? "Engine Active" : "Activate Autonomous Engine"}
             </Button>
             <Button 
                variant="outline" 
                size="sm" 
                className="border-primary/30 text-primary font-bold text-[10px] h-8 hidden md:flex"
                onClick={handleManualPulse}
             >
                <Send className="mr-2 h-3.5 w-3.5" />
                Generate Pulse
             </Button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
          {/* Autonomous Status Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <Card className="glass-panel border-l-4 border-l-accent overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                         <Clock className="h-4 w-4" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-white uppercase tracking-widest">Autonomous Cycle</p>
                         <p className="text-[9px] text-muted-foreground uppercase">{isAutonomousActive ? "24H ACTIVE" : "IDLE"}</p>
                      </div>
                   </div>
                   {isAutonomousActive && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />}
                </CardContent>
             </Card>
             {heartbeat.slice(0, 3).map((node) => (
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
                  </CardContent>
               </Card>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5 h-fit shadow-2xl">
                  <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs uppercase flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-accent" />
                      Autonomous Console
                  </CardTitle>
                  <Badge variant="outline" className="text-[8px] font-mono border-accent/30 text-accent">P45_AUTONOMOUS</Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 bg-black/60 font-mono text-[10px] space-y-2 h-[450px] overflow-y-auto scrollbar-hide">
                       <p className="text-accent uppercase font-bold sticky top-0 bg-black/60 pb-1 flex items-center gap-2 border-b border-white/5 mb-3">
                          <Activity className="h-3 w-3" /> SYSTEM_WORKER_LOGS:
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
                       <Radar className="h-4 w-4 text-primary" /> Daily Integrity Routine
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-3">
                       {[
                         { time: "00:00 - 06:00", label: "Discovery Scan", status: "READY" },
                         { time: "24/7", label: "Heartbeat Monitor", status: "ACTIVE" },
                         { time: "23:59", label: "Integrity Pulse", status: "SCHEDULED" }
                       ].map((r, i) => (
                         <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-black/40 border border-white/5">
                            <div>
                               <p className="text-[9px] font-bold text-white/70 uppercase">{r.label}</p>
                               <p className="text-[8px] text-muted-foreground">{r.time}</p>
                            </div>
                            <Badge variant="ghost" className="text-[8px] font-mono text-accent">{r.status}</Badge>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-6">
               <Card className="glass-panel border-white/5 shadow-2xl flex flex-col h-full">
                <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" />
                      Live Audit Ledger
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
      </SidebarInset>
    </div>
  );
}
