
"use client";

import { useState, useMemo, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Download, 
  Cloud, 
  Activity, 
  ShieldAlert, 
  Bell, 
  Database,
  Unplug,
  Globe,
  Terminal,
  Server,
  Lock,
  Loader2,
  Trash2,
  Eye,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function UBILIntegrationPage() {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simPreset, setSimPreset] = useState("Txn Success");
  const [simAmount, setSimAmount] = useState("25000.00");
  const [simBank, setSimBank] = useState("Brac Bank");
  const [isSignatureValid, setIsSignatureValid] = useState(true);
  const [logs, setLogs] = useState<string[]>(["UBIL Core: Webhook Node online, listening..."]);
  const { toast } = useToast();
  const firestore = useFirestore();

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ubil_events'), orderBy('timestamp', 'desc'), limit(50));
  }, [firestore]);

  const { data: remoteEvents, loading } = useCollection<any>(eventsQuery);

  const handleCopy = () => {
    navigator.clipboard.writeText("noornexus_ubil_secret_2026");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Secret Copied", description: "Shared secret key saved to clipboard." });
  };

  const dispatchSimulation = async () => {
    setIsSimulating(true);
    const eventId = `UBIL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = Date.now();
    
    const newLog = `>>> INCOMING WEBHOOK: [${simPreset}] FROM ${simBank}`;
    setLogs(prev => [newLog, ...prev].slice(0, 5));

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
      timestamp: timestamp,
      payload: { raw: "..." }
    };

    if (firestore) {
      await setDoc(doc(firestore, 'ubil_events', eventId), eventData);
    }

    setTimeout(() => {
      setIsSimulating(false);
      if (isSignatureValid) {
        toast({ title: "DISPATCH SUCCESS", description: "Transaction validated via HMAC-SHA256." });
      } else {
        toast({ variant: "destructive", title: "SECURITY BLOCK", description: "Invalid signature detected. Connection severed." });
      }
    }, 1500);
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
              Sovereign OS <span className="text-accent">CORE LIVE</span>
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase">
            NoorNexus UBIL Webhook Integration
          </Badge>
        </header>

        <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <Card className="glass-panel border-l-4 border-l-accent p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Listener</p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-xl font-bold">Active</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">Port 3000</p>
             </Card>
             <Card className="glass-panel border-l-4 border-l-primary p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Security</p>
                <div className="flex items-center gap-2 mt-1">
                   <ShieldCheck className="h-5 w-5 text-primary" />
                   <span className="text-xl font-bold">Active</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">HMAC-SHA256</p>
             </Card>
             <Card className="glass-panel border-l-4 border-l-yellow-500 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">G-Drive Backup</p>
                <div className="flex items-center gap-2 mt-1">
                   <Cloud className="h-5 w-5 text-yellow-500" />
                   <span className="text-xl font-bold">Pending</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">Sovereign OS</p>
             </Card>
             <Card className="glass-panel border-l-4 border-l-blue-400 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Local Audit</p>
                <div className="flex items-center gap-2 mt-1">
                   <Database className="h-5 w-5 text-blue-400" />
                   <span className="text-xl font-bold">{remoteEvents?.length || 0} Nodes</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">SOVEREIGN DRIVE</p>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* Left Column: Config & Simulator */}
             <div className="lg:col-span-4 space-y-6">
                <Card className="glass-panel border-accent/20">
                   <CardHeader className="p-4">
                      <CardTitle className="text-xs uppercase flex items-center gap-2">
                         <Lock className="h-4 w-4 text-accent" />
                         HMAC-SHA256 Shared Secret
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 pt-0 space-y-4">
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                         <span className="text-xs font-mono text-accent">noornexus_ubil_secret_2026</span>
                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                         </Button>
                      </div>
                      <p className="text-[9px] text-muted-foreground italic leading-relaxed">
                         Provide this key to banking platforms (e.g., Brac, City, or standard merchant gateways) to calculate the HMAC SHA-256 hash of their JSON request payload.
                      </p>
                   </CardContent>
                </Card>

                <Card className="glass-panel">
                   <CardHeader className="p-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs uppercase">Notification Engine</CardTitle>
                      <span className="text-[9px] font-mono opacity-50">rubels1k994@gmail.com</span>
                   </CardHeader>
                   <CardContent className="p-4 pt-0 space-y-4">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between text-[11px]">
                            <span className="text-white/80 font-bold uppercase tracking-tighter flex items-center gap-2"><Mail className="h-3 w-3" /> Email Relay</span>
                            <Switch defaultChecked />
                         </div>
                         <div className="flex items-center justify-between text-[11px]">
                            <span className="text-white/80 font-bold uppercase tracking-tighter flex items-center gap-2"><ShieldAlert className="h-3 w-3" /> AuthFailed Warnings</span>
                            <Switch defaultChecked />
                         </div>
                         <div className="flex items-center justify-between text-[11px]">
                            <span className="text-white/80 font-bold uppercase tracking-tighter flex items-center gap-2"><Activity className="h-3 w-3" /> High-Value Trans Alerts</span>
                            <Switch defaultChecked />
                         </div>
                      </div>
                      <div className="pt-2 space-y-3">
                         <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span className="text-accent">Alert Threshold</span>
                            <span>5,000 Units</span>
                         </div>
                         <Slider defaultValue={[5000]} max={25000} step={1000} className="[&>span]:bg-accent" />
                         <div className="flex justify-between text-[8px] font-mono opacity-40">
                            <span>1k</span><span>5k</span><span>10k</span><span>25k</span>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                <Card className="glass-panel border-accent/20 bg-accent/5">
                   <CardHeader className="p-4 border-b border-white/5">
                      <CardTitle className="text-xs uppercase flex items-center gap-2">
                         <Zap className="h-4 w-4 text-accent" />
                         Interactive Webhook Simulator
                      </CardTitle>
                      <CardDescription className="text-[10px]">Local Simulator Node</CardDescription>
                   </CardHeader>
                   <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                         <Label className="text-[9px] uppercase font-bold text-muted-foreground">Select Banking Event Preset</Label>
                         <div className="grid grid-cols-3 gap-1">
                            {["Txn Success", "Bal Update", "Auth Failed"].map(p => (
                               <Button 
                                 key={p} 
                                 variant={simPreset === p ? "default" : "outline"}
                                 className="h-8 text-[9px] p-0"
                                 onClick={() => setSimPreset(p)}
                               >
                                  {p}
                               </Button>
                            ))}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <Label className="text-[9px] uppercase">Transaction Amount</Label>
                            <Input value={simAmount} onChange={e => setSimAmount(e.target.value)} className="h-9 bg-secondary/30 text-xs" />
                         </div>
                         <div className="space-y-1">
                            <Label className="text-[9px] uppercase">Currency</Label>
                            <Input defaultValue="BDT" readOnly className="h-9 bg-secondary/30 text-xs opacity-50" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <Label className="text-[9px] uppercase">Sender Bank</Label>
                            <Input value={simBank} onChange={e => setSimBank(e.target.value)} className="h-9 bg-secondary/30 text-xs" />
                         </div>
                         <div className="space-y-1">
                            <Label className="text-[9px] uppercase">Account Number</Label>
                            <Input defaultValue="120.291.839" className="h-9 bg-secondary/30 text-xs" />
                         </div>
                      </div>

                      <div className="space-y-2 pt-2">
                         <Label className="text-[9px] uppercase font-bold text-muted-foreground">Signature Security Options</Label>
                         <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              className={cn("w-full h-10 justify-between text-[10px] font-bold border-white/5", isSignatureValid && "border-accent/40 bg-accent/5")}
                              onClick={() => setIsSignatureValid(true)}
                            >
                               <div className="flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-green-400" />
                                  <span>Authentic Node</span>
                               </div>
                               <span className="text-[8px] opacity-40">Signs with valid secret key</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              className={cn("w-full h-10 justify-between text-[10px] font-bold border-white/5", !isSignatureValid && "border-red-500/40 bg-red-500/5")}
                              onClick={() => setIsSignatureValid(false)}
                            >
                               <div className="flex items-center gap-2">
                                  <ShieldAlert className="h-4 w-4 text-red-400" />
                                  <span>Signature Hack</span>
                               </div>
                               <span className="text-[8px] opacity-40">Simulates corrupt header</span>
                            </Button>
                         </div>
                      </div>

                      <Button 
                        className="w-full h-12 bg-accent text-background font-bold uppercase text-[10px] tracking-widest cyan-glow"
                        onClick={dispatchSimulation}
                        disabled={isSimulating}
                      >
                         {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Dispatch Simulated Transaction"}
                      </Button>
                   </CardContent>
                </Card>
             </div>

             {/* Right Column: Metrics & Ledger */}
             <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="glass-panel">
                      <CardHeader className="p-4 border-b border-white/5">
                         <CardTitle className="text-xs uppercase">24h Webhook Event Distribution</CardTitle>
                         <CardDescription className="text-[9px]">Live metrics and signature-verified gateway distribution</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col items-center">
                         <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                               <PieChart>
                                  <Pie
                                    data={PIE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {PIE_DATA.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{ background: '#13151a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }} 
                                    itemStyle={{ color: '#fff' }}
                                  />
                               </PieChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="grid grid-cols-3 w-full gap-2 text-center mt-4">
                            {PIE_DATA.map(d => (
                               <div key={d.name} className="space-y-1">
                                  <p className="text-[10px] font-bold text-white">{d.name}</p>
                                  <p className="text-xl font-headline font-bold" style={{ color: d.color }}>{d.value}</p>
                               </div>
                            ))}
                         </div>
                      </CardContent>
                   </Card>

                   <Card className="glass-panel">
                      <CardHeader className="p-4 border-b border-white/5">
                         <CardTitle className="text-xs uppercase">12h Traffic Frequency Timeline</CardTitle>
                         <CardDescription className="text-[9px]">Identifies data ingest spikes, throughput limits, and security blockades</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                         <div className="h-[200px] w-full mt-4">
                            <ChartContainer config={chartConfig}>
                               <AreaChart data={TRAFFIC_DATA}>
                                  <defs>
                                     <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                     </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} />
                                  <Tooltip content={<ChartTooltipContent />} />
                                  <Area type="monotone" dataKey="success" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#successGradient)" />
                                  <Area type="monotone" dataKey="blocked" stroke="hsl(var(--destructive))" strokeWidth={1} fill="transparent" strokeDasharray="5 5" />
                               </AreaChart>
                            </ChartContainer>
                         </div>
                         <div className="flex justify-between items-center mt-6 px-4">
                            <div className="text-center">
                               <p className="text-[8px] font-bold text-muted-foreground uppercase">Total</p>
                               <p className="text-xl font-bold">48</p>
                            </div>
                            <div className="text-center">
                               <p className="text-[8px] font-bold text-muted-foreground uppercase">Success</p>
                               <p className="text-xl font-bold text-accent">91.7%</p>
                            </div>
                            <div className="text-center">
                               <p className="text-[8px] font-bold text-muted-foreground uppercase">Blocked</p>
                               <p className="text-xl font-bold text-red-400">8.3%</p>
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                </div>

                <Card className="glass-panel border-white/5">
                   <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
                      <div>
                         <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2 text-white italic">
                            <Database className="h-4 w-4 text-accent" />
                            UBIL Audit Ledger Trail
                         </CardTitle>
                         <CardDescription className="text-[10px]">Real-time incoming payloads from secure webhooks</CardDescription>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-white/10 uppercase"><Download className="mr-1.5 h-3 w-3" /> Export CSV</Button>
                      </div>
                   </CardHeader>
                   <CardContent className="p-0">
                      <div className="p-4 border-b border-white/5 flex gap-4">
                         <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input 
                              placeholder="Search by sender, bank, A/C or ID..." 
                              className="pl-9 h-9 bg-secondary/30 border-white/5 text-[11px]"
                              value={search}
                              onChange={e => setSearch(e.target.value)}
                            />
                         </div>
                         <Button variant="outline" size="sm" className="h-9 w-9 border-white/5"><Filter className="h-4 w-4" /></Button>
                      </div>
                      <ScrollArea className="h-[400px]">
                         {loading ? (
                           <div className="p-20 flex flex-col items-center gap-4 opacity-40">
                              <Loader2 className="h-8 w-8 animate-spin text-accent" />
                              <p className="text-[9px] font-bold uppercase tracking-widest">Accessing Secure Vault...</p>
                           </div>
                         ) : filteredEvents.length === 0 ? (
                           <div className="p-20 text-center space-y-4 opacity-30">
                              <Unplug className="h-12 w-12 mx-auto" />
                              <p className="text-xs italic">UBIL Core: Webhook Node online, listening...</p>
                           </div>
                         ) : (
                           <div className="divide-y divide-white/5">
                              {filteredEvents.map((event) => (
                                 <div key={event.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-all group">
                                    <div className="flex gap-4">
                                       <div className={cn(
                                         "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                                         event.status === 'SUCCESS' ? "bg-accent/10 border-accent/20 text-accent" : "bg-red-500/10 border-red-500/20 text-red-400"
                                       )}>
                                          {event.type === 'AUTH_FAILED' ? <ShieldAlert className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                                       </div>
                                       <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                             <span className="text-[11px] font-bold text-white uppercase">{event.senderName}</span>
                                             <Badge variant="outline" className="text-[8px] font-mono border-white/10 uppercase">{event.senderBank}</Badge>
                                             <Badge className={cn(
                                               "text-[8px] font-bold uppercase",
                                               event.status === 'SUCCESS' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                             )}>
                                               {event.status}
                                             </Badge>
                                          </div>
                                          <p className="text-[10px] text-muted-foreground font-mono">ID: {event.id} | AC: {event.accountNumber} | SIG: {event.signatureStatus}</p>
                                          <p className="text-[9px] text-muted-foreground uppercase">{new Date(event.timestamp).toLocaleString()}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="text-right">
                                          <p className="text-sm font-headline font-bold text-white">${event.amount.toLocaleString()}</p>
                                          <p className="text-[9px] text-muted-foreground uppercase">{event.currency}</p>
                                       </div>
                                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Eye className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                         )}
                      </ScrollArea>
                   </CardContent>
                </Card>

                {/* Log Console & Footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                   <div className="md:col-span-2 p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] space-y-2 relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-white/20"><Terminal className="h-4 w-4" /></div>
                      <p className="text-accent uppercase font-bold">OS LOG CONSOLE:</p>
                      {logs.map((log, i) => (
                        <p key={i} className="text-white/60 animate-fade-in">&gt; {log}</p>
                      ))}
                      <div className="flex items-center gap-2 text-yellow-500/60 pt-2 animate-pulse">
                         <AlertTriangle className="h-3 w-3" />
                         <span>OAuth Pipeline offline. Authenticate with Google to connect Drive.</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-xl bg-secondary/10 text-center space-y-4">
                      <Cloud className="h-10 w-10 text-muted-foreground opacity-20" />
                      <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest border-accent/30 text-accent">Authorize Cloud</Button>
                   </div>
                </div>
             </div>
          </div>

          <footer className="pt-12 text-center border-t border-white/5 space-y-2 opacity-40">
             <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
                NoorNexus Sovereign OS • Powered by Google Cloud
             </p>
             <div className="flex items-center justify-center gap-4 text-[8px] font-mono">
                <span>SHA-256: 4F82...E911</span>
                <span>•</span>
                <span>NODE: UK-04-ANYCAST</span>
                <span>•</span>
                <span>Uptime: 99.99%</span>
             </div>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
