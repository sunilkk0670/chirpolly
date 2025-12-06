import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase config is provided via Vite env variables (prefix VITE_)
const firebaseConfig = {
  apiKey: (import.meta.env as any).VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: (import.meta.env as any).VITE_FIREBASE_AUTH_DOMAIN || 'demo-auth-domain.firebaseapp.com',
  projectId: (import.meta.env as any).VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: (import.meta.env as any).VITE_FIREBASE_STORAGE_BUCKET || 'demo-bucket.appspot.com',
  messagingSenderId: (import.meta.env as any).VITE_FIREBASE_MESSAGING_SENDER_ID || 'demo-sender-id',
  appId: (import.meta.env as any).VITE_FIREBASE_APP_ID || 'demo-app-id',
};
console.log('🔥 FIREBASE CONFIG DEBUG:', {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 5)}...` : 'MISSING',
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Check if running on localhost (development)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Check if we're in demo mode (missing real Firebase config OR running on localhost for testing)
const isDemoMode = !(import.meta.env as any).VITE_FIREBASE_API_KEY || isLocalhost;

if (isDemoMode) {
  console.warn('⚠️ Running in demo mode - Firebase not configured. Set VITE_FIREBASE_* environment variables for production.');
}

// Initialize once for the app lifecycle
let app;
let auth;
let db;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);

  // Use Firebase emulator for localhost development
  // TEMPORARILY DISABLED - Using production Firebase for testing
  /*
  if (isLocalhost && !isDemoMode) {
    console.log('🔧 Using Firebase Emulator for localhost development');
    try {
      // Check if emulator is already connected
      if (auth.emulatorConfig === null) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
    } catch (e) {
      console.log('Auth emulator not available, using production Firebase');
    }
    try {
      if (!db._firestoreClient) {
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
    } catch (e) {
      console.log('Firestore emulator not available, using production Firebase');
    }
  }
  */
} catch (error) {
  console.error('Firebase initialization error:', error);
  if (!isDemoMode) {
    console.error('Please check your Firebase configuration in .env.local');
    console.error('For localhost development, you can:');
    console.error('1. Add localhost:3000 to authorized domains in Firebase Console');
    console.error('2. Or use Firebase Emulator Suite (recommended for development)');
  }
  // In demo mode, we'll still try to initialize but with demo config
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  try {
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.warn('Using fallback auth/db in demo mode');
  }
}

export { auth, db };
export const isDemoModeEnabled = isDemoMode;
