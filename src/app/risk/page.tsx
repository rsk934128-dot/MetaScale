
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
  AlertTriangle
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
  { time: "11:00", score: 72 }, // Drop due to license expiry
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
              { label: "Network Risk", value: 8, status: "Secure", color: "bg-green-500" },
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
                  <Progress value={dim.value} className="h-1" />
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
                    <Scale className="h-4 w-4 text-accent" />
                    Adaptive Enforcement Fabric
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {[
                     { area: "Full Authorization", eligible: false, msg: "Trust Score < 80 required", tier: "manual_review" },
                     { area: "Treasury Payouts", eligible: false, msg: "Entity Drift Triggered", tier: "hard_block" },
                     { area: "Operational Access", eligible: true, msg: "Compliant", tier: "full" }
                   ].map((item, i) => (
                     <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-white">{item.area}</span>
                           <Badge className={item.eligible ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}>
                             {item.eligible ? "Eligible" : "Restricted"}
                           </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{item.msg}</p>
                     </div>
                   ))}
                   <Button className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                     Simulate Trust Impact
                   </Button>
                </CardContent>
              </Card>
          </div>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-sm">Immutable Trust Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "14:20:05", trigger: "Drift Engine", before: 88.2, after: 75.4, reason: "License nearing expiry (Bangladesh) detected in vault." },
                  { time: "12:05:12", trigger: "Identity Sync", before: 87.5, after: 88.2, reason: "UBO Farid Sheikh identity proof validated." },
                  { time: "09:00:00", trigger: "System Re-eval", before: 87.5, after: 87.5, reason: "Daily trust re-normalization complete." }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 border-b border-white/5 last:border-0 items-center">
                    <div className="text-[10px] font-mono text-muted-foreground w-20">{log.time}</div>
                    <div className="flex-1">
                      <p className="text-xs text-white/90">{log.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[8px]">{log.trigger}</Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {log.before} → <span className={log.after < log.before ? 'text-red-400' : 'text-green-400'}>{log.after}</span>
                        </span>
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
