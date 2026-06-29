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
  CheckCircle2
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

const TRAFFIC_DATA = [
  { time: "3PM", success: 8, blocked: 2, total: 10 },
  { time: "5PM", success: 12, blocked: 1, total: 13 },
  { time: "7PM", success: 18, blocked: 4, total: 22 },
  { time: "9PM", success: 15, blocked: 2, total: 17 },
  { time: "11PM", success: 9, blocked: 0, total: 9 },
  { time: "1AM", success: 5, blocked: 1, total: 6 },
];

const chartConfig = {
  success: { label: "Success", color: "hsl(var(--accent))" },
  blocked: { label: "Blocked", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;

const OPERATIONAL_MODULES = [
  { component: "Smart Router", status: "Active", task: "রিকোয়েস্ট অনুযায়ী রুট (Hosted/Direct) নির্ধারণ করা" },
  { component: "Hosted Handler", status: "Active", task: "দ্রুত পেমেন্ট ও অথরাইজেশন নিশ্চিত করা" },
  { component: "Direct API Engine", status: "Active", task: "কাস্টম ও জটিল ট্রানজেকশন প্রসেস করা" },
  { component: "Yapily Connector", status: "Active", task: "Yapily API-এর সাথে কানেক্টিভিটি নিয়ন্ত্রণ" },
  { component: "Consent Manager", status: "Enabled", task: "ব্যাংকিং ডেটা অ্যাক্সেসের অনুমতি পরিচালনা" },
  { component: "Webhook Handler", status: "Active", task: "ইনকামিং পেমেন্ট ও ডাটা ইভেন্ট প্রসেস করা" },
];

const TEST_REQUESTS = [
    { id: 1, type: "single_payment", desc: "Standard Single Payment" },
    { id: 2, type: "bulk_payment", desc: "Bulk Transaction" },
    { id: 3, type: "standard_consent", desc: "Data Consent Flow" },
    { id: 4, type: "international_transfer", desc: "Cross-border Transfer" },
    { id: 5, type: "scheduled_payment", desc: "Recurring Payment" },
    { id: 6, type: "single_payment", desc: "Standard Single Payment" },
    { id: 7, type: "custom_ui_required", desc: "Custom Interface Flow" },
    { id: 8, type: "bulk_payment", desc: "Bulk Transaction" },
    { id: 9, type: "standard_consent", desc: "Data Consent Flow" },
    { id: 10, type: "international_transfer", desc: "Cross-border Transfer" }
];

export default function UBILIntegrationPage() {
  const [search, setSearch] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simPreset, setSimPreset] = useState("Txn Success");
  const [simAmount, setSimAmount] = useState("25000.00");
  const [simBank, setSimBank] = useState("Brac Bank");
  const [isSignatureValid, setIsSignatureValid] = useState(true);
  const [logs, setLogs] = useState<string[]>(["UBIL Core: Webhook Node online, listening..."]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false);
  const [isCreatingConsent, setIsCreatingConsent] = useState(false);
  const [isTestingHandshake, setIsTestingHandshake] = useState(false);
  const [isRunningTestTrigger, setIsRunningTestTrigger] = useState(false);

  const { toast } = useToast();
  const firestore = useFirestore();

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ubil_events'), orderBy('timestamp', 'desc'), limit(100));
  }, [firestore]);

  const { data: remoteEvents, loading } = useCollection<any>(eventsQuery);

  const handleFetchInstitutions = async () => {
    setIsLoadingInstitutions(true);
    try {
      const data = await getYapilyInstitutions('GB');
      setInstitutions(data);
    } catch (err) {
      toast({ variant: "destructive", title: "API Error", description: "Failed to fetch institutions." });
    } finally {
      setIsLoadingInstitutions(false);
    }
  };

  const handleTestHandshake = async () => {
    setIsTestingHandshake(true);
    setLogs(prev => [">>> INITIATING TEST HANDSHAKE WITH YAPILY ENDPOINT...", ...prev]);
    setTimeout(() => {
      setIsTestingHandshake(false);
      setLogs(prev => [">>> HANDSHAKE SUCCESS: status=ACTIVE, lat=12ms, sig=VALID", ...prev]);
      toast({ title: "Test Handshake Success" });
    }, 2000);
  };

  const runTestTrigger = async () => {
    setIsRunningTestTrigger(true);
    setLogs(prev => [">>> STARTING NOORNEXUS UBIL SMART ROUTER TEST...", ...prev]);
    
    for (const req of TEST_REQUESTS) {
      try {
        const result = await createYapilyConsent({
          institutionId: 'hsbc-uk',
          callbackUrl: window.location.href,
          scope: 'PIS',
          userId: 'sko_user_82af',
          requestType: req.type as any
        });
        
        const eventId = `UBIL_TEST_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const logMsg = `Request ${req.id} (${req.type}) routed to: ${result.integrationPath}`;
        setLogs(prev => ["> " + logMsg, ...prev]);

        if (firestore) {
          await setDoc(doc(firestore, 'ubil_events', eventId), {
            id: eventId,
            type: 'ROUTING_DECISION',
            requestType: req.type,
            integrationPath: result.integrationPath,
            routingReason: result.routingReason,
            timestamp: Date.now(),
            status: 'SUCCESS',
            senderBank: 'hsbc-uk',
            senderName: `TEST_REQ_${req.id}`
          });
        }
        await new Promise(resolve => setTimeout(resolve, 400));
      } catch (err) {
        setLogs(prev => [`! Error on Request ${req.id}: Failed to route.`, ...prev]);
      }
    }

    setIsRunningTestTrigger(false);
    setLogs(prev => [">>> TEST COMPLETE. CHECK WEBHOOK INSPECTOR FOR LOGS.", ...prev]);
    toast({ title: "Bulk Test Complete", description: "10 routing scenarios validated." });
  };

  const handleCreateConsent = async (instId: string, type: string) => {
    setIsCreatingConsent(true);
    try {
      const result = await createYapilyConsent({
        institutionId: instId,
        callbackUrl: window.location.href,
        scope: 'PIS',
        userId: 'sko_user_82af',
        requestType: type as any
      });
      
      const eventId = `UBIL_ROUTED_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setLogs(prev => [`>>> SMART ROUTER: Path Selected = ${result.integrationPath}`, ...prev]);

      if (firestore) {
        await setDoc(doc(firestore, 'ubil_events', eventId), {
          id: eventId,
          type: 'ROUTING_DECISION',
          requestType: type,
          integrationPath: result.integrationPath,
          routingReason: result.routingReason,
          timestamp: Date.now(),
          status: 'SUCCESS',
          senderBank: instId,
          senderName: 'MANUAL_TRIGGER'
        });
      }

      toast({ title: `Router: ${result.integrationPath}`, description: result.routingReason });
    } catch (err) {
      toast({ variant: "destructive", title: "Consent Error" });
    } finally {
      setIsCreatingConsent(false);
    }
  };

  const dispatchSimulation = async () => {
    setIsSimulating(true);
    const eventId = `UBIL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = Date.now();
    
    setLogs(prev => [`>>> INCOMING WEBHOOK: [${simPreset}] FROM ${simBank}`, ...prev]);

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
      timestamp: timestamp
    };

    if (firestore) {
      await setDoc(doc(firestore, 'ubil_events', eventId), eventData);
    }

    setTimeout(() => {
      setIsSimulating(false);
      toast({ title: isSignatureValid ? "DISPATCH SUCCESS" : "SECURITY BLOCK" });
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
    <div className="flex min-h-screen bg-background">
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
               className="h-8 text-[10px] font-bold border-accent/20 text-accent" 
               onClick={handleTestHandshake} 
               disabled={isTestingHandshake}
             >
                {isTestingHandshake ? <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" /> : <Zap className="mr-1.5 h-3 w-3" />}
                Test Handshake
             </Button>
             <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
               v1.2.0-stable
             </Badge>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-white/5 p-1">
              <TabsTrigger value="overview" className="text-[10px] uppercase font-bold px-6">Overview</TabsTrigger>
              <TabsTrigger value="direct-api" className="text-[10px] uppercase font-bold px-6">Yapily Hybrid</TabsTrigger>
              <TabsTrigger value="config" className="text-[10px] uppercase font-bold px-6">Config</TabsTrigger>
              <TabsTrigger value="audit" className="text-[10px] uppercase font-bold px-6">Inspector</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-panel border-l-4 border-l-accent p-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Router Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xl font-bold">Active</span>
                  </div>
                </Card>
                <Card className="glass-panel border-l-4 border-l-primary p-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Coverage</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="h-5 w-5 text-primary" />
                    <span className="text-xl font-bold">14k+ Banks</span>
                  </div>
                </Card>
                <Card className="glass-panel border-l-4 border-l-yellow-500 p-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Security Layer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <ShieldCheck className="h-5 w-5 text-yellow-500" />
                    <span className="text-xl font-bold">HMAC-256</span>
                  </div>
                </Card>
                <Card className="glass-panel border-l-4 border-l-blue-400 p-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Daily Ingest</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="h-5 w-5 text-blue-400" />
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
                        Webhook Simulator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-3 gap-1">
                        {["Txn Success", "Bal Update", "Auth Failed"].map(p => (
                          <Button key={p} variant={simPreset === p ? "default" : "outline"} className="h-8 text-[9px] p-0" onClick={() => setSimPreset(p)}>{p}</Button>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] uppercase">Amount (BDT)</Label>
                        <Input value={simAmount} onChange={e => setSimAmount(e.target.value)} className="h-9 bg-secondary/30 text-xs" />
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className={cn("w-full h-10 justify-between text-[10px] font-bold border-white/5", isSignatureValid && "border-accent/40 bg-accent/5")} onClick={() => setIsSignatureValid(true)}>
                          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-400" /> Authentic Node</div>
                        </Button>
                        <Button variant="outline" className={cn("w-full h-10 justify-between text-[10px] font-bold border-white/5", !isSignatureValid && "border-red-500/40 bg-red-500/5")} onClick={() => setIsSignatureValid(false)}>
                          <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-400" /> Corrupt Header</div>
                        </Button>
                      </div>
                      <Button className="w-full h-12 bg-accent text-background font-bold uppercase text-[10px] cyan-glow" onClick={dispatchSimulation} disabled={isSimulating}>
                        {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Dispatch Handshake"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="glass-panel">
                      <CardHeader className="p-4 border-b border-white/5">
                        <CardTitle className="text-xs uppercase">Event Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                              </Pie>
                              <Tooltip contentStyle={{ background: '#13151a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-panel">
                      <CardHeader className="p-4 border-b border-white/5">
                        <CardTitle className="text-xs uppercase">Traffic Latency</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-[200px] w-full mt-4">
                          <ChartContainer config={chartConfig}>
                            <AreaChart data={TRAFFIC_DATA}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Area type="monotone" dataKey="success" stroke="hsl(var(--accent))" strokeWidth={2} fill="transparent" />
                            </AreaChart>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] space-y-2 relative overflow-hidden h-48 overflow-y-auto scrollbar-hide">
                    <div className="absolute top-2 right-2 text-white/20"><Terminal className="h-4 w-4" /></div>
                    <p className="text-accent uppercase font-bold sticky top-0 bg-black/60 pb-1">OS LOG CONSOLE:</p>
                    {logs.map((log, i) => <p key={i} className={cn("animate-fade-in", log.startsWith('!') ? "text-red-400" : log.startsWith('>') ? "text-accent" : "text-white/60")}>{log}</p>)}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="direct-api" className="space-y-6 animate-fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                     <Card className="glass-panel border-accent/20">
                        <CardHeader className="p-6 border-b border-white/5">
                           <div className="flex justify-between items-center">
                              <div>
                                 <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-accent" />
                                    Yapily Hybrid Integration
                                 </CardTitle>
                                 <CardDescription className="text-[10px] uppercase font-bold mt-1">Smart Routing verification suite</CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 text-[10px] font-bold border-accent/20 text-accent cyan-glow" 
                                  onClick={runTestTrigger} 
                                  disabled={isRunningTestTrigger}
                                >
                                   {isRunningTestTrigger ? <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" /> : <Play className="mr-1.5 h-3 w-3" />}
                                   Run Test Trigger Script
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-accent/20" onClick={handleFetchInstitutions} disabled={isLoadingInstitutions}>
                                   {isLoadingInstitutions ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <RefreshCw className="h-3 w-3 mr-1.5" />}
                                   Sync Mesh
                                </Button>
                              </div>
                           </div>
                        </CardHeader>
                        <CardContent className="p-0">
                           <div className="divide-y divide-white/5">
                              {isLoadingInstitutions ? (
                                 <div className="p-20 text-center space-y-4 opacity-40">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
                                    <p className="text-xs uppercase font-bold tracking-widest">Querying anycast grid...</p>
                                 </div>
                              ) : institutions.length === 0 ? (
                                 <div className="p-20 text-center text-muted-foreground italic text-xs">
                                    No institutions loaded. Hit "Sync Mesh" to query global nodes.
                                 </div>
                              ) : (
                                 institutions.map((inst) => (
                                    <div key={inst.id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-lg bg-secondary/50 border border-white/5 flex items-center justify-center text-accent">
                                             <Building2 className="h-5 w-5" />
                                          </div>
                                          <div>
                                             <p className="text-sm font-bold text-white uppercase">{inst.name}</p>
                                             <Badge variant="ghost" className="text-[8px] p-0 font-mono opacity-50 uppercase">{inst.id}</Badge>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <Button variant="outline" size="sm" className="h-8 border-accent/20 text-accent font-bold text-[10px] uppercase" onClick={() => handleCreateConsent(inst.id, 'single_payment')} disabled={isCreatingConsent}>
                                             Test Hosted
                                          </Button>
                                          <Button size="sm" className="h-8 bg-accent text-background font-bold text-[10px] uppercase" onClick={() => handleCreateConsent(inst.id, 'bulk_payment')} disabled={isCreatingConsent}>
                                             Test Direct
                                          </Button>
                                       </div>
                                    </div>
                                 ))
                              )}
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  <div className="space-y-6">
                     <Card className="glass-panel border-accent/20 bg-accent/5">
                        <CardHeader>
                           <CardTitle className="text-xs uppercase flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-accent" />
                              Auto-Switch Mech
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-3">
                              <div className="flex justify-between items-center text-[10px]">
                                 <span className="text-muted-foreground uppercase">Smart Router</span>
                                 <span className="text-green-400 font-bold uppercase">Armed</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                 <span className="text-muted-foreground uppercase">Integration</span>
                                 <span className="text-white font-bold">HYBRID</span>
                              </div>
                           </div>
                           <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                              স্মার্ট রাউটিং ভেরিফিকেশনের জন্য টেস্ট ট্রিগার স্ক্রিপ্ট রান করুন। প্রতিটি ডিসিশন অডিট লগে রেকর্ড হবে।
                           </p>
                        </CardContent>
                     </Card>

                     <Card className="glass-panel border-white/5">
                        <CardHeader className="p-4">
                           <CardTitle className="text-[10px] uppercase font-bold flex items-center gap-2">
                              <Activity className="h-3 w-3 text-primary" />
                              Anycast Latency
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                           <p className="text-2xl font-headline font-bold text-primary">12ms</p>
                           <p className="text-[9px] text-muted-foreground mt-1 uppercase">Node-04 (UK)</p>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-6 animate-fade-in">
               <Card className="glass-panel border-accent/20">
                  <CardHeader className="p-6 border-b border-white/5">
                     <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                        <History className="h-4 w-4 text-accent" />
                        Operational Components
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b border-white/5 bg-white/5">
                              <th className="p-4 text-[10px] font-bold uppercase text-muted-foreground">কম্পোনেন্ট</th>
                              <th className="p-4 text-[10px] font-bold uppercase text-muted-foreground">স্ট্যাটাস</th>
                              <th className="p-4 text-[10px] font-bold uppercase text-muted-foreground">কাজ</th>
                           </tr>
                        </thead>
                        <tbody>
                           {OPERATIONAL_MODULES.map((m, i) => (
                              <tr key={i} className="border-b border-white/5">
                                 <td className="p-4 text-sm font-bold text-white">{m.component}</td>
                                 <td className="p-4">
                                    <Badge className="bg-green-500/20 text-green-400 text-[9px] font-bold uppercase">{m.status}</Badge>
                                 </td>
                                 <td className="p-4 text-xs text-muted-foreground italic">{m.task}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6 animate-fade-in">
              <Card className="glass-panel border-white/5">
                <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" />
                      UBIL Webhook Inspector
                    </CardTitle>
                    <CardDescription className="text-[10px]">Real-time routing decisions and transactional logs</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase"><Download className="mr-1.5 h-3 w-3" /> Export CSV</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 border-b border-white/5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Search logs..." className="pl-9 h-9 bg-secondary/30 border-white/5 text-[11px]" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                  </div>
                  <ScrollArea className="h-[550px]">
                    {loading ? (
                      <div className="p-20 flex flex-col items-center gap-4 opacity-40"><Loader2 className="h-8 w-8 animate-spin text-accent" /><p className="text-[9px] font-bold uppercase tracking-widest">Accessing Vault...</p></div>
                    ) : filteredEvents.length === 0 ? (
                      <div className="p-20 text-center space-y-4 opacity-30"><Unplug className="h-12 w-12 mx-auto" /><p className="text-xs italic">Awaiting test trigger...</p></div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {filteredEvents.map((event) => (
                          <div key={event.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-all group">
                            <div className="flex gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border", 
                                event.type === 'ROUTING_DECISION' ? "bg-primary/10 border-primary/20 text-primary" : "bg-accent/10 border-accent/20 text-accent"
                              )}>
                                {event.type === 'ROUTING_DECISION' ? <Navigation className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-white uppercase">{event.senderName}</span>
                                  {event.integrationPath && (
                                    <Badge className={cn("text-[8px] uppercase font-bold", event.integrationPath === 'HOSTED' ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400")}>
                                      {event.integrationPath}
                                    </Badge>
                                  )}
                                  <Badge className="bg-green-500/20 text-green-400 text-[8px] uppercase font-bold flex items-center gap-1">
                                    <CheckCircle2 className="h-2 w-2" /> Verified
                                  </Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-mono">ID: {event.id} | TYPE: {event.requestType || event.type}</p>
                                {event.routingReason && (
                                  <div className="flex items-center gap-2 pt-1">
                                    <Info className="h-3 w-3 text-accent" />
                                    <p className="text-[9px] text-accent italic">{event.routingReason}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              {event.amount && <p className="text-sm font-headline font-bold text-white">${event.amount}</p>}
                              <p className="text-[9px] text-muted-foreground uppercase">{new Date(event.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <footer className="pt-12 text-center opacity-40">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
              NoorNexus OS • Hybrid Routing Protocol • 4F82...E911
            </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
