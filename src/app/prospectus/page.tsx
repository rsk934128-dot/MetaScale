
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
  Award,
  ShieldAlert,
  Building2,
  CheckCircle2
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

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-20 pb-20">
          {/* Hero Vision Section */}
          <div className="text-center space-y-8 py-10">
            <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-[0.4em] px-6 py-1.5 text-[10px] font-bold">
              Mission Critical Infrastructure
            </Badge>
            <h2 className="text-6xl md:text-8xl font-headline font-bold text-white tracking-tighter uppercase leading-[0.8]">
              THE FUTURE OF <br />
              <span className="text-accent italic font-light">DIGITAL CIVILIZATIONS</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed italic">
              "Sovereign OS is more than an operating system. It is a deterministic financial grid designed to power the next generation of decentralized economies with AI-governed trust."
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
               <Button className="h-16 px-12 rounded-full bg-accent text-background font-bold uppercase text-xs tracking-widest cyan-glow">
                 Partner with NoorNexus
               </Button>
               <Button variant="outline" className="h-16 px-12 rounded-full text-xs font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all text-white">
                 Download Whitepaper
               </Button>
            </div>
          </div>

          {/* Strategic Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="glass-panel border-t-4 border-t-accent bg-accent/5 hover:border-accent transition-all duration-500">
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
                         <span className="text-white/50">Addressable Market</span>
                         <span className="text-accent">$1.2T</span>
                      </div>
                      <Progress value={78} className="h-1 bg-accent/10 [&>div]:bg-accent" />
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-t-4 border-t-primary bg-primary/5 hover:border-primary transition-all duration-500">
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
                         <span className="text-white/50">Automation Rate</span>
                         <span className="text-primary">94%</span>
                      </div>
                      <Progress value={94} className="h-1 bg-primary/10 [&>div]:bg-primary" />
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-t-4 border-t-green-500 bg-green-500/5 hover:border-green-500 transition-all duration-500">
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
                         <span className="text-white/50">Node Resilience</span>
                         <span className="text-green-500">OPTIMAL</span>
                      </div>
                      <Progress value={100} className="h-1 bg-green-500/10 [&>div]:bg-green-500" />
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Revenue Model Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
                <div className="space-y-2">
                   <Badge variant="outline" className="text-accent border-accent/20 uppercase tracking-widest text-[9px] font-bold">Revenue Dynamics</Badge>
                   <h3 className="text-4xl font-headline font-bold uppercase italic tracking-tighter">FINANCIAL <span className="text-accent">ENGINE</span></h3>
                   <p className="text-muted-foreground text-lg leading-relaxed">
                      Our diversified revenue model ensures long-term sustainability and exponential growth by capturing value at every layer of the settlement stack.
                   </p>
                </div>
                
                <div className="space-y-4">
                   {[
                     { label: "Marketplace Transaction Fee", value: "3.5%", icon: DollarSign, desc: "Collected on every P2P/B2B settlement." },
                     { label: "Cross-Border Payout Margin", value: "2.0%", icon: Globe, desc: "Liquidity yield on global disbursements." },
                     { label: "AI Governance SaaS (Enterprise)", value: "$5,000/mo", icon: Cpu, desc: "Managed compliance for institutions." }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-6 p-6 rounded-2xl border border-white/5 bg-secondary/20 hover:bg-white/5 transition-all group">
                        <div className="p-3 rounded-xl bg-background border border-white/10 text-accent group-hover:scale-110 transition-transform">
                           <item.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                           <p className="text-2xl font-headline font-bold text-white">{item.value}</p>
                           <p className="text-xs text-muted-foreground italic mt-1">{item.desc}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-accent transition-colors" />
                     </div>
                   ))}
                </div>
             </div>

             <Card className="glass-panel border-accent/20 bg-accent/5 p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="h-60 w-60 text-accent" /></div>
                <div className="relative z-10 space-y-8">
                   <h4 className="text-2xl font-headline font-bold uppercase text-accent italic tracking-tighter">Competitive Edge</h4>
                   <div className="space-y-6">
                      {[
                        { title: "First-to-Market", desc: "Proprietary deterministic DPE logic applied to real-time banking." },
                        { title: "Direct B2C Rails", desc: "Native integration with bKash/Nagad and global SWIFT corridors." },
                        { title: "Anycast Architecture", desc: "Sovereign node mesh ensuring 100% data residency compliance." },
                        { title: "Self-Healing Compliance", desc: "Automated forensic auditing and real-time risk mitigation." }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className="mt-1 h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40 text-accent font-bold text-xs shrink-0">
                             {i+1}
                           </div>
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-white uppercase">{item.title}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed italic">"{item.desc}"</p>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center gap-3 text-green-400 font-bold text-xs">
                         <CheckCircle2 className="h-4 w-4" />
                         ISO 20022 CERTIFIED • MIL-SPEC SECURITY
                      </div>
                   </div>
                </div>
             </Card>
          </div>

          {/* Footer Commitment */}
          <footer className="pt-20 border-t border-white/5 text-center space-y-6">
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-accent/50" />
                <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase px-4 flex gap-2">
                   <Building2 className="h-3 w-3" /> NOORNEXUS GLOBAL NODE • EST. 2024
                </Badge>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-50 italic">
                "In code we trust, by law we are bound." Founded in London.
             </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
