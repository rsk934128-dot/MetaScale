
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, AlertTriangle, Eye, Activity, FileText, FileBadge } from "lucide-react";
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
              Enterprise Risk Observatory
            </h1>
          </div>
          <Badge variant="outline" className="border-green-400/20 text-green-400">
            <ShieldCheck className="mr-1 h-3 w-3" /> System Guard: Active
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Strategic Monitoring</h2>
              <p className="text-muted-foreground">Global threat detection, financial exposure, and compliance audits.</p>
            </div>
            <Button variant="outline" asChild className="border-accent/20 text-accent">
               <Link href="/compliance"><FileBadge className="mr-2 h-4 w-4" /> View Compliance Hub</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-b-4 border-b-green-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Financial Exposure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">Low</div>
                <p className="text-[10px] text-green-400 mt-1 font-bold">Stable against 4 models</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-b-4 border-b-yellow-400 ring-2 ring-yellow-400/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Compliance Drift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">Action Needed</div>
                <p className="text-[10px] text-yellow-400 mt-1 font-bold">Legal Entity: Rubelpay requires L1 sync</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-b-4 border-b-red-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Market Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">Moderate</div>
                <p className="text-[10px] text-red-400 mt-1 font-bold">Competitor activity surge</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-accent" />
                Sovereign Threat Intelligence Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "11:45 AM", category: "Compliance", msg: "Entity 'Rubelpay' verification level L1 requires final settlement validation.", impact: "Medium" },
                  { time: "08:12 AM", category: "Financial", msg: "Unusual opex variance detected in EU marketing node. Audit initialized.", impact: "Low" },
                  { time: "07:45 AM", category: "Compliance", msg: "GDPR policy update requires institutional memory refresh. Auto-patching metadata.", impact: "Medium" },
                  { time: "06:30 AM", category: "Strategic", msg: "Competitor 'MetaCorp' launched aggressive conquesting in APAC. Offensive agents ready.", impact: "High" }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-secondary/10 items-start">
                    <div className="text-[10px] font-mono text-muted-foreground pt-1">{log.time}</div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                          <Badge className={log.impact === 'High' ? 'bg-red-400/20 text-red-400' : 'bg-primary/20 text-primary'}>
                            {log.category}
                          </Badge>
                          <span className="text-[10px] font-bold text-muted-foreground">Impact: {log.impact}</span>
                       </div>
                       <p className="text-sm text-white/90">{log.msg}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                       <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
}
