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
  const rawSealId = params?.seal;
  const sealId = typeof rawSealId === 'string' ? rawSealId : Array.isArray(rawSealId) ? rawSealId[0] : '';
  
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  const linkRef = useMemo(() => {
    if (!firestore || !sealId) return null;
    return doc(firestore, 'payment_links', sealId);
  }, [firestore, sealId]);

  const { data: link, loading } = useDoc<any>(linkRef);

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

      await updateDoc(doc(firestore, 'payment_links', sealId), updateData);
      
      const userLinkRef = doc(firestore, 'users', link.creatorId, 'payment_links', sealId);
      await updateDoc(userLinkRef, updateData);

      const sellerRef = doc(firestore, 'users', link.creatorId);
      await updateDoc(sellerRef, { balance: increment(link.amount) });

      const notifRef = collection(firestore, 'users', link.creatorId, 'notifications');
      await addDoc(notifRef, {
        title: "Marketplace Settlement",
        message: `Payment of $${link.amount} for "${link.description}" has been received via ${selectedMethod.toUpperCase()}.`,
        type: 'DIRECTIVE',
        read: false,
        timestamp: timestamp
      });

      setIsPaid(true);
      toast({ title: "Payment Successful", description: "The citizen has been notified of your settlement." });
    } catch (error) {
      toast({ variant: "destructive", title: "Settlement Failed", description: "Kernel connection interrupted." });
    } finally {
      setIsProcessing(false);
    }
  };

  // Immediate handling of parameter resolution
  if (!sealId || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Accessing Ledger...</p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-8">
        <Zap className="h-12 w-12 text-red-500/50" />
        <div className="space-y-2">
          <h1 className="text-xl font-headline font-bold uppercase text-white">Route Terminated</h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">This payment corridor does not exist or has been closed by the citizen.</p>
        </div>
        <Button asChild variant="outline" className="text-[10px] font-bold px-8">
           <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" /> Exit Mesh</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <nav className="w-full px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-headline font-bold text-lg uppercase italic text-white">Sovereign Checkout</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg glass-panel border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          
          <CardHeader className="text-center pt-8 pb-4">
             <ShoppingBag className="h-8 w-8 text-accent mx-auto mb-4" />
             <CardTitle className="text-2xl font-headline font-bold uppercase italic">
               {isPaid ? "Settled" : "Secure Checkout"}
             </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 px-8">
             {!isPaid ? (
               <>
                <div className="p-6 rounded-xl bg-secondary/30 border border-white/5 text-center space-y-2">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount Due</p>
                   <p className="text-4xl font-headline font-bold text-accent">${link.amount}</p>
                   <p className="text-xs text-white/70 italic truncate">"{link.description}"</p>
                </div>

                <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
                  <TabsList className="grid grid-cols-4 bg-secondary/50 p-1 h-12">
                    <TabsTrigger value="card"><CreditCard className="h-4 w-4" /></TabsTrigger>
                    <TabsTrigger value="nagad" className="text-orange-500 font-bold">Nagad</TabsTrigger>
                    <TabsTrigger value="mesh"><Building2 className="h-4 w-4" /></TabsTrigger>
                    <TabsTrigger value="wallet"><Wallet className="h-4 w-4" /></TabsTrigger>
                  </TabsList>

                  <div className="mt-4 p-4 rounded-xl border border-white/5 bg-black/20 min-h-[120px] flex flex-col justify-center">
                    <TabsContent value="card" className="space-y-3 m-0">
                      <Input placeholder="Card Number" className="h-10 bg-secondary/30" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="MM/YY" className="h-10 bg-secondary/30" />
                        <Input placeholder="CVC" type="password" className="h-10 bg-secondary/30" />
                      </div>
                    </TabsContent>
                    <TabsContent value="nagad" className="space-y-3 m-0">
                      <Label className="text-[9px] uppercase font-bold opacity-60">Mobile Number</Label>
                      <Input placeholder="017XXXXXXXX" className="h-10 bg-secondary/30" />
                    </TabsContent>
                    <TabsContent value="mesh" className="text-center space-y-2 m-0">
                       <p className="text-[10px] text-primary italic">Pay using 12-digit Sovereign Account</p>
                       <Input placeholder="XXXXXXXXXXXX" className="h-10 bg-secondary/30" />
                    </TabsContent>
                    <TabsContent value="wallet" className="text-center py-4 text-[10px] text-muted-foreground">
                      Manual Wallet Transfer Protocol Active
                    </TabsContent>
                  </div>
                </Tabs>

                <Button 
                  className="w-full h-14 bg-accent text-background font-bold text-sm uppercase cyan-glow"
                  onClick={handlePay}
                  disabled={isProcessing || link.status === 'PAID'}
                >
                   {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Settlement"}
                </Button>
               </>
             ) : (
               <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-headline font-bold text-white uppercase italic">Payment Successful</h3>
                    <p className="text-xs text-muted-foreground">The merchant has been notified and will process your order shortly.</p>
                  </div>
                  <Button asChild className="w-full h-12 bg-white text-background font-bold uppercase text-[10px]">
                     <Link href="/">Return to Mesh</Link>
                  </Button>
               </div>
             )}
          </CardContent>

          <CardFooter className="bg-secondary/20 p-4 flex flex-col items-center">
             <p className="text-[8px] uppercase font-bold tracking-[0.3em] text-muted-foreground opacity-30">
                Sovereign Kernel Orchestration • Secure Corridor
             </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
