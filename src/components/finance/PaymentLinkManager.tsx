
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
  QrCode, 
  Share2,
  Clock,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, query, orderBy, limit, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      limit(10)
    );
  }, [firestore, user?.uid]);

  const { data: links, loading } = useCollection<any>(linksQuery);

  const handleCreateLink = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please specify a value greater than 0." });
      return;
    }

    setIsCreating(true);
    const seal = `PAY_SEAL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const linkData = {
      amount: parseFloat(amount),
      currency: 'USD',
      description: desc || "General Payment Request",
      status: 'ACTIVE',
      seal,
      createdAt: Date.now(),
    };

    try {
      if (firestore && user?.uid) {
        await addDoc(collection(firestore, 'users', user.uid, 'payment_links'), linkData);
        emitEvent('FINANCE', 'PAYMENT_LINK_GENERATED', 4, { seal, amount });
        
        toast({
          title: "Payment Link Generated",
          description: `Cryptographic seal ${seal} attached to mesh.`,
        });
        
        setAmount("");
        setDesc("");
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Kernel Rejection", description: "Failed to anchor link to infrastructure plane." });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (id: string, seal: string) => {
    const url = `https://sko-mesh.network/pay/${seal}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({ title: "Link Copied", description: "Payment URL saved to clipboard." });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (firestore && user?.uid) {
      await deleteDoc(doc(firestore, 'users', user.uid, 'payment_links', id));
      toast({ title: "Link Deactivated", description: "Access corridor has been severed." });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card className="glass-panel border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
              <Plus className="h-4 w-4 text-accent" />
              Generate Request
            </CardTitle>
            <CardDescription className="text-[10px]">Anchor a new payment request to the Sovereign Mesh.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Amount (USD)</Label>
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
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Note / Reference</Label>
              <Input 
                placeholder="e.g. Services rendered" 
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
              {isCreating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              Initialize Link
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 bg-white/5">
           <CardHeader className="p-4">
              <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Security Protocol</CardTitle>
           </CardHeader>
           <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex items-center gap-3 p-2 rounded bg-black/40 border border-white/5 text-[9px] text-white/60 italic">
                 <QrCode className="h-4 w-4 text-accent shrink-0" />
                 Each link is signed with AES-256 and subject to the Priority Resolver logic.
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="glass-panel border-white/5 h-full flex flex-col">
          <CardHeader className="border-b border-white/5">
            <div className="flex justify-between items-center">
               <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
                  <LinkIcon className="h-4 w-4 text-primary" />
                  Active Payment Corridors
               </CardTitle>
               <Badge variant="outline" className="text-[8px] border-white/10 opacity-50">SYNC_ACTIVE</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[450px]">
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
                            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                               <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white">${link.amount.toLocaleString()}</span>
                                  <Badge className="bg-green-500/20 text-green-400 text-[8px] uppercase">{link.status}</Badge>
                               </div>
                               <p className="text-[10px] text-muted-foreground line-clamp-1 italic">"{link.description}"</p>
                               <div className="flex items-center gap-2 text-[8px] font-mono text-muted-foreground/50">
                                  <Clock className="h-3 w-3" />
                                  {new Date(link.createdAt).toLocaleString()}
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-[9px] font-bold h-8 border border-white/5 bg-secondary/20"
                              onClick={() => copyToClipboard(link.id, link.seal)}
                            >
                               {copiedId === link.id ? <Check className="h-3.5 w-3.5 text-green-400 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                               Copy URL
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-400 hover:bg-red-400/10 hover:text-red-300"
                              onClick={() => handleDelete(link.id)}
                            >
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-60 opacity-20">
                    <Share2 className="h-12 w-12 mb-4" />
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em]">No Active Corridors Found</p>
                 </div>
               )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
