'use client';

import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, Lock, ShieldCheck, Zap, Activity, Network, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      {/* Immersive Background Elements to fill the space */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating System Badges in "empty" areas */}
        <div className="hidden xl:flex absolute top-20 left-20 flex-col gap-4 animate-fade-in">
           <div className="p-4 rounded-xl glass-panel border-accent/20 flex items-center gap-3">
              <Activity className="h-5 w-5 text-accent" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Kernel Status</p>
                <p className="text-xs font-bold text-white">NOMINAL // STABLE</p>
              </div>
           </div>
           <div className="p-4 rounded-xl glass-panel border-white/5 flex items-center gap-3 ml-8">
              <Network className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Anycast Mesh</p>
                <p className="text-xs font-bold text-white">42 NODES ACTIVE</p>
              </div>
           </div>
        </div>

        <div className="hidden xl:flex absolute bottom-20 right-20 flex-col gap-4 items-end animate-fade-in" style={{ animationDelay: '0.5s' }}>
           <div className="p-4 rounded-xl glass-panel border-white/5 flex items-center gap-3 mr-8 text-right">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Encryption</p>
                <p className="text-xs font-bold text-white">AES-256-GCM</p>
              </div>
              <Lock className="h-5 w-5 text-green-400" />
           </div>
           <div className="p-4 rounded-xl glass-panel border-accent/20 flex items-center gap-3 text-right">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Compute Power</p>
                <p className="text-xs font-bold text-white">1.8 PETAHASH</p>
              </div>
              <Cpu className="h-5 w-5 text-accent" />
           </div>
        </div>
      </div>

      {/* Main Cohesive Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-12">
        
        {/* Brand Header */}
        <div className="text-center space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mx-auto">
            <Zap className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Sovereign OS v1.2</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white leading-tight tracking-tighter">
            ESTABLISH <span className="text-accent italic">KERNEL</span> IDENTITY
          </h1>
          <p className="text-muted-foreground text-sm md:text-base px-4">
            Deterministic governance for next-gen civic and financial planes. Access the core mesh through secure biometric handshake.
          </p>
        </div>

        {/* Unified Login Card - Larger and centered to feel full */}
        <Card className="w-full max-w-xl glass-panel border-white/10 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
          
          <CardHeader className="text-center space-y-6 pt-12 pb-8 px-8">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-accent flex items-center justify-center cyan-glow group-hover:scale-110 transition-transform">
              <Globe className="h-10 w-10 text-accent-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-headline font-bold tracking-widest uppercase italic text-white">
                Gateway Portal
              </CardTitle>
              <CardDescription className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/60">
                Identity Binding Protocol
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-10 pb-12 px-12">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-1 text-center">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Local Node</p>
                  <p className="text-xs font-bold text-green-400">VALIDATED</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-1 text-center">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Mesh Link</p>
                  <p className="text-xs font-bold text-accent">READY</p>
                </div>
              </div>
              
              <Button 
                className="w-full h-14 cyan-glow bg-accent text-background font-bold uppercase tracking-widest text-sm hover:bg-accent/90 transition-all active:scale-[0.98] rounded-xl"
                onClick={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" />
                    Syncing Fabric...
                  </span>
                ) : (
                  'Sign in with Google Account'
                )}
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground tracking-[0.5em]">
                <span className="bg-[#1a1c23] px-4">Authorized Link</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
               <p className="text-[10px] text-center text-muted-foreground font-mono uppercase opacity-50 tracking-wider">
                  Session ID: <span className="text-accent">{sessionId}</span> // Mesh-Bound
               </p>
               <div className="flex items-center gap-4 pt-2">
                  <ShieldCheck className="h-4 w-4 text-green-500/50" />
                  <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-accent w-3/4 animate-pulse" />
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Footer labels for more balance */}
        <div className="hidden md:flex justify-between w-full max-w-xl text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mt-4">
           <span>Sovereign Security v1.2</span>
           <span>Deterministic Execution Path</span>
           <span>© 2024 S.K.O.</span>
        </div>
      </div>
    </div>
  );
}
