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
  RefreshCw,
  Search,
  Filter,
  Scale,
  Globe,
  ArrowUpRight,
  ShieldAlert,
  Cpu
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
  { time: "00:00", micro: 88, meso: 82, macro: 90 },
  { time: "04:00", micro: 86, meso: 80, macro: 88 },
  { time: "08:00", micro: 92, meso: 85, macro: 91 },
  { time: "12:00", micro: 89, meso: 84, macro: 89 },
  { time: "16:00", micro: 94, meso: 88, macro: 92 },
  { time: "20:00", micro: 95, meso: 90, macro: 94 },
];

export default function CivilizationEconomyPage() {
  const [isSimulating, setIsSimulating] = useState(false);

  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Sovereign Economic Governance (SEG-MLC)
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-accent/20 text-accent">
              <ShieldCheck className="mr-1 h-3 w-3" /> Civilization Status: Stable
            </Badge>
            <Button size="sm" onClick={triggerSimulation} disabled={isSimulating} className="cyan-glow text-xs font-bold">
              {isSimulating ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Cpu className="h-3 w-3 mr-1" />}
              Run Policy Simulation
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Civilization Economic Intelligence</h2>
              <p className="text-muted-foreground">Managing multi-layer stability, policy enforcement, and macro-economic diplomacy.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-muted-foreground">Macro Stability Index</p>
              <p className="text-4xl font-headline font-bold text-accent">94.2</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-l-4 border-l-blue-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Micro Layer (Entity)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">95.1</div>
                <p className="text-[10px] text-blue-400 mt-1 uppercase font-bold tracking-tighter">Utilization: Optimal</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Meso Layer (Network)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">88.4</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">12 Active Corridors</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Macro Layer (Global)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">94.2</div>
                <p className="text-[10px] text-accent mt-1 uppercase font-bold">Civilization Consensus</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Multi-Layer Stability Chart
                </CardTitle>
                <CardDescription>Real-time tracking of Micro, Meso, and Macro stability signals.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stabilityData}>
                      <defs>
                        <linearGradient id="macroGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="macro" stroke="hsl(var(--accent))" strokeWidth={3} fill="url(#macroGradient)" name="Macro Stability" />
                      <Area type="monotone" dataKey="meso" stroke="hsl(var(--primary))" strokeWidth={2} fill="transparent" name="Meso Stability" />
                      <Area type="monotone" dataKey="micro" stroke="#60a5fa" strokeWidth={2} fill="transparent" name="Micro Stability" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Scale className="h-4 w-4 text-accent" />
                    Policy Simulator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                    <p className="text-[11px] font-bold text-accent uppercase">Scenario: Credit Expansion</p>
                    <p className="text-[10px] text-muted-foreground">"Expansion in Micro layer predicted to increase Macro instability by 4% due to Trust Inflation risk."</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span>Trust Inflation Risk</span>
                      <span className="text-yellow-400">Moderate</span>
                    </div>
                    <Progress value={45} className="h-1" />
                  </div>
                  <Button className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                    Analyze Policy Impact
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-400" />
                    Economic Shock Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   <div className="p-2 rounded bg-red-500/5 border border-red-500/20 text-[10px] text-red-400 font-bold">
                     AUTO-THROTTLE: UK Corridor Congested
                   </div>
                   <div className="space-y-2 pt-2">
                     <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Active Stabilizers</p>
                     {[
                       { label: "Liquidity Redistribution", status: "Active" },
                       { label: "Corridor Rerouting", status: "Standby" },
                       { label: "Credit Throttling", status: "Active" }
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                          <span className="text-[10px]">{item.label}</span>
                          <Badge variant="outline" className="text-[8px] bg-accent/10">{item.status}</Badge>
                       </div>
                     ))}
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
