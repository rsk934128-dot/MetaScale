
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Zap, 
  Globe, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Rocket,
  Layers,
  Cpu,
  Fingerprint,
  ArrowRight,
  Gem,
  Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ProspectusPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Gem className="h-5 w-5 text-accent" />
              Sovereign OS Prospectus v1.2
            </h1>
          </div>
          <Badge className="bg-accent text-background font-bold uppercase tracking-widest">
            Investment Grade
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-16">
          {/* Hero Vision Section */}
          <div className="text-center space-y-6">
            <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-[0.4em] px-6 py-1.5 text-[10px] font-bold">
              Mission Critical Infrastructure
            </Badge>
            <h2 className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter uppercase leading-[0.9]">
              THE FUTURE OF <br />
              <span className="text-accent italic">DIGITAL CIVILIZATIONS</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sovereign OS is more than an operating system. It is a deterministic financial grid designed to power the next generation of decentralized economies with AI-governed trust.
            </p>
            <div className="flex justify-center gap-4 pt-4">
               <Button className="h-14 px-10 rounded-full bg-accent text-background font-bold uppercase text-xs tracking-widest cyan-glow">
                 Partner with Us
               </Button>
               <Button variant="outline" className="h-14 px-10 rounded-full text-xs font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all text-white">
                 Download Whitepaper
               </Button>
            </div>
          </div>

          {/* Strategic Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="glass-panel border-t-4 border-t-accent bg-accent/5">
                <CardHeader>
                   <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20 w-fit mb-4">
                      <Target className="h-8 w-8 text-accent" />
                   </div>
                   <CardTitle className="text-2xl font-headline uppercase italic">Market Opportunity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      Targeting the $420B emerging fintech sector by providing deterministic infrastructure for bKash, Nagad, and global Mastercard rails.
                   </p>
                   <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                         <span>Addressable Market</span>
                         <span className="text-accent">$1.2T</span>
                      </div>
                      <Progress value={78} className="h-1 bg-accent/10" />
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-t-4 border-t-primary bg-primary/5">
                <CardHeader>
                   <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 w-fit mb-4">
                      <Zap className="h-8 w-8 text-primary" />
                   </div>
                   <CardTitle className="text-2xl font-headline uppercase italic">AI Governance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      Utilizing Genkit and Gemini to automate risk assessment and cross-border settlements with 99.9% deterministic accuracy.
                   </p>
                   <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                         <span>Automation Rate</span>
                         <span className="text-primary">94%</span>
                      </div>
                      <Progress value={94} className="h-1 bg-primary/10" />
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-t-4 border-t-green-500 bg-green-500/5">
                <CardHeader>
                   <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20 w-fit mb-4">
                      <ShieldCheck className="h-8 w-8 text-green-500" />
                   </div>
                   <CardTitle className="text-2xl font-headline uppercase italic">Zero-Trust Mesh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      Every transaction is cryptographically signed and distributed across 42 anycast nodes, ensuring total fiscal sovereignty.
                   </p>
                   <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                         <span>Node Resilience</span>
                         <span className="text-green-500">OPTIMAL</span>
                      </div>
                      <Progress value={100} className="h-1 bg-green-500/10" />
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Revenue Model Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                <div className="space-y-2">
                   <h3 className="text-3xl font-headline font-bold uppercase italic tracking-tighter">FINANCIAL <span className="text-accent">DYNAMICS</span></h3>
                   <p className="text-muted-foreground">Our diversified revenue model ensures long-term sustainability and exponential growth.</p>
                </div>
                
                <div className="space-y-6">
                   {[
                     { label: "Marketplace Transaction Fee", value: "3.5%", icon: DollarSign },
                     { label: "Cross-Border Payout Margin", value: "2.0%", icon: Globe },
                     { label: "AI Governance SaaS (Enterprise)", value: "$5,000/mo", icon: Cpu }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-6 p-4 rounded-2xl border border-white/5 bg-secondary/20 hover:bg-white/5 transition-colors">
                        <div className="p-2 rounded-xl bg-background border border-white/10 text-accent">
                           <item.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                           <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                           <p className="text-xl font-headline font-bold text-white">{item.value}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-white/20" />
                     </div>
                   ))}
                </div>
             </div>

             <Card className="glass-panel border-accent/20 bg-accent/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="h-40 w-40 text-accent" /></div>
                <div className="relative z-10 space-y-6">
                   <h4 className="text-xl font-headline font-bold uppercase text-accent">Competitive Advantage</h4>
                   <ul className="space-y-4">
                      {[
                        "First-to-market with deterministic DPE logic.",
                        "Direct integration with bKash/Nagad B2C rails.",
                        "Sovereign node architecture with anycast routing.",
                        "Real-time AI compliance and self-healing protocols."
                      ].map((text, i) => (
                        <li key={i} className="flex items-start gap-3">
                           <Badge variant="outline" className="mt-1 h-5 w-5 rounded-full p-0 flex items-center justify-center border-accent/40 text-accent font-bold">
                             {i+1}
                           </Badge>
                           <span className="text-sm text-white/90 leading-relaxed italic">"{text}"</span>
                        </li>
                      ))}
                   </ul>
                </div>
             </Card>
          </div>

          {/* Footer Commitment */}
          <footer className="pt-20 border-t border-white/5 text-center space-y-6">
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-accent/50" />
                <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase px-4">
                   EST. 2024 • S.K.O. KERNEL
                </Badge>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-50">
                In code we trust, by law we are bound.
             </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
