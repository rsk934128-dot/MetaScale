
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileBadge, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  CreditCard, 
  History, 
  FileText, 
  Clock, 
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  ExternalLink,
  ChevronRight,
  Lock,
  Unlock,
  Scale,
  Gavel,
  Zap,
  Activity,
  RefreshCw,
  PlayCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function ComplianceIntelligencePage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const handleSimulatePolicy = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      toast({
        title: "Simulation Complete",
        description: "Adaptive policy update: Suggesting grace period extension for L1 verification to prevent $1.2M settlement block.",
      });
    }, 2000);
  };

  const entityData = {
    legalName: "Rubelpay",
    regNo: "2200882501903677",
    country: "Bangladesh",
    address: "masumpor,sirajganj,6700, Bangladesh",
    established: "06/11/2025",
    verificationLevel: "L1 Verification",
    status: "Action Needed",
    complianceScore: 72,
    enforcementBlocks: [
      { id: "eb-1", feature: "Settlement Execution", status: "Blocked", reason: "License Expired", severity: "Critical", recovery: "Upload Q1 2024 Renewed License" },
      { id: "eb-2", feature: "Campaign Launch", status: "Restricted", reason: "UBO L2 Pending", severity: "Warning", recovery: "Farid Sheikh identity re-verification" }
    ],
    rules: [
      { id: "rule-1", condition: "IF Operational License Expired", action: "BLOCK Settlement", status: "Active" },
      { id: "rule-2", condition: "IF Compliance Score < 60%", action: "PAUSE All Agents", status: "Active" },
      { id: "rule-3", condition: "IF High Risk Transaction", action: "REQUIRE Multi-Sig", status: "Active" }
    ]
  };

  const documents = [
    { id: "doc-1", title: "Certificate of Incorporation", type: "Incorporation", status: "Verified", expiry: "N/A", lastChecked: "Today" },
    { id: "doc-2", title: "Farid Sheikh Passport", type: "ID", status: "Verified", expiry: "12/2028", lastChecked: "Yesterday" },
    { id: "doc-3", title: "Operational License Q4", type: "License", status: "Expired", expiry: "02/2024", lastChecked: "1h ago" },
    { id: "doc-4", title: "Tax Residency Certificate", type: "Tax", status: "Pending", expiry: "12/2024", lastChecked: "4h ago" },
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
              Sovereign Governance & Self-Healing
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Regulatory Readiness</p>
              <p className="text-lg font-headline font-bold text-accent">{entityData.complianceScore}%</p>
            </div>
            <Badge variant="destructive" className="animate-pulse">
              <Lock className="mr-1 h-3 w-3" /> {entityData.enforcementBlocks.length} Active Blocks
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Self-Healing Compliance</h2>
              <p className="text-muted-foreground">AI-driven resolution paths, adaptive policies, and regulatory simulation.</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-accent/20 text-accent"
                onClick={handleSimulatePolicy}
                disabled={isSimulating}
              >
                {isSimulating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                Policy Simulator
              </Button>
              <Button size="sm" className="cyan-glow bg-accent text-background font-bold">
                Run Self-Healing Sync
              </Button>
            </div>
          </div>

          <Tabs defaultValue="enforcement" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-white/5 p-1">
              <TabsTrigger value="overview">Executive Overview</TabsTrigger>
              <TabsTrigger value="enforcement">Recovery Center</TabsTrigger>
              <TabsTrigger value="rules">Adaptive Policies</TabsTrigger>
              <TabsTrigger value="vault">Evidence Vault</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass-panel border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-red-500" />
                      Active Violations & Recovery Paths
                    </CardTitle>
                    <CardDescription>Platform restrictions with AI-suggested remediation steps.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {entityData.enforcementBlocks.map((block) => (
                      <div key={block.id} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="p-2 rounded-lg bg-red-500/10">
                              <Lock className="h-4 w-4 text-red-500" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white">{block.feature}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">{block.reason}</p>
                              <p className="text-xs text-accent mt-1 font-bold">➔ Recovery: {block.recovery}</p>
                           </div>
                        </div>
                        <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Resolve Now
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Adaptive Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                        <p className="text-xs font-bold text-white mb-1">Policy Update Proposal</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic">"Jurisdiction Bangladesh: Recent tax regulation drift detected. Suggest adding 'Tax ID Refresh' check 45 days prior to expiry."</p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold">
                           <span>Regulatory Drift Risk</span>
                           <span className="text-accent">14%</span>
                        </div>
                        <Progress value={14} className="h-1" />
                     </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="enforcement">
               <Card className="glass-panel">
                 <CardHeader>
                   <CardTitle>Recovery Ledger</CardTitle>
                   <CardDescription>Real-time status of self-healing tasks and feature restoration.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {entityData.enforcementBlocks.map((block) => (
                         <div key={block.id} className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-secondary/10 group hover:border-accent/30 transition-all">
                            <div className="flex gap-4 items-center">
                               <Lock className="h-5 w-5 text-red-400" />
                               <div>
                                  <h4 className="text-sm font-bold">{block.feature}</h4>
                                  <p className="text-xs text-muted-foreground">{block.reason}</p>
                                  <div className="mt-2 flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-[10px] text-yellow-400">
                                      <Clock className="h-3 w-3" /> ETA: 24h
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-accent font-bold">
                                      <Zap className="h-3 w-3" /> Auto-Verify Active
                                    </div>
                                  </div>
                               </div>
                            </div>
                            <Button size="sm" className="bg-accent text-background font-bold text-[10px] h-7">Upload Evidence</Button>
                         </div>
                       ))}
                    </div>
                 </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="rules">
               <Card className="glass-panel">
                 <CardHeader>
                   <div className="flex justify-between items-center">
                      <div>
                         <CardTitle>Adaptive Governance Rules</CardTitle>
                         <CardDescription>AI-refined policies that evolve based on operational outcomes.</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs border-accent/20 text-accent">Suggest Optimization</Button>
                   </div>
                 </CardHeader>
                 <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {entityData.rules.map((rule) => (
                         <div key={rule.id} className="p-4 rounded-xl border border-white/5 bg-secondary/20 flex flex-col justify-between group hover:border-accent/30">
                            <div className="space-y-2">
                               <div className="flex justify-between items-center">
                                  <Badge className="text-[9px] bg-accent/20 text-accent">{rule.status}</Badge>
                                  <Activity className="h-3 w-3 text-muted-foreground group-hover:text-accent animate-pulse" />
                               </div>
                               <p className="text-xs font-mono text-white/90">{rule.condition}</p>
                               <p className="text-xs font-bold text-accent">➔ {rule.action}</p>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                               <Button variant="ghost" size="sm" className="text-[10px] h-6 flex-1">View Analytics</Button>
                               <Button variant="ghost" size="sm" className="text-[10px] h-6 flex-1 text-red-400">Edit Rule</Button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="vault">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Sovereign Evidence Repository</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 rounded-xl border border-white/5 bg-secondary/20 hover:border-accent/30 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <div className={`p-2 rounded-lg ${doc.status === 'Verified' ? 'bg-green-400/10' : doc.status === 'Expired' ? 'bg-red-400/10' : 'bg-yellow-400/10'}`}>
                            <FileText className={`h-4 w-4 ${doc.status === 'Verified' ? 'text-green-400' : doc.status === 'Expired' ? 'text-red-400' : 'text-yellow-400'}`} />
                          </div>
                          <Badge variant="outline" className="text-[9px] border-white/10">{doc.status}</Badge>
                        </div>
                        <h4 className="text-xs font-bold mb-1 truncate">{doc.title}</h4>
                        <div className="space-y-1 mb-4">
                          <p className="text-[9px] text-muted-foreground uppercase">Type: {doc.type}</p>
                          <p className="text-[9px] text-muted-foreground uppercase">Expires: {doc.expiry}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
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
