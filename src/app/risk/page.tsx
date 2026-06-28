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
import { ChartTooltipContent } from "@/components/ui/chart";

const trustTrendData = [
  { time: "09:00", score: 88, threats: 4 },
  { time: "10:00", score: 85, threats: 12 },
  { time: "11:00", score: 72, threats: 45 }, 
  { time: "12:00", score: 74, threats: 28 },
  { time: "13:00", score: 75, threats: 18 },
];

export default function SecurityIntelligence() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              Security Intelligence Command (SIC)
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Threat Posture</p>
                <p className="text-sm font-bold text-yellow-400">Elevated Probing</p>
             </div>
             <Badge variant="destructive" className="animate-pulse bg-red-500/20 text-red-400 border-red-500/30">
                <Radar className="mr-1 h-3 w-3" /> Counter-Intel Active
             </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Threat Intelligence & Risk</h2>
              <p className="text-muted-foreground">Global vector analysis, identity fingerprinting, and automated threat containment.</p>
            </div>
            <Button size="sm" variant="outline" className="border-red-400/20 text-red-400 font-bold hover:bg-red-400/10">
              <ServerCrash className="mr-2 h-4 w-4" /> Isolate Suspicious Nodes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-b-4 border-b-accent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Fingerprint className="h-12 w-12" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Unified Trust Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">75.4</div>
                <div className="flex items-center gap-1 text-red-400 text-xs font-bold mt-1">
                  <TrendingUp className="h-3 w-3 rotate-180" /> -12.4% Drift Detected
                </div>
              </CardContent>
            </Card>

            {[
              { label: "DDoS Resistance", value: 98, status: "Optimal", color: "bg-green-500", icon: ShieldCheck },
              { label: "API Probing", value: 45, status: "Warning", color: "bg-yellow-500", icon: Eye },
              { label: "Identity Integrity", value: 82, status: "Validated", color: "bg-accent", icon: Fingerprint },
            ].map((dim, i) => (
              <Card key={i} className="glass-panel">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground">{dim.label}</CardTitle>
                    <dim.icon className="h-3 w-3 text-muted-foreground opacity-50" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-white">{dim.value}%</span>
                    <Badge variant="outline" className="text-[9px] mb-1">{dim.status}</Badge>
                  </div>
                  <Progress value={dim.value} className={`h-1 ${dim.status === 'Warning' ? '[&>div]:bg-yellow-500' : dim.status === 'Optimal' ? '[&>div]:bg-green-500' : '[&>div]:bg-accent'}`} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <Card className="xl:col-span-2 glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent" />
                    Global Threat Vectors vs Trust
                  </CardTitle>
                  <CardDescription>Correlation between external attack probes and organizational integrity signals.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trustTrendData}>
                        <defs>
                          <linearGradient id="trustGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={3} 
                          fill="url(#trustGradient)" 
                          name="Trust Score"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="threats" 
                          stroke="hsl(var(--destructive))" 
                          strokeWidth={2} 
                          fill="url(#threatGradient)" 
                          name="Detected Probes"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="glass-panel border-red-500/20 bg-red-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Radar className="h-4 w-4 text-red-400" />
                      Intelligence Isolation Sandbox
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="p-3 rounded-lg bg-black/20 border border-red-500/20 space-y-2">
                        <p className="text-[11px] font-bold text-red-400 uppercase">Suspicious API Probe Trapped</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          Incoming requests from node <strong>PROXY-DE-77</strong> are being routed to a synthetic shadow environment. 
                        </p>
                        <div className="flex gap-2">
                           <Button size="sm" className="h-7 text-[9px] bg-red-500 text-white flex-1">Isolate Node</Button>
                           <Button size="sm" variant="outline" className="h-7 text-[9px] flex-1">Monitor Flow</Button>
                        </div>
                     </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Fingerprint className="h-4 w-4 text-accent" />
                      UBO Identity Fingerprinting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     {[
                       { user: "Farid Sheikh", status: "Verified", cert: "RSA-4096-S1", load: 100 },
                       { user: "System Admin", status: "TOTP-Verified", cert: "MFA-GATE-A", load: 100 },
                       { user: "Guest Proxy", status: "UNTRUSTED", cert: "NONE", load: 0 }
                     ].map((item, i) => (
                       <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-2">
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-white">{item.user}</span>
                             <Badge className={item.status === 'Verified' ? "bg-accent/20 text-accent" : item.status === 'UNTRUSTED' ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"}>
                               {item.status}
                             </Badge>
                          </div>
                          <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                            <span>Fingerprint: {item.cert}</span>
                            <span className={item.load === 100 ? 'text-green-400' : 'text-red-400'}>{item.load}% Match</span>
                          </div>
                       </div>
                     ))}
                  </CardContent>
                </Card>
              </div>
          </div>

          <Card className="glass-panel">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm">Active Threat Intelligence Log</CardTitle>
                <CardDescription className="text-[10px]">Deterministic security events across all Sovereign Mesh nodes.</CardDescription>
              </div>
              <Button size="sm" variant="ghost" className="text-[10px] h-8">View Full Ledger</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "13:45:12", trigger: "Anycast Guard", node: "Frankfurt-09", action: "PIS_VALIDATED", msg: "Cross-border SEPA routing path verified via Yapily BIC handshake." },
                  { time: "12:20:05", trigger: "Vector Engine", node: "Global-Proxy-01", action: "PROBE_CONTAINED", msg: "High-frequency API probing detected and isolated to counter-intel sandbox." },
                  { time: "11:05:42", trigger: "Identity Sync", node: "Kernel-Core", action: "FINGERPRINT_BOUND", msg: "Cryptographic identity binding confirmed for UBO: Farid Sheikh." }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 border-b border-white/5 last:border-0 items-center">
                    <div className="text-[10px] font-mono text-muted-foreground w-20">{log.time}</div>
                    <div className="flex-1">
                      <p className="text-xs text-white/90">{log.msg}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[8px] uppercase">{log.trigger}</Badge>
                        <Badge variant="secondary" className="text-[8px] font-mono">{log.action}</Badge>
                        <span className="text-[10px] text-muted-foreground italic">Node: {log.node}</span>
                      </div>
                    </div>
                    {log.action.includes('CONTAINED') && <UserX className="h-4 w-4 text-red-400 animate-pulse" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
}
