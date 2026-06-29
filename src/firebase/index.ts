'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { firebaseConfig } from './config';

let firestoreInstance: any = null;
let authInstance: any = null;

export function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  if (!firestoreInstance) {
    try {
      // Robust initialization with persistence and multi-tab support
      firestoreInstance = initializeFirestore(app, {
        localCache: persistentLocalCache({ 
          tabManager: persistentMultipleTabManager() 
        })
      });
    } catch (e) {
      // Fallback if already initialized (common during HMR in development)
      firestoreInstance = getFirestore(app);
    }
  }
  
  if (!authInstance) {
    authInstance = getAuth(app);
  }

  // Initialize App Check only on the client side if key is available
  if (typeof window !== 'undefined') {
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
  }

  return { app, firestore: firestoreInstance, auth: authInstance };
}

export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
