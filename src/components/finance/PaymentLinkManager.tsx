
"use client";

import { useState, useMemo } from "react";
import { 
  Link as LinkIcon, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Zap, 
  DollarSign, 
  Clock,
  RefreshCw,
  Loader2,
  PackageCheck,
  ExternalLink,
  ShoppingBag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, deleteDoc, doc, updateDoc, increment, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function PaymentLinkManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  const linksQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'payment_links'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  }, [firestore, user?.uid]);

  const { data: links, loading } = useCollection<any>(linksQuery);

  const handleCreateLink = () => {
    if (!amount || parseFloat(amount) <= 0 || !firestore || !user?.uid) {
      toast({ variant: "destructive", title: "Invalid Data", description: "সঠিক মূল্য এবং বিবরণ প্রদান করুন।" });
      return;
    }

    setIsCreating(true);
    // Generate a clean deterministic seal ID
    const seal = `PAY_SEAL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const linkData = {
      id: seal,
      creatorId: user.uid,
      creatorName: user.displayName || 'Sovereign Citizen',
      amount: parseFloat(amount),
      currency: 'USD',
      description: desc || "Marketplace Product",
      status: 'ACTIVE',
      seal: seal,
      createdAt: Date.now(),
    };

    // References
    const publicLinkRef = doc(firestore, 'payment_links', seal);
    const userLinkRef = doc(firestore, 'users', user.uid, 'payment_links', seal);

    // Atomic-like write simulation
    setDoc(publicLinkRef, linkData)
      .then(() => {
        return setDoc(userLinkRef, linkData);
      })
      .then(() => {
        emitEvent('FINANCE', 'MARKETPLACE_LINK_GENERATED', 4, { seal, amount });
        toast({
          title: "Payment Link Generated",
          description: "পেমেন্ট লিঙ্কটি পাবলিক রেজিস্ট্রিতে সক্রিয় করা হয়েছে।",
        });
        setAmount("");
        setDesc("");
      })
      .catch(async (error) => {
        const pErr = new FirestorePermissionError({
          path: publicLinkRef.path,
          operation: 'create',
          requestResourceData: linkData,
        });
        errorEmitter.emit('permission-error', pErr);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const copyToClipboard = (id: string, seal: string) => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;
    const url = `${origin}/checkout/${seal}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({ title: "Checkout URL Copied", description: "লিঙ্কটি কপি করা হয়েছে। আপনার কাস্টমারকে এটি পাঠান।" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateCustomerPayment = (link: any) => {
    if (!firestore || !user?.uid) return;
    setProcessingPayment(link.id);
    
    const linkRef = doc(firestore, 'users', user.uid, 'payment_links', link.id);
    const publicLinkRef = doc(firestore, 'payment_links', link.seal);
    const userRef = doc(firestore, 'users', user.uid);
    const notifRef = collection(firestore, 'users', user.uid, 'notifications');
    
    const updateData = { status: 'PAID', paidAt: Date.now() };
    
    updateDoc(linkRef, updateData).catch(() => {});
    updateDoc(publicLinkRef, updateData).catch(() => {});

    updateDoc(userRef, { balance: increment(link.amount) })
      .catch(async (error) => {
        const pErr = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: { balance: `increment(${link.amount})` },
        });
        errorEmitter.emit('permission-error', pErr);
      });

    const notification = {
      title: "Product Sold & Funds Settled",
      message: `"${link.description}" এর জন্য $${link.amount} পেমেন্ট পাওয়া গেছে। আপনার ব্যালেন্স আপডেট করা হয়েছে।`,
      type: 'DIRECTIVE',
      read: false,
      timestamp: Date.now(),
    };

    addDoc(notifRef, notification).catch(() => {});

    setTimeout(() => {
      emitEvent('FINANCE', 'PAYMENT_RECEIVED_MARKETPLACE', 2, { amount: link.amount, seal: link.seal });
      toast({
        title: "Payment Successful",
        description: `অভিনন্দন! আপনার পণ্যটি সফলভাবে বিক্রি হয়েছে।`,
      });
      setProcessingPayment(null);
    }, 1500);
  };

  const handleDelete = (id: string, seal: string) => {
    if (!firestore || !user?.uid) return;
    const linkRef = doc(firestore, 'users', user.uid, 'payment_links', id);
    const publicLinkRef = doc(firestore, 'payment_links', seal);
    
    deleteDoc(linkRef).catch(() => {});
    deleteDoc(publicLinkRef).catch(() => {});
    
    toast({ title: "Link Deactivated", description: "পেমেন্ট রুট বন্ধ করা হয়েছে।" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card className="glass-panel border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-accent">
              <ShoppingBag className="h-4 w-4" />
              Generate Checkout Link
            </CardTitle>
            <CardDescription className="text-[10px]">আপনার পণ্যের জন্য একটি স্থায়ী পেমেন্ট লিঙ্ক তৈরি করুন।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Product Price (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-10 bg-secondary/30 border-white/5 h-11 text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Product Name / Description</Label>
              <Input 
                placeholder="e.g. Digital Design Course" 
                className="bg-secondary/30 border-white/5 h-11 text-sm"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <Button 
              className="w-full h-11 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow"
              onClick={handleCreateLink}
              disabled={isCreating}
            >
              {isCreating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Generate Checkout Link
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="glass-panel border-white/5 h-full flex flex-col">
          <CardHeader className="border-b border-white/5">
            <div className="flex justify-between items-center">
               <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
                  <LinkIcon className="h-4 w-4 text-primary" />
                  Active Sales Corridors
               </CardTitle>
               <Badge variant="outline" className="text-[8px] border-white/10 opacity-50">GLOBAL_SYNC</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[500px]">
               {loading ? (
                 <div className="flex flex-col items-center justify-center h-40 opacity-30">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <p className="text-[10px] uppercase font-bold tracking-widest">Accessing Ledger...</p>
                 </div>
               ) : links && links.length > 0 ? (
                 <div className="divide-y divide-white/5">
                    {links.map((link: any) => (
                      <div key={link.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/5 transition-all">
                         <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors",
                              link.status === 'PAID' ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-primary/10 border-primary/20 text-primary"
                            )}>
                               {link.status === 'PAID' ? <PackageCheck className="h-6 w-6" /> : <ShoppingBag className="h-6 w-6" />}
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <span className="text-base font-bold text-white">${link.amount?.toLocaleString() || '0.00'}</span>
                                  <Badge className={cn(
                                    "text-[8px] uppercase font-bold",
                                    link.status === 'PAID' ? "bg-green-500 text-background" : "bg-accent text-background"
                                  )}>
                                    {link.status}
                                  </Badge>
                               </div>
                               <p className="text-xs text-white/90 font-medium">"{link.description}"</p>
                               <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground/50">
                                  <Clock className="h-3 w-3" />
                                  {new Date(link.createdAt).toLocaleString()}
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2">
                            {link.status === 'ACTIVE' ? (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-[9px] font-bold h-8 border-accent/30 text-accent hover:bg-accent/10"
                                  onClick={() => simulateCustomerPayment(link)}
                                  disabled={processingPayment === link.id}
                                >
                                   {processingPayment === link.id ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <ExternalLink className="h-3 w-3 mr-1.5" />}
                                   Test Payment
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-[9px] font-bold h-8 border border-white/5 bg-secondary/20"
                                  onClick={() => copyToClipboard(link.id, link.seal)}
                                >
                                   {copiedId === link.id ? <Check className="h-3.5 w-3.5 text-green-400 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                                   Copy URL
                                </Button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-bold text-green-400 uppercase">
                                <PackageCheck className="h-3 w-3" /> Settled
                              </div>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-400 hover:bg-red-400/10"
                              onClick={() => handleDelete(link.id, link.seal)}
                            >
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-60 opacity-20">
                    <ShoppingBag className="h-12 w-12 mb-4" />
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em]">No Marketplace Sales Yet</p>
                 </div>
               )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
