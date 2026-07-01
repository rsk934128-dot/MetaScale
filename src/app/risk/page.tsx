
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Lock, 
  Scale, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3,
  Fingerprint,
  Zap,
  AlertTriangle,
  Network,
  Radar,
  Eye,
  ServerCrash,
  UserX,
  BrainCircuit,
  Search,
  RefreshCw,
  Loader2,
  ShieldHalf,
  ShieldAlert as ShieldAlertIcon,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Area,
  AreaChart,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useFirestore, useCollection } from "@/firebase";
import { useMemo, useState } from "react";
import { collection, query, orderBy, limit, where } from "firebase/firestore";
import { cn } from "@/lib/utils";

const trustTrendData = [
  { time: "09:00", score: 88, threats: 4 },
  { time: "10:00", score: 85, threats: 12 },
  { time: "11:00", score: 72, threats: 45 }, 
  { time: "12:00", score: 74, threats: 28 },
  { time: "13:00", score: 75, threats: 18 },
];

const chartConfig = {
  score: {
    label: "Trust Score",
    color: "hsl(var(--accent))",
  },
  threats: {
    label: "Threats",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export default function SecurityIntelligence() {
  const firestore = useFirestore();
  const [isScanning, setIsScanning] = useState(false);

  // Live Anomaly Sync
  const anomaliesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'events'), 
      where('category', '==', 'PREDICTIVE_ANOMALY'),
      orderBy('timestamp', 'desc'), 
      limit(10)
    );
  }, [firestore]);

  const { data: liveAnomalies, loading } = useCollection<any>(anomaliesQuery);

  const handleDeepScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-red-400">
              <ShieldAlert className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
              <span className="truncate">Sovereign Hunter Mode</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
                size="sm" 
                variant="outline" 
                className="border-accent/20 text-accent font-bold text-[10px] h-8"
                onClick={handleDeepScan}
                disabled={isScanning}
            >
                {isScanning ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Sparkles className="h-3 w-3 mr-1.5" />}
                Hunter Scan
            </Button>
            <Badge variant="destructive" className="animate-pulse bg-red-500/20 text-red-400 text-[8px] md:text-[10px] shrink-0">
                ACTIVE_HUNT
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-6 md:space-y-8">
          {/* Proactive Hunter Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="lg:col-span-2 glass-panel border-l-4 border-l-accent bg-accent/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-5"><BrainCircuit className="h-32 w-32" /></div>
                <CardHeader>
                   <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2 text-accent">
                      <Radar className="h-4 w-4" /> Predictive Anomaly Mesh
                   </CardTitle>
                   <CardDescription className="text-xs italic">Real-time behavior fingerprinting via Cognitive Layer Node-04.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                         <p className="text-[9px] uppercase font-bold text-muted-foreground">Detection Accuracy</p>
                         <p className="text-2xl font-headline font-bold text-white">99.2%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                         <p className="text-[9px] uppercase font-bold text-muted-foreground">Proactive Blocks</p>
                         <p className="text-2xl font-headline font-bold text-red-400">{liveAnomalies?.length || 0}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                         <p className="text-[9px] uppercase font-bold text-muted-foreground">Hunter Status</p>
                         <Badge className="bg-green-500/20 text-green-400 uppercase text-[8px] h-5 mt-1">Sovereign_OK</Badge>
                      </div>
                   </div>

                   <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                      <p className="text-[10px] text-accent font-bold uppercase mb-2">Cognitive Intelligence Report</p>
                      <p className="text-[11px] text-white/80 leading-relaxed italic border-l-2 border-accent/30 pl-4">
                        "The system is currently profile-matching 4,200 entities. Behavioral drift detection is set to STRICT mode due to high outbound velocity in Sector 7."
                      </p>
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-red-500/20 bg-red-500/5">
                <CardHeader>
                   <CardTitle className="text-xs flex items-center gap-2 uppercase text-red-400">
                      <ShieldAlertIcon className="h-4 w-4" /> Predictive Alerts
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-red-500/10 max-h-[300px] overflow-y-auto">
                      {liveAnomalies?.length === 0 ? (
                        <div className="p-12 text-center text-[10px] uppercase text-muted-foreground opacity-30 italic">No anomalies detected.</div>
                      ) : liveAnomalies?.map((a: any) => (
                        <div key={a.id} className="p-4 space-y-1.5 hover:bg-red-500/10 cursor-pointer transition-colors">
                           <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-red-400 uppercase">{a.payload?.category || 'ANOMALY'}</span>
                              <span className="text-[8px] font-mono text-muted-foreground">{new Date(a.timestamp).toLocaleTimeString()}</span>
                           </div>
                           <p className="text-[10px] text-white/90 leading-tight line-clamp-2 italic">"{a.payload?.reason}"</p>
                           <div className="flex justify-between items-center pt-1">
                              <Badge className="bg-red-500/20 text-red-400 text-[7px] uppercase h-4">Score: {a.payload?.riskScore}</Badge>
                              <span className="text-[7px] text-muted-foreground font-mono">ID: {a.payload?.paymentId?.substring(0, 10)}...</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="glass-panel border-b-4 border-b-accent">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Global Trust Index</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">82.4</div>
                <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-1">
                  <TrendingUp className="h-3 w-3" /> +4.2% stability
                </div>
              </CardContent>
            </Card>

            {[
              { label: "DDoS Deflect", value: 98, color: "bg-green-500", icon: ShieldCheck },
              { label: "Hunter Depth", value: 85, color: "bg-accent", icon: Eye },
              { label: "Identity Binding", value: 92, color: "bg-primary", icon: Fingerprint },
            ].map((dim, i) => (
              <Card key={i} className="glass-panel">
                <CardHeader className="pb-2 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">{dim.label}</CardTitle>
                    <dim.icon className="h-3 w-3 opacity-50" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="text-xl font-bold">{dim.value}%</div>
                  <Progress value={dim.value} className={cn("h-1", dim.color === 'bg-accent' ? '[&>div]:bg-accent' : dim.color === 'bg-green-500' ? '[&>div]:bg-green-500' : '[&>div]:bg-primary')} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
             <Card className="xl:col-span-2 glass-panel">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <Activity className="h-4 w-4 text-accent" />
                    Threat Vector Convergence
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="h-[250px] md:h-[350px] w-full">
                    <ChartContainer config={chartConfig}>
                      <AreaChart data={trustTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="score" stroke="hsl(var(--accent))" strokeWidth={2} fill="transparent" />
                        <Area type="monotone" dataKey="threats" stroke="hsl(var(--destructive))" strokeWidth={2} fill="transparent" />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="glass-panel border-red-500/20 bg-red-500/5">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xs flex items-center gap-2">
                      <Radar className="h-4 w-4 text-red-400" />
                      Containment Protocol
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                     <div className="p-3 rounded bg-black/20 border border-red-500/20 space-y-2">
                        <p className="text-[10px] font-bold text-red-400 uppercase">Active Isolation</p>
                        <p className="text-[9px] text-muted-foreground leading-relaxed">
                          Node: PROXY-DE-77 (Throttled)
                        </p>
                        <div className="flex gap-2">
                           <Button size="sm" className="h-7 text-[8px] bg-red-500 text-white flex-1">Isolate Node</Button>
                           <Button size="sm" variant="outline" className="h-7 text-[8px] flex-1">De-prioritize</Button>
                        </div>
                     </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-white/5">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xs flex items-center gap-2">
                      <ShieldHalf className="h-4 w-4 text-accent" />
                      Governance Guard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                      <span className="text-muted-foreground">Block Success</span>
                      <span className="text-white">100%</span>
                    </div>
                    <Progress value={100} className="h-0.5" />
                    <p className="text-[8px] text-muted-foreground italic mt-2">"Zero false-positives reported in Node-04."</p>
                  </CardContent>
                </Card>
              </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
