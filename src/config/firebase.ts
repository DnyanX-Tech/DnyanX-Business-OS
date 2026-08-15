import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { env } from './env.js';

let isFirebaseInitialized = false;

export const initializeFirebase = (): admin.app.App | null => {
  if (admin.apps.length > 0) {
    isFirebaseInitialized = true;
    return admin.app();
  }

  try {
    // Strategy 1: Environment Variables (Recommended for Production & Cloud)
    if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      const app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      isFirebaseInitialized = true;
      console.log('✅ Firebase Admin SDK initialized via Environment Variables');
      return app;
    }

    // Strategy 2: Local serviceAccountKey.json file (Local Dev Only)
    const localKeyPath = env.FIREBASE_SERVICE_ACCOUNT_PATH 
      ? path.resolve(process.cwd(), env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.resolve(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(localKeyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      isFirebaseInitialized = true;
      console.log(`✅ Firebase Admin SDK initialized via ${path.basename(localKeyPath)}`);
      return app;
    }

    // Strategy 3: Google Cloud Application Default Credentials (ADC via gcloud)
    const app = admin.initializeApp({
      projectId: env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT,
      credential: admin.credential.applicationDefault(),
    });
    isFirebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized via Google Cloud ADC');
    return app;
  } catch (error: any) {
    console.warn('⚠️ Firebase Admin SDK running in offline/mock mode:', error.message);
    return null;
  }
};

export const getFirebaseApp = (): admin.app.App | null => initializeFirebase();
export const getFirestore = (): admin.firestore.Firestore | null => (isFirebaseInitialized ? admin.firestore() : null);
export const getFirebaseAuth = (): admin.auth.Auth | null => (isFirebaseInitialized ? admin.auth() : null);
