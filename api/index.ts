import express, { Request, Response } from 'express';
import cors from 'cors';
import { registerRoutes } from '../src/routes.js';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Fast 204 response for browser metadata assets
app.get('/favicon.ico', (req: Request, res: Response) => res.status(204).end());
app.get('/favicon.png', (req: Request, res: Response) => res.status(204).end());
app.get('/robots.txt', (req: Request, res: Response) => res.type('text/plain').send('User-agent: *\nAllow: /'));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    version: '50.0.0',
    service: '50-in-1 DnyanX Business Empire OS',
    timestamp: new Date().toISOString(),
  });
});
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    version: '50.0.0',
    service: '50-in-1 DnyanX Business Empire OS',
    timestamp: new Date().toISOString(),
  });
});

// Mount All Empire APIs both on /api and root fallback
const routes = registerRoutes();
app.use('/api', routes);
app.use('/', routes);

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
