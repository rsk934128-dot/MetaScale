"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Braces, 
  Terminal, 
  Cpu, 
  Zap, 
  Code2, 
  Play, 
  Copy, 
  Check, 
  RefreshCw,
  ShieldCheck,
  Globe,
  FileCode,
  Sparkles,
  ArrowRight,
  Info,
  ChevronRight,
  Monitor,
  Lightbulb,
  Mail,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { architectSyntax } from "@/ai/flows/ai-syntax-architect";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SyntaxArchitectPage() {
  const [intention, setIntention] = useState("");
  const [targetPlane, setTargetPlane] = useState<'CIVIC' | 'FINANCE' | 'SECURITY' | 'INFRA'>('FINANCE');
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleArchitect = async (overrideIntention?: string) => {
    const finalIntention = overrideIntention || intention;
    if (!finalIntention.trim()) return;
    
    setIsArchitecting(true);
    setResult(null);

    try {
      const output = await architectSyntax({
        intention: finalIntention,
        targetPlane: targetPlane
      });
      setResult(output);
      toast({ title: "Architecture Complete", description: "Intent mapped to Sovereign Syntax." });
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Kernel Error", 
        description: "AI reasoning nodes are busy or unreachable." 
      });
    } finally {
      setIsArchitecting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const QUICK_EXAMPLES = [
    { label: "ISO 20022 Python", text: "Create a secure Python function for an ISO 20022 compliant payment initiation with HMAC-256 signing." },
    { label: "B2B Outreach Script", text: "Generate a personalized technical sales outreach email for a European FinTech CEO, highlighting our Node-04 low-latency advantage and ISO 20022 compliance." },
    { label: "Security Lockdown", text: "Create a CLI command to isolate Node-04 and trigger emergency payout throttling." }
  ];

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
              <Braces className="h-5 w-5 text-primary" />
              Project 43: AI Syntax Architect
            </h1>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px]">
            ARCHITECT_V1 • EXECUTION_MODE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-12">
          {/* Vision Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-headline font-bold tracking-tighter uppercase italic">Syntax <span className="text-primary">Orchestration</span></h2>
              <p className="text-muted-foreground max-w-2xl italic">
                "Converting human directives into deterministic Sovereign SDKs and commercial outreach sequences."
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Reasoning Status</p>
                <p className="text-xl font-headline font-bold text-green-400 uppercase">Optimal</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="glass-panel border-primary/20 bg-primary/5 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-primary">
                    <Terminal className="h-4 w-4" /> Define Intent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Select Target Plane</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['FINANCE', 'SECURITY', 'INFRA', 'CIVIC'].map((p) => (
                          <Button 
                            key={p} 
                            variant={targetPlane === p ? 'default' : 'outline'}
                            className={cn(
                              "text-[10px] font-bold h-9",
                              targetPlane === p ? "bg-primary text-white" : "border-white/5 bg-black/20"
                            )}
                            onClick={() => setTargetPlane(p as any)}
                          >
                            {p} PLANE
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">User Intention</label>
                      <textarea 
                        className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30"
                        placeholder="e.g. Create a technical pitch for a bank..."
                        value={intention}
                        onChange={(e) => setIntention(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                       <Lightbulb className="h-3 w-3 text-accent" /> Growth Accelerator
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {QUICK_EXAMPLES.map((ex, i) => (
                         <Button 
                            key={i} 
                            variant="ghost" 
                            className="text-[9px] h-7 bg-secondary/30 hover:bg-primary/20 hover:text-primary transition-all border border-white/5"
                            onClick={() => {
                               setIntention(ex.text);
                               handleArchitect(ex.text);
                            }}
                         >
                            {ex.label}
                         </Button>
                       ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold blue-glow uppercase text-[10px]"
                    onClick={() => handleArchitect()}
                    disabled={isArchitecting || !intention.trim()}
                  >
                    {isArchitecting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Architect Execution Sequence
                  </Button>
                </CardContent>
              </Card>

              {/* B2B Scaling Card */}
              <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="h-20 w-20 text-accent" /></div>
                <CardHeader>
                   <CardTitle className="text-xs uppercase flex items-center gap-2 text-accent">
                     <Zap className="h-4 w-4" />
                     Commercial Scalability
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   {[
                     "Automated B2B Outreach Architecture",
                     "Personalized Technical Pitch Generation",
                     "Lead Qualification Logic (P43 Powered)",
                     "Sales Velocity Optimization"
                   ].map((f, i) => (
                     <div key={i} className="flex items-center gap-2 text-[10px] text-white/80 italic">
                        <ChevronRight className="h-3 w-3 text-accent" />
                        {f}
                     </div>
                   ))}
                </CardContent>
              </Card>
            </div>

            {/* Output Panel */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="glass-panel h-full flex flex-col border-white/5 shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-accent" />
                      Syntax Output Terminal
                    </CardTitle>
                    <CardDescription className="text-[10px]">Deterministic Output • B2B Strategic Sequence</CardDescription>
                  </div>
                  {result && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(result.syntax)}>
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                  {isArchitecting ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-50">
                      <RefreshCw className="h-10 w-10 animate-spin text-primary" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Synthesizing Logic Mesh...</p>
                    </div>
                  ) : result ? (
                    <Tabs defaultValue="code" className="flex-1 flex flex-col">
                      <TabsList className="bg-secondary/30 rounded-none border-b border-white/5 h-10 px-4 justify-start">
                        <TabsTrigger value="code" className="text-[9px] uppercase font-bold px-4">Generated Syntax</TabsTrigger>
                        <TabsTrigger value="explanation" className="text-[9px] uppercase font-bold px-4">Technical Explanation</TabsTrigger>
                        <TabsTrigger value="forensics" className="text-[9px] uppercase font-bold px-4">Forensic Trace</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="code" className="flex-1 p-0 m-0">
                        <ScrollArea className="h-[450px] bg-black/60 p-6">
                          <pre className="text-[11px] font-mono text-primary-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {result.syntax}
                          </pre>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="explanation" className="flex-1 p-6 m-0 space-y-4">
                         <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                            <Info className="h-5 w-5 text-primary shrink-0" />
                            <p className="text-xs text-white/90 leading-relaxed italic">
                               {result.explanation}
                            </p>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-secondary/20 border border-white/5">
                               <p className="text-[9px] uppercase font-bold text-muted-foreground">Execution Complexity</p>
                               <p className="text-xl font-headline font-bold text-accent">{result.complexity}/10</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/20 border border-white/5">
                               <p className="text-[9px] uppercase font-bold text-muted-foreground">Safety Protocols</p>
                               <Badge className="bg-green-500/20 text-green-400 uppercase text-[8px]">
                                 {result.safetyCheck ? 'PASSED' : 'FLAGGED'}
                               </Badge>
                            </div>
                         </div>
                      </TabsContent>

                      <TabsContent value="forensics" className="flex-1 p-6 m-0 space-y-2">
                        <p className="text-[10px] font-mono text-accent">>>> START_COMMERCIAL_TRACE</p>
                        <p className="text-[10px] font-mono text-white/60">>>> MAPPING_INTENT: {intention.substring(0, 50)}...</p>
                        <p className="text-[10px] font-mono text-white/60">>>> TARGET_PLANE: {targetPlane}</p>
                        <p className="text-[10px] font-mono text-white/60">>>> OUTREACH_QUALITY: HIGH_CONVERSION</p>
                        <p className="text-[10px] font-mono text-green-400">>>> STATUS: EXECUTION_READY</p>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
                       <Mail className="h-16 w-16 mb-4 text-primary" />
                       <p className="text-xs uppercase font-bold tracking-widest">Select target and define commercial intent to architect syntax</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <footer className="pt-20 border-t border-white/5 text-center space-y-6 pb-12">
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-primary/50" />
                <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px] uppercase px-4">
                   Execution Architect v1.2 • Project 43
                </Badge>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-50 italic">
                Sales Velocity Monitoring: ACTIVE • Node-04 Priority Scaling
             </p>
          </footer>
      </SidebarInset>
    </div>
  );
}
