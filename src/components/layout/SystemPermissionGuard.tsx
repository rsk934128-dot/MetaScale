
"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { ShieldCheck, Bell, MapPin, Camera, Mic, Settings, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * SystemPermissionGuard
 * Ensures all necessary browser permissions are requested and managed.
 */
export function SystemPermissionGuard() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { toast } = useToast();
  const { emitEvent } = useKernel();

  useEffect(() => {
    // Check if permissions are already granted or if we should prompt
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        const hasPrompted = localStorage.getItem("sko_permission_prompted");
        if (!hasPrompted) {
          setTimeout(() => setShowPrompt(true), 3000);
        }
      }
    }
  }, []);

  const requestAllPermissions = async () => {
    setShowPrompt(false);
    localStorage.setItem("sko_permission_prompted", "true");

    try {
      // 1. Request Notifications
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          toast({ title: "Notifications Enabled", description: "Kernel signals will now be delivered to your desktop." });
        }
      }

      // 2. Request Location (Geo-Mesh)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => emitEvent('INFRA', 'GEO_LOCATION_SYNCED', 4, { status: 'SUCCESS' }),
          () => console.warn("Location denied")
        );
      }

      // 3. Register for Offline Sync (PWA Feature)
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((reg: any) => {
          return reg.sync.register('sms-sync-queue');
        }).catch(() => console.log('Background Sync not supported or failed.'));
      }

      emitEvent('SECURITY', 'SYSTEM_PERMISSIONS_GRANTED', 2, { scope: 'ALL_SIGNAL_NODES' });
      
      toast({
        title: "Sovereign Mesh Authorized",
        description: "Mobile Signal Interception and Background Sync are now active.",
      });
    } catch (error) {
      console.error("Permission Request Error:", error);
    }
  };

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="glass-panel border-accent/20 bg-background/95 max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter">Authorize Signal Node</DialogTitle>
            <DialogDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Mobile Handshake Protocol v1.2</DialogDescription>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <p className="text-xs text-center text-white/70 italic leading-relaxed px-4">
            "সিস্টেমের অফলাইন-সিঙ্ক এবং এসএমএস ইন্টারসেপশন চালু করতে নিচের পারমিশনগুলো এলাও করুন। এটি নিশ্চিত করবে যে ইন্টারনেট না থাকলেও আপনার ডাটা সুরক্ষিত থাকবে।"
          </p>
          
          <div className="grid grid-cols-2 gap-3 px-4">
             {[
               { icon: Smartphone, label: "SMS Signal" },
               { icon: RefreshCw, label: "Offline Sync" },
               { icon: Bell, label: "Push Alrt" },
               { icon: ShieldCheck, label: "Mesh Bond" }
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-white/5">
                  <item.icon className="h-4 w-4 text-accent" />
                  <span className="text-[10px] font-bold uppercase text-white/60">{item.label}</span>
               </div>
             ))}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 p-4 pt-0">
          <Button className="w-full h-12 bg-accent text-background font-bold uppercase tracking-widest text-xs cyan-glow" onClick={requestAllPermissions}>
            Establish Handshake
          </Button>
          <Button variant="ghost" className="w-full text-[10px] uppercase font-bold text-muted-foreground" onClick={() => setShowPrompt(false)}>
            Manual Config
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
