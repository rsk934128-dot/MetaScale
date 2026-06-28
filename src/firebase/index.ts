'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getPerformance } from 'firebase/performance';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  let firestore;
  try {
    // Attempt to initialize with custom settings
    firestore = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
  } catch (e) {
    // If already initialized (common during HMR), get the existing instance
    firestore = getFirestore(app);
  }
  
  const auth = getAuth(app);

  // Initialize App Check and Performance only on the client side
  if (typeof window !== 'undefined') {
    // App Check
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && siteKey !== 'YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY') {
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
      } catch (e) {
        // App Check might also be already initialized
      }
    }

    // Performance Monitoring
    try {
      getPerformance(app);
    } catch (e) {
      // Performance might already be initialized
    }
  }

  return { app, firestore, auth };
}

export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
