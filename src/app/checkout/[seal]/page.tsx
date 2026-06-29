
"use client";

import { useDoc, useFirestore } from "@/firebase";
import { doc, updateDoc, increment, collection, addDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
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
  Lock,
  DollarSign,
  CreditCard,
  Smartphone,
  Building2,
  Wallet
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/ui/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { seal } = useParams();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  // Read directly from the public registry for global availability
  const linkRef = useMemo(() => firestore ? doc(firestore, 'payment_links', seal as string) : null, [firestore, seal]);
  const { data: link, loading } = useDoc<any>(linkRef);

  const handlePay = async () => {
    if (!firestore || !link || link.status === 'PAID') return;

    setIsProcessing(true);
    try {
      const timestamp = Date.now();
      const updateData = { 
        status: 'PAID', 
        paidAt: timestamp,
        paymentMethod: selectedMethod 
      };

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
        message: `"${link.description}" এর জন্য $${link.amount} পেমেন্ট (${selectedMethod}) সম্পন্ন হয়েছে। পণ্যটি ডেলিভারির জন্য প্রস্তুত করুন।`,
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
        <Card className="w-full max-w-lg glass-panel border-white/10 shadow-2xl overflow-hidden animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent animate-pulse" />
          
          <CardHeader className="text-center pt-8 pb-4 space-y-2">
             <div className="mx-auto w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-2xl">
                <ShoppingBag className="h-6 w-6 text-accent" />
             </div>
             <div className="space-y-1">
                <CardTitle className="text-xl font-headline font-bold uppercase tracking-tight italic">
                  {isPaid ? "Settlement Complete" : "Checkout Hub"}
                </CardTitle>
                <CardDescription className="text-[9px] uppercase tracking-widest font-bold opacity-60">
                  {isPaid ? "Transaction Hash: " + seal : "Secure Payment Pipeline"}
                </CardDescription>
             </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8">
             {!isPaid ? (
               <>
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-2 text-center">
                   <p className="text-[9px] uppercase font-bold text-muted-foreground">Product Details</p>
                   <p className="text-lg font-bold text-white uppercase italic truncate">"{link.description}"</p>
                   <div className="flex items-center justify-center text-3xl font-headline font-bold text-accent">
                      <DollarSign className="h-5 w-5 -mr-1" />
                      {link.amount.toLocaleString()}
                   </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Select Payment Method</Label>
                  <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
                    <TabsList className="grid grid-cols-4 bg-secondary/50 border border-white/5 p-1 h-auto">
                      <TabsTrigger value="card" className="flex flex-col gap-1 py-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-[8px] uppercase">Card</span>
                      </TabsTrigger>
                      <TabsTrigger value="nagad" className="flex flex-col gap-1 py-2">
                        <Smartphone className="h-4 w-4 text-orange-400" />
                        <span className="text-[8px] uppercase">Nagad</span>
                      </TabsTrigger>
                      <TabsTrigger value="mesh" className="flex flex-col gap-1 py-2">
                        <Building2 className="h-4 w-4 text-accent" />
                        <span className="text-[8px] uppercase">Bank</span>
                      </TabsTrigger>
                      <TabsTrigger value="wallet" className="flex flex-col gap-1 py-2">
                        <Wallet className="h-4 w-4" />
                        <span className="text-[8px] uppercase">Other</span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-4 p-4 rounded-xl border border-white/5 bg-black/20 min-h-[140px] flex flex-col justify-center">
                      <TabsContent value="card" className="space-y-3 m-0">
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase font-bold opacity-60">Visa / Mastercard Number</Label>
                          <Input placeholder="XXXX XXXX XXXX XXXX" className="h-9 bg-secondary/30 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold opacity-60">Expiry</Label>
                            <Input placeholder="MM/YY" className="h-9 bg-secondary/30 text-sm" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold opacity-60">CVV</Label>
                            <Input placeholder="***" type="password" className="h-9 bg-secondary/30 text-sm" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="nagad" className="space-y-3 m-0">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-2">
                           <Smartphone className="h-5 w-5 text-orange-400" />
                           <p className="text-[10px] text-orange-200">Pay via Nagad Mobile Account</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase font-bold opacity-60">Nagad Number</Label>
                          <Input placeholder="017XXXXXXXX" className="h-9 bg-secondary/30 text-sm" />
                        </div>
                      </TabsContent>

                      <TabsContent value="mesh" className="space-y-3 m-0">
                        <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                          <p className="text-[10px] text-accent leading-relaxed italic">
                            "Pay directly using your Sovereign Mesh 12-digit account number."
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase font-bold opacity-60">Account Number</Label>
                          <Input placeholder="12-digit number" className="h-9 bg-secondary/30 text-sm" />
                        </div>
                      </TabsContent>

                      <TabsContent value="wallet" className="text-center py-4">
                        <p className="text-[10px] text-muted-foreground italic">More payment rails (Rocket, Upay) coming soon...</p>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                <div className="space-y-2 pt-2">
                   <div className="flex items-center justify-between text-[9px] font-bold uppercase">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span className="text-green-400">0.00 USD</span>
                   </div>
                   <Button 
                    className="w-full h-12 bg-accent text-background font-bold text-sm uppercase tracking-widest cyan-glow group"
                    onClick={handlePay}
                    disabled={isProcessing || link.status === 'PAID'}
                  >
                     {isProcessing ? (
                       <Loader2 className="h-5 w-5 animate-spin" />
                     ) : (
                       <>Confirm & Pay <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                     )}
                  </Button>
                </div>
               </>
             ) : (
               <div className="text-center py-6 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto animate-fade-in shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white uppercase italic">Funds Settled</h3>
                    <p className="text-xs text-muted-foreground italic max-w-xs mx-auto leading-relaxed">
                      আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। বিক্রেতাকে জানানো হয়েছে এবং পণ্যটি শীঘ্রই আনলক/ডেলিভারি করা হবে।
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[9px] space-y-1">
                     <p className="text-accent">&gt;&gt;&gt; STATUS: SETTLED</p>
                     <p className="text-white/80">&gt;&gt;&gt; METHOD: {selectedMethod.toUpperCase()}</p>
                     <p className="text-white/80">&gt;&gt;&gt; SEAL: {seal}</p>
                  </div>
                  <Button asChild className="w-full h-11 bg-white text-background font-bold uppercase text-[10px] tracking-widest">
                     <Link href="/">Launch Sovereign Mesh</Link>
                  </Button>
               </div>
             )}
          </CardContent>

          <CardFooter className="bg-secondary/20 border-t border-white/5 p-4 flex flex-col items-center gap-2">
             <div className="flex items-center gap-4 opacity-40">
                <ShieldCheck className="h-3.5 w-3.5" />
                <Zap className="h-3.5 w-3.5" />
                <Globe className="h-3.5 w-3.5" />
             </div>
             <p className="text-[7px] uppercase font-bold tracking-[0.4em] text-muted-foreground opacity-30">
                Sovereign Kernel Orchestration (S.K.O.)
             </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="relative z-10 py-6 text-center opacity-30">
         <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-tighter">
            © 2024 DETERMINISTIC_FINANCIAL_SURFACE_V1.2
         </p>
      </footer>
    </div>
  );
}
