
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
  Lightbulb
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
            <h1 className="text-lg font-headline font-bold">AMOS Mission Control Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-accent border-accent/20">
              <Rocket className="mr-1 h-3 w-3" /> Agent Mode: Active
            </Badge>
            <Button size="sm" className="cyan-glow text-xs font-bold bg-accent hover:bg-accent/90">
              <Zap className="mr-1 h-3 w-3" /> Execute Global Audit
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto w-full">
          {/* Executive KPI Wall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Predictive Managed Spend", value: "$142,502", trend: "+5.2%", icon: Target, detail: "Meta, Google, TikTok" },
              { label: "Forecasted Revenue", value: "$524,900", trend: "+12.4%", icon: TrendingUp, isGood: true, detail: "Confidence Interval: 94%" },
              { label: "Autonomous Actions", value: "34", trend: "+8", icon: BrainCircuit, isGood: true, detail: "Successful optimizations this week" },
              { label: "Strategic Assets", value: "248", trend: "+12", icon: Database, detail: "Knowledge Graphs & Docs" },
            ].map((stat, i) => (
              <Card key={i} className="glass-panel border-white/5 hover:border-accent/20 transition-all">
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
                    <span className="text-[10px] text-muted-foreground">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Mission Critical War Room */}
            <div className="xl:col-span-2 space-y-8">
              <Card className="glass-panel">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-red-400" />
                      Executive War Room: Risks & Opportunities
                    </CardTitle>
                    <CardDescription>Real-time autonomous intelligence detection</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-red-400/5 border border-red-400/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-red-400">High Severity Risks</h4>
                        <Badge variant="destructive" className="text-[10px]">3 Active</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs bg-red-400/10 p-2 rounded border border-red-400/10">
                          <p className="font-bold">Meta CPM Spike (London)</p>
                          <p className="text-muted-foreground text-[10px]">CPA exceeded threshold by 45%. Agent suggests immediate pause.</p>
                        </div>
                        <div className="text-xs bg-red-400/10 p-2 rounded border border-red-400/10 opacity-70">
                          <p className="font-bold">Creative Fatigue: Ad V2</p>
                          <p className="text-muted-foreground text-[10px]">CTR drop detected across all platforms.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-accent">Strategic Opportunities</h4>
                        <Badge variant="outline" className="text-[10px] text-accent border-accent/20">5 Detected</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs bg-accent/10 p-2 rounded border border-accent/10">
                          <p className="font-bold text-accent">Scaling Pocket: Gen Z Urban</p>
                          <p className="text-muted-foreground text-[10px]">High intent detected in new interest group. Reallocating $2k.</p>
                        </div>
                        <div className="text-xs bg-accent/10 p-2 rounded border border-accent/10 opacity-70">
                          <p className="font-bold text-accent">Trend Sync: Solar Tech</p>
                          <p className="text-muted-foreground text-[10px]">Search volume up 300%. Agent drafting content series.</p>
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
                    Predictive Forecasting Engine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart />
                </CardContent>
              </Card>
            </div>

            {/* Agent Status Panel */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-accent" />
                  Autonomous Agents
                </CardTitle>
                <CardDescription>Live execution status of AMOS specialized agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Campaign Optimization Agent", role: "Optimization", status: "Executing", color: "text-green-400" },
                  { name: "Creative Strategy Agent", role: "Content", status: "Idle", color: "text-muted-foreground" },
                  { name: "Competitive Intelligence Agent", role: "Research", status: "Analyzing", color: "text-accent" },
                  { name: "Predictive Analytics Agent", role: "Analytics", status: "Syncing", color: "text-primary" }
                ].map((agent, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 flex items-center justify-between group hover:border-accent/30 cursor-pointer transition-all">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">{agent.name}</p>
                      <p className="text-[10px] text-muted-foreground">{agent.role}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold ${agent.color}`}>{agent.status}</p>
                      <div className="flex gap-1 mt-1 justify-end">
                        <div className={`w-1 h-1 rounded-full ${agent.status === 'Executing' ? 'bg-green-400 animate-pulse' : 'bg-muted-foreground'}`} />
                        <div className={`w-1 h-1 rounded-full ${agent.status === 'Executing' ? 'bg-green-400 animate-pulse delay-75' : 'bg-muted-foreground'}`} />
                        <div className={`w-1 h-1 rounded-full ${agent.status === 'Executing' ? 'bg-green-400 animate-pulse delay-150' : 'bg-muted-foreground'}`} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-xs font-bold border-accent/20 text-accent" asChild>
                  <Link href="/agents">Agent Console <ChevronRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
