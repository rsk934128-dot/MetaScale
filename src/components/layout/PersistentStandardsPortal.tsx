
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ShieldCheck, Globe, Loader2, RefreshCw, ExternalLink, Maximize2, Zap, Shield } from "lucide-react";
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
  const [showContent, setShowContent] = useState(false);
  const isVisible = pathname === '/shurukkha-standard';
  const targetUrl = "https://noor-nexus-rubel.vercel.app/";

  // Transition effect for visibility
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowContent(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[60] bg-background flex transition-all duration-500 ease-in-out",
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"
      )}
    >
      <div className={cn(
        "flex w-full h-full transition-transform duration-500",
        showContent ? "translate-x-0" : "translate-x-10"
      )}>
        {/* Persistent Sidebar and Layout to mimic a native page */}
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden bg-background">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6 shrink-0 shadow-sm">
            <SidebarTrigger />
            <div className="flex-1 truncate">
              <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-accent">
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0" />
                <span className="truncate uppercase italic tracking-tighter">Shurukkha Standards Portal</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden lg:flex border-accent/20 text-accent font-mono text-[9px] uppercase tracking-widest px-3">
                <Shield className="mr-2 h-3 w-3" /> ISO 20022 READY
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-white/10 text-[10px] uppercase font-bold px-2 md:px-3 hover:bg-accent/10 hover:text-accent transition-colors"
                onClick={() => {
                  const iframe = document.getElementById('persistent-standard-iframe') as HTMLIFrameElement;
                  if (iframe) {
                    setIsLoading(true);
                    iframe.src = targetUrl;
                  }
                }}
              >
                <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isLoading && "animate-spin")} />
                <span className="hidden xs:inline">Sync Mesh Node</span>
                <span className="xs:hidden">Sync</span>
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-bold p-2 text-muted-foreground hover:text-white" asChild title="Open in new tab">
                <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </header>

          <main className="flex-1 relative bg-black overflow-hidden group">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl animate-fade-in">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                  <Loader2 className="h-12 w-12 animate-spin text-accent relative z-10" strokeWidth={3} />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent animate-pulse">Establishing Secure Tunnel</p>
                  <p className="text-[8px] font-mono text-muted-foreground uppercase opacity-50 tracking-widest">ENCRYPTION: AES-256-GCM • NODE: 04</p>
                </div>
              </div>
            )}
            
            <iframe
              id="persistent-standard-iframe"
              src={targetUrl}
              className={cn(
                "w-full h-full border-none transition-opacity duration-700",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsLoading(false)}
              title="Shurukkha Standard Portal"
              allow="geolocation; microphone; camera; midi; encrypted-media; autoplay"
            />

            {/* Subtle Overlay for Mil-Spec feel */}
            <div className="absolute inset-0 pointer-events-none border-t border-white/5 shadow-[inset_0_1px_20px_rgba(0,0,0,0.5)]" />
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
