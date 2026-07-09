
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
  CheckCircle2,
  Waves,
  Milestone,
  Network,
  Users,
  Smartphone,
  Table as TableIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const UPAZILA_STATS = [
  { name: "Ullahpara", pop: "540,156", density: "1320", literacy: "43.6%" },
  { name: "Kazipur", pop: "274,679", density: "835", literacy: "37.5%" },
  { name: "Shahzadpur", pop: "561,076", density: "1731", literacy: "38.4%" },
  { name: "Sirajganj Sadar", pop: "555,155", density: "1734", literacy: "48.0%" },
  { name: "Belkuchi", pop: "352,835", density: "2221", literacy: "45.7%" },
];

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
          <div className="text-center space-y-8 py-10">
            <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-[0.4em] px-6 py-1.5 text-[10px] font-bold">
              Sirajganj District Pilot: 3,357,706 Citizens
            </Badge>
            <h2 className="text-6xl md:text-8xl font-headline font-bold text-white tracking-tighter uppercase leading-[0.8]">
              RESILIENT <br />
              <span className="text-accent italic font-light">FISCAL CORRIDORS</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed italic">
              "Governing a BDT 100 Crore dairy market and the 1,041-acre Sirajganj Economic Zone through deterministic ISO 20022 settlement architecture."
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
               <Button className="h-16 px-12 rounded-full bg-accent text-background font-bold uppercase text-xs tracking-widest cyan-glow">
                 Join Operational Pilot
               </Button>
               <Button variant="outline" className="h-16 px-12 rounded-full text-xs font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all text-white">
                 Download Regional Report
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="glass-panel border-t-4 border-t-accent bg-accent/5 hover:border-accent transition-all duration-500">
                <CardHeader>
                   <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20 w-fit mb-4">
                      <Building2 className="h-8 w-8 text-accent" />
                   </div>
                   <CardTitle className="text-2xl font-headline uppercase italic">Economic Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      Securing liquidity for the 1,041-acre Sirajganj Industrial Node. Integrated with 1,467 revenue mouzas across the district.
                   </p>
                   <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                         <span className="text-white/50">Household Coverage</span>
                         <span className="text-accent">842,308 Units</span>
                      </div>
                      <Progress value={85} className="h-1 bg-accent/10 [&>div]:bg-accent" />
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-t-4 border-t-primary bg-primary/5 hover:border-primary transition-all duration-500">
                <CardHeader>
                   <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 w-fit mb-4">
                      <Target className="h-8 w-8 text-primary" />
                   </div>
                   <CardTitle className="text-2xl font-headline uppercase italic">Dairy Market</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      Settling BDT 100 Crore+ annual dairy transactions. Powered by 33,000 खামারি (farmers) linked via NID Identity Binding.
                   </p>
                   <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                         <span className="text-white/50">Market Capture</span>
                         <span className="text-primary">BDT 100 Cr+</span>
                      </div>
                      <Progress value={92} className="h-1 bg-primary/10 [&>div]:bg-primary" />
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-t-4 border-t-green-500 bg-green-500/5 hover:border-green-500 transition-all duration-500">
                <CardHeader>
                   <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20 w-fit mb-4">
                      <Users className="h-8 w-8 text-green-500" />
                   </div>
                   <CardTitle className="text-2xl font-headline uppercase italic">Mass Adoption</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      Governing 3,357,706 citizens with an average household size of 3.93. Population density: 1,398/km² (Census 2022).
                   </p>
                   <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                         <span className="text-white/50">Serviceable Pop.</span>
                         <span className="text-green-500">3.3M+</span>
                      </div>
                      <Progress value={100} className="h-1 bg-green-500/10 [&>div]:bg-green-500" />
                   </div>
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
                <div className="space-y-2">
                   <Badge variant="outline" className="text-accent border-accent/20 uppercase tracking-widest text-[9px] font-bold">Regional Demographic Matrix</Badge>
                   <h3 className="text-4xl font-headline font-bold uppercase italic tracking-tighter">UPAZILA <span className="text-accent">DENSITY PROFILE</span></h3>
                </div>
                
                <div className="rounded-2xl border border-white/5 bg-secondary/20 overflow-hidden shadow-2xl">
                   <table className="w-full text-left">
                      <thead className="bg-white/5">
                         <tr>
                            <th className="p-4 text-[10px] font-bold uppercase text-muted-foreground">Sub-District</th>
                            <th className="p-4 text-[10px] font-bold uppercase text-muted-foreground">Population</th>
                            <th className="p-4 text-[10px] font-bold uppercase text-muted-foreground text-center">Density</th>
                            <th className="p-4 text-[10px] font-bold uppercase text-muted-foreground text-center">Literacy</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {UPAZILA_STATS.map((u, i) => (
                           <tr key={i} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 text-xs font-bold text-white">{u.name}</td>
                              <td className="p-4 text-xs text-white/70">{u.pop}</td>
                              <td className="p-4 text-xs text-center text-accent">{u.density}</td>
                              <td className="p-4 text-xs text-center text-white/50">{u.literacy}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             <Card className="glass-panel border-accent/20 bg-accent/5 p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="h-60 w-60 text-accent" /></div>
                <div className="relative z-10 space-y-8">
                   <h4 className="text-2xl font-headline font-bold uppercase text-accent italic tracking-tighter">Sovereign Synthesis</h4>
                   <div className="space-y-6">
                      {[
                        { title: "Anycast Stabilization", desc: "8.4ms global UX latency tier active across all 42 geo-distributed grid nodes." },
                        { title: "Hydrological Resilience", desc: "MY-BD Tunnel ensures 100% liquidity delivery during Jamuna monsoonal surges." },
                        { title: "Exactly-Once Mandate", desc: "Atomic Locking via Firestore prevents double-spending in regional hand-loom trades." },
                        { title: "BFIU/BB Compliance", desc: "Programmatic Identity Binding (NID/TIN) satisfies ISO 20022 and national AML rules." }
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
                </div>
             </Card>
          </div>

          <footer className="pt-20 border-t border-white/5 text-center space-y-6">
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-accent/50" />
                <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase px-4 flex gap-2">
                   <Building2 className="h-3 w-3" /> NOORNEXUS SIRAJGANJ HUB • © 2024
                </Badge>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-50 italic">
                Operational Node: London (Core) ↔ Sirajganj (Pilot) Mesh.
             </p>
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
