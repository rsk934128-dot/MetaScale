'use client';

import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, Lock, ShieldCheck } from 'lucide-react';
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
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md glass-panel relative z-10 border-white/5 ring-1 ring-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-accent flex items-center justify-center cyan-glow">
            <Globe className="h-8 w-8 text-accent-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-headline font-bold tracking-tight uppercase italic text-white">
              Sovereign OS
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Mission-Critical Infrastructure
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-10 px-8">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span>Deterministic Identity Binding</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Lock className="h-4 w-4 text-accent" />
                <span>Zero-Trust Protocol V2.1</span>
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
          
          <p className="text-[10px] text-center text-muted-foreground font-mono uppercase">
            Kernel Version 1.2.0-stable // Auth Plane Ready
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
