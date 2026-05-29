
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Coins, 
  TrendingUp, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Network, 
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

const stabilityData = [
  { time: "00:00", index: 88 },
  { time: "04:00", index: 86 },
  { time: "08:00", index: 92 },
  { time: "12:00", index: 89 },
  { time: "16:00", index: 94 },
  { time: "20:00", index: 95 },
];

export default function TrustEconomyPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerRebalance = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Coins className="h-5 w-5 text-accent" />
              Autonomous Global Trust Economy (AGTEL)
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-green-400/20 text-green-400">
              <ShieldCheck className="mr-1 h-3 w-3" /> Systemic Stability: Optimal
            </Badge>
            <Button size="sm" onClick={triggerRebalance} disabled={isSyncing} className="cyan-glow text-xs font-bold">
              {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
              Re-Balance Liquidity
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Network Economic Health</h2>
              <p className="text-muted-foreground">Monitoring trust-to-liquidity conversion, autonomous routing, and systemic risk containment.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-muted-foreground">Trust Market Index</p>
              <p className="text-4xl font-headline font-bold text-accent">92.4</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Total Credit Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$4.2M</div>
                <p className="text-[10px] text-accent mt-1 uppercase font-bold tracking-tighter">Utilization: 14%</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Settlement Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0.4s</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">Avg across 12 corridors</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Liquidity Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98.2%</div>
                <p className="text-[10px] text-green-400 mt-1 uppercase font-bold">Optimal Distribution</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Concentration Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Low</div>
                <p className="text-[10px] text-red-400 mt-1 uppercase font-bold">No single point of failure</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Global Stability Index
                </CardTitle>
                <CardDescription>Real-time autonomous network health monitoring.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stabilityData}>
                      <defs>
                        <linearGradient id="stabilityGradient" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="index" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={3} 
                        fill="url(#stabilityGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    Liquidity Router
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                    <p className="text-[11px] font-bold text-accent uppercase">Autonomous Re-Routing Active</p>
                    <p className="text-[10px] text-muted-foreground">"Subsidiary-BD corridor is congested. Re-routing high-priority settlements through Vendor-UK Prime Path."</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span>Network Throughput</span>
                      <span>84%</span>
                    </div>
                    <Progress value={84} className="h-1" />
                  </div>
                  <Button className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                    Optimize Routing Paths
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    Economic Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   {[
                     { label: "Prime Liquidity Tier", value: "72%", color: "text-green-400" },
                     { label: "Restricted Capacity", value: "18%", color: "text-yellow-400" },
                     { label: "Escrow Locked", value: "10%", color: "text-red-400" }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</span>
                        <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                     </div>
                   ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-sm">Economic Event Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "22:15:00", action: "CREDIT_EXPANSION", target: "Vendor-UK", reason: "Trust score increased to 88. Prime Liquidity Tier unlocked." },
                  { time: "21:30:12", action: "CORRIDOR_THROTTLE", target: "Sub-BD", reason: "Autonomous detection of settlement latency spikes. Throttling throughput by 40%." },
                  { time: "20:05:45", action: "SYSTEM_STABILIZATION", target: "Global", reason: "Liquidity redistribution triggered to balance network concentration." }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 border-b border-white/5 last:border-0 items-center">
                    <div className="text-[10px] font-mono text-muted-foreground w-24">{log.time}</div>
                    <div className="flex-1">
                      <p className="text-xs text-white/90">{log.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[8px] uppercase">{log.action}</Badge>
                        <span className="text-[10px] text-muted-foreground italic">Target: {log.target}</span>
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
