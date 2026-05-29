"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { 
  ArrowUpRight, 
  Target, 
  Zap, 
  Globe,
  TrendingUp,
  AlertTriangle,
  BrainCircuit,
  ChevronRight,
  Database,
  BarChart3,
  Rocket,
  ShieldAlert,
  Lightbulb,
  DollarSign,
  Users,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold">EGIOS Executive Command Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-accent border-accent/20">
              <Rocket className="mr-1 h-3 w-3" /> Multi-Agent Ops: Active
            </Badge>
            <Button size="sm" className="cyan-glow text-xs font-bold bg-accent hover:bg-accent/90">
              <Zap className="mr-1 h-3 w-3" /> Strategic Audit
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto w-full">
          {/* Executive Growth KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Projected Revenue", value: "$2.42M", trend: "+14.2%", icon: DollarSign, detail: "Q4 Forecast (92% Conf.)" },
              { label: "LTV / CAC Ratio", value: "4.8x", trend: "+0.4x", icon: TrendingUp, isGood: true, detail: "Enterprise Efficiency Target: 3.5x" },
              { label: "Customer Health Index", value: "88/100", trend: "+2.1%", icon: Users, isGood: true, detail: "Churn Risk: 4.2% (Low)" },
              { label: "Strategic Objectives", value: "85%", trend: "3/4", icon: Target, detail: "Annual Milestone Progress" },
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
            {/* Global Intelligence War Room */}
            <div className="xl:col-span-2 space-y-8">
              <Card className="glass-panel overflow-hidden border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-red-400" />
                      Growth War Room: Predictive Intelligence
                    </CardTitle>
                    <CardDescription>Synthesized revenue risks and market opportunities</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-red-400/5 border border-red-400/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-red-400 tracking-widest">Revenue Risks</h4>
                        <Badge variant="destructive" className="text-[10px]">Critical</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="text-xs bg-red-400/10 p-3 rounded border border-red-400/10">
                          <p className="font-bold">Pipeline Attrition (Tier 2)</p>
                          <p className="text-muted-foreground text-[10px] mt-1">15% drop in MQL to SQL conversion. Forecast impact: -$200k.</p>
                        </div>
                        <div className="text-xs bg-red-400/10 p-3 rounded border border-red-400/10 opacity-70">
                          <p className="font-bold">Churn Spike Prediction</p>
                          <p className="text-muted-foreground text-[10px] mt-1">Usage drop in 'Enterprise Pro' accounts detected.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-xl bg-accent/5 border border-accent/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-accent tracking-widest">Growth Levers</h4>
                        <Badge variant="outline" className="text-[10px] text-accent border-accent/20">5 Active</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="text-xs bg-accent/10 p-3 rounded border border-accent/10">
                          <p className="font-bold text-accent">Upsell Potential: mid-market</p>
                          <p className="text-muted-foreground text-[10px] mt-1">AI detected 12 accounts exceeding seat limits. Est. Rev: +$45k.</p>
                        </div>
                        <div className="text-xs bg-accent/10 p-3 rounded border border-accent/10 opacity-70">
                          <p className="font-bold text-accent">Market Gap: APAC SaaS</p>
                          <p className="text-muted-foreground text-[10px] mt-1">Competitor outage detected. Launch aggressive conquesting.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Revenue & Pipeline Velocity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart />
                </CardContent>
              </Card>
            </div>

            {/* Enterprise Multi-Agent Collaboration */}
            <div className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-accent" />
                    Autonomous Board Agents
                  </CardTitle>
                  <CardDescription>Collaborative intelligence execution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Executive Advisor Agent", role: "Strategy", status: "Simulating", color: "text-accent" },
                    { name: "Revenue Ops Agent", role: "Sales Analytics", status: "Forecasting", color: "text-primary" },
                    { name: "Customer Intelligence Agent", role: "Retention", status: "Executing", color: "text-green-400" },
                    { name: "Market Research Agent", role: "Competition", status: "Idle", color: "text-muted-foreground" }
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
                    <Link href="/agents">Agent Hub <ChevronRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel bg-secondary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-3 w-3" />
                    Corporate Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>Market Share Expansion</span>
                      <span>82%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '82%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>EBITDA Margin Target</span>
                      <span>65%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '65%' }} />
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
