
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { KernelProvider } from "@/components/kernel/KernelProvider";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MobileExperienceHub } from "@/components/layout/MobileExperienceHub";
import { GlobalQuickAccess } from "@/components/layout/GlobalQuickAccess";
import { StandardsQuickButton } from "@/components/layout/StandardsQuickButton";
import { SystemPermissionGuard } from "@/components/layout/SystemPermissionGuard";
import { PersistentStandardsPortal } from "@/components/layout/PersistentStandardsPortal";
import { FifaHubPortal } from "@/components/layout/FifaHubPortal";
import { TonProvider } from "@/components/finance/TonProvider";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Sovereign OS | Global Fintech & Civic Infrastructure',
  description: 'FusionPay Sovereign OS provides deterministic infrastructure for global settlements, civic intelligence, and AI-native financial mesh. Resilient to hydrological stressors in regions like Sirajganj.',
  keywords: ['Fintech', 'Sovereign OS', 'Global Payout', 'AI Banking', 'ISO 20022', 'NoorNexus', 'Sirajganj', 'Hydrological Resilience'],
  authors: [{ name: 'Sheikh Farid', url: 'https://noornexus.com' }],
  openGraph: {
    title: 'Sovereign OS | Deterministic Infrastructure',
    description: 'Mission-critical operating system for digital civilizations and resilient commerce.',
    url: 'https://sko-v1.vercel.app',
    siteName: 'Sovereign OS',
    locale: 'en_US',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sovereign OS',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#13151a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Sovereign OS",
    "operatingSystem": "Web, iOS, Android, Telegram",
    "applicationCategory": "FinanceApplication",
    "author": {
      "@type": "Organization",
      "name": "NoorNexus"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Deterministic financial engine for global settlements, remote imperial control via Telegram, and resilient civic infrastructure management."
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const ignoredPatterns = [
                  'MetaMask', 
                  'nkbihfbeogaeaoehlefnkodbefgpgknn',
                  'failed to connect',
                  'Firestore',
                  'backend',
                  'FirebaseError',
                  'Backend didn\\'t respond',
                  'reach Cloud Firestore backend',
                  'offline mode',
                  '10 seconds',
                  'INTERNAL ASSERTION FAILED',
                  'Unexpected state',
                  'b815',
                  'ca9',
                  'Fe\":-1',
                  'WatchChangeAggregator',
                  'WatchStream',
                  'PersistentListenStream',
                  'TON_CONNECT_SDK',
                  'Failed to send analytics events',
                  'auth/network-request-failed',
                  'TypeError: Failed to fetch'
                ];

                const isIgnored = (msg) => {
                  if (!msg) return false;
                  const str = typeof msg === 'string' ? msg : JSON.stringify(msg);
                  return ignoredPatterns.some(pattern => str.includes(pattern));
                };

                const filterArgs = (args) => {
                  try {
                    const combined = args.map(arg => {
                      if (typeof arg === 'string') return arg;
                      if (arg instanceof Error) return arg.message + ' ' + arg.stack;
                      try { return JSON.stringify(arg); } catch(e) { return String(arg); }
                    }).join(' ');
                    return isIgnored(combined);
                  } catch (e) {
                    return false;
                  }
                };

                const originalError = console.error;
                console.error = (...args) => {
                  if (filterArgs(args)) return;
                  originalError.apply(console, args);
                };

                const originalWarn = console.warn;
                console.warn = (...args) => {
                  if (filterArgs(args)) return;
                  originalWarn.apply(console, args);
                };

                window.addEventListener('error', (event) => {
                  const message = event.message || (event.error && event.error.message) || String(event.error) || "";
                  if (isIgnored(message)) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                  }
                }, true);

                window.addEventListener('unhandledrejection', (event) => {
                  const message = (event.reason && event.reason.message) || String(event.reason) || "";
                  if (isIgnored(message)) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                  }
                }, true);
              })();
            `
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
          `}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N53RC4L541"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N53RC4L541', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning={true}>
        <FirebaseClientProvider>
          <KernelProvider>
            <AuthGuard>
              <TonProvider>
                <SidebarProvider>
                  {children}
                  <PersistentStandardsPortal />
                  <FifaHubPortal />
                  <MobileExperienceHub />
                  <GlobalQuickAccess />
                  <StandardsQuickButton />
                  <SystemPermissionGuard />
                </SidebarProvider>
              </TonProvider>
            </AuthGuard>
            <Toaster />
            <FirebaseErrorListener />
          </KernelProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
