
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  Target, 
  Users, 
  Zap, 
  Briefcase, 
  Rocket, 
  FileText,
  RefreshCw,
  Download,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function RevenuePage() {
  const { emitEvent } = useKernel();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Emit high-clearance audit event
    emitEvent('FINANCE', 'STRATEGY_REPORT_GENERATED', 3, { 
      scope: 'GLOBAL_EXECUTION',
      version: '1.2.0-stable',
      timestamp: Date.now()
    });

    toast({
      title: "Generating Strategy PDF",
      description: "Compiling commercial metadata and applying cryptographic seal...",
    });

    // Simulate cryptographic compilation and export
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Successful",
        description: "Commercial Executive Summary has been archived and exported successfully.",
      });
    }, 2500);
  };

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
             <Button asChild variant="outline" size="sm" className="border-accent/20 text-accent font-bold text-[10px]">
                <Link href="/dashboard">
                  <Rocket className="mr-1.5 h-3.5 w-3.5" /> Launch Dashboard
                </Link>
             </Button>
             <Button size="sm" className="bg-accent text-background font-bold text-[10px] cyan-glow" onClick={handleExport} disabled={isExporting}>
                {isExporting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1.5 h-3.5 w-3.5" />}
                {isExporting ? 'Generating...' : 'Download Fiscal Audit'}
             </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[10px] font-bold">Commercial Intelligence</Badge>
              <h2 className="text-4xl font-headline font-bold mb-2 uppercase italic tracking-tighter">Execution <span className="text-accent">Intelligence</span></h2>
              <p className="text-muted-foreground italic max-w-xl">"Monitoring pipeline velocity, commercial yield, and merchant node growth to ensure 99.9% ROI predictability."</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Projected MRR</p>
               <p className="text-4xl font-headline font-bold text-accent">$42,500</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total ARR</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">$12.4M</div>
                <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-1">
                  <ArrowUpRight className="h-3 w-3" /> +18% Growth
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Sales Velocity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">42 Days</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">Avg. Close Time</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Gross Margin</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">78.2%</div>
                <p className="text-[10px] text-blue-400 font-bold mt-1 uppercase">Target: 80%</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-yellow-500 bg-yellow-500/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">CAC/LTV Ratio</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">1:4.8</div>
                <p className="text-[10px] text-yellow-500 font-bold mt-1 uppercase">Efficiency: High</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel shadow-2xl">
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
                 <CardHeader className="p-4 border-b border-white/5">
                   <CardTitle className="text-xs uppercase flex items-center gap-2">
                     <Target className="h-4 w-4 text-accent" /> Commercial Targets
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 space-y-4">
                    <div className="space-y-4">
                       {[
                         { label: "Q2 Revenue Goal", val: 82, color: "bg-accent" },
                         { label: "Merchant Onboarding", val: 64, color: "bg-primary" },
                         { label: "Global Node Expansion", val: 45, color: "bg-blue-400" }
                       ].map((target, i) => (
                         <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                               <span className="text-white/70">{target.label}</span>
                               <span className="text-accent">{target.val}%</span>
                            </div>
                            <Progress value={target.val} className="h-1 bg-white/5" />
                         </div>
                       ))}
                    </div>
                    <Button className="w-full h-10 bg-accent text-background font-bold text-[10px] uppercase tracking-widest cyan-glow mt-4">
                       Update Execution Plan
                    </Button>
                 </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                 <CardHeader className="p-4 border-b border-white/5">
                   <CardTitle className="text-xs uppercase flex items-center gap-2">
                     <Zap className="h-4 w-4 text-primary" /> Growth Insights
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 space-y-4">
                   {[
                     { title: "MQL Stall Detected", status: "Warning", msg: "Lead flow in Mid-Market has decreased by 20% in last 5 days. Suggesting P43 automated outreach." },
                     { title: "LTV Peak in EU Node", status: "Insight", msg: "Recent upsell campaign increased LTV by $2.4k per account on Node-04." }
                   ].map((item, i) => (
                     <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1 group hover:border-primary/30 transition-all cursor-default">
                       <Badge variant={item.status === 'Warning' ? 'destructive' : 'default'} className="text-[8px] uppercase px-2">
                         {item.status}
                       </Badge>
                       <p className="text-xs font-bold mt-1 text-white uppercase">{item.title}</p>
                       <p className="text-[10px] text-muted-foreground italic leading-relaxed">{item.msg}</p>
                     </div>
                   ))}
                 </CardContent>
               </Card>
            </div>
          </div>

          {/* Growth Roadmap Summary */}
          <div className="pt-10 border-t border-white/5">
             <Card className="glass-panel bg-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Briefcase className="h-40 w-40 text-primary" /></div>
                <CardContent className="p-8">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                      <div className="space-y-4 text-center md:text-left">
                         <h3 className="text-2xl font-headline font-bold text-white flex items-center justify-center md:justify-start gap-3 uppercase italic">
                            <FileText className="h-6 w-6 text-primary" />
                            Commercial Executive Summary
                         </h3>
                         <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                            Your "Digital Financial Empire" is currently operating at 92.4% efficiency. With Project 42-45 successfully integrated, the system is now generating a deterministic yield of 3.5% per transaction. Our growth roadmap predicts a 300% increase in merchant nodes by Q4 2024.
                         </p>
                      </div>
                      <Button 
                        className="h-14 px-10 rounded-full bg-primary text-white font-bold uppercase text-xs tracking-widest blue-glow shrink-0 transition-all active:scale-95"
                        onClick={handleExport}
                        disabled={isExporting}
                      >
                         {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                         {isExporting ? "Compiling..." : "Export Strategy PDF"}
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        </main>

        <footer className="p-8 border-t border-white/5 text-center">
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Sovereign OS • Commercial Infrastructure v1.2 • Execution Mode Active
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}

