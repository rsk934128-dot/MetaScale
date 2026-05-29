
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
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Terminal className="h-5 w-5 text-accent" />
              AMOS Command Chat
            </h1>
          </div>
          <Badge variant="outline" className="text-accent border-accent/20 animate-pulse">
            <BrainCircuit className="mr-2 h-3 w-3" /> RAG Engine Active
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-4rem)]">
          {/* Main Chat Interface */}
          <div className="xl:col-span-3 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-hidden relative glass-panel rounded-xl border-white/5 flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {chatHistory.length === 0 && (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center cyan-glow">
                        <Sparkles className="h-8 w-8 text-accent" />
                      </div>
                      <h2 className="text-2xl font-headline font-bold">How can AMOS help today?</h2>
                      <p className="text-muted-foreground max-w-sm">
                        Query your multi-platform performance data or strategy documents using natural language.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {[
                          "Analyze creative fatigue",
                          "Summarize strategy docs",
                          "Forecast Q4 ROAS",
                          "Compare CPA vs Google"
                        ].map((q) => (
                          <Button key={q} variant="outline" size="sm" onClick={() => setQuery(q)} className="text-xs">
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-xl ${
                        msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary/50 border border-white/5 text-white'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/50 border border-white/5 p-4 rounded-xl flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span className="text-xs text-muted-foreground">Synthesizing intelligence...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                <div className="relative flex items-center gap-2">
                  <Input 
                    placeholder="Type your command (e.g., 'What is our current CPA trend?')..." 
                    className="flex-1 h-12 bg-secondary/30 border-white/5 pr-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  />
                  <Button size="icon" className="h-10 w-10 absolute right-1" onClick={handleQuery} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Context & Suggested Actions Panel */}
          <div className="space-y-6 overflow-y-auto pr-2">
            <Card className="glass-panel border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-accent" />
                  Contextual Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lastResult?.dataPoints ? (
                  lastResult.dataPoints.map((dp, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/30 border border-white/5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">{dp.label}</span>
                      <span className="text-xs font-bold text-white">{dp.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-muted-foreground italic">No metrics detected in current query.</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Suggested Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lastResult?.suggestedActions ? (
                  lastResult.suggestedActions.map((action, i) => (
                    <Button key={i} variant="ghost" className="w-full justify-start text-[11px] h-auto py-2 text-left hover:bg-primary/10 hover:text-primary">
                      <span className="mr-2 text-primary">•</span> {action}
                    </Button>
                  ))
                ) : (
                  <p className="text-[10px] text-muted-foreground italic">AI will suggest actions based on chat.</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/5 bg-secondary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Knowledge Base
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <FileText className="h-3 w-3 text-red-400" />
                  <span className="text-[10px] truncate">2024 Brand Strategy.pdf</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <FileText className="h-3 w-3 text-blue-400" />
                  <span className="text-[10px] truncate">Q2 Performance Review.xlsx</span>
                </div>
                <Button variant="outline" size="sm" className="w-full text-[10px] h-7 border-dashed">
                  Index New Source
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
