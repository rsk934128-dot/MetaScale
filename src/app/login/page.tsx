
'use client';

import { useAuth, useFirestore } from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Globe, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Activity, 
  User, 
  Mail, 
  Phone, 
  Key,
  Loader2,
  AlertCircle,
  Users,
  ChevronLeft,
  Smartphone,
  WifiOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

const ADMIN_EMAIL = 'rsk934128@gmail.com';
const DEFAULT_TEAM_ID = 'team_UJR6KEPUrWUszD8jdhiyjQgV';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) {
      setIsTelegram(true);
    }
  }, []);

  const generateAccountNumber = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

  const getAuthErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/network-request-failed': return 'নেটওয়ার্ক সংযোগ বিচ্ছিন্ন হয়েছে। দয়া করে আপনার ইন্টারনেট কানেকশন চেক করুন এবং পুনরায় চেষ্টা করুন।';
      case 'auth/invalid-email': return 'ইমেইল অ্যাড্রেসটি সঠিক নয়।';
      case 'auth/wrong-password': return 'ভুল পাসওয়ার্ড দেওয়া হয়েছে।';
      case 'auth/user-not-found': return 'এই ইমেইল দিয়ে কোনো একাউন্ট পাওয়া যায়নি।';
      case 'auth/email-already-in-use': return 'এই ইমেইলটি অলরেডি অন্য একটি একাউন্টে ব্যবহার করা হয়েছে।';
      case 'auth/weak-password': return 'পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে।';
      case 'auth/popup-blocked': return 'পপআপ ব্লক করা হয়েছে। ইমেইল/পাসওয়ার্ড ব্যবহার করুন।';
      case 'auth/popup-closed-by-user': return 'লগইন উইন্ডোটি বন্ধ করা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।';
      case 'auth/cancelled-popup-request': return 'পূর্ববর্তী লগইন রিকোয়েস্ট বাতিল করা হয়েছে।';
      default: return `ত্রুটি: ${errorCode}। দয়া করে আবার চেষ্টা করুন।`;
    }
  };

  const updateOnlineStatus = async (uid: string) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', uid);
    await updateDoc(userRef, {
      lastLogin: Date.now(),
      isOnline: true
    }).catch(() => {});
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const isAdmin = result.user.email === ADMIN_EMAIL;
        const userRef = doc(firestore, 'users', result.user.uid);
        
        const userSnap = await getDoc(userRef);
        const userData = {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          kernelId: `SKO-${result.user.uid.substring(0, 6).toUpperCase()}`,
          teamId: DEFAULT_TEAM_ID,
          lastLogin: Date.now(),
          isOnline: true,
          role: isAdmin ? 'ADMIN' : 'CITIZEN',
          plan: 'FREE',
          ...(userSnap.exists() ? {} : { 
            accountNumber: generateAccountNumber(), 
            balance: 1000,
            trustScore: 85.0,
            verificationStatus: 'UNVERIFIED'
          })
        };

        await setDoc(userRef, userData, { merge: true });
        toast({ title: "Identity Bound", description: "Sovereign Mesh link established successfully." });
        router.replace('/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        toast({
          variant: "destructive",
          title: "Network Failed",
          description: "সার্ভারে কানেক্ট করা যাচ্ছে না। আপনার ইন্টারনেট সংযোগ যাচাই করুন।",
        });
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Sign-in Cancelled",
          description: "লগইন পপআপটি বন্ধ করা হয়েছে।",
        });
      } else if (error.code === 'auth/popup-blocked') {
        toast({
          variant: "destructive",
          title: "Popup Blocked",
          description: "আপনার ব্রাউজার পপআপ ব্লক করেছে। সেটিংস চেক করুন অথবা ইমেইল দিয়ে লগইন করুন।",
        });
      } else {
        console.error("Auth Error:", error);
        toast({ 
          variant: "destructive", 
          title: "Auth Failed", 
          description: getAuthErrorMessage(error.code) 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const isAdmin = email === ADMIN_EMAIL;
      const userRef = doc(firestore, 'users', userCredential.user.uid);
      const userData = {
        uid: userCredential.user.uid,
        displayName: name,
        email: email,
        mobile: mobile,
        kernelId: `SKO-${userCredential.user.uid.substring(0, 6).toUpperCase()}`,
        teamId: DEFAULT_TEAM_ID,
        accountNumber: generateAccountNumber(),
        balance: 1000.00,
        role: isAdmin ? 'ADMIN' : 'CITIZEN',
        plan: 'FREE',
        trustScore: 85.0,
        verificationStatus: 'UNVERIFIED',
        createdAt: serverTimestamp(),
        lastLogin: Date.now(),
        isOnline: true,
      };

      await setDoc(userRef, userData);
      toast({ title: "Protocol Established", description: "কার্নেল আইডেন্টিটি তৈরি হয়েছে।" });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Registration Failed", description: getAuthErrorMessage(error.code) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await updateOnlineStatus(res.user.uid);
      toast({ title: "Access Granted", description: "ডিটারমিনিস্টিক লিঙ্ক সফলভাবে তৈরি হয়েছে।" });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: getAuthErrorMessage(error.code) });
    } finally {
      setIsLoading(false);
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setPhone] = useState('');

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-accent transition-colors">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Mesh
          </Link>
        </Button>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-8">
        <div className="text-center space-y-4 max-w-2xl flex flex-col items-center">
          <Logo size="xl" className="mb-2" />
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
            <Users className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">FusionPay Organization Mesh</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter uppercase">
            ESTABLISH <span className="text-accent italic">TEAM</span> IDENTITY
          </h1>
        </div>

        {isTelegram && (
          <div className="max-w-lg w-full p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex gap-4 items-center animate-fade-in shadow-xl">
             <Smartphone className="h-6 w-6 text-yellow-500 shrink-0" />
             <div className="space-y-1">
                <p className="text-[11px] font-bold text-white uppercase">Telegram Mini App Detected</p>
                <p className="text-[10px] text-white/80 leading-relaxed italic">
                  পপআপ ব্লকিং এড়াতে সরাসরি <b>Email & Password</b> ব্যবহার করা নিরাপদ। গুগল লগইন কাজ না করলে এটি ব্যবহার করুন।
                </p>
             </div>
          </div>
        )}

        <Card className="w-full max-w-lg glass-panel border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/30 rounded-none border-b border-white/5 h-14">
              <TabsTrigger value="login" className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent uppercase text-[10px] font-bold tracking-widest">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent uppercase text-[10px] font-bold tracking-widest">Register</TabsTrigger>
            </TabsList>

            <CardContent className="p-8 space-y-6">
              <TabsContent value="login" className="space-y-4 m-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Gateway Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                      <Input type="email" placeholder="identity@mesh.gov" className="pl-10 bg-secondary/30 border-white/5 h-12 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Access Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                      <Input type="password" placeholder="••••••••" className="pl-10 bg-secondary/30 border-white/5 h-12 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </div>
                  <Button className="w-full h-12 cyan-glow bg-accent text-background font-bold uppercase tracking-widest text-xs" disabled={isLoading} type="submit">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Access"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 m-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Full Name</Label>
                      <Input placeholder="Citizen Name" className="bg-secondary/30 border-white/5 h-11 text-xs" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Mobile Node</Label>
                      <Input placeholder="+880..." className="bg-secondary/30 border-white/5 h-11 text-xs" value={mobile} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">System Email</Label>
                    <Input type="email" placeholder="new_identity@mesh.gov" className="bg-secondary/30 border-white/5 h-11 text-xs" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Define Access Key</Label>
                    <Input type="password" placeholder="Min 6 characters" className="bg-secondary/30 border-white/5 h-11 text-xs" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button className="w-full h-12 cyan-glow bg-accent text-background font-bold uppercase tracking-widest text-xs" disabled={isLoading} type="submit">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Initialize Kernel Link"}
                  </Button>
                </form>
              </TabsContent>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[9px] uppercase font-bold text-muted-foreground tracking-[0.4em]">
                  <span className="bg-card px-4">Alternate Verification</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-all group" onClick={handleGoogleLogin} disabled={isLoading}>
                <Globe className="mr-2 h-4 w-4 text-accent group-hover:animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sign in with Google</span>
              </Button>
            </CardContent>
          </Tabs>
        </Card>

        <div className="flex justify-between w-full max-w-lg text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
           <span>FusionPay Security v1.2</span>
           <span>Team: {DEFAULT_TEAM_ID}</span>
           <span>© 2024 S.K.O.</span>
        </div>
      </div>
    </div>
  );
}
