
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Lock, 
  Scale, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3,
  Fingerprint,
  Zap,
  AlertTriangle,
  Network,
  Radar,
  Eye,
  ServerCrash,
  UserX
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

const trustTrendData = [
  { time: "09:00", score: 88, threats: 4 },
  { time: "10:00", score: 85, threats: 12 },
  { time: "11:00", score: 72, threats: 45 }, 
  { time: "12:00", score: 74, threats: 28 },
  { time: "13:00", score: 75, threats: 18 },
];

const chartConfig = {
  score: {
    label: "Trust Score",
    color: "hsl(var(--accent))",
  },
  threats: {
    label: "Threats",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export default function SecurityIntelligence() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-red-400">
              <ShieldAlert className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
              <span className="truncate">Security Command</span>
            </h1>
          </div>
          <Badge variant="destructive" className="animate-pulse bg-red-500/20 text-red-400 text-[8px] md:text-[10px] shrink-0">
             Active
          </Badge>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1">Threat Intelligence</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Global vector analysis and containment.</p>
            </div>
            <Button size="sm" variant="outline" className="w-full md:w-auto border-red-400/20 text-red-400 font-bold text-[10px] h-8">
              <ServerCrash className="mr-2 h-4 w-4" /> Isolate Nodes
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="glass-panel border-b-4 border-b-accent">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Trust Index</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">75.4</div>
                <div className="flex items-center gap-1 text-red-400 text-[10px] font-bold mt-1">
                  <TrendingUp className="h-3 w-3 rotate-180" /> -12.4%
                </div>
              </CardContent>
            </Card>

            {[
              { label: "DDoS", value: 98, color: "bg-green-500", icon: ShieldCheck },
              { label: "Probing", value: 45, color: "bg-yellow-500", icon: Eye },
              { label: "Identity", value: 82, color: "bg-accent", icon: Fingerprint },
            ].map((dim, i) => (
              <Card key={i} className="glass-panel">
                <CardHeader className="pb-2 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">{dim.label}</CardTitle>
                    <dim.icon className="h-3 w-3 opacity-50" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="text-xl font-bold">{dim.value}%</div>
                  <Progress value={dim.value} className={`h-1 [&>div]:${dim.color}`} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
             <Card className="xl:col-span-2 glass-panel">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <Activity className="h-4 w-4 text-accent" />
                    Global Threat Vectors
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="h-[250px] md:h-[350px] w-full">
                    <ChartContainer config={chartConfig}>
                      <AreaChart data={trustTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="score" stroke="hsl(var(--accent))" strokeWidth={2} fill="transparent" />
                        <Area type="monotone" dataKey="threats" stroke="hsl(var(--destructive))" strokeWidth={2} fill="transparent" />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="glass-panel border-red-500/20 bg-red-500/5">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xs flex items-center gap-2">
                      <Radar className="h-4 w-4 text-red-400" />
                      Isolation Sandbox
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                     <div className="p-3 rounded bg-black/20 border border-red-500/20 space-y-2">
                        <p className="text-[10px] font-bold text-red-400 uppercase">Probe Trapped</p>
                        <p className="text-[9px] text-muted-foreground leading-relaxed">
                          Node: PROXY-DE-77
                        </p>
                        <div className="flex gap-2">
                           <Button size="sm" className="h-7 text-[8px] bg-red-500 text-white flex-1">Isolate</Button>
                           <Button size="sm" variant="outline" className="h-7 text-[8px] flex-1">Monitor</Button>
                        </div>
                     </div>
                  </CardContent>
                </Card>
              </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
