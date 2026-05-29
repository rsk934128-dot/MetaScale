
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Waves, 
  Globe, 
  Activity, 
  Zap, 
  ShieldAlert, 
  Map, 
  RefreshCw,
  Search,
  Filter,
  Navigation,
  Radio,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CivicIntelligencePage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const handleSOS = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      toast({
        title: "SOS DISPATCHED",
        description: "Nearest responder AI routed to Sector 7.",
        variant: "destructive",
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-blue-400">
              <Waves className="h-5 w-5" />
              Civic Intelligence & Dispatch
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-blue-400/20 text-blue-400">
              <Radio className="mr-1 h-3 w-3 animate-pulse" /> River AI: Monitoring
            </Badge>
            <Button size="sm" onClick={handleSOS} disabled={isSimulating} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold">
              {isSimulating ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
              EMERGENCY SOS
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Civic Intelligence Hub</h2>
              <p className="text-muted-foreground">Managing river health, flood prediction, and SOS emergency dispatch.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-muted-foreground">Civic Stability</p>
              <p className="text-4xl font-headline font-bold text-blue-400">92.4</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-l-4 border-l-blue-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">River Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">STABLE</div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold">
                     <span>Water Level (m)</span>
                     <span>4.2 / 6.0</span>
                   </div>
                   <Progress value={70} className="h-1 bg-blue-400/10 [&>div]:bg-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-yellow-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Flood Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">12%</div>
                <p className="text-[10px] text-yellow-400 mt-1 uppercase font-bold">Risk Level: Minimal</p>
                <p className="text-[10px] text-muted-foreground italic">"Prediction stable for 72 hours based on satellite weather data."</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500 ring-2 ring-red-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">SOS Active</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">0</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">Dispatch Center: Standby</p>
                <Button variant="outline" size="sm" className="w-full text-[10px] border-red-500/50 text-red-500">
                  Manual Alert Activation
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-400" />
                  Civic Intelligence Map
                </CardTitle>
                <CardDescription>Visualizing river sensors, sector health, and active emergency beacons.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] border border-white/5 rounded-xl bg-black/20 relative flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                   
                   <div className="relative z-10 w-full max-w-lg p-12 text-center space-y-4">
                      <div className="inline-block p-4 rounded-full bg-blue-400/10 border border-blue-400/20">
                        <Waves className="h-12 w-12 text-blue-400 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-headline font-bold">Sector 7 Intelligence</h3>
                      <p className="text-xs text-muted-foreground">River Level: 4.2m | Humidity: 84% | Status: Nominal</p>
                      
                      <div className="flex justify-center gap-8 pt-4">
                         {[1, 2, 3, 4].map((s) => (
                           <div key={s} className="flex flex-col items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-400" />
                              <span className="text-[8px] uppercase font-bold">S-{s}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="absolute bottom-4 right-4 space-y-2">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400" /> <span className="text-[10px]">Sensor Active</span></div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> <span className="text-[10px]">Warning Zone</span></div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-[10px]">SOS Zone</span></div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
               <Card className="glass-panel border-blue-400/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-blue-400" />
                      Emergency Dispatch AI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        "Evaluating nearest responders. Optimal route found through Sector 4. Estimated arrival: 124 seconds."
                     </p>
                     <Button className="w-full text-xs font-bold blue-glow bg-blue-400 text-background">
                        Authorize Dispatch
                     </Button>
                  </CardContent>
               </Card>

               <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      Flood Defense Protocols
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     {[
                       { node: "Sluice Gate 1", status: "Closed" },
                       { node: "Auto-Barrier 4", status: "Standby" },
                       { node: "Pump Station 2", status: "Nominal" }
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                          <span className="text-[10px] font-bold uppercase">{item.node}</span>
                          <Badge variant="outline" className="text-[8px] bg-blue-400/10 text-blue-400">
                            {item.status}
                          </Badge>
                       </div>
                     ))}
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
