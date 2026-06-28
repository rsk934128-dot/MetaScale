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
  AlertCircle
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

export default function CivicIntelligencePage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPinningPolice, setIsPinningPolice] = useState(false);
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
      location: 'Sector 7, Junction A',
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

    emitEvent('CIVIC', 'EMERGENCY_SOS_DISPATCHED', 2, { sector: 7, priority: 'CRITICAL' });
    
    setTimeout(() => {
      setIsSimulating(false);
      toast({
        title: "SOS DISPATCHED",
        description: "Nearest responder AI routed to Sector 7.",
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
        description: "Sensor detected abnormal heat and sound patterns in restricted perimeter."
      });
      setAnalysisResult(result);
      toast({
        title: "AI Analysis Complete",
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

  const handlePinPolice = () => {
    setIsPinningPolice(true);
    emitEvent('CIVIC', 'POLICE_UNIT_PINNED', 3, { location: 'Sector 7 - Junction A', type: 'PATROL' });
    setTimeout(() => {
      setIsPinningPolice(false);
      toast({
        title: "পুলিশ পিন করা হয়েছে",
        description: "সেক্টর ৭-এ পুলিশ ইউনিটের অবস্থান চিহ্নিত করা হয়েছে এবং ব্যাকএন্ডে সিঙ্ক করা হয়েছে।",
      });
    }, 1500);
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
              <span className="truncate">Civic Intelligence</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handlePinPolice}
              disabled={isPinningPolice}
              className="hidden sm:flex border-accent/30 text-accent hover:bg-accent/10 text-[10px] md:text-xs font-bold h-8"
            >
              {isPinningPolice ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
              পুলিশ পিন
            </Button>
            <Button size="sm" onClick={handleSOS} disabled={isSimulating} className="bg-red-500 hover:bg-red-600 text-white text-[10px] md:text-xs font-bold h-8 px-2 md:px-3">
              {isSimulating ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
              SOS
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-1">Intelligence Hub</h2>
              <p className="text-xs md:text-sm text-muted-foreground">River health and real-time SOS incident monitoring.</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Stability</p>
              <p className="text-3xl md:text-4xl font-headline font-bold text-blue-400">92.4</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="glass-panel border-l-4 border-l-blue-400">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">River Level</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="text-2xl font-bold">4.2m</div>
                <Progress value={70} className="h-1 bg-blue-400/10 [&>div]:bg-blue-400" />
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-yellow-400">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Flood Risk</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">12%</div>
                <p className="text-[10px] text-yellow-400 uppercase font-bold mt-1">Minimal</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-l-4 border-l-red-500 sm:col-span-2 md:col-span-1">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Live SOS Events</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{emergencies?.length || 0}</div>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">
                  {emergencies && emergencies.length > 0 ? 'Active Responses' : 'Standby'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="glass-panel">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex justify-between items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                      <ShieldAlert className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                      Active Emergencies (Firestore Sync)
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-4">
                    {(!emergencies || emergencies.length === 0) && (
                      <div className="h-40 flex items-center justify-center text-muted-foreground italic text-xs">
                        No active emergencies reported.
                      </div>
                    )}
                    {emergencies?.map((ev: any) => (
                      <div key={ev.id} className="p-4 rounded-xl border border-white/5 bg-red-500/5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-red-500/20 text-red-500 animate-pulse">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase">{ev.type} IN PROGRESS</p>
                            <p className="text-[10px] text-muted-foreground">{ev.location} • Severity: {ev.severity}/5</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-[10px] font-bold text-accent group-hover:bg-accent/10"
                          onClick={() => handleRunAIAnalysis(ev)}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <BrainCircuit className="h-3 w-3 mr-1" />}
                          AI Diagnosis
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <Map className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                    Civic Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="h-[300px] md:h-[400px] border border-white/5 rounded-xl bg-black/20 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="relative z-10 w-full max-w-lg p-6 text-center space-y-4">
                      <div className="inline-block p-3 rounded-full bg-blue-400/10 border border-blue-400/20">
                        <Waves className="h-8 w-8 text-blue-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-headline font-bold">Sector 7</h3>
                      <p className="text-[10px] text-muted-foreground">River: 4.2m | Status: Nominal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-accent" />
                    AI Response Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  {analysisResult ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-accent uppercase">Risk: {analysisResult.riskLevel}</span>
                          <Badge variant="outline" className="text-[8px]">Priority {analysisResult.dispatchPriority}</Badge>
                        </div>
                        <p className="text-[11px] text-white/90 italic leading-relaxed">
                          "{analysisResult.suggestedAction}"
                        </p>
                        <p className="text-[9px] text-muted-foreground">Impact Radius: {analysisResult.estimatedImpactRadius}</p>
                      </div>
                      <Button className="w-full text-[10px] font-bold cyan-glow bg-accent text-background h-8">
                        {analysisResult.automatedResponseEnabled ? 'Execute Protocol' : 'Manual Authorization'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center mx-auto">
                        <Radio className="h-5 w-5 text-muted-foreground animate-pulse" />
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">
                        Select an active incident for AI-powered response strategy.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-panel border-blue-400/20">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Dispatch Load</span>
                    <span>12%</span>
                  </div>
                  <Progress value={12} className="h-1 bg-blue-400/10 [&>div]:bg-blue-400" />
                  <p className="text-[9px] text-muted-foreground mt-2">
                    All responder nodes in Sector 7 are currently reporting OPTIMAL state.
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
