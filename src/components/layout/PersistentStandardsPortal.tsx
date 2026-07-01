
"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Globe, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * PersistentStandardsPortal
 * This component keeps the iframe mounted at all times to prevent reloading.
 * It is only visible when the user is on the /shurukkha-standard route.
 */
export function PersistentStandardsPortal() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const isVisible = pathname === '/shurukkha-standard';
  const targetUrl = "https://noor-nexus-omega.vercel.app/shurukkha-standard";

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[60] bg-background flex transition-all duration-300",
        isVisible ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-4 invisible"
      )}
    >
      <div className="flex w-full h-full">
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
                onClick={() => {
                  const iframe = document.getElementById('persistent-standard-iframe') as HTMLIFrameElement;
                  if (iframe) {
                    setIsLoading(true);
                    iframe.src = targetUrl;
                  }
                }}
              >
                <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isLoading && "animate-spin")} />
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

          <main className="flex-1 p-6 h-[calc(100vh-4rem)] flex flex-col gap-6 overflow-hidden">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[9px] uppercase tracking-widest">
                  Protocol: Persistent_Mesh_V1
                </Badge>
                <h2 className="text-2xl font-headline font-bold uppercase italic tracking-tighter">Standards <span className="text-accent">Portal</span></h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                <Globe className="h-3 w-3 text-accent" />
                Live Node Link
              </div>
            </div>

            <Card className="flex-1 glass-panel border-white/5 overflow-hidden relative shadow-2xl">
              {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-md">
                  <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent animate-pulse">Establishing Secure Tunnel</p>
                </div>
              )}
              <CardContent className="p-0 h-full">
                <iframe
                  id="persistent-standard-iframe"
                  src={targetUrl}
                  className="w-full h-full border-none rounded-b-lg"
                  onLoad={() => setIsLoading(false)}
                  title="Shurukkha Standard Portal"
                />
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
