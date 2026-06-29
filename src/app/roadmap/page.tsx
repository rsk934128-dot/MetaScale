
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
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
    title: "Phase 2: API Bridge & Projects 42-44",
    status: "Completed",
    icon: Network,
    date: "Q1 2024",
    progress: 100,
    desc: "Global banking integration (14k nodes), Syntax Architect, and Data Enrichment.",
    items: [
      "Project 42: Sheikh Code Exchange",
      "Project 43: AI Syntax Architect",
      "Project 44: Data Enrichment Portal"
    ]
  },
  {
    id: "p3",
    title: "Phase 3: Eco Governance & P45",
    status: "Active",
    icon: Cpu,
    date: "Current Focus",
    progress: 85,
    desc: "Autonomous fiscal management, compute cost optimization, and institutional ISO 20022 ready.",
    items: [
      "Direct Bank Settlement Rails",
      "Sovereign Fiscal Command",
      "ISO 20022 Standard Audit"
    ]
  },
  {
    id: "p4",
    title: "Phase 4: Global Scaling & Execution",
    status: "Upcoming (Launch)",
    icon: Rocket,
    date: "Q3 2024",
    progress: 20,
    desc: "Commercial launch, Stripe/Elorus integration, and anycast node-04 prioritization for Enterprise.",
    items: [
      "Multi-Network Payout Hub",
      "Commercial SaaS Billing Live",
      "Global Liquidity Bridge Activation"
    ]
  }
];

const EXECUTION_METRICS = [
  { title: "Commercial Readiness", desc: "SaaS billing and contract modules.", status: "88%", icon: TrendingUp },
  { title: "Partner Integration", desc: "Stripe and Elorus API linkages.", status: "Pending", icon: Users },
  { title: "Node-04 Priority", desc: "Dedicated routing for Enterprise tier.", status: "Ready", icon: Server },
  { title: "Final Compliance", desc: "Global AML/KYB Forensic check.", status: "Ready", icon: ShieldAlert },
];

export default function RoadmapPage() {
  return (
    <div className="flex min-h-screen">
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
          <Badge variant="outline" className="text-accent border-accent/20">
            PHASE: EXECUTION_READY
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[10px] font-bold px-4 py-1">
              Deterministic Scaling Path
            </Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter">
              SYSTEM BUILDING TO <span className="text-accent italic">GLOBAL EXECUTION</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto italic">
              "From a sovereign internal kernel to a high-throughput commercial SaaS infrastructure."
            </p>
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
                        <div key={i} className="flex items-center gap-3 p-2 rounded bg-secondary/20 border border-white/5 group/item transition-colors hover:bg-white/5">
                           <div className={cn(
                             "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                             phase.progress === 100 ? "border-green-500/50 bg-green-500/10" : "border-white/10"
                           )}>
                             {phase.progress === 100 && <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />}
                           </div>
                           <span className="text-[11px] text-white/70 font-medium group-hover/item:text-white transition-colors">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-32 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-accent" />
                  Execution Readiness Audit
                </h3>
                <p className="text-sm text-muted-foreground">Commercial compliance and multi-network scaling verification.</p>
              </div>
              <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
                STATUS: READY_FOR_LAUNCH
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {EXECUTION_METRICS.map((check, i) => (
                 <Card key={i} className="glass-panel border-white/5 overflow-hidden group">
                   <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className={cn(
                           "p-2 rounded-lg bg-secondary/50 transition-colors",
                           check.status !== 'Pending' ? "text-accent" : "text-muted-foreground/50"
                         )}>
                            <check.icon className="h-5 w-5" />
                         </div>
                         <Badge className={cn(
                           "text-[9px] uppercase font-bold",
                           check.status !== 'Pending' ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-500"
                         )}>
                           {check.status}
                         </Badge>
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-white uppercase">{check.title}</p>
                         <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 italic">
                           {check.desc}
                         </p>
                      </div>
                   </CardContent>
                 </Card>
               ))}
            </div>
          </div>

          <footer className="mt-24 p-8 rounded-3xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-headline font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <Activity className="h-5 w-5 text-accent animate-pulse" />
                  Commercial Scalability
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Sovereign OS is now transitioning to global execution. High-throughput rails are active in the Finance Plane.
                </p>
              </div>
              <Button className="cyan-glow bg-accent text-background font-bold h-12 px-8 uppercase tracking-widest text-[10px] shrink-0">
                Execute Launch Protocol <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
