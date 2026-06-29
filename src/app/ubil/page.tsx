
"use client";

import { useState, useMemo } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Search, 
  Download, 
  Activity, 
  ShieldAlert, 
  Database,
  Unplug,
  Globe,
  Terminal,
  Lock,
  Loader2,
  Building2,
  Navigation,
  Play,
  History,
  Info,
  CheckCircle2,
  AlertTriangle,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Area, 
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getYapilyInstitutions, createYapilyConsent } from "@/ai/flows/yapily-banking-flow";

const PIE_DATA = [
  { name: "Txn Success", value: 28, color: "hsl(var(--accent))" },
  { name: "Bal Update", value: 16, color: "hsl(var(--primary))" },
  { name: "Auth Failed", value: 4, color: "hsl(var(--destructive))" },
];

const chartConfig = {
  success: { label: "Success", color: "hsl(var(--accent))" },
  blocked: { label: "Blocked", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;

export default function UBILIntegrationPage() {
  const [search, setSearch] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simPreset, setSimPreset] = useState("Txn Success");
  const [simAmount, setSimAmount] = useState("25000.00");
  const [simBank, setSimBank] = useState("Brac Bank");
  const [isSignatureValid, setIsSignatureValid] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>(["UBIL Core: Webhook Node online, listening..."]);

  const { toast } = useToast();
  const firestore = useFirestore();

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ubil_events'), orderBy('timestamp', 'desc'), limit(100));
  }, [firestore]);

  const { data: remoteEvents, loading } = useCollection<any>(eventsQuery);

  const dispatchSimulation = async () => {
    setIsSimulating(true);
    const eventId = `UBIL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = Date.now();
    
    setLogs(prev => [`>>> INCOMING WEBHOOK: [${simPreset}] FROM ${simBank}`, ...prev]);

    if (!isSignatureValid) {
      setLogs(prev => [`! CRITICAL: Signature Mismatch detected in ${eventId}`, `! TRACE: ACCESS_DENIED_0x82 at offset 42`, ...prev]);
    }

    const eventData = {
      id: eventId,
      type: simPreset === 'Txn Success' ? 'TXN_SUCCESS' : simPreset === 'Bal Update' ? 'BAL_UPDATE' : 'AUTH_FAILED',
      amount: parseFloat(simAmount),
      currency: 'BDT',
      senderBank: simBank,
      accountNumber: '120.291.839',
      senderName: 'Siddique Rahman',
      status: isSignatureValid ? 'SUCCESS' : 'BLOCKED',
      signatureStatus: isSignatureValid ? 'VALID' : 'INVALID',
      securityTag: isSignatureValid ? null : 'OFFSET_42_MISMATCH',
      idempKey: "idemp_" + Math.random().toString(36).substr(2, 6),
      timestamp: timestamp
    };

    if (firestore) {
      await setDoc(doc(firestore, 'ubil_events', eventId), eventData);
    }

    setTimeout(() => {
      setIsSimulating(false);
      toast({ 
        title: isSignatureValid ? "DISPATCH SUCCESS" : "SECURITY BLOCK", 
        variant: isSignatureValid ? "default" : "destructive" 
      });
    }, 800);
  };

  const filteredEvents = useMemo(() => {
    if (!remoteEvents) return [];
    return remoteEvents.filter(e => 
      e.senderBank?.toLowerCase().includes(search.toLowerCase()) || 
      e.senderName?.toLowerCase().includes(search.toLowerCase()) ||
      e.id.includes(search)
    );
  }, [remoteEvents, search]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-white uppercase italic">
              <Lock className="h-5 w-5 text-accent" />
              NoorNexus <span className="text-accent">UBIL CORE</span>
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
             v1.2.0-stable • FORENSICS_ON
          </Badge>
        </header>

        <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-panel border-l-4 border-l-accent p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Router Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xl font-bold">Active</span>
              </div>
            </Card>
            <Card className="glass-panel border-l-4 border-l-yellow-500 p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Integrity Layer</p>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck className="h-5 w-5 text-yellow-500" />
                <span className="text-xl font-bold">SHA-256</span>
              </div>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500 p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Security Blocks</p>
              <div className="flex items-center gap-2 mt-1">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <span className="text-xl font-bold">{remoteEvents?.filter(e => e.status === 'BLOCKED').length || 0}</span>
              </div>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Audit Trail</p>
              <div className="flex items-center gap-2 mt-1">
                <Database className="h-5 w-5 text-blue-400" />
                <span className="text-xl font-bold">{remoteEvents?.length || 0}</span>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4 border-b border-white/5">
                  <CardTitle className="text-xs uppercase flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    Forensic Simulator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase">Banking Event</Label>
                    <div className="grid grid-cols-1 gap-1">
                      {["Txn Success", "Auth Failed"].map(p => (
                        <Button key={p} variant={simPreset === p ? "default" : "outline"} className="h-8 text-[10px] justify-start px-3" onClick={() => setSimPreset(p)}>{p}</Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase">Signature Health</Label>
                    <Button variant="outline" className={cn("w-full h-10 justify-between text-[10px] font-bold border-white/5", isSignatureValid && "border-accent/40 bg-accent/5")} onClick={() => setIsSignatureValid(true)}>
                      <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-400" /> Authentic Header</div>
                    </Button>
                    <Button variant="outline" className={cn("w-full h-10 justify-between text-[10px] font-bold border-white/5", !isSignatureValid && "border-red-500/40 bg-red-500/5")} onClick={() => setIsSignatureValid(false)}>
                      <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-400" /> Corrupt/Hack Signature</div>
                    </Button>
                  </div>
                  <Button className="w-full h-12 bg-accent text-background font-bold uppercase text-[10px] cyan-glow" onClick={dispatchSimulation} disabled={isSimulating}>
                    {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Dispatch Handshake"}
                  </Button>
                </CardContent>
              </Card>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] space-y-2 relative h-48 overflow-y-auto scrollbar-hide">
                 <p className="text-accent uppercase font-bold sticky top-0 bg-black/60 pb-1 flex items-center gap-2">
                    <Terminal className="h-3 w-3" /> OS LOG CONSOLE:
                 </p>
                 {logs.map((log, i) => <p key={i} className={cn("animate-fade-in", log.startsWith('!') ? "text-red-400 font-bold" : log.startsWith('>') ? "text-accent" : "text-white/60")}>{log}</p>)}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
               <Card className="glass-panel border-white/5">
                <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" />
                      Audit Ledger & Forensic Inspector
                    </CardTitle>
                    <CardDescription className="text-[10px]">Real-time security analysis of incoming payloads</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 border-b border-white/5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Search by Idemp-Key or Event ID..." className="pl-9 h-9 bg-secondary/30 border-white/5 text-[11px]" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 h-[550px]">
                    <ScrollArea className="border-r border-white/5">
                       <div className="divide-y divide-white/5">
                          {filteredEvents.map((event) => (
                            <div 
                              key={event.id} 
                              className={cn(
                                "p-4 cursor-pointer transition-all hover:bg-white/5 group",
                                selectedEvent?.id === event.id ? "bg-accent/5 border-l-4 border-l-accent" : "border-l-4 border-l-transparent"
                              )}
                              onClick={() => setSelectedEvent(event)}
                            >
                               <div className="flex justify-between items-start mb-2">
                                  <Badge className={cn("text-[8px] uppercase font-bold", event.status === 'SUCCESS' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                     {event.status}
                                  </Badge>
                                  <span className="text-[9px] text-muted-foreground font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                               </div>
                               <p className="text-[11px] font-bold text-white truncate">{event.id}</p>
                               <p className="text-[10px] text-muted-foreground">{event.senderBank} • {event.type}</p>
                            </div>
                          ))}
                       </div>
                    </ScrollArea>

                    <div className="p-6 bg-black/20 overflow-y-auto">
                       {selectedEvent ? (
                         <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                               <h4 className="text-sm font-bold uppercase text-accent">Forensic Analysis</h4>
                               <Badge variant="outline" className="font-mono text-[9px]">{selectedEvent.id}</Badge>
                            </div>
                            
                            <div className="space-y-4">
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                     <p className="text-[8px] uppercase font-bold text-muted-foreground">Idempotency Key</p>
                                     <p className="text-[10px] font-mono text-white">{selectedEvent.idempKey}</p>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[8px] uppercase font-bold text-muted-foreground">Signature Status</p>
                                     <Badge className={selectedEvent.signatureStatus === 'VALID' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                                        {selectedEvent.signatureStatus}
                                     </Badge>
                                  </div>
                               </div>

                               {selectedEvent.status === 'BLOCKED' && (
                                 <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-3">
                                    <div className="flex items-center gap-2 text-red-400">
                                       <ShieldAlert className="h-4 w-4" />
                                       <span className="text-[10px] font-bold uppercase">Security Tag: {selectedEvent.securityTag}</span>
                                    </div>
                                    <p className="text-[10px] text-red-300 leading-relaxed italic">
                                       "Handshake terminated: HMAC-SHA256 verification failed. The payload integrity hash provided by {selectedEvent.senderBank} does not match the local kernel calculation."
                                    </p>
                                 </div>
                               )}

                               <div className="space-y-2">
                                  <p className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                                    <Fingerprint className="h-3 w-3" /> Raw Metadata
                                  </p>
                                  <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-[9px] text-white/60 space-y-1">
                                     <p>"sender": "{selectedEvent.senderName}"</p>
                                     <p>"bank": "{selectedEvent.senderBank}"</p>
                                     <p>"amount": {selectedEvent.amount}</p>
                                     <p>"account": "{selectedEvent.accountNumber}"</p>
                                     <p>"origin_node": "Anycast_UK_04"</p>
                                  </div>
                               </div>
                               
                               <div className="flex gap-2">
                                  <Button className="flex-1 bg-accent text-background text-[10px] font-bold uppercase h-9">Download Audit CSV</Button>
                                  <Button variant="outline" className="flex-1 border-white/10 text-[10px] font-bold uppercase h-9">Report to Node</Button>
                               </div>
                            </div>
                         </div>
                       ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                            <Info className="h-12 w-12" />
                            <p className="text-xs uppercase font-bold tracking-widest">Select an entry for forensics</p>
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
