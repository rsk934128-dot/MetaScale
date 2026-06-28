'use client';

import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, Lock, ShieldCheck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Balanced Background Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Symmetric Glow Effects */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side: Brand & Info */}
        <div className="hidden lg:flex flex-col space-y-6 text-left p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent w-fit">
            <Zap className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Next-Gen OS Active</span>
          </div>
          <h1 className="text-5xl font-headline font-bold text-white leading-tight">
            Sovereign <span className="text-accent italic">Infrastructure</span> Mesh
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Deterministic governance for civic and financial planes. Securely access the SHURUKKHA-OS v1.2 kernel.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 space-y-2">
              <ShieldCheck className="h-6 w-6 text-green-400" />
              <p className="text-xs font-bold text-white uppercase tracking-tighter">Zero-Trust</p>
              <p className="text-[10px] text-muted-foreground">Identity bound to anycast mesh nodes.</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 space-y-2">
              <Lock className="h-6 w-6 text-accent" />
              <p className="text-xs font-bold text-white uppercase tracking-tighter">Encryption</p>
              <p className="text-[10px] text-muted-foreground">AES-256-GCM kernel protection.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md glass-panel border-white/10 ring-1 ring-white/10 shadow-2xl shadow-accent/5">
            <CardHeader className="text-center space-y-4 pt-10">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-accent flex items-center justify-center cyan-glow lg:hidden">
                <Globe className="h-8 w-8 text-accent-foreground" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-headline font-bold tracking-tight uppercase italic text-white">
                  Kernel Login
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Authentication Plane v1.2
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pb-12 px-8">
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span>Anycast Node-04 Validated</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>Deterministic Handshake Ready</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 cyan-glow bg-accent text-background font-bold uppercase tracking-widest text-xs hover:bg-accent/90 transition-all active:scale-[0.98]"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Establishing Link...' : 'Sign in with Google'}
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[8px] uppercase font-bold text-muted-foreground tracking-widest">
                  <span className="bg-card px-2">Authorized Access Only</span>
                </div>
              </div>

              <p className="text-[9px] text-center text-muted-foreground font-mono uppercase opacity-50">
                Session ID: {Math.random().toString(36).substring(7).toUpperCase()} // Mesh-Bound
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
