"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, PieChart, ArrowUpRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Badge } from "@/components/ui/badge";

export default function RevenuePage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Revenue Operations
            </h1>
          </div>
          <Button variant="outline" size="sm">Download Fiscal Report</Button>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-2">Revenue Pipeline Intelligence</h2>
            <p className="text-muted-foreground">Monitor pipeline velocity, conversion efficiency, and fiscal forecasts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total ARR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$12.4M</div>
                <div className="flex items-center gap-1 text-green-400 text-xs font-bold mt-1">
                  <ArrowUpRight className="h-3 w-3" /> +18% YoY
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Sales Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42 Days</div>
                <div className="text-muted-foreground text-xs mt-1">Avg. Close Time (Enterprise)</div>
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Gross Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">78.2%</div>
                <div className="flex items-center gap-1 text-accent text-xs font-bold mt-1">
                  <Target className="h-3 w-3" /> Target: 80%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle>Pipeline Growth Forecast</CardTitle>
                <CardDescription>Predicted revenue vs actual sales targets</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm">Revenue Anomaly Detection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "MQL Stall Detected", status: "Warning", msg: "Lead flow in Mid-Market has decreased by 20% in last 5 days." },
                  { title: "LTV Peak", status: "Insight", msg: "Recent upsell campaign increased LTV by $2.4k per account." }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1">
                    <Badge variant={item.status === 'Warning' ? 'destructive' : 'default'} className="text-[9px]">
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
