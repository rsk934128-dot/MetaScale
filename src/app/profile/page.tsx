
'use client';

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
  Copy,
  Check,
  FileText,
  Upload,
  BadgeCheck,
  AlertCircle,
  Save,
  Camera,
  Users,
  Search,
  Building2,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useMemo, useRef } from 'react';
import { doc, collection, addDoc, updateDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useKernel } from '@/components/kernel/KernelProvider';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [nid, setNid] = useState('');
  const [tin, setTin] = useState('');
  const [editName, setEditName] = useState('');

  const userRef = useMemo(() => (firestore && user?.uid) ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: profile } = useDoc<any>(userRef);

  const handleUpdateProfile = async () => {
    if (!userRef) return;
    setIsSaving(true);
    try {
      await updateDoc(userRef, { displayName: editName || profile?.displayName });
      if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: editName || profile?.displayName });
      emitEvent('SECURITY', 'PROFILE_INFO_UPDATED', 3, { userId: user?.uid });
      toast({ title: "Profile Updated" });
      setIsEditing(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplianceSubmit = async () => {
    if (!nid || !tin || !user?.uid || !firestore) return;
    setIsVerifying(true);

    const docId = `VERIFY_${user.uid}_${Date.now()}`;
    const verifyData = {
      id: docId,
      userId: user.uid,
      userName: profile?.displayName || user.displayName,
      type: 'NID',
      status: 'PENDING',
      submittedAt: Date.now(),
      metadata: { nid, tin, address: "Sector 7, Dhaka, BD" }
    };

    try {
      const vDocRef = doc(firestore, 'verification_docs', docId);
      await setDoc(vDocRef, verifyData);
      await updateDoc(userRef!, { verificationStatus: 'PENDING' });

      emitEvent('SECURITY', 'COMPLIANCE_DOCS_SUBMITTED', 2, { type: 'STABLECOIN_CIP', userId: user.uid });
      toast({ title: "Audit Trail Initialized", description: "Identity documents submitted for CIP review." });
      setNid('');
      setTin('');
    } catch (err) {
      toast({ variant: "destructive", title: "Submission Failed" });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = () => {
    const status = profile?.verificationStatus || 'UNVERIFIED';
    switch (status) {
      case 'VERIFIED': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[9px] uppercase"><BadgeCheck className="mr-1 h-3 w-3" /> Verified Citizen</Badge>;
      case 'PENDING': return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[9px] uppercase animate-pulse"><RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Audit In Progress</Badge>;
      default: return <Badge variant="outline" className="text-muted-foreground border-white/10 text-[9px] uppercase"><AlertCircle className="mr-1 h-3 w-3" /> Unverified</Badge>;
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
              Citizen Identity Console
            </h1>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-in">
             <div className="relative w-32 h-32 rounded-full border-2 border-accent/30 p-1 bg-background overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile?.photoURL || user?.photoURL || ''} />
                  <AvatarFallback className="bg-accent/10 text-3xl text-accent font-bold uppercase">{user?.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
             </div>
             <div className="text-center md:text-left space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                   <h2 className="text-3xl font-headline font-bold text-white">{profile?.displayName || user?.displayName || 'Citizen'}</h2>
                   {getStatusBadge()}
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mt-2">
                   <p className="text-xs font-mono uppercase opacity-70">Kernel ID: {profile?.kernelId || '...'}</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Compliance Submission Card */}
             <Card className="glass-panel border-accent/20 bg-accent/5">
                <CardHeader>
                   <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-accent">
                      <Scale className="h-4 w-4" /> Stablecoin CIP Compliance
                   </CardTitle>
                   <CardDescription className="text-xs italic">Submit NID & TIN to authorize high-value disbursements.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold opacity-60">National ID (NID)</Label>
                      <Input 
                        placeholder="13-17 Digit Number" 
                        className="bg-black/40 border-white/5 h-11 text-sm font-mono"
                        value={nid}
                        onChange={e => setNid(e.target.value)}
                        disabled={profile?.verificationStatus === 'PENDING' || profile?.verificationStatus === 'VERIFIED'}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold opacity-60">Tax ID (TIN)</Label>
                      <Input 
                        placeholder="12 Digit TIN" 
                        className="bg-black/40 border-white/5 h-11 text-sm font-mono"
                        value={tin}
                        onChange={e => setTin(e.target.value)}
                        disabled={profile?.verificationStatus === 'PENDING' || profile?.verificationStatus === 'VERIFIED'}
                      />
                   </div>
                   <Button 
                      className="w-full bg-accent text-background font-bold h-12 uppercase text-[10px] cyan-glow"
                      onClick={handleComplianceSubmit}
                      disabled={isVerifying || !nid || !tin || profile?.verificationStatus === 'PENDING' || profile?.verificationStatus === 'VERIFIED'}
                   >
                      {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      Authorize Identity Binding
                   </Button>
                </CardContent>
             </Card>

             <Card className="glass-panel border-white/5">
                <CardHeader>
                   <CardTitle className="text-sm uppercase flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Security Metadata
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4 text-[10px] font-mono leading-relaxed">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-muted-foreground uppercase">Trust Score</span>
                        <span className="text-accent">{profile?.trustScore || '85.0'}%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-muted-foreground uppercase">Disbursement Cap</span>
                        <span className="text-white">${profile?.verificationStatus === 'VERIFIED' ? '100,000' : '1,000'} / DAY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground uppercase">Vault Node</span>
                        <span className="text-green-400">ANCHORAGE_SECURE_V2</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 p-3 rounded bg-primary/10 border border-primary/20 text-[9px] text-primary">
                      <Zap className="h-3 w-3" />
                      Your assets are held securely off-exchange via Anchorage Digital node.
                   </div>
                </CardContent>
             </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
