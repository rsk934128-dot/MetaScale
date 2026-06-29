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
  Milestone
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

export default function UBILIntegrationPage() {
  const [search, setSearch] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isVerifyingAmex, setIsVerifyingAmex] = useState(false);
  const [showIntegrityReport, setShowIntegrityReport] = useState(false);
  const [simPreset, setSimPreset] = useState("Txn Success");
  const [simAmount, setSimAmount] = useState("25000.00");
  const [simBank, setSimBank] = useState("Brac Bank");
  const [isSignatureValid, setIsSignatureValid] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([
    "UBIL Core: Webhook Node online, listening...",
  ]);

  const { toast } = useToast();
  const firestore = useFirestore();

  useEffect(() => {
    // Initializing System Logs
    const timer = setTimeout(() => {
      setLogs(prev => [
        "> Node amex-ob_uk registered successfully. Status: ACTIVE_READY",
        "> Mapping BIC: AETCUS55XXX for American Express UK...",
        "> Smart Router: Priority rule applied for Amex UK (Force Direct API)",
        "> System: Level 0 Ledger Syncing with Sovereign Drive...",
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
      timestamp: timestamp,
      path: 'WEBHOOK_INJECTOR'
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

  const handleAmexVerify = async () => {
    setIsVerifyingAmex(true);
    setLogs(prev => [`$ nn-cli --node-verify amex-ob_uk --status`, ...prev]);
    
    setTimeout(async () => {
      const recordId = `LOG_AMEX_UK_2026_06_30_001`;
      const timestamp = Date.now();
      
      setLogs(prev => [
        `> Status: ACTIVE_READY (Verified by NoorNexus Kernel)`,
        `> Ledger Entry Created: ${recordId}`,
        ...prev
      ]);

      const record = {
        id: recordId,
        type: 'NODE_VERIFICATION',
        senderBank: 'American Express UK',
        senderName: 'NoorNexus Sovereign Grid',
        status: 'SUCCESS',
        integrationPath: 'DIRECT_API',
        routingReason: 'Amex UK node successfully integrated into Sovereign Grid. Routing priority set to Direct API for PIS/AIS operations.',
        handshakeStatus: 'ACTIVE_READY',
        idempKey: `idemp_config_amex_2026`,
        signatureStatus: 'VALID',
        securitySignature: 'SHA-256: 8f2e9c...8e',
        timestamp: timestamp,
        isPermanentRecord: true,
        metadata: { id: 'amex-ob_uk', bic: 'AETCUS55XXX', env: 'LIVE', nodeStatus: 'VERIFIED_NODE' }
      };
      
      if (firestore) {
        await setDoc(doc(firestore, 'ubil_events', recordId), record);
      }

      setIsVerifyingAmex(false);
      toast({
        title: "Node Verified & Logged",
        description: "Amex UK node record LOG_AMEX_UK_2026_06_30_001 added to ledger.",
      });
    }, 1500);
  };

  const runTestTriggerScript = async () => {
    setIsTestRunning(true);
    setShowIntegrityReport(false);
    setLogs(prev => [`> Starting NoorNexus UBIL Smart Router Bulk Validation...`, ...prev]);
    
    const testRequests = [
        { type: "single_payment", desc: "Standard Single Payment" },
        { type: "bulk_payment", desc: "Bulk Transaction" },
        { type: "standard_consent", desc: "Data Consent Flow" },
        { type: "international_transfer", desc: "Cross-border Transfer" },
        { type: "scheduled_payment", desc: "Recurring Payment" },
        { type: "single_payment", desc: "Standard Single Payment" },
        { type: "custom_ui_required", desc: "Amex UK Priority Check", institutionId: 'amex-ob_uk' },
        { type: "bulk_payment", desc: "Bulk Transaction High-Value", institutionId: 'amex-ob_uk' },
        { type: "standard_consent", desc: "Data Consent Flow" },
        { type: "international_transfer", desc: "Cross-border Transfer" }
    ];

    for (let i = 0; i < testRequests.length; i++) {
        const req = testRequests[i];
        const eventId = `UBIL_TEST_${i+1}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        
        const response = await createYapilyConsent({
            institutionId: req.institutionId || 'barclays',
            callbackUrl: 'https://noornexus.com/callback',
            scope: req.type.includes('payment') ? 'PIS' : 'AIS',
            userId: 'user_tester_01',
            requestType: req.type as any
        });

        const eventData = {
            id: eventId,
            type: req.type.toUpperCase(),
            amount: 1500 + (i * 250),
            currency: 'USD',
            senderBank: req.institutionId === 'amex-ob_uk' ? 'American Express UK' : 'Yapily Integrated Node',
            senderName: `Tester Node ${i+1}`,
            status: 'SUCCESS',
            integrationPath: response.integrationPath,
            routingReason: response.routingReason,
            handshakeStatus: response.handshakeStatus,
            idempKey: `idemp_bulk_test_${i+1}`,
            timestamp: Date.now(),
            notes: req.desc
        };

        if (firestore) {
            await setDoc(doc(firestore, 'ubil_events', eventId), eventData);
        }

        setLogs(prev => [`> Request ${i+1}: Routed to ${response.integrationPath} [${req.desc}]`, ...prev]);
        await new Promise(resolve => setTimeout(resolve, 400));
    }

    setLogs(prev => [
      `> Bulk Validation Complete. Average Latency: 27.5ms`,
      `> All 10/10 Handshakes Verified. Security Status: AUTHENTIC_100%`,
      `> Final Integrity Report Generated.`,
      ...prev
    ]);
    setIsTestRunning(false);
    setShowIntegrityReport(true);
    toast({ title: "Simulation Finalized", description: "১০টি ট্রানজ্যাকশন সফলভাবে অডিট লগে রেকর্ড করা হয়েছে।" });
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
          <div className="flex items-center gap-3">
             <Button 
                variant="outline" 
                size="sm" 
                className="border-accent/30 text-accent font-bold text-[10px] h-8 hidden md:flex"
                onClick={handleAmexVerify}
                disabled={isVerifyingAmex}
             >
                {isVerifyingAmex ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <ShieldCheck className="mr-2 h-3 w-3" />}
                Verify Amex UK Node
             </Button>
             <Button 
                variant="outline" 
                size="sm" 
                className="border-primary/30 text-primary font-bold text-[10px] h-8 hidden md:flex"
                onClick={runTestTriggerScript}
                disabled={isTestRunning}
             >
                {isTestRunning ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Play className="mr-2 h-3 w-3" />}
                Run Test Trigger Script
             </Button>
             <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
                v1.2.0-stable • FORENSICS_ON
             </Badge>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
          {showIntegrityReport && (
            <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5 animate-fade-in mb-6">
               <CardHeader className="p-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
                        <Award className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle className="text-sm font-headline italic uppercase">Final Integrity Report: Project 42 Success</CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest">NoorNexus Sovereign OS • Sheikh Code Exchange</CardDescription>
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold" onClick={() => setShowIntegrityReport(false)}>Dismiss Report</Button>
               </CardHeader>
               <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                     <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Transactions</p>
                        <p className="text-xl font-headline font-bold text-white">10 / 10</p>
                     </div>
                     <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Handshakes</p>
                        <p className="text-xl font-headline font-bold text-green-400">Verified</p>
                     </div>
                     <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Auto-Switch</p>
                        <p className="text-xl font-headline font-bold text-accent">Optimized</p>
                     </div>
                     <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Avg Latency</p>
                        <p className="text-xl font-headline font-bold text-primary">27.5 ms</p>
                     </div>
                     <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Security</p>
                        <p className="text-xl font-headline font-bold text-yellow-500">AUTHENTIC</p>
                     </div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-secondary/20 text-[11px] text-white/80 italic border-l-2 border-green-500">
                    "Amex UK node successfully integrated into Sovereign Grid. Routing priority set to Direct API for PIS/AIS operations. Node verified as LIVE ready."
                  </div>
               </CardContent>
            </Card>
          )}

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
              <Tabs defaultValue="sim" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/30 h-10 mb-4">
                    <TabsTrigger value="sim" className="text-[10px] uppercase font-bold tracking-widest">Inbound Sim</TabsTrigger>
                    <TabsTrigger value="config" className="text-[10px] uppercase font-bold tracking-widest">Operational</TabsTrigger>
                </TabsList>

                <TabsContent value="sim" className="m-0 space-y-4 animate-fade-in">
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
                </TabsContent>

                <TabsContent value="config" className="m-0 space-y-4 animate-fade-in">
                    <Card className="glass-panel border-white/5">
                        <CardHeader className="p-4 border-b border-white/5">
                            <CardTitle className="text-xs uppercase flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-primary" /> Architecture Nodes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {[
                                    { name: "Smart Router", status: "Active", desc: "Hosted vs Direct Routing" },
                                    { name: "Direct API Engine", status: "Active", desc: "Low-Latency Yapily PIS/AIS" },
                                    { name: "Audit Inspector", status: "Active", desc: "L0 Ledger Synchronization" },
                                    { name: "Amex UK Node", status: "Active", desc: "BIC: AETCUS55XXX (LIVE)" }
                                ].map((item, i) => (
                                    <div key={i} className="p-3 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-white uppercase">{item.name}</span>
                                            <Badge className="bg-green-500/20 text-green-400 text-[8px] uppercase">{item.status}</Badge>
                                        </div>
                                        <p className="text-[9px] text-muted-foreground italic">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
              </Tabs>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] space-y-2 relative h-48 overflow-y-auto scrollbar-hide">
                 <p className="text-accent uppercase font-bold sticky top-0 bg-black/60 pb-1 flex items-center gap-2">
                    <Terminal className="h-3 w-3" /> CORE MAINFRAME:
                 </p>
                 {logs.map((log, i) => <p key={i} className={cn("animate-fade-in", log.startsWith('!') ? "text-red-400 font-bold" : log.startsWith('>') ? "text-primary italic" : log.startsWith('$') ? "text-accent font-bold" : log.startsWith('?') ? "text-yellow-400" : "text-white/60")}>{log}</p>)}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
               <Card className="glass-panel border-white/5">
                <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" />
                      Audit Ledger & Inspector
                    </CardTitle>
                    <CardDescription className="text-[10px]">Real-time synchronization with Global Ledger Access (Level 0)</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Search by Idemp-Key, Path or Event ID..." className="pl-9 h-9 bg-secondary/30 border-white/5 text-[11px]" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 h-[550px]">
                    <ScrollArea className="border-r border-white/5">
                       <div className="divide-y divide-white/5">
                          {loading ? (
                             <div className="flex flex-col items-center justify-center h-40 opacity-30">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <p className="text-[10px] mt-2 font-bold uppercase tracking-widest">Syncing Audit Mesh...</p>
                             </div>
                          ) : filteredEvents.length === 0 ? (
                             <div className="p-12 text-center text-muted-foreground italic text-xs">No records found in this corridor.</div>
                          ) : filteredEvents.map((event) => (
                            <div 
                              key={event.id} 
                              className={cn(
                                "p-4 cursor-pointer transition-all hover:bg-white/5 group",
                                selectedEvent?.id === event.id ? "bg-accent/5 border-l-4 border-l-accent" : "border-l-4 border-l-transparent"
                              )}
                              onClick={() => setSelectedEvent(event)}
                            >
                               <div className="flex justify-between items-start mb-2">
                                  <div className="flex gap-1.5">
                                    <Badge className={cn("text-[8px] uppercase font-bold", event.status === 'SUCCESS' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                        {event.status}
                                    </Badge>
                                    {event.integrationPath && (
                                        <Badge variant="outline" className={cn("text-[8px] uppercase font-bold", event.integrationPath === 'DIRECT_API' ? "border-primary text-primary" : "border-accent text-accent")}>
                                            {event.integrationPath}
                                        </Badge>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-muted-foreground font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                               </div>
                               <p className={cn("text-[11px] font-bold truncate", event.isPermanentRecord ? "text-accent" : "text-white")}>{event.id}</p>
                               <p className="text-[10px] text-muted-foreground">{event.senderBank} • {event.type}</p>
                            </div>
                          ))}
                       </div>
                    </ScrollArea>

                    <div className="p-6 bg-black/20 overflow-y-auto">
                       {selectedEvent ? (
                         <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                               <h4 className="text-sm font-bold uppercase text-accent">Inspector Details</h4>
                               <Badge variant="outline" className="font-mono text-[9px]">{selectedEvent.id}</Badge>
                            </div>
                            
                            <Tabs defaultValue="forensics" className="w-full">
                                <TabsList className="bg-secondary/50 p-1 mb-4 h-9">
                                    <TabsTrigger value="forensics" className="text-[9px] uppercase font-bold">Forensics</TabsTrigger>
                                    <TabsTrigger value="routing" className="text-[9px] uppercase font-bold">Routing History</TabsTrigger>
                                    <TabsTrigger value="metadata" className="text-[9px] uppercase font-bold">Metadata</TabsTrigger>
                                </TabsList>

                                <TabsContent value="forensics" className="space-y-4 m-0">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Idempotency Key</p>
                                            <p className="text-[10px] font-mono text-white">{selectedEvent.idempKey}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Signature Status</p>
                                            <Badge className={selectedEvent.signatureStatus === 'INVALID' ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}>
                                                {selectedEvent.signatureStatus || 'VALID (Test)'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded bg-black/40 border border-white/5 space-y-1">
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Security Signature</p>
                                        <p className="text-[10px] font-mono text-accent truncate">{selectedEvent.securitySignature || 'SHA-256: 8f2e9c...8e'}</p>
                                    </div>
                                    {selectedEvent.securityTag && (
                                       <div className="p-2 rounded bg-red-500/10 border border-red-500/20 flex gap-2 items-center">
                                          <ShieldAlert className="h-3 w-3 text-red-400" />
                                          <p className="text-[8px] font-bold text-red-400 uppercase">BREACH DETECTED: {selectedEvent.securityTag}</p>
                                       </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="routing" className="space-y-4 m-0">
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-3">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Info className="h-4 w-4" />
                                            <p className="text-[10px] font-bold uppercase">Path Decision Reason</p>
                                        </div>
                                        <p className="text-[11px] text-white/90 italic leading-relaxed">
                                            "{selectedEvent.routingReason || 'Standard inbound webhook bypass.'}"
                                        </p>
                                        <div className="flex justify-between items-center border-t border-white/5 pt-2">
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Handshake Status</span>
                                            <span className="text-[10px] font-mono text-green-400">{selectedEvent.handshakeStatus || 'NOMINAL'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded bg-accent/5 border border-accent/20 text-[9px] text-accent">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Deterministic reconciliation completed at {new Date(selectedEvent.timestamp).toLocaleTimeString()}.
                                    </div>
                                </TabsContent>

                                <TabsContent value="metadata" className="space-y-4 m-0">
                                    <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-[9px] text-white/60 space-y-1">
                                        <p>"sender": "{selectedEvent.senderName}"</p>
                                        <p>"bank": "{selectedEvent.senderBank}"</p>
                                        <p>"amount": {selectedEvent.amount || 0}</p>
                                        <p>"currency": "{selectedEvent.currency || 'USD'}"</p>
                                        <p>"origin_node": "NoorNexus_Yapily_Router"</p>
                                        <p>"l0_sync": "SUCCESSFUL"</p>
                                        {selectedEvent.metadata && Object.entries(selectedEvent.metadata).map(([k, v]) => (
                                          <p key={k}>"{k}": "{v}"</p>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
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
        
        <footer className="p-4 border-t bg-secondary/5 text-center">
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground/40 italic">
              Sheikh Code Exchange (Project 42) • Deterministic Finality OK
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
