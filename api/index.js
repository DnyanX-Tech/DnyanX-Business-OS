const { createApp } = require('../dist/app.js');
const { initializeFirebase } = require('../dist/config/firebase.js');

try {
  initializeFirebase();
} catch (err) {
  console.warn('Firebase init warning in Vercel serverless:', err);
}

const app = createApp();

module.exports = app;
