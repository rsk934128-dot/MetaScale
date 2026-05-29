
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
  AlertCircle
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
        title: "Trust Fabric Sync Complete",
        description: "Recalculated Trust Score: 75.4. Settlement remains in 'Limited' tier.",
      });
    }, 2000);
  };

  const trustDimensions = {
    identity: 85,
    behavior: 92,
    governance: 48, // Low due to expired entity doc
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
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
              <h2 className="text-3xl font-headline font-bold mb-2">Trust Orchestration Hub</h2>
              <p className="text-muted-foreground">Managing cryptographic identity binding and continuous entity health.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-accent/20 text-accent font-bold"
              onClick={handleSimulateSync}
              disabled={isSimulating}
            >
              {isSimulating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Re-evaluate Trust Fabric
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">Entity Binding</Badge>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </div>
                <CardTitle className="text-lg mt-2">Rubelpay</CardTitle>
                <CardDescription className="text-xs font-bold uppercase">Drift Detected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-2 rounded bg-secondary/30 text-[10px] space-y-1">
                  <div className="flex justify-between"><span>Reg Score:</span> <span className="text-yellow-500">48%</span></div>
                  <div className="flex justify-between"><span>Jurisdiction:</span> <span>Bangladesh</span></div>
                </div>
                <Button size="sm" variant="outline" className="w-full text-[10px] h-7 border-dashed border-yellow-500/50">
                  Update Registration Evidence
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">UBO Identity</Badge>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <CardTitle className="text-lg mt-2">Farid Sheikh</CardTitle>
                <CardDescription className="text-xs font-bold uppercase text-green-500">Verified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-2 rounded bg-secondary/30 text-[10px] space-y-1">
                  <div className="flex justify-between"><span>Identity Score:</span> <span className="text-green-500">98%</span></div>
                  <div className="flex justify-between"><span>Binding:</span> <span className="text-accent font-mono">Bound to 0xaf3c...</span></div>
                </div>
                <Button size="sm" variant="outline" className="w-full text-[10px] h-7 border-dashed border-green-500/50">
                  Rotate Identity Proof
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-l-4 border-l-red-500 ring-2 ring-red-500/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px]">Settlement Tier</Badge>
                  <Lock className="h-4 w-4 text-red-500" />
                </div>
                <CardTitle className="text-lg mt-2">USDT Treasury</CardTitle>
                <CardDescription className="text-xs font-bold uppercase text-red-400">Limited Payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-[10px] space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <Scale className="h-3 w-3" /> ADAPTIVE CAP: $10,000 / Day
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    Restricted execution due to Entity Score Drift. Full tier requires score &gt; 80.
                  </p>
                </div>
                <Button className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                  Sign Identity-Asset Bind
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="fabric" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-white/5">
              <TabsTrigger value="fabric">Trust Fabric Graph</TabsTrigger>
              <TabsTrigger value="history">Trust Score History</TabsTrigger>
              <TabsTrigger value="sim">Simulation Board</TabsTrigger>
            </TabsList>

            <TabsContent value="fabric" className="space-y-6">
               <Card className="glass-panel">
                 <CardHeader>
                   <CardTitle className="text-lg">Cryptographic Binding Map</CardTitle>
                   <CardDescription>Visualizing the verified links between entities, identities, and financial assets.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-12 border border-white/5 rounded-2xl bg-secondary/10 relative">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-20 h-20 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/50 flex items-center justify-center">
                            <Building2 className="h-10 w-10 text-yellow-500" />
                          </div>
                          <span className="text-xs font-bold">Legal Entity</span>
                       </div>
                       <div className="h-0.5 flex-1 bg-gradient-to-r from-yellow-500/50 to-green-500/50 relative">
                          <Badge variant="outline" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] bg-background">Continuous Sync</Badge>
                       </div>
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-20 h-20 rounded-xl bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                            <UserCheck className="h-10 w-10 text-green-500" />
                          </div>
                          <span className="text-xs font-bold">Verified UBO</span>
                       </div>
                       <div className="h-0.5 flex-1 bg-gradient-to-r from-green-500 to-red-500/50 relative">
                          <Badge variant="outline" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] bg-background">Identity Bind</Badge>
                       </div>
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-20 h-20 rounded-xl bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center">
                            <Wallet className="h-10 w-10 text-red-500" />
                          </div>
                          <span className="text-xs font-bold">Bound Asset</span>
                       </div>
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
