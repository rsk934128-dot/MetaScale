
"use client";

import { useState } from "react";
import { 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  DollarSign, 
  Globe, 
  ChevronRight,
  LayoutGrid,
  Search,
  MessageSquare,
  Activity,
  Milestone
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";

const QUICK_LINKS = [
  { 
    label: "Sovereign AI Chat", 
    href: "/intelligence", 
    icon: BrainCircuit, 
    color: "text-primary", 
    desc: "Ask the OS for strategic advice." 
  },
  { 
    label: "Shurukkha Standard", 
    href: "/shurukkha-standard", 
    icon: ShieldCheck, 
    color: "text-accent", 
    desc: "Compliance & verification portal." 
  },
  { 
    label: "Fiscal Command", 
    href: "/finance", 
    icon: DollarSign, 
    color: "text-green-400", 
    desc: "Manage global payouts instantly." 
  },
  { 
    label: "System Roadmap", 
    href: "/roadmap", 
    icon: Milestone, 
    color: "text-yellow-400", 
    desc: "Check execution readiness status." 
  }
];

export function GlobalQuickAccess() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="h-14 w-14 rounded-full bg-primary text-white shadow-2xl blue-glow animate-float hover:scale-110 transition-transform group p-0 border-2 border-primary/20"
            title="Open Sovereign Core"
          >
            <Logo size="sm" animated={true} className="text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-background/95 backdrop-blur-2xl border-white/5 p-0 overflow-hidden sm:rounded-3xl shadow-[0_0_100px_rgba(99,102,241,0.15)]">
          <div className="bg-primary/10 p-8 border-b border-white/10 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Zap className="h-40 w-40 text-white" />
             </div>
             <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30">
                  <LayoutGrid className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                   <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter text-white">Sovereign Core</DialogTitle>
                   <DialogDescription className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/60">Universal Access Portal</DialogDescription>
                </div>
             </div>
          </div>

          <div className="p-6 space-y-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Quick navigate nodes..." 
                  className="w-full bg-secondary/30 border border-white/5 h-12 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
             </div>

             <div className="grid grid-cols-1 gap-2">
                {QUICK_LINKS.map((link, i) => (
                  <Button 
                    key={i} 
                    asChild 
                    variant="ghost" 
                    className="h-auto p-4 justify-start hover:bg-white/5 border border-transparent hover:border-white/5 rounded-2xl transition-all group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={link.href} className="flex items-center gap-4 w-full">
                       <div className={cn("p-2.5 rounded-xl bg-background border border-white/5 transition-transform group-hover:scale-110", link.color)}>
                          <link.icon className="h-5 w-5" />
                       </div>
                       <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{link.label}</p>
                          <p className="text-[10px] text-muted-foreground italic">{link.desc}</p>
                       </div>
                       <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-primary transition-colors" />
                    </Link>
                  </Button>
                ))}
             </div>
          </div>

          <div className="p-4 bg-secondary/20 border-t border-white/5 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Mesh Active</span>
             </div>
             <Badge variant="outline" className="text-[8px] border-primary/20 text-primary uppercase font-mono">v1.2.0-stable</Badge>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
