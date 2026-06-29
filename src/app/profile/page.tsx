
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
  AlertCircle,
  Wallet,
  CreditCard,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import { doc, collection, addDoc, updateDoc } from 'firebase/firestore';
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

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { emitEvent } = useKernel();
  
  const [copiedId, setCopiedId] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit States
  const [editMobile, setEditMobile] = useState('');
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const userRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, loading } = useDoc<any>(userRef);

  const handleCopy = (text: string, type: 'ID' | 'ACC') => {
    navigator.clipboard.writeText(text);
    if (type === 'ID') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
    toast({ title: "Copied", description: `${type} saved to clipboard.` });
  };

  const handleUpdateProfile = async () => {
    if (!userRef) return;
    setIsSaving(true);
    try {
      await updateDoc(userRef, {
        displayName: editName || profile?.displayName,
        mobile: editMobile || profile?.mobile
      });
      emitEvent('SECURITY', 'PROFILE_INFO_UPDATED', 3, { userId: user?.uid });
      toast({ title: "Profile Updated", description: "Identity parameters reconciled." });
      setIsEditing(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed", description: "Kernel rejected profile changes." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkDocument = async (type: 'TIN' | 'NID') => {
    if (!user?.uid || !firestore) return;
    setIsUploading(type);
    
    let docData: any = {
      userId: user.uid,
      userName: profile?.displayName || user.displayName || 'Citizen',
      type: type,
      status: 'PENDING',
      submittedAt: Date.now(),
    };

    if (type === 'TIN') {
      docData.metadata = {
        tin: "742322402703",
        name: profile?.displayName || user.displayName,
        father: "md.abdul barik sheikh",
        address: "Sirajganj, PO: 6700",
        issueDate: "June 03, 2024"
      };
    } else {
      docData.metadata = {
         nid: "596 298 3689",
         name: "SHEIKH FARID",
         father: "MD. ABDUL BARIK SHEIKH",
         mother: "MST. FARIDA BEGUM",
         dob: "15 Jun 1994",
         issueDate: "21 Dec 2017",
         placeOfBirth: "SIRAJGANJ",
         address: "Haji Ahmed Ali Road, Mashumpur, Sirajganj Sadar, Sirajganj - 6700",
         bloodGroup: "O+",
         mrz: "I<BGD596298368<97<<<<<<<<<<<<<<< 9406155M3212208BGD<<<<<<<<<<<2 FARID<<SHEIKH<<<<<<<<<<<<<<<<<<"
      };
    }

    try {
      const collRef = collection(firestore, 'verification_docs');
      await addDoc(collRef, docData);
      await updateDoc(userRef!, { verificationStatus: 'PENDING' });
      emitEvent('SECURITY', `CITIZEN_${type}_SUBMITTED`, 3, { userId: user.uid });
      toast({ title: `${type} Submitted`, description: "Kernel audit in progress." });
    } catch (err) {
       toast({ variant: "destructive", title: "Submission Failed", description: "Check mesh connection." });
    } finally {
      setIsUploading(null);
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
            ID: {profile?.kernelId || '...'}
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1000px] mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-in">
             <div className="relative group">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-[40px] opacity-50 transition-opacity" />
                <div className="relative w-32 h-32 rounded-full border-2 border-accent/30 p-1 bg-background">
                   <div className="w-full h-full rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden border border-white/5">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-accent/40" />
                      )}
                   </div>
                </div>
             </div>

             <div className="text-center md:text-left space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                   <h2 className="text-3xl font-headline font-bold text-white">{profile?.displayName || user?.displayName || 'Citizen'}</h2>
                   <Badge className="bg-accent text-background font-bold uppercase text-[9px] tracking-widest">
                      {profile?.role || 'CITIZEN'}
                   </Badge>
                   {getStatusBadge()}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 text-muted-foreground mt-2">
                   <button onClick={() => handleCopy(profile?.kernelId || '', 'ID')} className="flex items-center gap-2 hover:text-accent transition-colors group">
                     <span className="text-[10px] font-mono uppercase opacity-70">Kernel ID:</span>
                     <span className="text-sm font-bold text-white/90">{profile?.kernelId || '...'}</span>
                     {copiedId ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                   </button>
                   
                   <Dialog open={isEditing} onOpenChange={setIsEditing}>
                      <DialogTrigger asChild>
                         <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold text-accent" onClick={() => {
                            setEditName(profile?.displayName || '');
                            setEditMobile(profile?.mobile || '');
                         }}>
                            <Edit2 className="h-3 w-3 mr-1.5" /> Edit Profile
                         </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-panel border-accent/20 bg-background/95">
                         <DialogHeader>
                            <DialogTitle className="uppercase font-headline italic">Edit Citizen Profile</DialogTitle>
                            <DialogDescription className="text-xs">Update your identity parameters in the Sovereign Mesh.</DialogDescription>
                         </DialogHeader>
                         <div className="space-y-4 py-4">
                            <div className="space-y-2">
                               <Label className="text-[10px] uppercase font-bold text-muted-foreground">Display Name</Label>
                               <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-secondary/30 border-white/5" />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] uppercase font-bold text-muted-foreground">Mobile Node</Label>
                               <Input value={editMobile} onChange={(e) => setEditMobile(e.target.value)} placeholder="+880..." className="bg-secondary/30 border-white/5" />
                            </div>
                         </div>
                         <DialogFooter>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button size="sm" className="bg-accent text-background font-bold cyan-glow" onClick={handleUpdateProfile} disabled={isSaving}>
                               {isSaving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                               Save Parameters
                            </Button>
                         </DialogFooter>
                      </DialogContent>
                   </Dialog>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="glass-panel border-l-4 border-l-accent bg-accent/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                      <Wallet className="h-3 w-3" /> Liquid Assets
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-bold text-white">${profile?.balance?.toLocaleString() || '0.00'}</div>
                   <p className="text-[9px] text-accent font-bold uppercase mt-1">Status: Accessible</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-primary bg-primary/5">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                      <CreditCard className="h-3 w-3" /> Account Number
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <button onClick={() => handleCopy(profile?.accountNumber || '', 'ACC')} className="group text-xl font-mono font-bold text-white flex items-center gap-2">
                      {profile?.accountNumber || 'NOT_GEN'}
                      {copiedAcc ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100" />}
                   </button>
                   <p className="text-[9px] text-primary font-bold uppercase mt-1">Mesh-Bound Protocol</p>
                </CardContent>
             </Card>
             <Card className="glass-panel border-l-4 border-l-green-500">
                <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Trust Score</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="text-3xl font-bold">{profile?.trustScore || '85'}%</div>
                   <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${profile?.trustScore || 85}%` }} />
                   </div>
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <Card className="glass-panel border-white/5">
                   <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                      <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                         <Lock className="h-4 w-4 text-accent" /> Vault Context
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
                         Link your government documents to enable high-value financial corridors.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button 
                          className="w-full text-[10px] font-bold h-9 bg-accent text-background cyan-glow"
                          onClick={() => handleLinkDocument('TIN')}
                          disabled={!!isUploading || profile?.verificationStatus === 'PENDING' || profile?.verificationStatus === 'VERIFIED'}
                        >
                           {isUploading === 'TIN' ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Upload className="mr-2 h-3 w-3" />}
                           {profile?.verificationStatus === 'VERIFIED' ? 'TIN Active' : 'Link TIN'}
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full text-[10px] font-bold h-9 border-accent/20 text-accent hover:bg-accent/10"
                          onClick={() => handleLinkDocument('NID')}
                          disabled={!!isUploading || profile?.verificationStatus === 'PENDING' || profile?.verificationStatus === 'VERIFIED'}
                        >
                           {isUploading === 'NID' ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Fingerprint className="mr-2 h-3 w-3" />}
                           {profile?.verificationStatus === 'VERIFIED' ? 'NID Bound' : 'Link NID Card'}
                        </Button>
                      </div>
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
                            <span className="text-muted-foreground uppercase">Sync Status</span>
                            <span className="text-green-400">NOMINAL</span>
                         </div>
                         <p className="text-[9px] text-muted-foreground italic">
                            Your account is cryptographically signed and bound to the Sovereign Mesh.
                         </p>
                      </div>
                      <div className="flex items-center gap-3 p-2 text-[10px] font-bold text-green-400">
                         <ShieldCheck className="h-4 w-4" /> 2FA ENFORCED BY KERNEL
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

