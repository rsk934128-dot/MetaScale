
'use client';

import { useAuth, useFirestore } from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
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
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Logo } from '@/components/ui/logo';

const ADMIN_EMAIL = 'rubels1k994@gmail.com';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setPhone] = useState('');

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  const generateAccountNumber = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        const isAdmin = result.user.email === ADMIN_EMAIL;
        const userRef = doc(firestore, 'users', result.user.uid);
        
        // Check if user already exists to preserve balance
        const userSnap = await getDoc(userRef);
        
        const userData = {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          kernelId: `SKO-${result.user.uid.substring(0, 6).toUpperCase()}`,
          lastLogin: serverTimestamp(),
          role: isAdmin ? 'ADMIN' : 'CITIZEN',
          ...(userSnap.exists() ? {} : { 
            accountNumber: generateAccountNumber(), 
            balance: 1000,
            trustScore: 85.0
          })
        };

        setDoc(userRef, userData, { merge: true }).catch(async (err) => {
          const pErr = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: userData
          });
          errorEmitter.emit('permission-error', pErr);
        });

        toast({ 
          title: isAdmin ? "Admin Handshake Success" : "Identity Bound", 
          description: isAdmin ? "Welcome back, System Administrator." : "Sovereign Mesh link established successfully." 
        });
        
        router.replace('/dashboard');
      }
    } catch (error: any) {
      let errorDesc = "Authentication sequence interrupted.";
      if (error.code === 'auth/operation-not-allowed') errorDesc = "Google login is not enabled in Firebase console.";
      else if (error.code === 'auth/popup-closed-by-user') errorDesc = "Login popup was closed.";

      toast({ 
        variant: "destructive", 
        title: "Handshake Failed", 
        description: errorDesc 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({ variant: "destructive", title: "Incomplete Data", description: "All fields are required." });
      return;
    }
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
        accountNumber: generateAccountNumber(),
        balance: 1000.00, // Starting balance
        role: isAdmin ? 'ADMIN' : 'CITIZEN',
        trustScore: 85.0,
        createdAt: serverTimestamp(),
      };

      setDoc(userRef, userData).catch(async (err) => {
        const pErr = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData
        });
        errorEmitter.emit('permission-error', pErr);
      });

      toast({ title: isAdmin ? "Admin Protocol Active" : "Protocol Established", description: "Kernel identity created with $1,000 starting balance." });
      router.replace('/dashboard');
    } catch (error: any) {
      let msg = "Registration failed.";
      if (error.code === 'auth/email-already-in-use') msg = "Email already registered.";
      toast({ variant: "destructive", title: "Registration Blocked", description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Email and access key required." });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Access Granted", description: "Deterministic link established." });
      router.replace('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Auth Failure", description: "Incorrect credentials or account not found." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-8">
        <div className="text-center space-y-4 max-w-2xl flex flex-col items-center">
          <Logo size="xl" className="mb-2" />
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mx-auto">
            <Zap className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Sovereign OS v1.2</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter uppercase">
            ESTABLISH <span className="text-accent italic">KERNEL</span> IDENTITY
          </h1>
        </div>

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
                      <Input 
                        type="email" 
                        placeholder="identity@mesh.gov" 
                        className="pl-10 bg-secondary/30 border-white/5 h-12 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Access Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 bg-secondary/30 border-white/5 h-12 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full h-12 cyan-glow bg-accent text-background font-bold uppercase tracking-widest text-xs"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Access"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 m-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                        <Input 
                          placeholder="Citizen Name" 
                          className="pl-10 bg-secondary/30 border-white/5 h-11 text-xs"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Mobile Node</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                        <Input 
                          placeholder="+880..." 
                          className="pl-10 bg-secondary/30 border-white/5 h-11 text-xs"
                          value={mobile}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">System Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                      <Input 
                        type="email" 
                        placeholder="new_identity@mesh.gov" 
                        className="pl-10 bg-secondary/30 border-white/5 h-11 text-xs"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Define Access Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                      <Input 
                        type="password" 
                        placeholder="Min 6 characters" 
                        className="pl-10 bg-secondary/30 border-white/5 h-11 text-xs"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full h-12 cyan-glow bg-accent text-background font-bold uppercase tracking-widest text-xs"
                    disabled={isLoading}
                    type="submit"
                  >
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

              <Button 
                variant="outline"
                className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <Globe className="mr-2 h-4 w-4 text-accent group-hover:animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sign in with Google</span>
              </Button>
            </CardContent>
          </Tabs>
        </Card>

        <div className="flex justify-between w-full max-w-lg text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
           <span>Sovereign Security v1.2</span>
           <span>Deterministic Execution Path</span>
           <span>© 2024 S.K.O.</span>
        </div>
      </div>
    </div>
  );
}
