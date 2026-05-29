
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  ArrowUpRight, 
  Target, 
  Lock, 
  ShieldAlert, 
  Wallet, 
  AlertCircle, 
  Zap,
  ShieldCheck,
  Scale,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function FinancialIntelligence() {
  const trustScore = 75.4;
  const authTier = "Limited Settlement";

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Fiscal Command & Trust Fabric
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Trust Index</p>
              <p className="text-sm font-bold text-accent">{trustScore}</p>
            </div>
            <Badge variant="destructive" className="animate-pulse">
              <Scale className="mr-1 h-3 w-3" /> Adaptive Block
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          {/* Adaptive Authorization Alert */}
          <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <ShieldAlert className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-lg font-headline font-bold text-white">Adaptive Execution Tier: {authTier}</p>
                <p className="text-sm text-muted-foreground">Daily settlement capped at $10k due to trust score drift (75.4). Resolve Entity Drift to restore Full Tier.</p>
                <div className="mt-2 flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] text-yellow-400 font-bold uppercase">
                      <Scale className="h-3 w-3" /> Tiered Capping Active
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] text-accent font-bold uppercase">
                      <Activity className="h-3 w-3" /> Monitoring Node Active
                   </div>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild className="border-accent/20 text-accent hover:bg-accent hover:text-background shrink-0 font-bold">
              <Link href="/risk">View Trust Drift</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-l-4 border-l-green-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Settlement Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">64%</div>
                <p className="text-[10px] text-muted-foreground mt-1 font-bold italic">Identity: High | Asset: Pending Proof</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Risk-Adjusted Runway</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">18 Months</div>
                <p className="text-[10px] text-red-400 mt-1">-4mo if blocks persist</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Asset Identity Binding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">Gated</div>
                <div className="flex items-center gap-1 text-accent text-xs font-bold mt-1 uppercase">
                  <Fingerprint className="h-3 w-3" /> Cryptographic Sync Needed
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle>Continuous Revenue Validation</CardTitle>
                <CardDescription>Consensus-backed actuals vs AI-simulated growth</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm">Settlement Intelligence Router</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Target Wallet</span>
                    <Badge variant="outline" className="text-[9px] text-yellow-400">Pending Proof</Badge>
                  </div>
                  <div className="font-mono text-[10px] text-white/70 bg-black/20 p-2 rounded break-all">
                    0xaf3c724065016dfe4458c05140fa4cbb40131207
                  </div>
                  <Button size="sm" className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                    Sign Cryptographic Proof
                  </Button>
                </div>

                <div className="space-y-2 pt-4">
                   <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Trust Policy Enforcement</p>
                   {[
                     { title: "Daily Limit Enforcement", status: "Active" },
                     { title: "Escrow Logic (Low Trust)", status: "Standby" },
                     { title: "Auto-Reconciliation", status: "Active" }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                        <span className="text-xs">{item.title}</span>
                        <Badge variant="outline" className="text-[8px] bg-accent/10">{item.status}</Badge>
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
