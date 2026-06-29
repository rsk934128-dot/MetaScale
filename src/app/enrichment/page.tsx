"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Database, 
  Zap, 
  Activity, 
  ShieldCheck, 
  BarChart3, 
  TrendingUp,
  Cpu,
  RefreshCw,
  Milestone,
  ArrowRight,
  Layers,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DataEnrichmentPortal() {
  const [isEnriching, setIsEnriching] = useState(false);
  const { toast } = useToast();

  const handleEnrichmentSync = () => {
    setIsEnriching(true);
    setTimeout(() => {
      setIsEnriching(false);
      toast({
        title: "Data Enrichment Complete",
        description: "Banking transaction nodes augmented with merchant categorization and risk scoring.",
      });
    }, 2500);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
              <Database className="h-5 w-5 text-primary" />
              Project 44: Data Enrichment Portal
            </h1>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px]">
            DATA_AUGMENTATION: ACTIVE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-headline font-bold tracking-tighter uppercase italic">Raw Data <span className="text-primary">Intelligence</span></h2>
              <p className="text-muted-foreground max-w-2xl">"Transforming low-level banking events into enriched financial intelligence nodes using Project 44 rails."</p>
            </div>
            <Button size="lg" className="blue-glow bg-primary text-white font-bold px-8 h-14" onClick={handleEnrichmentSync} disabled={isEnriching}>
              {isEnriching ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
              {isEnriching ? "Enriching Mesh..." : "Trigger Data Enrichment"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
                <CardHeader>
                   <CardTitle className="text-xs uppercase tracking-widest text-primary font-bold">Metadata Density</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="text-4xl font-headline font-bold text-white">92.4%</div>
                   <Progress value={92} className="h-1 bg-primary/10 [&>div]:bg-primary" />
                   <p className="text-[10px] text-muted-foreground italic">Enrichment Layer 02 is mapping 42 parameters per node.</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
                <CardHeader>
                   <CardTitle className="text-xs uppercase tracking-widest text-accent font-bold">Merchant Taxonomy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="text-4xl font-headline font-bold text-white">14.2k</div>
                   <p className="text-[10px] text-muted-foreground italic">Recognized merchant nodes in the Sovereign Grid.</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
                <CardHeader>
                   <CardTitle className="text-xs uppercase tracking-widest text-green-400 font-bold">Audit Accuracy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="text-4xl font-headline font-bold text-white">100%</div>
                   <p className="text-[10px] text-muted-foreground italic">Deterministic reconciliation with Level 0 Ledger.</p>
                </CardContent>
             </Card>
          </div>

          <Card className="glass-panel">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Live Enrichment Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 text-center space-y-6 opacity-30">
               <Database className="h-16 w-16 mx-auto text-primary animate-pulse" />
               <p className="text-sm font-bold uppercase tracking-[0.4em]">Initializing Augmentation Rails...</p>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
}
