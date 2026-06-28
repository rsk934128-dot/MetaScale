
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
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ROADMAP_PHASES = [
  {
    id: "p1",
    title: "Phase 1: Genesis Kernel",
    status: "Completed",
    icon: ShieldCheck,
    date: "Q1 - Q2 2024",
    progress: 100,
    items: [
      "Deterministic Event Priority Engine v1.0",
      "Anycast Infrastructure Mesh (42 Nodes)",
      "Basic Civic SOS Dispatch Protocol",
      "Google Auth & Identity Binding"
    ]
  },
  {
    id: "p2",
    title: "Phase 2: Intelligence Plane",
    status: "In Progress",
    icon: Zap,
    date: "Q3 - Q4 2024",
    progress: 75,
    items: [
      "GenAI Flow Orchestrator (Genkit Integration)",
      "Multi-Rail Financial Disbursement (PayPal/Payoneer)",
      "Real-time River & Flood Intelligence",
      "Dynamic Trust Map & KYB Synchronization"
    ]
  },
  {
    id: "p3",
    title: "Phase 3: Autonomous Governance",
    status: "Upcoming",
    icon: Cpu,
    date: "Q1 2025",
    progress: 15,
    items: [
      "Self-Healing Network Grid (Auto-Rerouting)",
      "AI Council: Autonomous Agent Scaling Policies",
      "Predictive Compliance & Regulatory Drift Detection",
      "Zero-Trust Settlement Corridor Negotiation"
    ]
  },
  {
    id: "p4",
    title: "Phase 4: Civilization Stability",
    status: "Planned",
    icon: Globe,
    date: "Q2 - Q4 2025",
    progress: 0,
    items: [
      "Global Economic Governance Simulator (SEG-MLC)",
      "Macro-Stability Index for Inter-Entity Trade",
      "Fully Automated Disaster Recovery Orchestration",
      "Sovereign Consensus Protocol (SHURUKKHA-Chain)"
    ]
  }
];

export default function RoadmapPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Milestone className="h-5 w-5 text-accent" />
              OS Development Roadmap
            </h1>
          </div>
          <Badge variant="outline" className="text-accent border-accent/20">
            Current Version: v1.2.0-stable
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-headline font-bold">The Path to Sovereignty</h2>
            <p className="text-muted-foreground">
              Mapping the evolution of SHURUKKHA-OS from a core kernel to a globally distributed civilization-level intelligence mesh.
            </p>
          </div>

          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent before:via-primary before:to-secondary/20">
            {ROADMAP_PHASES.map((phase, idx) => (
              <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                {/* Icon Dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-accent bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 cyan-glow z-10">
                  <phase.icon className="h-5 w-5 text-accent" />
                </div>

                {/* Content Card */}
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel hover:border-accent/30 transition-all">
                  <CardHeader className="p-4 md:p-6 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge 
                        variant={phase.status === 'Completed' ? 'default' : phase.status === 'In Progress' ? 'outline' : 'secondary'}
                        className={cn(
                          "text-[10px] uppercase font-bold",
                          phase.status === 'Completed' && "bg-green-500/20 text-green-400 border-green-500/30",
                          phase.status === 'In Progress' && "border-accent/50 text-accent animate-pulse"
                        )}
                      >
                        {phase.status}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">{phase.date}</span>
                    </div>
                    <CardTitle className="text-xl font-headline">{phase.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                        <span>Phase Implementation</span>
                        <span>{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-1 bg-accent/10" />
                    </div>
                    
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                          <CheckCircle2 className={cn("h-4 w-4 shrink-0 mt-0.5", phase.status === 'Completed' ? "text-green-400" : "text-muted-foreground/40")} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 rounded-2xl bg-accent/5 border border-accent/20 text-center space-y-4">
            <Activity className="h-12 w-12 text-accent mx-auto animate-pulse" />
            <h3 className="text-2xl font-headline font-bold">Continuous Synchronization</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Sovereign OS is updated deterministically. New kernel patches are deployed via the 42-node anycast mesh every 24 hours to ensure civilization-level stability.
            </p>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
