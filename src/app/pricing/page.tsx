
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Activity, 
  Lock, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Gem,
  Award,
  Terminal,
  Server
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const FEATURES = [
  { name: "Global Edge Network", hobby: true, pro: true, enterprise: true },
  { name: "Automatic CI/CD", hobby: true, pro: true, enterprise: true },
  { name: "WAF Protection", hobby: "Basic", pro: "Advanced", enterprise: "Managed" },
  { name: "DDoS Mitigation", hobby: true, pro: true, enterprise: true },
  { name: "Fluid Compute (Active CPU)", hobby: "4 hrs/mo", pro: "Unlimited*", enterprise: "Unlimited" },
  { name: "Team Collaboration", hobby: false, pro: true, enterprise: true },
  { name: "SLA Guarantee", hobby: false, pro: false, enterprise: "99.99%" },
  { name: "Advanced Support", hobby: false, pro: "Email", enterprise: "24/7 Dedicated" },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Gem className="h-5 w-5 text-accent" />
              Plans & Scalability
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            BILLING_SYSTEM: ACTIVE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-20">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter uppercase">
              Scale your app. <br />
              <span className="text-accent italic font-light">Control your costs.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
              "Start free. Upgrade to Pro for $20/month. Pay only for active compute and set your own spend limits."
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Hobby Plan */}
             <Card className="glass-panel border-white/5 flex flex-col group hover:border-white/20 transition-all">
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Hobby</CardTitle>
                   <CardDescription className="text-xs">The perfect starting place for your web app or personal project.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">Free</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Forever</p>
                   </div>
                   <ul className="space-y-3">
                      {["Import repo, deploy in seconds", "Automatic CI/CD", "Web Application Firewall", "Global, automated CDN"].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                           <Check className="h-4 w-4 text-accent" /> {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-8">
                   <Button variant="outline" className="w-full h-12 uppercase text-[10px] font-bold tracking-widest border-white/10">Get Started</Button>
                </CardFooter>
             </Card>

             {/* Pro Plan */}
             <Card className="glass-panel border-accent/40 bg-accent/5 flex flex-col relative overflow-hidden group hover:border-accent transition-all shadow-[0_0_50px_rgba(0,242,255,0.1)] scale-105">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                <div className="absolute top-4 right-4">
                   <Badge className="bg-accent text-background font-bold text-[8px] uppercase tracking-widest">Popular</Badge>
                </div>
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Pro</CardTitle>
                   <CardDescription className="text-xs">Everything you need to build and scale your app professionally.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">$20<span className="text-lg">/mo</span></p>
                      <p className="text-[10px] uppercase font-bold text-accent tracking-widest">+ additional usage</p>
                   </div>
                   <ul className="space-y-3">
                      {["$20 of included usage credit", "Advanced spend management", "Team collaboration & seats", "Faster builds + no queues", "Cold start prevention"].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-white/90">
                           <Check className="h-4 w-4 text-accent" /> {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-8">
                   <Button className="w-full h-12 bg-accent text-background font-bold uppercase text-[10px] tracking-widest cyan-glow">Start Pro Trial</Button>
                </CardFooter>
             </Card>

             {/* Enterprise Plan */}
             <Card className="glass-panel border-white/5 flex flex-col group hover:border-white/20 transition-all">
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Enterprise</CardTitle>
                   <CardDescription className="text-xs">Critical security, performance, and platform SLAs for global organizations.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">Custom</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Contact Sales</p>
                   </div>
                   <ul className="space-y-3">
                      {["Guest & Team access controls", "Managed WAF Rulesets", "Multi-region failover", "99.99% SLA", "Advanced 24/7 Support"].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                           <Check className="h-4 w-4 text-white/40" /> {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-8">
                   <Button variant="outline" className="w-full h-12 uppercase text-[10px] font-bold tracking-widest border-white/10">Book a Demo</Button>
                </CardFooter>
             </Card>
          </div>

          {/* Detailed Features Table */}
          <div className="space-y-8 pt-10">
             <div className="border-b border-white/5 pb-4">
                <h3 className="text-xl font-headline font-bold uppercase tracking-widest">Compare Plans</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-white/5">
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground">Feature</th>
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground text-center">Hobby</th>
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground text-center">Pro</th>
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground text-center">Enterprise</th>
                      </tr>
                   </thead>
                   <tbody>
                      {FEATURES.map((f, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                           <td className="py-6 text-sm font-medium text-white/80">{f.name}</td>
                           <td className="py-6 text-center">
                              {typeof f.hobby === 'boolean' ? (f.hobby ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-bold">{f.hobby}</span>}
                           </td>
                           <td className="py-6 text-center">
                              {typeof f.pro === 'boolean' ? (f.pro ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-bold text-accent">{f.pro}</span>}
                           </td>
                           <td className="py-6 text-center">
                              {typeof f.enterprise === 'boolean' ? (f.enterprise ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-bold">{f.enterprise}</span>}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Infrastructure Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
                { icon: Server, title: "Managed Infrastructure", desc: "Ultra-fast, secure by default global application delivery." },
                { icon: Lock, title: "Customizable Security", desc: "Protect your applications with customizable WAF rules." },
                { icon: Activity, title: "Observability", desc: "Real-time metrics to monitor, analyze, and manage usage." },
                { icon: Terminal, title: "DX Platform", desc: "Mission-critical developer workflows from code to production." }
             ].map((box, i) => (
               <Card key={i} className="glass-panel border-white/5 p-6 space-y-4">
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 w-fit text-accent">
                     <box.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase">{box.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{box.desc}</p>
               </Card>
             ))}
          </div>

          {/* Footer Commitment */}
          <footer className="pt-20 border-t border-white/5 text-center space-y-6">
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-accent/50" />
                <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase px-4">
                   Global Settlement Mesh • ISO 20022
                </Badge>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-50">
                Founded in London. Distributed Globally.
             </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
