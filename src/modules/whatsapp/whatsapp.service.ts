import { env } from '../../config/env.js';

export interface WhatsAppIncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

export class WhatsAppService {
  /**
   * Validates Meta WhatsApp Webhook subscription handshake
   */
  public verifyWebhookChallenge(
    mode: string | undefined,
    token: string | undefined,
    challenge: string | undefined
  ): { isValid: boolean; challenge?: string } {
    if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
      return { isValid: true, challenge };
    }
    return { isValid: false };
  }

  /**
   * Processes incoming WhatsApp webhook payload
   */
  public async handleIncomingMessage(payload: any): Promise<{ handled: boolean; messageCount: number }> {
    if (!payload || payload.object !== 'whatsapp_business_account') {
      return { handled: false, messageCount: 0 };
    }

    const entries = payload.entry || [];
    let messageCount = 0;

    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === 'messages') {
          const value = change.value;
          const messages: WhatsAppIncomingMessage[] = value?.messages || [];
          const contacts = value?.contacts || [];

          for (const msg of messages) {
            messageCount++;
            const senderName = contacts[0]?.profile?.name || 'Customer';
            console.log(`📩 [WhatsApp Inbound] From: ${msg.from} (${senderName}) | Body: ${msg.text?.body || msg.type}`);

            // Future Module Hook: Lead Ingestion / AI Bot auto-reply / Order placement
          }
        }
      }
    }

    return { handled: true, messageCount };
  }
}

export const whatsAppService = new WhatsAppService();
