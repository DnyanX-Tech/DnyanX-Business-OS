import { Router, type IRouter } from 'express';
import {
  verifyWebhook,
  handleWebhookEvents,
  simulateWebhook,
} from './whatsapp.controller.js';

export const whatsappRouter: IRouter = Router();

whatsappRouter.get('/', verifyWebhook);
whatsappRouter.post('/', handleWebhookEvents);
whatsappRouter.post('/simulate', simulateWebhook);
