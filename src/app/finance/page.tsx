
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowUpRight, Target, PieChart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Badge } from "@/components/ui/badge";

export default function FinancialIntelligence() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Financial Intelligence Center
            </h1>
          </div>
          <Button variant="outline" size="sm">Export Fiscal Audit</Button>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-2">Sovereign Fiscal Command</h2>
            <p className="text-muted-foreground">Unified financial forecasting, cash flow modeling, and scenario planning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-l-4 border-l-green-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Liquidity Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">$4.82M</div>
                <div className="flex items-center gap-1 text-green-400 text-xs font-bold mt-1">
                  <ArrowUpRight className="h-3 w-3" /> +12% MoM
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Projected Runway</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">22 Months</div>
                <p className="text-[10px] text-muted-foreground mt-1">Based on current OPEX burn</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">EBITDA Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">28.4%</div>
                <div className="flex items-center gap-1 text-accent text-xs font-bold mt-1">
                  <Target className="h-3 w-3" /> Target: 30.0%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle>Cash Flow Forecast (Digital Twin)</CardTitle>
                <CardDescription>AI-modeled revenue vs actual disbursements</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm">Fiscal Risk Simulation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Market Correction Simulation", status: "Critical", msg: "If market drops 15%, runway decreases to 14 months." },
                  { title: "OPEX Optimization", status: "Insight", msg: "Reducing cloud compute spend by 10% saves $45k/mo." }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1">
                    <Badge variant={item.status === 'Critical' ? 'destructive' : 'default'} className="text-[9px]">
                      {item.status}
                    </Badge>
                    <p className="text-xs font-bold mt-1">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">{item.msg}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
