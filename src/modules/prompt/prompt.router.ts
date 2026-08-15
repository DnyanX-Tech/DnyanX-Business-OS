import { Router, type IRouter } from 'express';
import { generatePrompt, getTemplates } from './prompt.controller.js';

export const promptRouter: IRouter = Router();

promptRouter.post('/generate', generatePrompt);
promptRouter.get('/templates', getTemplates);
