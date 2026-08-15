import { Router } from 'express';
import { healthRouter } from './modules/health/health.router.js';
import { whatsappRouter } from './modules/whatsapp/whatsapp.router.js';
import { promptRouter } from './modules/prompt/prompt.router.js';
import { generatePrompt } from './modules/prompt/prompt.controller.js';
import { estimationRouter } from './modules/estimation/estimation.router.js';
import { reviewRouter } from './modules/tools/review.router.js';
import { hubRouter, createHubHandler } from './modules/hub/hub.router.js';
import { handleWebhookEvents } from './modules/whatsapp/whatsapp.controller.js';

export const registerRoutes = (): Router => {
  const router = Router();

  // Core Phase 1 Modules
  router.use('/health', healthRouter);
  router.use('/webhooks/whatsapp', whatsappRouter);
  router.post('/whatsapp-webhook', handleWebhookEvents);

  // Module 03: 7-Pillar AI Prompt Studio SaaS
  router.use('/prompt', promptRouter);
  router.post('/generate-prompt', generatePrompt);

  // Module 04: Civil Construction Auto-Estimation Engine
  router.use('/estimation', estimationRouter);

  // Module 05: Google 5-Star Review QR Generator & Local SEO
  router.use('/tools/review', reviewRouter);

  // Module 06: Universal Smart QR & All-in-One Social Automation Hub
  router.use('/hub', hubRouter);
  router.post('/create-business-hub', createHubHandler);
  router.post('/generate-business-kit', createHubHandler); // 5-in-1 Kit Alias

  return router;
};
