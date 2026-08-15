import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import { registerRoutes } from '../src/routes.js';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount all 50-in-1 APIs
app.use('/api', registerRoutes());

// Helper to reliably find and serve HTML files in serverless environment
const getHtml = (fileName: string): string => {
  const possiblePaths = [
    path.join(process.cwd(), fileName),
    path.join(process.cwd(), 'public', fileName),
    path.join(process.cwd(), 'dist', fileName),
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, 'utf8');
      }
    } catch {
      // Continue to next path
    }
  }
  return `<!DOCTYPE html><html lang="mr"><head><title>25-in-1 Business Empire OS</title></head><body style="background:#030712;color:white;font-family:sans-serif;padding:2rem;"><h1>25-in-1 Business Empire OS</h1><p>System Online. <a href="/api/health" style="color:#10b981">Check Health</a></p></body></html>`;
};

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(getHtml('index.html'));
});

app.get('/store/:slug', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(getHtml('store.html'));
});

app.get('/catalog', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(getHtml('store.html'));
});

app.get('/biz/:slug', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(getHtml('biz.html'));
});

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}
