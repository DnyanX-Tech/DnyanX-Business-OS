import { createApp } from './app.js';
import { env } from './config/env.js';
import { initializeFirebase } from './config/firebase.js';

const startServer = async () => {
  console.log('\n======================================================');
  console.log(`🚀 Booting ${env.APP_NAME}...`);
  console.log('======================================================');

  // Initialize Firebase Admin connection
  initializeFirebase();

  const app = createApp();
  const PORT = env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`\n🟢 Server listening at: http://localhost:${PORT}`);
    console.log(`📊 Super Admin UI:     http://localhost:${PORT}`);
    console.log(`🩺 Health Endpoint:    http://localhost:${PORT}/api/health`);
    console.log(`💬 WhatsApp Webhook:    http://localhost:${PORT}/api/webhooks/whatsapp`);
    console.log(`⚙️  Environment:         ${env.NODE_ENV}`);
    console.log('======================================================\n');
  });

  // Graceful Shutdown
  const shutdown = (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('🏁 Process terminated gracefully.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('💥 Fatal Startup Failure:', err);
  process.exit(1);
});
