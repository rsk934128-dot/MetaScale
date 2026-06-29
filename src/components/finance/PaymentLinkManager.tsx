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
  ShoppingBag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, deleteDoc, doc, setDoc } from "firebase/firestore";
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

    const publicLinkRef = doc(firestore, 'payment_links', seal);
    const userLinkRef = doc(firestore, 'users', user.uid, 'payment_links', seal);

    // Faster sequential writes without unnecessary blocking
    setDoc(publicLinkRef, linkData)
      .then(() => {
        setDoc(userLinkRef, linkData)
          .then(() => {
            emitEvent('FINANCE', 'MARKETPLACE_LINK_GENERATED', 4, { seal, amount });
            toast({ title: "Link Activated", description: "পেমেন্ট লিঙ্কটি এখন গ্লোবাল রেজিস্ট্রিতে লাইভ।" });
            setAmount("");
            setDesc("");
          })
          .catch((err) => {
             errorEmitter.emit('permission-error', new FirestorePermissionError({
               path: userLinkRef.path,
               operation: 'create',
               requestResourceData: linkData
             }));
          });
      })
      .catch((err) => {
         errorEmitter.emit('permission-error', new FirestorePermissionError({
           path: publicLinkRef.path,
           operation: 'create',
           requestResourceData: linkData
         }));
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const copyToClipboard = (id: string, seal: string) => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/checkout/${seal}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      toast({ title: "URL Copied", description: "চেকআউট লিঙ্কটি কপি করা হয়েছে।" });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = (id: string, seal: string) => {
    if (!firestore || !user?.uid) return;
    deleteDoc(doc(firestore, 'users', user.uid, 'payment_links', id));
    deleteDoc(doc(firestore, 'payment_links', seal));
    toast({ title: "Link Deactivated", description: "করিডোরটি সফলভাবে বন্ধ করা হয়েছে।" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card className="glass-panel border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-accent">
              <ShoppingBag className="h-4 w-4" />
              Quick Generate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Price (USD)</Label>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="bg-secondary/30 border-white/5 h-11 text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Product Name</Label>
              <Input 
                placeholder="e.g. Digital Asset" 
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
              {isCreating ? "Deploying..." : "Generate Link"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="glass-panel border-white/5 h-full flex flex-col">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
              <LinkIcon className="h-4 w-4 text-primary" />
              Marketplace Routes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[400px]">
               {loading ? (
                 <div className="flex flex-col items-center justify-center h-40 opacity-30">
                    <Loader2 className="h-6 w-6 animate-spin" />
                 </div>
               ) : links && links.length > 0 ? (
                 <div className="divide-y divide-white/5">
                    {links.map((link: any) => (
                      <div key={link.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-all">
                         <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-lg border flex items-center justify-center shrink-0",
                              link.status === 'PAID' ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-primary/10 border-primary/20 text-primary"
                            )}>
                               <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-sm font-bold text-white">${link.amount}</p>
                               <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{link.description}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            {link.status === 'ACTIVE' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-[9px] uppercase font-bold"
                                onClick={() => copyToClipboard(link.id, link.seal)}
                              >
                                 {copiedId === link.id ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                 Copy
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-400"
                              onClick={() => handleDelete(link.id, link.seal)}
                            >
                               <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-40 flex items-center justify-center text-[10px] uppercase font-bold text-muted-foreground opacity-20">
                    No active routes.
                 </div>
               )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
