
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Zap, ShieldCheck, Clock, Settings, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function OperationalTwin() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Operational Intelligence Twin
            </h1>
          </div>
          <Badge variant="outline" className="text-accent border-accent/20">
            <Zap className="mr-1 h-3 w-3" /> Real-time Node Sync: Active
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-2">Process Intelligence</h2>
            <p className="text-muted-foreground">Monitor and optimize enterprise workflows and resource allocation.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Cycle Time & Process Health
                </CardTitle>
                <CardDescription>Tracking efficiency across 12 core business processes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { name: "Customer Onboarding", efficiency: 92, status: "Optimal" },
                  { name: "Strategic Planning Cycle", efficiency: 45, status: "Warning" },
                  { name: "Support Ticket Resolution", efficiency: 88, status: "Optimal" },
                  { name: "Campaign Deployment", efficiency: 98, status: "Optimal" }
                ].map((process, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span>{process.name}</span>
                      <span className={process.status === 'Warning' ? 'text-yellow-400' : 'text-accent'}>{process.efficiency}%</span>
                    </div>
                    <Progress value={process.efficiency} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-accent" />
                    AI Process Optimizer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-xs text-white/90">
                    <p className="font-bold mb-1">Bottleneck Detected</p>
                    <p className="text-muted-foreground">"Strategic Planning is lagging due to data silos in the Finance-Marketing bridge. Suggesting 4 auto-sync rules."</p>
                  </div>
                  <Button className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                    Execute Optimization
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-sm">Resource Capacity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-muted-foreground">Compute Utilization</span>
                     <span className="font-bold">64%</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-muted-foreground">Human Capital Index</span>
                     <span className="font-bold">82%</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-muted-foreground">Capital Efficiency</span>
                     <span className="font-bold">1.4x</span>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
