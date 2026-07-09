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
  Sparkles,
  Search,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DataEnrichmentPortal() {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentLogs, setEnrichmentLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const handleEnrichmentSync = () => {
    setIsEnriching(true);
    setEnrichmentLogs([]);
    
    const steps = [
      ">>> Initializing Project 44 Augmentation Rails...",
      ">>> Fetching Raw Banking Ingest from UBIL Core...",
      ">>> Running Real-time Sanitization on Node-04 (UK)...",
      ">>> Resolving Entities: Mapping 14k bank metadata...",
      ">>> Applying Project 43 Syntax: Injected ISO 20022 signing...",
      ">>> Predictive Analysis: Calculating liquidity drift...",
      ">>> L0 Persistence: Data enriched and archived."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setEnrichmentLogs(prev => [steps[i], ...prev]);
        i++;
      } else {
        clearInterval(interval);
        setIsEnriching(false);
        toast({
          title: "Enrichment Complete",
          description: "42 parameters per node successfully augmented.",
        });
      }
    }, 600);
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
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] text-[10px] font-bold">
                 Intelligence Augmentation Layer
              </Badge>
              <h2 className="text-4xl font-headline font-bold tracking-tighter uppercase italic text-white">Raw Data <span className="text-primary">Intelligence</span></h2>
              <p className="text-muted-foreground max-w-2xl italic leading-relaxed">
                "Transforming low-level banking events into enriched financial intelligence nodes using Project 44 rails and P43 syntax."
              </p>
            </div>
            <Button size="lg" className="blue-glow bg-primary text-white font-bold px-8 h-14" onClick={handleEnrichmentSync} disabled={isEnriching}>
              {isEnriching ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
              {isEnriching ? "Enriching Mesh..." : "Trigger Data Enrichment"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase tracking-widest text-primary font-bold">Metadata Density</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                   <div className="text-4xl font-headline font-bold text-white">92.4%</div>
                   <Progress value={92} className="h-1 bg-primary/10 [&>div]:bg-primary" />
                   <p className="text-[9px] text-muted-foreground italic mt-2 uppercase tracking-tighter">Mapping 42 parameters per node.</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase tracking-widest text-accent font-bold">Merchant Taxonomy</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-headline font-bold text-white">14.2k</div>
                   <p className="text-[9px] text-muted-foreground italic mt-2 uppercase tracking-tighter">Nodes mapped in Sovereign Grid.</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Entity Resolution</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-headline font-bold text-white">100%</div>
                   <p className="text-[9px] text-muted-foreground italic mt-2 uppercase tracking-tighter">Deterministic identity sync.</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-yellow-500 bg-yellow-500/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase tracking-widest text-yellow-500 font-bold">Predictive Confidence</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-headline font-bold text-white">94.8%</div>
                   <p className="text-[9px] text-muted-foreground italic mt-2 uppercase tracking-tighter">Based on P43 logic trace.</p>
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <Card className="glass-panel border-white/5 h-[500px] flex flex-col">
                  <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
                     <div>
                        <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2 text-white">
                           <Layers className="h-4 w-4 text-primary" />
                           Live Enrichment Pipeline
                        </CardTitle>
                        <CardDescription className="text-[10px]">Processing raw banking ingest into L0 Intelligence Nodes</CardDescription>
                     </div>
                     <Badge variant="outline" className="text-[8px] font-mono border-green-500/30 text-green-500">REALTIME_SYNC</Badge>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 flex flex-col">
                     {enrichmentLogs.length > 0 ? (
                        <ScrollArea className="flex-1 p-6 bg-black/40">
                           <div className="font-mono text-[11px] space-y-2">
                              {enrichmentLogs.map((log, i) => (
                                 <p key={i} className={cn("animate-fade-in", log.startsWith('!') ? "text-red-400" : log.startsWith('>') ? "text-primary italic" : "text-white/60")}>
                                    {log}
                                 </p>
                              ))}
                           </div>
                        </ScrollArea>
                     ) : (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-20">
                           <Database className="h-16 w-16 text-primary animate-pulse" />
                           <p className="text-sm font-bold uppercase tracking-[0.4em] text-white">Awaiting Enrichment Trigger...</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-primary/20 bg-primary/5 shadow-2xl">
                  <CardHeader>
                     <CardTitle className="text-xs uppercase flex items-center gap-2 text-white">
                        <Cpu className="h-4 w-4 text-primary" />
                        P43 Syntax Feedback
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p className="text-[11px] text-white/90 italic leading-relaxed border-l-2 border-primary/30 pl-3">
                        "Data Enrichment Layer 02 is now consuming ISO 20022 compliant signing logic from the Syntax Architect library."
                     </p>
                     <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                           <span className="text-white/60">Logic Source</span>
                           <span className="text-accent">PROJECT_43_SDK</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                           <span className="text-white/60">Integration</span>
                           <span className="text-green-400">NOMINAL</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                  <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-tighter flex items-center gap-2 text-white">
                       <TrendingUp className="h-3 w-3 text-accent" />
                       Intelligence Drift
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span className="text-white/60">Sanitization Quality</span>
                        <span className="text-accent">98.2%</span>
                      </div>
                      <Progress value={98} className="h-1 bg-accent/10 [&>div]:bg-accent" />
                    </div>
                    <div className="p-2 rounded bg-secondary/30 text-[9px] text-white/60 italic leading-relaxed border border-white/5">
                      "Entity resolution has successfully merged 4,200 redundant profiles."
                    </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>

        <footer className="p-8 border-t border-white/5 text-center space-y-4">
           <div className="flex items-center justify-center gap-4">
              <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-primary/50" />
              <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px] uppercase px-4">
                 Project 44 • Data Enrichment Pipeline
              </Badge>
              <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-primary/50" />
           </div>
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              Synchronized with Project 43 Syntax Rails • NoorNexus Sovereign OS
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
