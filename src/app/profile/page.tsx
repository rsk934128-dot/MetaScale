
'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  User, 
  Fingerprint, 
  Mail, 
  Phone, 
  ShieldCheck, 
  History, 
  Zap, 
  Activity, 
  Lock,
  Edit2,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Upload,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';
import { doc, setDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useKernel } from '@/components/kernel/KernelProvider';

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const userRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, loading } = useDoc<any>(userRef);

  const handleCopyId = () => {
    const id = profile?.kernelId || `SKO-${user?.uid?.substring(0, 8).toUpperCase()}`;
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast({ title: "ID Copied", description: "Kernel ID saved to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkTIN = async () => {
    if (!user?.uid || !firestore) return;
    setIsUploading(true);
    
    const docData = {
      userId: user.uid,
      userName: profile?.displayName || user.displayName || 'Citizen',
      type: 'TIN',
      status: 'PENDING',
      submittedAt: Date.now(),
      metadata: {
        tin: "742322402703",
        name: profile?.displayName || user.displayName,
        father: "md.abdul barik sheikh",
        address: "masumpor, shodor 1, Sirajganj, PO: 6700",
        issueDate: "June 03, 2024"
      }
    };

    try {
      const collRef = collection(firestore, 'verification_docs');
      await addDoc(collRef, docData);
      
      // Update local profile status to PENDING
      await updateDoc(userRef!, { verificationStatus: 'PENDING' });
      
      emitEvent('SECURITY', 'CITIZEN_TIN_SUBMITTED', 3, { userId: user.uid, tin: "742322402703" });

      toast({
        title: "TIN Submitted",
        description: "Certificate 74232... is now pending admin audit.",
      });
    } catch (err) {
       console.error(err);
       toast({
         variant: "destructive",
         title: "Submission Failed",
         description: "Check your mesh connection and try again."
       });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = () => {
    const status = profile?.verificationStatus || 'UNVERIFIED';
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[9px] uppercase">
            <BadgeCheck className="mr-1 h-3 w-3" /> Verified Citizen
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[9px] uppercase animate-pulse">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Audit In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground border-white/10 text-[9px] uppercase">
            <AlertCircle className="mr-1 h-3 w-3" /> Unverified
          </Badge>
        );
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
              <Fingerprint className="h-5 w-5 text-accent" />
              Citizen Identity
            </h1>
          </div>
          <Badge variant="outline" className="border-accent/20 text-accent font-mono text-[10px]">
            SESSION_ACTIVE
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1000px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-in">
             <div className="relative group">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-32 h-32 rounded-full border-2 border-accent/30 p-1 bg-background">
                   <div className="w-full h-full rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden border border-white/5">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-accent/40" />
                      )}
                   </div>
                </div>
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background border-accent/20 text-accent">
                   <Edit2 className="h-3 w-3" />
                </Button>
             </div>

             <div className="text-center md:text-left space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                   <h2 className="text-3xl font-headline font-bold text-white">{profile?.displayName || user?.displayName || 'Citizen'}</h2>
                   <Badge className="bg-accent text-background font-bold uppercase text-[9px] tracking-widest">
                      {profile?.role || 'OPERATOR'}
                   </Badge>
                   {getStatusBadge()}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                   <span className="text-xs font-mono uppercase tracking-tighter opacity-70">Sovereign Mesh ID:</span>
                   <button 
                     onClick={handleCopyId}
                     className="flex items-center gap-2 hover:text-accent transition-colors group"
                   >
                     <span className="text-sm font-bold text-white/90">
                       {profile?.kernelId || `SKO-${user?.uid?.substring(0, 8).toUpperCase()}`}
                     </span>
                     {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                   </button>
                </div>
             </div>

             <div className="flex flex-col gap-2">
                <Button variant="outline" className="text-[10px] font-bold h-9 border-white/5 bg-white/5">
                   <RefreshCw className="mr-2 h-3 w-3" /> Sync Identity
                </Button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <Card className="glass-panel border-white/5 overflow-hidden">
                   <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                      <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                         <Lock className="h-4 w-4 text-accent" /> Secure Vault Info
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                         <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                               <Mail className="h-4 w-4" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-muted-foreground uppercase">Linked Email</p>
                               <p className="text-sm text-white/90">{profile?.email || user?.email}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                               <Phone className="h-4 w-4" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-muted-foreground uppercase">Mobile Node</p>
                               <p className="text-sm text-white/90">{profile?.mobile || 'Not Linked'}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                               <Zap className="h-4 w-4" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-muted-foreground uppercase">Access Level</p>
                               <p className="text-sm text-accent font-bold">CLEARANCE_L3</p>
                            </div>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                <Card className="glass-panel border-accent/20 bg-accent/5">
                   <CardHeader className="p-4">
                      <CardTitle className="text-xs uppercase flex items-center gap-2">
                         <FileText className="h-4 w-4 text-accent" /> Compliance Binding
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 pt-0 space-y-4">
                      <p className="text-[11px] text-muted-foreground italic">
                         Link your taxpayer identification (TIN) to enable high-value financial corridors.
                      </p>
                      <Button 
                        className="w-full text-[10px] font-bold h-9 bg-accent text-background cyan-glow"
                        onClick={handleLinkTIN}
                        disabled={isUploading || profile?.verificationStatus === 'PENDING' || profile?.verificationStatus === 'VERIFIED'}
                      >
                         {isUploading ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Upload className="mr-2 h-3 w-3" />}
                         {profile?.verificationStatus === 'VERIFIED' ? 'Binding Active' : profile?.verificationStatus === 'PENDING' ? 'Awaiting Audit' : 'Link TIN Certificate'}
                      </Button>
                   </CardContent>
                </Card>
             </div>

             <div className="space-y-6">
                <Card className="glass-panel border-accent/20 bg-accent/5">
                   <CardHeader className="p-4">
                      <CardTitle className="text-xs uppercase flex items-center gap-2">
                         <Activity className="h-4 w-4 text-accent" /> System Telemetry
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 pt-0 space-y-4">
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-3">
                         <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-muted-foreground uppercase">Trust Rating</span>
                            <span className="text-accent">{profile?.trustScore || '98.4'}%</span>
                         </div>
                         <div className="h-1 w-full bg-accent/10 rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${profile?.trustScore || 98}%` }} />
                         </div>
                         <p className="text-[9px] text-muted-foreground italic">
                            Your account is cryptographically signed and bound to the Sovereign Mesh Node-04.
                         </p>
                      </div>
                      <div className="flex items-center gap-3 p-2 text-[10px] font-bold text-green-400">
                         <ShieldCheck className="h-4 w-4" /> 2FA ENFORCED BY KERNEL
                      </div>
                   </CardContent>
                </Card>

                <Card className="glass-panel border-white/5">
                   <CardHeader className="p-4">
                      <CardTitle className="text-xs uppercase flex items-center gap-2">
                         <History className="h-4 w-4 text-muted-foreground" /> Recent Directives
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                         {[
                           { action: "Identity Link Established", time: "2h ago" },
                           { action: "SCA Verification Success", time: "1d ago" },
                           { action: "Profile Mesh-Synced", time: "3d ago" }
                         ].map((item, i) => (
                           <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 text-[10px]">
                              <span className="text-white/70">{item.action}</span>
                              <span className="text-muted-foreground font-mono">{item.time}</span>
                           </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
