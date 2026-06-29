
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
  DollarSign,
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
  const sealId = params?.seal as string;
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  // Read directly from the public registry for global availability
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

      // 1. Update public link status
      await updateDoc(doc(firestore, 'payment_links', sealId), updateData);

      // 2. Update seller's private link status
      const userLinkRef = doc(firestore, 'users', link.creatorId, 'payment_links', sealId);
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

  // Improved loading state to prevent "Invalid Route" flashing
  if (loading || !sealId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-accent relative z-10" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-headline font-bold uppercase tracking-[0.3em] text-accent">Synchronizing Mesh</p>
          <p className="text-[10px] text-muted-foreground uppercase">Accessing Universal Ledger...</p>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-8">
        <div className="w-24 h-24 rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center animate-fade-in">
          <Zap className="h-10 w-10 text-red-500/50" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-headline font-bold uppercase text-white tracking-tighter">Corridor Not Found</h1>
          <p className="text-xs text-muted-foreground italic max-w-xs mx-auto leading-relaxed">
            এই পেমেন্ট করিডোরটি পাওয়া যায়নি। এটি ডিলিট বা ডিঅ্যাক্টিভেট করা হতে পারে অথবা সীল আইডিটি সঠিক নয়।
          </p>
        </div>
        <Button asChild variant="outline" className="border-white/10 uppercase text-[10px] font-bold px-8 h-11 hover:bg-white/5 transition-all">
           <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" /> Return to Mesh</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col selection:bg-accent selection:text-background">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 w-full px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-headline font-bold text-xl uppercase italic text-white tracking-tighter">Sovereign Mesh</span>
        </div>
        <Badge variant="outline" className="border-accent/20 text-accent text-[10px] font-mono px-3 py-1">
          SECURE_GATEWAY_v1.2
        </Badge>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-lg glass-panel border-white/10 shadow-2xl overflow-hidden animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent animate-pulse" />
          
          <CardHeader className="text-center pt-10 pb-6 space-y-4">
             <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-2xl relative">
                <div className="absolute inset-0 bg-accent/20 blur-lg rounded-full animate-pulse" />
                <ShoppingBag className="h-8 w-8 text-accent relative z-10" />
             </div>
             <div className="space-y-1">
                <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tight italic">
                  {isPaid ? "Settlement Complete" : "Secure Checkout"}
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
                  {isPaid ? "Transaction Hash: " + sealId : "Deterministic Payment Corridor"}
                </CardDescription>
             </div>
          </CardHeader>

          <CardContent className="space-y-8 px-8 md:px-10">
             {!isPaid ? (
               <>
                <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 space-y-3 text-center group hover:bg-secondary/40 transition-colors">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Order Summary</p>
                   <p className="text-xl font-bold text-white uppercase italic truncate">"{link.description}"</p>
                   <div className="flex items-center justify-center text-4xl font-headline font-bold text-accent">
                      <span className="text-xl -mt-4 mr-1">$</span>
                      {link.amount?.toLocaleString() || '0.00'}
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Settlement Rail</Label>
                    <Badge variant="ghost" className="text-[8px] font-mono opacity-50 uppercase">AES-256_GCM</Badge>
                  </div>
                  <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
                    <TabsList className="grid grid-cols-4 bg-secondary/50 border border-white/5 p-1 h-auto">
                      <TabsTrigger value="card" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-background transition-all">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-[8px] uppercase font-bold">Card</span>
                      </TabsTrigger>
                      <TabsTrigger value="nagad" className="flex flex-col gap-1 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all">
                        <Smartphone className="h-4 w-4" />
                        <span className="text-[8px] uppercase font-bold">Nagad</span>
                      </TabsTrigger>
                      <TabsTrigger value="mesh" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                        <Building2 className="h-4 w-4" />
                        <span className="text-[8px] uppercase font-bold">Mesh</span>
                      </TabsTrigger>
                      <TabsTrigger value="wallet" className="flex flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:text-black transition-all">
                        <Wallet className="h-4 w-4" />
                        <span className="text-[8px] uppercase font-bold">Other</span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-4 p-5 rounded-2xl border border-white/5 bg-black/20 min-h-[160px] flex flex-col justify-center animate-fade-in">
                      <TabsContent value="card" className="space-y-4 m-0">
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase font-bold opacity-60">Card Information</Label>
                          <Input placeholder="XXXX XXXX XXXX XXXX" className="h-10 bg-secondary/30 text-sm border-white/5 focus:border-accent/50 transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold opacity-60">Expiry</Label>
                            <Input placeholder="MM/YY" className="h-10 bg-secondary/30 text-sm border-white/5 focus:border-accent/50 transition-all" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold opacity-60">CVC</Label>
                            <Input placeholder="***" type="password" className="h-10 bg-secondary/30 text-sm border-white/5 focus:border-accent/50 transition-all" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="nagad" className="space-y-4 m-0">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-1">
                           <Smartphone className="h-5 w-5 text-orange-400" />
                           <p className="text-[10px] text-orange-200 font-medium">Pay via Nagad Mobile Account</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase font-bold opacity-60">Mobile Number</Label>
                          <Input placeholder="017XXXXXXXX" className="h-10 bg-secondary/30 text-sm border-white/5 focus:border-orange-500/50 transition-all" />
                        </div>
                      </TabsContent>

                      <TabsContent value="mesh" className="space-y-4 m-0">
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                          <p className="text-[10px] text-primary leading-relaxed italic font-medium">
                            "Pay directly using your 12-digit Sovereign Mesh account number for instant settlement."
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase font-bold opacity-60">Account Number</Label>
                          <Input placeholder="12-digit number" className="h-10 bg-secondary/30 text-sm border-white/5 focus:border-primary/50 transition-all" />
                        </div>
                      </TabsContent>

                      <TabsContent value="wallet" className="text-center py-6">
                        <p className="text-[11px] text-muted-foreground italic font-medium">More payment rails (Rocket, Upay, Priyo Pay) coming soon...</p>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                <div className="space-y-3 pt-2">
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase px-1">
                      <span className="text-muted-foreground">Network Protocol Fee</span>
                      <span className="text-green-400">FREE</span>
                   </div>
                   <Button 
                    className="w-full h-14 bg-accent text-background font-bold text-sm uppercase tracking-[0.2em] cyan-glow group transition-all hover:scale-[1.02] active:scale-95"
                    onClick={handlePay}
                    disabled={isProcessing || link.status === 'PAID'}
                  >
                     {isProcessing ? (
                       <Loader2 className="h-5 w-5 animate-spin" />
                     ) : (
                       <>Authorize Settlement <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                     )}
                  </Button>
                </div>
               </>
             ) : (
               <div className="text-center py-8 space-y-8 animate-fade-in">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
                    <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)] relative z-10">
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-headline font-bold text-white uppercase italic tracking-tighter">Funds Settled</h3>
                    <p className="text-xs text-muted-foreground italic max-w-xs mx-auto leading-relaxed font-medium">
                      আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। বিক্রেতাকে ডিরেক্টিভ পাঠানো হয়েছে এবং পণ্যটি শীঘ্রই আনলক/ডেলিভারি করা হবে।
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-[10px] space-y-2 text-left">
                     <p className="text-accent flex justify-between"><span>&gt; STATUS:</span> <span>SETTLED_OK</span></p>
                     <p className="text-white/80 flex justify-between"><span>&gt; METHOD:</span> <span>{selectedMethod.toUpperCase()}</span></p>
                     <p className="text-white/60 flex justify-between gap-4"><span>&gt; SEAL:</span> <span className="truncate">{sealId}</span></p>
                  </div>
                  <Button asChild className="w-full h-12 bg-white text-background font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-accent hover:text-background transition-all">
                     <Link href="/">Launch Sovereign Control Plane</Link>
                  </Button>
               </div>
             )}
          </CardContent>

          <CardFooter className="bg-secondary/20 border-t border-white/5 p-6 flex flex-col items-center gap-3">
             <div className="flex items-center gap-6 opacity-40">
                <ShieldCheck className="h-4 w-4" />
                <Zap className="h-4 w-4" />
                <Globe className="h-4 w-4" />
             </div>
             <p className="text-[8px] uppercase font-bold tracking-[0.5em] text-muted-foreground opacity-30 text-center">
                Sovereign Kernel Orchestration (S.K.O.) • Global Anycast Mesh
             </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="relative z-10 py-8 text-center opacity-30">
         <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-tighter">
            © 2024 DETERMINISTIC_FINANCIAL_SURFACE_V1.2_STABLE
         </p>
      </footer>
    </div>
  );
}
