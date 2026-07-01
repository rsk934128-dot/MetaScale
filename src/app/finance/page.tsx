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
  CloudLightning
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
import { BankSandboxModal } from "@/components/finance/BankSandboxModal";
import { orchestratePayout } from "@/ai/flows/payout-orchestrator";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FinancialIntelligence() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { mode, emitEvent } = useKernel();
  const { toast } = useToast();
  
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
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<any>(null);

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
        toast({ title: "Payout Dispatched", description: `Transaction Hash: ${result.txHash.substring(0, 16)}...` });
        setPayoutAmount("");
        setPayoutRecipient("");
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Execution Failed" });
    } finally {
      setIsPayoutProcessing(false);
    }
  };

  const moneyMovementOptions = [
    { icon: Users, label: "Priyo Pay User", desc: "Instant peer-to-peer" },
    { icon: Building2, label: "US Bank", desc: "Domestic wires/ACH" },
    { icon: Globe, label: "BD Bank", desc: "Local BEFTN/NPSB" },
    { icon: Smartphone, label: "Mobile Wallet", desc: "bKash, Nagad, Rocket" },
    { icon: CreditCard, label: "My Accounts", desc: "Manage settlements" }
  ];

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1 truncate">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <DollarSign className="h-5 w-5 text-accent" />
              Fiscal Command Hub
            </h1>
          </div>
          <Badge variant="outline" className="text-xs border-accent/20 text-accent font-mono">
            KERNEL_{mode}
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          {/* Balance & Stats Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="glass-panel border-l-4 border-l-accent overflow-hidden shadow-2xl">
                <CardHeader className="pb-2 p-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Main Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-accent animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                   <p className="text-4xl font-headline font-bold text-white">${profile?.balance?.toLocaleString() || '0.00'}</p>
                   <p className="text-[9px] text-accent font-bold mt-2 uppercase tracking-widest">USD_SETTLEMENT_NODE</p>
                </CardContent>
             </Card>

             <Card className="glass-panel border-l-4 border-l-primary lg:col-span-2 overflow-hidden bg-primary/5">
                <CardHeader className="pb-2 p-6">
                    <CardTitle className="text-[10px] uppercase font-bold text-primary tracking-[0.2em] flex items-center gap-2">
                       <TrendingUp className="h-3 w-3" /> Live Interbank Exchange (Remittance)
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 grid grid-cols-2 gap-8">
                   <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">MYR to BDT</p>
                      <p className="text-2xl font-headline font-bold text-white">৳27.41 <span className="text-[10px] text-green-400">+0.12</span></p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">USD to BDT</p>
                      <p className="text-2xl font-headline font-bold text-accent">৳124.50 <span className="text-[10px] text-green-400">+0.05</span></p>
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Move Money Hub */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
               <h2 className="text-xl font-headline font-bold uppercase italic tracking-tighter">Move <span className="text-accent">Money</span></h2>
               <Badge variant="outline" className="text-[8px] font-bold border-accent/20 text-accent uppercase">5 Active Channels</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
               {moneyMovementOptions.map((opt, i) => (
                 <Card key={i} className="glass-panel hover:border-accent/40 transition-all cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                       <div className="p-3 rounded-2xl bg-secondary/50 border border-white/5 group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/30 transition-all">
                          <opt.icon className="h-6 w-6 text-accent" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-white uppercase tracking-tight">{opt.label}</p>
                          <p className="text-[9px] text-muted-foreground italic leading-none">{opt.desc}</p>
                       </div>
                    </CardContent>
                 </Card>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payout Form */}
            <div className="lg:col-span-2">
               <Card className="glass-panel border-l-4 border-l-[#6366f1] bg-[#6366f1]/5 shadow-2xl overflow-hidden">
                  <CardHeader>
                     <CardTitle className="text-sm flex items-center gap-2 uppercase text-[#818cf8]">
                        <Building2 className="h-4 w-4" /> Global Disbursement
                     </CardTitle>
                     <CardDescription className="text-[10px] uppercase tracking-widest">Cross-border Settlement Pipeline</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold opacity-60">Payout Rail</Label>
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
                           <Label className="text-[10px] font-bold opacity-60">Recipient Address</Label>
                           <Input 
                             placeholder="email@mesh.gov or @username" 
                             className="bg-secondary/30 border-white/5 h-11 text-sm"
                             value={payoutRecipient}
                             onChange={(e) => setPayoutRecipient(e.target.value)}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-bold opacity-60">Amount (USD)</Label>
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
                       disabled={isPayoutProcessing || !payoutAmount || !payoutRecipient}
                     >
                        {isPayoutProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Authorize Institutional Disbursement
                     </Button>
                  </CardContent>
               </Card>
            </div>

            {/* Recent History Sidebar */}
            <div className="space-y-6">
               <Card className="glass-panel border-white/5 h-full flex flex-col">
                  <CardHeader className="p-4 border-b border-white/5">
                     <CardTitle className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                        <History className="h-4 w-4 text-accent" /> Recent Activity
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1">
                     <ScrollArea className="h-[400px]">
                        <div className="divide-y divide-white/5">
                           {recentTxns?.map((txn: any) => (
                             <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-3">
                                   <div className="p-2 rounded bg-black/40 border border-white/10 text-primary">
                                      <DollarSign className="h-4 w-4" />
                                   </div>
                                   <div className="space-y-0.5">
                                      <p className="text-[11px] font-bold text-white uppercase">${txn.amount}</p>
                                      <p className="text-[8px] text-muted-foreground font-mono">{new Date(txn.timestamp).toLocaleTimeString()}</p>
                                   </div>
                                </div>
                                <Badge variant="ghost" className="text-[7px] uppercase border-white/10">{txn.status}</Badge>
                             </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </CardContent>
               </Card>

               <Card className="glass-panel border-accent/20 bg-accent/5">
                  <CardContent className="p-4 flex items-center gap-4">
                     <ShieldCheck className="h-8 w-8 text-accent shrink-0" />
                     <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-white uppercase">Compliance Check</p>
                        <p className="text-[9px] text-muted-foreground italic">ISO 20022 messaging active on all payout rails.</p>
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>

      <BankSandboxModal 
        isOpen={isSandboxOpen} 
        onClose={() => setIsSandboxOpen(false)} 
        onSuccess={(acc) => setConnectedAccount(acc)}
      />
    </div>
  );
}
