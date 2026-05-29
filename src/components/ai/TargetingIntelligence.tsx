
"use client";

import { useState } from "react";
import { Target, Loader2, Lightbulb, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suggestTargetingOptimizations, type SuggestTargetingOptimizationsOutput } from "@/ai/flows/suggest-targeting-optimizations";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export function TargetingIntelligence() {
  const [objective, setObjective] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SuggestTargetingOptimizationsOutput | null>(null);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!objective) {
      toast({
        variant: "destructive",
        title: "Missing objective",
        description: "Please describe your campaign objective.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Sending mock existing ad sets for analysis
      const output = await suggestTargetingOptimizations({
        campaignObjective: objective,
        existingAdSets: [
          {
            name: "Prospecting - USA",
            targetAudienceDescription: "Interests: Sustainable living, Yoga, Organic food. Ages 25-45.",
            budget: 200,
            schedule: "Always on",
          },
          {
            name: "Retargeting - View Content",
            targetAudienceDescription: "Users who viewed website in last 30 days.",
            budget: 100,
            schedule: "Always on",
          }
        ],
      });
      setResults(output);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "An error occurred while analyzing targeting. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <Card className="glass-panel xl:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Analyze Campaign
          </CardTitle>
          <CardDescription>Our AI will analyze your objective and suggest optimizations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="objective">What is your primary goal?</Label>
            <Input
              id="objective"
              placeholder="e.g., Drive 500 leads for real estate..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <Button 
            onClick={handleOptimize} 
            disabled={isLoading} 
            className="w-full cyan-glow font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              "Get Optimization Plan"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="xl:col-span-2 space-y-6">
        {results ? (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-panel border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Strategic Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {results.overallRecommendations}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.adSetOptimizations.map((opt, i) => (
                <Card key={i} className="glass-panel">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {opt.adSetName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                        <TrendingUp className="h-3 w-3" /> Audience Suggestions
                      </div>
                      <ul className="space-y-1">
                        {opt.audienceSuggestions.map((suggestion, j) => (
                          <li key={j} className="text-xs text-white/80 flex items-start gap-2">
                            <span className="text-accent">•</span> {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator className="opacity-10" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                        <DollarSign className="h-3 w-3" /> Budget Allocation
                      </div>
                      <p className="text-xs text-white/80">{opt.budgetSuggestions}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-secondary/10 border border-dashed rounded-xl p-8 text-center">
            <Target className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="font-headline font-bold text-lg mb-2">Targeting Intelligence</h3>
            <p className="max-w-md">
              Run an optimization plan to get AI-powered demographics and budget suggestions tailored to your Meta campaigns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
