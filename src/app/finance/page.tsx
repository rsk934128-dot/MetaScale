
"use client";

import { useState, useMemo, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  Send, 
  Wallet, 
  RefreshCw, 
  Loader2,
  Building2,
  Smartphone,
  ArrowRightLeft,
  Globe,
  CheckCircle2,
  Users,
  CreditCard,
  History,
  TrendingUp,
  Clock,
  Zap,
  ChevronRight,
  ShieldCheck,
  CloudLightning,
  MessageSquare,
  Unplug,
  ExternalLink,
  Gem,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, query, where, doc, updateDoc, increment, addDoc, orderBy, limit } from "firebase/firestore";
import { orchestratePayout } from "@/ai/flows/payout-orchestrator";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateTelegramLink } from "@/lib/telegram";
import { PaymentLinkManager } from "@/components/finance/PaymentLinkManager";

export default function FinancialIntelligence() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { mode, emitEvent } = useKernel();
  const { toast } = useToast();
  
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) {
      setIsMiniApp(true);
      (window as any).Telegram.WebApp.expand();
    }
  }, []);

  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  const transactionsQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'events'), where('plane', '==', 'FINANCE'), orderBy('timestamp', 'desc'), limit(15));
  }, [firestore, user?.uid]);
  const { data: recentTxns } = useCollection<any>(transactionsQuery);

  const [payoutRecipient, setPayoutRecipient] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutGateway, setPayoutGateway] = useState<'PAYPAL' | 'PRIYO_PAY' | 'PAYONEER' | 'TELEGRAM_WALLET'>('PRIYO_PAY');
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);

  const handleGlobalPayout = async () => {
    if (!payoutRecipient || !payoutAmount || !profile || !user?.uid || !firestore) return;
    const amountNum = parseFloat(payoutAmount);
    if (amountNum > (profile.balance || 0)) {
      toast({ variant: "destructive", title: "Insufficient Balance" });
      return;
    }

    setIsPayoutProcessing(true);
    try {
      const result = await orchestratePayout({
        gateway: payoutGateway,
        recipientInfo: payoutRecipient,
        amount: amountNum,
        currency: 'USD'
      });

      if (result.status === 'SUCCESS' || result.status === 'PENDING') {
        await updateDoc(userRef!, { balance: increment(-amountNum) });
        await addDoc(collection(firestore, 'events'), {
          type: 'OUTBOUND_PAYOUT',
          plane: 'FINANCE',
          status: 'COMPLETED',
          amount: amountNum,
          recipient: payoutRecipient,
          gateway: payoutGateway,
          txHash: result.txHash,
          timestamp: Date.now()
        });
        toast({ title: "Payout Dispatched", description: `TxHash: ${result.txHash.substring(0, 16)}...` });
        setPayoutAmount("");
        setPayoutRecipient("");
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Execution Failed" });
    } finally {
      setIsPayoutProcessing(false);
    }
  };

  return (
    <div className={cn("flex min-h-screen", isMiniApp && "bg-black")}>
      {!isMiniApp && <AppSidebar />}
      <SidebarInset className={cn(isMiniApp && "p-0")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          {!isMiniApp && <SidebarTrigger />}
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-accent uppercase italic">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              Fiscal Command Hub
            </h1>
          </div>
          <Badge variant="outline" className={cn(
            "border-accent/30 text-accent font-mono text-[8px] md:text-[10px]",
            profile?.plan === 'PRO' && "border-primary/50 text-primary"
          )}>
            {profile?.plan || 'FREE'}_NODE
          </Badge>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
             <Card className="md:col-span-4 glass-panel border-l-4 border-l-accent overflow-hidden shadow-2xl">
                <CardHeader className="pb-2 p-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Available Finality</CardTitle>
                    <Wallet className="h-4 w-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                   <p className="text-4xl font-headline font-bold text-white">${profile?.balance?.toLocaleString() || '0.00'}</p>
                   <div className="flex items-center gap-2 mt-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", profile?.plan === 'PRO' ? 'bg-primary shadow-[0_0_10px_primary]' : 'bg-accent')} />
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                        {profile?.plan === 'PRO' ? 'Priority Node Node-04 Active' : 'Standard Settlement Rail'}
                      </p>
                   </div>
                </CardContent>
             </Card>

             <Card className="md:col-span-8 glass-panel border-accent/20 bg-accent/5 overflow-hidden">
                <CardHeader className="pb-2 p-6 flex flex-row items-center justify-between">
                   <div className="space-y-1">
                     <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2 text-accent">
                        <MessageSquare className="h-4 w-4" /> Imperial Telegram Node
                     </CardTitle>
                     <CardDescription className="text-[10px] italic">Get live settlement signals and billing alerts.</CardDescription>
                   </div>
                   <Badge variant={profile?.telegramLinked ? "default" : "outline"} className={cn(profile?.telegramLinked ? "bg-green-500/20 text-green-400" : "animate-pulse")}>
                      {profile?.telegramLinked ? "STABILIZED" : "AWAITING_LINK"}
                   </Badge>
                </CardHeader>
                <CardContent className="px-6 pb-6 flex flex-col md:flex-row items-center gap-6">
                   <div className="flex-1 space-y-3">
                      <p className="text-[11px] text-white/80 leading-relaxed">
                        আপনার পেমেন্ট লিঙ্ক, বিলিং ওভারএজ এবং লিকুইডিটি এলার্ট সরাসরি টেলিগ্রামে পেতে আপনার সোভারেন আইডি লিঙ্ক করুন।
                      </p>
                      <div className="flex gap-4 text-[9px] font-mono text-muted-foreground uppercase">
                         <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-accent" /> AES-256-GCM</span>
                         <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-accent" /> Pulse: 8.4ms</span>
                      </div>
                   </div>
                   {!profile?.telegramLinked && (
                     <Button asChild className="bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow h-11 px-8">
                        <a href={generateTelegramLink(user?.uid || '')} target="_blank" rel="noopener noreferrer">
                           <Zap className="mr-2 h-4 w-4" /> Bind Identity
                        </a>
                     </Button>
                   )}
                </CardContent>
             </Card>
          </div>

          <Tabs defaultValue="links" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1">
               <TabsTrigger value="links" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">Directives</TabsTrigger>
               <TabsTrigger value="payout" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">Outbound</TabsTrigger>
               <TabsTrigger value="history" className="text-[10px] uppercase font-bold tracking-widest px-8 h-full">Ledger</TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="animate-fade-in">
               <PaymentLinkManager />
            </TabsContent>

            <TabsContent value="payout" className="animate-fade-in">
              <Card className="glass-panel border-l-4 border-l-[#6366f1] bg-[#6366f1]/5 max-w-2xl">
                 <CardHeader className="p-6">
                    <CardTitle className="text-sm flex items-center gap-2 uppercase text-[#818cf8]">
                       <Building2 className="h-4 w-4" /> Global Disbursement
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6 p-6 pt-0">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold opacity-60 uppercase">Target Rail</Label>
                          <select 
                            className="w-full bg-secondary/50 border border-white/5 rounded-md h-11 text-xs px-3 text-white focus:outline-none"
                            value={payoutGateway}
                            onChange={(e: any) => setPayoutGateway(e.target.value)}
                          >
                             <option value="PRIYO_PAY">Priyo Pay (Global)</option>
                             <option value="TELEGRAM_WALLET">TON Wallet (P2P)</option>
                             <option value="PAYPAL">PayPal Hub</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold opacity-60 uppercase">Recipient</Label>
                          <Input 
                            placeholder="email@mesh.gov or @username" 
                            className="bg-secondary/30 border-white/5 h-11 text-sm"
                            value={payoutRecipient}
                            onChange={(e) => setPayoutRecipient(e.target.value)}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold opacity-60 uppercase">Disbursement Amount (USD)</Label>
                       <Input 
                         type="number" 
                         placeholder="0.00" 
                         className="bg-secondary/30 border-white/5 h-12 text-lg font-headline"
                         value={payoutAmount}
                         onChange={(e) => setPayoutAmount(e.target.value)}
                       />
                    </div>
                    <Button 
                      className="w-full font-bold h-12 uppercase text-[10px] cyan-glow bg-accent text-background"
                      onClick={handleGlobalPayout}
                      disabled={isPayoutProcessing || !payoutAmount}
                    >
                       {isPayoutProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                       Authorize Dispatch
                    </Button>
                 </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="animate-fade-in">
                <Card className="glass-panel border-white/5">
                   <CardHeader className="p-6 border-b border-white/5 bg-white/5">
                      <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                         <History className="h-4 w-4 text-accent" /> Settlement Ledger
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                         <div className="divide-y divide-white/5">
                            {recentTxns?.map((txn: any) => (
                              <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-white/5">
                                 <div className="flex items-center gap-5">
                                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-primary">
                                       <DollarSign className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-lg font-bold text-white uppercase">${txn.amount}</p>
                                       <p className="text-[9px] text-muted-foreground font-mono truncate w-48">ID: {txn.txHash || 'INTERNAL'}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <Badge variant="outline" className="text-[8px] uppercase border-green-500/20 text-green-400">{txn.status}</Badge>
                                    <p className="text-[10px] text-muted-foreground font-mono mt-1">{new Date(txn.timestamp).toLocaleTimeString()}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </ScrollArea>
                   </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}
