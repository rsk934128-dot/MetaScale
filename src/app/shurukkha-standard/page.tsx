"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Globe, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function ShurukkhaStandardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const targetUrl = "https://noor-nexus-omega.vercel.app/shurukkha-standard";

  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = document.getElementById('standard-iframe') as HTMLIFrameElement;
    if (iframe) iframe.src = targetUrl;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Shurukkha Compliance Standard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-white/10 text-[10px] uppercase font-bold"
              onClick={handleRefresh}
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Reload Node
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-bold" asChild>
              <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Pop-out
              </a>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 h-[calc(100vh-4rem)] flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[9px] uppercase tracking-widest">
                Protocol: Secure_Overlay_V1
              </Badge>
              <h2 className="text-2xl font-headline font-bold uppercase italic tracking-tighter">Standards <span className="text-accent">Portal</span></h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
              <Globe className="h-3 w-3 text-accent" />
              Synchronized with NoorNexus Cloud
            </div>
          </div>

          <Card className="flex-1 glass-panel border-white/5 overflow-hidden relative shadow-2xl">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-md transition-all">
                <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent animate-pulse">Establishing Secure Tunnel</p>
              </div>
            )}
            <CardContent className="p-0 h-full">
              <iframe
                id="standard-iframe"
                src={targetUrl}
                className="w-full h-full border-none rounded-b-lg"
                onLoad={() => setIsLoading(false)}
                title="Shurukkha Standard Portal"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </CardContent>
          </Card>
          
          <footer className="flex items-center justify-center gap-4 opacity-30">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <p className="text-[8px] font-bold uppercase tracking-[0.5em] whitespace-nowrap">
              Sovereign OS Integrated Shield • ISO 20022 Verified
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </footer>
        </main>
      </SidebarInset>
    </div>
  );
}
