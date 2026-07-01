
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
        context: "Sovereign OS Context: Phase 4. HITL Safety Active. Location: Node-04 UK.",
      });
      
      const needsApproval = result.response.includes("PENDING_APPROVAL") || result.response.includes("ম্যানুয়াল অনুমতির প্রয়োজন");
      const transactionId = result.response.match(/PAY_SEAL_[A-Z0-9]+/)?.[0] || result.response.match(/TXN_[A-Z0-9]+/)?.[0];

      setChatHistory(prev => [...prev, { 
        role: 'model', 
        text: result.response,
        pendingApproval: needsApproval ? transactionId : undefined
      }]);
    } catch (error) {
      toast({ variant: "destructive", title: "Intelligence Failure" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthorize = async (txnId: string) => {
    setIsLoading(true);
    emitEvent('SECURITY', 'AI_ACTION_AUTHORIZED', 2, { transactionId: txnId });
    await handleQuery(`Authorize remediation for ${txnId} now. confirmed: true`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 backdrop-blur px-4">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Bot className="h-4 w-4 md:h-5 md:w-5 text-accent animate-pulse" />
              <span className="truncate uppercase italic tracking-tighter">Sovereign AI Agent</span>
            </h1>
          </div>
          <Badge variant="outline" className="hidden xs:flex text-green-400 border-green-500/20 text-[8px] md:text-[10px]">
            HITL Active
          </Badge>
        </header>

        <main className="flex-1 flex flex-col p-4 md:p-8 max-w-[1200px] mx-auto w-full h-[calc(100vh-4rem)] overflow-hidden">
          <div className="flex-1 overflow-hidden relative glass-panel rounded-2xl md:rounded-3xl border-white/5 flex flex-col bg-black/40 shadow-2xl">
            <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
              <div className="space-y-6 pb-10">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.role === 'user' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      "max-w-[90%] md:max-w-[80%] p-4 md:p-5 rounded-2xl md:rounded-3xl text-xs md:text-sm leading-relaxed shadow-xl",
                      msg.role === 'user' 
                      ? 'bg-accent text-background font-bold rounded-tr-none' 
                      : 'bg-secondary/50 border border-white/5 text-white/90 rounded-tl-none'
                    )}>
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-white/5 opacity-50">
                          <Bot className="h-3 w-3 text-accent" />
                          <span className="text-[7px] md:text-[8px] uppercase font-bold tracking-widest">Sovereign Agent (P45)</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      
                      {msg.pendingApproval && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                           <Button 
                             className="w-full bg-accent text-background font-bold uppercase tracking-widest text-[9px] h-9 md:h-10 cyan-glow"
                             onClick={() => handleAuthorize(msg.pendingApproval!)}
                             disabled={isLoading}
                           >
                              <Zap className="mr-1 h-3 w-3" /> Authorize Fix
                           </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/40 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <Loader2 className="h-3 w-3 animate-spin text-accent" />
                      <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 md:p-6 border-t border-white/5 bg-background/50 backdrop-blur-xl">
              <div className="relative flex items-center gap-2">
                <Input 
                  placeholder="Check status..." 
                  className="flex-1 h-11 md:h-14 text-xs md:text-sm bg-secondary/40 border-white/10 pl-4 pr-12 rounded-xl md:rounded-2xl"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                />
                <Button size="icon" className="h-9 w-9 md:h-12 md:w-12 absolute right-1 bg-accent text-background rounded-lg md:rounded-xl shadow-lg cyan-glow" onClick={() => handleQuery()} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}

