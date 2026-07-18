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
  CheckCircle2,
  CreditCard,
  History,
  Zap,
  ShieldCheck,
  Plus,
  Lock,
  ShieldAlert,
  Key,
  QrCode,
  Terminal,
  MessageSquare
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
import { initiateDepositRequest } from "@/services/payment-service";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateTelegramLink } from "@/lib/telegram";
import { PaymentLinkManager } from "@/components/finance/PaymentLinkManager";
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { BankSandboxModal } from "@/components/finance/BankSandboxModal";
import { DirectQrTransfer } from "@/components/finance/DirectQrTransfer";

export default function FinancialIntelligence() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { emitEvent } = useKernel();
  const { toast } = useToast();
  const tonAddress = useTonAddress();
  
  const [isDepositing, setIsDepositing] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [tgLink, setTgLink] = useState("");
  const [payoutRecipient, setPayoutRecipient] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutGateway, setPayoutGateway] = useState<'PAYPAL' | 'PRIYO_PAY' | 'PAYONEER' | 'TELEGRAM_WALLET'>('PRIYO_PAY');
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      generateTelegramLink(user.uid).then(setTgLink);
    }
  }, [user?.uid]);

  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  const transactionsQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'events'), 
      where('userId', '==', user.uid), 
      where('plane', '==', 'FINANCE'), 
      orderBy('timestamp', 'desc'), 
      limit(15)
    );
  }, [firestore, user?.uid]);
  const { data: recentTxns } = useCollection<any>(transactionsQuery);

  const handleDeposit = async () => {
    if (!tonAddress) {
      toast({ variant: "destructive", title: "Wallet Not Connected" });
      return;
    }

    if (!profile?.telegramLinked) {
      toast({ variant: "destructive", title: "Handshake Required", description: "টেলিগ্রাম লিঙ্ক না থাকলে ডিপোজিট রিজেক্ট করা হবে।" });
      return;
    }

    if (!firestore || !user?.uid) return;

    setIsDepositing(true);
    try {
      // Create a pending deposit request instead of instant credit
      const result = await initiateDepositRequest(firestore, user.uid, 1000, 'TON_DEPOSIT');
      
      if (result.success) {
        emitEvent('FINANCE', 'DEPOSIT_REQUEST_SENT', 3, { 
          amount: 1000, 
          txnId: result.externalTxnId,
          method: 'TON'
        });
        
        toast({ 
          title: "Request Sent to Admin", 
          description: "$1,000 ডিপোজিট রিকোয়েস্ট পাঠানো হয়েছে। এডমিন অ্যাপ্রুভ করলে ব্যালেন্স যোগ হবে।",
        });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Kernel Error", description: "রিকোয়েস্ট প্রসেস করা সম্ভব হয়নি।" });
    } finally {
      setIsDepositing(false);
    }
  };

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
          status: result.status === 'PENDING' ? 'PENDING_APPROVAL' : 'COMPLETED',
          amount: amountNum,
          recipient: payoutRecipient,
          gateway: payoutGateway,
          timestamp: Date.now(),
          userId: user.uid,
          seal: result.batchId
        });

        toast({ 
          title: result.status === 'PENDING' ? "Awaiting Multi-Sig" : "Payout Executed", 
          description: result.status === 'PENDING' ? "টেলিগ্রামে অনুমোদনের জন্য রিকোয়েস্ট পাঠানো হয়েছে।" : "ফান্ড সফলভাবে ডিসপ্যাচ করা হয়েছে।" 
        });
        setPayoutAmount("");
        setPayoutRecipient("");
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Dispatch Failed" });
    } finally {
      setIsPayoutProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-sm md:text-lg font-headline font-bold flex items-center gap-2 text-accent uppercase italic">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              Fiscal Command Hub
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <TonConnectButton />
            <Badge variant="outline" className="hidden sm:flex border-accent/30 text-accent font-mono text-[9px] md:text-[10px]">
              {profile?.plan || 'FREE'}_NODE
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-8">
          {!profile?.telegramLinked && (
            <div className="p-4 rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-between gap-4 animate-pulse shadow-2xl">
               <div className="flex items-center gap-4">
                  <ShieldAlert className="h-8 w-8 text-yellow-500" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Handshake Required</p>
                    <p className="text-[10px] text-yellow-500/80 italic">"সিকিউর ট্রানজ্যাকশনের জন্য টেলিগ্রাম লিঙ্ক করা বাধ্যতামূলক।"</p>
                  </div>
               </div>
               <Button asChild size="sm" className="bg-yellow-500 text-black font-bold text-[9px] uppercase h-8 px-4">
                  <a href={tgLink} target="_blank" rel="noopener noreferrer">Link Identity</a>
               </Button>
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
                   <div className="flex items-baseline gap-1">
                      <span className="text-xl font-headline font-bold text-accent/50">$</span>
                      <p className="text-5xl font-headline font-bold text-white tracking-tighter">{profile?.balance?.toLocaleString() || '0.00'}</p>
                   </div>
                   <div className="flex items-center gap-2 mt-4">
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", profile?.telegramLinked ? 'bg-green-400' : 'bg-yellow-400')} />
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                        {profile?.telegramLinked ? 'Handshake: STABILIZED' : 'Handshake: PENDING'}
                      </p>
                   </div>
                </CardContent>
             </Card>

             <Card className="md:col-span-8 glass-panel border-accent/20 bg-accent/5 overflow-hidden">
                <CardHeader className="pb-2 p-6 flex flex-row items-center justify-between">
                   <div className="space-y-1">
                     <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2 text-accent">
                        <Key className="h-4 w-4" /> Operations Lab
                     </CardTitle>
                     <CardDescription className="text-[10px] italic">Rapid liquidity injection and node discovery.</CardDescription>
                   </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 flex flex-col md:flex-row items-center gap-6">
                   <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          onClick={handleDeposit} 
                          disabled={isDepositing || !tonAddress || !profile?.telegramLinked}
                          className="h-9 font-bold uppercase text-[9px] tracking-widest px-4 cyan-glow bg-accent text-background"
                        >
                          {isDepositing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                          Request $1,000 Deposit
                        </Button>
                        <Button 
                           variant="outline"
                           className="h-9 font-bold uppercase text-[9px] border-accent/20 text-accent"
                           onClick={() => setIsBankModalOpen(true)}
                        >
                           <Building2 className="mr-2 h-3 w-3" /> Link Banking Node
                        </Button>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>

          <Tabs defaultValue="links" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-white/5 h-12 p-1 overflow-x-auto">
               <TabsTrigger value="links" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">Link Architect</TabsTrigger>
               <TabsTrigger value="qr-transfer" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">QR Transfer</TabsTrigger>
               <TabsTrigger value="payout" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">Global Outbound</TabsTrigger>
               <TabsTrigger value="history" className="text-[10px] uppercase font-bold tracking-widest px-6 h-full">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="animate-fade-in">
               <PaymentLinkManager />
            </TabsContent>

            <TabsContent value="qr-transfer" className="animate-fade-in">
               <DirectQrTransfer />
            </TabsContent>

            <TabsContent value="payout" className="animate-fade-in">
              <Card className="glass-panel border-l-4 border-l-[#6366f1] bg-[#6366f1]/5 max-w-2xl">
                 <CardHeader className="p-6">
                    <CardTitle className="text-sm flex items-center gap-2 uppercase text-[#818cf8]">
                       <Building2 className="h-4 w-4" /> Global Dispatcher
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
                             <option value="PAYPAL">PayPal REST</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold opacity-60 uppercase">Recipient</Label>
                          <Input 
                            placeholder="Email or TON Address" 
                            className="bg-secondary/30 border-white/5 h-11 text-sm"
                            value={payoutRecipient}
                            onChange={(e) => setPayoutRecipient(e.target.value)}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold opacity-60 uppercase">Amount (USD)</Label>
                       <Input 
                         type="number" 
                         placeholder="0.00" 
                         className="bg-secondary/30 border-white/5 h-12 text-lg font-headline font-bold"
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
                       Authorize Global Dispatch
                    </Button>
                    <p className="text-[9px] text-muted-foreground italic text-center">
                       $১,০০০-এর বেশি লেনদেনের জন্য টেলিগ্রাম অনুমোদনের প্রয়োজন হবে।
                    </p>
                 </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="animate-fade-in">
                <Card className="glass-panel border-white/5">
                   <CardHeader className="p-6 border-b border-white/5">
                      <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2 text-accent">
                         <History className="h-4 w-4 text-accent" /> Transaction Audit
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                         <div className="divide-y divide-white/5">
                            {recentTxns?.map((txn: any) => (
                              <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className={cn("p-2 rounded-lg bg-black/40 border", txn.status === 'COMPLETED' ? "text-green-400 border-green-500/20" : "text-yellow-400 border-yellow-500/20")}>
                                       {txn.status === 'COMPLETED' ? <CheckCircle2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-white uppercase">${txn.amount}</p>
                                       <p className="text-[9px] text-muted-foreground uppercase">{txn.type.replace(/_/g, ' ')}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <Badge variant="outline" className="text-[8px] uppercase">{txn.status}</Badge>
                                    <p className="text-[9px] text-muted-foreground mt-1">{new Date(txn.timestamp).toLocaleTimeString()}</p>
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
           onSuccess={(acc) => {
             toast({ title: "Bank Node Synced", description: `${acc.bankName} has been linked.` });
           }} 
        />
      </SidebarInset>
    </div>
  );
}
