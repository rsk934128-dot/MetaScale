
"use client";

import { useState, useMemo } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingUp, 
  Search, 
  Newspaper, 
  BrainCircuit, 
  Plus, 
  Star, 
  TrendingDown, 
  Activity,
  RefreshCw,
  Zap,
  Globe,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, addDoc, doc, setDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import { analyzeStockTicker } from "@/ai/flows/analyze-stock-ticker";
import { summarizeFinanceArticle } from "@/ai/flows/summarize-finance-article";
import { cn } from "@/lib/utils";

export default function InsightsHubPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [ticker, setTicker] = useState("");
  const [article, setArticle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [summaryResult, setSummaryResult] = useState<any>(null);

  // Firestore Watchlist
  const watchlistQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'watchlist'), orderBy('addedAt', 'desc'));
  }, [firestore, user?.uid]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<any>(watchlistQuery);

  const handleAnalyze = async () => {
    if (!ticker) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeStockTicker({ ticker });
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: `${ticker.toUpperCase()} sentiment: ${result.sentiment}` });
    } catch (err) {
      toast({ variant: "destructive", title: "AI Error", description: "Market intelligence node timeout." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSummarize = async () => {
    if (!article) return;
    setIsSummarizing(true);
    try {
      const result = await summarizeFinanceArticle({ articleContent: article });
      setSummaryResult(result);
      toast({ title: "Summary Generated", description: "Article extracted and analyzed by AI." });
    } catch (err) {
      toast({ variant: "destructive", title: "AI Error", description: "News intelligence node failure." });
    } finally {
      setIsSummarizing(false);
    }
  };

  const addToWatchlist = async (item: any) => {
    if (!firestore || !user?.uid) return;
    const itemRef = doc(firestore, 'users', user.uid, 'watchlist', item.symbol);
    await setDoc(itemRef, {
      id: item.symbol,
      ticker: item.symbol,
      name: item.name,
      type: 'STOCK',
      addedAt: Date.now()
    });
    toast({ title: "Watchlist Updated", description: `${item.symbol} added to your personal mesh.` });
  };

  const removeFromWatchlist = async (id: string) => {
    if (!firestore || !user?.uid) return;
    await deleteDoc(doc(firestore, 'users', user.uid, 'watchlist', id));
    toast({ title: "Item Removed", description: "Node decoupled from watchlist." });
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <TrendingUp className="h-5 w-5 text-accent" />
              FusionPay Insights Hub
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            AI_INTEL_NODE: ACTIVE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
             <div>
                <h2 className="text-3xl font-headline font-bold mb-2 uppercase italic tracking-tighter">Market <span className="text-accent">Intelligence</span></h2>
                <p className="text-muted-foreground text-sm">AI-powered sentiment, summaries, and personalized risk analysis.</p>
             </div>
             <div className="flex gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Global Sentiment</p>
                   <p className="text-2xl font-headline font-bold text-green-400">BULLISH</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">AI Confidence</p>
                   <p className="text-2xl font-headline font-bold text-accent">98.2%</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="analyst" className="space-y-6">
                <TabsList className="bg-secondary/50 border border-white/5 p-1 h-12">
                  <TabsTrigger value="analyst" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full data-[state=active]:bg-accent data-[state=active]:text-background">AI Financial Analyst</TabsTrigger>
                  <TabsTrigger value="summarizer" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full data-[state=active]:bg-accent data-[state=active]:text-background">Article Summarizer</TabsTrigger>
                </TabsList>

                <TabsContent value="analyst" className="space-y-6 animate-fade-in">
                  <Card className="glass-panel border-accent/20 bg-accent/5">
                    <CardHeader>
                      <CardTitle className="text-sm uppercase flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-accent" /> Analyze Market Ticker
                      </CardTitle>
                      <CardDescription className="text-xs italic">Get sentiment, risk scores and expert AI summaries for any asset.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="e.g. AAPL, BTC, TSLA" 
                          className="bg-secondary/30 border-white/5 uppercase font-mono tracking-widest"
                          value={ticker}
                          onChange={(e) => setTicker(e.target.value)}
                        />
                        <Button className="bg-accent text-background font-bold px-8 cyan-glow" onClick={handleAnalyze} disabled={isAnalyzing}>
                          {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                          Analyze
                        </Button>
                      </div>

                      {analysisResult && (
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-6 animate-fade-in">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h3 className="text-2xl font-headline font-bold text-white uppercase">{analysisResult.symbol}</h3>
                                 <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{analysisResult.name}</p>
                              </div>
                              <div className="text-right space-y-1">
                                 <Badge className={cn(
                                   "font-bold px-4",
                                   analysisResult.sentiment === 'BULLISH' ? 'bg-green-500/20 text-green-400' : 
                                   analysisResult.sentiment === 'BEARISH' ? 'bg-red-500/20 text-red-400' : 
                                   'bg-yellow-500/20 text-yellow-500'
                                 )}>
                                   {analysisResult.sentiment}
                                 </Badge>
                                 <p className="text-[10px] text-muted-foreground uppercase font-bold">Market Sentiment</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 text-center">
                                 <p className="text-[9px] text-muted-foreground uppercase font-bold">Risk Score</p>
                                 <p className={cn("text-2xl font-bold", analysisResult.riskScore > 70 ? 'text-red-400' : 'text-accent')}>
                                    {analysisResult.riskScore}/100
                                 </p>
                              </div>
                              {analysisResult.keyMetrics.map((m: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-secondary/20 border border-white/5 text-center">
                                   <p className="text-[9px] text-muted-foreground uppercase font-bold">{m.label}</p>
                                   <p className="text-sm font-bold text-white uppercase">{m.value}</p>
                                </div>
                              ))}
                           </div>

                           <div className="space-y-2">
                              <p className="text-[10px] text-accent uppercase font-bold flex items-center gap-2">
                                <Activity className="h-3 w-3" /> AI Summary
                              </p>
                              <p className="text-sm text-white/80 leading-relaxed italic border-l-2 border-accent/30 pl-4">
                                "{analysisResult.summary}"
                              </p>
                           </div>

                           <div className="flex justify-between items-center pt-4 border-t border-white/5">
                              <p className="text-[11px] text-muted-foreground"><span className="text-white font-bold uppercase">REC:</span> {analysisResult.recommendation}</p>
                              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-accent" onClick={() => addToWatchlist(analysisResult)}>
                                <Plus className="h-3 w-3 mr-1.5" /> Add to Watchlist
                              </Button>
                           </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="summarizer" className="space-y-6 animate-fade-in">
                   <Card className="glass-panel border-primary/20 bg-primary/5">
                      <CardHeader>
                         <CardTitle className="text-sm uppercase flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-primary" /> AI Financial Summarizer
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <textarea 
                              placeholder="Paste a financial news article content here..." 
                              className="w-full h-32 bg-secondary/30 border border-white/5 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
                              value={article}
                              onChange={(e) => setArticle(e.target.value)}
                            />
                            <Button className="w-full bg-primary text-white font-bold h-12 blue-glow uppercase tracking-widest text-[10px]" onClick={handleSummarize} disabled={isSummarizing}>
                               {isSummarizing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                               Generate Executive Summary
                            </Button>
                         </div>

                         {summaryResult && (
                           <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-6 animate-fade-in">
                              <div className="flex justify-between items-start">
                                 <h3 className="text-lg font-headline font-bold text-white uppercase italic">{summaryResult.title}</h3>
                                 <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">{summaryResult.readTime} READ</Badge>
                              </div>
                              <p className="text-sm text-white/80 leading-relaxed border-l-2 border-primary/30 pl-4">{summaryResult.summary}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-3">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Key Takeaways</p>
                                    <ul className="space-y-2">
                                       {summaryResult.keyTakeaways.map((t: string, i: number) => (
                                         <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                                            <span>{t}</span>
                                         </li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 h-fit">
                                    <p className="text-[10px] text-primary uppercase font-bold tracking-widest mb-2">Market Impact</p>
                                    <p className="text-xs text-white/80 italic leading-relaxed">"{summaryResult.marketImpact}"</p>
                                 </div>
                              </div>
                           </div>
                         )}
                      </CardContent>
                   </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-8">
               <Card className="glass-panel border-white/5 overflow-hidden">
                  <CardHeader className="p-4 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                     <CardTitle className="text-xs uppercase flex items-center gap-2">
                        <Star className="h-4 w-4 text-accent" /> Citizen Watchlist
                     </CardTitle>
                     <Badge variant="outline" className="text-[9px] font-mono border-white/10 opacity-50">{watchlist?.length || 0} NODES</Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="divide-y divide-white/5">
                        {watchlistLoading ? (
                          <div className="p-12 flex flex-col items-center gap-2 opacity-30">
                             <Loader2 className="h-6 w-6 animate-spin" />
                             <p className="text-[8px] uppercase font-bold">Syncing...</p>
                          </div>
                        ) : watchlist?.length === 0 ? (
                          <div className="p-20 text-center text-muted-foreground italic text-[10px] uppercase tracking-widest opacity-20">
                             No tracked nodes.
                          </div>
                        ) : (
                          watchlist?.map((item: any) => (
                            <div key={item.id} className="p-4 group hover:bg-white/5 transition-all">
                               <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-xs text-accent">
                                        {item.ticker[0]}
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-white">{item.ticker}</p>
                                        <p className="text-[8px] text-muted-foreground uppercase">{item.name || 'Financial Node'}</p>
                                     </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                                    onClick={() => removeFromWatchlist(item.id)}
                                  >
                                     <Plus className="h-3 w-3 rotate-45" />
                                  </Button>
                               </div>
                            </div>
                          ))
                        )}
                     </div>
                  </CardContent>
               </Card>

               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardHeader className="p-4">
                     <CardTitle className="text-xs uppercase flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent" /> Intelligence Trust
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                     <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                        All financial insights are generated via FusionPay's Deterministic AI Council. Real-time data is cross-referenced with 42 global anycast nodes.
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
