"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Mail, 
  RefreshCw, 
  BrainCircuit, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Eye,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeCommunication } from "@/ai/flows/communication-intelligence";
import { useKernel } from "@/components/kernel/KernelProvider";

const MOCK_EMAILS = [
  { id: '1', sender: 'alerts@infra.gov', subject: 'Sector 7 Node Latency Spike', body: 'Immediate attention required. Latency has exceeded 200ms in the anycast mesh.' },
  { id: '2', sender: 'treasury@finance.gov', subject: 'Fiscal Disbursement Approval', body: 'Batch FALLBACK_P180_X92 requires imperial directive seal for amounts > $5000.' },
  { id: '3', sender: 'public@civic.gov', subject: 'River Level Alert', body: 'Sensors in Sector 2 reporting 0.5m rise in last 30 minutes.' },
];

export default function CommunicationPlanePage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [intelligenceReport, setIntelligenceReport] = useState<any>(null);
  const { toast } = useToast();
  const { emitEvent } = useKernel();

  const handleSyncGmail = () => {
    setIsSyncing(true);
    emitEvent('COMMUNICATION', 'GMAIL_SYNC_INITIATED', 4, { scope: 'INBOX_ONLY' });
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Gmail Sync Complete",
        description: "Successfully fetched 3 mission-critical messages.",
      });
    }, 2000);
  };

  const handleRunAnalysis = async (email: any) => {
    setAnalyzingId(email.id);
    try {
      const result = await analyzeCommunication({
        emailBody: email.body,
        sender: email.sender,
      });
      setIntelligenceReport(result);
      
      emitEvent('COMMUNICATION', 'INTEL_EXTRACTED', result.priority, { 
        threat: result.threatLevel,
        reviewRequired: result.requiresHumanReview 
      });

      toast({
        title: "Analysis Complete",
        description: `Threat Level: ${result.threatLevel}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Intelligence engine timeout.",
      });
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
              <Mail className="h-5 w-5 text-primary" />
              Communication Plane
            </h1>
          </div>
          <Button size="sm" onClick={handleSyncGmail} disabled={isSyncing} className="blue-glow text-xs font-bold">
            {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Sync Gmail
          </Button>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Message Intelligence</h2>
              <p className="text-muted-foreground">Intercepting and analyzing mission-critical communications via Anycast-bound Gmail API.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-panel border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
                    <Mail className="h-4 w-4 text-primary" />
                    Synced Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {MOCK_EMAILS.map((email) => (
                    <div key={email.id} className="p-4 rounded-xl border border-white/5 bg-secondary/20 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary/30 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-primary uppercase">{email.sender}</span>
                          <Badge variant="outline" className="text-[8px] border-white/10">GMAIL</Badge>
                        </div>
                        <h4 className="text-sm font-bold text-white">{email.subject}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{email.body}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[10px] font-bold text-accent group-hover:bg-accent/10 shrink-0"
                        onClick={() => handleRunAnalysis(email)}
                        disabled={analyzingId === email.id}
                      >
                        {analyzingId === email.id ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <BrainCircuit className="h-3 w-3 mr-1" />}
                        Run Intel
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                    <ShieldAlert className="h-4 w-4 text-accent" />
                    Extracted Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  {intelligenceReport ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-3">
                        <div className="flex justify-between items-center">
                          <Badge variant={intelligenceReport.threatLevel === 'CRITICAL' ? 'destructive' : 'outline'} className="text-[8px]">
                            THREAT: {intelligenceReport.threatLevel}
                          </Badge>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">Priority {intelligenceReport.priority}</span>
                        </div>
                        <p className="text-[11px] text-white/90 leading-relaxed italic border-l-2 border-accent/30 pl-3">
                          "{intelligenceReport.operationalSummary}"
                        </p>
                        {intelligenceReport.suggestedKernelAction && (
                           <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-accent">
                             &gt;&gt;&gt; SUGGESTED: {intelligenceReport.suggestedKernelAction}
                           </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 text-[10px] font-bold cyan-glow bg-accent text-background h-8">
                           Authorize Action
                        </Button>
                        <Button variant="outline" className="flex-1 text-[10px] font-bold h-8">
                           Review Full Log
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 opacity-30">
                      <BrainCircuit className="h-10 w-10 mx-auto mb-3" />
                      <p className="text-[10px] uppercase font-bold tracking-widest">Awaiting Analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-panel border-primary/20">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                    <Zap className="h-4 w-4 text-primary" />
                    Gmail Webhook Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-muted-foreground">Encryption Status</span>
                    <span className="text-green-400">AES-256 Active</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-muted-foreground">Sync Latency</span>
                    <span className="text-white">124ms</span>
                  </div>
                  <div className="p-2 rounded bg-primary/5 border border-primary/20 text-[9px] text-primary italic">
                    Anycast routing is optimizing communication paths through Node-04 (UK).
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
