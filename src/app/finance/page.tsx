
"use client";

import { useState, useMemo } from "react";
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
  EyeOff
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
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { BankSandboxModal } from "@/components/finance/BankSandboxModal";
import { PaymentLinkManager } from "@/components/finance/PaymentLinkManager";
import { orchestratePayout } from "@/ai/flows/payout-orchestrator";
import { cn } from "@/lib/utils";

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

  // Stats
  const [targetAccount, setTargetAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isIssuingCard, setIsIssuingCard] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  
  // Payout State
  const [payoutEmail, setPayoutEmail] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutGateway, setPayoutGateway] = useState<'PAYPAL' | 'PRIYO_PAY' | 'PAYONEER'>('PRIYO_PAY');
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);

  // Sandbox State
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<any>(null);

  const handleBankConnect = (account: any) => {
    setConnectedAccount(account);
    emitEvent('FINANCE', 'BANK_ACCOUNT_LINKED', 3, { bank: account.bankName });
  };

  const handleGlobalPayout = async () => {
    if (!payoutEmail || !payoutAmount || !profile || !user?.uid || !firestore) {
      toast({ variant: "destructive", title: "Incomplete Data", description: "সবগুলো তথ্য প্রদান করুন।" });
      return;
    }

    const amountNum = parseFloat(payoutAmount);
    if (amountNum > profile.balance) {
      toast({ variant: "destructive", title: "Insufficient Balance", description: "আপনার ওয়ালেটে পর্যাপ্ত ডলার নেই।" });
      return;
    }

    setIsPayoutProcessing(true);
    emitEvent('FINANCE', 'PAYOUT_INITIATED', 2, { gateway: payoutGateway, amount: amountNum });

    try {
      // 1. Call Genkit Payout Orchestrator (Simulated Flow)
      const result = await orchestratePayout({
        gateway: payoutGateway,
        recipientEmail: payoutEmail,
        amount: amountNum,
        currency: 'USD'
      });

      if (result.status === 'SUCCESS') {
        // 2. Atomic Database Update
        await updateDoc(userRef!, { 
          balance: increment(-amountNum) 
        });

        // 3. Log to Global Ledger
        await addDoc(collection(firestore, 'events'), {
          type: 'OUTBOUND_PAYOUT',
          plane: 'FINANCE',
          status: 'COMPLETED',
          amount: amountNum,
          recipient: payoutEmail,
          gateway: payoutGateway,
          batchId: result.batchId,
          timestamp: Date.now()
        });

        toast({ title: "Payout Successful", description: `${amountNum} USD পাঠানো হয়েছে ${payoutGateway} এর মাধ্যমে।` });
        setPayoutAmount("");
        setPayoutEmail("");
      } else {
        throw new Error("Gateway Handshake Failed");
      }
    } catch (err: any) {
      emitEvent('SECURITY', 'PAYOUT_FAILED_ANOMALY', 1, { error: err.message });
      toast({ variant: "destructive", title: "Execution Failed", description: "সিস্টেম রিভার্ট করা হয়েছে। আবার চেষ্টা করুন।" });
    } finally {
      setIsPayoutProcessing(false);
    }
  };

  const handleIssueCard = async (brand: 'MASTERCARD' | 'VISA') => {
    if (!user?.uid || !firestore || !profile) return;
    setIsIssuingCard(true);
    const cardId = `VCARD_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const cardData = {
      id: cardId,
      userId: user.uid,
      cardNumber: `${brand === 'MASTERCARD' ? '5412' : '4213'} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: "12/28",
      brand: brand,
      balance: 0,
      status: 'ACTIVE',
      createdAt: Date.now()
    };
    try {
      await setDoc(doc(firestore, 'users', user.uid, 'cards', cardId), cardData);
      emitEvent('FINANCE', 'VIRTUAL_CARD_ISSUED', 2, { cardId, brand });
      toast({ title: `${brand} Issued`, description: "আপনার ভার্চুয়াল কার্ডটি এখন একটিভ।" });
    } catch (err) {
      toast({ variant: "destructive", title: "Issuance Failed", description: "Kernel rejected card request." });
    } finally {
      setIsIssuingCard(false);
    }
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
                     ${virtualCards?.reduce((acc, c) => acc + c.balance, 0).toLocaleString() || '0.00'}
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
                  <TabsTrigger value="payout" className="data-[state=active]:bg-[#6366f1] data-[state=active]:text-white text-[10px] uppercase font-bold tracking-widest px-6 h-10">Priyo / Global Payout</TabsTrigger>
                  <TabsTrigger value="cards" className="data-[state=active]:bg-accent data-[state=active]:text-background text-[10px] uppercase font-bold tracking-widest px-6 h-10">My Virtual Cards</TabsTrigger>
                  <TabsTrigger value="links" className="data-[state=active]:bg-primary data-[state=active]:text-white text-[10px] uppercase font-bold tracking-widest px-6 h-10">Receive Routes</TabsTrigger>
                </TabsList>

                <TabsContent value="payout" className="space-y-6 animate-fade-in">
                   <Card className="glass-panel border-l-4 border-l-[#6366f1] bg-[#6366f1]/5 shadow-2xl">
                      <CardHeader>
                         <CardTitle className="text-sm flex items-center gap-2 uppercase text-[#818cf8]">
                            <PriyoIcon className="h-4 w-4" /> Global Settlement Payout
                         </CardTitle>
                         <CardDescription className="text-[10px] uppercase tracking-widest">PayPal | Priyo Pay | Global ACH</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold opacity-60">Payout Gateway</Label>
                               <select 
                                 className="w-full bg-secondary/50 border border-white/5 rounded-md h-11 text-xs px-3 text-white"
                                 value={payoutGateway}
                                 onChange={(e: any) => setPayoutGateway(e.target.value)}
                               >
                                  <option value="PRIYO_PAY">Priyo Pay (USD)</option>
                                  <option value="PAYPAL">PayPal Batch</option>
                                  <option value="PAYONEER">Payoneer (PIS)</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold opacity-60">Recipient Email</Label>
                               <Input 
                                 placeholder="recipient@example.com" 
                                 className="bg-secondary/30 border-white/5 h-11 text-sm"
                                 value={payoutEmail}
                                 onChange={(e) => setPayoutEmail(e.target.value)}
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold opacity-60">Amount to Send (USD)</Label>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="bg-secondary/30 border-white/5 h-12 text-lg font-headline"
                              value={payoutAmount}
                              onChange={(e) => setPayoutAmount(e.target.value)}
                            />
                         </div>
                         <Button 
                           className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold h-12 uppercase text-[10px] cyan-glow"
                           onClick={handleGlobalPayout}
                           disabled={isPayoutProcessing || isThrottled}
                         >
                            {isPayoutProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            {isPayoutProcessing ? "Orchestrating Payout..." : "Authorize Disbursement"}
                         </Button>
                      </CardContent>
                   </Card>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="glass-panel border-white/5">
                         <CardHeader className="p-4">
                            <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Compliance Radar</CardTitle>
                         </CardHeader>
                         <CardContent className="p-4 pt-0 space-y-3">
                            <div className="p-2 rounded bg-secondary/30 text-[9px] text-white/60 italic leading-relaxed">
                              {"Priyo Pay payouts are subject to Imperial Directive validation for amounts {'>'} $1,000."}
                            </div>
                            <Progress value={92} className="h-1" />
                         </CardContent>
                      </Card>
                      <Card className="glass-panel border-white/5">
                         <CardHeader className="p-4">
                            <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Gateway Latency</CardTitle>
                         </CardHeader>
                         <CardContent className="p-4 pt-0">
                            <div className="flex justify-between items-end">
                               <p className="text-2xl font-headline font-bold text-green-400">124ms</p>
                               <Badge className="bg-green-500/20 text-green-400 text-[8px]">OPTIMAL</Badge>
                            </div>
                         </CardContent>
                      </Card>
                   </div>
                </TabsContent>

                <TabsContent value="cards" className="space-y-6 animate-fade-in">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="glass-panel border-accent/20 bg-accent/5">
                         <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-accent">Issue Hub Card</CardTitle></CardHeader>
                         <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                               <Button variant="outline" className="h-20 flex-col gap-2 border-white/5 bg-black/20 hover:border-accent/50" onClick={() => handleIssueCard('MASTERCARD')} disabled={isIssuingCard}>
                                  <CreditCard className="h-6 w-6 text-accent" />
                                  <span className="text-[10px] font-bold uppercase">Mastercard</span>
                               </Button>
                               <Button variant="outline" className="h-20 flex-col gap-2 border-white/5 bg-black/20 hover:border-blue-400/50" onClick={() => handleIssueCard('VISA')} disabled={isIssuingCard}>
                                  <CreditCard className="h-6 w-6 text-blue-400" />
                                  <span className="text-[10px] font-bold uppercase">Visa</span>
                               </Button>
                            </div>
                         </CardContent>
                      </Card>
                      <Card className="glass-panel border-white/5 p-4 flex flex-col justify-center text-center space-y-2">
                         <p className="text-[10px] uppercase font-bold text-muted-foreground">Quick Settlement</p>
                         <p className="text-xs text-white italic">"Move funds between your mesh wallet and virtual cards deterministically."</p>
                         <Button variant="link" className="text-accent text-[10px] uppercase font-bold">Manage Auto-Sync Rules</Button>
                      </Card>
                   </div>

                   {/* Cards Display */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      {virtualCards?.map((card: any) => (
                        <Card key={card.id} className="relative aspect-[1.58/1] rounded-2xl overflow-hidden group shadow-2xl border-none animate-fade-in">
                           <div className={cn(
                             "absolute inset-0 bg-gradient-to-br transition-all duration-1000",
                             card.brand === 'MASTERCARD' ? "from-[#eb001b] via-[#f79e1b] to-[#13151a]" : "from-[#1a1f71] via-[#00579f] to-[#13151a]"
                           )} />
                           <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                           <CardContent className="relative h-full p-6 flex flex-col justify-between text-white">
                              <div className="flex justify-between items-start">
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Fusion Virtual Card</p>
                                    <Badge className="bg-white/20 backdrop-blur-md border-none text-[8px]">{card.brand}</Badge>
                                 </div>
                                 <Smartphone className="h-5 w-5 opacity-50" />
                              </div>
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                    <p className="text-xl font-mono tracking-[0.2em] font-bold">
                                       {showCardNumbers ? card.cardNumber : card.cardNumber.replace(/\d{4}/g, (match, offset) => offset < 12 ? '****' : match)}
                                    </p>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => setShowCardNumbers(!showCardNumbers)}>
                                       {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                 </div>
                                 <div className="flex justify-between items-end">
                                    <div className="flex gap-8">
                                       <div className="space-y-0.5"><p className="text-[8px] uppercase opacity-50">Expiry</p><p className="text-xs font-bold">{card.expiry}</p></div>
                                       <div className="space-y-0.5"><p className="text-[8px] uppercase opacity-50">Balance</p><p className="text-sm font-bold text-accent">${card.balance.toLocaleString()}</p></div>
                                    </div>
                                    <div className="flex gap-1">
                                       {card.brand === 'MASTERCARD' ? <><div className="w-8 h-8 rounded-full bg-[#eb001b] opacity-80" /><div className="w-8 h-8 rounded-full bg-[#f79e1b] -ml-4 opacity-80" /></> : <div className="w-12 h-8 rounded-md bg-white flex items-center justify-center p-1"><p className="text-[10px] font-bold italic text-[#1a1f71]">VISA</p></div>}
                                    </div>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                      ))}
                   </div>
                </TabsContent>

                <TabsContent value="links" className="space-y-6 animate-fade-in">
                  <PaymentLinkManager />
                </TabsContent>
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
                         <span className="text-muted-foreground uppercase">API Handshake</span>
                         <span className="text-green-400 font-bold">ACTIVE</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2">
                         <span className="text-muted-foreground uppercase">Kernel Status</span>
                         <span className="text-white font-mono text-[8px]">{mode}</span>
                      </div>
                   </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5 bg-secondary/10">
                 <CardHeader className="p-4">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-tighter flex items-center gap-2">
                       <Network className="h-3 w-3 text-primary" />
                       Node Capacity
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span className="text-muted-foreground">Anycast Sync</span>
                        <span className="text-primary">8.4ms</span>
                      </div>
                      <Progress value={98} className="h-1 bg-primary/10 [&>div]:bg-primary" />
                    </div>
                    <div className="p-2 rounded bg-secondary/30 text-[9px] text-white/60 italic leading-relaxed border border-white/5">
                      {"FusionPay is T+0 ready. Global settlements are cryptographically signed."}
                    </div>
                 </CardContent>
              </Card>

              <Card className="glass-panel border-red-500/20 bg-red-500/5">
                 <CardHeader className="p-4">
                    <CardTitle className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-2">
                       <ShieldAlert className="h-3 w-3" /> System Guard
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0">
                    <p className="text-[9px] text-red-300 leading-relaxed">
                       Fraud detection is monitoring all outbound disbursement corridors in real-time.
                    </p>
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

