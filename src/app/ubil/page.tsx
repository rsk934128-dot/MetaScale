
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
  Send,
  BrainCircuit
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
  const { heartbeat, emitEvent, startAutonomousWorker, isAutonomousActive, events } = useKernel();
  const [search, setSearch] = useState("");
  const [isHealthChecking, setIsHealthChecking] = useState(false);
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
        "> Heartbeat Monitor: Pulse active on core nodes.",
        ...prev
      ]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for autonomous engine and agent events to log in console
  useEffect(() => {
    if (!events || events.length === 0) return;
    
    const latestEvent = events[0];
    if (latestEvent.type === 'AUTONOMOUS_SETTLEMENT_SUCCESS') {
      setLogs(prev => [
        `> [AUTONOMOUS] Settled ${latestEvent.payload.count} পেন্ডিং পেমেন্ট।`,
        ...prev
      ]);
    } else if (latestEvent.type.includes('AGENT_')) {
      setLogs(prev => [
        `> [AGENT_COUNCIL] Directive: ${latestEvent.type} | Target: ${latestEvent.payload.agentName || 'GLOBAL'}`,
        `> [SYNC] Seal: ${latestEvent.id.substring(0, 14)}... recorded in ledger.`,
        ...prev
      ]);
    }
  }, [events]);

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ubil_events'), orderBy('timestamp', 'desc'), limit(50));
  }, [firestore]);

  const { data: remoteEvents, loading } = useCollection<any>(eventsQuery);

  const handleStartAutonomous = () => {
    startAutonomousWorker();
    setLogs(prev => [`$ nn-cli --start-autonomous`, `> Sovereign Worker Started... Cycle: 60s.`, ...prev]);
    toast({ title: "Autonomous Engine Active", description: "সিস্টেম এখন নিজে থেকেই পেমেন্ট ক্রেডিট করবে।" });
  };

  const filteredEvents = useMemo(() => {
    if (!remoteEvents) return [];
    return remoteEvents.filter(e => 
      e.senderBank?.toLowerCase().includes(search.toLowerCase()) || 
      e.id.includes(search) ||
      e.type.includes(search.toUpperCase())
    );
  }, [remoteEvents, search]);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-white">
              <Lock className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              UBIL Mainframe
            </h1>
          </div>
          <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                  "border-accent/30 text-accent font-bold text-[8px] md:text-[10px] h-8",
                  isAutonomousActive && "border-green-500 text-green-400"
              )}
              onClick={handleStartAutonomous}
              disabled={isAutonomousActive}
           >
              <Rocket className="mr-1 h-3 w-3" />
              <span className="hidden xs:inline">Engine {isAutonomousActive ? "Active" : "Start"}</span>
              <span className="xs:hidden">{isAutonomousActive ? "Active" : "Start"}</span>
           </Button>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
             {heartbeat.slice(0, 4).map((node) => (
               <Card key={node.nodeId} className="glass-panel border-l-4 border-l-accent overflow-hidden">
                  <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                     <HeartPulse className="h-4 w-4 text-accent" />
                     <div className="min-w-0">
                        <p className="text-[8px] md:text-[10px] font-bold text-white uppercase truncate">{node.nodeId}</p>
                        <p className="text-[7px] md:text-[8px] text-muted-foreground uppercase">{node.status}</p>
                     </div>
                  </CardContent>
               </Card>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 order-2 lg:order-1">
              <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl">
                  <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-[10px] md:text-xs uppercase flex items-center gap-2">
                        <Terminal className="h-4 w-4" /> Mainframe Terminal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-3 md:p-4 bg-black/60 font-mono text-[9px] md:text-[10px] space-y-1 h-[300px] md:h-[450px] overflow-y-auto scrollbar-hide">
                       {logs.map((log, i) => (
                         <p key={i} className={cn(
                           "pl-1 border-l-2 py-0.5 border-white/5",
                           log.includes('[AUTONOMOUS]') ? "text-green-400" : 
                           log.includes('[AGENT_COUNCIL]') ? "text-accent" :
                           "text-white/60"
                         )}>
                           {log}
                         </p>
                       ))}
                    </div>
                  </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
               <Card className="glass-panel border-white/5 shadow-2xl flex flex-col min-h-[400px]">
                <CardHeader className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" /> Ledger Inspection
                    </CardTitle>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Filter signals or types..." className="pl-9 h-8 bg-secondary/30 border-white/5 text-[10px] rounded-lg" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col md:flex-row overflow-hidden">
                  <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/5">
                    <ScrollArea className="h-[300px] md:h-[500px]">
                       <div className="divide-y divide-white/5">
                          {loading ? (
                             <div className="p-12 flex justify-center opacity-30"><Loader2 className="h-6 w-6 animate-spin" /></div>
                          ) : filteredEvents.map((event) => (
                            <div 
                              key={event.id} 
                              className={cn(
                                "p-3 md:p-4 cursor-pointer transition-all hover:bg-white/5",
                                selectedEvent?.id === event.id ? "bg-accent/5 border-l-4 border-l-accent" : "border-l-4 border-l-transparent"
                              )}
                              onClick={() => setSelectedEvent(event)}
                            >
                               <div className="flex justify-between items-start mb-1">
                                  <Badge variant={event.type === 'AGENT_DIRECTIVE_SYNCED' ? 'secondary' : 'default'} className="text-[7px] md:text-[8px] px-1 md:px-2 py-0">
                                    {event.type === 'AGENT_DIRECTIVE_SYNCED' ? 'AGENT' : event.status}
                                  </Badge>
                                  <span className="text-[7px] md:text-[8px] text-muted-foreground font-mono">{new Date(event.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                               </div>
                               <p className="text-[10px] md:text-[11px] font-bold text-white truncate">{event.id}</p>
                            </div>
                          ))}
                       </div>
                    </ScrollArea>
                  </div>

                  <div className="flex-1 p-4 md:p-6 bg-black/30 overflow-y-auto">
                     {selectedEvent ? (
                       <div className="space-y-6 md:space-y-8 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-white/10 pb-4">
                             <div className="min-w-0">
                                <h4 className="text-base md:text-lg font-headline italic font-bold uppercase text-accent truncate">
                                  {selectedEvent.type === 'AGENT_DIRECTIVE_SYNCED' ? 'Agent Council' : 'Ledger Inspector'}
                                </h4>
                             </div>
                             {selectedEvent.type === 'AGENT_DIRECTIVE_SYNCED' ? <BrainCircuit className="h-5 w-5 text-accent" /> : <Fingerprint className="h-5 w-5 text-accent" />}
                          </div>
                          <div className="p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                              <p className="text-[10px] md:text-[11px] text-white/90 italic leading-relaxed">
                                  "{selectedEvent.routingReason || 'Mapped to Sovereign Grid.'}"
                              </p>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                             {selectedEvent.type !== 'AGENT_DIRECTIVE_SYNCED' ? (
                               <div className="grid grid-cols-2 gap-4">
                                 <div className="p-3 rounded-lg bg-secondary/20 border border-white/5">
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Amount</p>
                                    <p className="text-sm font-bold text-white">${selectedEvent.amount}</p>
                                 </div>
                                 <div className="p-3 rounded-lg bg-secondary/20 border border-white/5">
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Bank</p>
                                    <p className="text-sm font-bold text-white">{selectedEvent.senderBank}</p>
                                 </div>
                               </div>
                             ) : (
                               <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-[10px] space-y-2">
                                  <p className="text-accent uppercase">// Agent Directive Trace</p>
                                  <pre className="text-white/60 whitespace-pre-wrap">
                                    {JSON.stringify(selectedEvent.payload, null, 2)}
                                  </pre>
                               </div>
                             )}
                          </div>
                       </div>
                     ) : (
                       <div className="h-40 md:h-full flex flex-col items-center justify-center opacity-20 text-center">
                          <Database className="h-12 w-12 md:h-16 md:w-16 mb-2" />
                          <p className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Select Signal to Inspect</p>
                       </div>
                     )}
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
