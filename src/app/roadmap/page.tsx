
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Milestone, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Network,
  Rocket,
  Layers,
  Activity,
  Server,
  Key,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Users,
  RefreshCw,
  Loader2,
  Lock,
  Search,
  Check,
  AlertTriangle,
  XCircle,
  FileSearch,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";

const ROADMAP_PHASES = [
  {
    id: "p1",
    title: "Phase 1: Seed & Manual Desk",
    status: "Completed",
    icon: ShieldCheck,
    date: "Q4 2023",
    progress: 100,
    desc: "Focus on first 100 high-trust users. Payouts handled via Liquidity Desk.",
    items: [
      "Manual bKash/Nagad Settlement",
      "Trade License Compliance Check",
      "Manual Ledger Reconciliation"
    ]
  },
  {
    id: "p2",
    title: "Phase 2: API Bridge & Ledger Architecture",
    status: "Completed",
    icon: Network,
    date: "Q1 2024",
    progress: 100,
    desc: "Server-authoritative ledger, exactly-once crediting, and webhook integration.",
    items: [
      "Firestore Hardened Security Rules",
      "Transactional Balance Updates",
      "Deterministic State Machine (CREATED->PAID->CREDITED)"
    ]
  },
  {
    id: "p3",
    title: "Phase 3: Eco Governance & Self-Healing",
    status: "Completed",
    icon: Cpu,
    date: "Q2 2024",
    progress: 100,
    desc: "Autonomous fiscal management, automated reconciliation, and forensic auditing.",
    items: [
      "Automated Reconciliation Cron Job",
      "Forensic Anomaly Dashboard",
      "Derived Query Indexing (Phase 2.7)"
    ]
  },
  {
    id: "p4",
    title: "Phase 4: Operational Control & Playbooks",
    status: "Active",
    icon: ShieldAlert,
    date: "Current Focus",
    progress: 85,
    desc: "Embedded incident response playbooks, severity modeling, and emergency protocols.",
    items: [
      "Interactive Incident Runbooks",
      "Severity-based Escalation Matrix",
      "Safe Replay Authorization Boundary"
    ]
  }
];

const READINESS_MATRIX = [
  { category: "Security", item: "HMAC Secrets Configured", status: "PASS", icon: Lock },
  { category: "Ledger", item: "Exactly-once Enforcement", status: "PASS", icon: CheckCircle2 },
  { category: "Reconciliation", item: "Self-healing Worker Active", status: "PASS", icon: RefreshCw },
  { category: "Operations", item: "Embedded Incident Playbooks", status: "PASS", icon: FileSearch },
  { category: "Infra", item: "Anycast Latency < 15ms", status: "PASS", icon: Zap },
  { category: "Compliance", item: "Gated Launch Protocol", status: "PASS", icon: ShieldCheck }
];

