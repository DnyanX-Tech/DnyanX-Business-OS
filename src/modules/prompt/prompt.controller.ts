import { Request, Response } from 'express';
import { promptService, PromptInput } from './prompt.service.js';

export const generatePrompt = (req: Request, res: Response): void => {
  try {
    const input: PromptInput = req.body;

    if (!input.role && !input.task) {
      res.status(400).json({
        success: false,
        error: 'Missing required parameters: at least role or task must be provided.',
      });
      return;
    }

    const masterPrompt = promptService.generateMasterPrompt(input);

    res.status(200).json({
      success: true,
      masterPrompt,
      pillarsUsed: 7,
      characterCount: masterPrompt.length,
      message: 'Master prompt engineered successfully using 7 Core Pillars!',
    });
  } catch (error: any) {
    console.error('Prompt Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate prompt',
      details: error.message,
    });
  }
};

export const getTemplates = (req: Request, res: Response): void => {
  const templates = promptService.getIndustryTemplates();
  res.status(200).json({
    success: true,
    templates,
  });
};
