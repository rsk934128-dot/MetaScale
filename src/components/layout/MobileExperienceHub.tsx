
"use client";

import { useState } from "react";
import { 
  Smartphone, 
  X, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Activity, 
  ArrowRight,
  Loader2,
  Signal,
  Wifi,
  Battery
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function MobileExperienceHub() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="h-14 w-14 rounded-full bg-accent text-background shadow-2xl cyan-glow animate-float hover:scale-110 transition-transform group p-0"
            title="Mobile OS Experience"
          >
            <Smartphone className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-2xl border-white/5 p-0 overflow-hidden sm:rounded-3xl shadow-[0_0_100px_rgba(0,242,255,0.15)]">
          {/* Accessibility Headers */}
          <DialogHeader className="sr-only">
            <DialogTitle>Mobile Experience Hub</DialogTitle>
            <DialogDescription>
              Explore the mobile-optimized interface of FusionPay Sovereign OS.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-[700px]">
            {/* Info Panel */}
            <div className="p-10 flex flex-col justify-center space-y-8 bg-accent/5 border-r border-white/5">
              <div className="space-y-4">
                <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.4em] text-[10px] font-bold">
                  Sovereign Mesh v1.2
                </Badge>
                <h2 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase italic leading-none">
                  Adaptive <br />
                  <span className="text-accent">Mobile Node</span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  "আপনার সোভারেন ওএস এখন আপনার হাতের মুঠোয়। ইন্সটিটিউশনাল স্ট্যান্ডার্ড পেমেন্ট এবং সিকিউরিটি এখন মোবাইল-ফার্স্ট ইন্টারফেসে।"
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Zap, title: "Sub-10ms UX", desc: "Optimized anycast routing for mobile data." },
                  { icon: ShieldCheck, title: "Biometric Auth", desc: "FaceID & Fingerprint binding support." },
                  { icon: Globe, title: "Universal QR", desc: "Scan and settle instantly via camera node." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent group-hover:scale-110 transition-transform">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Button className="bg-white text-background font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-full" onClick={() => setIsOpen(false)}>
                  Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* iPhone Mockup Panel */}
            <div className="relative bg-black flex items-center justify-center p-10">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              <div className="iphone-frame animate-fade-in relative z-10 scale-90 md:scale-100">
                <div className="iphone-notch">
                  <div className="iphone-island" />
                </div>
                <div className="iphone-screen">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 w-full h-10 px-8 flex justify-between items-center z-50">
                    <span className="text-[10px] font-bold text-white">9:41</span>
                    <div className="flex items-center gap-1.5 opacity-80">
                      <Signal className="h-3 w-3 text-white" />
                      <Wifi className="h-3 w-3 text-white" />
                      <Battery className="h-3 w-3 text-white rotate-90" />
                    </div>
                  </div>

                  {/* App Content Simulation */}
                  <div className="w-full h-full bg-[#13151a] p-6 pt-14 space-y-6 overflow-y-auto scrollbar-hide">
                    <div className="flex justify-between items-center">
                      <Logo size="sm" />
                      <Badge variant="outline" className="text-[8px] border-accent/20 text-accent">NODE-04</Badge>
                    </div>

                    <div className="p-5 rounded-3xl bg-accent/5 border border-accent/20 space-y-1">
                      <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest">Main Balance</p>
                      <p className="text-2xl font-headline font-bold text-white">$12,450</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-4 rounded-2xl bg-secondary/40 border border-white/5 flex flex-col items-center gap-2">
                          <Zap className="h-5 w-5 text-accent" />
                          <span className="text-[8px] font-bold uppercase">Send</span>
                       </div>
                       <div className="p-4 rounded-2xl bg-secondary/40 border border-white/5 flex flex-col items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          <span className="text-[8px] font-bold uppercase">Recv</span>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[9px] font-bold uppercase text-muted-foreground">Recent Traces</p>
                       {[1, 2, 3].map((_, i) => (
                         <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                                  <Activity className="h-4 w-4 text-accent" />
                               </div>
                               <div>
                                  <p className="text-[9px] font-bold text-white uppercase">Settlement_{i}</p>
                                  <p className="text-[7px] text-muted-foreground">04:22 PM</p>
                               </div>
                            </div>
                            <span className="text-[9px] font-mono text-accent">+$200.00</span>
                         </div>
                       ))}
                    </div>

                    {/* App Navigation Sim */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-12 rounded-2xl bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-around px-2 shadow-2xl">
                       <Globe className="h-4 w-4 text-accent" />
                       <Activity className="h-4 w-4 text-muted-foreground" />
                       <Smartphone className="h-4 w-4 text-muted-foreground" />
                       <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
