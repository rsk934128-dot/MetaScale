
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowUpRight, Target, PieChart, Wallet, Lock, ShieldAlert, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function FinancialIntelligence() {
  const isSettlementBlocked = true; // Derived from compliance state

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Fiscal Command
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isSettlementBlocked && (
              <Badge variant="destructive" className="mr-2">
                <Lock className="mr-1 h-3 w-3" /> Settlement Gated
              </Badge>
            )}
            <Button variant="outline" size="sm">Export Fiscal Audit</Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          {isSettlementBlocked && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-bold text-white">Settlement Infrastructure Locked</p>
                  <p className="text-xs text-muted-foreground">Automated enforcement policy triggered due to expired Operational License in jurisdiction: Bangladesh.</p>
                </div>
              </div>
              <Button size="sm" variant="outline" asChild className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
                <Link href="/compliance">View Violation Details</Link>
              </Button>
            </div>
          )}

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
                <CardTitle className="text-sm">Enforcement Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                   <div className="flex items-center gap-2 mb-1">
                      <Lock className="h-3 w-3 text-red-500" />
                      <span className="text-[10px] font-bold uppercase text-red-500">Active Enforcement</span>
                   </div>
                   <p className="text-xs text-white">Payout capability is restricted. $1.2M pending clearance.</p>
                </div>
                {[
                  { title: "Treasury multi-sig", status: "Enabled", msg: "Policy active for transfers > $10k." },
                  { title: "Compliance gating", status: "Active", msg: "Automated check before every execution." }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1">
                    <Badge variant="default" className="text-[9px] bg-accent/20 text-accent">
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
