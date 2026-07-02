
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
  AlertTriangle,
  Shield,
  MapPin,
  BrainCircuit,
  AlertCircle,
  Thermometer,
  CloudRain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { analyzeCivicIncident } from "@/ai/flows/civic-incident-analysis";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from "@/lib/utils";

export default function CivicIntelligencePage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const firestore = useFirestore();

  // Real-time Firestore Emergencies
  const emergenciesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'civic', 'emergencies', 'active'), orderBy('timestamp', 'desc'), limit(10));
  }, [firestore]);

  const { data: emergencies } = useCollection(emergenciesQuery);

  const handleSOS = async () => {
    setIsSimulating(true);
    const newEmergency = {
      type: 'SOS',
      severity: 4,
      location: 'Chauhali, Sirajganj',
      status: 'DETECTED',
      timestamp: serverTimestamp(),
    };

    if (firestore) {
      const collRef = collection(firestore, 'civic', 'emergencies', 'active');
      addDoc(collRef, newEmergency).catch(async (err) => {
        const pErr = new FirestorePermissionError({
          path: collRef.path,
          operation: 'create',
          requestResourceData: newEmergency
        });
        errorEmitter.emit('permission-error', pErr);
      });
    }

    emitEvent('CIVIC', 'EMERGENCY_SOS_DISPATCHED', 2, { sector: 'Sirajganj', priority: 'CRITICAL' });
    
    setTimeout(() => {
      setIsSimulating(false);
      toast({
        title: "SOS DISPATCHED",
        description: "Responder AI routed to Chauhali riverine node.",
        variant: "destructive",
      });
    }, 2000);
  };

  const handleRunAIAnalysis = async (emergency: any) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCivicIncident({
        type: emergency.type as any,
        severity: emergency.severity,
        location: emergency.location,
        description: "Sensor gauge on Jamuna river basin detected abnormal water level rise. HEC-RAS model predicting 30% inundation. Calibration station: Bahadurabad."
      });
      setAnalysisResult(result);
      toast({
        title: "HEC-RAS Sync Complete",
        description: `Risk Level: ${result.riskLevel}. Action suggested.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not reach the AI Reasoning Engine.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-blue-400">
              <Waves className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
              <span className="truncate">Sirajganj Civic Intelligence</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-400/20 text-blue-400 text-[10px] uppercase font-bold">
               Jamuna Gauge: Node-04
            </Badge>
            <Button size="sm" onClick={handleSOS} disabled={isSimulating} className="bg-red-500 hover:bg-red-600 text-white text-[10px] md:text-xs font-bold h-8 px-2 md:px-3">
              {isSimulating ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
              SOS
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1 uppercase tracking-tighter">Jamuna <span className="text-blue-400">Basin Hub</span></h2>
              <p className="text-xs md:text-sm text-muted-foreground italic">"Monitoring hydrological stress across 2,402 km² Sirajganj territory."</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Regional Stability</p>
              <p className="text-3xl md:text-4xl font-headline font-bold text-blue-400">92.4</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="glass-panel border-l-4 border-l-blue-400">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Mean River Level</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="text-2xl font-bold">7.0m MSL</div>
                <Progress value={70} className="h-1 bg-blue-400/10 [&>div]:bg-blue-400" />
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-yellow-400">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Monsoon Rain</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">1,610mm</div>
                <p className="text-[10px] text-yellow-400 uppercase font-bold mt-1">Annual Concentration</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Heat Stress</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">34.6°C</div>
                <p className="text-[10px] text-red-400 uppercase font-bold mt-1">High Susceptibility</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-primary">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Active SOS</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{emergencies?.length || 0}</div>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">Sirajganj Nodes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="glass-panel">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex justify-between items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-sm md:text-base uppercase italic tracking-tighter">
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                      Regional Hazard Susceptibility Zones
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { range: "4.97m - 7.63m", label: "High Susceptibility", color: "text-red-400", desc: "Active river beds, low-lying chars, and deltaic silt zones." },
                         { range: "7.63m - 10.29m", label: "Medium Susceptibility", color: "text-yellow-400", desc: "Agricultural floodplains subject to monsoonal surges." },
                         { range: "10.29m - 12.95m", label: "Low Susceptibility", color: "text-green-400", desc: "Higher natural levees and older alluvial terraces." },
                         { range: "> 12.95m", label: "No Susceptibility", color: "text-blue-400", desc: "Safe elevated uplands and stabilized soils." }
                       ].map((zone, i) => (
                         <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                            <div className="flex justify-between items-center">
                               <span className={cn("text-[9px] font-bold uppercase", zone.color)}>{zone.label}</span>
                               <span className="text-[8px] font-mono opacity-50">{zone.range}</span>
                            </div>
                            <p className="text-[10px] text-white/70 italic">"{zone.desc}"</p>
                         </div>
                       ))}
                    </div>
                    
                    <div className="divide-y divide-white/5 pt-4">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-3 tracking-widest">Active Incident Queue (Live Node)</p>
                      {(!emergencies || emergencies.length === 0) && (
                        <div className="h-40 flex items-center justify-center text-muted-foreground italic text-xs">
                          No active flood surges reported.
                        </div>
                      )}
                      {emergencies?.map((ev: any) => (
                        <div key={ev.id} className="p-4 rounded-xl border border-white/5 bg-red-500/5 flex items-center justify-between group mt-2">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-red-500/20 text-red-500 animate-pulse">
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white uppercase">{ev.type} IN SIRAJGANJ</p>
                              <p className="text-[10px] text-muted-foreground">{ev.location} • Elevation Hazard Level: {ev.severity}/5</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-[10px] font-bold text-accent group-hover:bg-accent/10"
                                onClick={() => handleRunAIAnalysis(ev)}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <BrainCircuit className="h-3 w-3 mr-1" />}
                                HEC-RAS Model
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base uppercase">
                    <Map className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                    Brahmaputra-Jamuna Morphology
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="h-[300px] md:h-[400px] border border-white/5 rounded-xl bg-black/20 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="relative z-10 w-full max-w-lg p-6 text-center space-y-4">
                      <div className="inline-block p-3 rounded-full bg-blue-400/10 border border-blue-400/20">
                        <Waves className="h-8 w-8 text-blue-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-headline font-bold uppercase italic text-white">Chauhali-Kazipur Reach</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Hydrological Modeling Engine active via RIVERFLOW2D & HEC-RAS</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs flex items-center gap-2 uppercase">
                    <BrainCircuit className="h-4 w-4 text-accent" />
                    RIVERFLOW2D Insight
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  {analysisResult ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-accent uppercase">Risk: {analysisResult.riskLevel}</span>
                          <Badge variant="outline" className="text-[8px]">Return Period: 100yr</Badge>
                        </div>
                        <p className="text-[11px] text-white/90 italic leading-relaxed">
                          "{analysisResult.suggestedAction}"
                        </p>
                        <p className="text-[9px] text-muted-foreground">Inundation Extent: 58 km² (Calibrated)</p>
                      </div>
                      <Button className="w-full text-[10px] font-bold cyan-glow bg-accent text-background h-8 uppercase">
                        Authorize Flood Protocol
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center mx-auto">
                        <Radio className="h-5 w-5 text-muted-foreground animate-pulse" />
                      </div>
                      <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                        Select Sirajganj gauge signal (Bahadurabad/Kazipur) to trigger AI response modeling.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-panel border-blue-400/20">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs flex items-center gap-2 uppercase font-bold text-blue-400">
                    <Activity className="h-4 w-4" />
                    Infrastructure Guard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Embankment Stability</span>
                    <span>82%</span>
                  </div>
                  <Progress value={82} className="h-1 bg-blue-400/10 [&>div]:bg-blue-400" />
                  <p className="text-[9px] text-muted-foreground mt-2 italic">
                    "Jamuna Bridge Approaches (Kazipur) reporting stable integrity under 2D modeling."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
