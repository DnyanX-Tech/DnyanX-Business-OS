import { Router, Request, Response, type IRouter } from 'express';

export const crmRouter: IRouter = Router();

export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  source: string;
  totalSpent: number;
}

const leadsStore: LeadRecord[] = [
  { id: '1', name: 'राहुल पाटील', phone: '919823456789', source: 'STORE_ORDER', totalSpent: 4850 },
  { id: '2', name: 'संजय थोरात', phone: '919822112233', source: 'INVOICE', totalSpent: 12500 },
  { id: '3', name: 'विकास शिंदे', phone: '919890123456', source: 'WHATSAPP_QUERY', totalSpent: 2100 },
  { id: '4', name: 'अमित कदम', phone: '919765432100', source: 'STORE_ORDER', totalSpent: 7500 },
];

// GET /api/crm/leads
crmRouter.get('/leads', (req: Request, res: Response): void => {
  res.status(200).json({ success: true, count: leadsStore.length, leads: leadsStore });
});

// POST /api/crm/leads
crmRouter.post('/leads', (req: Request, res: Response): void => {
  const { name, phone, source, totalSpent } = req.body;
  const newLead: LeadRecord = {
    id: Date.now().toString(),
    name: name || 'ग्राहक',
    phone: (phone || '').replace(/[^0-9]/g, ''),
    source: source || 'MANUAL',
    totalSpent: Number(totalSpent) || 0,
  };
  leadsStore.push(newLead);
  res.status(201).json({ success: true, message: 'ग्राहक CRM मध्ये सेव्ह झाला!', lead: newLead });
});

// POST /api/crm/bulk-whatsapp-broadcast
crmRouter.post('/bulk-whatsapp-broadcast', (req: Request, res: Response): void => {
  try {
    const { campaignName, offerMessage } = req.body;
    const msg = offerMessage || '🎉 सणांची विशेष ऑफर! आमच्या दुकानात सर्व वस्तूंवर थेट १०% सूट!';

    const host = req.get('host') || 'localhost:5000';
    const queuedLeads = leadsStore.map((lead) => ({
      customerName: lead.name,
      phone: lead.phone,
      personalizedMessage: `🎉 *विशेष सण ऑफर - राधे हार्डवेअर* 🛍️\n\nनमस्कार *${lead.name}*,\n\n${msg}\n\n📍 *ऑनलाईन ऑर्डर करा:* https://${host}/store/radhe-hardware\n_DnyanX CRM Engine_`,
      whatsappUrl: `https://wa.me/${lead.phone}?text=${encodeURIComponent(`नमस्कार ${lead.name}, ${msg}`)}`,
    }));

    res.status(200).json({
      success: true,
      campaignId: `CAMP-${Date.now()}`,
      totalQueued: queuedLeads.length,
      queuedLeads,
      message: `✅ ${queuedLeads.length} ग्राहकांसाठी Bulk WhatsApp कॅम्पेन तयार झाले!`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
