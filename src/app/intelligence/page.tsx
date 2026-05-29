
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Terminal, Search, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function IntelligencePage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Terminal className="h-5 w-5 text-accent" />
              Marketing Intelligence Layer
            </h1>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-headline font-bold">Ask anything about your data.</h2>
            <p className="text-muted-foreground text-lg">
              AMOS AI understands your entire cross-platform performance history. Just ask.
            </p>
            <div className="relative mt-8 group">
              <div className="absolute inset-y-0 left-4 flex items-center">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              </div>
              <Input 
                className="pl-12 h-14 text-lg bg-secondary/30 border-white/5 focus:border-accent/50 transition-all rounded-xl shadow-2xl" 
                placeholder="e.g. 'Why did my Meta CPA increase by 20% yesterday?'"
              />
              <div className="absolute right-2 top-2">
                <Button className="h-10 bg-accent hover:bg-accent/90 font-bold">Query Engine</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              "Analyze Creative Fatigue",
              "Forecasting Q4 Spend",
              "Audience Expansion Paths",
              "Competitor Benchmark",
              "Retention Analysis",
              "Attribution Modeling"
            ].map((tool) => (
              <Card key={tool} className="glass-panel hover:bg-accent/5 cursor-pointer transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-bold text-sm">{tool}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
