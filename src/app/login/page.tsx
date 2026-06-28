
'use client';

import { useAuth, useFirestore } from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/card';
import { 
  Globe, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Network, 
  Cpu, 
  User, 
  Mail, 
  Phone, 
  Key,
  ArrowRight,
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

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setPhone] = useState('');

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Save/Update basic profile on Google Login
      const userRef = doc(firestore, 'users', result.user.uid);
      setDoc(userRef, {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        kernelId: `SKO-${result.user.uid.substring(0, 6).toUpperCase()}`,
        lastLogin: serverTimestamp(),
      }, { merge: true }).catch(async (err) => {
        const pErr = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: { uid: result.user.uid }
        });
        errorEmitter.emit('permission-error', pErr);
      });

      toast({ title: "Identity Bound", description: "Google authentication successful." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Handshake Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({ variant: "destructive", title: "Incomplete Data", description: "Please fill all required fields." });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Save extended profile to Firestore
      const userRef = doc(firestore, 'users', userCredential.user.uid);
      const userData = {
        uid: userCredential.user.uid,
        displayName: name,
        email: email,
        mobile: mobile,
        kernelId: `SKO-${userCredential.user.uid.substring(0, 6).toUpperCase()}`,
        role: 'CITIZEN',
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

      toast({ title: "Protocol Established", description: "Kernel identity created successfully." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Registration Blocked", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Access Granted", description: "Deterministic link established." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Auth Failure", description: "Invalid credentials or unauthorized access." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating System Badges */}
        <div className="hidden xl:flex absolute top-20 left-20 flex-col gap-4 animate-fade-in">
           <div className="p-4 rounded-xl glass-panel border-accent/20 flex items-center gap-3">
              <Activity className="h-5 w-5 text-accent" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Kernel Status</p>
                <p className="text-xs font-bold text-white">NOMINAL // STABLE</p>
              </div>
           </div>
        </div>

        <div className="hidden xl:flex absolute bottom-20 right-20 flex-col gap-4 items-end animate-fade-in" style={{ animationDelay: '0.5s' }}>
           <div className="p-4 rounded-xl glass-panel border-white/5 flex items-center gap-3 text-right">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Encryption</p>
                <p className="text-xs font-bold text-white">AES-256-GCM</p>
              </div>
              <Lock className="h-5 w-5 text-green-400" />
           </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-8">
        {/* Brand Header */}
        <div className="text-center space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mx-auto">
            <Zap className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Sovereign OS v1.2</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter">
            ESTABLISH <span className="text-accent italic">KERNEL</span> IDENTITY
          </h1>
        </div>

        <Card className="w-full max-w-lg glass-panel border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
          
          <Tabs defaultValue="login" className="w-full">
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
                          placeholder="Command Name" 
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
                  <span className="bg-[#1a1c23] px-4">Alternate Verification</span>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <Globe className="mr-2 h-4 w-4 text-accent group-hover:animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sign in with Google Workspace</span>
              </Button>

              <div className="pt-4 flex flex-col items-center gap-2">
                 <p className="text-[9px] text-center text-muted-foreground font-mono uppercase opacity-50 tracking-wider">
                    Session ID: <span className="text-accent">{sessionId}</span> // Identity Mesh-Bound
                 </p>
                 <div className="flex items-center gap-4">
                    <ShieldCheck className="h-4 w-4 text-green-500/50" />
                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-accent w-3/4 animate-pulse" />
                    </div>
                 </div>
              </div>
            </CardContent>
          </Tabs>
        </Card>

        {/* Footer info */}
        <div className="flex justify-between w-full max-w-lg text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
           <span>Sovereign Security v1.2</span>
           <span>Deterministic Execution Path</span>
           <span>© 2024 S.K.O.</span>
        </div>
      </div>
    </div>
  );
}
