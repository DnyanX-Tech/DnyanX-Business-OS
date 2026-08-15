import { Request, Response } from 'express';
import { whatsAppService } from './whatsapp.service.js';

/**
 * GET /api/webhooks/whatsapp
 * Meta verification challenge handler
 */
export const verifyWebhook = (req: Request, res: Response): void => {
  const mode = req.query['hub.mode'] as string | undefined;
  const token = req.query['hub.verify_token'] as string | undefined;
  const challenge = req.query['hub.challenge'] as string | undefined;

  const result = whatsAppService.verifyWebhookChallenge(mode, token, challenge);

  if (result.isValid && result.challenge) {
    console.log('✅ WhatsApp Webhook verified successfully with Meta Cloud API');
    res.status(200).send(result.challenge);
    return;
  }

  console.warn('❌ WhatsApp Webhook verification failed. Token mismatch.');
  res.status(403).json({
    success: false,
    error: 'Forbidden: Webhook verification token mismatch',
  });
};

/**
 * POST /api/webhooks/whatsapp
 * Incoming events & messages receiver
 */
export const handleWebhookEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const result = await whatsAppService.handleIncomingMessage(payload);

    res.status(200).json({
      success: true,
      received: true,
      processedMessages: result.messageCount,
    });
  } catch (error: any) {
    console.error('Error handling WhatsApp webhook payload:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process WhatsApp event',
      details: error.message,
    });
  }
};

/**
 * POST /api/webhooks/whatsapp/simulate
 * Local development testing & dashboard simulation endpoint
 */
export const simulateWebhook = async (req: Request, res: Response): Promise<void> => {
  const { from = '919876543210', name = 'Local Merchant', message = 'Hello DnyanX OS!' } = req.body;

  const mockPayload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '15550234567', phone_number_id: '123456789' },
              contacts: [{ profile: { name }, wa_id: from }],
              messages: [
                {
                  from,
                  id: `wamid.HBgL${Date.now()}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  type: 'text',
                  text: { body: message },
                },
              ],
            },
          },
        ],
      },
    ],
  };

  const result = await whatsAppService.handleIncomingMessage(mockPayload);

  res.status(200).json({
    success: true,
    simulated: true,
    payload: mockPayload,
    processedMessages: result.messageCount,
  });
};
