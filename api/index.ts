import { createApp } from '../src/app.js';
import { initializeFirebase } from '../src/config/firebase.js';

try {
  initializeFirebase();
} catch (err) {
  console.warn('Firebase init warning in Vercel serverless:', err);
}

const app = createApp();

export default app;
