
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  Wallet, 
  History, 
  FileText, 
  Clock, 
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Lock,
  Gavel,
  Zap,
  Activity,
  RefreshCw,
  PlayCircle,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function KYBOrchestrationPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const handleSimulateSync = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      toast({
        title: "Orchestration Sync Complete",
        description: "Dependency check: Entity status 'Action Needed' is blocking Settlement Layer activation.",
      });
    }, 2000);
  };

  const layers = {
    entity: {
      name: "Rubelpay",
      status: "Action Needed", // Pending | Verified | Action Needed
      progress: 60,
      details: {
        regNo: "2200882501903677",
        jurisdiction: "Bangladesh",
        type: "Company"
      }
    },
    ubo: {
      name: "Farid Sheikh",
      status: "Verified",
      progress: 100,
      details: {
        role: "UBO & Director",
        identityProvider: "Sumsub",
        verifiedAt: "2024-05-15"
      }
    },
    settlement: {
      name: "USDT Treasury",
      status: "Gated", // Gated | Active | Restricted
      progress: 0,
      details: {
        wallet: "0xaf3c...1207",
        network: "BNB Smart Chain",
        proofStatus: "Missing Signature"
      }
    }
  };

  const logs = [
    { time: "10:00 AM", actor: "System", action: "Cascade Block", detail: "Settlement Gated: Dependent on Entity Verification" },
    { time: "09:45 AM", actor: "Farid Sheikh", action: "Identity Sync", detail: "Sumsub L2 verification successful" },
    { time: "09:30 AM", actor: "System", action: "Entity Audit", detail: "Registration certificate expired in jurisdiction: Bangladesh" }
  ];

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Gavel className="h-5 w-5 text-accent" />
              KYB Orchestration & Settlement Governance
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Global Readiness</p>
                <p className="text-lg font-headline font-bold text-accent">53%</p>
             </div>
             <Badge variant="destructive" className="animate-pulse">
                <Lock className="mr-1 h-3 w-3" /> Settlement Gated
             </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Governance Orchestrator</h2>
              <p className="text-muted-foreground">Decoupled identity, legal, and financial verification with dependency-aware enforcement.</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-accent/20 text-accent"
                onClick={handleSimulateSync}
                disabled={isSimulating}
              >
                {isSimulating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Sync Orchestration
              </Button>
            </div>
          </div>

          {/* Tiered Verification Layers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Layer 1: Entity */}
            <Card className={cn("glass-panel relative border-l-4", layers.entity.status === 'Verified' ? "border-l-green-500" : "border-l-yellow-500")}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">Layer 1: Entity</Badge>
                  {layers.entity.status === 'Verified' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />}
                </div>
                <CardTitle className="text-lg mt-2">{layers.entity.name}</CardTitle>
                <CardDescription className="text-xs uppercase font-bold">{layers.entity.status}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Validation Progress</span>
                    <span>{layers.entity.progress}%</span>
                  </div>
                  <Progress value={layers.entity.progress} className="h-1" />
                </div>
                <div className="p-2 rounded bg-secondary/30 text-[10px] space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Reg No:</span> <span>{layers.entity.details.regNo}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Jurisdiction:</span> <span>{layers.entity.details.jurisdiction}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Layer 2: UBO */}
            <Card className={cn("glass-panel relative border-l-4", layers.ubo.status === 'Verified' ? "border-l-green-500" : "border-l-red-500")}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">Layer 2: UBO</Badge>
                  {layers.ubo.status === 'Verified' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-red-500" />}
                </div>
                <CardTitle className="text-lg mt-2">{layers.ubo.name}</CardTitle>
                <CardDescription className="text-xs uppercase font-bold">{layers.ubo.status}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Identity Progress</span>
                    <span>{layers.ubo.progress}%</span>
                  </div>
                  <Progress value={layers.ubo.progress} className="h-1" />
                </div>
                <div className="p-2 rounded bg-secondary/30 text-[10px] space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Role:</span> <span>{layers.ubo.details.role}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Provider:</span> <span>{layers.ubo.details.identityProvider}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Layer 3: Settlement */}
            <Card className={cn("glass-panel relative border-l-4", layers.settlement.status === 'Active' ? "border-l-green-500" : "border-l-red-500 ring-2 ring-red-500/10")}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">Layer 3: Settlement</Badge>
                  <Lock className="h-4 w-4 text-red-500" />
                </div>
                <CardTitle className="text-lg mt-2">{layers.settlement.name}</CardTitle>
                <CardDescription className="text-xs uppercase font-bold text-red-500">{layers.settlement.status}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Treasury Readiness</span>
                    <span>{layers.settlement.progress}%</span>
                  </div>
                  <Progress value={layers.settlement.progress} className="h-1" />
                </div>
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-[10px] space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <ShieldAlert className="h-3 w-3" /> DEP-BLOCK: Entity Level Fail
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Treasury execution is restricted until Entity Layer (Rubelpay) resolves registration gaps.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orchestration View */}
          <Tabs defaultValue="dependencies" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-white/5">
              <TabsTrigger value="dependencies">Dependency Graph</TabsTrigger>
              <TabsTrigger value="vault">Evidence Vault</TabsTrigger>
              <TabsTrigger value="ledger">KYB Audit Ledger</TabsTrigger>
            </TabsList>

            <TabsContent value="dependencies" className="space-y-6">
               <Card className="glass-panel">
                 <CardHeader>
                   <CardTitle className="text-lg">Verification Cascade</CardTitle>
                   <CardDescription>Visualizing how compliance health affects operational capability.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 border border-white/5 rounded-2xl bg-secondary/10">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-yellow-500" />
                          </div>
                          <span className="text-xs font-bold">Entity</span>
                       </div>
                       <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                            <UserCheck className="h-8 w-8 text-green-500" />
                          </div>
                          <span className="text-xs font-bold">UBO</span>
                       </div>
                       <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                       <div className="flex flex-col items-center gap-3 opacity-50 grayscale">
                          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                            <Wallet className="h-8 w-8 text-red-500" />
                          </div>
                          <span className="text-xs font-bold">Settlement</span>
                       </div>
                    </div>
                 </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="ledger">
               <Card className="glass-panel">
                 <CardHeader>
                   <CardTitle>Immutable KYB Trail</CardTitle>
                   <CardDescription>Cryptographically signed history of compliance events.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {logs.map((log, i) => (
                         <div key={i} className="flex gap-4 p-4 border border-white/5 rounded-xl bg-secondary/10 hover:border-accent/30 transition-all">
                            <div className="text-[10px] font-mono text-muted-foreground pt-1">{log.time}</div>
                            <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-[9px] uppercase">{log.actor}</Badge>
                                  <span className="text-xs font-bold">{log.action}</span>
                               </div>
                               <p className="text-xs text-muted-foreground">{log.detail}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}
