import { Router } from 'express';
import { healthRouter } from './modules/health/health.router.js';
import { whatsappRouter } from './modules/whatsapp/whatsapp.router.js';
import { promptRouter } from './modules/prompt/prompt.router.js';
import { generatePrompt } from './modules/prompt/prompt.controller.js';
import { estimationRouter } from './modules/estimation/estimation.router.js';
import { reviewRouter } from './modules/tools/review.router.js';
import { hubRouter, createHubHandler } from './modules/hub/hub.router.js';
import { storeRouter } from './modules/store/store.router.js';
import { operationsRouter } from './modules/operations/operations.router.js';
import { crmRouter } from './modules/crm/crm.router.js';
import { advancedErpRouter } from './modules/erp/advanced.router.js';
import { empireRouter } from './modules/empire/empire.router.js';
import { epic50Router } from './modules/epic50/epic50.router.js';
import { handleWebhookEvents } from './modules/whatsapp/whatsapp.controller.js';

export const registerRoutes = (): Router => {
  const router = Router();

  // Core & Communication
  router.use('/health', healthRouter);
  router.use('/webhooks/whatsapp', whatsappRouter);
  router.post('/whatsapp-webhook', handleWebhookEvents);

  // Growth & AI Prompt SaaS
  router.use('/prompt', promptRouter);
  router.post('/generate-prompt', generatePrompt);

  // Civil BOQ Calculator
  router.use('/estimation', estimationRouter);

  // Google 5-Star Review Tool
  router.use('/tools/review', reviewRouter);

  // Universal Smart QR Hub
  router.use('/hub', hubRouter);
  router.post('/create-business-hub', createHubHandler);
  router.post('/generate-business-kit', createHubHandler);

  // Smart Digital Dukan Storefront
  router.use('/store', storeRouter);

  // Operations: Low-Stock, Vendor PO, Voice Parsing & EOD
  router.use('/operations', operationsRouter);

  // CRM Leads & Bulk Remarketing
  router.use('/crm', crmRouter);

  // 20-in-1 Advanced ERP: Profit Tracker, EMI Reminders, Unified Inbox, Loyalty
  router.use('/erp', advancedErpRouter);

  // 25-in-1 Empire Modules: Vendor Ledger, Dead Stock, In-App Soundbox, Anti-Theft Shift, Marathi Invoice
  router.use('/empire', empireRouter);

  // 50-in-1 Enterprise Epics: GST Engine, Facial Attendance, Multi-Godown, AI Predictive, Shop Siri & Franchise
  router.use('/epic50', epic50Router);

  return router;
};
