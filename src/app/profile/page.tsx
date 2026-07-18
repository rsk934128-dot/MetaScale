
"use client";

import { useUser, useFirestore, useDoc } from '@/firebase';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Fingerprint, 
  ShieldCheck, 
  Zap, 
  FileText, 
  BadgeCheck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Shield, 
  Building2, 
  Globe, 
  Image as ImageIcon, 
  Loader2, 
  Send,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { useState, useMemo, useEffect } from 'react';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useKernel } from '@/components/kernel/KernelProvider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { generateTelegramLink } from "@/lib/telegram";

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [isSubmittingLimit, setIsSubmittingLimit] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [limitForm, setLimitForm] = useState({ requestedAmount: "", reason: "" });
  const [tgLink, setTgLink] = useState("");

  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  useEffect(() => {
    if (user?.uid) {
      generateTelegramLink(user.uid).then(setTgLink);
    }
  }, [user?.uid]);

  const verificationDocs = [
    { id: 'p1', name: "Profile Picture", status: "APPROVED", date: "July 09, 2026", icon: ImageIcon },
    { id: 'p2', name: "Bank Document", status: "APPROVED", date: "July 09, 2026", icon: Building2 },
    { id: 'p3', name: "Passport", status: "APPROVED", date: "July 09, 2026", icon: Globe },
    { id: 'p4', name: "National ID", status: "APPROVED", date: "July 09, 2026", icon: Fingerprint },
    { id: 'p5', name: "Proof of Income", status: profile?.verificationStatus === 'VERIFIED' ? "APPROVED" : "IN REVIEW", date: "July 09, 2026", icon: FileText, pending: profile?.verificationStatus !== 'VERIFIED' },
  ];

  const handleManualVerification = async () => {
    if (!userRef) return;
    setIsVerifying(true);
    try {
      await updateDoc(userRef, { 
        verificationStatus: 'VERIFIED',
        trustScore: 98.2
      });
      emitEvent('SECURITY', 'MANUAL_COMPLIANCE_APPROVAL', 2, { userId: user?.uid });
      toast({ title: "Compliance Unlocked", description: "আপনার প্রোফাইল এখন সম্পূর্ণ ভেরিফাইড (Institutional Tier)।" });
    } catch (err) {
      toast({ variant: "destructive", title: "Action Failed" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRequestLimit = async () => {
    if (!firestore || !user?.uid || !limitForm.requestedAmount) {
      toast({ variant: "destructive", title: "Missing Data", description: "প্রার্থিত পরিমাণ উল্লেখ করুন।" });
      return;
    }

    setIsSubmittingLimit(true);
    try {
      const requestData = {
        userId: user.uid,
        userEmail: user.email,
        requestedAmount: limitForm.requestedAmount,
        reason: limitForm.reason,
        status: 'PENDING',
        timestamp: Date.now()
      };

      await addDoc(collection(firestore, 'limit_requests'), requestData);
      
      emitEvent('FINANCE', 'LIMIT_INCREASE_REQUESTED', 3, { 
        userId: user.uid, 
        amount: limitForm.requestedAmount 
      });

      toast({ 
        title: "Request Submitted", 
        description: "আপনার আবেদনটি পর্যালোচনার জন্য নোড-০৪ এ পাঠানো হয়েছে।" 
      });
      setIsLimitDialogOpen(false);
      setLimitForm({ requestedAmount: "", reason: "" });
    } catch (err) {
      toast({ variant: "destructive", title: "Submission Failed" });
    } finally {
      setIsSubmittingLimit(false);
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
              <ShieldCheck className="h-5 w-5 text-accent" />
              Verification Center
            </h1>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-accent/5 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Shield className="h-40 w-40 text-accent" /></div>
             <div className="relative w-32 h-32 rounded-full border-4 border-accent/30 p-1 bg-background z-10">
                <Avatar className="w-full h-full">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="bg-accent/10 text-3xl text-accent font-bold uppercase">{user?.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-background">
                   <BadgeCheck className="h-5 w-5" />
                </div>
             </div>
             <div className="text-center md:text-left space-y-3 z-10">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                   <h2 className="text-3xl font-headline font-bold text-white">{profile?.displayName || user?.displayName || 'Sovereign Citizen'}</h2>
                   <Badge className={cn(
                     "text-[9px] uppercase tracking-widest",
                     profile?.verificationStatus === 'VERIFIED' ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 animate-pulse"
                   )}>
                     <BadgeCheck className="mr-1 h-3 w-3" /> {profile?.verificationStatus || 'UNVERIFIED'} TIER
                   </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                   <span className="flex items-center gap-2"><Fingerprint className="h-3 w-3 text-accent" /> ID: {profile?.kernelId || 'SKO-4421'}</span>
                   <span className="flex items-center gap-2"><Building2 className="h-3 w-3 text-accent" /> Tier: Institutional</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-white italic">Document <span className="text-accent">Status</span></h3>
                   {profile?.verificationStatus !== 'VERIFIED' && (
                     <Button 
                      size="sm" 
                      className="bg-accent text-background font-bold text-[9px] h-8 cyan-glow"
                      onClick={handleManualVerification}
                      disabled={isVerifying}
                     >
                        {isVerifying ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ShieldCheck className="h-3 w-3 mr-1" />}
                        Authorize Proof of Income
                     </Button>
                   )}
                </div>
                <Card className="glass-panel border-white/5 overflow-hidden">
                   <CardContent className="p-0">
                      <div className="divide-y divide-white/5">
                         {verificationDocs.map((doc, i) => (
                           <div key={i} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                              <div className="flex items-center gap-5">
                                 <div className={cn(
                                   "p-3 rounded-xl border transition-all",
                                   doc.pending ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" : "bg-green-500/10 border-green-500/30 text-green-400"
                                 )}>
                                    <doc.icon className="h-6 w-6" />
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">{doc.name}</p>
                                    <p className="text-[10px] text-muted-foreground italic">Updated on {doc.date}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Badge className={cn(
                                   "text-[9px] uppercase font-bold px-3 py-1",
                                   doc.pending ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 animate-pulse" : "bg-green-500/20 text-green-400 border-green-500/30"
                                 )}>
                                    {doc.pending ? <Clock className="mr-1 h-3 w-3" /> : <CheckCircle2 className="mr-1 h-3 w-3" />}
                                    {doc.status}
                                 </Badge>
                                 <ChevronRight className="h-4 w-4 text-muted-foreground opacity-20 group-hover:opacity-100 transition-all" />
                              </div>
                           </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             </div>

             <div className="space-y-6">
                <Card className="glass-panel border-accent/20 bg-accent/5">
                   <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-accent">
                         <Zap className="h-4 w-4 text-accent" /> Settlement Capability
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-muted-foreground uppercase">Daily Disbursement</span>
                            <span className="text-white">$100,000</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-muted-foreground uppercase">Monthly Limit</span>
                            <span className="text-white">UNLIMITED</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold pt-2 border-t border-white/5">
                            <span className="text-muted-foreground uppercase">Tunnel Access</span>
                            <span className={cn("font-bold", profile?.verificationStatus === 'VERIFIED' ? "text-green-400" : "text-yellow-500")}>
                               {profile?.verificationStatus === 'VERIFIED' ? "GRANTED" : "RESTRICTED"}
                            </span>
                         </div>
                      </div>
                      <Button 
                        className="w-full h-11 bg-accent text-background font-bold uppercase text-[10px] tracking-widest cyan-glow"
                        onClick={() => setIsLimitDialogOpen(true)}
                      >
                         Request Higher Limits
                      </Button>
                   </CardContent>
                </Card>
             </div>
          </div>
        </main>

        <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
          <DialogContent className="max-w-md glass-panel border-accent/20 bg-background/95 p-0 overflow-hidden">
             <div className="bg-accent/10 p-8 border-b border-white/10 text-center">
                <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter">Limit Escalation</DialogTitle>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Requested Daily Limit (USD)</Label>
                      <Input type="number" placeholder="e.g. 250000" className="bg-secondary/30 border-white/5" value={limitForm.requestedAmount} onChange={(e) => setLimitForm({...limitForm, requestedAmount: e.target.value})} />
                   </div>
                </div>
                <Button className="w-full h-12 bg-accent text-background font-bold uppercase tracking-widest text-xs cyan-glow" onClick={handleRequestLimit} disabled={isSubmittingLimit}>
                   {isSubmittingLimit ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                   Authorize Request
                </Button>
             </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </div>
  );
}
