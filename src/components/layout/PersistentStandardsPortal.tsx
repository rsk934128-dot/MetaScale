
"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ShieldCheck, Globe, Loader2, RefreshCw, ExternalLink, Maximize2 } from "lucide-react";
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
  const targetUrl = "https://noor-nexus-rubel.vercel.app/";

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[60] bg-background flex transition-all duration-300",
        isVisible ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-4 invisible"
      )}
    >
      <div className="flex w-full h-full">
        {/* 
            Mimic the application's standard layout exactly. 
            This fixed container has its own sidebar and inset to maintain the "page" look.
        */}
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6 shrink-0">
            <SidebarTrigger />
            <div className="flex-1 truncate">
              <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-accent">
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0" />
                <span className="truncate uppercase italic tracking-tighter">Shurukkha Standards Portal</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden lg:flex border-accent/20 text-accent font-mono text-[9px] uppercase tracking-widest px-3">
                <Maximize2 className="mr-2 h-3 w-3" /> Full Display Mode
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-white/10 text-[10px] uppercase font-bold px-2 md:px-3"
                onClick={() => {
                  const iframe = document.getElementById('persistent-standard-iframe') as HTMLIFrameElement;
                  if (iframe) {
                    setIsLoading(true);
                    iframe.src = targetUrl;
                  }
                }}
              >
                <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isLoading && "animate-spin")} />
                <span className="hidden xs:inline">Sync Node</span>
                <span className="xs:hidden">Sync</span>
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-bold p-2" asChild title="Open in new tab">
                <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </header>

          <main className="flex-1 relative bg-black overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-md">
                <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent animate-pulse">Establishing Secure Tunnel</p>
              </div>
            )}
            {/* The Iframe now fills the entire content area, just like a native page would. */}
            <iframe
              id="persistent-standard-iframe"
              src={targetUrl}
              className="w-full h-full border-none"
              onLoad={() => setIsLoading(false)}
              title="Shurukkha Standard Portal"
              allow="geolocation; microphone; camera; midi; encrypted-media; autoplay"
            />
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
