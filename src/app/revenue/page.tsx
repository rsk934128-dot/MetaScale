
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, PieChart, ArrowUpRight, Target, Users, Zap, Briefcase, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function RevenuePage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <DollarSign className="h-5 w-5 text-accent" />
              Revenue Operations <span className="text-[10px] text-muted-foreground uppercase opacity-50 ml-2">Execution Mode</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" className="border-accent/20 text-accent font-bold text-[10px]">
                <Rocket className="mr-1.5 h-3.5 w-3.5" /> Launch Dashboard
             </Button>
             <Button size="sm" className="bg-accent text-background font-bold text-[10px] cyan-glow">
                Download Fiscal Audit
             </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-2 uppercase italic tracking-tighter">Execution <span className="text-accent">Intelligence</span></h2>
              <p className="text-muted-foreground italic">"Monitoring pipeline velocity, commercial yield, and merchant node growth."</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[10px] font-bold uppercase text-muted-foreground">Projected MRR</p>
               <p className="text-3xl font-headline font-bold text-accent">$42,500</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Total ARR</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">$12.4M</div>
                <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-1">
                  <ArrowUpRight className="h-3 w-3" /> +18% Growth
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Sales Velocity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">42 Days</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">Avg. Close Time</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Gross Margin</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">78.2%</div>
                <p className="text-[10px] text-blue-400 font-bold mt-1 uppercase">Target: 80%</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-yellow-500 bg-yellow-500/5">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">CAC/LTV Ratio</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">1:4.8</div>
                <p className="text-[10px] text-yellow-500 font-bold mt-1 uppercase">Efficiency: High</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-sm uppercase tracking-widest">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Pipeline Growth Forecast
                   </div>
                   <Badge variant="outline" className="text-[9px] border-accent/30 text-accent uppercase">Updated Real-time</Badge>
                </CardTitle>
                <CardDescription className="text-xs italic">Predicted revenue vs actual sales targets across 3 active corridors.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <PerformanceChart />
              </CardContent>
            </Card>
            
            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                 <CardHeader className="p-4">
                   <CardTitle className="text-xs uppercase flex items-center gap-2">
                     <Target className="h-4 w-4 text-accent" /> Execution Targets
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-3">
                       {[
                         { label: "Q2 Revenue Goal", val: 82, color: "bg-accent" },
                         { label: "Merchant Onboarding", val: 64, color: "bg-primary" },
                         { label: "Node Expansion", val: 45, color: "bg-blue-400" }
                       ].map((target, i) => (
                         <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                               <span>{target.label}</span>
                               <span>{target.val}%</span>
                            </div>
                            <Progress value={target.val} className={cn("h-1 bg-white/5", `[&>div]:${target.color}`)} />
                         </div>
                       ))}
                    </div>
                    <Button className="w-full h-9 bg-accent text-background font-bold text-[10px] uppercase tracking-widest cyan-glow">
                       Update Execution Plan
                    </Button>
                 </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                 <CardHeader className="p-4">
                   <CardTitle className="text-xs uppercase flex items-center gap-2">
                     <Zap className="h-4 w-4 text-primary" /> Anomaly Detection
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-4">
                   {[
                     { title: "MQL Stall Detected", status: "Warning", msg: "Lead flow in Mid-Market has decreased by 20% in last 5 days." },
                     { title: "LTV Peak", status: "Insight", msg: "Recent upsell campaign increased LTV by $2.4k per account." }
                   ].map((item, i) => (
                     <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1 group hover:border-primary/30 transition-all">
                       <Badge variant={item.status === 'Warning' ? 'destructive' : 'default'} className="text-[9px] uppercase">
                         {item.status}
                       </Badge>
                       <p className="text-xs font-bold mt-1 text-white">{item.title}</p>
                       <p className="text-[10px] text-muted-foreground italic leading-relaxed">{item.msg}</p>
                     </div>
                   ))}
                 </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
