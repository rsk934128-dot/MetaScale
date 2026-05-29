
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, AlertTriangle, Eye, Activity, FileText, FileBadge, Lock, Gavel, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RiskObservatory() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              Enterprise Risk & Enforcement
            </h1>
          </div>
          <Badge variant="outline" className="border-red-400/20 text-red-400 animate-pulse">
            <Lock className="mr-1 h-3 w-3" /> Active Enforcement Blocks
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Sovereign Monitoring</h2>
              <p className="text-muted-foreground">Global threat detection, financial exposure, and automated policy enforcement.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="border-accent/20 text-accent">
                 <Link href="/compliance"><Gavel className="mr-2 h-4 w-4" /> Policy Enforcement</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-b-4 border-b-green-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Fiscal Exposure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">Low</div>
                <p className="text-[10px] text-green-400 mt-1 font-bold">Stable against 4 models</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-b-4 border-b-red-500 ring-2 ring-red-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Compliance Block</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">Critical</div>
                <p className="text-[10px] text-red-400 mt-1 font-bold">Rubelpay: Settlement Restricted</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-b-4 border-b-yellow-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Regulatory Drift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">14%</div>
                <p className="text-[10px] text-yellow-400 mt-1 font-bold">Moderate jurisdictional change risk</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <Card className="xl:col-span-2 glass-panel overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent" />
                    Enforcement Event Stream
                  </CardTitle>
                  <CardDescription>Immutable record of all policy-triggered blocks and approvals.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "11:45 AM", category: "Enforcement", msg: "BLOCK: Settlement restricted for entity 'Rubelpay' due to License expiry.", impact: "Critical", icon: Lock },
                      { time: "09:30 AM", category: "Audit", msg: "Policy Check: UBO identity verified for Farid Sheikh. OCR signature confirmed.", impact: "Info", icon: CheckCircle2 },
                      { time: "Yesterday", category: "Enforcement", msg: "RESTRICT: Campaign launch gated for APAC region. Awaiting L2 documentation.", impact: "High", icon: Scale }
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-secondary/10 items-start">
                        <div className="text-[10px] font-mono text-muted-foreground pt-1">{log.time}</div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                              <Badge className={log.impact === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}>
                                {log.category}
                              </Badge>
                              <span className="text-[10px] font-bold text-muted-foreground">Impact: {log.impact}</span>
                           </div>
                           <p className="text-sm text-white/90 flex items-center gap-2">
                             <log.icon className="h-3 w-3 inline" /> {log.msg}
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Scale className="h-4 w-4 text-accent" />
                    Regulatory Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {[
                     { area: "Tax ID Sync", risk: "Low", status: "Predicted Gap" },
                     { area: "Operational License", risk: "Critical", status: "Active Violation" },
                     { area: "UBO L2 Verify", risk: "High", status: "Pending" }
                   ].map((item, i) => (
                     <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-xs font-bold text-white">{item.area}</span>
                           <Badge variant="outline" className="text-[9px]">{item.status}</Badge>
                        </div>
                        <div className="h-1 w-full bg-secondary rounded-full">
                           <div className={`h-full rounded-full ${item.risk === 'Critical' ? 'bg-red-500' : item.risk === 'High' ? 'bg-yellow-500' : 'bg-accent'}`} style={{ width: item.risk === 'Critical' ? '95%' : item.risk === 'High' ? '70%' : '30%' }} />
                        </div>
                     </div>
                   ))}
                   <Button className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                     Initiate Auto-Remediation
                   </Button>
                </CardContent>
              </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
