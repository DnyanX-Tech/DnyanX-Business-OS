import { Router } from 'express';
import { healthRouter } from './modules/health/health.router.js';
import { whatsappRouter } from './modules/whatsapp/whatsapp.router.js';

export const registerRoutes = (): Router => {
  const router = Router();

  // Core Phase 1 Modules
  router.use('/health', healthRouter);
  router.use('/webhooks/whatsapp', whatsappRouter);

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
