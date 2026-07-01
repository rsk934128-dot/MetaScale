
"use client";

import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
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
  Building,
  Target,
  Globe,
  Lock,
  Heart
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/ui/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { reconcileAndSettleLink, processPaymentCredit } from "@/services/payment-service";

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
      const externalTxnId = `SIM_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // 1. Call the Central Settlement Controller
      const reconResult = await reconcileAndSettleLink(
        firestore,
        sealId,
        'SIMULATION_RAIL',
        externalTxnId
      );

      if (reconResult.status === 'READY_FOR_CREDIT') {
        // 2. Execute finality credit
        await processPaymentCredit(
          firestore, 
          reconResult.normalizedEvent!, 
          'WEBHOOK'
        );
        
        setIsPaid(true);
        toast({ 
          title: "Deterministic Finality Established", 
          description: "সেটেলমেন্ট কন্ট্রোলার সফলভাবে ব্যালেন্স আপডেট করেছে (T+0)।",
        });
      }
    } catch (error: any) {
      console.error("Settlement Error:", error);
      toast({ 
        variant: "destructive", 
        title: "Reconciliation Failed", 
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
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

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
        <Card className="w-full max-w-2xl glass-panel border-white/10 shadow-2xl overflow-hidden relative animate-fade-in">
          {!isPaid ? (
            <div className="flex flex-col">
               {/* Mission Banner */}
               <div className="bg-accent/10 border-b border-white/10 p-6 md:p-10 text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-[9px] font-bold uppercase tracking-widest">
                     <Target className="h-3.5 w-3.5" /> Our Mission (আমাদের লক্ষ্য)
                  </div>
                  <h1 className="text-2xl md:text-3xl font-headline font-bold text-white tracking-tighter uppercase italic leading-none">
                     {link?.mission || "Sovereign Settlement & Fiscal Inclusion"}
                  </h1>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto italic">
                     "আমরা একটি বৈশ্বিক পেমেন্ট ইকোসিস্টেম তৈরি করছি যা স্থানীয় এবং আন্তর্জাতিক লেনদেনকে নিরাপদ ও স্বয়ংক্রিয় করে।"
                  </p>
               </div>

               <CardContent className="p-8 md:p-12 space-y-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-3xl bg-secondary/30 border border-white/10 relative overflow-hidden">
                    {link?.isVerified && (
                      <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl bg-accent text-background text-[9px] font-bold uppercase flex items-center gap-1 shadow-xl">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </div>
                    )}
                    <div className="space-y-1 text-center md:text-left">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Payable to: {link?.brand}</p>
                       <h2 className="text-xl font-bold text-white uppercase">{link?.description}</h2>
                       {link?.isVerified && (
                         <p className="text-[9px] text-accent mt-2 uppercase tracking-tighter flex items-center justify-center md:justify-start gap-1">
                           <Building className="h-3 w-3" /> {link.merchantBank}
                         </p>
                       )}
                    </div>
                    <div className="text-center md:text-right">
                       <div className="flex items-baseline justify-center md:justify-end gap-1">
                          <span className="text-2xl font-bold text-accent">{link?.currency === 'BDT' ? '৳' : '$'}</span>
                          <p className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tighter">{link?.amount}</p>
                       </div>
                       <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Total Finality</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex justify-between items-center">
                       <span>Select Payment Rail</span>
                       <span className="text-accent font-mono">SECURE_HANDSHAKE_READY</span>
                    </Label>
                    <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
                      <TabsList className="grid grid-cols-4 bg-secondary/50 p-1 h-12">
                        <TabsTrigger value="card" className="text-[9px] uppercase font-bold">Card</TabsTrigger>
                        <TabsTrigger value="stripe" className="text-[9px] uppercase font-bold">Stripe</TabsTrigger>
                        <TabsTrigger value="nagad" className="text-[9px] uppercase font-bold">Nagad</TabsTrigger>
                        <TabsTrigger value="mesh" className="text-[9px] uppercase font-bold">Mesh</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <Button 
                    className="w-full h-16 bg-accent text-background font-bold text-sm uppercase rounded-2xl cyan-glow transition-all hover:scale-[1.02]"
                    onClick={handlePay}
                    disabled={isProcessing || link?.status === 'PAID'}
                  >
                    {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                      <span className="flex items-center gap-2">
                        Authorize Transaction <ArrowRight className="h-5 w-5" />
                      </span>
                    )}
                  </Button>

                  <div className="grid grid-cols-3 gap-4">
                     <div className="flex flex-col items-center gap-1.5 opacity-40">
                        <Globe className="h-4 w-4" />
                        <span className="text-[8px] uppercase font-bold">Anycast</span>
                     </div>
                     <div className="flex flex-col items-center gap-1.5 opacity-40">
                        <Lock className="h-4 w-4" />
                        <span className="text-[8px] uppercase font-bold">AES-256</span>
                     </div>
                     <div className="flex flex-col items-center gap-1.5 opacity-40">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[8px] uppercase font-bold">Sovereign</span>
                     </div>
                  </div>
               </CardContent>
            </div>
          ) : (
            <div className="text-center py-20 px-8 space-y-8 animate-fade-in">
               <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto">
                 <Check className="h-12 w-12 text-green-500" strokeWidth={3} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter">Settlement Finalized</h3>
                 <p className="text-sm text-muted-foreground max-w-xs mx-auto italic">
                   আপনার পেমেন্ট সফলভাবে প্রসেস হয়েছে এবং আপনার ব্যালেন্সে রিফ্লেক্ট করছে। ধন্যবাদ আমাদের লক্ষ্যের সাথে থাকার জন্য।
                 </p>
               </div>
               <div className="flex flex-col gap-3">
                 <Button asChild className="w-full h-12 bg-white text-background font-bold uppercase text-[10px]">
                    <Link href="/">Return to Sovereign Hub</Link>
                 </Button>
                 <p className="text-[9px] text-muted-foreground uppercase font-bold">Transaction Hash: 0x4f82...e911</p>
               </div>
            </div>
          )}

          <CardFooter className="bg-secondary/20 p-6 flex flex-col items-center border-t border-white/5">
             <div className="flex items-center gap-2 opacity-50">
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-muted-foreground">
                   Powered by Sovereign Kernel v1.2
                </p>
             </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
