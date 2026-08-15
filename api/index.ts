import express, { Request, Response } from 'express';
import cors from 'cors';
import { registerRoutes } from '../src/routes.js';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    version: '50.0.0',
    service: '50-in-1 DnyanX Business Empire OS',
    timestamp: new Date().toISOString(),
  });
});

// Mount All Empire APIs
app.use('/api', registerRoutes());

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
