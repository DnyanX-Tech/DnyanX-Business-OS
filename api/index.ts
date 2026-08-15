import express, { Express } from 'express';
import cors from 'cors';
import { registerRoutes } from '../src/routes.js';

const app: Express = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount all 50-in-1 APIs
app.use('/api', registerRoutes());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: '50-in-1 DnyanX Business Empire OS API',
    timestamp: new Date().toISOString(),
  });
});

export default app;
