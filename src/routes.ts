import { Router } from 'express';
import { healthRouter } from './modules/health/health.router.js';
import { whatsappRouter } from './modules/whatsapp/whatsapp.router.js';
import { promptRouter } from './modules/prompt/prompt.router.js';
import { generatePrompt } from './modules/prompt/prompt.controller.js';
import { estimationRouter } from './modules/estimation/estimation.router.js';
import { reviewRouter } from './modules/tools/review.router.js';

export const registerRoutes = (): Router => {
  const router = Router();

  // Core Phase 1 Modules
  router.use('/health', healthRouter);
  router.use('/webhooks/whatsapp', whatsappRouter);

  // Module 03: 7-Pillar AI Prompt Studio SaaS
  router.use('/prompt', promptRouter);
  router.post('/generate-prompt', generatePrompt);

  // Module 04: Civil Construction Auto-Estimation Engine (₹4,000 - ₹6,000)
  router.use('/estimation', estimationRouter);

  // Module 05: Google 5-Star Review QR Generator & Local SEO (₹1,500 - ₹2,500)
  router.use('/tools/review', reviewRouter);

  return router;
};
