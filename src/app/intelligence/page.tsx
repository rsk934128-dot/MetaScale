"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Terminal, 
  Search, 
  Info, 
  Send, 
  BrainCircuit, 
  FileText, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  Database,
  Zap,
  Activity,
  ChevronRight,
  TrendingUp,
  Target,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { marketingCommandChat, type CommandChatOutput } from "@/ai/flows/marketing-command-chat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function IntelligenceLayerPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [lastResult, setLastResult] = useState<CommandChatOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([{
        role: 'model',
        text: "EXECUTION MODE ACTIVE. Your current Gross Margin is 78.2%. I have identified the MQL Stall in the mid-market. I am ready to use Project 43: Syntax Architect to generate an 'Automated Outreach Campaign' for you. Shall we also initiate the 'Liquidity Reserve' shift from your 3.5% transaction yield?"
      }]);
    }
  }, []);

  const handleQuery = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setQuery("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await marketingCommandChat({
        query: userMsg,
        history: chatHistory,
        context: "Sovereign OS context: Project 42-45 complete. Gross Margin 78.2%. CAC/LTV 1:4.8. Focus: B2B Outreach and Liquidity Reserve Strategy. Target: Mitigation of mid-market MQL stall. Strategy: Personalized P43 outreach and P45 yield allocation.",
      });
      
      setLastResult(result);
      setChatHistory(prev => [...prev, { role: 'model', text: result.response }]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Intelligence Failure",
        description: "The Sovereign AI engine encountered an error processing your query.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-primary">
              <BrainCircuit className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
              <span className="truncate uppercase italic tracking-tighter">Sovereign Intelligence Layer</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex text-accent border-accent/20 animate-pulse text-[10px]">
              <TrendingUp className="mr-2 h-3 w-3" /> ROI_STRATEGY: ENABLED
            </Badge>
            <Badge variant="outline" className="text-primary border-primary/20 text-[10px]">
              EXECUTION_LEVEL_0
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 h-[calc(100vh-4rem)] overflow-hidden">
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex-1 overflow-hidden relative glass-panel rounded-2xl border-white/5 flex flex-col bg-black/20">
              <ScrollArea className="flex-1 p-4 md:p-6">
                <div className="space-y-6">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-xl border",
                        msg.role === 'user' 
                        ? 'bg-primary border-primary/50 text-white' 
                        : 'bg-secondary/40 border-white/5 text-white/90'
                      )}>
                        {msg.role === 'model' && <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/5 opacity-50"><Zap className="h-3 w-3 text-accent" /><span className="text-[8px] uppercase font-bold tracking-widest">Sovereign Strategist</span></div>}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Reasoning Strategy...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-sm">
                <div className="relative flex items-center gap-2">
                  <div className="absolute left-3 p-1 rounded bg-accent/10 border border-accent/20">
                     <Briefcase className="h-3 w-3 text-accent" />
                  </div>
                  <Input 
                    placeholder="Authorize B2B Outreach or Reserve Shift..." 
                    className="flex-1 h-12 text-xs bg-secondary/30 border-white/10 pl-11 pr-12 rounded-xl focus:border-primary/50 transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  />
                  <Button size="icon" className="h-10 w-10 absolute right-1 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg" onClick={handleQuery} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block space-y-6 overflow-y-auto pr-2 h-full">
            <Card className="glass-panel border-accent/20 bg-accent/5">
              <CardHeader className="pb-2 p-4 border-b border-white/5">
                <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest text-accent">
                  <Activity className="h-4 w-4 text-accent" />
                  Commercial Index
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {[
                  { label: "Gross Margin", val: "78.2%", color: "text-green-400" },
                  { label: "CAC/LTV", val: "1:4.8", color: "text-primary" },
                  { label: "Yield Reserve", val: "ACTIVE", color: "text-accent" },
                  { label: "Sales Velocity", val: "OPTIMAL", color: "text-green-400" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-black/40 border border-white/5 group hover:border-accent/30 transition-all cursor-default">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">{item.label}</span>
                    <span className={cn("text-[10px] font-bold font-mono", item.color)}>{item.val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/5">
               <CardHeader className="p-4 border-b border-white/5">
                  <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                     <Target className="h-3 w-3 text-primary" /> Strategy Focus
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-2">
                  {[
                    "B2B Outreach sequence ready",
                    "Reserve shift authorized",
                    "Mid-market stall mitigation",
                    "Global scaling handshake"
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] text-white/60 italic">
                       <CheckCircle2 className="h-2.5 w-2.5 text-primary shrink-0" />
                       <span className="truncate">{log}</span>
                    </div>
                  ))}
               </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-center shadow-inner">
               <Sparkles className="h-6 w-6 text-primary mx-auto opacity-50" />
               <p className="text-[9px] text-primary font-bold uppercase tracking-widest leading-relaxed">
                  The system is now optimizing for B2B conversion and long-term liquidity reserves.
               </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}

function CheckCircle2({ className, ...props }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
