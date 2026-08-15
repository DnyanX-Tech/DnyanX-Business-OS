import express from 'express';
import cors from 'cors';
import type { IncomingMessage, ServerResponse } from 'http';
import { registerRoutes } from '../src/routes.js';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', registerRoutes());

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}
