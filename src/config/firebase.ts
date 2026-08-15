import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { env } from './env.js';

let isFirebaseInitialized = false;

// Robust helper to get the admin instance across ESM/CJS
const getAdminInstance = (): any => {
  return (admin as any)?.default || admin;
};

export const initializeFirebase = (): any => {
  const firebaseAdmin = getAdminInstance();

  try {
    if (firebaseAdmin?.apps && Array.isArray(firebaseAdmin.apps) && firebaseAdmin.apps.length > 0) {
      isFirebaseInitialized = true;
      return firebaseAdmin.app();
    }

    // Strategy 1: Environment Variables
    if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      const app = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      isFirebaseInitialized = true;
      console.log('✅ Firebase Admin SDK initialized via Environment Variables');
      return app;
    }

    // Strategy 2: Local serviceAccountKey.json file
    const localKeyPath = env.FIREBASE_SERVICE_ACCOUNT_PATH 
      ? path.resolve(process.cwd(), env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.resolve(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(localKeyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
      const app = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
      });
      isFirebaseInitialized = true;
      console.log(`✅ Firebase Admin SDK initialized via ${path.basename(localKeyPath)}`);
      return app;
    }

    // Strategy 3: Google Cloud ADC (Only if gcloud/GCP is present)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCLOUD_PROJECT) {
      const app = firebaseAdmin.initializeApp({
        projectId: env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT,
        credential: firebaseAdmin.credential.applicationDefault(),
      });
      isFirebaseInitialized = true;
      console.log('✅ Firebase Admin SDK initialized via Google Cloud ADC');
      return app;
    }

    isFirebaseInitialized = false;
    return null;
  } catch (error: any) {
    console.warn('⚠️ Firebase Admin SDK running in offline/mock mode:', error?.message || error);
    isFirebaseInitialized = false;
    return null;
  }
};

export const getFirebaseApp = (): any => initializeFirebase();
export const getFirestore = (): any => (isFirebaseInitialized ? getAdminInstance().firestore() : null);
export const getFirebaseAuth = (): any => (isFirebaseInitialized ? getAdminInstance().auth() : null);