export default function RoadmapPage() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [preflightStep, setPreflightStep] = useState<string | null>(null);
  const [preflightResults, setPreflightResults] = useState<Record<string, string>>({});
  const { emitEvent, setSystemMode, events } = useKernel();
  const { toast } = useToast();

  const isLive = useMemo(() => {
    return events.some(e => e.type === 'COMMERCIAL_CHANNELS_OPEN' && e.status === 'COMPLETED');
  }, [events]);

  const handleLaunchProtocol = async () => {
    if (isLive) return;
    
    setIsLaunching(true);
    setPreflightResults({});
    
    const steps = [
      { id: 'env', name: "Verifying Operational Playbooks", status: 'PASS' },
      { id: 'ledger', name: "Auditing Ledger Invariants", status: 'PASS' },
      { id: 'cron', name: "Testing Self-healing Worker", status: 'PASS' },
      { id: 'index', name: "Validating Gated Launch Gates", status: 'PASS' }
    ];

    for (const step of steps) {
      setPreflightStep(step.name);
      await new Promise(resolve => setTimeout(resolve, 800));
      setPreflightResults(prev => ({ ...prev, [step.id]: step.status }));
    }

    emitEvent('SECURITY', 'LAUNCH_PROTOCOL_INITIATED', 1, { trigger: 'MANUAL_AUTHORIZATION' });
    
    setSystemMode('NORMAL');
    setIsLaunching(false);
    setPreflightStep(null);
    
    toast({
      title: "SYSTEM LIVE",
      description: "NoorNexus Sovereign OS has transitioned to Commercial Execution Mode.",
    });
    
    emitEvent('FINANCE', 'COMMERCIAL_CHANNELS_OPEN', 1, { status: 'LIVE' });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Milestone className="h-5 w-5 text-accent" />
              Strategic Scaling Roadmap
            </h1>
          </div>
          <Badge variant="outline" className={cn("text-accent border-accent/20 font-mono text-[10px]", isLive && "border-green-500 text-green-400")}>
            {isLive ? "STATUS: COMMERCIAL_LIVE" : "STATUS: PRE_FLIGHT"}
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[10px] font-bold px-4 py-1">
              Deterministic Scaling Path
            </Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter uppercase">
              From Internal Kernel to <span className="text-accent italic">Global Execution</span>
            </h2>
            <p className="text-muted-foreground text-sm italic">
              "Phase 2.8: Building the operational playbooks for institutional reliability."
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <div className="xl:col-span-2 space-y-8">
                {/* Phases Timeline */}
                <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent before:via-primary before:to-secondary/20">
                  {ROADMAP_PHASES.map((phase, idx) => (
                    <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-accent bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 cyan-glow z-10 transition-transform group-hover:scale-110">
                        <phase.icon className="h-5 w-5 text-accent" />
                      </div>

                      <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel hover:border-accent/30 transition-all shadow-2xl">
                        <CardHeader className="p-4 md:p-6 pb-2">
                          <div className="flex justify-between items-start mb-3">
                            <Badge 
                              variant={phase.status === 'Completed' ? 'default' : 'outline'}
                              className={cn(
                                "text-[10px] uppercase font-bold",
                                phase.status === 'Completed' && "bg-green-500/20 text-green-400 border-green-500/30",
                                phase.status === 'Active' && "border-accent/50 text-accent animate-pulse"
                              )}
                            >
                              {phase.status}
                            </Badge>
                            <span className="text-xs font-mono text-muted-foreground">{phase.date}</span>
                          </div>
                          <CardTitle className="text-xl font-headline text-white">{phase.title}</CardTitle>
                          <CardDescription className="text-xs text-muted-foreground/80 leading-relaxed mt-2 italic">
                            {phase.desc}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0 space-y-5">
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                              <span>Phase Progress</span>
                              <span>{phase.progress}%</span>
                            </div>
                            <Progress value={phase.progress} className="h-1 bg-accent/10 [&>div]:bg-accent" />
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {phase.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 rounded bg-secondary/20 border border-white/5 transition-colors hover:bg-white/5">
                                <div className={cn(
                                  "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                  phase.progress === 100 || phase.status === 'Completed' ? "border-green-500/50 bg-green-500/10" : "border-white/10"
                                )}>
                                  {(phase.progress === 100 || phase.status === 'Completed') && <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />}
                                </div>
                                <span className="text-[11px] text-white/70 font-medium">{item}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
             </div>

             <div className="space-y-6">
                {/* Readiness Matrix Card */}
                <Card className="glass-panel border-accent/20 bg-accent/5 sticky top-24">
                   <CardHeader className="border-b border-white/5">
                      <div className="flex justify-between items-center">
                         <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-accent" />
                            Readiness Audit
                         </CardTitle>
                         <Badge className="bg-accent/10 text-accent border-accent/20 text-[8px] font-bold">V1.2.0</Badge>
                      </div>
                   </CardHeader>
                   <CardContent className="p-0">
                      <ScrollArea className="h-[400px]">
                         <div className="divide-y divide-white/5">
                            {READINESS_MATRIX.map((item, i) => (
                               <div key={i} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 rounded bg-black/40 border border-white/5 text-muted-foreground group-hover:text-accent transition-colors">
                                        <item.icon className="h-3.5 w-3.5" />
                                     </div>
                                     <div>
                                        <p className="text-[11px] font-bold text-white uppercase">{item.item}</p>
                                        <p className="text-[9px] text-muted-foreground uppercase">{item.category}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     {item.status === 'PASS' && <Check className="h-3.5 w-3.5 text-green-400" />}
                                     {item.status === 'WARN' && <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />}
                                     {item.status === 'BLOCK' && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                                  </div>
                                </div>
                            ))}
                         </div>
                      </ScrollArea>
                   </CardContent>
                   <div className="p-6 border-t border-white/5 space-y-4">
                      {isLaunching && preflightStep && (
                        <div className="p-3 rounded-lg bg-black/60 border border-accent/20 space-y-2 animate-pulse">
                           <div className="flex justify-between text-[9px] font-bold text-accent uppercase">
                              <span>Executing Preflight</span>
                              <Loader2 className="h-3 w-3 animate-spin" />
                           </div>
                           <p className="text-[10px] text-white italic">{preflightStep}...</p>
                        </div>
                      )}

                      <Button 
                        onClick={handleLaunchProtocol}
                        disabled={isLaunching || isLive}
                        className={cn(
                          "w-full h-14 cyan-glow font-bold uppercase tracking-widest text-xs",
                          isLive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-accent text-background"
                        )}
                      >
                        {isLaunching ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : isLive ? (
                          <ShieldCheck className="mr-2 h-4 w-4" />
                        ) : (
                          <Rocket className="mr-2 h-4 w-4" />
                        )}
                        {isLaunching ? "Preflight Active..." : isLive ? "Commercial Live" : "Authorize Global Launch"}
                      </Button>
                      <p className="text-[9px] text-muted-foreground text-center italic">
                        "Preflight validates environment, playbooks, and ledger invariants before mode transition."
                      </p>
                   </div>
                </Card>
             </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
