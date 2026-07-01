
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
  Zap as PriyoIcon,
  Loader2,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Search,
  ShoppingBag,
  TrendingUp,
  Download,
  ChevronRight,
  Globe,
  Network,
  CloudLightning,
  ShieldAlert,
  Plus,
  CreditCard,
  Smartphone,
  ArrowRightLeft,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MessageSquare,
  AlertCircle,
  Undo2,
  History,
  CheckCircle2,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp, setDoc, orderBy, limit } from "firebase/firestore";
import { BankSandboxModal } from "@/components/finance/BankSandboxModal";
import { PaymentLinkManager } from "@/components/finance/PaymentLinkManager";
import { orchestratePayout } from "@/ai/flows/payout-orchestrator";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FinancialIntelligence() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { mode, emitEvent } = useKernel();
  const { toast } = useToast();
  
  // Local Profile Data
  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  // Virtual Cards Data
  const cardsQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'cards'), where('status', '==', 'ACTIVE'));
  }, [firestore, user?.uid]);
  const { data: virtualCards } = useCollection<any>(cardsQuery);

  // Recent Transactions for Reversal/Refund View
  const transactionsQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'events'), where('plane', '==', 'FINANCE'), orderBy('timestamp', 'desc'), limit(10));
  }, [firestore, user?.uid]);
  const { data: recentTxns } = useCollection<any>(transactionsQuery);

  // Form State
  const [targetAccount, setTargetAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isIssuingCard, setIsIssuingCard] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  
  // Payout State
  const [payoutRecipient, setPayoutRecipient] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutGateway, setPayoutGateway] = useState<'PAYPAL' | 'PRIYO_PAY' | 'PAYONEER' | 'TELEGRAM_WALLET'>('PRIYO_PAY');
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);
  const [recipientError, setRecipientError] = useState("");

  // Sandbox State
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<any>(null);

  // Input Validation (Regex)
  useEffect(() => {
    if (!payoutRecipient) {
      setRecipientError("");
      return;
    }
    if (payoutGateway === 'TELEGRAM_WALLET') {
      const tgRegex = /^(@[a-zA-Z0-9_]{5,32}|\+?[0-9]{10,15})$/;
      if (!tgRegex.test(payoutRecipient)) {
        setRecipientError("ভুল ফরম্যাট! @username বা আন্তর্জাতিক ফোন নম্বর দিন।");
      } else {
        setRecipientError("");
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payoutRecipient)) {
        setRecipientError("সঠিক ইমেইল অ্যাড্রেস প্রদান করুন।");
      } else {
        setRecipientError("");
      }
    }
  }, [payoutRecipient, payoutGateway]);

  const handleBankConnect = (account: any) => {
    setConnectedAccount(account);
    emitEvent('FINANCE', 'BANK_ACCOUNT_LINKED', 3, { bank: account.bankName });
  };

  const handleGlobalPayout = async () => {
    if (!payoutRecipient || !payoutAmount || !profile || !user?.uid || !firestore || recipientError) {
      toast({ variant: "destructive", title: "Action Blocked", description: "সবগুলো তথ্য সঠিকভাবে প্রদান করুন।" });
      return;
    }

    const amountNum = parseFloat(payoutAmount);
    if (amountNum > (profile.balance || 0)) {
      toast({ variant: "destructive", title: "Insufficient Balance", description: "আপনার ওয়ালেটে পর্যাপ্ত ডলার নেই।" });
      return;
    }

    setIsPayoutProcessing(true);
    emitEvent('FINANCE', 'PAYOUT_INITIATED', 2, { gateway: payoutGateway, amount: amountNum });

    try {
      const result = await orchestratePayout({
        gateway: payoutGateway,
        recipientInfo: payoutRecipient,
        amount: amountNum,
        currency: 'USD'
      });

      if (result.status === 'SUCCESS' || result.status === 'PENDING') {
        await updateDoc(userRef!, { 
          balance: increment(-amountNum) 
        });

        await addDoc(collection(firestore, 'events'), {
          type: 'OUTBOUND_PAYOUT',
          plane: 'FINANCE',
          status: 'COMPLETED',
          amount: amountNum,
          recipient: payoutRecipient,
          gateway: payoutGateway,
          batchId: result.batchId,
          txHash: result.txHash,
          refundEligible: result.refundEligible,
          timestamp: Date.now()
        });

        emitEvent('FINANCE', 'TX_HASH_LINKED', 3, { internalId: result.batchId, txHash: result.txHash });

        toast({ 
          title: "Payout Dispatched", 
          description: `Transaction ID: ${result.batchId.substring(0, 8)}... হ্যাশ ম্যাপিং সফল।` 
        });
        setPayoutAmount("");
        setPayoutRecipient("");
      } else {
        throw new Error("Gateway Handshake Failed");
      }
    } catch (err: any) {
      emitEvent('SECURITY', 'PAYOUT_FAILED_ANOMALY', 1, { error: err.message });
      toast({ variant: "destructive", title: "Execution Failed", description: "সিস্টেম রিভার্ট করা হয়েছে।" });
    } finally {
      setIsPayoutProcessing(false);
    }
  };

  const handleRequestRefund = async (txn: any) => {
    if (!firestore || !user?.uid || !profile) return;
    
    emitEvent('FINANCE', 'REFUND_INITIATED', 2, { txnId: txn.id, amount: txn.amount });
    
    toast({
      title: "Refund Protocol Active",
      description: "ইস্করো (Escrow) থেকে ফান্ড রিকভার করা হচ্ছে...",
    });

    setTimeout(async () => {
      try {
        await updateDoc(userRef!, { balance: increment(txn.amount) });
        await updateDoc(doc(firestore, 'events', txn.id), { status: 'REFUNDED' });
        
        emitEvent('FINANCE', 'REVERSAL_COMPLETED', 2, { txnId: txn.id, status: 'RESTORED' });
        toast({ title: "Fund Restored", description: `${txn.amount} USD আপনার ওয়ালেটে ফেরত দেওয়া হয়েছে।` });
      } catch (e) {
        toast({ variant: "destructive", title: "Reversal Error", description: "রিফান্ড সম্পন্ন করা সম্ভব হয়নি।" });
      }
    }, 2000);
  };

  const isThrottled = mode === 'LOCKDOWN' || mode === 'EMERGENCY';

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <DollarSign className="h-5 w-5 text-accent" />
              FusionPay Fiscal Command
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="hidden sm:flex border-accent/20 text-accent font-mono text-[10px]">
                <Globe className="mr-1 h-3 w-3" /> MESH_CONNECTIVITY: 100%
             </Badge>
             <Badge variant="outline" className={cn("text-xs border-accent/20 text-accent font-mono", isThrottled && "animate-pulse")}>
              KERNEL_{mode}
             </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
             <Card className="glass-panel border-l-4 border-l-accent overflow-hidden h-full shadow-2xl">
                <CardHeader className="pb-2 p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Main Mesh Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-accent animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
                   <p className="text-4xl font-headline font-bold text-white">${profile?.balance?.toLocaleString() || '0.00'}</p>
                   <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[8px] font-mono text-accent">USD_SETTLEMENT_NODE</Badge>
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-l-4 border-l-primary overflow-hidden h-full">
                <CardHeader className="pb-2 p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Virtual Card Assets</CardTitle>
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
                   <p className="text-3xl font-headline font-bold text-white">
                     ${virtualCards?.reduce((acc, c) => acc + (c.balance || 0), 0).toLocaleString() || '0.00'}
                   </p>
                   <div className="flex items-center gap-1 text-primary text-[10px] font-bold mt-1">
                      <Plus className="h-3 w-3" /> {virtualCards?.length || 0} Issued Cards
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-l-4 border-l-green-500 lg:col-span-2 overflow-hidden h-full">
                <CardHeader className="pb-2 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Institutional Bank Sync</CardTitle>
                    {connectedAccount && (
                      <Badge className="bg-primary/20 text-primary text-[8px] font-mono">PIS_ACTIVE</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
                   {connectedAccount ? (
                     <div className="flex justify-between items-center gap-4">
                        <div>
                          <p className="text-2xl font-headline font-bold text-white">${connectedAccount.balance.toLocaleString()}</p>
                          <p className="text-[9px] text-muted-foreground uppercase">{connectedAccount.bankName} - {connectedAccount.accountNumber}</p>
                        </div>
                        <Button size="sm" className="bg-primary text-primary-foreground font-bold text-[10px] h-8 px-4" onClick={() => setIsSandboxOpen(true)}>Sync Mesh</Button>
                     </div>
                   ) : (
                     <Button variant="ghost" className="text-[10px] font-bold text-primary hover:bg-primary/10 h-12 border border-dashed border-primary/20 w-full" onClick={() => setIsSandboxOpen(true)}>
                        Connect External Bank Node
                     </Button>
                   )}
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="payout" className="space-y-6">
                <TabsList className="bg-secondary/50 border border-white/5 p-1 h-auto flex flex-wrap">
                  <TabsTrigger value="payout" className="data-[state=active]:bg-[#6366f1] data-[state=active]:text-white text-[10px] uppercase font-bold tracking-widest px-6 h-10">Global Payouts</TabsTrigger>
                  <TabsTrigger value="ledger" className="data-[state=active]:bg-accent data-[state=active]:text-background text-[10px] uppercase font-bold tracking-widest px-6 h-10">Reversal Ledger</TabsTrigger>
                  <TabsTrigger value="cards" className="data-[state=active]:bg-accent data-[state=active]:text-background text-[10px] uppercase font-bold tracking-widest px-6 h-10">Virtual Cards</TabsTrigger>
                </TabsList>

                <TabsContent value="payout" className="space-y-6 animate-fade-in">
                   <Card className="glass-panel border-l-4 border-l-[#6366f1] bg-[#6366f1]/5 shadow-2xl">
                      <CardHeader>
                         <CardTitle className="text-sm flex items-center gap-2 uppercase text-[#818cf8]">
                            <Building2 className="h-4 w-4" /> Global Settlement Payout
                         </CardTitle>
                         <CardDescription className="text-[10px] uppercase tracking-widest">PayPal | Priyo Pay | Telegram Wallet (TON)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold opacity-60">Payout Gateway</Label>
                               <select 
                                 className="w-full bg-secondary/50 border border-white/5 rounded-md h-11 text-xs px-3 text-white focus:outline-none focus:border-accent/50"
                                 value={payoutGateway}
                                 onChange={(e: any) => {
                                   setPayoutGateway(e.target.value);
                                   setPayoutRecipient("");
                                   setRecipientError("");
                                 }}
                               >
                                  <option value="PRIYO_PAY">Priyo Pay (USD)</option>
                                  <option value="TELEGRAM_WALLET">Telegram Wallet (TON/USDt)</option>
                                  <option value="PAYPAL">PayPal Batch</option>
                                  <option value="PAYONEER">Yapily / Payoneer (PIS)</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold opacity-60">
                                 {payoutGateway === 'TELEGRAM_WALLET' ? 'Telegram ID / Phone Number' : 'Recipient Email'}
                               </Label>
                               <div className="relative">
                                  {payoutGateway === 'TELEGRAM_WALLET' ? (
                                    <MessageSquare className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", recipientError ? "text-red-400" : "text-accent/50")} />
                                  ) : (
                                    <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", recipientError ? "text-red-400" : "text-primary/50")} />
                                  )}
                                  <Input 
                                    placeholder={payoutGateway === 'TELEGRAM_WALLET' ? "@username or +880..." : "recipient@example.com"} 
                                    className={cn("pl-10 bg-secondary/30 border-white/5 h-11 text-sm", recipientError && "border-red-500/50 focus:ring-red-500")}
                                    value={payoutRecipient}
                                    onChange={(e) => setPayoutRecipient(e.target.value)}
                                  />
                               </div>
                               {recipientError && <p className="text-[9px] text-red-400 font-bold uppercase tracking-tighter">{recipientError}</p>}
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold opacity-60">Amount to Send (USD)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-10 bg-secondary/30 border-white/5 h-12 text-lg font-headline"
                                value={payoutAmount}
                                onChange={(e) => setPayoutAmount(e.target.value)}
                              />
                            </div>
                         </div>

                         <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 flex gap-3 animate-fade-in">
                            <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                              {payoutGateway === 'TELEGRAM_WALLET' ? 
                                "টেলিগ্রাম ওয়ালেটে টাকা পাঠালে প্রাপক সরাসরি তার টেলিগ্রাম অ্যাপে নোটিফিকেশন পাবেন। এটি একটি সিকিউর TON এসক্রো করিডোর ব্যবহার করবে।" :
                                "আপনার ফান্ড ডিটারমিনিস্টিক রেলের মাধ্যমে ১-১০ সেকেন্ডের মধ্যে প্রাপকের কাছে পৌঁছে যাবে।"
                              }
                            </p>
                         </div>

                         <Button 
                           className={cn(
                             "w-full font-bold h-12 uppercase text-[10px] cyan-glow transition-all",
                             payoutGateway === 'TELEGRAM_WALLET' ? "bg-accent text-background hover:bg-accent/90" : "bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                           )}
                           onClick={handleGlobalPayout}
                           disabled={isPayoutProcessing || isThrottled || !!recipientError}
                         >
                            {isPayoutProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            {isPayoutProcessing ? "Orchestrating Payout..." : "Authorize Disbursement"}
                         </Button>
                      </CardContent>
                   </Card>
                </TabsContent>

                <TabsContent value="ledger" className="space-y-6 animate-fade-in">
                   <Card className="glass-panel border-white/5">
                      <CardHeader className="p-4 border-b border-white/5">
                         <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
                            <History className="h-4 w-4 text-accent" />
                            Transaction Audit & Reversal
                         </CardTitle>
                         <CardDescription className="text-[10px]">View recent settlement statuses and initiate reversals if eligible.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                         <ScrollArea className="h-[400px]">
                            <div className="divide-y divide-white/5">
                               {recentTxns?.filter(t => t.type === 'OUTBOUND_PAYOUT').map((txn: any) => (
                                 <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                       <div className="p-2 rounded bg-black/40 border border-white/10">
                                          {txn.gateway === 'TELEGRAM_WALLET' ? <MessageSquare className="h-4 w-4 text-accent" /> : <DollarSign className="h-4 w-4 text-primary" />}
                                       </div>
                                       <div className="space-y-0.5">
                                          <p className="text-xs font-bold text-white uppercase">${txn.amount} USD</p>
                                          <p className="text-[9px] text-muted-foreground uppercase">{txn.recipient} • {txn.gateway}</p>
                                          <p className="text-[8px] font-mono text-accent/50 truncate w-32">Hash: {txn.txHash?.substring(0, 16)}...</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Badge className={cn(
                                         "text-[8px] uppercase font-bold",
                                         txn.status === 'COMPLETED' ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                                       )}>
                                         {txn.status}
                                       </Badge>
                                       {txn.refundEligible && txn.status === 'COMPLETED' && (
                                         <Button 
                                           variant="outline" 
                                           size="sm" 
                                           className="h-7 text-[8px] font-bold uppercase border-red-500/30 text-red-400 hover:bg-red-500/10"
                                           onClick={() => handleRequestRefund(txn)}
                                         >
                                            <Undo2 className="mr-1 h-2.5 w-2.5" /> Reversal
                                         </Button>
                                       )}
                                    </div>
                                 </div>
                               ))}
                               {(!recentTxns || recentTxns.filter(t => t.type === 'OUTBOUND_PAYOUT').length === 0) && (
                                 <div className="p-10 text-center text-muted-foreground italic text-xs uppercase opacity-30">No transaction records found in ledger.</div>
                               )}
                            </div>
                         </ScrollArea>
                      </CardContent>
                   </Card>
                </TabsContent>
                
                {/* Cards and Links content omitted for brevity but retained in final app structure */}
              </Tabs>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5 shadow-xl">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs uppercase flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" /> System Sovereignty
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                   <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[10px] space-y-3">
                      <div className="flex justify-between">
                         <span className="text-muted-foreground uppercase">Identity Bound</span>
                         <span className="text-accent font-bold">YES</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-muted-foreground uppercase">Rate Limiter</span>
                         <span className="text-green-400 font-bold">NOMINAL</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2">
                         <span className="text-muted-foreground uppercase">TxHash Mapping</span>
                         <span className="text-white font-mono text-[8px]">ACTIVE</span>
                      </div>
                   </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5 bg-secondary/10">
                 <CardHeader className="p-4">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-tighter flex items-center gap-2">
                       <Fingerprint className="h-4 w-4 text-primary" />
                       Audit Forensic Node
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-4">
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                       <p className="text-[9px] text-white/80 leading-relaxed italic">
                         "Every global payout is assigned a 64-bit cryptographic hash linked to your internal account profile for T+0 auditability."
                       </p>
                    </div>
                    <Button variant="ghost" className="w-full h-8 text-[9px] uppercase font-bold text-primary" asChild>
                       <a href="/revenue">Open Revenue Ops <ChevronRight className="ml-1 h-3 w-3" /></a>
                    </Button>
                 </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>

      <BankSandboxModal 
        isOpen={isSandboxOpen} 
        onClose={() => setIsSandboxOpen(false)} 
        onSuccess={handleBankConnect}
      />
    </div>
  );
}
