
"use client";

import { useDoc, useFirestore } from "@/firebase";
import { doc, updateDoc, increment, collection, addDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  ChevronLeft,
  ArrowRight,
  Globe,
  Lock,
  DollarSign
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function CheckoutPage() {
  const { seal } = useParams();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Read directly from the public registry for global availability
  const linkRef = useMemo(() => firestore ? doc(firestore, 'payment_links', seal as string) : null, [firestore, seal]);
  const { data: link, loading } = useDoc<any>(linkRef);

  const handlePay = async () => {
    if (!firestore || !link || link.status === 'PAID') return;

    setIsProcessing(true);
    try {
      const timestamp = Date.now();
      const updateData = { status: 'PAID', paidAt: timestamp };

      // 1. Update public link status
      await updateDoc(linkRef!, updateData);

      // 2. Update seller's private link status
      const userLinkRef = doc(firestore, 'users', link.creatorId, 'payment_links', link.id);
      await updateDoc(userLinkRef, updateData);

      // 3. Increment seller's balance
      const sellerRef = doc(firestore, 'users', link.creatorId);
      await updateDoc(sellerRef, { balance: increment(link.amount) });

      // 4. Send directive notification to seller for delivery
      const notifRef = collection(firestore, 'users', link.creatorId, 'notifications');
      await addDoc(notifRef, {
        title: "Product Sold",
        message: `"${link.description}" এর জন্য $${link.amount} পেমেন্ট সম্পন্ন হয়েছে। পণ্যটি ডেলিভারির জন্য প্রস্তুত করুন।`,
        type: 'DIRECTIVE',
        read: false,
        timestamp: timestamp
      });

      setIsPaid(true);
      toast({
        title: "Payment Successful",
        description: "ট্রানজ্যাকশন সফলভাবে সম্পন্ন হয়েছে। বিক্রেতাকে জানানো হয়েছে।",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "পেমেন্ট সম্পন্ন করা সম্ভব হয়নি। কার্নেল কানেকশন চেক করুন।",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-xs font-headline font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Ledger...</p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
          <Lock className="h-10 w-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-headline font-bold uppercase">Invalid Route</h1>
          <p className="text-sm text-muted-foreground italic max-w-xs">এই পেমেন্ট করিডোরটি পাওয়া যায়নি। এটি ডিলিট বা ডিঅ্যাক্টিভেট করা হতে পারে।</p>
        </div>
        <Button asChild variant="outline" className="border-white/10 uppercase text-[10px] font-bold">
           <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" /> Return to Mesh</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 w-full px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-headline font-bold text-xl uppercase italic text-white tracking-tighter">Sovereign OS</span>
        </div>
        <Badge variant="outline" className="border-accent/20 text-accent text-[10px] font-mono">
          SECURE_GATEWAY_v1.2
        </Badge>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md glass-panel border-white/10 shadow-2xl overflow-hidden animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent animate-pulse" />
          
          <CardHeader className="text-center pt-10 pb-6 space-y-4">
             <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-2xl">
                <ShoppingBag className="h-8 w-8 text-accent" />
             </div>
             <div className="space-y-1">
                <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tight italic">
                  {isPaid ? "Settlement Complete" : "Sovereign Checkout"}
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                  {isPaid ? "Transaction Hash: " + seal : "Deterministic Payment Corridor"}
                </CardDescription>
             </div>
          </CardHeader>

          <CardContent className="space-y-8 px-8">
             {!isPaid ? (
               <>
                <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 space-y-4 text-center">
                   <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Product/Service</p>
                      <p className="text-xl font-bold text-white uppercase italic">"{link.description}"</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount Due</p>
                      <div className="flex items-center justify-center text-4xl font-headline font-bold text-accent">
                         <DollarSign className="h-6 w-6 -mr-1" />
                         {link.amount.toLocaleString()}
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                      <span className="text-muted-foreground">Merchant</span>
                      <span className="text-white">{link.creatorName}</span>
                   </div>
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                      <span className="text-muted-foreground">Protocol</span>
                      <span className="text-white">DPE-LINK v1.2</span>
                   </div>
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span className="text-green-400">0.00 USD</span>
                   </div>
                </div>

                <Button 
                  className="w-full h-14 bg-accent text-background font-bold text-base uppercase tracking-widest cyan-glow group"
                  onClick={handlePay}
                  disabled={isProcessing || link.status === 'PAID'}
                >
                   {isProcessing ? (
                     <Loader2 className="h-5 w-5 animate-spin" />
                   ) : (
                     <>Authorize Settlement <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></>
                   )}
                </Button>
               </>
             ) : (
               <div className="text-center py-10 space-y-6">
                  <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto animate-fade-in shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase italic">Funds Received</h3>
                    <p className="text-xs text-muted-foreground italic max-w-xs mx-auto leading-relaxed">
                      আপনার পেমেন্ট সফলভাবে বিক্রেতার অ্যাকাউন্টে জমা হয়েছে। বিক্রেতা পণ্য ডেলিভারির জন্য প্রস্তুত হচ্ছেন।
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] space-y-1">
                     <p className="text-accent">&gt;&gt;&gt; STATUS: SETTLED</p>
                     <p className="text-white/80">&gt;&gt;&gt; SEAL: {seal}</p>
                     <p className="text-white/80">&gt;&gt;&gt; CONFIRMATIONS: DETERMINISTIC_OK</p>
                  </div>
                  <Button asChild className="w-full h-12 bg-white text-background font-bold uppercase text-[10px] tracking-widest">
                     <Link href="/">Launch Sovereign Mesh</Link>
                  </Button>
               </div>
             )}
          </CardContent>

          <CardFooter className="bg-secondary/20 border-t border-white/5 p-6 flex flex-col items-center gap-3">
             <div className="flex items-center gap-4">
                <ShieldCheck className="h-4 w-4 text-accent/50" />
                <Zap className="h-4 w-4 text-accent/50" />
                <Globe className="h-4 w-4 text-accent/50" />
             </div>
             <p className="text-[8px] uppercase font-bold tracking-[0.4em] text-muted-foreground opacity-40">
                Sovereign Kernel Orchestration (S.K.O.)
             </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="relative z-10 py-10 text-center opacity-30">
         <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
            © 2024 DETERMINISTIC_FINANCIAL_SURFACE_V1.2
         </p>
      </footer>
    </div>
  );
}
