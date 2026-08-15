import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.js';
import { registerRoutes } from './routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export const createApp = (): Express => {
  const app = express();

  // Security and Middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve Public Static Assets
  const publicDir = path.resolve(process.cwd(), 'public');
  app.use(express.static(publicDir));
  app.use(express.static(process.cwd()));

  // Dynamic Storefront & Catalog Routes
  app.get('/store/:slug', (req, res) => {
    res.sendFile(path.join(publicDir, 'store.html'));
  });
  app.get('/catalog', (req, res) => {
    res.sendFile(path.join(publicDir, 'store.html'));
  });

  // Public Dynamic Business Hub Route: /biz/:slug -> public/biz.html
  app.get('/biz/:slug', (req, res) => {
    res.sendFile(path.join(publicDir, 'biz.html'));
  });

  // Mount Core API Sub-routes
  app.use('/api', registerRoutes());

  // Direct Health check fallback
  app.get('/health', (req, res) => res.redirect('/api/health'));

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

const defaultApp = createApp();

// Default export required by Vercel Serverless Function runtime
export default defaultApp;
