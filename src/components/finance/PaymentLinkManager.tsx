
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
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Building2,
  Tag
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
import { Switch } from "@/components/ui/switch";

export function PaymentLinkManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
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
      toast({ variant: "destructive", title: "Invalid Data", description: "Provide price and offer name." });
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
      description: desc || "विशेष ऑफर (Special Offer)",
      status: 'ACTIVE',
      seal: seal,
      isVerified: isVerified,
      merchantBank: isVerified ? "Sandbox Bank (UK)" : null,
      createdAt: Date.now(),
    };

    const publicLinkRef = doc(firestore, 'payment_links', seal);
    const userLinkRef = doc(firestore, 'users', user.uid, 'payment_links', seal);

    setDoc(publicLinkRef, linkData)
      .then(() => {
        setDoc(userLinkRef, linkData)
          .then(() => {
            emitEvent('FINANCE', 'MARKETPLACE_LINK_GENERATED', 4, { seal, amount });
            toast({ title: "Live Offer Active", description: "हिंदी ऑफर सफलतापूर्वक जनरेट हो गया है।" });
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
      toast({ title: "Link Copied", description: "लिंक कॉपी हो गया है।" });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = (id: string, seal: string) => {
    if (!firestore || !user?.uid) return;
    deleteDoc(doc(firestore, 'users', user.uid, 'payment_links', id));
    deleteDoc(doc(firestore, 'payment_links', seal));
    toast({ title: "Offer Removed", description: "ऑफर हटा दिया गया है।" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-accent">
              <Tag className="h-4 w-4" />
              नया ऑफर बनाएँ (New Offer)
            </CardTitle>
            <CardDescription className="text-[10px] italic">हिंदी ऑफर्स और पेमेंट लिंक्स</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">कीमत (Price USD)</Label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="bg-secondary/30 border-white/5 h-11 text-sm font-headline"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">ऑफर का नाम (Offer Details)</Label>
                <Input 
                  placeholder="जैसे: दिवाली धमाका ऑफर" 
                  className="bg-secondary/30 border-white/5 h-11 text-sm"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase flex items-center gap-2">
                       <ShieldCheck className="h-3 w-3 text-accent" /> Verify with Bank
                    </p>
                    <p className="text-[8px] text-muted-foreground italic">प्रमाणित विक्रेता (Verified Seller)</p>
                 </div>
                 <Switch checked={isVerified} onCheckedChange={setIsVerified} />
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow"
              onClick={handleCreateLink}
              disabled={isCreating}
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              ऑफर पब्लिश करें
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="glass-panel border-white/5 h-full flex flex-col shadow-2xl">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-primary" />
              सक्रिय ऑफर्स (Active Offers)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[450px]">
               {loading ? (
                 <div className="flex flex-col items-center justify-center h-40 opacity-30">
                    <Loader2 className="h-6 w-6 animate-spin" />
                 </div>
               ) : (links && links.length > 0) ? (
                 <div className="divide-y divide-white/5">
                    {links.map((link: any) => (
                      <div key={link.id} className="p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-all group">
                         <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                              link.status === 'PAID' ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-primary/10 border-primary/20 text-primary"
                            )}>
                               <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <p className="text-base font-bold text-white">${link.amount}</p>
                                  {link.isVerified && (
                                     <Badge className="bg-accent/10 text-accent text-[7px] border-accent/20 uppercase h-4">Verified</Badge>
                                  )}
                               </div>
                               <p className="text-xs text-muted-foreground truncate max-w-[250px] italic">{link.description}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            {link.status === 'ACTIVE' ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 text-[10px] uppercase font-bold text-accent border-accent/20 hover:bg-accent/10"
                                onClick={() => copyToClipboard(link.id, link.seal)}
                              >
                                 {copiedId === link.id ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                                 लिंक कॉपी करें
                              </Button>
                            ) : (
                               <Badge className="bg-green-500/20 text-green-400 text-[9px] uppercase px-4 py-1.5 font-bold">Paid & Synced</Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 text-red-400 opacity-20 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDelete(link.id, link.seal)}
                            >
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-60 flex flex-col items-center justify-center text-[10px] uppercase font-bold text-muted-foreground opacity-20 space-y-4">
                    <Tag className="h-12 w-12" />
                    <p>कोई सक्रिय ऑफर नहीं है।</p>
                 </div>
               )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
