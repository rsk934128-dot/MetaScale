
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
  Rocket, 
  Lock, 
  Wallet, 
  ShieldHalf, 
  BarChart4, 
  HardDriveDownload, 
  AlertTriangle, 
  BrainCircuit, 
  Save, 
  CheckCircle2,
  ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo } from "react";
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
import { analyzeLiquidityDrift } from "@/ai/flows/liquidity-drift-analysis";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isAnalyzingDrift, setIsAnalyzingDrift] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [driftResult, setDriftResult] = useState<any>(null);
  const [reserveBalance, setReserveBalance] = useState(125000);
  
  const [recycleRate, setRecycleRate] = useState(42.5);
  const [tempRate, setTempRate] = useState(tempRate || 42.5);
  const [isAdjustingRecycle, setIsAdjustingRecycle] = useState(false);
  const [isSavingRecycle, setIsSavingRecycle] = useState(false);

  const { toast } = useToast();
  const { emitEvent, isAutonomousActive } = useKernel();
  const firestore = useFirestore();

  // Live Sync with Fiscal Events
  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('timestamp', 'desc'), limit(15));
  }, [firestore]);
  const { data: liveEvents } = useCollection<any>(eventsQuery);

  const fiscalEvents = useMemo(() => {
    return liveEvents?.filter(e => e.type === 'AUTO_YIELD_RECYCLED' || e.type === 'LIQUIDITY_SHIFT_EXECUTED') || [];
  }, [liveEvents]);

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
        title: "এআই নোড বর্তমানে হাই-লোড প্রসেসিং এ আছে।",
        description: "অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDriftAnalysis = async () => {
    setIsAnalyzingDrift(true);
    try {
      const output = await analyzeLiquidityDrift({
        nodeId: 'NODE-04-UK',
        currentLiquidity: 42000,
        transactionVelocity: 142,
        outboundPressure: 38000
      });
      setDriftResult(output);
      toast({
        title: "Drift Analysis Complete",
        description: `Drift Score: ${output.driftScore}. Action: ${output.rebalancingProtocol}`,
        variant: output.driftScore > 70 ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "এআই নোড বর্তমানে হাই-লোড প্রসেসিং এ আছে।",
        description: "অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
      });
    } finally {
      setIsAnalyzingDrift(false);
    }
  };

  const handleAllocateReserve = () => {
    setIsAllocating(true);
    setTimeout(() => {
      setReserveBalance(prev => prev + 4500);
      setIsAllocating(false);
      toast({
        title: "Reserve Allocated",
        description: "$4,500 has been shifted from Transaction Yield to Liquidity Reserve.",
      });
    }, 1500);
  };

  const handleConfirmRecycleRate = () => {
    setIsSavingRecycle(true);
    
    emitEvent('FINANCE', 'YIELD_RECYCLE_ADJUSTED', 2, { 
      oldRate: recycleRate, 
      newRate: tempRate,
      node: 'GLOBAL_MESH'
    });

    setTimeout(() => {
      setRecycleRate(tempRate);
      setIsSavingRecycle(false);
      setIsAdjustingRecycle(false);
      toast({
        title: "Recycle Policy Updated",
        description: `New yield recycling rate set to ${tempRate}% for all nodes.`,
      });
    }, 1200);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-white">
              <ShieldHalf className="h-5 w-5 text-accent" />
              Project 45: <span className="text-accent">Sovereign Eco Governance</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={cn("border-accent/20 text-accent font-mono text-[10px]", isAutonomousActive && "border-green-500 text-green-400")}>
              {isAutonomousActive ? "AUTONOMOUS_MODE: ACTIVE" : "FISCAL_READY: IDLE"}
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
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Recycled Yield</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-white">{recycleRate}%</div>
                <Progress value={recycleRate} className="h-1 mt-2 bg-accent/10 [&>div]:bg-accent" />
                <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-tighter">P45 Policy: Active Recycle</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Deterministic Yield</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">3.5%</div>
                <p className="text-[9px] text-primary font-bold mt-2 uppercase">System Take Rate</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-blue-400 bg-blue-400/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Liquidity Deepness</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">$4.2M</div>
                <p className="text-[9px] text-blue-400 font-bold mt-2 uppercase">Global Mesh Reserve</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-green-500 bg-green-500/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Reserve Allocator</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-white">${reserveBalance.toLocaleString()}</div>
                <Button variant="ghost" size="sm" className="h-7 text-[8px] uppercase font-bold mt-2 border border-green-500/20 text-green-400 hover:bg-green-500/10" onClick={handleAllocateReserve} disabled={isAllocating}>
                   {isAllocating ? <RefreshCw className="mr-1 h-2.5 w-2.5 animate-spin" /> : <Lock className="mr-1 h-2.5 w-2.5" />}
                   Add to Reserve
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="glass-panel border-white/5 shadow-2xl">
                <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest">
                      <Activity className="h-5 w-5 text-accent" />
                      Resource Allocation Intelligence
                    </CardTitle>
                    <CardDescription className="text-[10px]">Real-time compute shift based on node-level profitability and latency.</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-mono border-blue-400/30 text-blue-400">P45_DYNAMIC_MODE</Badge>
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

              <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
                   <div>
                      <CardTitle className="text-sm flex items-center gap-2 uppercase">
                        <BrainCircuit className="h-5 w-5 text-accent" />
                        Forensic Drift Analysis
                      </CardTitle>
                      <CardDescription className="text-[10px]">Real-time imbalance detection via Anycast Node-04</CardDescription>
                   </div>
                   <Button size="sm" className="h-8 bg-accent text-background font-bold text-[10px]" onClick={handleDriftAnalysis} disabled={isAnalyzingDrift}>
                      {isAnalyzingDrift ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <Zap className="h-3 w-3 mr-1.5" />}
                      {isAnalyzingDrift ? 'Detecting...' : 'Scan Drift'}
                   </Button>
                </CardHeader>
                <CardContent className="p-6">
                   {driftResult ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Mesh Drift Index</p>
                              <span className={cn("text-2xl font-headline font-bold", driftResult.driftScore > 50 ? 'text-red-400' : 'text-green-400')}>
                                {driftResult.driftScore}%
                              </span>
                           </div>
                           <Progress value={driftResult.driftScore} className={cn("h-1.5", driftResult.driftScore > 50 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500')} />
                           <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                              <p className="text-[9px] uppercase font-bold text-muted-foreground">AI Protocol Recommendation</p>
                              <p className="text-[11px] text-white italic leading-relaxed border-l-2 border-accent/30 pl-3">
                                 "{driftResult.recommendation}"
                              </p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 text-center">
                                 <p className="text-[9px] uppercase font-bold text-muted-foreground">Action Mode</p>
                                 <Badge className="bg-accent/20 text-accent text-[8px] mt-1 uppercase">{driftResult.rebalancingProtocol}</Badge>
                              </div>
                              <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 text-center">
                                 <p className="text-[9px] uppercase font-bold text-muted-foreground">Impact ETA</p>
                                 <p className="text-xs font-bold text-white mt-1 uppercase">{driftResult.estimatedImpactTime}</p>
                              </div>
                           </div>
                           <Button className="w-full h-10 bg-accent text-background font-bold text-[10px] uppercase tracking-widest cyan-glow">
                              Authorize AI Rebalancing
                           </Button>
                        </div>
                     </div>
                   ) : (
                     <div className="h-32 flex flex-col items-center justify-center opacity-30 italic text-xs">
                        Awaiting Forensic Scan Trigger...
                     </div>
                   )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4 border-b border-white/5">
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                    <Scale className="h-4 w-4 text-accent" />
                    Fiscal Recycler
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                       <p className="text-[11px] font-bold text-accent uppercase flex items-center gap-2">
                          <HardDriveDownload className="h-3 w-3" /> Liquidity Recycling
                       </p>
                       <p className="text-[10px] text-white/90 leading-relaxed italic">
                          "Currently recycling {recycleRate}% of transaction yield into Node-04 expansion and liquidity pools."
                       </p>
                    </div>
                    <Button 
                      className="w-full h-10 bg-accent text-background font-bold text-[10px] uppercase tracking-widest cyan-glow"
                      onClick={() => {
                        setTempRate(recycleRate);
                        setIsAdjustingRecycle(true);
                      }}
                    >
                       Adjust Recycle Rate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                 <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                       <History className="h-3.5 w-3.5 text-accent" /> Autonomous Log
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                       <div className="divide-y divide-white/5">
                          {fiscalEvents.length === 0 ? (
                            <div className="p-10 text-center text-[9px] uppercase text-muted-foreground opacity-30">Awaiting fiscal signals...</div>
                          ) : fiscalEvents.map((e, i) => (
                            <div key={i} className="p-3 space-y-1 group hover:bg-white/5">
                               <div className="flex justify-between items-center">
                                  <Badge variant="ghost" className="text-[7px] p-0 font-bold text-accent uppercase">{e.type.replace('_', ' ')}</Badge>
                                  <span className="text-[8px] font-mono text-muted-foreground">{new Date(e.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                               </div>
                               <p className="text-[10px] text-white/70 italic line-clamp-1">
                                  {e.type === 'AUTO_YIELD_RECYCLED' ? `Recycled $${e.payload.recycledToMesh.toFixed(2)} to Global Mesh.` : e.payload.reason}
                               </p>
                            </div>
                          ))}
                       </div>
                    </ScrollArea>
                 </CardContent>
              </Card>

              <Card className="glass-panel border-primary/20">
                 <CardHeader className="p-4">
                    <CardTitle className="text-[10px] uppercase font-bold text-primary flex items-center gap-2">
                       <BarChart4 className="h-3 w-3" /> Node Profitability
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-3">
                    <div className="space-y-1">
                       <div className="flex justify-between text-[8px] uppercase font-bold">
                          <span>EU Node (Node-04)</span>
                          <span className="text-green-400">+$2.4k / Day</span>
                       </div>
                       <Progress value={90} className="h-0.5 bg-white/5" />
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-[8px] uppercase font-bold">
                          <span>Asia Node (Node-22)</span>
                          <span className="text-accent">+$0.8k / Day</span>
                       </div>
                       <Progress value={40} className="h-0.5 bg-white/5" />
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
                 <Milestone className="h-3 w-3" /> Project 45 • Commercial Execution
              </Badge>
              <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
           </div>
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Sovereign OS • Project 45 Fiscal Command Architecture
           </p>
        </footer>
      </SidebarInset>

      <Dialog open={isAdjustingRecycle} onOpenChange={setIsAdjustingRecycle}>
        <DialogContent className="glass-panel border-accent/20 bg-background/95 p-0 overflow-hidden sm:max-w-md">
          <div className="bg-accent/10 p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <HardDriveDownload className="h-6 w-6 text-accent" />
              </div>
              <div>
                <DialogTitle className="text-xl font-headline italic uppercase tracking-tighter">Fiscal Recycle Policy</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Adjust Global Yield Recycling Threshold</DialogDescription>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Recycle Rate (%)</Label>
                <span className="text-3xl font-headline font-bold text-accent">{tempRate}%</span>
              </div>
              <Slider 
                value={[tempRate]} 
                onValueChange={(v) => setTempRate(v[0])} 
                max={100} 
                step={0.5} 
                className="py-4"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                <span>0% MIN</span>
                <span>100% MAX (FULL REINVESTMENT)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                Policy Impact Analysis
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                Increasing the rate to {tempRate}% will prioritize node expansion and liquidity depth over immediate profit distribution.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="flex-1 text-xs font-bold uppercase"
                onClick={() => setIsAdjustingRecycle(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-accent text-background font-bold uppercase text-xs cyan-glow"
                onClick={handleConfirmRecycleRate}
                disabled={isSavingRecycle}
              >
                {isSavingRecycle ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Authorize Policy
              </Button>
            </div>
          </div>

          <DialogFooter className="bg-secondary/30 p-4 border-t border-white/5 justify-center">
             <div className="flex items-center gap-2 opacity-40">
                <Lock className="h-3 w-3 text-accent" />
                <span className="text-[8px] uppercase font-bold tracking-widest">Kernel Authorization Required</span>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
