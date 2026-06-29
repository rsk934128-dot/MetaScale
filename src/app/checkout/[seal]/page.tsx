
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
  Wallet
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

  // Robust parameter resolution for Next.js 15
  const sealId = useMemo(() => {
    if (!params?.seal) return null;
    return Array.isArray(params.seal) ? params.seal[0] : params.seal;
  }, [params]);

  const linkRef = useMemo(() => {
    if (!firestore || !sealId) return null;
    return doc(firestore, 'payment_links', sealId);
  }, [firestore, sealId]);

  const { data: link, loading } = useDoc<any>(linkRef);

  // Give a small grace period for Firestore propagation
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

      // Update public registry
      await updateDoc(doc(firestore, 'payment_links', sealId), updateData);
      
      // Update user specific registry
      const userLinkRef = doc(firestore, 'users', link.creatorId, 'payment_links', sealId);
      await updateDoc(userLinkRef, updateData);

      // Settle funds
      const sellerRef = doc(firestore, 'users', link.creatorId);
      await updateDoc(sellerRef, { balance: increment(link.amount) });

      // Notify seller
      const notifRef = collection(firestore, 'users', link.creatorId, 'notifications');
      await addDoc(notifRef, {
        title: "Marketplace Settlement",
        message: `Payment of $${link.amount} for "${link.description}" received via ${selectedMethod.toUpperCase()}.`,
        type: 'DIRECTIVE',
        read: false,
        timestamp: timestamp
      });

      setIsPaid(true);
      toast({ title: "Settlement Authorized", description: "The citizen has been credited successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Settlement Failed", description: "Kernel link interrupted." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!sealId || (loading && !hasChecked)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
          <Loader2 className="h-10 w-10 animate-spin text-accent relative z-10" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Synchronizing Ledger...</p>
      </div>
    );
  }

  if (!link && hasChecked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-8">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
          <Zap className="h-12 w-12 text-red-500/50" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-headline font-bold uppercase text-white">Invalid Route</h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            এই পেমেন্ট করিডোরটি পাওয়া যায়নি। এটি ডিলিট বা ডিঅ্যাক্টিভেট করা হতে পারে।
          </p>
        </div>
        <Button asChild variant="outline" className="text-[10px] font-bold px-8 h-11">
           <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" /> Exit Mesh</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col selection:bg-accent selection:text-background">
      <nav className="w-full px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-headline font-bold text-lg uppercase italic text-white tracking-tighter">Sovereign Checkout</span>
        </div>
        <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[9px]">
          SECURE_CORRIDOR_V1.2
        </Badge>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-lg glass-panel border-white/10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          
          <CardHeader className="text-center pt-8 pb-4">
             <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-accent" />
             </div>
             <CardTitle className="text-2xl font-headline font-bold uppercase italic">
               {isPaid ? "Settled" : "Marketplace Settlement"}
             </CardTitle>
             <CardDescription className="text-[10px] uppercase font-bold tracking-widest">
               Deterministic Payment Protocol
             </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-4 md:px-8 pb-8">
             {!isPaid ? (
               <>
                <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 text-center space-y-2 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <p className="text-[10px] uppercase font-bold text-muted-foreground relative">Amount Due</p>
                   <p className="text-5xl font-headline font-bold text-white relative">${link?.amount}</p>
                   <p className="text-xs text-accent italic truncate relative">"{link?.description}"</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Select Rail</Label>
                  <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
                    <TabsList className="grid grid-cols-4 bg-secondary/50 p-1 h-12 rounded-xl">
                      <TabsTrigger value="card" className="rounded-lg"><CreditCard className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="nagad" className="text-orange-500 font-bold rounded-lg">Nagad</TabsTrigger>
                      <TabsTrigger value="mesh" className="rounded-lg"><Building2 className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="wallet" className="rounded-lg"><Wallet className="h-4 w-4" /></TabsTrigger>
                    </TabsList>

                    <div className="mt-4 p-5 rounded-2xl border border-white/5 bg-black/20 min-h-[140px] flex flex-col justify-center">
                      <TabsContent value="card" className="space-y-4 m-0">
                        <Input placeholder="Card Number" className="h-11 bg-background/50 border-white/10 rounded-lg text-sm" />
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="MM/YY" className="h-11 bg-background/50 border-white/10 rounded-lg text-sm" />
                          <Input placeholder="CVC" type="password" className="h-11 bg-background/50 border-white/10 rounded-lg text-sm" />
                        </div>
                      </TabsContent>
                      <TabsContent value="nagad" className="space-y-4 m-0">
                        <div className="text-center space-y-2">
                           <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Nagad Mobile Payment</p>
                           <Input placeholder="017XXXXXXXX" className="h-12 bg-background/50 border-white/10 rounded-lg text-lg text-center font-mono" />
                        </div>
                      </TabsContent>
                      <TabsContent value="mesh" className="text-center space-y-3 m-0">
                         <p className="text-[10px] text-accent italic uppercase font-bold tracking-widest">Sovereign Internal Account</p>
                         <Input placeholder="12-digit account number" className="h-12 bg-background/50 border-white/10 rounded-lg text-center font-mono" />
                      </TabsContent>
                      <TabsContent value="wallet" className="text-center py-6 space-y-2 m-0">
                        <div className="inline-block p-2 rounded bg-accent/10 border border-accent/20">
                          <Zap className="h-5 w-5 text-accent animate-pulse" />
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Manual Wallet Transfer Active</p>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                <Button 
                  className="w-full h-14 bg-accent text-background font-bold text-sm uppercase rounded-xl cyan-glow transition-all active:scale-95"
                  onClick={handlePay}
                  disabled={isProcessing || link?.status === 'PAID'}
                >
                   {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                     <span className="flex items-center gap-2">
                        Authorize Settlement <ArrowRight className="h-4 w-4" />
                     </span>
                   )}
                </Button>
               </>
             ) : (
               <div className="text-center py-10 space-y-8 animate-fade-in">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold text-white uppercase italic tracking-tighter">Success</h3>
                    <p className="text-xs text-muted-foreground">পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। বিক্রেতাকে জানানো হয়েছে।</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[9px] text-white/50 space-y-1">
                     <p>SEAL: {sealId}</p>
                     <p>METHOD: {selectedMethod.toUpperCase()}</p>
                     <p>STATUS: DETERMINISTIC_FINALITY_OK</p>
                  </div>
                  <Button asChild className="w-full h-12 bg-white text-background font-bold uppercase text-[10px] rounded-xl hover:bg-white/90">
                     <Link href="/">Return to Mesh</Link>
                  </Button>
               </div>
             )}
          </CardContent>

          <CardFooter className="bg-secondary/20 p-4 flex flex-col items-center">
             <div className="flex items-center gap-2 opacity-30 group">
                <ShieldCheck className="h-3 w-3 text-accent group-hover:text-white transition-colors" />
                <p className="text-[8px] uppercase font-bold tracking-[0.3em] text-muted-foreground">
                   Sovereign Kernel Orchestration • Secure Corridor
                </p>
             </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
