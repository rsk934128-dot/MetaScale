
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
  Play,
  Lock,
  Unlock,
  Smartphone,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useKernel } from "@/components/kernel/KernelProvider";

export function FifaHubPortal() {
  const pathname = usePathname();
  const { isToffeeUnlocked, unlockToffee } = useKernel();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const isVisible = pathname === '/fifa-hub';
  const targetUrl = "https://toffeelive.com/";
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

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isVisible && isLoading) {
      timeout = setTimeout(() => setIsLoading(false), 8000);
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

  const handleToffeeLogin = async () => {
    if (!mobileNumber || mobileNumber.length < 11) return;
    setIsAuthenticating(true);
    await unlockToffee(mobileNumber);
    setIsAuthenticating(false);
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
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
                <span className="truncate uppercase italic tracking-tighter">TOFFEE LIVE TERMINAL</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className={cn(
                "hidden sm:flex border-accent/20 text-accent font-mono text-[8px] md:text-[9px] uppercase tracking-widest px-2",
                isToffeeUnlocked && "border-green-500 text-green-400"
              )}>
                {isToffeeUnlocked ? <Unlock className="mr-1.5 h-3 w-3" /> : <Lock className="mr-1.5 h-3 w-3" />}
                {isToffeeUnlocked ? "CHANNELS UNLOCKED" : "ACCESS RESTRICTED"}
              </Badge>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 border-white/10 text-[10px] uppercase font-bold px-3"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullScreen}>
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 relative bg-black">
            {/* Unlock Overlay */}
            {!isToffeeUnlocked && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md p-6 text-center animate-fade-in">
                 <div className="max-w-md w-full space-y-8 p-10 rounded-3xl border border-white/5 bg-secondary/20 shadow-2xl">
                    <div className="mx-auto w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center relative">
                       <Zap className="h-10 w-10 text-accent animate-pulse" />
                       <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-background border border-white/10">
                          <Lock className="h-4 w-4 text-red-400" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-2xl font-headline font-bold text-white uppercase italic tracking-tighter">Authorize Toffee Node</h2>
                       <p className="text-xs text-muted-foreground leading-relaxed italic">
                         "আপনার অ্যাপ থেকে টফি লগইন সম্পন্ন করুন। সার্বভৌম কার্নেল ব্যবহার করে সকল প্রিমিয়াম চ্যানেল এবং লাইভ স্পোর্টস স্বয়ংক্রিয়ভাবে আনলক হয়ে যাবে।"
                       </p>
                    </div>

                    <div className="space-y-4">
                       <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Mobile Number (e.g. 017...)" 
                            className="pl-10 h-12 bg-black/40 border-white/10 text-center font-bold tracking-widest"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                          />
                       </div>
                       <Button 
                         className="w-full h-14 bg-accent text-background font-bold uppercase tracking-widest text-xs cyan-glow"
                         onClick={handleToffeeLogin}
                         disabled={isAuthenticating || mobileNumber.length < 11}
                       >
                          {isAuthenticating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                          Initialize Handshake
                       </Button>
                    </div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
                       Secured by Sovereign Kernel v1.2
                    </p>
                 </div>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95">
                <Play className="h-12 w-12 text-accent animate-logo-spin" />
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={targetUrl}
              className={cn(
                "w-full h-full border-none transition-opacity duration-700",
                (isLoading || !isToffeeUnlocked) ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setLoadError(true);
                setIsLoading(false);
              }}
              title="Toffee Live Portal"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
            />
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
