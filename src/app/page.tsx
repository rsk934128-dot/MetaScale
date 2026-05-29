
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  ShieldAlert, 
  Activity, 
  Zap, 
  Globe, 
  Cpu, 
  RefreshCw, 
  AlertTriangle,
  Lock,
  Network,
  Waves,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function SovereignControlPlane() {
  const [systemMode, setSystemMode] = useState<"NORMAL" | "EMERGENCY" | "LOCKDOWN">("NORMAL");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleModeChange = (mode: "NORMAL" | "EMERGENCY" | "LOCKDOWN") => {
    setSystemMode(mode);
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Sovereign Control Plane
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-secondary/50 p-1 rounded-lg border border-white/5">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("text-[10px] h-7 px-3 font-bold", systemMode === 'NORMAL' && "bg-green-500/20 text-green-400")}
                onClick={() => handleModeChange('NORMAL')}
              >
                NORMAL
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("text-[10px] h-7 px-3 font-bold", systemMode === 'EMERGENCY' && "bg-yellow-500/20 text-yellow-400")}
                onClick={() => handleModeChange('EMERGENCY')}
              >
                EMERGENCY
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("text-[10px] h-7 px-3 font-bold", systemMode === 'LOCKDOWN' && "bg-red-500/20 text-red-400")}
                onClick={() => handleModeChange('LOCKDOWN')}
              >
                LOCKDOWN
              </Button>
            </div>
            <Badge variant="outline" className="border-accent/20 text-accent">
              {isSyncing ? <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> : <Zap className="mr-1 h-3 w-3" />}
              Mesh Sync
            </Badge>
          </div>
        </header>

        <main className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto w-full">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-1">Mission Control</h2>
              <p className="text-muted-foreground">Unified Decision Orchestration for Civic, Financial, and Security Planes.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Global Priority</p>
              <Badge className={cn(
                "font-headline font-bold text-lg",
                systemMode === 'NORMAL' ? 'bg-accent/20 text-accent' : 
                systemMode === 'EMERGENCY' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
              )}>
                {systemMode === 'NORMAL' ? 'EFFICIENCY' : systemMode === 'EMERGENCY' ? 'RESPONSE' : 'SURVIVAL'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[
              { label: "Civic Health", value: "92.4", icon: Waves, color: "text-blue-400", sub: "River AI: Stable" },
              { label: "Treasury Sync", value: "98.1", icon: DollarSign, color: "text-green-400", sub: "L1 Validation: Active" },
              { label: "Threat Level", value: "0.2%", icon: ShieldAlert, color: "text-red-400", sub: "Anycast: Isolated" },
              { label: "Mesh Nodes", value: "42/42", icon: Network, color: "text-accent", sub: "Routing: Optimal" }
            ].map((card, i) => (
              <Card key={i} className="glass-panel border-white/5 hover:border-accent/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{card.label}</p>
                      <p className="text-3xl font-headline font-bold">{card.value}</p>
                    </div>
                    <div className={cn("p-2 rounded-lg bg-secondary/50", card.color.replace('text', 'bg').replace('400', '400/10'))}>
                      <card.icon className={cn("h-5 w-5", card.color)} />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase italic">{card.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
            <div className="xl:col-span-2 space-y-8">
              <Card className="glass-panel border-l-4 border-l-accent overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Real-time Priority Resolver
                  </CardTitle>
                  <CardDescription>Balancing conflicting module requests based on the current System Mode.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { plane: "Civic Intelligence", request: "River AI Warning: Level 4", action: "Dispatched SOS", priority: 1 },
                      { plane: "Financial Sovereign", request: "L1 Settlement Authorization", action: "Execution Gated", priority: 3 },
                      { plane: "Security Intelligence", request: "Threat Signature: Isolated", action: "Monitoring", priority: 2 }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-white/5 group hover:border-accent/30 transition-all">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[8px] uppercase">{row.plane}</Badge>
                            <span className="text-xs font-bold text-white">{row.request}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground italic">DECISION: {row.action}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-accent">P{row.priority}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="glass-panel">
                   <CardHeader>
                     <CardTitle className="text-sm flex items-center gap-2">
                       <Waves className="h-4 w-4 text-blue-400" />
                       River AI & Civic Intel
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="p-3 rounded-lg bg-blue-400/5 border border-blue-400/20 text-[10px] text-blue-400 font-bold italic">
                        "Pre-disaster modeling predicts 12% rise in sector 4. Auto-deploying sensors."
                      </div>
                      <Button variant="outline" className="w-full text-xs font-bold border-blue-400/20 text-blue-400">
                        View Civic Map
                      </Button>
                   </CardContent>
                 </Card>

                 <Card className="glass-panel">
                   <CardHeader>
                     <CardTitle className="text-sm flex items-center gap-2">
                       <Network className="h-4 w-4 text-accent" />
                       Mesh Infrastructure
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span>Active Nodes</span>
                        <span className="text-accent">42 Online</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span>Anycast Status</span>
                        <span className="text-green-400">Isolated</span>
                      </div>
                      <Button variant="outline" className="w-full text-xs font-bold border-accent/20 text-accent">
                        Infrastructure Dashboard
                      </Button>
                   </CardContent>
                 </Card>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                    Security Enforcement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { title: "Fingerprint Auth", status: "Active" },
                      { title: "Counter Intel Sandbox", status: "Enabled" },
                      { title: "Audit Trace", status: "Live" }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-[10px] font-bold uppercase">{item.title}</span>
                        <Badge variant="outline" className="text-[8px] bg-red-500/10 text-red-500">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full text-xs font-bold bg-red-500 hover:bg-red-600 text-white">
                    Emergency Lockdown
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-accent">
                    <Cpu className="h-4 w-4" />
                    AI Decision Council
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { agent: "Civic Governor", action: "Flood Prediction", color: "text-blue-400" },
                    { agent: "Treasury Master", action: "Settlement Sync", color: "text-green-400" },
                    { agent: "Risk Advisor", action: "Threat Analysis", color: "text-red-400" }
                  ].map((agent, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/20 border border-white/5">
                      <div className="space-y-1">
                        <p className="text-xs font-bold">{agent.agent}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">{agent.action}</p>
                      </div>
                      <div className={cn("w-2 h-2 rounded-full animate-pulse", agent.color.replace('text', 'bg'))} />
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
