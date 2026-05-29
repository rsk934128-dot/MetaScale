
"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateAdCopySuggestions, type GenerateAdCopyOutput } from "@/ai/flows/generate-ad-copy-suggestions";
import { useToast } from "@/hooks/use-toast";

export function AdCopywriter() {
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GenerateAdCopyOutput | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!objective || !audience) {
      toast({
        variant: "destructive",
        title: "Missing input",
        description: "Please provide both a campaign objective and target audience.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const output = await generateAdCopySuggestions({
        campaignObjective: objective,
        targetAudience: audience,
      });
      setResults(output);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "An error occurred while generating copy. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Define Campaign
          </CardTitle>
          <CardDescription>Enter your campaign details to generate AI-optimized ad copy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="objective">Campaign Objective</Label>
            <Input
              id="objective"
              placeholder="e.g., Increase sales for eco-friendly sneakers"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Textarea
              id="audience"
              placeholder="e.g., Environmentally conscious urban professionals, 25-45, interested in outdoor activities and sustainable fashion."
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              rows={4}
              className="bg-background/50"
            />
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading} 
            className="w-full cyan-glow font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Drafting Copy...
              </>
            ) : (
              "Generate Suggestions"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {results ? (
          results.suggestions.map((suggestion, idx) => (
            <Card key={idx} className="glass-panel animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest">Headline</span>
                    <h4 className="text-lg font-headline font-bold text-white">{suggestion.headline}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(suggestion.headline, idx * 2)}
                  >
                    {copiedId === idx * 2 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Body Text</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{suggestion.bodyText}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(suggestion.bodyText, idx * 2 + 1)}
                  >
                    {copiedId === idx * 2 + 1 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/10 border border-dashed rounded-xl p-8 text-center">
            <Sparkles className="h-12 w-12 mb-4 opacity-20" />
            <p>Your AI-generated ad suggestions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
