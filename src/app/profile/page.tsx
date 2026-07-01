"use client";

import { useUser, useFirestore, useDoc, useAuth } from '@/firebase';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  User, 
  Fingerprint, 
  ShieldCheck, 
  Zap, 
  Edit2,
  RefreshCw,
  FileText,
  Upload,
  BadgeCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Shield,
  CreditCard,
  Building2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useKernel } from '@/components/kernel/KernelProvider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  
  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  const verificationDocs = [
    { name: "Profile Picture", status: "APPROVED", date: "May 19, 2025", icon: ImageIcon },
    { name: "Bank Document", status: "APPROVED", date: "May 19, 2025", icon: Building2 },
    { name: "Passport", status: "APPROVED", date: "May 19, 2025", icon: Globe },
    { name: "National ID", status: "APPROVED", date: "May 19, 2025", icon: Fingerprint },
    { name: "Proof of Income", status: "IN REVIEW", date: "May 18, 2025", icon: FileText, pending: true },
  ];

  const getStatusBadge = () => {
    const status = profile?.verificationStatus || 'VERIFIED';
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[9px] uppercase tracking-widest"><BadgeCheck className="mr-1 h-3 w-3" /> Fully Verified Tier</Badge>;
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
          {/* Profile Header */}
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
                   {getStatusBadge()}
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                   <span className="flex items-center gap-2"><Fingerprint className="h-3 w-3 text-accent" /> ID: {profile?.kernelId || 'SKO-4421'}</span>
                   <span className="flex items-center gap-2"><Building2 className="h-3 w-3 text-accent" /> Tier: Institutional</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Verification Checklist */}
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-white italic">Document <span className="text-accent">Status</span></h3>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Updated: May 2025</p>
                </div>
                <Card className="glass-panel border-white/5 overflow-hidden">
                   <CardContent className="p-0">
                      <div className="divide-y divide-white/5">
                         {verificationDocs.map((doc, i) => (
                           <div key={i} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                              <div className="flex items-center gap-5">
                                 <div className={cn(
                                   "p-3 rounded-xl border transition-all",
                                   doc.pending ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" : "bg-green-500/10 border-green-500/30 text-green-500"
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

             {/* Limits & Capabilities Sidebar */}
             <div className="space-y-6">
                <Card className="glass-panel border-accent/20 bg-accent/5">
                   <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-accent">
                         <Zap className="h-4 w-4" /> Settlement Capability
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
                            <span className="text-green-400">GRANTED</span>
                         </div>
                      </div>
                      <Button className="w-full h-11 bg-accent text-background font-bold uppercase text-[10px] tracking-widest cyan-glow">
                         Request Higher Limits
                      </Button>
                   </CardContent>
                </Card>

                <Card className="glass-panel border-white/5 bg-secondary/10">
                   <CardHeader className="pb-2">
                      <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" /> Audit Warning
                      </CardTitle>
                   </CardHeader>
                   <CardContent>
                      <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                         "Proof of Income is currently in review. Settlement speed may be limited to 50k/day until authorization is finalized on Node-04."
                      </p>
                   </CardContent>
                </Card>
             </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
