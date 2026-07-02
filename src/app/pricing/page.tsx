
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Activity, 
  Lock, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Gem,
  Award,
  Terminal,
  Server,
  Info,
  BadgeCheck,
  Loader2,
  RefreshCw,
  Building2,
  Mail,
  Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKernel } from "@/components/kernel/KernelProvider";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const FEATURES = [
  { name: "Global Anycast Network", hobby: true, pro: true, enterprise: true },
  { name: "API Rate Limiting", hobby: "1M / mo", pro: "10M / mo", enterprise: "Unlimited" },
  { name: "WAF Protection", hobby: "Basic", pro: "Advanced", enterprise: "Managed" },
  { name: "ISO 20022 Messaging", hobby: false, pro: true, enterprise: "Dedicated Audit" },
  { name: "Node Priority", hobby: "Standard", pro: "High (Node-04)", enterprise: "Ultra (Dedicated)" },
  { name: "SLA Guarantee", hobby: "Best Effort", pro: "99.9%", enterprise: "99.99%" },
  { name: "Global Settlement Rails", hobby: false, pro: true, enterprise: "Direct Bank Access" },
  { name: "Support", hobby: "Community", pro: "Email (4h)", enterprise: "24/7 Dedicated" },
];

export default function PricingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  
  const [inquiryData, setInquiryData] = useState({
    companyName: "",
    monthlyVolume: "",
    useCase: ""
  });

  const userRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc<any>(userRef);

  const handleUpgrade = async (plan: 'PRO' | 'ENTERPRISE' | 'FREE') => {
    if (!userRef || isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      await updateDoc(userRef, { plan: plan });
      
      emitEvent('FINANCE', 'PLAN_UPGRADE_EXECUTED', 2, { 
        userId: user?.uid, 
        newPlan: plan,
        timestamp: Date.now(),
        syncToLedger: true
      });

      toast({
        title: "Protocol Initialized",
        description: `Your node has been migrated to the ${plan} tier.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authorization Failed",
        description: "Security Protocol Blocked: Settlement handshake interrupted."
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleSalesInquiry = async () => {
    if (!firestore || !user?.uid || !inquiryData.companyName) return;

    setIsSubmittingInquiry(true);
    try {
      await addDoc(collection(firestore, 'inquiries'), {
        userId: user.uid,
        ...inquiryData,
        status: "NEW",
        timestamp: Date.now()
      });

      emitEvent('FINANCE', 'ENTERPRISE_SALES_INQUIRY', 2, { company: inquiryData.companyName });
      toast({ title: "Inquiry Dispatched", description: "An Institutional Node manager will contact you." });
      setIsSalesOpen(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Dispatch Failed" });
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent uppercase italic">
              <Gem className="h-5 w-5 text-accent" />
              Plans & Scalability
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            BILLING_SYSTEM: ACTIVE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-20 pb-20">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-[0.4em] px-6 py-1.5 text-[10px] font-bold">
              Institutional Grade Infrastructure
            </Badge>
            <h2 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter uppercase leading-[0.8]">
              PREDICTABLE <br />
              <span className="text-accent italic font-light">SETTLEMENT COST</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
              "Start free, scale to institutional level. Managed liquidity, ISO 20022 compliance, and anycast resilience included."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Hobby */}
             <Card className="glass-panel border-white/5 flex flex-col group hover:border-white/20 transition-all">
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Hobby</CardTitle>
                   <CardDescription className="text-xs italic">For individual financial nodes & testing.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">Free</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Forever</p>
                   </div>
                   <ul className="space-y-3">
                      {["1M API Requests / mo", "Standard Anycast", "Shared Compliance", "Basic DDoS Protection"].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                           <Check className="h-4 w-4 text-accent" /> {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-8">
                   <Button 
                    variant="outline" 
                    className="w-full h-12 uppercase text-[10px] font-bold tracking-widest border-white/10"
                    disabled={profile?.plan === 'FREE' || isUpgrading}
                    onClick={() => handleUpgrade('FREE')}
                   >
                     {profile?.plan === 'FREE' ? "Current Plan" : "Initialize Free Node"}
                   </Button>
                </CardFooter>
             </Card>

             {/* Pro */}
             <Card className="glass-panel border-accent/40 bg-accent/5 flex flex-col relative overflow-hidden group hover:border-accent transition-all shadow-[0_0_50px_rgba(0,242,255,0.15)] scale-105">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />
                <div className="absolute top-4 right-4">
                   <Badge className="bg-accent text-background font-bold text-[8px] uppercase tracking-widest">Scaling</Badge>
                </div>
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Pro</CardTitle>
                   <CardDescription className="text-xs italic">For growing businesses scaling global payouts.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">$20<span className="text-lg">/mo</span></p>
                      <p className="text-[10px] uppercase font-bold text-accent tracking-widest">99.9% Uptime SLA</p>
                   </div>
                   <ul className="space-y-3">
                      {["10M API Requests", "Node-04 Priority Sync", "ISO 20022 Messaging", "Advanced WAF", "Priority Email Support"].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-white/90">
                           <Check className="h-4 w-4 text-accent" /> {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-8">
                   <Button 
                    className="w-full h-12 bg-accent text-background font-bold uppercase text-[10px] tracking-widest cyan-glow"
                    onClick={() => handleUpgrade('PRO')}
                    disabled={profile?.plan === 'PRO' || isUpgrading}
                   >
                     {isUpgrading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                     {profile?.plan === 'PRO' ? "Active Protocol" : "Upgrade to Pro"}
                   </Button>
                </CardFooter>
             </Card>

             {/* Enterprise */}
             <Card className="glass-panel border-white/5 flex flex-col group hover:border-white/20 transition-all">
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Enterprise</CardTitle>
                   <CardDescription className="text-xs italic">Institutional infrastructure for global scale.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">Custom</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">99.99% Uptime</p>
                   </div>
                   <ul className="space-y-3">
                      {["Unlimited Throughput", "White-label Gateway", "Dedicated Compliance Audit", "Direct Bank Rails", "24/7 PagerDuty Support"].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                           <Check className="h-4 w-4 text-white/40" /> {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-8">
                   <Button 
                    variant="outline" 
                    className="w-full h-12 uppercase text-[10px] font-bold tracking-widest border-white/10"
                    onClick={() => setIsSalesOpen(true)}
                    disabled={profile?.plan === 'ENTERPRISE' || isUpgrading}
                   >
                     {profile?.plan === 'ENTERPRISE' ? "Institutional Active" : "Talk to Sales"}
                   </Button>
                </CardFooter>
             </Card>
          </div>

          {/* Overage & SLA Logic Section */}
          <div className="space-y-8 pt-10">
             <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <h3 className="text-xl font-headline font-bold uppercase tracking-widest text-white">Feature Mesh & SLA</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-white/5">
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground">Parameter</th>
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground text-center">Hobby</th>
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground text-center">Pro</th>
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground text-center">Enterprise</th>
                      </tr>
                   </thead>
                   <tbody>
                      {FEATURES.map((f, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                           <td className="py-6 text-sm font-medium text-white/80">{f.name}</td>
                           <td className="py-6 text-center">
                              {typeof f.hobby === 'boolean' ? (f.hobby ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-mono font-bold">{f.hobby}</span>}
                           </td>
                           <td className="py-6 text-center">
                              {typeof f.pro === 'boolean' ? (f.pro ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-mono font-bold text-accent">{f.pro}</span>}
                           </td>
                           <td className="py-6 text-center">
                              {typeof f.enterprise === 'boolean' ? (f.enterprise ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-mono font-bold text-white">{f.enterprise}</span>}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             <div className="p-8 rounded-3xl bg-secondary/20 border border-white/5 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                   <BadgeCheck className="h-4 w-4 text-accent" />
                   Commercial Conditions (বাণিজ্যিক শর্তাবলী)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[11px] text-muted-foreground leading-relaxed italic">
                   <div className="space-y-2">
                      <p className="text-white font-bold uppercase tracking-tight">ওভারএজ (Overage) চার্জিং:</p>
                      <p>* প্রো প্ল্যানের ১০ মিলিয়ন রিকোয়েস্ট পার হলে প্রতি অতিরিক্ত ১ মিলিয়নের জন্য $২ চার্জ করা হবে।</p>
                      <p>* প্রতি অতিরিক্ত ১ জিবি ডেটা ট্রান্সফারের জন্য $০.১৫ চার্জ করা হবে যা পরবর্তী বিলিং সাইকেলে লেজার থেকে অটো-সেটেল হবে।</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-white font-bold uppercase tracking-tight">SLA এবং রিফান্ড পলিসি:</p>
                      <p>* আমরা ৯৯.৯৯% আপটাইম গ্যারান্টি প্রদান করি। যদি কোনো মাসে আমাদের সিস্টেম এই লক্ষ্যমাত্রা অর্জনে ব্যর্থ হয়, তবে ক্ষতিগ্রস্ত ক্লায়েন্টকে লিকুইডিটি ক্রেডিট রিফান্ড প্রদান করা হবে।</p>
                   </div>
                </div>
             </div>
          </div>
        </main>

        <footer className="pt-20 border-t border-white/5 text-center space-y-6 pb-20">
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-accent/50" />
                <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase px-4 flex gap-2">
                   <Building2 className="h-3 w-3" /> NOORNEXUS INFRASTRUCTURE • © 2024
                </Badge>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-30 italic">
                FusionPay Sovereign OS • Billing Node Node-01 Active
             </p>
        </footer>

        {/* Sales Inquiry Dialog */}
        <Dialog open={isSalesOpen} onOpenChange={setIsSalesOpen}>
          <DialogContent className="max-w-md glass-panel border-accent/20 bg-background/95 p-0 overflow-hidden">
             <div className="bg-accent/10 p-8 border-b border-white/10 text-center">
                <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter">Institutional Inquiry</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Request Enterprise Node Access</DialogDescription>
             </div>
             <div className="p-8 space-y-4">
                <div className="space-y-2">
                   <Label className="text-[10px] uppercase font-bold text-muted-foreground">Company Name</Label>
                   <Input 
                      placeholder="e.g. Acme Corp" 
                      className="bg-secondary/30 border-white/5"
                      value={inquiryData.companyName}
                      onChange={e => setInquiryData({...inquiryData, companyName: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] uppercase font-bold text-muted-foreground">Estimated Monthly Volume</Label>
                   <Input 
                      placeholder="e.g. $1M+" 
                      className="bg-secondary/30 border-white/5"
                      value={inquiryData.monthlyVolume}
                      onChange={e => setInquiryData({...inquiryData, monthlyVolume: e.target.value})}
                   />
                </div>
                <Button 
                   className="w-full h-12 bg-accent text-background font-bold uppercase tracking-widest text-[10px] cyan-glow"
                   onClick={handleSalesInquiry}
                   disabled={isSubmittingInquiry}
                >
                   {isSubmittingInquiry ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                   Request Institutional Handshake
                </Button>
             </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </div>
  );
}
