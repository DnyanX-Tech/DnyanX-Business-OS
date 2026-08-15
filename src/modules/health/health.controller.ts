import { Request, Response } from 'express';
import os from 'os';
import { env } from '../../config/env.js';
import { getFirebaseApp } from '../../config/firebase.js';

export const getHealth = (req: Request, res: Response): void => {
  const firebaseStatus = getFirebaseApp() ? 'connected' : 'offline/mock';
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: 'healthy',
    system: env.APP_NAME,
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    services: {
      api: 'operational',
      firebase: firebaseStatus,
      whatsappWebhook: 'active',
    },
    systemMetrics: {
      platform: `${os.platform()} (${os.arch()})`,
      nodeVersion: process.version,
      rssMemoryMb: Math.round(memoryUsage.rss / 1024 / 1024),
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    },
  });
};
