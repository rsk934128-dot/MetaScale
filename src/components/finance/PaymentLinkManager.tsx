
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
  Settings2,
  Globe,
  ShieldCheck,
  Building2,
  Tag,
  ArrowRight,
  Layers,
  Braces,
  Terminal,
  ChevronRight,
  Loader2,
  ShoppingBag,
  ExternalLink,
  Code2,
  Target,
  MoreVertical
} from "lucide-center";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, deleteDoc, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendFinancialAlert } from "@/lib/telegram";

export function PaymentLinkManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  
  // UI State
  const [activeTab, setActiveTab] = useState("config");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    mission: "",
    currency: "BDT",
    brand: "FusionPay",
    webhookUrl: "https://api.example.com/webhook",
    successUrl: "",
    isSingleUse: false,
    isVerified: true,
    requireCustomerEmail: true,
  });

  const linksQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'payment_links'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  }, [firestore, user?.uid]);

  const { data: links, loading } = useCollection<any>(linksQuery);

  const handleCreateLink = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0 || !firestore || !user?.uid) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please enter a valid amount and details." });
      return;
    }

    setIsCreating(true);
    const seal = `PAY_SEAL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const linkUrl = `${window.location.origin}/checkout/${seal}`;
    
    const linkData = {
      id: seal,
      creatorId: user.uid,
      creatorName: user.displayName || 'Sovereign Citizen',
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description || "General Payment",
      mission: formData.mission || "Sovereign Settlement & Fiscal Inclusion",
      brand: formData.brand,
      status: 'ACTIVE',
      seal: seal,
      webhookUrl: formData.webhookUrl,
      isSingleUse: formData.isSingleUse,
      isVerified: formData.isVerified,
      merchantBank: formData.isVerified ? "Sandbox Bank (UK)" : null,
      createdAt: Date.now(),
      serverTimestamp: serverTimestamp(),
      metadata: {
        requireEmail: formData.requireCustomerEmail,
        gateway: 'SOVEREIGN_V1'
      }
    };

    try {
      const publicLinkRef = doc(firestore, 'payment_links', seal);
      const userLinkRef = doc(firestore, 'users', user.uid, 'payment_links', seal);

      await setDoc(publicLinkRef, linkData);
      await setDoc(userLinkRef, linkData);

      emitEvent('FINANCE', 'MARKETPLACE_LINK_GENERATED', 2, { 
        seal, 
        amount: formData.amount,
        brand: formData.brand 
      });

      // Notify Telegram
      const userSnap = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userSnap.data();
      if (userData?.telegramLinked && userData?.telegramChatId) {
        await sendFinancialAlert(userData.telegramChatId, 'LINK_CREATED', {
          ...linkData,
          url: linkUrl
        });
      }

      toast({ title: "Handshake Successful", description: "আপনার পেমেন্ট লিংক জেনারেট হয়েছে এবং টেলিগ্রামে পাঠানো হয়েছে।" });
      setFormData({ ...formData, amount: "", description: "", mission: "" });
      setActiveTab("config");
    } catch (err) {
      toast({ variant: "destructive", title: "Kernel Error", description: "Authorization failed." });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (id: string, seal: string) => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/checkout/${seal}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      toast({ title: "Signal Copied", description: "Payment link copied to buffer." });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async (id: string, seal: string) => {
    if (!firestore || !user?.uid) return;
    try {
      await deleteDoc(doc(firestore, 'users', user.uid, 'payment_links', id));
      await deleteDoc(doc(firestore, 'payment_links', seal));
      toast({ title: "Link Revoked", description: "Payment tunnel isolated and destroyed." });
    } catch (err) {
      toast({ variant: "destructive", title: "Action Blocked" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Creation Interface */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="glass-panel border-accent/20 bg-accent/5 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent animate-pulse" />
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-widest text-accent italic">
              <Zap className="h-5 w-5 text-accent" />
              Link Architect
            </CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
              Deterministic Payment Tunnel v1.2
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/30 rounded-none border-y border-white/5 h-12">
              <TabsTrigger value="config" className="text-[9px] uppercase font-bold">1. Config</TabsTrigger>
              <TabsTrigger value="integration" className="text-[9px] uppercase font-bold">2. Integration</TabsTrigger>
              <TabsTrigger value="execution" className="text-[9px] uppercase font-bold">3. Execute</TabsTrigger>
            </TabsList>

            <CardContent className="p-6 space-y-6">
              <TabsContent value="config" className="space-y-4 m-0 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Brand</Label>
                      <Select value={formData.brand} onValueChange={(v) => setFormData({...formData, brand: v})}>
                        <SelectTrigger className="bg-secondary/30 border-white/5 h-10 text-xs">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-panel border-white/10">
                           <SelectItem value="FusionPay">FusionPay Core</SelectItem>
                           <SelectItem value="RubelBank">RubelBank Node</SelectItem>
                           <SelectItem value="Sovereign">Sovereign OS</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Currency</Label>
                      <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                        <SelectTrigger className="bg-secondary/30 border-white/5 h-10 text-xs">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-panel border-white/10">
                           <SelectItem value="BDT">BDT (৳)</SelectItem>
                           <SelectItem value="USD">USD ($)</SelectItem>
                           <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground">Settlement Amount</Label>
                   <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        className="bg-secondary/30 border-white/5 h-12 pl-10 text-lg font-headline font-bold"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground">Offer/Product Name</Label>
                   <Input 
                     placeholder="e.g. Premium Business License" 
                     className="bg-secondary/30 border-white/5 h-11 text-sm italic"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                     <Target className="h-3 w-3 text-accent" /> Mission/Goal (আমাদের লক্ষ্য)
                   </Label>
                   <Input 
                     placeholder="e.g. Empowerment through deterministic finance" 
                     className="bg-secondary/30 border-white/5 h-11 text-sm italic"
                     value={formData.mission}
                     onChange={(e) => setFormData({...formData, mission: e.target.value})}
                   />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                   <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-white uppercase flex items-center gap-2">
                         <ShieldCheck className="h-3 w-3 text-accent" /> Institutional Verify
                      </p>
                      <p className="text-[8px] text-muted-foreground italic">Verified via Mesh</p>
                   </div>
                   <Switch checked={formData.isVerified} onCheckedChange={(v) => setFormData({...formData, isVerified: v})} />
                </div>
                
                <Button variant="ghost" className="w-full text-accent font-bold text-[9px] uppercase tracking-widest h-8" onClick={() => setActiveTab("integration")}>
                   Next Step <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </TabsContent>

              <TabsContent value="integration" className="space-y-4 m-0 animate-fade-in">
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Braces className="h-3 w-3 text-primary" /> Webhook Endpoint
                   </Label>
                   <Input 
                     placeholder="https://api.yourdomain.com/webhook" 
                     className="bg-secondary/30 border-white/5 h-11 text-xs font-mono text-primary/80"
                     value={formData.webhookUrl}
                     onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                   />
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-white/5">
                      <Label className="text-[10px] font-bold uppercase">Single-Use Link</Label>
                      <Switch checked={formData.isSingleUse} onCheckedChange={(v) => setFormData({...formData, isSingleUse: v})} />
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-white/5">
                      <Label className="text-[10px] font-bold uppercase">Require Email</Label>
                      <Switch checked={formData.requireCustomerEmail} onCheckedChange={(v) => setFormData({...formData, requireCustomerEmail: v})} />
                   </div>
                </div>

                <Button variant="ghost" className="w-full text-accent font-bold text-[9px] uppercase tracking-widest h-8" onClick={() => setActiveTab("execution")}>
                   Final Summary <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </TabsContent>

              <TabsContent value="execution" className="space-y-6 m-0 animate-fade-in">
                <div className="p-4 rounded-2xl bg-black/60 border border-accent/20 space-y-4 shadow-inner">
                   <div className="flex justify-between items-end border-b border-white/5 pb-3">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Summary</p>
                      <div className="text-right">
                         <p className="text-xs font-bold text-white uppercase">{formData.brand}</p>
                         <p className="text-2xl font-headline font-bold text-accent">{formData.amount || "0.00"} <span className="text-sm">{formData.currency}</span></p>
                      </div>
                   </div>
                </div>

                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex gap-3">
                   <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                   <p className="text-[9px] text-white/60 leading-relaxed italic">
                      Generate a payment seal. A notification with the URL will be sent to your Telegram.
                   </p>
                </div>

                <Button 
                  className="w-full h-14 bg-accent text-background font-bold uppercase tracking-widest text-[11px] cyan-glow"
                  onClick={handleCreateLink}
                  disabled={isCreating || !formData.amount}
                >
                  {isCreating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Code2 className="h-5 w-5 mr-2" />}
                  Generate Payment Link
                </Button>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Active Links Mesh */}
      <div className="lg:col-span-7">
        <Card className="glass-panel border-white/5 h-full flex flex-col shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between p-6">
            <div>
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                Active Directives
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[8px] font-mono border-white/10 opacity-50">{links?.length || 0} SEALS</Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[600px]">
               {loading ? (
                 <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                 </div>
               ) : (links && links.length > 0) ? (
                 <div className="divide-y divide-white/5">
                    {links.map((link: any) => (
                      <div key={link.id} className="p-6 flex items-center justify-between gap-6 hover:bg-white/5 transition-all group relative">
                         <div className="flex items-center gap-5">
                            <div className={cn(
                              "w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0",
                              link.status === 'PAID' ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-primary/10 border-primary/20 text-primary"
                            )}>
                               <ShoppingBag className="h-7 w-7" />
                            </div>
                            <div className="space-y-1.5 min-w-0">
                               <div className="flex items-center gap-2">
                                  <p className="text-xl font-headline font-bold text-white tracking-tighter">{link.amount} <span className="text-[10px] font-body text-muted-foreground">{link.currency}</span></p>
                               </div>
                               <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                  <span className="truncate max-w-[200px]">{link.description}</span>
                                  <span>•</span>
                                  <span className="text-accent/60">{link.brand}</span>
                               </div>
                               <div className="text-[9px] font-mono text-white/30 truncate">Seal: {link.seal}</div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-3">
                            {link.status === 'ACTIVE' ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-10 text-[9px] uppercase font-bold text-accent border-accent/20 hover:bg-accent/10 px-4"
                                onClick={() => copyToClipboard(link.id, link.seal)}
                              >
                                 {copiedId === link.id ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                 Copy URL
                              </Button>
                            ) : (
                               <Badge className="bg-green-500/20 text-green-400 text-[10px] uppercase px-4 py-2 font-bold shadow-[0_0_15px_rgba(34,197,94,0.1)]">Settled T+0</Badge>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-60 flex flex-col items-center justify-center text-[10px] uppercase font-bold text-muted-foreground opacity-20 space-y-6">
                    <Terminal className="h-12 w-12" />
                    <p className="tracking-[0.4em]">Listening for Mesh Signals...</p>
                 </div>
               )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
