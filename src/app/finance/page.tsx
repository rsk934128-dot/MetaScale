
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowUpRight, Target, Lock, ShieldAlert, Wallet, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function FinancialIntelligence() {
  const complianceStatus = "Entity Blocked"; // Derived from KYB Orchestration

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
            <Badge variant="destructive" className="mr-2">
              <Lock className="mr-1 h-3 w-3" /> KYB Gated
            </Badge>
            <Button variant="outline" size="sm">Export Fiscal Audit</Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          {/* Orchestration Alert */}
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <ShieldAlert className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-lg font-headline font-bold text-white">Treasury Execution Halted</p>
                <p className="text-sm text-muted-foreground">Settlement Layer is locked due to L1 Entity (Rubelpay) verification failure.</p>
                <div className="mt-2 flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-bold uppercase">
                      <Lock className="h-3 w-3" /> Withdrawal Blocked
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] text-yellow-400 font-bold uppercase">
                      <AlertCircle className="h-3 w-3" /> Proof of Wallet Pending
                   </div>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white shrink-0">
              <Link href="/compliance">Resolve Compliance Chain</Link>
            </Button>
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
                <CardTitle className="text-sm">Settlement Governance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Primary Wallet</span>
                    <Badge variant="outline" className="text-[9px]">Unverified</Badge>
                  </div>
                  <div className="font-mono text-[10px] text-white/70 bg-black/20 p-2 rounded">
                    0xaf3c724065016dfe4458c05140fa4cbb40131207
                  </div>
                  <Button size="sm" variant="ghost" className="w-full text-[10px] h-7 border border-dashed border-white/10">
                    Sign Ownership Proof
                  </Button>
                </div>

                <div className="space-y-2 pt-4">
                   <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Enforcement Policies</p>
                   {[
                     { title: "Treasury Multi-Sig", status: "Active" },
                     { title: "KYB Cascade Lock", status: "Triggered" }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                        <span className="text-xs">{item.title}</span>
                        <Badge className={item.status === 'Triggered' ? "bg-red-500/20 text-red-500" : "bg-accent/20 text-accent"}>{item.status}</Badge>
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
