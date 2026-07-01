
"use client";

import { useDoc, useFirestore } from "@/firebase";
import { doc, updateDoc, increment, setDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Zap, 
  Loader2, 
  ChevronLeft,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  BadgeCheck,
  Building
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

      // 1. Update registries (Public Link)
      await updateDoc(doc(firestore, 'payment_links', sealId), updateData);
      
      // 2. Update registries (User-specific Copy if exists)
      try {
        await updateDoc(doc(firestore, 'users', link.creatorId, 'payment_links', sealId), updateData);
      } catch (e) {
        console.warn("User link copy update failed");
      }

      // 3. Log to UBIL Events
      await setDoc(doc(firestore, 'ubil_events', `TXN_${sealId}`), {
        id: `TXN_${sealId}`,
        type: 'TXN_SUCCESS',
        amount: link.amount,
        currency: 'USD',
        status: 'SUCCESS',
        timestamp: timestamp,
        senderName: "Public Checkout",
        senderBank: selectedMethod.toUpperCase(),
        merchantId: link.creatorId,
        seal: sealId,
        isVerified: link.isVerified
      });

      setIsPaid(true);
      toast({ 
        title: "Authorization Successful", 
        description: "भुगतान सफलतापूर्वक पूर्ण हुआ।",
      });
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast({ 
        variant: "destructive", 
        title: "Settlement Error", 
        description: error.message || "Handshake interrupted by Security Protocol." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!sealId || (loading && !hasChecked)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Establishing Secure Corridor</p>
      </div>
    );
  }

  if (!link && hasChecked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-8 animate-fade-in">
        <Zap className="h-14 w-14 text-red-500" />
        <h1 className="text-2xl font-headline font-bold uppercase text-white">Invalid Corridor</h1>
        <Button asChild variant="outline" className="text-[10px] font-bold px-10 h-12 border-white/10">
           <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" /> Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col selection:bg-accent selection:text-background">
      <nav className="w-full px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-headline font-bold text-lg uppercase italic text-white tracking-tighter">Sovereign OS</span>
        </div>
        <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[9px] uppercase tracking-widest px-3">
          <ShieldCheck className="mr-2 h-3 w-3" /> Secure Node Node-04
        </Badge>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        
        <Card className="w-full max-w-xl glass-panel border-white/10 shadow-2xl overflow-hidden relative animate-fade-in">
          <CardHeader className="text-center pt-10">
             <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-accent" />
             </div>
             <CardTitle className="text-3xl font-headline font-bold uppercase italic tracking-tighter text-white">
               {isPaid ? "Settlement Finalized" : "भुगतान करें (Secure Pay)"}
             </CardTitle>
             <CardDescription className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground">
               Deterministic Execution Corridor
             </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-6 md:px-12 pb-10">
             {!isPaid ? (
               <>
                <div className="p-8 rounded-3xl bg-secondary/30 border border-white/10 text-center space-y-4 relative">
                   {link?.isVerified && (
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-background text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-xl">
                        <BadgeCheck className="h-4 w-4" /> प्रमाणित विक्रेता (Verified)
                     </div>
                   )}
                   <div className="pt-2">
                     <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Amount Due</p>
                     <div className="flex items-baseline justify-center gap-1">
                       <span className="text-xl font-bold text-accent">$</span>
                       <p className="text-6xl font-headline font-bold text-white tracking-tighter">{link?.amount}</p>
                     </div>
                     <p className="text-sm text-accent font-bold mt-4">
                       {link?.description}
                     </p>
                     {link?.isVerified && (
                       <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-tighter flex items-center justify-center gap-1">
                         <Building className="h-3 w-3" /> {link.merchantBank}
                       </p>
                     )}
                   </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Select Rail</Label>
                  <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
                    <TabsList className="grid grid-cols-4 bg-secondary/50 p-1 h-12">
                      <TabsTrigger value="card" className="text-[9px] uppercase font-bold"><CreditCard className="h-3.5 w-3.5 mr-1" /> Card</TabsTrigger>
                      <TabsTrigger value="stripe" className="text-[9px] uppercase font-bold">Stripe</TabsTrigger>
                      <TabsTrigger value="nagad" className="text-[9px] uppercase font-bold">Nagad</TabsTrigger>
                      <TabsTrigger value="mesh" className="text-[9px] uppercase font-bold"><Building2 className="h-3.5 w-3.5 mr-1" /> Mesh</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button 
                  className="w-full h-14 bg-accent text-background font-bold text-sm uppercase rounded-2xl cyan-glow"
                  onClick={handlePay}
                  disabled={isProcessing || link?.status === 'PAID'}
                >
                   {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                     <span className="flex items-center gap-2">
                        Authorize Transaction <ArrowRight className="h-4 w-4" />
                     </span>
                   )}
                </Button>
               </>
             ) : (
               <div className="text-center py-10 space-y-8 animate-fade-in">
                  <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto">
                    <Check className="h-12 w-12 text-green-500" strokeWidth={3} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold text-white uppercase italic tracking-tighter">सफल भुगतान (Settled)</h3>
                    <p className="text-xs text-muted-foreground">आपका लेनदेन सफलतापूर्वक प्रमाणित और सुरक्षित कर लिया गया है।</p>
                  </div>
                  <Button asChild className="w-full h-12 bg-white text-background font-bold uppercase text-[10px]">
                     <Link href="/">Back to Core</Link>
                  </Button>
               </div>
             )}
          </CardContent>

          <CardFooter className="bg-secondary/20 p-6 flex flex-col items-center border-t border-white/5">
             <div className="flex items-center gap-2 opacity-40">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-muted-foreground">
                   FusionPay Institutional Standard v1.2
                </p>
             </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
