import { Router, Request, Response, type IRouter } from 'express';

export const advancedErpRouter: IRouter = Router();

// ==========================================
// 16. Smart Digital Card (Call & Navigation)
// ==========================================
advancedErpRouter.get('/digital-card/:slug', (req: Request, res: Response): void => {
  const slug = req.params.slug || 'radhe-hardware';
  res.status(200).json({
    success: true,
    businessName: 'राधे हार्डवेअर & सप्लायर्स',
    businessPhone: '919876543210',
    clickToCallUrl: 'tel:+919876543210',
    clickToNavigateUrl: 'https://maps.google.com/?q=Radhe+Hardware+Chakan+Pune',
    whatsappChatUrl: 'https://wa.me/919876543210?text=नमस्कार,%20मला%20माहिती%20हवी%20आहे.',
    verified: true,
  });
});

// ==========================================
// 17. B2B Buy & Sell Profit / Margin Calculator
// ==========================================
advancedErpRouter.post('/profit-calculator', (req: Request, res: Response): void => {
  const { items } = req.body;
  // items: [{ name, buyPrice, sellPrice, qty }]
  let totalCost = 0;
  let totalRevenue = 0;

  const analyzedItems = (items || []).map((it: any) => {
    const buy = Number(it.buyPrice) || 0;
    const sell = Number(it.sellPrice) || 0;
    const qty = Number(it.qty) || 1;
    const itemCost = buy * qty;
    const itemRev = sell * qty;
    const profit = itemRev - itemCost;
    const marginPct = itemRev > 0 ? ((profit / itemRev) * 100).toFixed(1) : '0';

    totalCost += itemCost;
    totalRevenue += itemRev;

    return {
      name: it.name,
      qty,
      buyPrice: buy,
      sellPrice: sell,
      netProfit: profit,
      marginPercent: `${marginPct}%`,
    };
  });

  const totalProfit = totalRevenue - totalCost;
  const overallMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  res.status(200).json({
    success: true,
    totalCost,
    totalRevenue,
    totalProfit,
    overallMargin: `${overallMargin}%`,
    items: analyzedItems,
    summaryMarathi: `आजच्या एकूण ₹${totalRevenue.toLocaleString('en-IN')} विक्रीमध्ये ₹${totalProfit.toLocaleString('en-IN')} चा शुद्ध नफा झाला (${overallMargin}% मार्जिन)!`,
  });
});

// ==========================================
// 18. Omnichannel Social Inbox Mock Aggregator
// ==========================================
advancedErpRouter.get('/omnichannel-inbox', (req: Request, res: Response): void => {
  const unifiedMessages = [
    { id: 'm1', channel: 'WHATSAPP', sender: 'राहुल पाटील', text: 'सिमेंटच्या ५० पोत्यांचा काय भाव पडेल?', time: '१०:१५ AM', status: 'UNREAD' },
    { id: 'm2', channel: 'INSTAGRAM', sender: '@vicky_civil', text: 'TMT सळयांची डिलिव्हरी आज होईल का?', time: '०९:४० AM', status: 'UNREAD' },
    { id: 'm3', channel: 'FACEBOOK', sender: 'अमोल गायकवाड', text: 'दुकान रविवारी चालू असते का?', time: 'काल रात्री', status: 'READ' },
  ];
  res.status(200).json({ success: true, totalUnread: 2, messages: unifiedMessages });
});

// ==========================================
// 19. Automated WhatsApp EMI / Installment Reminder Bot
// ==========================================
advancedErpRouter.post('/emi-reminder', (req: Request, res: Response): void => {
  const { customerName, phone, emiAmount, dueDate, installmentNo, totalInstallments } = req.body;
  const amt = emiAmount || 2000;
  const date = dueDate || '५ तारीख';
  
  const reminderMessage = `⏰ *हप्ता देय आठवण (EMI Due Reminder)*\n\nनमस्कार *${customerName || 'ग्राहक'}*,\n\nतुमच्या खरेदीचा हप्ता क्र. *${installmentNo || 1}/${totalInstallments || 6}* (रक्कम: *₹${amt}*) *${date}* रोजी देय आहे.\n\nवेळेवर हप्ता भरून चांगला क्रेडिट स्कोअर राखा.\n\n💳 *UPI द्वारे त्वरित भरा:* https://pay.dnyanx.in/radhe-hardware\n_राधे हार्डवेअर & सप्लायर्स_`;

  res.status(200).json({
    success: true,
    customerPhone: phone,
    reminderMessage,
    whatsappUrl: `https://wa.me/91${(phone || '9823456789').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(reminderMessage)}`,
  });
});

// ==========================================
// 20. Loyalty Points & WhatsApp Complaint Ticketing
// ==========================================
advancedErpRouter.post('/loyalty-ticketing', (req: Request, res: Response): void => {
  const { action, customerPhone, customerName, issueDescription } = req.body;

  if (action === 'ADD_POINTS') {
    res.status(200).json({
      success: true,
      pointsAdded: 50,
      totalPoints: 250,
      message: `🎉 अभिनंदन ${customerName}! तुमच्या खात्यात ५० रिवॉर्ड पॉईंट्स जमा झाले (एकूण: २५० पॉईंट्स).`,
    });
    return;
  }

  // Create Complaint Ticket
  const ticketId = `TCK-${Date.now().toString().slice(-4)}`;
  const ticketMsg = `🎟️ *तक्रार नोंदणी पावती (Ticket #${ticketId})*\n\nनमस्कार *${customerName || 'ग्राहक'}*,\nतुमची तक्रार नोंदवली आहे:\n"${issueDescription || 'साहित्याची अडचण'}"\n\nआमचे मॅनेजर पुढील २ तासांत तुमच्याशी बोलतील. धन्यवाद!`;

  res.status(200).json({
    success: true,
    ticketId,
    ticketMsg,
    whatsappUrl: `https://wa.me/91${(customerPhone || '9823456789').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(ticketMsg)}`,
  });
});
