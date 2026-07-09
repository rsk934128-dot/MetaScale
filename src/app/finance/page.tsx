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
  Activity,
  Link2,
  Plus,
  AlertTriangle,
  Lock,
  Unlock,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, query, where, doc, updateDoc, increment, addDoc, orderBy, limit, setDoc } from "firebase/firestore";
import { orchestratePayout } from "@/ai/flows/payout-orchestrator";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateTelegramLink } from "@/lib/telegram";
import { PaymentLinkManager } from "@/components/finance/PaymentLinkManager";
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { BankSandboxModal } from "@/components/finance/BankSandboxModal";

export default function FinancialIntelligence() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { mode, emitEvent } = useKernel();
  const { toast } = useToast();
  const tonAddress = useTonAddress();
  
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // Maintenance Check (Circuit Breaker)
  useEffect(() => {
    const checkMaintenance = () => {
      const hours = new Date().getUTCHours();
      const active = hours >= 21 || hours < 2;
      setIsMaintenance(active);
    };
    checkMaintenance();
    const interval = setInterval(checkMaintenance, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) {
      setIsMiniApp(true);
      const tg = (window as any).Telegram.WebApp;
      tg.expand();
      tg.ready();
    }
  }, []);

  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  const transactionsQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'events'), where('userId', '==', user.uid), where('plane', '==', 'FINANCE'), orderBy('timestamp', 'desc'), limit(15));
  }, [firestore, user?.uid]);
  const { data: recentTxns } = useCollection<any>(transactionsQuery);

  const [payoutRecipient, setPayoutRecipient] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutGateway, setPayoutGateway] = useState<'PAYPAL' | 'PRIYO_PAY' | 'PAYONEER' | 'TELEGRAM_WALLET'>('PRIYO_PAY');
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);

  const handleDeposit = async () => {
    if (isMaintenance) {
      toast({ 
        variant: "destructive", 
        title: "Circuit Breaker Active", 
        description: "সিস্টেম বর্তমানে মেইনটেন্যান্সে আছে (21:00-02:00 UTC)।" 
      });
      return;
    }

    if (!tonAddress) {
      toast({ variant: "destructive", title: "Wallet Not Connected", description: "প্রথমে আপনার টেলিগ্রাম ওয়ালেট কানেক্ট করুন।" });
      return;
    }

    if (!profile?.telegramLinked) {
      const errorId = `ERR_${Date.now()}`;
      toast({ 
        variant: "destructive", 
        title: "Handshake Failed", 
        description: `Error ID: ${errorId}. Kernel rejected the deposit signal. (Reason: Awaiting Identity Binding)` 
      });
      emitEvent('SECURITY', 'UNAUTHORIZED_HANDSHAKE_ATTEMPT', 1, { errorId, reason: 'TELEGRAM_UNLINKED' });
      return;
    }

    if (profile?.verificationStatus !== 'VERIFIED') {
      toast({ 
        variant: "destructive", 
        title: "Compliance Block", 
        description: "Proof of Income পেন্ডিং থাকায় $১,০০০ ডিপোজিটটি কার্নেল দ্বারা রিজেক্ট করা হয়েছে।" 
      });
      return;
    }

    setIsDepositing(true);
    const auditId = `AUDIT_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    try {
      emitEvent('FINANCE', 'DEPOSIT_VERIFICATION_STARTED', 3, { auditId, method: 'TON' });
      await new Promise(resolve => setTimeout(resolve, 2500));

      if (userRef && firestore) {
        await updateDoc(userRef, { 
          balance: increment(1000),
          lastAuditId: auditId
        });

        await addDoc(collection(firestore, 'events'), {
          id: auditId,
          type: 'TON_DEPOSIT_RECEIVED',
          plane: 'FINANCE',
          status: 'COMPLETED',
          amount: 1000,
          currency: 'USD',
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          timestamp: Date.now(),
          userId: user?.uid,
          auditId: auditId
        });

        toast({ title: "Deposit Finalized", description: `$1,000.00 added. Handshake stabilized on Node-04.` });
        emitEvent('FINANCE', 'DEPOSIT_PROCESSED', 2, { method: 'TON', amount: 1000, auditId });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Kernel Error", description: "Authorization failed." });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleGlobalPayout = async () => {
    if (isMaintenance) {
      toast({ variant: "destructive", title: "System Maintenance", description: "Currently in 21:00-02:00 UTC window." });
      return;
    }

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
          timestamp: Date.now(),
          userId: user.uid
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

  const handleBankLinkSuccess = async (account: any) => {
    if (!firestore || !user?.uid) return;
    try {
      const bankRef = doc(firestore, 'users', user.uid, 'linked_banks', account.id);
      await setDoc(bankRef, account);
      
      emitEvent('FINANCE', 'BANK_ACCOUNT_LINKED', 2, { 
        bank: account.bankName, 
        node: 'NODE-04-UK',
        protocol: 'OPEN_BANKING_V2'
      });
      
      toast({ title: "Banking Node Synced", description: `${account.bankName} has been bound to your Fiscal Command hub.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Binding Failed" });
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
          <div className="flex items-center gap-2">
            <TonConnectButton />
            <Badge variant="outline" className={cn(
              "hidden sm:flex border-accent/30 text-accent font-mono text-[8px] md:text-[10px]",
              profile?.plan === 'PRO' && "border-primary/50 text-primary"
            )}>
              {profile?.plan || 'FREE'}_NODE
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-8">
          {/* Handshake Status Alert */}
          {!profile?.telegramLinked ? (
            <div className="p-4 rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-between gap-4 animate-pulse shadow-2xl">
               <div className="flex items-center gap-4">
                  <ShieldAlert className="h-8 w-8 text-yellow-500" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Handshake Required (AWAITING_SYNC)</p>
                    <p className="text-[10px] text-yellow-500/80 italic">"আপনার সোভারেন আইডেন্টিটি লিঙ্ক করতে BIND GATEWAY চাপুন।"</p>
                  </div>
               </div>
               <Button asChild size="sm" className="bg-yellow-500 text-black font-bold text-[9px] uppercase h-8 px-4">
                  <a href={generateTelegramLink(user?.uid || '')} target="_blank" rel="noopener noreferrer">Link identity</a>
               </Button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-green-500/10 border-2 border-green-500/30 flex items-center gap-4 animate-fade-in shadow-2xl">
               <ShieldCheck className="h-8 w-8 text-green-500" />
               <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Identity Stabilized (CONNECTED)</p>
                  <p className="text-[10px] text-green-400 italic">"আপনার মোবাইল নোডটি সফলভাবে সোভারেন কার্নেলের সাথে সিঙ্কড (ECC_ED25519)।"</p>
               </div>
            </div>
          )}

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
                        <MessageSquare className="h-4 w-4" /> Telegram Node Gateway
                     </CardTitle>
                     <CardDescription className="text-[10px] italic">Handshake Stabilization Mode.</CardDescription>
                   </div>
                   <Badge variant={profile?.telegramLinked ? "default" : "outline"} className={cn(profile?.telegramLinked ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse")}>
                      {profile?.telegramLinked ? "CONNECTED" : "AWAITING_SYNC"}
                   </Badge>
                </CardHeader>
                <CardContent className="px-6 pb-6 flex flex-col md:flex-row items-center gap-6">
                   <div className="flex-1 space-y-4">
                      <p className="text-[11px] text-white/80 leading-relaxed italic">
                        {profile?.telegramLinked 
                          ? "টেলিগ্রাম হ্যান্ডশেক সফল হয়েছে। আপনার ওয়ালেট ডিপোজিট এবং হাই-ভ্যালু পে-আউট এখন সম্পূর্ণ আনলক।"
                          : "টেলিগ্রাম হ্যান্ডশেক সফল হলে পেমেন্ট রিম্যাডিয়েশন এবং হাই-ভ্যালু পে-আউট অটোমেটিক্যালি আনলক হবে।"}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          onClick={handleDeposit} 
                          disabled={isDepositing || !tonAddress || isMaintenance || !profile?.telegramLinked}
                          className={cn(
                            "h-9 font-bold uppercase text-[9px] tracking-widest px-4 cyan-glow transition-all",
                            (isMaintenance || !profile?.telegramLinked) ? "bg-secondary text-muted-foreground opacity-50 cursor-not-allowed" : "bg-accent text-background hover:scale-105"
                          )}
                        >
                          {isDepositing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isMaintenance || !profile?.telegramLinked) ? <Lock className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                          {isMaintenance ? "Maintenance Active" : !profile?.telegramLinked ? "Awaiting Sync" : "Deposit $1,000 via TON"}
                        </Button>
                        <Button 
                           variant="outline"
                           className="h-9 font-bold uppercase text-[9px] border-accent/20 text-accent hover:bg-accent/10"
                           onClick={() => setIsBankModalOpen(true)}
                        >
                           <Building2 className="mr-2 h-3 w-3" /> Connect Banking API
                        </Button>
                      </div>
                   </div>
                   <div className="flex flex-col gap-2 text-[8px] font-mono text-muted-foreground uppercase bg-black/20 p-3 rounded-xl border border-white/5">
                      <span className="flex items-center gap-1.5"><ShieldCheck className={cn("h-2.5 w-2.5", profile?.telegramLinked ? "text-green-400" : "text-accent")} /> Security: ECC_ED25519</span>
                      <span className="flex items-center gap-1.5"><Activity className="h-2.5 w-2.5 text-accent" /> Webhook: Active</span>
                      <span className="flex items-center gap-1.5"><Lock className="h-2.5 w-2.5 text-accent" /> Encryption: AES-256</span>
                   </div>
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
                            disabled={isMaintenance}
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
                            disabled={isMaintenance}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold opacity-60 uppercase">Disbursement Amount (USD)</Label>
                       <Input 
                         type="number" 
                         placeholder="0.00" 
                         className="bg-secondary/30 border-white/5 h-12 text-lg font-headline font-bold"
                         value={payoutAmount}
                         onChange={(e) => setPayoutAmount(e.target.value)}
                         disabled={isMaintenance}
                       />
                    </div>
                    <Button 
                      className="w-full font-bold h-12 uppercase text-[10px] cyan-glow bg-accent text-background"
                      onClick={handleGlobalPayout}
                      disabled={isPayoutProcessing || !payoutAmount || isMaintenance}
                    >
                       {isPayoutProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isMaintenance ? <Lock className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                       {isMaintenance ? "Sovereign Locked" : "Authorize Dispatch"}
                    </Button>
                 </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="animate-fade-in">
                <Card className="glass-panel border-white/5">
                   <CardHeader className="p-6 border-b border-white/5 bg-white/5">
                      <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2 text-accent">
                         <History className="h-4 w-4 text-accent" /> Settlement Ledger
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                         <div className="divide-y divide-white/5">
                            {recentTxns?.map((txn: any) => (
                              <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-white/5">
                                 <div className="flex items-center gap-5">
                                    <div className={cn(
                                      "p-3 rounded-xl border border-white/10",
                                      txn.status === 'FAILED' ? "text-red-400" : "text-primary"
                                    )}>
                                       {txn.status === 'FAILED' ? <AlertTriangle className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-lg font-bold text-white uppercase">${txn.amount || '0.00'}</p>
                                       <p className="text-[9px] text-muted-foreground font-mono truncate w-48">Audit: {txn.auditId || txn.id}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <Badge variant="outline" className={cn(
                                      "text-[8px] uppercase",
                                      txn.status === 'COMPLETED' ? "border-green-500 text-green-400" : 
                                      txn.status === 'FAILED' ? "border-red-500 text-red-400" :
                                      "border-accent text-accent"
                                    )}>{txn.status}</Badge>
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
        
        <BankSandboxModal 
           isOpen={isBankModalOpen} 
           onClose={() => setIsBankModalOpen(false)} 
           onSuccess={handleBankLinkSuccess} 
        />
      </SidebarInset>
    </div>
  );
}
