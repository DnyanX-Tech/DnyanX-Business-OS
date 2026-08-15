import { Router } from 'express';
import { healthRouter } from './modules/health/health.router.js';
import { whatsappRouter } from './modules/whatsapp/whatsapp.router.js';
import { promptRouter } from './modules/prompt/prompt.router.js';
import { generatePrompt } from './modules/prompt/prompt.controller.js';

export const registerRoutes = (): Router => {
  const router = Router();

  // Core Phase 1 Modules
  router.use('/health', healthRouter);
  router.use('/webhooks/whatsapp', whatsappRouter);

  // Module 03: 7-Pillar AI Prompt Studio SaaS Engine
  router.use('/prompt', promptRouter);
  router.post('/generate-prompt', generatePrompt); // Direct compatibility endpoint

  // Architecture Registry for Next 50 Modules:
  // router.use('/auth', authRouter);
  // router.use('/merchants', merchantRouter);
  // router.use('/crm/leads', leadsRouter);
  // router.use('/billing/invoices', invoiceRouter);
  // router.use('/inventory', inventoryRouter);
  // router.use('/analytics', analyticsRouter);
  // router.use('/notifications', notificationRouter);

  return router;
};
