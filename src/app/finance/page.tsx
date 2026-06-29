"use client";

import { useState, useEffect, useMemo } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  Send, 
  Wallet, 
  RefreshCw, 
  Zap,
  Loader2,
  Activity,
  Link as LinkIcon,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  Search,
  ShoppingBag,
  TrendingUp,
  Download,
  ExternalLink,
  ChevronRight,
  ArrowRight
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
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
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

  // Stats for Marketplace
  const linksQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'payment_links'), where('status', '==', 'PAID'));
  }, [firestore, user?.uid]);
  
  const { data: paidLinks } = useCollection<any>(linksQuery);
  const marketplaceEarnings = useMemo(() => {
    return paidLinks?.reduce((acc, link) => acc + link.amount, 0) || 0;
  }, [paidLinks]);

  // Transfer States
  const [targetAccount, setTargetAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);
  
  // Priyo Pay States
  const [priyoEmail, setPriyoEmail] = useState("");
  const [priyoAmount, setPriyoAmount] = useState("");
  const [isPriyoProcessing, setIsPriyoProcessing] = useState(false);
  const [priyoReport, setPriyoReport] = useState<any>(null);

  // Sandbox State
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<any>(null);

  const handleMeshTransfer = async () => {
    if (!targetAccount || !transferAmount || !firestore || !user?.uid || !profile) return;
    const amount = parseFloat(transferAmount);
    
    if (amount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Specify a value > 0." });
      return;
    }
    
    if (profile.balance < amount) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "You don't have enough liquid assets." });
      return;
    }

    setIsTransferring(true);
    emitEvent('FINANCE', 'MESH_TRANSFER_INITIATED', 2, { to: targetAccount, amount });

    try {
      const q = query(collection(firestore, 'users'), where('accountNumber', '==', targetAccount));
      const querySnap = await getDocs(q);
      
      if (querySnap.empty) {
        throw new Error("Recipient account not found.");
      }

      const recipientDoc = querySnap.docs[0];
      const recipientRef = doc(firestore, 'users', recipientDoc.id);

      await updateDoc(userRef!, { balance: increment(-amount) });
      await updateDoc(recipientRef, { balance: increment(amount) });

      emitEvent('FINANCE', 'MESH_TRANSFER_SUCCESS', 3, { to: targetAccount, amount });
      
      toast({
        title: "Transfer Success",
        description: `Successfully sent $${amount} to ${targetAccount}.`,
      });
      
      setTargetAccount("");
      setTransferAmount("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Transfer Failed", description: err.message });
    } finally {
      setIsTransferring(false);
    }
  };

  const handlePriyoPayout = async () => {
    if (!priyoEmail || !priyoAmount || !profile) return;
    const amount = parseFloat(priyoAmount);

    if (profile.balance < amount) {
      toast({ variant: "destructive", title: "Balance Exhausted", description: "Sovereign balance insufficient for Priyo Pay payout." });
      return;
    }

    setIsPriyoProcessing(true);
    emitEvent('FINANCE', 'PRIYO_PAYOUT_INITIATED', 2, { recipient: priyoEmail, amount });

    try {
      const result = await orchestratePayout({
        gateway: 'PRIYO_PAY',
        recipientEmail: priyoEmail,
        amount: amount,
      });

      if (result.status === 'SUCCESS') {
        await updateDoc(userRef!, { balance: increment(-amount) });
        setPriyoReport(result);
        emitEvent('FINANCE', 'PRIYO_PAYOUT_SUCCESS', 2, { batch: result.batchId });
        toast({ title: "Priyo Pay Disbursed", description: `Successfully sent $${amount} to ${priyoEmail}.` });
        setPriyoAmount("");
        setPriyoEmail("");
      } else {
        throw new Error("Gateway rejected transaction.");
      }
    } catch (err: any) {
       toast({ variant: "destructive", title: "Payout Failed", description: err.message });
    } finally {
      setIsPriyoProcessing(false);
    }
  };

  const handleBankConnect = (account: any) => {
    setConnectedAccount(account);
    emitEvent('FINANCE', 'AIS_ACCOUNT_SYNCED', 4, { accountId: account.id, bank: account.bankName });
    toast({ title: "Bank Linked", description: "Identity bound to institution." });
  };

  const handleTopUp = async (amount: number) => {
    if (!userRef || !connectedAccount) return;
    
    setIsToppingUp(true);
    emitEvent('FINANCE', 'TREASURY_TOP_UP_INITIATED', 2, { amount, source: connectedAccount.bankName });

    try {
      // 1. Deduct from external simulated bank
      setConnectedAccount((prev: any) => ({
        ...prev,
        balance: prev.balance - amount
      }));

      // 2. Add to Sovereign balance
      await updateDoc(userRef, { balance: increment(amount) });

      emitEvent('FINANCE', 'TREASURY_SYNC_SUCCESS', 2, { amount, type: 'DEPOSIT' });
      
      toast({
        title: "Deposit Successful",
        description: `$${amount} has been pulled from ${connectedAccount.bankName} to Mesh balance.`,
      });
    } catch (err) {
      toast({ variant: "destructive", title: "Deposit Failed", description: "Kernel sync interrupted." });
    } finally {
      setIsToppingUp(false);
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
              Fiscal Command Console
            </h1>
          </div>
          <Badge variant="outline" className={cn("text-xs border-accent/20 text-accent font-mono", isThrottled && "animate-pulse")}>
            KERNEL_{mode}
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
             <Card className="glass-panel border-l-4 border-l-accent overflow-hidden h-full">
                <CardHeader className="pb-2 p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Liquid Assets</CardTitle>
                    <Wallet className="h-4 w-4 text-accent animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
                   <p className="text-3xl font-headline font-bold text-white">${profile?.balance?.toLocaleString() || '0.00'}</p>
                   <p className="text-[9px] text-muted-foreground uppercase font-mono mt-1">ACC: {profile?.accountNumber || '...'}</p>
                </CardContent>
             </Card>

             <Card className="glass-panel border-l-4 border-l-green-500 overflow-hidden h-full">
                <CardHeader className="pb-2 p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Marketplace Income</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col justify-center min-h-[100px]">
                   <p className="text-3xl font-headline font-bold text-white">${marketplaceEarnings.toLocaleString()}</p>
                   <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-1">
                      <TrendingUp className="h-3 w-3" /> {paidLinks?.length || 0} Successful Sales
                   </div>
                </CardContent>
             </Card>

             <Card className="glass-panel border-l-4 border-l-primary lg:col-span-2 overflow-hidden h-full">
                <CardHeader className="pb-2 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Linked Institution (AIS)</CardTitle>
                    {connectedAccount && (
                      <Badge className="bg-primary/20 text-primary text-[8px] font-mono">SYNC_OK</Badge>
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
                        <div className="flex flex-col gap-2 shrink-0">
                           <Button 
                             size="sm" 
                             className="bg-primary text-primary-foreground font-bold text-[10px] h-8 px-4"
                             onClick={() => handleTopUp(1000)}
                             disabled={isToppingUp || connectedAccount.balance < 1000}
                           >
                              {isToppingUp ? <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> : <Download className="mr-1 h-3 w-3" />}
                              Deposit $1,000
                           </Button>
                           <Button variant="ghost" className="text-[8px] uppercase font-bold h-6" onClick={() => setConnectedAccount(null)}>Disconnect</Button>
                        </div>
                     </div>
                   ) : (
                     <Button variant="ghost" className="text-[10px] font-bold text-primary hover:bg-primary/10 h-12 border border-dashed border-primary/20 w-full" onClick={() => setIsSandboxOpen(true)}>
                        Connect Open Banking Node
                     </Button>
                   )}
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="links" className="space-y-6">
                <TabsList className="bg-secondary/50 border border-white/5 p-1 h-auto flex flex-wrap">
                  <TabsTrigger value="links" className="data-[state=active]:bg-accent data-[state=active]:text-background text-[10px] uppercase font-bold tracking-widest px-6 h-10">Marketplace Links</TabsTrigger>
                  <TabsTrigger value="priyo" className="data-[state=active]:bg-[#6366f1] data-[state=active]:text-white text-[10px] uppercase font-bold tracking-widest px-6 h-10">Priyo Pay Payouts</TabsTrigger>
                  <TabsTrigger value="mesh" className="data-[state=active]:bg-accent data-[state=active]:text-background text-[10px] uppercase font-bold tracking-widest px-6 h-10">Mesh Transfer</TabsTrigger>
                </TabsList>

                <TabsContent value="links" className="space-y-6">
                  <PaymentLinkManager />
                </TabsContent>

                <TabsContent value="priyo" className="space-y-6">
                   <Card className="glass-panel border-l-4 border-l-[#6366f1] bg-[#6366f1]/5">
                      <CardHeader>
                         <CardTitle className="text-sm flex items-center gap-2 uppercase text-[#818cf8]">
                            <PriyoIcon className="h-4 w-4" /> Priyo Pay Disbursement
                         </CardTitle>
                         <CardDescription className="text-[10px] uppercase tracking-widest">Global USD disbursement gateway</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold uppercase">Recipient Email</Label>
                               <Input 
                                  placeholder="user@priyo.com" 
                                  className="h-11 text-sm bg-background/50 border-white/5"
                                  value={priyoEmail}
                                  onChange={(e) => setPriyoEmail(e.target.value)}
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold uppercase">Amount ($)</Label>
                               <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  className="h-11 text-sm bg-background/50 border-white/5"
                                  value={priyoAmount}
                                  onChange={(e) => setPriyoAmount(e.target.value)}
                               />
                            </div>
                         </div>
                         <Button 
                            className="w-full h-11 bg-[#6366f1] text-white font-bold uppercase text-xs hover:bg-[#4f46e5]"
                            onClick={handlePriyoPayout}
                            disabled={isPriyoProcessing || isThrottled}
                         >
                            {isPriyoProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                            Execute Priyo Payout
                         </Button>

                         {priyoReport && (
                           <div className="mt-4 p-4 rounded-xl bg-black/40 border border-[#6366f1]/20 space-y-3 animate-fade-in">
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold text-[#818cf8]">STATUS: {priyoReport.status}</span>
                                 <Badge variant="outline" className="text-[8px] font-mono">{priyoReport.batchId}</Badge>
                              </div>
                              <div className="space-y-1">
                                 {priyoReport.executionLog.slice(0, 3).map((log: string, i: number) => (
                                   <p key={i} className="text-[9px] text-muted-foreground font-mono">&gt; {log}</p>
                                 ))}
                              </div>
                           </div>
                         )}
                      </CardContent>
                   </Card>
                </TabsContent>

                <TabsContent value="mesh" className="space-y-6">
                   <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
                      <CardHeader>
                         <CardTitle className="text-sm flex items-center gap-2 uppercase">
                            <Send className="h-4 w-4 text-accent" /> Mesh Transfer Protocol
                         </CardTitle>
                         <CardDescription className="text-[10px] uppercase tracking-widest">Internal anycast settlement corridor</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold uppercase">Recipient Account #</Label>
                               <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                                  <Input 
                                     placeholder="12-digit account number" 
                                     className="pl-10 h-11 text-sm bg-background/50 border-white/5"
                                     value={targetAccount}
                                     onChange={(e) => setTargetAccount(e.target.value)}
                                  />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold uppercase">Amount ($)</Label>
                               <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  className="h-11 text-sm bg-background/50 border-white/5"
                                  value={transferAmount}
                                  onChange={(e) => setTransferAmount(e.target.value)}
                               />
                            </div>
                         </div>
                         <Button 
                            className="w-full h-11 bg-accent text-background font-bold uppercase text-xs cyan-glow"
                            onClick={handleMeshTransfer}
                            disabled={isTransferring || isThrottled}
                         >
                            {isTransferring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                            Execute Settlement
                         </Button>
                      </CardContent>
                   </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs uppercase flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" /> Fiscal Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                   <div className="p-3 rounded bg-black/40 border border-white/5 text-[10px] space-y-2">
                      <div className="flex justify-between">
                         <span className="text-muted-foreground uppercase">Identity Trust</span>
                         <span className="text-accent">{profile?.trustScore || 85}%</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-muted-foreground uppercase">Clearance</span>
                         <span className="text-white">L3_DETERMINISTIC</span>
                      </div>
                   </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                 <CardHeader className="p-4">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-tighter">System Directives</CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-3">
                    <div className="p-2 rounded bg-secondary/30 text-[9px] text-white/60 italic leading-relaxed">
                      {"Priyo Pay payouts are subject to Imperial Directive validation for amounts > $1,000."}
                    </div>
                    <Progress value={92} className="h-1" />
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
