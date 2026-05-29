
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Rocket, 
  Zap, 
  ShieldAlert, 
  BarChart3, 
  BrainCircuit, 
  Briefcase,
  ChevronRight,
  Activity,
  Cpu,
  RefreshCw,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function DigitalBoardroom() {
  const [isSimulating, setIsSimulating] = useState(false);

  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2500);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold">Sovereign Executive Boardroom</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-accent border-accent/20">
              <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Institutional Memory: Syncing
            </Badge>
            <Button size="sm" onClick={triggerSimulation} className="cyan-glow text-xs font-bold bg-accent hover:bg-accent/90" disabled={isSimulating}>
              <Cpu className={`mr-1 h-3 w-3 ${isSimulating ? 'animate-pulse' : ''}`} /> 
              {isSimulating ? "Simulating Strategy..." : "Strategic Simulation"}
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto w-full">
          {/* Sovereign Enterprise KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Operating Cash Flow", value: "$4.18M", trend: "+8.4%", icon: DollarSign, detail: "Burn Rate: -12% (Optimized)" },
              { label: "Enterprise Value Index", value: "114.2", trend: "+4.1", icon: TrendingUp, isGood: true, detail: "Projected Q4: 121.5" },
              { label: "Operational Efficiency", value: "94.2%", trend: "+2.1%", icon: Activity, isGood: true, detail: "Bottleneck: Logistics (Low)" },
              { label: "Strategic Risk Score", value: "18/100", trend: "-2", icon: ShieldAlert, detail: "Threat Level: Negligible" },
            ].map((stat, i) => (
              <Card key={i} className="glass-panel border-white/5 hover:border-accent/20 transition-all shadow-xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-bold">{stat.label}</p>
                      <h3 className="text-3xl font-headline font-bold">{stat.value}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1">{stat.detail}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1">
                    <span className={`text-xs font-bold ${stat.isGood ? 'text-green-400' : 'text-primary'}`}>
                      {stat.trend}
                    </span>
                    <span className="text-[10px] text-muted-foreground">vs baseline</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Digital Twin & Forecasting */}
            <div className="xl:col-span-2 space-y-8">
              <Card className="glass-panel overflow-hidden border-l-4 border-l-accent">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-accent" />
                      Organizational Digital Twin
                    </CardTitle>
                    <CardDescription>Real-time simulation of strategic and operational outcomes</CardDescription>
                  </div>
                  <Badge className="bg-accent/20 text-accent">Consensus: 92%</Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-widest">Scenario A</p>
                      <p className="text-sm font-bold text-white">Aggressive Expansion</p>
                      <p className="text-xs text-green-400 mt-2">+24% Rev / -15% Margin</p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center ring-2 ring-accent/30">
                      <p className="text-[10px] text-accent uppercase font-bold mb-1 tracking-widest">Recommended</p>
                      <p className="text-sm font-bold text-white">Efficiency Pivot</p>
                      <p className="text-xs text-green-400 mt-2">+12% Rev / +8% Margin</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-widest">Scenario C</p>
                      <p className="text-sm font-bold text-white">Defensive Holding</p>
                      <p className="text-xs text-red-400 mt-2">-2% Rev / +12% Margin</p>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <PerformanceChart />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-red-400" />
                      Risk Observatory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { title: "Market Volatility", risk: "Medium", trend: "Rising" },
                      { title: "Operational Drift", risk: "Low", trend: "Stable" },
                      { title: "Financial Variance", risk: "Low", trend: "Declining" }
                    ].map((risk, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/20 border border-white/5">
                        <span className="text-xs font-bold text-white">{risk.title}</span>
                        <Badge variant="outline" className="text-[9px]">{risk.risk} Risk</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Executive Initiatives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>Project 'Sovereign-1' (AI Integration)</span>
                        <span>78%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>Fiscal Consolidation Q3</span>
                        <span>45%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '45%' }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Executive Council Collaboration */}
            <div className="space-y-6">
              <Card className="glass-panel bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-accent" />
                    Sovereign AI Council
                  </CardTitle>
                  <CardDescription>Consensus-based intelligence Advisory</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Sovereign Strategy Agent", role: "CEO Advisor", status: "Simulating", color: "text-accent" },
                    { name: "Financial Intelligence Agent", role: "CFO Advisor", status: "Forecasting", color: "text-primary" },
                    { name: "Operations Catalyst Agent", role: "COO Advisor", status: "Monitoring", color: "text-green-400" },
                    { name: "Governance & Risk Agent", role: "Compliance", status: "Auditing", color: "text-red-400" }
                  ].map((agent, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-white/5 flex items-center justify-between group hover:border-accent/30 transition-all cursor-pointer">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{agent.role}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] font-bold ${agent.color}`}>{agent.status}</p>
                        <div className="flex gap-1 mt-1 justify-end">
                          <div className={`w-1 h-1 rounded-full bg-current ${agent.status !== 'Idle' ? 'animate-pulse' : ''} ${agent.color}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-xs font-bold border-accent/20 text-accent hover:bg-accent hover:text-background transition-colors" asChild>
                    <Link href="/agents">Executive Council Hub <ChevronRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    Institutional Memory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-secondary/30 text-xs leading-relaxed italic">
                    "AI Advisory: Based on 2018 historical drift data and current Q2 burn, an 8% reallocation to OpEx is recommended to stabilize expansion."
                  </div>
                  <Button variant="ghost" className="w-full text-[10px] h-7 text-muted-foreground hover:text-white border border-white/5">
                    Search Knowledge Base
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
