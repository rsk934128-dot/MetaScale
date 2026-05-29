
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { 
  ArrowUpRight, 
  Users, 
  Target, 
  Zap, 
  Globe,
  TrendingUp,
  AlertCircle,
  BrainCircuit,
  ChevronRight,
  Database,
  BarChart3
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
            <h1 className="text-lg font-headline font-bold">AMOS Executive Command Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-accent border-accent/20">
              <Globe className="mr-1 h-3 w-3" /> Cross-Platform Live
            </Badge>
            <Button size="sm" className="cyan-glow text-xs font-bold bg-accent hover:bg-accent/90">
              <Zap className="mr-1 h-3 w-3" /> Refresh IQ
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto w-full">
          {/* Executive KPI Wall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Managed Spend", value: "$142,502", trend: "+5.2%", icon: Target, detail: "Meta, Google, TikTok" },
              { label: "Predictive Revenue", value: "$524,900", trend: "+12.4%", icon: TrendingUp, isGood: true, detail: "AMOS Forecast Accuracy: 92%" },
              { label: "Knowledge Assets", value: "248", trend: "+12", icon: Database, isGood: true, detail: "Indexed Documents & Creatives" },
              { label: "Active IQ Tasks", value: "7", trend: "+3", icon: BrainCircuit, detail: "AI Optimizations Running" },
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
                    <span className="text-[10px] text-muted-foreground">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Performance Forecast */}
            <Card className="glass-panel xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Predictive Performance Modeling
                  </CardTitle>
                  <CardDescription>AI-driven reach and conversion forecasting across all platforms</CardDescription>
                </div>
                <div className="flex gap-2">
                   <Badge variant="secondary" className="cursor-pointer">Meta</Badge>
                   <Badge variant="outline" className="opacity-50">Google</Badge>
                   <Badge variant="outline" className="opacity-50">TikTok</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            {/* AI Insight Feed - The Knowledge Layer */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-accent" />
                  Marketing Intelligence
                </CardTitle>
                <CardDescription>Strategic findings from document intelligence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Strategic Alignment", msg: "Campaign 'Summer 24' is missing core value props identified in 'Brand_Guidelines.pdf'. Suggest copy update.", type: "strategy" },
                  { title: "Anomaly Detected", msg: "TikTok CPA spiked by 42% in London. Correlates with competitor launch noted in Market_Scan.pdf.", type: "risk" },
                  { title: "Scaling Pocket", msg: "LAL 1% Interest Group shows 94% forecast confidence for $5k daily scale. Context: Historical Q2 peaks.", type: "budget" }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1 group hover:border-accent/30 cursor-pointer transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-accent">{item.title}</span>
                      <Badge variant="outline" className="text-[8px] py-0">View Context</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{item.msg}</p>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-white" asChild>
                  <Link href="/intelligence">Open Command Chat <ChevronRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Platform Performance IQ Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Meta IQ', 'Google IQ', 'TikTok IQ', 'LinkedIn IQ'].map((platform) => (
              <Card key={platform} className="glass-panel p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{platform}</p>
                    <p className="text-[10px] text-muted-foreground">Strategic Sync: 100%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-green-400">4.1x ROAS</p>
                  <p className="text-[10px] text-muted-foreground">Forecast: Stable</p>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
