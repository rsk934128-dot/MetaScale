
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsContainer } from "@/components/settings/SettingsContainer";
import { PWAInstaller } from "@/components/settings/PWAInstaller";
import { Settings as SettingsIcon, ShieldCheck, Zap, Download, Camera, Mic, MapPin, Bell, RefreshCw, Smartphone, Settings2, ExternalLink, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [permissionStatus, setPermissionStatus] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const checkPermissions = async () => {
    setIsRefreshing(true);
    const status: Record<string, string> = {};
    
    if (typeof window !== "undefined" && "Notification" in window) {
      status.notifications = Notification.permission;
    }

    if (typeof window !== "undefined" && "navigator" in window && "permissions" in navigator) {
      try {
        const geo = await navigator.permissions.query({ name: "geolocation" as any });
        status.location = geo.state;
        
        const cam = await navigator.permissions.query({ name: "camera" as any });
        status.camera = cam.state;

        const mic = await navigator.permissions.query({ name: "microphone" as any });
        status.mic = mic.state;
      } catch (e) {
        console.warn("Permissions API not fully supported");
      }
    }

    setPermissionStatus(status);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "granted": return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-bold">GRANTED</Badge>;
      case "denied": return <Badge variant="destructive">DENIED</Badge>;
      default: return <Badge variant="outline">AWAITING</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-white">
              <SettingsIcon className="h-5 w-5 text-accent" />
              System Settings
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-accent/20 text-accent">
              <Zap className="mr-1 h-3 w-3" /> Kernel v1.2.0-stable
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-8">
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold mb-2 uppercase tracking-tighter italic">OS <span className="text-accent">Configuration</span></h2>
            <p className="text-muted-foreground">
              Manage deterministic execution policies, global thresholds, and sovereign security protocols.
            </p>
          </div>
          
          <Tabs defaultValue="config" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
              <TabsTrigger value="config" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">System Parameters</TabsTrigger>
              <TabsTrigger value="permissions" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">Hardware Signals</TabsTrigger>
              <TabsTrigger value="install" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full flex gap-2">
                <Download className="h-3 w-3" /> Install App
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config">
              <SettingsContainer />
            </TabsContent>

            <TabsContent value="permissions" className="space-y-8 animate-fade-in">
               <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-headline font-bold text-white uppercase italic">Signal Clearances</h3>
                    <p className="text-xs text-muted-foreground">Status of hardware and API bridge permissions.</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold border-white/10" onClick={checkPermissions} disabled={isRefreshing}>
                    <RefreshCw className={cn("mr-2 h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                    Refresh Node
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'notifications', icon: Bell, label: "Notification Signals", desc: "For critical kernel alerts and payout updates." },
                    { id: 'location', icon: MapPin, label: "Anycast Geolocation", desc: "Required for geo-fencing and node proximity." },
                    { id: 'camera', icon: Camera, label: "Camera Node", desc: "Used for biometric authentication and QR scanning." },
                    { id: 'mic', icon: Mic, label: "Microphone Input", desc: "For secure voice-command directives." }
                  ].map((p) => (
                    <Card key={p.id} className="glass-panel border-white/5 overflow-hidden group hover:border-accent/30 transition-all">
                       <CardContent className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent group-hover:scale-110 transition-transform">
                                <p.icon className="h-5 w-5" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">{p.label}</p>
                                <p className="text-[10px] text-muted-foreground italic">{p.desc}</p>
                             </div>
                          </div>
                          {getStatusBadge(permissionStatus[p.id] || "default")}
                       </CardContent>
                    </Card>
                  ))}
               </div>

               {/* Mobile Deep Integration Guide */}
               <Card className="glass-panel border-accent/20 bg-accent/5 overflow-hidden">
                  <CardHeader className="bg-accent/10 border-b border-white/5">
                    <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-accent">
                      <Smartphone className="h-4 w-4" />
                      Mobile Deep Integration (Persistence)
                    </CardTitle>
                    <CardDescription className="text-xs italic">অ্যাপটি মোবাইলে সবসময় এক্টিভ রাখতে নিচের ধাপগুলো অনুসরণ করুন।</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <div className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center font-bold text-xs">1</div>
                           <p className="text-xs font-bold text-white uppercase">App Info</p>
                           <p className="text-[11px] text-muted-foreground leading-relaxed">আপনার মোবাইলের <span className="text-white font-bold italic">Settings &gt; Apps &gt; Sovereign OS</span> এ যান।</p>
                        </div>
                        <div className="space-y-2">
                           <div className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center font-bold text-xs">2</div>
                           <p className="text-xs font-bold text-white uppercase">Battery Usage</p>
                           <p className="text-[11px] text-muted-foreground leading-relaxed"><span className="text-white font-bold italic">Battery</span> সেকশনে গিয়ে <span className="text-accent font-bold">&quot;Unrestricted&quot;</span> বা <span className="text-accent font-bold">&quot;Don&apos;t Optimize&quot;</span> সিলেক্ট করুন।</p>
                        </div>
                        <div className="space-y-2">
                           <div className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center font-bold text-xs">3</div>
                           <p className="text-xs font-bold text-white uppercase">Auto-Start</p>
                           <p className="text-[11px] text-muted-foreground leading-relaxed"><span className="text-white font-bold italic">Permissions</span> ট্যাবে গিয়ে <span className="text-accent font-bold">&quot;Auto-start&quot;</span> অন করে দিন।</p>
                        </div>
                     </div>
                     
                     <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <Button className="flex-1 bg-accent text-background font-bold uppercase text-[10px] h-12 cyan-glow">
                           <Settings2 className="mr-2 h-4 w-4" /> Open Mobile Settings
                        </Button>
                        <Button variant="outline" className="flex-1 border-white/10 h-12 text-[10px] font-bold uppercase text-white">
                           <ExternalLink className="mr-2 h-4 w-4" /> View Visual Guide
                        </Button>
                     </div>
                  </CardContent>
               </Card>

               <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex gap-4 items-start shadow-xl">
                  <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase">Privacy Protocol v1.2</p>
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                      &quot;FusionPay handles all hardware signals with end-to-end encryption (AES-256-GCM). Persistent mode allows the app to intercept SMS signals even when closed, ensuring 100% transaction integrity.&quot;
                    </p>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="install" className="animate-fade-in">
              <PWAInstaller />
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}
