"use client";

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import React from 'react';

export function TonProvider({ children }: { children: React.ReactNode }) {
  // Use current origin or fallback for development
  const manifestUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/tonconnect-manifest.json`
    : 'https://meta-scale.vercel.app/tonconnect-manifest.json';

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
