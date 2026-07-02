'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showRetry, setShowRetry] = useState(false);

  // Allow public access to landing, login, and checkout pages
  const isPublicPath = 
    pathname === '/' || 
    pathname === '/login' || 
    pathname.startsWith('/checkout/');

  useEffect(() => {
    // If auth is loading for more than 8 seconds, show a retry option
    let timer: NodeJS.Timeout;
    if (loading && !isPublicPath) {
      timer = setTimeout(() => setShowRetry(true), 8000);
    }
    return () => clearTimeout(timer);
  }, [loading, isPublicPath]);

  useEffect(() => {
    if (!loading && !user && !isPublicPath) {
      router.push('/login');
    }
  }, [user, loading, router, pathname, isPublicPath]);

  if (loading && !isPublicPath) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-accent relative z-10" strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-headline font-bold uppercase tracking-[0.3em] text-white">
              Sovereign OS
            </p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground animate-pulse">
              Synchronizing Identity Mesh...
            </p>
          </div>
          
          {showRetry && (
            <div className="mt-8 space-y-4 max-w-xs animate-fade-in">
               <p className="text-xs text-muted-foreground italic">
                 Identity sync is taking longer than expected. This can happen in some mobile environments.
               </p>
               <Button 
                variant="outline" 
                size="sm" 
                className="border-accent/20 text-accent font-bold text-[10px]"
                onClick={() => window.location.reload()}
               >
                 <RefreshCw className="mr-2 h-3 w-3" /> Force Re-Sync
               </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user && !isPublicPath) {
    return null;
  }

  return <>{children}</>;
}
