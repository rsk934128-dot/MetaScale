"use client";

import Link from "next/link";
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  Network, 
  Waves, 
  DollarSign, 
  ArrowRight,
  Fingerprint,
  Activity,
  Cpu,
  Lock,
  ChevronRight,
  Gavel,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase";

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-background overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center cyan-glow">
            <span className="font-headline font-bold text-accent-foreground text-xl">S</span>
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter uppercase italic text-white">Sovereign OS</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Civic', 'Finance', 'Security', 'Infra'].map(item => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild className="cyan-glow bg-accent text-background font-bold uppercase text-[10px] tracking-widest h-10 px-6">
              <Link href="/dashboard">Control Plane <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white hover:text-accent">Login</Link>
              <Button asChild className="cyan-glow bg-accent text-background font-bold uppercase text-[10px] tracking-widest h-10 px-6">
                <Link href="/login">Establish Link</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <Badge variant="outline" className="mb-6 border-accent/20 text-accent uppercase tracking-[0.3em] px-4 py-1 text-[10px] font-bold animate-fade-in">
          Next-Gen Deterministic Infrastructure
        </Badge>
        <h1 className="text-6xl md:text-8xl font-headline font-bold text-white leading-[0.9] tracking-tighter mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          THE KERNEL OF <br />
          <span className="text-accent italic">SOVEREIGNTY</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Mission-critical operating system for the next generation of civic and financial infrastructure. Built with deterministic AI logic and high-clearance security protocols.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button asChild size="lg" className="cyan-glow bg-accent text-background font-bold uppercase text-xs tracking-widest h-14 px-10 rounded-full">
            <Link href={user ? "/dashboard" : "/login"}>
              Launch Control Plane
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-xs font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all">
            Read Whitepaper
          </Button>
        </div>
      </header>

      {/* Feature Mesh */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Waves, label: 'Civic', title: 'Intelligence Hub', desc: 'Real-time river health, flood risk analysis, and automated SOS dispatch protocols.', color: 'text-blue-400' },
          { icon: DollarSign, label: 'Finance', title: 'Fiscal Command', desc: 'Multi-rail settlement system with integrated AI for global economic governance.', color: 'text-green-400' },
          { icon: ShieldCheck, label: 'Security', title: 'Zero-Trust Mesh', desc: 'Continuous identity binding and threat vector analysis across a distributed grid.', color: 'text-red-400' },
          { icon: Network, label: 'Infra', title: '42-Node Anycast', desc: 'Self-healing infrastructure mesh with petahash compute power and anycast routing.', color: 'text-accent' }
        ].map((f, i) => (
          <Card key={i} className="glass-panel group hover:border-accent/40 transition-all duration-500 overflow-hidden border-white/5 animate-fade-in" style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}>
            <CardContent className="p-8 space-y-4">
              <div className={`p-3 rounded-xl bg-background border border-white/5 w-fit group-hover:scale-110 transition-transform ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{f.label} Plane</p>
                <h3 className="text-xl font-headline font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Detail Section: Civic */}
      <section id="civic" className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-white/5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <Badge variant="outline" className="border-blue-400/20 text-blue-400 uppercase tracking-widest px-3">Civic Plane Active</Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white leading-tight">
              Real-time Intelligence for <span className="text-blue-400">Civilization Resilience</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Monitoring critical environmentals and river health via geo-distributed sensors. When disaster strikes, SHURUKKHA-OS engages automated response protocols, dispatching resources to precise coordinates within milliseconds.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-2xl font-headline font-bold text-white">12%</p>
                <p className="text-xs uppercase font-bold text-muted-foreground">Current Flood Risk</p>
                <div className="h-1 w-full bg-blue-400/10 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-400" style={{ width: '12%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-headline font-bold text-white">4.2m</p>
                <p className="text-xs uppercase font-bold text-muted-foreground">Avg. River Level</p>
                <div className="h-1 w-full bg-blue-400/10 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-400" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative glass-panel rounded-3xl border-white/10 p-4 aspect-square flex items-center justify-center overflow-hidden">
               <Waves className="h-40 w-40 text-blue-400 animate-pulse" />
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #60a5fa 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Detail Section: Finance */}
      <section id="finance" className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative group">
            <div className="absolute inset-0 bg-green-400/20 rounded-3xl blur-[80px] opacity-20" />
            <div className="relative glass-panel rounded-3xl border-white/10 p-12 space-y-6">
               <div className="flex justify-between items-center pb-6 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Settlement Node-04</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-white">Fiscal Disbursement</span>
                    <span className="text-sm font-mono text-accent">$12,450.00</span>
                  </div>
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div className="h-full bg-accent animate-pulse" style={{ width: '100%' }} />
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-muted-foreground space-y-1">
                    <p className="text-accent">&gt;&gt;&gt; HANDSHAKE: SUCCESS</p>
                    <p>&gt;&gt;&gt; RAIL: PAYONEER_EU_PIS</p>
                    <p>&gt;&gt;&gt; SEAL: FALLBACK_P180_9921</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <Badge variant="outline" className="border-green-400/20 text-green-400 uppercase tracking-widest px-3">Finance Plane v1.2</Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white leading-tight">
              A Global Financial <span className="text-green-400">Control Surface</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Integrate directly with banking rails (PayPal, Priyo Pay, Payoneer) through the Sovereign Mesh. Our AI Orchestrator handles OAuth 2.0 exchanges, PSD2 compliance, and Imperial Directive seals for high-value disbursements automatically.
            </p>
            <ul className="space-y-4">
              {[
                { icon: Gavel, text: 'Predictive Compliance & KYB Sync' },
                { icon: Scale, text: 'Macro-Economic Stability Simulation' },
                { icon: Activity, text: 'Multi-Rail Liquidity Health Tracking' }
              ].map((li, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                   <li.icon className="h-5 w-5 text-accent" />
                   {li.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto glass-panel rounded-[3rem] border-accent/20 p-12 md:p-24 text-center space-y-8 overflow-hidden relative">
           <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
           <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter">
             READY TO ENTER THE <span className="text-accent">KERNEL?</span>
           </h2>
           <p className="text-lg text-muted-foreground max-w-xl mx-auto">
             Join the distributed anycast grid and take control of your infrastructure. Deterministic governance is one click away.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="cyan-glow bg-accent text-background font-bold uppercase text-xs tracking-widest h-14 px-12 rounded-full">
                <Link href={user ? "/dashboard" : "/login"}>
                  {user ? "Back to Console" : "Establish Identity"}
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="h-14 px-10 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-all">
                Contact Sovereign Core
              </Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="font-headline font-bold text-accent-foreground">S</span>
              </div>
              <span className="font-headline font-bold text-xl uppercase italic text-white">Sovereign</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              SHURUKKHA-OS: The deterministic operating system for the next digital economic civilization. Distributed via 42 anycast nodes globally.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
               <span className="text-accent">Active Version</span>
               <span>v1.2.0-stable</span>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Operational Planes</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="#" className="hover:text-accent">Civic Intelligence</Link></li>
              <li><Link href="#" className="hover:text-accent">Financial Sovereign</Link></li>
              <li><Link href="#" className="hover:text-accent">Security Intelligence</Link></li>
              <li><Link href="#" className="hover:text-accent">Infrastructure Mesh</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">System</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/roadmap" className="hover:text-accent">Roadmap</Link></li>
              <li><Link href="/login" className="hover:text-accent">Identity Link</Link></li>
              <li><Link href="#" className="hover:text-accent">API Docs</Link></li>
              <li><Link href="#" className="hover:text-accent">Legal Bound</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            © 2024 SOVEREIGN KERNEL ORCHESTRATION. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] uppercase font-bold text-green-500 tracking-tighter">System Nominal: 42 Nodes Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
