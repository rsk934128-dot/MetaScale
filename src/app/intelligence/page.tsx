"use client";

import { useState, useEffect, useRef } from "react";
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
  Briefcase,
  Bot,
  Cpu,
  Lock,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { marketingCommandChat } from "@/ai/flows/marketing-command-chat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";

export default function IntelligenceLayerPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string, pendingApproval?: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { emitEvent } = useKernel();

  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([{
        role: 'model',
        text: "সম্মানিত সিটিজেন, আমি Sovereign Intelligence Agent (Node-04)। আমি সরাসরি আপনার 'UBIL Mainframe' এবং 'Audit Ledger'-এর সাথে সংযুক্ত। আপনি কি কোনো পেমেন্টের অবস্থা জানতে চান নাকি সিস্টেমের হেলথ চেক করতে চান? আমি আপনার জন্য অডিট রিপোর্টও জেনারেট করতে পারি।"
      }]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [chatHistory, isLoading]);

  const handleQuery = async (overrideQuery?: string) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;

    if (!overrideQuery) {
      setChatHistory(prev => [...prev, { role: 'user', text: finalQuery }]);
      setQuery("");
    }
    
    setIsLoading(true);

    try {
      const result = await marketingCommandChat({
        query: finalQuery,
        history: chatHistory.map(({ role, text }) => ({ role, text })),
        context: "Sovereign OS Context: Phase 4 Commercial Execution. HITL Safety Active. Location: Node-04 UK.",
      });
      
      // Detect if the result implies a pending approval
      // Gemini might return "PENDING_APPROVAL" as part of the tool call result text 
      // or we can detect patterns in the response.
      const needsApproval = result.response.includes("PENDING_APPROVAL") || result.response.includes("ম্যানুয়াল অনুমতির প্রয়োজন");
      const transactionId = result.response.match(/PAY_SEAL_[A-Z0-9]+/)?.[0] || result.response.match(/TXN_[A-Z0-9]+/)?.[0];

      setChatHistory(prev => [...prev, { 
        role: 'model', 
        text: result.response,
        pendingApproval: needsApproval ? transactionId : undefined
      }]);
      
      if (result.toolsCalled && result.toolsCalled.length > 0) {
        toast({
          title: "Kernel Accessed",
          description: `Tools: ${result.toolsCalled.join(', ')}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Intelligence Failure",
        description: "The AI node encountered a reasoning lag. Tracing Node-04...",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthorize = async (txnId: string) => {
    setIsLoading(true);
    emitEvent('SECURITY', 'AI_ACTION_AUTHORIZED', 2, { transactionId: txnId });
    
    // We send a follow-up directive with confirmation
    await handleQuery(`Authorize remediation for ${txnId} now. confirmed: true`);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Bot className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0 animate-pulse" />
              <span className="truncate uppercase italic tracking-tighter">Sovereign AI Agent</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex text-green-400 border-green-500/20 animate-pulse text-[10px]">
              <Lock className="mr-2 h-3 w-3" /> HITL_MODE: ACTIVE
            </Badge>
            <Badge variant="outline" className="text-primary border-primary/20 text-[10px]">
              NODE: 04_UK
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 h-[calc(100vh-4rem)] overflow-hidden">
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex-1 overflow-hidden relative glass-panel rounded-3xl border-white/5 flex flex-col bg-black/40 shadow-2xl">
              <ScrollArea className="flex-1 p-4 md:p-8" ref={scrollRef}>
                <div className="space-y-8 pb-10">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={cn("flex flex-col", msg.role === 'user' ? 'items-end' : 'items-start')}>
                      <div className={cn(
                        "max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-2xl relative group",
                        msg.role === 'user' 
                        ? 'bg-accent text-background font-bold rounded-tr-none' 
                        : 'bg-secondary/50 border border-white/5 text-white/90 rounded-tl-none'
                      )}>
                        {msg.role === 'model' && (
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5 opacity-50">
                            <Bot className="h-3.5 w-3.5 text-accent" />
                            <span className="text-[8px] uppercase font-bold tracking-widest">Sovereign Strategist (P45)</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        
                        {/* HITL Authorization Button */}
                        {msg.pendingApproval && (
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                             <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3">
                                <ShieldCheck className="h-4 w-4 text-yellow-500 shrink-0" />
                                <p className="text-[10px] text-yellow-500/80 italic leading-relaxed">
                                   "এই রিম্যাডিয়েশনটি কার্যকর করার জন্য আপনার সিকিউরিটি পারমিশন প্রয়োজন।"
                                </p>
                             </div>
                             <Button 
                               className="w-full bg-accent text-background font-bold uppercase tracking-widest text-[10px] h-10 cyan-glow"
                               onClick={() => handleAuthorize(msg.pendingApproval!)}
                               disabled={isLoading}
                             >
                                <Zap className="mr-2 h-4 w-4" /> Authorize Recovery
                             </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/40 border border-white/5 p-5 rounded-3xl rounded-tl-none flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">Reasoning...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-6 border-t border-white/5 bg-background/50 backdrop-blur-xl">
                <div className="relative flex items-center gap-3">
                  <div className="absolute left-4 p-1.5 rounded-xl bg-accent/10 border border-accent/20">
                     <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <Input 
                    placeholder="Check status of PAY_SEAL_X92..." 
                    className="flex-1 h-14 text-sm bg-secondary/40 border-white/10 pl-14 pr-16 rounded-2xl focus:border-accent/50 transition-all shadow-inner"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  />
                  <Button size="icon" className="h-12 w-12 absolute right-1.5 bg-accent hover:bg-accent/90 text-background rounded-xl shadow-lg cyan-glow" onClick={() => handleQuery()} disabled={isLoading}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-[9px] text-center text-muted-foreground mt-4 uppercase tracking-widest opacity-40">
                  Powered by NoorNexus Agentic Kernel v1.2 • HITL Safety Enabled
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block space-y-6 overflow-y-auto pr-2 h-full">
            <Card className="glass-panel border-accent/20 bg-accent/5">
              <CardHeader className="pb-2 p-4 border-b border-white/5">
                <CardTitle className="text-[10px] uppercase tracking-widest text-accent flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> Safety Protocols
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {[
                  { label: "HITL Gate", val: "ACTIVE", color: "text-green-400" },
                  { label: "Write Access", val: "RESTRICTED", color: "text-yellow-400" },
                  { label: "Audit Trace", val: "ENABLED", color: "text-accent" },
                  { label: "Kernel Guard", val: "STRICT", color: "text-red-400" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">{item.label}</span>
                    <span className={cn("text-[10px] font-bold font-mono", item.color)}>{item.val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 text-center space-y-3 shadow-inner">
               <Lock className="h-6 w-6 text-accent mx-auto animate-pulse" />
               <p className="text-[9px] text-accent font-bold uppercase tracking-widest leading-relaxed">
                  "Human-in-the-Loop protection is now governing all ledger write operations. Your manual authorization is required for critical fixes."
               </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}

