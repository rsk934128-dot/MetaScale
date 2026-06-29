
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
  ChevronRight
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
    // Initial System Message reflecting Project context
    if (chatHistory.length === 0) {
      setChatHistory([{
        role: 'model',
        text: "Sovereign Intelligence Layer ACTIVE. I am connected to the Knowledge Bank and have full visibility of Projects 42 (Sheikh Code Exchange), 43 (Syntax Architect), and 44 (Data Enrichment). How can I assist with your Sovereign OS orchestration today?"
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
        context: "Sovereign OS context: Project 42 successfully integrated 14k banks. Project 43 is architecting secure SDKs. Project 44 has achieved 92.4% metadata density. System mode: NORMAL. Anycast Node-04 is healthy.",
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
              <Database className="mr-2 h-3 w-3" /> KNOWLEDGE_BANK: SYNCED
            </Badge>
            <Badge variant="outline" className="text-primary border-primary/20 text-[10px]">
              LEVEL_0_ACCESS
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
                        {msg.role === 'model' && <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/5 opacity-50"><Zap className="h-3 w-3 text-accent" /><span className="text-[8px] uppercase font-bold tracking-widest">Sovereign Logic</span></div>}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Reasoning...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-sm">
                <div className="relative flex items-center gap-2">
                  <div className="absolute left-3 p-1 rounded bg-accent/10 border border-accent/20">
                     <Terminal className="h-3 w-3 text-accent" />
                  </div>
                  <Input 
                    placeholder="Enter system directive or query Knowledge Bank..." 
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
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest">
                  <Activity className="h-4 w-4 text-accent" />
                  Knowledge Index
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {[
                  { label: "P42 Archive", val: "100%", color: "text-green-400" },
                  { label: "P43 Syntax", val: "Active", color: "text-primary" },
                  { label: "P44 Enrichment", val: "92.4%", color: "text-accent" },
                  { label: "P45 Eco Gov", val: "Pending", color: "text-yellow-400" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-black/40 border border-white/5 group hover:border-accent/30 transition-all cursor-default">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">{item.label}</span>
                    <span className={cn("text-[10px] font-bold font-mono", item.color)}>{item.val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/5">
               <CardHeader className="p-4">
                  <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                     <FileText className="h-3 w-3 text-primary" /> Recent Log Hooks
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0 space-y-2">
                  {[
                    "Amex UK node verified",
                    "HMAC handshake trace 0x82",
                    "Metadata density spike +2.4%",
                    "Direct API priority set"
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] text-white/60 italic">
                       <ChevronRight className="h-2 w-2 text-primary shrink-0" />
                       <span className="truncate">{log}</span>
                    </div>
                  ))}
               </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-center">
               <Sparkles className="h-6 w-6 text-primary mx-auto opacity-50" />
               <p className="text-[9px] text-primary font-bold uppercase tracking-widest leading-relaxed">
                  The Intelligence Layer is continuously learning from your system's operational telemetry.
               </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
