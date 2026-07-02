
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Trophy, 
  Loader2, 
  RefreshCw, 
  ExternalLink, 
  Maximize2, 
  ChevronLeft,
  Activity,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * FifaHubPortal
 * Persistent iframe integration for the FIFA Hub.
 */
export function FifaHubPortal() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const isVisible = pathname === '/fifa-hub';
  const targetUrl = "https://fifa-hub-1.vercel.app/";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowContent(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  // Fail-safe for loading state
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isVisible && isLoading) {
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 8000);
    }
    return () => clearTimeout(timeout);
  }, [isVisible, isLoading]);

  const handleRefresh = () => {
    setIsLoading(true);
    setLoadError(false);
    if (iframeRef.current) {
      iframeRef.current.src = targetUrl;
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Fullscreen Error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-[60] bg-background flex transition-all duration-500 ease-in-out",
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"
      )}
    >
      <div className={cn(
        "flex w-full h-full transition-transform duration-500",
        showContent ? "translate-x-0" : "translate-x-10"
      )}>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden bg-black">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/90 backdrop-blur-xl px-4 md:px-6 shrink-0 shadow-2xl">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="h-9 w-9 md:w-auto md:px-3 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all font-bold uppercase text-[10px]"
              >
                <Link href="/dashboard">
                  <ChevronLeft className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              </Button>
              <div className="h-6 w-px bg-white/10 hidden md:block mx-1" />
              <SidebarTrigger />
            </div>

            <div className="flex-1 truncate">
              <h1 className="text-xs md:text-sm font-headline font-bold flex items-center gap-2 text-accent">
                <Trophy className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent shrink-0 animate-pulse" />
                <span className="truncate uppercase italic tracking-tighter">FIFA LIVE HUB</span>
              </h1>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
              <Badge variant="outline" className="hidden sm:flex border-accent/20 text-accent font-mono text-[8px] md:text-[9px] uppercase tracking-widest px-2">
                <Activity className="mr-1.5 h-3 w-3" /> LIVE STREAM
              </Badge>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 md:w-auto border-white/10 text-[10px] uppercase font-bold px-0 md:px-3 hover:bg-accent/10 hover:text-accent"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5 md:mr-1.5", isLoading && "animate-spin")} />
                  <span className="hidden md:inline">Reconnect</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-white"
                  onClick={toggleFullScreen}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>

                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white" asChild>
                  <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 relative bg-black">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                  <Play className="h-12 w-12 text-accent relative z-10 animate-logo-spin" strokeWidth={3} />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent">Linking Media Corridor</p>
                  <p className="text-[8px] font-mono text-muted-foreground uppercase opacity-50">High Bandwidth Tunnel • Node-04</p>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={targetUrl}
              className={cn(
                "w-full h-full border-none transition-opacity duration-700",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setLoadError(true);
                setIsLoading(false);
              }}
              title="FIFA Hub Portal"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
            />

            {loadError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background p-6 text-center space-y-4">
                <Trophy className="h-12 w-12 text-red-500/50" />
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white uppercase">Stream Interrupted</h3>
                  <p className="text-xs text-muted-foreground italic">Could not establish a stable connection with the FIFA Hub.</p>
                </div>
                <Button onClick={handleRefresh} className="bg-accent text-background font-bold">
                  Retry Connection
                </Button>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
