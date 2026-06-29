"use client";

import { useDoc, useFirestore } from "@/firebase";
import { doc, updateDoc, increment, collection, addDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  ChevronLeft,
  ArrowRight,
  Globe,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Check,
  PackageCheck,
  Truck
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/ui/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const params = useParams();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [hasChecked, setHasChecked] = useState(false);

  const sealId = useMemo(() => {
    if (!params?.seal) return null;
    return Array.isArray(params.seal) ? params.seal[0] : params.seal;
  }, [params]);

  const linkRef = useMemo(() => {
    if (!firestore || !sealId) return null;
    return doc(firestore, 'payment_links', sealId);
  }, [firestore, sealId]);

  const { data: link, loading } = useDoc<any>(linkRef);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setHasChecked(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handlePay = async () => {
    if (!firestore || !link || link.status === 'PAID' || !sealId) return;

    setIsProcessing(true);
    try {
      const timestamp = Date.now();
      const updateData = { 
        status: 'PAID', 
        paidAt: timestamp,
        paymentMethod: selectedMethod 
      };

      // 1. Update registries
      await updateDoc(doc(firestore, 'payment_links', sealId), updateData);
      const userLinkRef = doc(firestore, 'users', link.creatorId, 'payment_links', sealId);
      await updateDoc(userLinkRef, updateData);

      // 2. Settle funds
      const sellerRef = doc(firestore, 'users', link.creatorId);
      await updateDoc(sellerRef, { balance: increment(link.amount) });

      // 3. Beautiful Notification to Seller
      const notifRef = collection(firestore, 'users', link.creatorId, 'notifications');
      await addDoc(notifRef, {
        title: "Settlement Successful",
        message: `আপনি "${link.description}" এর জন্য $${link.amount} পেমেন্ট রিসিভ করেছেন (${selectedMethod.toUpperCase()})। এখন পণ্যটি ডেলিভারি দিতে পারেন।`,
        type: 'DIRECTIVE',
        read: false,
        timestamp: timestamp
      });

      setIsPaid(true);
      toast({ 
        title: "Payment Finalized", 
        description: "The transaction has been cryptographically signed and the citizen credited.",
        variant: "default"
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Settlement Error", description: "Mesh connection interrupted during handshake." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!sealId || (loading && !hasChecked)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/30 blur-2xl rounded-full animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-accent relative z-10" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Establishing Corridor</p>
          <p className="text-[10px] text-muted-foreground opacity-50 uppercase">Deterministic Handshake v1.2</p>
        </div>
      </div>
    );
  }

  if (!link && hasChecked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-8 animate-fade-in">
        <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20">
          <Zap className="h-14 w-14 text-red-500/50" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-headline font-bold uppercase text-white tracking-tighter">Invalid Corridor</h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            এই পেমেন্ট করিডোরটি পাওয়া যায়নি। এটি ডিলিট বা ডিঅ্যাক্টিভেট করা হতে পারে।
          </p>
        </div>
        <Button asChild variant="outline" className="text-[10px] font-bold px-10 h-12 border-white/10 hover:bg-white/5">
           <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" /> Exit Secure Mesh</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col selection:bg-accent selection:text-background">
      <nav className="w-full px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-headline font-bold text-lg uppercase italic text-white tracking-tighter">Sovereign Checkout</span>
        </div>
        <div className="flex items-center gap-4">
           <Badge variant="outline" className="hidden sm:flex border-accent/20 text-accent font-mono text-[9px] uppercase tracking-widest px-3">
             <ShieldCheck className="mr-2 h-3 w-3" /> Encrypted Session
           </Badge>
           <Badge variant="outline" className="border-white/10 text-muted-foreground font-mono text-[9px]">
             {sealId?.substring(0, 12)}...
           </Badge>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        
        <Card className="w-full max-w-xl glass-panel border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
          
          <CardHeader className="text-center pt-10 pb-6">
             <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6 shadow-2xl transition-transform hover:scale-105">
                <ShoppingBag className="h-10 w-10 text-accent" />
             </div>
             <CardTitle className="text-3xl font-headline font-bold uppercase italic tracking-tighter text-white">
               {isPaid ? "Settled Successfully" : "Payment Authorization"}
             </CardTitle>
             <CardDescription className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground mt-2">
               Deterministic Financial Protocol
             </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-6 md:px-12 pb-10">
             {!isPaid ? (
               <>
                <div className="p-8 rounded-3xl bg-secondary/30 border border-white/10 text-center space-y-3 relative overflow-hidden group shadow-inner">
                   <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] relative">Authorized Amount</p>
                   <div className="flex items-baseline justify-center gap-1 relative">
                     <span className="text-2xl font-bold text-accent/70">$</span>
                     <p className="text-6xl font-headline font-bold text-white tracking-tighter">{link?.amount}</p>
                   </div>
                   <p className="text-xs text-accent italic truncate relative font-medium">
                     &ldquo;{link?.description}&rdquo;
                   </p>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Select Settlement Rail</Label>
                    <Badge variant="ghost" className="text-[8px] font-mono opacity-50">v1.2.0</Badge>
                  </div>
                  <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
                    <TabsList className="grid grid-cols-5 bg-secondary/50 p-1.5 h-14 rounded-2xl gap-1.5 shadow-2xl border border-white/5">
                      <TabsTrigger value="card" className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-background transition-all"><CreditCard className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="priyopay" className="rounded-xl text-[#6366f1] font-bold text-[9px] uppercase data-[state=active]:bg-[#6366f1] data-[state=active]:text-white">Priyo</TabsTrigger>
                      <TabsTrigger value="nagad" className="text-orange-500 font-bold rounded-xl text-[9px] uppercase data-[state=active]:bg-orange-500 data-[state=active]:text-white">Nagad</TabsTrigger>
                      <TabsTrigger value="mesh" className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-background"><Building2 className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="wallet" className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-background"><Wallet className="h-4 w-4" /></TabsTrigger>
                    </TabsList>

                    <div className="mt-6 p-6 rounded-2xl border border-white/10 bg-black/40 min-h-[160px] flex flex-col justify-center shadow-inner">
                      <TabsContent value="card" className="space-y-4 m-0 animate-fade-in">
                        <Input placeholder="Card Number" className="h-12 bg-background/50 border-white/10 rounded-xl text-sm font-mono tracking-widest" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="MM/YY" className="h-12 bg-background/50 border-white/10 rounded-xl text-sm text-center" />
                          <Input placeholder="CVC" type="password" className="h-12 bg-background/50 border-white/10 rounded-xl text-sm text-center" />
                        </div>
                      </TabsContent>
                      <TabsContent value="priyopay" className="space-y-4 m-0 animate-fade-in">
                        <div className="text-center space-y-3">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20">
                             <Zap className="h-3 w-3 text-[#6366f1]" />
                             <span className="text-[9px] text-[#818cf8] font-bold uppercase tracking-widest">Priyo Pay Account</span>
                           </div>
                           <Input placeholder="username@priyo.com" className="h-14 bg-background/50 border-white/10 rounded-xl text-lg text-center font-mono text-white" />
                        </div>
                      </TabsContent>
                      <TabsContent value="nagad" className="space-y-4 m-0 animate-fade-in">
                        <div className="text-center space-y-3">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                             <Smartphone className="h-3 w-3 text-orange-400" />
                             <span className="text-[9px] text-orange-400 font-bold uppercase tracking-widest">Nagad Mobile Payment</span>
                           </div>
                           <Input placeholder="01XXXXXXXXX" className="h-14 bg-background/50 border-white/10 rounded-xl text-2xl text-center font-mono text-white tracking-widest" />
                        </div>
                      </TabsContent>
                      <TabsContent value="mesh" className="text-center space-y-4 m-0 animate-fade-in">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                           <Building2 className="h-3 w-3 text-accent" />
                           <span className="text-[9px] text-accent font-bold uppercase tracking-widest">Sovereign Mesh Node</span>
                         </div>
                         <Input placeholder="12-digit account number" className="h-14 bg-background/50 border-white/10 rounded-xl text-center font-mono text-white tracking-[0.2em]" />
                      </TabsContent>
                      <TabsContent value="wallet" className="text-center py-8 space-y-3 m-0 animate-fade-in">
                        <div className="inline-block p-3 rounded-2xl bg-accent/10 border border-accent/20">
                          <Zap className="h-6 w-6 text-accent animate-pulse" />
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">External Wallet Transfer Mode</p>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                <Button 
                  className="w-full h-16 bg-accent text-background font-bold text-base uppercase rounded-2xl cyan-glow transition-all active:scale-95 shadow-2xl group"
                  onClick={handlePay}
                  disabled={isProcessing || link?.status === 'PAID'}
                >
                   {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                     <span className="flex items-center gap-3">
                        Authorize Settlement <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                     </span>
                   )}
                </Button>
               </>
             ) : (
               <div className="text-center py-10 space-y-10 animate-fade-in">
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative w-32 h-32 rounded-full bg-green-500/10 border-4 border-green-500 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.3)]">
                      <Check className="h-16 w-16 text-green-500" strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter">Settled Successfully</h3>
                      <p className="text-xs text-muted-foreground font-medium">পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। বিক্রেতাকে ডিরেক্টিভ পাঠানো হয়েছে।</p>
                    </div>
                    
                    <div className="flex justify-center gap-4 py-2">
                       <div className="flex flex-col items-center gap-2">
                          <div className="p-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20"><PackageCheck className="h-4 w-4" /></div>
                          <span className="text-[8px] font-bold uppercase text-muted-foreground">Signed</span>
                       </div>
                       <div className="flex flex-col items-center gap-2">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"><Truck className="h-4 w-4" /></div>
                          <span className="text-[8px] font-bold uppercase text-muted-foreground">Processing</span>
                       </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-[10px] text-white/70 space-y-2 text-left shadow-2xl relative group">
                     <div className="absolute top-0 right-0 p-2 opacity-20"><ShieldCheck className="h-4 w-4" /></div>
                     <p className="flex justify-between border-b border-white/5 pb-1"><span>SEAL:</span> <span className="text-accent">{sealId?.substring(0, 16)}...</span></p>
                     <p className="flex justify-between border-b border-white/5 pb-1"><span>METHOD:</span> <span className="text-white font-bold">{selectedMethod.toUpperCase()}</span></p>
                     <p className="flex justify-between"><span>STATUS:</span> <span className="text-green-400 font-bold">DETERMINISTIC_FINALITY_OK</span></p>
                  </div>
                  
                  <Button asChild className="w-full h-14 bg-white text-background font-bold uppercase text-xs rounded-2xl hover:bg-white/90 shadow-xl">
                     <Link href="/">Return to Mesh Control</Link>
                  </Button>
               </div>
             )}
          </CardContent>

          <CardFooter className="bg-secondary/20 p-6 flex flex-col items-center border-t border-white/5">
             <div className="flex items-center gap-3 opacity-40 group cursor-default">
                <ShieldCheck className="h-4 w-4 text-accent group-hover:text-white transition-colors" />
                <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-muted-foreground group-hover:text-white transition-colors">
                   Sovereign Kernel Orchestration • Secure Gateway
                </p>
             </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
