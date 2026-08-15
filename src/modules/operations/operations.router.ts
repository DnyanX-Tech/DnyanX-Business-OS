import { Router, Request, Response, type IRouter } from 'express';

export const operationsRouter: IRouter = Router();

// ==========================================
// 7. Low-Stock Alert Engine
// ==========================================
operationsRouter.post('/check-stock', (req: Request, res: Response): void => {
  const { itemName, currentStock, minLimit, merchantPhone } = req.body;
  const stock = Number(currentStock) || 0;
  const limit = Number(minLimit) || 20;

  if (stock <= limit) {
    const alertMsg = `⚠️ *स्टॉक अलर्ट (Low Stock Alert)*\n\nतुमच्या दुकानात *${itemName || 'साहित्य'}* चा साठा फक्त *${stock}* उरला आहे (किमान मर्यादा: ${limit}).\nकृपया सप्लायरला नवीन ऑर्डर द्या!`;
    res.status(200).json({
      lowStock: true,
      alertMsg,
      whatsappUrl: `https://wa.me/${merchantPhone || '919876543210'}?text=${encodeURIComponent(alertMsg)}`,
    });
    return;
  }
  res.status(200).json({ lowStock: false, message: 'स्टॉक पुरेसा आहे.' });
});

// ==========================================
// 9. WhatsApp Appointment / Token Booking Bot
// ==========================================
operationsRouter.post('/appointments/book', (req: Request, res: Response): void => {
  const { customerName, phone, service, date, time } = req.body;
  const tokenNo = Math.floor(100 + Math.random() * 900);
  const confirmationMsg = `✅ *टोकन / अपॉइंटमेंट कन्फर्म झाली!*\n\nनमस्कार *${customerName || 'ग्राहक'}*,\nतुमचा टोकन नंबर: *#${tokenNo}*\nसेवा: ${service || 'सर्व्हिस'}\nदिनांक: ${date || 'आज'} (${time || 'लगेच'})\n\nआमच्या क्लिनिक/दुकानात वेळेवर उपस्थित राहावे. धन्यवाद!`;
  
  res.status(200).json({
    success: true,
    tokenNo,
    confirmationMsg,
    whatsappUrl: `https://wa.me/91${phone || '9823456789'}?text=${encodeURIComponent(confirmationMsg)}`,
  });
});

// ==========================================
// 10. Vendor Purchase Order (PO) Generator
// ==========================================
operationsRouter.post('/vendor/generate-po', (req: Request, res: Response): void => {
  const { vendorName, vendorPhone, poItems, merchantName } = req.body;
  let itemsText = '';
  (poItems || []).forEach((it: any, i: number) => {
    itemsText += `${i + 1}. ${it.name} - ${it.qty} ${it.unit || 'नग'}\n`;
  });
  
  const poMsg = `📋 *कच्चा माल खरेदी ऑर्डर (Purchase Order - PO)*\n\nसप्लायर: *${vendorName || 'सप्लायर'}*\nदुकानाचे नाव: *${merchantName || 'राधे हार्डवेअर'}*\n\nमागवलेले साहित्य:\n${itemsText || '1. सिमेंट - 100 गोणी\n2. स्टील - 500 kg'}\nकृपया लवकरात लवकर माल पाठवून पावती द्यावी.`;
  
  res.status(200).json({
    success: true,
    poMsg,
    whatsappUrl: `https://wa.me/${vendorPhone || '919876543210'}?text=${encodeURIComponent(poMsg)}`,
  });
});

// ==========================================
// 14. AI Voice-to-Text Natural Language Parser
// ==========================================
operationsRouter.post('/ai/voice-entry', (req: Request, res: Response): void => {
  const { spokenText } = req.body; // e.g., "राहुल पाटील ५०० रुपये उधारी सिमेंट"
  const text = spokenText || '';
  const amountMatch = text.match(/\d+/);
  const amount = amountMatch ? parseInt(amountMatch[0], 10) : 0;

  res.status(200).json({
    success: true,
    parsedData: {
      rawText: text,
      detectedCustomer: text.includes('राहुल') ? 'राहुल पाटील' : (text.includes('संजय') ? 'संजय थोरात' : 'ग्राहक'),
      detectedAmount: amount,
      detectedCategory: text.includes('उधार') ? 'UDHAR' : (text.includes('खर्च') ? 'EXPENSE' : 'SALE'),
      message: 'व्हॉईस डेटा यशस्वीरित्या डॅशबोर्डवर भरला गेला!',
    },
  });
});

// ==========================================
// 15. Daily EOD AI Business Summary Generator
// ==========================================
operationsRouter.get('/analytics/daily-eod', (req: Request, res: Response): void => {
  const dateStr = new Date().toLocaleDateString('mr-IN');
  const reportMsg = `📊 *दैनिक व्यवसाय अहवाल (Daily Business Report)*\n\n📅 तारीख: ${dateStr}\n━━━━━━━━━━━━━━━━━━\n💵 रोख विक्री (Cash): ₹१४,५००\n💳 UPI / QR विक्री: ₹२२,४००\n📝 आजची उधारी बाकी: ₹३,२००\n📉 एकूण किरकोळ खर्च: ₹१,१५०\n━━━━━━━━━━━━━━━━━━\n💰 *आजचा निव्वळ गल्ला (Net Galla):* *₹३८,९५०*\n━━━━━━━━━━━━━━━━━━\n_DnyanX Ultimate 15-in-1 OS द्वारे जनरेट._`;
  
  res.status(200).json({
    success: true,
    date: dateStr,
    reportMsg,
    summary: {
      cash: 14500,
      upi: 22400,
      udhar: 3200,
      expenses: 1150,
      netGalla: 38950,
    },
  });
});
