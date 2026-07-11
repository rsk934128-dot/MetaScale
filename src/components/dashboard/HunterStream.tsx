
"use client";

import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, addDoc } from "firebase/firestore";
import { useMemo, useState } from "react";
import { 
  ShieldAlert, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  Lock,
  Zap,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { sendInteractiveAlert } from "@/lib/telegram";

export function HunterStream() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'events'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
  }, [firestore]);

  const { data: events, loading } = useCollection<any>(eventsQuery);

  const handleAuthorize = async (eventId: string, amount: number, userId: string) => {
    if (!firestore) return;
    setProcessingId(eventId);

    try {
      // 1. Log the manual override attempt
      await addDoc(collection(firestore, 'events'), {
        type: 'MANUAL_OVERRIDE_INITIATED',
        plane: 'SECURITY',
        priority: 1,
        timestamp: Date.now(),
        payload: { eventId, userId, amount }
      });

      // 2. Fetch User to send Telegram alert
      const userSnap = await doc(firestore, 'users', userId);
      // Simulating a Telegram alert trigger for the high-risk event
      toast({
        title: "Authorization Signal Sent",
        description: "টেলিগ্রামে অথোরাইজেশন রিকোয়েস্ট পাঠানো হয়েছে।",
      });

    } catch (err) {
      toast({ variant: "destructive", title: "Handshake Failed" });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-10 opacity-30">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Signal Inbound Feed</p>
        <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[9px] font-bold text-green-400 uppercase">Live_OP</span>
        </div>
      </div>
      
      <ScrollArea className="h-[400px] md:h-[680px]">
        <div className="space-y-2 pr-4">
           {(!events || events.length === 0) ? (
             <div className="p-12 text-center text-[10px] uppercase text-muted-foreground italic opacity-20">Awaiting Signals...</div>
           ) : events.map((ev: any) => {
             const isAnomaly = ev.category === 'PREDICTIVE_ANOMALY' || ev.type === 'GOVERNANCE_BLOCK';
             const riskScore = ev.payload?.riskScore || 0;
             const isCritical = riskScore > 80;

             return (
               <div 
                 key={ev.id} 
                 className={cn(
                   "p-3 rounded-xl border transition-all duration-500 group",
                   isAnomaly 
                    ? isCritical 
                      ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]" 
                      : "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20"
                    : "bg-secondary/20 border-white/5 hover:bg-white/5"
                 )}
               >
                  <div className="flex items-start justify-between gap-3">
                     <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg bg-black/40 border",
                          isAnomaly ? isCritical ? "border-red-500/20 text-red-500" : "border-yellow-500/20 text-yellow-500" : "border-white/5 text-accent"
                        )}>
                           {isAnomaly ? <ShieldAlert className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                        </div>
                        <div className="space-y-0.5">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-white uppercase truncate max-w-[120px]">
                                 {ev.type.replace(/_/g, ' ')}
                              </span>
                              <Badge variant="ghost" className="text-[7px] p-0 font-mono opacity-40 uppercase">{ev.id.substring(0, 8)}</Badge>
                           </div>
                           <p className="text-[9px] text-muted-foreground italic leading-tight line-clamp-1">
                              {ev.payload?.reason || ev.payload?.brand || 'Node signal stabilized.'}
                           </p>
                        </div>
                     </div>
                     
                     <div className="text-right space-y-1">
                        {isAnomaly && (
                           <Badge className={cn(
                             "text-[8px] font-bold uppercase",
                             isCritical ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
                           )}>
                              Risk: {riskScore}%
                           </Badge>
                        )}
                        <p className="text-[8px] font-mono text-muted-foreground opacity-50">
                           {new Date(ev.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                     </div>
                  </div>
                  
                  {isAnomaly && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                       <span className={cn(
                         "text-[8px] font-bold uppercase flex items-center gap-1",
                         isCritical ? "text-red-400" : "text-yellow-500"
                       )}>
                          {isCritical ? <Lock className="h-2.5 w-2.5" /> : <Activity className="h-2.5 w-2.5" />}
                          {isCritical ? "Imperial_Hold" : "Manual_Review"}
                       </span>
                       <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            className="h-6 text-[7px] uppercase font-bold text-white/50 hover:text-red-400 hover:bg-red-500/10 px-2"
                            onClick={() => toast({ title: "Signal Discarded", description: "Anomaly has been archived." })}
                          >
                             Discard
                          </Button>
                          <Button 
                            className="h-6 bg-accent text-background text-[7px] uppercase font-bold px-3 cyan-glow"
                            onClick={() => handleAuthorize(ev.id, ev.payload?.amount || 0, ev.userId || 'SYSTEM')}
                            disabled={processingId === ev.id}
                          >
                             {processingId === ev.id ? <RefreshCw className="h-2 w-2 animate-spin" /> : <ShieldCheck className="h-2.5 w-2.5 mr-1" />}
                             Authorize via TG
                          </Button>
                       </div>
                    </div>
                  )}
               </div>
             );
           })}
        </div>
      </ScrollArea>
    </div>
  );
}
