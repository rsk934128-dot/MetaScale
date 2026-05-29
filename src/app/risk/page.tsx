
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
  Network
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Area,
  AreaChart,
  CartesianGrid
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const trustTrendData = [
  { time: "09:00", score: 88 },
  { time: "10:00", score: 85 },
  { time: "11:00", score: 72 }, 
  { time: "12:00", score: 74 },
  { time: "13:00", score: 75 },
];

export default function RiskObservatory() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              Regulated Financial Trust Fabric
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Network Consensus</p>
                <p className="text-sm font-bold text-green-400">Validated</p>
             </div>
             <Badge variant="outline" className="border-red-400/20 text-red-400 animate-pulse">
                <Lock className="mr-1 h-3 w-3" /> Adaptive Enforcement Active
             </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Continuous Trust Intelligence</h2>
              <p className="text-muted-foreground">Real-time trust scoring and adaptive risk enforcement across the enterprise fabric.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-b-4 border-b-accent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Fingerprint className="h-12 w-12" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Unified Trust Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">75.4</div>
                <div className="flex items-center gap-1 text-red-400 text-xs font-bold mt-1">
                  <TrendingUp className="h-3 w-3 rotate-180" /> -12.4% Drift Detected
                </div>
              </CardContent>
            </Card>

            {[
              { label: "Identity Risk", value: 12, status: "Low", color: "bg-green-500" },
              { label: "Financial Risk", value: 45, status: "Moderate", color: "bg-yellow-500" },
              { label: "Network Propagation", value: 68, status: "High", color: "bg-red-500" },
            ].map((dim, i) => (
              <Card key={i} className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground">{dim.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-white">{dim.value}%</span>
                    <Badge variant="outline" className="text-[9px] mb-1">{dim.status}</Badge>
                  </div>
                  <Progress value={dim.value} className={`h-1 ${dim.status === 'High' ? '[&>div]:bg-red-500' : ''}`} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <Card className="xl:col-span-2 glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent" />
                    Real-time Trust Velocity
                  </CardTitle>
                  <CardDescription>Continuous assessment of organizational integrity signals.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trustTrendData}>
                        <defs>
                          <linearGradient id="trustGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={3} 
                          fill="url(#trustGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Network className="h-4 w-4 text-accent" />
                    Network Propagation Risk
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 space-y-2">
                      <p className="text-[11px] font-bold text-red-400 uppercase">External Exposure Detected</p>
                      <p className="text-[10px] text-muted-foreground">Node 'Subsidiary-BD' trust score dropped to 42.1. Connected settlement corridors are being downgraded to prevent systemic contagion.</p>
                   </div>
                   {[
                     { area: "Corridor: Rubelpay → UK", risk: "Low", msg: "Stable" },
                     { area: "Corridor: Rubelpay → BD", risk: "Critical", msg: "Cascading Block" }
                   ].map((item, i) => (
                     <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-white">{item.area}</span>
                           <Badge className={item.risk === 'Low' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                             {item.risk} Risk
                           </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{item.msg}</p>
                     </div>
                   ))}
                </CardContent>
              </Card>
          </div>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-sm">Global Trust Ledger (Immutable)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "16:45:00", trigger: "Propagation Engine", node: "Sub-BD", action: "CORRIDOR_SHUTDOWN", reason: "Entity drift exceeded threshold for connected node." },
                  { time: "14:20:05", trigger: "Drift Engine", node: "Rubelpay", action: "SCORE_DOWNGRADE", reason: "License nearing expiry (Bangladesh) detected in vault." },
                  { time: "12:05:12", trigger: "Identity Sync", node: "Farid Sheikh", action: "IDENTITY_VALIDATED", reason: "UBO Farid Sheikh identity proof validated." }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 border-b border-white/5 last:border-0 items-center">
                    <div className="text-[10px] font-mono text-muted-foreground w-20">{log.time}</div>
                    <div className="flex-1">
                      <p className="text-xs text-white/90">{log.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[8px] uppercase">{log.trigger}</Badge>
                        <Badge variant="secondary" className="text-[8px] font-mono">{log.action}</Badge>
                        <span className="text-[10px] text-muted-foreground italic">Node: {log.node}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
}
