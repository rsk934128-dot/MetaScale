
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  { name: "Global Edge Network", hobby: true, pro: true, enterprise: true },
  { name: "Automatic CI/CD", hobby: true, pro: true, enterprise: true },
  { name: "API Rate Limiting", hobby: "1M / mo", pro: "10M / mo", enterprise: "Unlimited" },
  { name: "WAF Protection", hobby: "Basic", pro: "Advanced", enterprise: "Managed" },
  { name: "ISO 20022 Messaging", hobby: false, pro: true, enterprise: "Dedicated Audit" },
  { name: "White-label Gateway", hobby: false, pro: false, enterprise: "Active" },
  { name: "SLA Guarantee", hobby: "Best Effort", pro: "99.9%", enterprise: "99.99%" },
  { name: "Advanced Support", hobby: false, pro: "Email", enterprise: "24/7 Dedicated" },
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

  const handleUpgrade = async (plan: 'PRO' | 'ENTERPRISE') => {
    if (!userRef || isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      await updateDoc(userRef, { plan: plan });
      
      emitEvent('FINANCE', 'PLAN_UPGRADE_EXECUTED', 2, { 
        userId: user?.uid, 
        newPlan: plan,
        timestamp: Date.now()
      });

      toast({
        title: "Upgrade Successful",
        description: `Your account has been migrated to the ${plan} tier.`,
      });
    } catch (err: any) {
      console.error("Upgrade Error:", err);
      toast({
        variant: "destructive",
        title: "Upgrade Failed",
        description: err.code === 'permission-denied' 
          ? "Security Protocol Blocked: Authorization required for plan change." 
          : "Kernel communication error during settlement handshake."
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleSalesInquiry = async () => {
    if (!firestore || !user?.uid || !inquiryData.companyName || !inquiryData.monthlyVolume) {
      toast({ variant: "destructive", title: "Missing Information", description: "সবগুলো ঘর পূরণ করুন।" });
      return;
    }

    setIsSubmittingInquiry(true);
    try {
      const inquiryRef = collection(firestore, 'inquiries');
      await addDoc(inquiryRef, {
        userId: user.uid,
        userEmail: user.email,
        companyName: inquiryData.companyName,
        estimatedMonthlyVolume: inquiryData.monthlyVolume,
        useCase: inquiryData.useCase,
        status: "NEW",
        timestamp: Date.now()
      });

      emitEvent('FINANCE', 'ENTERPRISE_SALES_INQUIRY', 2, { 
        userId: user.uid, 
        company: inquiryData.companyName 
      });

      toast({
        title: "Inquiry Sent",
        description: "আমাদের সেলস নোড আপনার সাথে ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।",
      });
      setIsSalesOpen(false);
      setInquiryData({ companyName: "", monthlyVolume: "", useCase: "" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
      });
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
            <h1 className="text-lg font-headline font-bold flex items-center gap-2 text-accent">
              <Gem className="h-5 w-5 text-accent" />
              Plans & Scalability
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            BILLING_SYSTEM: ACTIVE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-20">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-[0.4em] px-6 py-1.5 text-[10px] font-bold">
              Scale your app. Control your costs.
            </Badge>
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter uppercase">
              Predictable Pricing <br />
              <span className="text-accent italic font-light">For Global Settlement</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
              "Start free. Upgrade to Pro for $20/month. Pay only for actual compute and enjoy institutional-grade reliability."
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Hobby Plan */}
             <Card className="glass-panel border-white/5 flex flex-col group hover:border-white/20 transition-all">
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Hobby</CardTitle>
                   <CardDescription className="text-xs italic">Ideal for personal financial nodes and testing.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">Free</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Forever</p>
                   </div>
                   <ul className="space-y-3">
                      {[
                        "1M API Requests / mo",
                        "Standard Anycast Routing",
                        "Shared Compliance Node",
                        "DDoS Mitigation"
                      ].map((f, i) => (
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
                     {profile?.plan === 'FREE' ? "Current Plan" : "Get Started"}
                   </Button>
                </CardFooter>
             </Card>

             {/* Pro Plan */}
             <Card className="glass-panel border-accent/40 bg-accent/5 flex flex-col relative overflow-hidden group hover:border-accent transition-all shadow-[0_0_50px_rgba(0,242,255,0.15)] scale-105">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                <div className="absolute top-4 right-4">
                   <Badge className="bg-accent text-background font-bold text-[8px] uppercase tracking-widest">Popular</Badge>
                </div>
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Pro</CardTitle>
                   <CardDescription className="text-xs italic">For growing businesses scaling cross-border payouts.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">$20<span className="text-lg">/mo</span></p>
                      <p className="text-[10px] uppercase font-bold text-accent tracking-widest">99.9% Uptime SLA</p>
                   </div>
                   <ul className="space-y-3">
                      {[
                        "10M API Requests included",
                        "ISO 20022 Standard Compliance",
                        "Advanced WAF & Rate Limiting",
                        "Priority Anycast (Node-04)",
                        "Email Support (4h Response)"
                      ].map((f, i) => (
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
                     {profile?.plan === 'PRO' ? "Current Plan" : "Upgrade to Pro"}
                   </Button>
                </CardFooter>
             </Card>

             {/* Enterprise Plan */}
             <Card className="glass-panel border-white/5 flex flex-col group hover:border-white/20 transition-all">
                <CardHeader className="p-8">
                   <CardTitle className="text-2xl font-headline italic uppercase">Enterprise</CardTitle>
                   <CardDescription className="text-xs italic">Custom infrastructure for global financial institutions.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-4xl font-headline font-bold">Custom</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">99.99% Uptime Guarantee</p>
                   </div>
                   <ul className="space-y-3">
                      {[
                        "Unlimited API Throughput",
                        "White-label Gateway Node",
                        "Dedicated Compliance Audit",
                        "Direct Bank Settlement Rails",
                        "24/7 PagerDuty Support"
                      ].map((f, i) => (
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
                     {profile?.plan === 'ENTERPRISE' ? "Current Plan" : "Talk to Sales"}
                   </Button>
                </CardFooter>
             </Card>
          </div>

          {/* Detailed Features Table */}
          <div className="space-y-8 pt-10">
             <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <h3 className="text-xl font-headline font-bold uppercase tracking-widest">Full Feature Mesh</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                   <span className="flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Overage rates apply after plan limits.</span>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-white/5">
                         <th className="py-4 text-[10px] font-bold uppercase text-muted-foreground">Operational Parameter</th>
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
                              {typeof f.hobby === 'boolean' ? (f.hobby ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-bold font-mono">{f.hobby}</span>}
                           </td>
                           <td className="py-6 text-center">
                              {typeof f.pro === 'boolean' ? (f.pro ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-bold text-accent font-mono">{f.pro}</span>}
                           </td>
                           <td className="py-6 text-center">
                              {typeof f.enterprise === 'boolean' ? (f.enterprise ? <Check className="mx-auto h-4 w-4 text-accent" /> : <X className="mx-auto h-4 w-4 text-white/20" />) : <span className="text-xs font-bold text-white font-mono">{f.enterprise}</span>}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             {/* Overage and Billing Notes */}
             <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                   <BadgeCheck className="h-4 w-4 text-accent" />
                   Overage & Settlement Billing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] text-muted-foreground leading-relaxed italic">
                   <p>
                      * <strong>Overage Rates:</strong> Pro টিয়ারে নির্ধারিত ১০ মিলিয়ন এপিআই রিকোয়েস্ট পার হলে প্রতি অতিরিক্ত ১ মিলিয়ন রিকোয়েস্টের জন্য $২ চার্জ করা হবে। অতিরিক্ত ডাটা ট্রান্সফারের ক্ষেত্রে প্রতি ১ জিবি-র জন্য $০.১৫ প্রযোজ্য।
                   </p>
                   <p>
                      * <strong>SLA Monitoring:</strong> আমাদের প্রাতিষ্ঠানিক ক্লায়েন্টদের জন্য রিয়েল-টাইম SLA ড্যাশবোর্ড প্রদান করা হয়। কোনো মাসে আপটাইম গ্যারান্টি (৯৯.৯৯%) পূরণ না হলে লিকুইডিটি ক্রেডিট রিফান্ড পলিসি কার্যকর হবে।
                   </p>
                </div>
             </div>
          </div>

          {/* Infrastructure Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
                { icon: ShieldAlert, title: "ISO 20022 Ready", desc: "Institutional-grade financial messaging standard for global interoperability." },
                { icon: Lock, title: "Managed WAF", desc: "Enterprise-grade firewall with custom rulesets to block zero-day exploits." },
                { icon: Activity, title: "99.99% Reliability", desc: "Distributed infrastructure across 42 anycast nodes ensuring maximum uptime." },
                { icon: Award, title: "Dedicated Compliance", desc: "Annual security audits and KYB re-verification managed by Fusion Oracle." }
             ].map((box, i) => (
               <Card key={i} className="glass-panel border-white/5 p-6 space-y-4">
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 w-fit text-accent">
                     <box.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase">{box.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{box.desc}</p>
               </Card>
             ))}
          </div>

          {/* Footer Commitment */}
          <footer className="pt-20 border-t border-white/5 text-center space-y-6">
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-accent/50" />
                <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px] uppercase px-4 flex gap-2">
                   <Building2 className="h-3 w-3" /> NOORNEXUS GLOBAL NODE • EST. 2024
                </Badge>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-accent/50" />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground opacity-50">
                Founded in London. Distributed Globally.
             </p>
          </footer>
        </main>

        {/* Sales Inquiry Dialog */}
        <Dialog open={isSalesOpen} onOpenChange={setIsSalesOpen}>
          <DialogContent className="max-w-md glass-panel border-accent/20 bg-background/95 p-0 overflow-hidden">
             <div className="bg-accent/10 p-6 border-b border-white/10 text-center">
                <div className="mx-auto w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                   <Building2 className="h-6 w-6 text-accent" />
                </div>
                <DialogTitle className="text-xl font-headline italic uppercase italic">Institutional Intake</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Global Settlement Node Provisioning</DialogDescription>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Company Name</Label>
                      <div className="relative">
                         <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                         <Input 
                            placeholder="Acme Corp Global" 
                            className="pl-10 bg-secondary/30 border-white/5 h-11 text-sm"
                            value={inquiryData.companyName}
                            onChange={(e) => setInquiryData({...inquiryData, companyName: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Estimated Monthly Volume (USD)</Label>
                      <div className="relative">
                         <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                         <select 
                            className="w-full bg-secondary/30 border border-white/5 rounded-md h-11 text-sm pl-10 pr-4 text-white focus:outline-none"
                            value={inquiryData.monthlyVolume}
                            onChange={(e) => setInquiryData({...inquiryData, monthlyVolume: e.target.value})}
                         >
                            <option value="" disabled>Select Volume</option>
                            <option value="$100k - $500k">$100k - $500k</option>
                            <option value="$500k - $1M">$500k - $1M</option>
                            <option value="$1M - $5M">$1M - $5M</option>
                            <option value="$5M+">$5M+</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Business Use Case</Label>
                      <Textarea 
                         placeholder="e.g. Cross-border B2B settlement for EU-BD corridors..." 
                         className="bg-secondary/30 border-white/5 min-h-[100px] text-xs resize-none"
                         value={inquiryData.useCase}
                         onChange={(e) => setInquiryData({...inquiryData, useCase: e.target.value})}
                      />
                   </div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3">
                   <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                   <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                      Your inquiry will be processed via Anycast Node Node-04 (UK). A dedicated node manager will contact you at {user?.email}.
                   </p>
                </div>

                <Button 
                   className="w-full h-12 bg-accent text-background font-bold uppercase tracking-widest text-xs cyan-glow"
                   onClick={handleSalesInquiry}
                   disabled={isSubmittingInquiry}
                >
                   {isSubmittingInquiry ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                   Request Institutional Access
                </Button>
             </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </div>
  );
}
