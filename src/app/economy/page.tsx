
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Coins, 
  TrendingUp, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Network, 
  RefreshCw,
  Search,
  Filter,
  Scale,
  Globe,
  ArrowUpRight,
  ShieldAlert,
  Cpu,
  Loader2,
  DollarSign,
  Gavel,
  PieChart,
  Milestone,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { simulateTrustEconomy } from "@/ai/flows/economy-simulator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const stabilityData = [
  { time: "00:00", micro: 88, meso: 82, macro: 90 },
  { time: "04:00", micro: 86, meso: 80, macro: 88 },
  { time: "08:00", micro: 92, meso: 85, macro: 91 },
  { time: "12:00", micro: 89, meso: 84, macro: 89 },
  { time: "16:00", micro: 94, meso: 88, macro: 92 },
  { time: "20:00", micro: 95, meso: 90, macro: 94 },
];

const chartConfig = {
  macro: {
    label: "Macro Stability",
    color: "hsl(var(--accent))",
  },
  meso: {
    label: "Meso Stability",
    color: "hsl(var(--primary))",
  },
  micro: {
    label: "Micro Stability",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function Project45EconomyPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const output = await simulateTrustEconomy({
        networkNodes: [
          { id: 'Global-Treasury', trustScore: 98, liquidityAvailable: 500000, layer: 'macro' },
          { id: 'Rubelpay-HQ', trustScore: 75, liquidityAvailable: 25000, layer: 'meso' },
          { id: 'Vendor-UK-01', trustScore: 88, liquidityAvailable: 12000, layer: 'micro' }
        ],
        activeCorridors: [
          { from: 'Rubelpay-HQ', to: 'Vendor-UK-01', throughput: 4500, latency: 124 }
        ],
        policyChanges: {
          creditExpansion: true,
          trustThresholdAdjustment: 80
        },
        marketTrend: 'volatile'
      });
      setResult(output);
      toast({
        title: "Fiscal Simulation Complete",
        description: `Civilization Stability Index: ${output.civilizationStabilityIndex}%`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Simulation Failed",
        description: "Eco Governance engine is under heavy compute load.",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-white">
              <Gavel className="h-5 w-5 text-accent" />
              Project 45: <span className="text-accent">Sovereign Eco Governance</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
              EXECUTION_MODE: ACTIVE
            </Badge>
            <Button size="sm" onClick={handleRunSimulation} disabled={isSimulating} className="cyan-glow text-xs font-bold bg-accent text-background px-4">
              {isSimulating ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Rocket className="h-3.5 w-3.5 mr-1.5" />}
              {isSimulating ? 'Analyzing...' : 'Execute Fiscal Audit'}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[10px] font-bold">
                 Fiscal Stability Protocol
              </Badge>
              <h2 className="text-4xl font-headline font-bold tracking-tighter uppercase italic">Sovereign <span className="text-accent">Economy</span></h2>
              <p className="text-muted-foreground max-w-2xl italic leading-relaxed">
                "Autonomous management of transaction fees, liquidity depth, and revenue yields to ensure long-term commercial sovereignty."
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Civilization Health</p>
              <p className="text-4xl font-headline font-bold text-accent">{result?.civilizationStabilityIndex || '94.2'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Fee Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-white">98.1%</div>
                <Progress value={98} className="h-1 mt-2 bg-accent/10 [&>div]:bg-accent" />
                <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-tighter">Avg. Txn Fee: $0.002</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Revenue Yield</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-white">3.5%</div>
                <p className="text-[9px] text-primary font-bold mt-2 uppercase">System Take Rate</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Liquidity Deepness</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-white">$4.2M</div>
                <p className="text-[9px] text-blue-400 font-bold mt-2 uppercase">Global Mesh Reserve</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-yellow-500 bg-yellow-500/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Compute ROI</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-white">1.4x</div>
                <Progress value={70} className="h-1 mt-2 bg-yellow-500/10 [&>div]:bg-yellow-500" />
                <p className="text-[9px] text-yellow-500 font-bold mt-2 uppercase">Revenue vs Node Cost</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel border-white/5 shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Activity className="h-5 w-5 text-accent" />
                  Stability Telemetry (L0 Sync)
                </CardTitle>
                <CardDescription className="text-[10px]">Multi-layer stability analysis across Micro, Meso, and Macro economic nodes.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px] w-full">
                  <ChartContainer config={chartConfig}>
                    <AreaChart data={stabilityData}>
                      <defs>
                        <linearGradient id="macroGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="macro" stroke="hsl(var(--accent))" strokeWidth={3} fill="url(#macroGradient)" name="Macro Stability" />
                      <Area type="monotone" dataKey="meso" stroke="hsl(var(--primary))" strokeWidth={2} fill="transparent" name="Meso Stability" />
                      <Area type="monotone" dataKey="micro" stroke="#60a5fa" strokeWidth={2} fill="transparent" name="Micro Stability" />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4 border-b border-white/5">
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                    <Scale className="h-4 w-4 text-accent" />
                    Execution Directives
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {result ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                        <p className="text-[11px] font-bold text-accent uppercase">Fiscal Forecast</p>
                        <p className="text-[10px] text-white/90 leading-relaxed italic">
                          "{result.policyImpactForecast}"
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Yield Optimization</p>
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-muted-foreground">Projected MRR Lift</span>
                          <span className="text-green-400">+$2,400</span>
                        </div>
                        <Progress value={65} className="h-1 bg-white/5" />
                      </div>
                      <Button className="w-full h-10 bg-accent text-background font-bold text-[10px] uppercase tracking-widest cyan-glow">
                         Deploy Scaling Policy
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3 opacity-30">
                      <Cpu className="h-10 w-10 mx-auto animate-pulse" />
                      <p className="text-[10px] uppercase font-bold tracking-widest">Awaiting Fiscal Simulation</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                 <CardHeader className="p-4 border-b border-white/5">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                       <ShieldAlert className="h-3 w-3 text-red-400" /> Commercial Guard
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-3">
                    <div className="p-2 rounded bg-secondary/30 text-[9px] text-white/70 italic leading-relaxed border border-white/5">
                       "Automatic fee surge active if node compute latency exceeds 500ms."
                    </div>
                    <div className="p-2 rounded bg-secondary/30 text-[9px] text-white/70 italic leading-relaxed border border-white/5">
                       "Stripe bridge is currently monitoring for payout anomalies in EU corridors."
                    </div>
                 </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <footer className="p-8 border-t border-white/5 text-center space-y-4">
           <div className="flex items-center justify-center gap-4">
              <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-accent/50" />
              <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase px-4 flex gap-2">
                 <Milestone className="h-3 w-3" /> Project 45 • Execution Mode
              </Badge>
              <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
           </div>
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Sovereign OS • Commercial Infrastructure v1.2
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
