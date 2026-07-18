"use client";

import { useFirestore, useCollection, useUser } from "@/firebase";
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
  XCircle,
  ExternalLink,
  Gavel
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { manuallyResolvePayment } from "@/services/payment-service";

export function HunterStream() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'events'),
      orderBy('timestamp', 'desc'),
      limit(25)
    );
  }, [firestore]);

  const { data: events, loading } = useCollection<any>(eventsQuery);

  const handleImperialOverride = async (eventId: string, action: 'APPROVE' | 'REJECT') => {
    if (!firestore || !user) return;
    setProcessingId(eventId);

    try {
      // If it's a payment anomaly, we might need a specific resolution
      // For now, let's log the action as a general override
      await addDoc(collection(firestore, 'events'), {
        type: `IMPERIAL_OVERRIDE_${action}`,
        plane: 'SECURITY',
        priority: 1,
        timestamp: Date.now(),
        payload: { eventId, action, adminId: user.uid },
        status: 'COMPLETED'
      });

      toast({
        title: "Manual Override Executed",
        description: `Signal ${eventId} has been ${action.toLowerCase()}ed by Admin.`,
        variant: action === 'REJECT' ? 'destructive' : 'default'
      });

    } catch (err) {
      toast({ variant: "destructive", title: "Handshake Failed" });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20 opacity-30">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
           <Activity className="h-4 w-4 text-accent animate-pulse" />
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Signal Inbound Feed</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-7 text-[8px] font-bold text-accent border border-accent/20 px-2">
           <Link href="/admin/compliance">
              <Gavel className="h-3 w-3 mr-1" /> RESOLUTION CENTER
           </Link>
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
           {(!events || events.length === 0) ? (
             <div className="p-20 text-center text-[10px] uppercase text-muted-foreground italic opacity-20">Awaiting Signals...</div>
           ) : events.map((ev: any) => {
             const isAnomaly = ev.category === 'PREDICTIVE_ANOMALY' || ev.type === 'GOVERNANCE_BLOCK' || ev.type === 'PREDICTIVE_RISK_CHECK';
             const riskScore = ev.payload?.riskScore || 0;
             const isCritical = riskScore > 80 || ev.priority === 1;

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
                        <div className="space-y-0.5 min-w-0 flex-1">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-white uppercase truncate">
                                 {ev.type.replace(/_/g, ' ')}
                              </span>
                              <Badge variant="ghost" className="text-[7px] p-0 font-mono opacity-40 uppercase shrink-0">{ev.id.substring(0, 8)}</Badge>
                           </div>
                           <p className="text-[9px] text-muted-foreground italic leading-tight line-clamp-1">
                              {ev.payload?.reason || ev.payload?.brand || 'Node signal stabilized.'}
                           </p>
                        </div>
                     </div>
                     
                     <div className="text-right space-y-1 shrink-0">
                        {isAnomaly && (
                           <Badge className={cn(
                             "text-[8px] font-bold uppercase h-4 px-1.5",
                             isCritical ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
                           )}>
                              {riskScore}% RISK
                           </Badge>
                        )}
                        <p className="text-[8px] font-mono text-muted-foreground opacity-50">
                           {new Date(ev.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </div>
                  </div>
                  
                  {/* Imperial Quick Actions for Anomalies */}
                  {isAnomaly && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2 animate-fade-in">
                       <div className="flex items-center gap-1.5">
                          <Lock className={cn("h-3 w-3", isCritical ? "text-red-400" : "text-yellow-500")} />
                          <span className={cn("text-[8px] font-bold uppercase", isCritical ? "text-red-400" : "text-yellow-500")}>
                             Imperial_Lock
                          </span>
                       </div>
                       <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            className="h-7 text-[8px] uppercase font-bold text-white/40 hover:text-red-400 hover:bg-red-500/10 px-2"
                            onClick={() => handleImperialOverride(ev.id, 'REJECT')}
                            disabled={processingId === ev.id}
                          >
                             Reject
                          </Button>
                          <Button 
                            className="h-7 bg-accent/20 text-accent border border-accent/30 text-[8px] uppercase font-bold px-3 hover:bg-accent hover:text-background transition-all"
                            onClick={() => handleImperialOverride(ev.id, 'APPROVE')}
                            disabled={processingId === ev.id}
                          >
                             {processingId === ev.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3 mr-1" />}
                             Override
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
