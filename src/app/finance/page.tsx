
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
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKernel } from "@/components/kernel/KernelProvider";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { BankSandboxModal } from "@/components/finance/BankSandboxModal";
import { PaymentLinkManager } from "@/components/finance/PaymentLinkManager";

export default function FinancialIntelligence() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { mode, emitEvent } = useKernel();
  const { toast } = useToast();
  
  // Local Profile Data
  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  // Transfer States
  const [targetAccount, setTargetAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  
  // PIS States
  const [pisRecipient, setPisRecipient] = useState("");
  const [pisAmount, setPisAmount] = useState("");
  const [gateway, setGateway] = useState<"PAYPAL" | "PRIYO_PAY" | "PAYONEER">("PAYPAL");
  const [isPisProcessing, setIsPisProcessing] = useState(false);
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
      // 1. Find recipient by account number
      const q = query(collection(firestore, 'users'), where('accountNumber', '==', targetAccount));
      const querySnap = await getDocs(q);
      
      if (querySnap.empty) {
        throw new Error("Recipient account not found in the Sovereign Mesh.");
      }

      const recipientDoc = querySnap.docs[0];
      const recipientRef = doc(firestore, 'users', recipientDoc.id);

      // 2. Perform Transfer (Prototype approach: update docs)
      updateDoc(userRef!, { balance: increment(-amount) });
      updateDoc(recipientRef, { balance: increment(amount) });

      emitEvent('FINANCE', 'MESH_TRANSFER_SUCCESS', 3, { to: targetAccount, amount });
      
      toast({
        title: "Transfer Success",
        description: `Successfully sent $${amount} to account ${targetAccount}.`,
      });
      
      setTargetAccount("");
      setTransferAmount("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Transfer Failed",
        description: err.message,
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const handleBankConnect = (account: any) => {
    setConnectedAccount(account);
    emitEvent('FINANCE', 'AIS_ACCOUNT_SYNCED', 4, { accountId: account.id, bank: account.bankName });
    toast({ title: "Bank Linked", description: "Ready for PIS testing." });
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
          <Badge variant="outline" className={`text-xs border-accent/20 text-accent font-mono ${isThrottled ? 'animate-pulse' : ''}`}>
            KERNEL_{mode}
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Card className="glass-panel border-l-4 border-l-accent overflow-hidden h-full">
                    <CardHeader className="pb-2 p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Liquid Assets</CardTitle>
                        <Wallet className="h-4 w-4 text-accent animate-pulse" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col justify-center min-h-[120px]">
                       <div className="space-y-1">
                          <p className="text-3xl font-headline font-bold text-white">${profile?.balance?.toLocaleString() || '0.00'}</p>
                          <div className="flex justify-between items-center">
                             <p className="text-[10px] text-muted-foreground uppercase font-mono">ACC: {profile?.accountNumber || '...'}</p>
                             <Badge variant="outline" className="text-[8px] border-green-500/20 text-green-400">ACTIVE</Badge>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="glass-panel border-l-4 border-l-primary overflow-hidden h-full">
                    <CardHeader className="pb-2 p-4">
                      <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Linked Assets (AIS)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col justify-center min-h-[120px]">
                       {connectedAccount ? (
                         <div className="space-y-2">
                            <p className="text-2xl font-headline font-bold text-white">${connectedAccount.balance.toLocaleString()}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">{connectedAccount.bankName}</p>
                         </div>
                       ) : (
                         <Button variant="ghost" className="text-[10px] font-bold text-primary hover:bg-primary/10 h-10 border border-dashed border-primary/20" onClick={() => setIsSandboxOpen(true)}>
                            Link Bank via Sandbox
                         </Button>
                       )}
                    </CardContent>
                 </Card>
              </div>

              <Tabs defaultValue="mesh" className="space-y-6">
                <TabsList className="bg-secondary/50 border border-white/5 p-1 h-auto flex flex-wrap">
                  <TabsTrigger value="mesh" className="data-[state=active]:bg-accent data-[state=active]:text-background text-[10px] uppercase font-bold tracking-widest px-6 h-10">Mesh Transfer</TabsTrigger>
                  <TabsTrigger value="pis" className="data-[state=active]:bg-accent data-[state=active]:text-background text-[10px] uppercase font-bold tracking-widest px-6 h-10">External Rail (PIS)</TabsTrigger>
                  <TabsTrigger value="links" className="data-[state=active]:bg-accent data-[state=active]:text-background text-[10px] uppercase font-bold tracking-widest px-6 h-10">Payment Links</TabsTrigger>
                </TabsList>

                <TabsContent value="mesh" className="space-y-6">
                   <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
                      <CardHeader>
                         <CardTitle className="text-sm flex items-center gap-2 uppercase">
                            <Send className="h-4 w-4 text-accent" /> Peer-to-Peer Mesh Transfer
                         </CardTitle>
                         <CardDescription className="text-[10px] uppercase tracking-widest">Internal Sovereign Rail</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold uppercase">Recipient Account #</Label>
                               <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                                  <Input 
                                     placeholder="Enter 12-digit number" 
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
                            Execute Mesh Transfer
                         </Button>
                      </CardContent>
                   </Card>
                </TabsContent>

                <TabsContent value="pis">
                   <Card className="glass-panel">
                      <CardHeader>
                         <CardTitle className="text-sm uppercase">Global Disbursement Rail</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 text-center py-12 opacity-50">
                         <Activity className="h-12 w-12 mx-auto mb-4 text-primary" />
                         <p className="text-xs uppercase font-bold tracking-widest">PIS Rails in Standby Mode</p>
                      </CardContent>
                   </Card>
                </TabsContent>

                <TabsContent value="links">
                  <PaymentLinkManager />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
               <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader className="p-4">
                  <CardTitle className="text-xs uppercase flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" /> Security Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                   <div className="p-3 rounded bg-black/40 border border-white/5 text-[10px] space-y-2">
                      <div className="flex justify-between">
                         <span className="text-muted-foreground uppercase">Trust Score</span>
                         <span className="text-accent">{profile?.trustScore || 85}%</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-muted-foreground uppercase">Clearance</span>
                         <span className="text-white">L3_DETERMINISTIC</span>
                      </div>
                   </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                 <CardHeader className="p-4">
                    <CardTitle className="text-[10px] uppercase font-bold tracking-tighter">System Stability</CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0">
                    <div className="flex justify-between text-[10px] font-bold mb-2">
                       <span>Grid Health</span>
                       <span className="text-green-400">Optimal</span>
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
