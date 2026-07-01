
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
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
    status: "Active",
    icon: Cpu,
    date: "Current Focus",
    progress: 94,
    desc: "Autonomous fiscal management, automated reconciliation, and forensic auditing.",
    items: [
      "Automated Reconciliation Cron Job",
      "Forensic Anomaly Dashboard",
      "Derived Query Indexing (Phase 2.7)"
    ]
  },
  {
    id: "p4",
    title: "Phase 4: Global Execution & SaaS",
    status: "Upcoming",
    icon: Rocket,
    date: "Q3 2024",
    progress: 15,
    desc: "Commercial launch, multi-network payout hub, and anycast node-04 prioritization.",
    items: [
      "Multi-Currency Liquidity Bridge",
      "Commercial SaaS Billing Module",
      "B2B Outreach Automation (P43)"
    ]
  }
];

const READINESS_CHECKLIST = [
  { title: "Ledger Integrity", status: "Verified", icon: Lock, score: "100%" },
  { title: "Security Boundary", status: "Hardened", icon: ShieldCheck, score: "Optimal" },
  { title: "Self-Healing Mesh", status: "Active", icon: Activity, score: "Ready" },
  { title: "Compliance Audit", status: "Ready", icon: Gavel, score: "ISO 20022" },
];

export default function RoadmapPage() {
  const [isLaunching, setIsLaunching] = useState(false);
  const { emitEvent, setSystemMode } = useKernel();
  const { toast } = useToast();

  const handleLaunchProtocol = async () => {
    setIsLaunching(true);
    emitEvent('SECURITY', 'LAUNCH_PROTOCOL_INITIATED', 1, { trigger: 'MANUAL_AUTHORIZATION' });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSystemMode('NORMAL');
    setIsLaunching(false);
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
          <Badge variant="outline" className="text-accent border-accent/20 font-mono text-[10px]">
            VERSION: 1.2.0-STABLE
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
              "Building the gold standard for cross-border settlement and autonomous fiscal governance."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {READINESS_CHECKLIST.map((check, i) => (
              <Card key={i} className="glass-panel border-white/5 overflow-hidden group hover:border-accent/30 transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                      <check.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[8px] border-accent/20 text-accent uppercase font-bold">{check.status}</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{check.title}</p>
                    <p className="text-xl font-headline font-bold text-white">{check.score}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                             phase.progress === 100 ? "border-green-500/50 bg-green-500/10" : "border-white/10"
                           )}>
                             {phase.progress === 100 && <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />}
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

          <footer className="mt-24 p-10 rounded-3xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-bold text-white flex items-center justify-center md:justify-start gap-3">
                  <Rocket className="h-6 w-6 text-accent animate-pulse" />
                  Commercial Scaling Live
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Sovereign OS architecture is now hardened and ready for commercial volume. Transition to Production Mode to unlock live SWIFT/PayPal corridors.
                </p>
              </div>
              <Button 
                onClick={handleLaunchProtocol}
                disabled={isLaunching}
                className="cyan-glow bg-accent text-background font-bold h-14 px-10 uppercase tracking-widest text-xs shrink-0"
              >
                {isLaunching ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Rocket className="mr-2 h-4 w-4" />
                )}
                Initialize Global Launch
              </Button>
            </div>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
