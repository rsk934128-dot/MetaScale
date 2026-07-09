"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Building2, 
  UserCheck, 
  Wallet, 
  Lock, 
  Gavel, 
  Activity, 
  RefreshCw, 
  ArrowRight,
  Fingerprint,
  Scale,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  Zap,
  TrendingDown,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { predictComplianceRisk } from "@/ai/flows/predictive-compliance";

export default function KYBOrchestrationPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSimulateSync = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      toast({
        title: "Trust Fabric Sync Complete",
        description: "Recalculated Trust Score: 75.4. Settlement remains in 'Limited' tier.",
      });
    }, 2000);
  };

  const handleRunAIAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await predictComplianceRisk({
        entityId: 'RUBELPAY-BD-01',
        jurisdiction: 'Bangladesh',
        currentDocuments: [
          { type: 'Trade License', expiryDate: '2024-06-30', status: 'ACTIVE' },
          { type: 'Certificate of Inc', expiryDate: '2028-12-01', status: 'ACTIVE' }
        ],
        activeBlocks: ['EU-VAT-DRIFT']
      });
      setAuditResult(result);
      toast({
        title: "AI Audit Complete",
        description: `Regulatory Drift Score: ${result.regulatoryDriftScore}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Audit Failed",
        description: "Could not reach the Compliance Reasoning Engine.",
      });
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-white">
              <Fingerprint className="h-5 w-5 text-accent" />
              Regulated Trust Fabric (RFTF)
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Continuous Trust Score</p>
                <p className="text-lg font-headline font-bold text-accent">75.4</p>
             </div>
             <Badge variant="destructive" className="animate-pulse">
                <Scale className="mr-1 h-3 w-3" /> Adaptive Payout Cap
             </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2 uppercase italic tracking-tighter text-white">Trust <span className="text-accent">Orchestration</span></h2>
              <p className="text-muted-foreground">Managing cryptographic identity binding and continuous entity health.</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-accent/20 text-accent font-bold h-9"
                onClick={handleSimulateSync}
                disabled={isSimulating}
              >
                {isSimulating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Re-evaluate Fabric
              </Button>
              <Button 
                size="sm" 
                className="cyan-glow bg-accent text-background font-bold h-9"
                onClick={handleRunAIAudit}
                disabled={isAuditing}
              >
                {isAuditing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                Run AI Audit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">Entity Binding</Badge>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </div>
                <CardTitle className="text-lg mt-2 text-white">Rubelpay</CardTitle>
                <CardDescription className="text-xs font-bold uppercase">Drift Detected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-2 rounded bg-secondary/30 text-[10px] space-y-1">
                  <div className="flex justify-between"><span>Reg Score:</span> <span className="text-yellow-500">48%</span></div>
                  <div className="flex justify-between"><span>Jurisdiction:</span> <span className="text-white">Bangladesh</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">UBO Identity</Badge>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <CardTitle className="text-lg mt-2 text-white">Farid Sheikh</CardTitle>
                <CardDescription className="text-xs font-bold uppercase text-green-500">Verified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-2 rounded bg-secondary/30 text-[10px] space-y-1">
                  <div className="flex justify-between"><span>Identity Score:</span> <span className="text-green-500">98%</span></div>
                  <div className="flex justify-between"><span>Binding:</span> <span className="text-accent font-mono">Bound to 0xaf3c...</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">Settlement Tier</Badge>
                  <Lock className="h-4 w-4 text-red-500" />
                </div>
                <CardTitle className="text-lg mt-2 text-white">USDT Treasury</CardTitle>
                <CardDescription className="text-xs font-bold uppercase text-red-400">Limited Payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-[10px] space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <Scale className="h-3 w-3" /> ADAPTIVE CAP: $10,000 / Day
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <Tabs defaultValue="audit" className="space-y-6">
                <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
                  <TabsTrigger value="audit" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">AI Risk Analysis</TabsTrigger>
                  <TabsTrigger value="fabric" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">Fabric Map</TabsTrigger>
                </TabsList>

                <TabsContent value="audit" className="space-y-6 animate-fade-in">
                  {auditResult ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                      <Card className="glass-panel border-accent/20">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2 uppercase text-white">
                            <TrendingDown className="h-4 w-4 text-accent" />
                            Predicted Failures
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {auditResult.predictedFailures.map((failure: any, i: number) => (
                            <div key={i} className="p-3 rounded bg-red-500/5 border border-red-500/20 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-red-400 uppercase">{failure.type}</span>
                                <Badge variant="outline" className="text-[8px]">{Math.round(failure.probability * 100)}% Prob</Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground italic">"ETA: {failure.estimatedFailureDate}"</p>
                              <p className="text-[11px] text-white/90">{failure.reason}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="glass-panel border-blue-400/20">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2 uppercase text-white">
                            <Zap className="h-4 w-4 text-blue-400" />
                            Self-Healing Plan
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {auditResult.automatedRemediationPlan.map((step: any, i: number) => (
                             <div key={i} className="p-3 rounded bg-blue-400/5 border border-blue-400/20 space-y-1">
                                <div className="flex justify-between text-[9px] font-bold uppercase text-blue-400">
                                   <span>Task</span>
                                   <span>ETA: {step.eta}</span>
                                </div>
                                <p className="text-[11px] text-white">{step.fix}</p>
                             </div>
                           ))}
                           <Button className="w-full text-[10px] font-bold h-8 bg-blue-500 hover:bg-blue-600 text-white">
                              Execute All Fixes
                           </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="h-60 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-secondary/10 text-center space-y-4">
                       <BrainCircuit className="h-10 w-10 text-muted-foreground opacity-20" />
                       <p className="text-xs text-muted-foreground italic">Run AI Audit to identify regulatory drift and predicted failures.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="fabric" className="animate-fade-in">
                  <Card className="glass-panel border-white/5">
                    <CardHeader>
                      <CardTitle className="text-lg uppercase text-white italic">Cryptographic Binding Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-12 border border-white/5 rounded-2xl bg-secondary/10 relative">
                           <div className="flex flex-col items-center gap-3">
                              <div className="w-20 h-20 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/50 flex items-center justify-center">
                                <Building2 className="h-10 w-10 text-yellow-500" />
                              </div>
                              <span className="text-xs font-bold text-white uppercase">Legal Entity</span>
                           </div>
                           <div className="h-0.5 flex-1 bg-gradient-to-r from-yellow-500/50 to-green-500/50 relative" />
                           <div className="flex flex-col items-center gap-3">
                              <div className="w-20 h-20 rounded-xl bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                                <UserCheck className="h-10 w-10 text-green-500" />
                              </div>
                              <span className="text-xs font-bold text-white uppercase">Verified UBO</span>
                           </div>
                           <div className="h-0.5 flex-1 bg-gradient-to-r from-green-500 to-red-500/50 relative" />
                           <div className="flex flex-col items-center gap-3">
                              <div className="w-20 h-20 rounded-xl bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
                                <Wallet className="h-10 w-10 text-red-500" />
                              </div>
                              <span className="text-xs font-bold text-white uppercase">Bound Asset</span>
                           </div>
                        </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4">
                   <CardTitle className="text-xs flex items-center gap-2 uppercase text-white">
                      <ShieldAlert className="h-4 w-4 text-accent" />
                      Regulatory Drift
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                   <div className="text-center space-y-1">
                      <p className="text-3xl font-headline font-bold text-accent">{auditResult?.regulatoryDriftScore || '24'}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Drift Index</p>
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                         <span className="text-white/60">Jurisdiction Stability</span>
                         <span className="text-green-400">Stable</span>
                      </div>
                      <Progress value={82} className="h-1 bg-accent/10" />
                   </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                <CardHeader className="p-4">
                   <CardTitle className="text-xs uppercase text-white">Policy Adapters</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                   {auditResult?.policyAdaptationSuggestions.map((policy: string, i: number) => (
                     <div key={i} className="p-2 rounded bg-secondary/30 text-[10px] text-white/80 border border-white/5 italic">
                        {policy}
                     </div>
                   )) || (
                     <p className="text-[10px] text-muted-foreground italic">No policies identified.</p>
                   )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
