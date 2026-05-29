
"use client";

import { useState } from "react";
import { BrainCircuit, Loader2, Zap, TrendingUp, DollarSign, Target, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export function OptimizationEngine() {
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center p-6 glass-panel rounded-xl border-l-4 border-l-accent">
        <div className="space-y-1">
          <h3 className="text-xl font-headline font-bold flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-accent" />
            Autonomous Optimization Center
          </h3>
          <p className="text-sm text-muted-foreground">
            AMOS Intelligence is monitoring your campaigns. Last full sync: 4 minutes ago.
          </p>
        </div>
        <Button 
          onClick={startScan} 
          disabled={isScanning}
          className="cyan-glow font-bold bg-accent hover:bg-accent/90"
        >
          {isScanning ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning Platform API...</>
          ) : (
            <><Zap className="mr-2 h-4 w-4" /> Trigger Deep Analysis</>
          )}
        </Button>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-background">Active Suggestions</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-background">Applied History</TabsTrigger>
          <TabsTrigger value="forecasting" className="data-[state=active]:bg-background">Predictive Modeling</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[
              { 
                title: "Scaling Opportunity: Interest LAL 1%", 
                platform: "Meta",
                type: "Budget",
                impact: "High",
                desc: "Campaign has maintained 3.5x ROAS over 7 days with stable CPA. Increasing daily budget by $200 could capture 15% more conversions with minimal CAC decay.",
                confidence: 94
              },
              { 
                title: "Efficiency Warning: High CPA in UK Broad", 
                platform: "Google",
                type: "Targeting",
                impact: "Critical",
                desc: "CPA has spiked 40% above historical average. Suggesting 12 new negative keywords and narrowing age targeting to 25-44.",
                confidence: 88
              },
              { 
                title: "Creative Refresh: Dynamic Video V1", 
                platform: "TikTok",
                type: "Creative",
                impact: "Medium",
                desc: "Retention rate dropped from 45% to 28% this morning. Fatigue detected. Suggest deploying AI Creative Studio to draft new hook variants.",
                confidence: 91
              }
            ].map((rec, i) => (
              <Card key={i} className="glass-panel overflow-hidden group hover:border-accent/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <Badge variant="outline" className="text-[10px] font-bold">{rec.platform}</Badge>
                         <Badge className={rec.impact === 'Critical' ? 'bg-destructive/80' : 'bg-accent/80'}>{rec.impact} Impact</Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{rec.title}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="font-bold border-accent/20 text-accent hover:bg-accent hover:text-white">Apply Optimization</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.desc}</p>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                        <span>Confidence Score</span>
                        <span>{rec.confidence}%</span>
                      </div>
                      <Progress value={rec.confidence} className="h-1" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                      <History className="h-3 w-3" /> Auto-Apply: Off
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
             <Card className="glass-panel">
               <CardHeader>
                 <CardTitle className="text-sm">Engine Stats</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 {[
                   { label: "Total ROAS Lift", value: "0.8x", icon: TrendingUp },
                   { label: "Inefficient Spend Saved", value: "$4,290", icon: DollarSign },
                   { label: "Scalable Segments", value: "12", icon: Target },
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                     <div className="flex items-center gap-2">
                       <stat.icon className="h-4 w-4 text-accent" />
                       <span className="text-xs text-muted-foreground">{stat.label}</span>
                     </div>
                     <span className="text-sm font-bold">{stat.value}</span>
                   </div>
                 ))}
               </CardContent>
             </Card>

             <Card className="glass-panel bg-primary/5 border-primary/20">
               <CardHeader>
                 <CardTitle className="text-sm flex items-center gap-2">
                   <Zap className="h-4 w-4 text-primary" />
                   Smart Scaling Mode
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <p className="text-xs text-muted-foreground">
                   Enable autonomous scaling to let AMOS automatically adjust budgets based on hourly performance signals.
                 </p>
                 <Button className="w-full bg-primary hover:bg-primary/90 font-bold">Activate Smart Scaler</Button>
               </CardContent>
             </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
