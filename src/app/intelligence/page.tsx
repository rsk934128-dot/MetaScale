
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Terminal, Search, Info, Send, BrainCircuit, FileText, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { marketingCommandChat, type CommandChatOutput } from "@/ai/flows/marketing-command-chat";
import { useToast } from "@/hooks/use-toast";

export default function IntelligencePage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [lastResult, setLastResult] = useState<CommandChatOutput | null>(null);
  const { toast } = useToast();

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
        context: "Current Meta ROAS: 3.8x. Top performing creative: 'Summer Video V2'. Budget utilization: 84%. Document indexed: '2024 Brand Strategy.pdf' mentions focusing on Gen Z urban professionals.",
      });
      
      setLastResult(result);
      setChatHistory(prev => [...prev, { role: 'model', text: result.response }]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Intelligence Failure",
        description: "The AI engine encountered an error processing your query.",
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
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2">
              <Terminal className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0" />
              <span className="truncate">Command Chat</span>
            </h1>
          </div>
          <Badge variant="outline" className="hidden sm:flex text-accent border-accent/20 animate-pulse text-[10px]">
            <BrainCircuit className="mr-2 h-3 w-3" /> RAG Active
          </Badge>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 h-[calc(100vh-4rem)] overflow-hidden">
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex-1 overflow-hidden relative glass-panel rounded-xl border-white/5 flex flex-col">
              <ScrollArea className="flex-1 p-4 md:p-6">
                <div className="space-y-6">
                  {chatHistory.length === 0 && (
                    <div className="min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 p-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center cyan-glow">
                        <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-accent" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-headline font-bold">How can AMOS help?</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full max-w-md">
                        {["Analyze fatigue", "Summarize docs"].map((q) => (
                          <Button key={q} variant="outline" size="sm" onClick={() => setQuery(q)} className="text-[10px] h-8 truncate">
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 md:p-4 rounded-xl text-xs md:text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary/50 border border-white/5 text-white'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/50 border border-white/5 p-3 rounded-xl flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-accent" />
                        <span className="text-[10px] text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-3 md:p-4 border-t bg-background/50 backdrop-blur-sm">
                <div className="relative flex items-center gap-2">
                  <Input 
                    placeholder="Command..." 
                    className="flex-1 h-10 text-xs bg-secondary/30 border-white/5 pr-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  />
                  <Button size="icon" className="h-8 w-8 absolute right-1" onClick={handleQuery} disabled={isLoading}>
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block space-y-6 overflow-y-auto pr-2 h-full">
            <Card className="glass-panel border-accent/20">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-tighter">
                  <BrainCircuit className="h-3 w-3 text-accent" />
                  Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {lastResult?.dataPoints ? (
                  lastResult.dataPoints.map((dp, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/30 border border-white/5">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase truncate pr-2">{dp.label}</span>
                      <span className="text-xs font-bold text-white shrink-0">{dp.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-muted-foreground italic">Idle.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
