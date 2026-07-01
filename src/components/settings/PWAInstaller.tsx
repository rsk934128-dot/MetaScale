
"use client";

import { useState, useEffect } from "react";
import { Smartphone, Monitor, Download, CheckCircle2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast({ title: "Installation Started", description: "Sovereign OS is being added to your device." });
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isStandalone) {
    return (
      <Card className="glass-panel border-green-500/20 bg-green-500/5">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase">App Mode Active</p>
              <p className="text-xs text-muted-foreground italic">You are running the optimized standalone version of Sovereign OS.</p>
            </div>
          </div>
          <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono">STANDALONE_V1.2</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-tighter">
            <Download className="h-5 w-5 text-accent" />
            System Installation Node
          </CardTitle>
          <CardDescription className="text-xs">ইন্সটল করুন এবং আপনার হোম স্ক্রীন থেকে সরাসরি এক্সেস করুন।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase">
                  <Monitor className="h-3.5 w-3.5" /> Desktop Advantage
                </div>
                <ul className="space-y-2 text-[11px] text-white/70 italic">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Launch from Taskbar/Dock</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Full-screen focus mode</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Sub-10ms UI sync</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase">
                  <Smartphone className="h-3.5 w-3.5" /> Mobile Portability
                </div>
                <ul className="space-y-2 text-[11px] text-white/70 italic">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> Instant access from Home Screen</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> No browser address bar clutter</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> Faster biometric unlock integration</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 flex gap-3">
            <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              ইন্সটলেশন বাটন কাজ না করলে, আপনার ব্রাউজার মেনু থেকে (⋮ বা Share আইকন) "Add to Home Screen" বা "Install App" অপশনটি সিলেক্ট করুন।
            </p>
          </div>

          <Button 
            className="w-full h-12 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow"
            onClick={handleInstallClick}
            disabled={!isInstallable}
          >
            <Download className="mr-2 h-4 w-4" />
            {isInstallable ? "Install Sovereign OS" : "System Already Integrated or Incompatible"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
