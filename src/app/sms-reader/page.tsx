"use client";

import { useState, useMemo } from "react";
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
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";

const MOCK_SMS = [
  { id: "SMS-442", sender: "bKash", body: "You have received Tk 5,000.00 from 01711223344. Ref: Invoice_992. Fee Tk 0.00. Balance Tk 12,450.20. 30/06/2026 14:22", timestamp: Date.now() - 5000, type: "FINANCE", status: "VERIFIED" },
  { id: "SMS-441", sender: "Nagad", body: "Successful Cash-in of Tk 2,500.00. TxnID: 9L2K8M1J. 30/06/2026 14:15. Help: 16167", timestamp: Date.now() - 15000, type: "FINANCE", status: "VERIFIED" },
  { id: "SMS-440", sender: "Standard Chartered", body: "Your OTP for Online Transaction of USD 200.00 is 882901. Valid for 3 mins. DO NOT share this with anyone.", timestamp: Date.now() - 45000, type: "SECURITY", status: "PENDING" },
  { id: "SMS-439", sender: "NoorNexus", body: "System Alert: Node-04 latency spike detected in UK corridor. Immediate sync required.", timestamp: Date.now() - 120000, type: "INFRA", status: "VERIFIED" },
];

export default function SMSReaderPage() {
  const [search, setSearch] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedSms, setSelectedSms] = useState<any>(null);
  const { emitEvent } = useKernel();
  const { toast } = useToast();

  const filteredSms = useMemo(() => {
    return MOCK_SMS.filter(s => 
      s.body.toLowerCase().includes(search.toLowerCase()) || 
      s.sender.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleIntercept = () => {
    setIsSyncing(true);
    emitEvent('INFRA', 'SMS_INTERCEPTION_SYNC', 3, { mode: 'ANYCAST_V2' });
    
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "SMS Mesh Rebuilt",
        description: "Latest mobile signals from Node-04 have been intercepted.",
      });
    }, 2000);
  };

  const handleParse = (sms: any) => {
    toast({
      title: "AI Parsing Active",
      description: "Extracting deterministic metadata from payload...",
    });
    emitEvent('FINANCE', 'SMS_PAYLOAD_PARSED', 4, { smsId: sms.id });
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
             <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
                SIGNAL_MODE: AES_GCM_DECRYPT
             </Badge>
             <Button size="sm" onClick={handleIntercept} disabled={isSyncing} className="cyan-glow bg-accent text-background font-bold text-[10px] h-8 px-4">
                {isSyncing ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Radio className="h-3.5 w-3.5 mr-1.5" />}
                Sync Signals
             </Button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold tracking-tighter uppercase italic">Signal <span className="text-accent">Interception</span></h2>
              <p className="text-muted-foreground text-sm italic max-w-2xl">
                "Parsing real-time GSM/UMTS signals via distributed anycast gateways for automated ledger reconciliation."
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="Search sender, OTP or reference..." 
                 className="pl-10 bg-secondary/30 border-white/5 h-10 text-xs"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7">
               <Card className="glass-panel border-white/5 flex flex-col h-[650px] overflow-hidden">
                  <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                     <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-accent" />
                        GSM Signal Stream
                     </CardTitle>
                     <Badge variant="outline" className="text-[8px] font-mono border-green-500/30 text-green-400 animate-pulse">MONITORING...</Badge>
                  </CardHeader>
                  <CardContent className="p-0 flex-1">
                     <ScrollArea className="h-full">
                        <div className="divide-y divide-white/5">
                           {filteredSms.map((sms) => (
                             <div 
                               key={sms.id} 
                               className={cn(
                                 "p-6 cursor-pointer transition-all hover:bg-white/5 group flex items-start gap-4",
                                 selectedSms?.id === sms.id ? "bg-accent/5 border-l-4 border-l-accent" : "border-l-4 border-l-transparent"
                               )}
                               onClick={() => setSelectedSms(sms)}
                             >
                                <div className={cn(
                                  "p-3 rounded-xl bg-black/40 border border-white/5 shrink-0 transition-transform group-hover:scale-110",
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
                                   <div className="flex items-center gap-2">
                                      <Badge variant="ghost" className="text-[8px] p-0 font-mono uppercase opacity-50">{sms.id}</Badge>
                                      <span className="text-[8px] text-muted-foreground/30">•</span>
                                      <span className="text-[8px] text-green-400 font-bold uppercase">{sms.status}</span>
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
               <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl h-fit">
                  <CardHeader className="p-6 border-b border-white/10">
                     <div className="flex items-center justify-between">
                        <CardTitle className="text-sm uppercase tracking-[0.2em] flex items-center gap-2 text-accent">
                           <Fingerprint className="h-4 w-4" />
                           Payload Inspector
                        </CardTitle>
                        {selectedSms && (
                           <Badge className="bg-accent text-background font-bold text-[8px] uppercase tracking-widest">{selectedSms.type}</Badge>
                        )}
                     </div>
                  </CardHeader>
                  <CardContent className="p-6">
                     {selectedSms ? (
                       <div className="space-y-6 animate-fade-in">
                          <div className="space-y-2">
                             <p className="text-[10px] uppercase font-bold text-muted-foreground">Decrypted Payload</p>
                             <div className="p-4 rounded-xl bg-black/40 border border-white/10 italic text-sm text-white/90 leading-relaxed shadow-inner">
                                "{selectedSms.body}"
                             </div>
                          </div>

                          <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-4 font-mono text-[10px] leading-relaxed">
                             <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-muted-foreground uppercase">Trace ID</span>
                                <span className="text-accent">{selectedSms.id}</span>
                             </div>
                             <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-muted-foreground uppercase">GSM Seal</span>
                                <span className="text-green-400">AUTHENTIC_GSM</span>
                             </div>
                             <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-muted-foreground uppercase">Sovereign Node</span>
                                <span className="text-white">NODE-04 (UK)</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground uppercase">Decryption</span>
                                <span className="text-accent">X25519-SUCCESS</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                             <Button className="h-11 bg-accent text-background font-bold text-[10px] uppercase tracking-widest cyan-glow" onClick={() => handleParse(selectedSms)}>
                                <Cpu className="mr-2 h-4 w-4" /> Parse for Ledger
                             </Button>
                             <Button variant="ghost" className="h-11 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5">
                                <Lock className="mr-2 h-4 w-4" /> Re-encrypt Log
                             </Button>
                          </div>
                       </div>
                     ) : (
                       <div className="h-60 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                          <Activity className="h-12 w-12 text-accent animate-logo-spin" />
                          <p className="text-xs uppercase font-bold tracking-[0.3em]">Intercepting GSM Frequency...</p>
                       </div>
                     )}
                  </CardContent>
               </Card>

               <Card className="glass-panel border-white/5">
                  <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                       <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                       Interception Protocols
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                     {[
                       { label: "SMS Sharding", status: "Active" },
                       { label: "OTP Shield", status: "Optimal" },
                       { label: "Idempotency Lock", status: "Enabled" }
                     ].map((p, i) => (
                       <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-black/20 border border-white/5">
                          <span className="text-[9px] font-bold uppercase text-muted-foreground">{p.label}</span>
                          <span className="text-[10px] font-bold uppercase text-accent font-mono">{p.status}</span>
                       </div>
                     ))}
                  </CardContent>
               </Card>

               <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-center shadow-inner group hover:bg-primary/10 transition-all cursor-pointer">
                  <Mail className="h-6 w-6 text-primary mx-auto mb-1 opacity-50 group-hover:scale-110 transition-transform" />
                  <p className="text-[9px] text-primary font-bold uppercase tracking-widest">
                     System is inter-linked with ANYCAST_V2 SMS Gateway for sub-50ms OTP extraction.
                  </p>
               </div>
            </div>
          </div>
        </main>

        <footer className="p-6 border-t border-white/5 text-center">
           <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
              NoorNexus Signal Command v1.2.0-stable • Multi-Rail Interception
           </p>
        </footer>
      </SidebarInset>
    </div>
  );
}
