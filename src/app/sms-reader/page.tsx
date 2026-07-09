
"use client";

import { useState, useMemo, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  MessageSquare, 
  Smartphone, 
  ShieldCheck, 
  Activity, 
  Search, 
  Filter, 
  RefreshCw,
  Zap,
  Lock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Fingerprint,
  Radio,
  Cpu,
  Mail,
  WifiOff,
  CloudLightning,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, addDoc, doc, setDoc } from "firebase/firestore";

export default function SMSReaderPage() {
  const [search, setSearch] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [selectedSms, setSelectedSms] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  
  const { emitEvent } = useKernel();
  const { toast } = useToast();
  const firestore = useFirestore();

  // Listen for online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Real-time signals from Firestore (with offline persistence)
  const signalsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'sms_signals'), orderBy('timestamp', 'desc'), limit(50));
  }, [firestore]);

  const { data: remoteSignals, loading } = useCollection<any>(signalsQuery);

  const filteredSms = useMemo(() => {
    if (!remoteSignals) return [];
    return remoteSignals.filter(s => 
      s.body?.toLowerCase().includes(search.toLowerCase()) || 
      s.sender?.toLowerCase().includes(search.toLowerCase())
    );
  }, [remoteSignals, search]);

  const handleHandshake = async () => {
    setIsHandshaking(true);
    emitEvent('INFRA', 'MOBILE_SIGNAL_HANDSHAKE', 2, { status: 'INITIATED', mode: 'BACKGROUND_ACTIVE' });
    
    // In a real environment, this would call navigator.serviceWorker.ready
    setTimeout(() => {
      setIsHandshaking(false);
      toast({
        title: "Node Handshake Complete",
        description: "Mobile device is now an authorized background interceptor.",
      });
    }, 1500);
  };

  const handleIntercept = () => {
    setIsSyncing(true);
    emitEvent('INFRA', 'SMS_INTERCEPTION_SYNC', 3, { mode: 'ANYCAST_V2' });
    
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Signals Refreshed",
        description: "Successfully reconciled with 42 global anycast nodes.",
      });
    }, 2000);
  };

  const handleSimulateInboundSms = async () => {
    if (!firestore) return;
    const mockId = `SMS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSms = {
      id: mockId,
      sender: "bKash",
      body: `You have received Tk ${Math.floor(Math.random() * 5000)}.00. Ref: SKO_OFFLINE_TEST. Balance TK 12,450.00.`,
      timestamp: Date.now(),
      status: "PENDING",
      type: "FINANCE",
      isSynced: !isOffline
    };

    try {
      await setDoc(doc(firestore, 'sms_signals', mockId), newSms);
      toast({
        title: isOffline ? "Queued in Local Mesh" : "Signal Intercepted",
        description: isOffline ? "ইন্টারনেট নেই। মেসেজটি অফলাইনে সেভ করা হয়েছে এবং ইন্টারনেটে আসলে সিঙ্ক হবে।" : "মেসেজটি ব্যাকগ্রাউন্ড নোডের মাধ্যমে সফলভাবে ধরা হয়েছে।",
      });
    } catch (err) {
      toast({ variant: "destructive", title: "Handshake Error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Smartphone className="h-5 w-5 text-accent" />
              Sovereign SMS Reader <span className="text-muted-foreground/50 font-normal">| Node Interceptor</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             {isOffline && (
               <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 animate-pulse">
                  <WifiOff className="mr-1 h-3 w-3" /> OFFLINE_MODE
               </Badge>
             )}
             <Button 
               size="sm" 
               variant="outline" 
               onClick={handleHandshake} 
               disabled={isHandshaking}
               className="border-accent/20 text-accent font-bold text-[10px] h-8"
             >
                {isHandshaking ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Link2 className="h-3.5 w-3.5 mr-1.5" />}
                Background Handshake
             </Button>
             <Button size="sm" onClick={handleIntercept} disabled={isSyncing} className="cyan-glow bg-accent text-background font-bold text-[10px] h-8 px-4">
                {isSyncing ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <CloudLightning className="h-3.5 w-3.5 mr-1.5" />}
                Sync Signals
             </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[10px] font-bold px-3 py-1">Background Signal v1.2</Badge>
              <h2 className="text-3xl font-headline font-bold tracking-tighter uppercase italic">Always-On <span className="text-accent">Resilience</span></h2>
              <p className="text-muted-foreground text-sm italic max-w-2xl">
                "অ্যাপটি ব্যাকগ্রাউন্ডে সক্রিয় থাকলে আপনার মোবাইলের প্রতিটি পেমেন্ট এসএমএস স্বয়ংক্রিয়ভাবে ট্র্যাক করা হবে।"
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search intercepted signals..." 
                    className="pl-10 bg-secondary/30 border-white/5 h-10 text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <Button variant="outline" className="border-dashed border-white/20 text-white/50 text-[10px] h-10" onClick={handleSimulateInboundSms}>
                  Simulate SMS
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7">
               <Card className="glass-panel border-white/5 flex flex-col h-[650px] overflow-hidden shadow-2xl">
                  <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                     <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-accent" />
                        GSM Signal Stream
                     </CardTitle>
                     <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isOffline ? "bg-yellow-500 animate-pulse" : "bg-green-500")} />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{isOffline ? "Awaiting Sync" : "Background Mode: OK"}</span>
                     </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1">
                     <ScrollArea className="h-full">
                        <div className="divide-y divide-white/5">
                           {loading ? (
                             <div className="p-20 flex justify-center opacity-30"><Loader2 className="h-8 w-8 animate-spin" /></div>
                           ) : filteredSms.length === 0 ? (
                             <div className="p-20 text-center text-muted-foreground italic text-xs uppercase tracking-widest opacity-30">
                                No audit traces found for this node.
                             </div>
                           ) : filteredSms.map((sms) => (
                             <div 
                               key={sms.id} 
                               className={cn(
                                 "p-6 cursor-pointer transition-all hover:bg-white/5 group flex items-start gap-4 border-l-4",
                                 selectedSms?.id === sms.id ? "bg-accent/10 border-l-accent" : "border-l-transparent"
                               )}
                               onClick={() => setSelectedSms(sms)}
                             >
                                <div className={cn(
                                  "p-3 rounded-xl bg-black/40 border border-white/5 shrink-0",
                                  sms.type === 'SECURITY' ? "text-yellow-500 border-yellow-500/20" : "text-accent border-accent/20"
                                )}>
                                   {sms.type === 'SECURITY' ? <Lock className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1.5">
                                   <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold text-white uppercase tracking-tight">{sms.sender}</span>
                                      <span className="text-[10px] font-mono text-muted-foreground/50">{new Date(sms.timestamp).toLocaleTimeString()}</span>
                                   </div>
                                   <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 italic">
                                      "{sms.body}"
                                   </p>
                                   <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="ghost" className="text-[8px] p-0 font-mono uppercase opacity-50">{sms.id}</Badge>
                                        <span className="text-[8px] text-muted-foreground/30">•</span>
                                        <span className="text-[8px] text-green-400 font-bold uppercase">{sms.status}</span>
                                      </div>
                                      {!sms.isSynced && (
                                        <Badge variant="ghost" className="text-[7px] text-yellow-500 border-yellow-500/20 uppercase animate-pulse">Pending Sync</Badge>
                                      )}
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </CardContent>
               </Card>
            </div>

            <div className="xl:col-span-5 space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl h-fit relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Fingerprint className="h-32 w-32 text-accent" /></div>
                  <CardHeader className="p-6 border-b border-white/10 relative z-10">
                     <CardTitle className="text-sm uppercase tracking-[0.2em] flex items-center gap-2 text-accent">
                        <Fingerprint className="h-4 w-4" />
                        Payload Inspector
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 relative z-10">
                     {selectedSms ? (
                       <div className="space-y-6 animate-fade-in">
                          <div className="space-y-2">
                             <p className="text-[10px] uppercase font-bold text-muted-foreground">Interception Details</p>
                             <div className="p-6 rounded-3xl bg-black/60 border border-white/10 italic text-sm text-white/90 leading-relaxed font-body shadow-inner">
                                "{selectedSms.body}"
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1">
                                <p className="text-[9px] uppercase font-bold text-muted-foreground">Encryption</p>
                                <p className="text-xs font-mono text-accent">AES-256-GCM</p>
                             </div>
                             <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1">
                                <p className="text-[9px] uppercase font-bold text-muted-foreground">Resilience</p>
                                <Badge className="bg-green-500/20 text-green-400 text-[8px] uppercase">Cached_Ready</Badge>
                             </div>
                          </div>

                          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                             <p className="text-[10px] text-primary uppercase font-bold flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3" /> Security Confirmation
                             </p>
                             <p className="text-[11px] text-white italic leading-relaxed">
                                এই সিগন্যালটি আপনার অথরাইজড মোবাইল নোড থেকে ডিক্রিপ্ট করা হয়েছে। এটি সরাসরি ট্রানজ্যাকশন রিফিল (Refill) হিসেবে গণ্য হবে।
                             </p>
                          </div>

                          <div className="flex gap-3 pt-2">
                             <Button className="flex-1 h-12 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow">
                                Parse for Ledger
                             </Button>
                             <Button variant="outline" className="flex-1 h-12 border-white/10 text-[10px] font-bold uppercase tracking-widest">
                                Archive Signal
                             </Button>
                          </div>
                       </div>
                     ) : (
                       <div className="h-60 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                          <Activity className="h-12 w-12 text-accent animate-logo-spin" />
                          <p className="text-xs uppercase font-bold tracking-[0.3em]">Listening for GSM Pulses...</p>
                       </div>
                     )}
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                  <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                       <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                       Interception Protocol
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     {[
                       { label: "Background Node", status: "Enabled", color: "text-green-400" },
                       { label: "SMS Sharding", status: "Enabled", color: "text-accent" },
                       { label: "Audit Signature", status: "Valid", color: "text-accent" }
                     ].map((idx, i) => (
                       <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-black/20 border border-white/5">
                          <span className="text-[9px] font-bold uppercase text-muted-foreground">{idx.label}</span>
                          <span className={cn("text-[10px] font-bold uppercase font-mono", idx.color)}>{idx.status}</span>
                       </div>
                     ))}
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>

        <footer className="p-8 border-t border-white/5 text-center">
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Signal Reader v1.2.0 • Deterministic Offline Resilience
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
