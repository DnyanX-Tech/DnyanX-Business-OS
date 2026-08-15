import { Router, Request, Response, type IRouter } from 'express';

export const empireRouter: IRouter = Router();

// ==========================================
// 21. B2B Supplier / Vendor Payable Ledger
// ==========================================
empireRouter.post('/supplier-ledger', (req: Request, res: Response): void => {
  const { vendorName, invoiceNumber, totalBill, paidAmount, duePaymentDate } = req.body;
  const total = Number(totalBill) || 0;
  const paid = Number(paidAmount) || 0;
  const balanceDue = total - paid;

  res.status(200).json({
    success: true,
    vendorName: vendorName || 'अंबुजा सिमेंट सप्लायर्स',
    invoiceNumber: invoiceNumber || 'INV-SUPP-902',
    totalBill: total,
    paidAmount: paid,
    balanceDue,
    dueDate: duePaymentDate || '१० दिवसानंतर',
    status: balanceDue === 0 ? 'CLEARED' : 'PENDING_PAYMENT',
    alertMessage: `⚠️ सप्लायर देय अलर्ट: ${vendorName} यांना ₹${balanceDue.toLocaleString('en-IN')} पेमेंट करणे बाकी आहे.`,
  });
});

// ==========================================
// 22. Dead Stock & Expiry Auto-Liquidation Engine
// ==========================================
empireRouter.post('/dead-stock-liquidation', (req: Request, res: Response): void => {
  const { itemName, currentStock, expiryDate, discountPercent } = req.body;
  const discount = discountPercent || 30;

  const liquidationOffer = `🔥 *महा-स्टॉक क्लिअरन्स डिस्काउंट ऑफर!* 🔥\n\nआमच्या दुकानातील *${itemName || 'साहित्यावर'}* मर्यादित काळासाठी थेट *${discount}% ची भरघोस सूट*!\n\n📍 *त्वरित ऑनलाईन बुक करा:* https://${req.get('host') || 'localhost:5000'}/store/radhe-hardware\n_स्टॉक संपेपर्यंतच ऑफर लागू._`;

  res.status(200).json({
    success: true,
    itemName,
    currentStock,
    expiryDate,
    discountPercent: `${discount}%`,
    liquidationOffer,
    whatsappBroadcastUrl: `https://wa.me/?text=${encodeURIComponent(liquidationOffer)}`,
  });
});

// ==========================================
// 23. In-App Web Audio Soundbox Voice Synthesizer
// ==========================================
empireRouter.post('/soundbox-trigger', (req: Request, res: Response): void => {
  const { amount, customerName } = req.body;
  const parsedAmt = Number(amount) || 100;
  
  // Marathi Soundbox Voice Speech String
  const speechTextMarathi = `ज्ञान एक्स पे वर ${parsedAmt} रुपये प्राप्त झाले.`;

  res.status(200).json({
    success: true,
    amount: parsedAmt,
    customerName: customerName || 'ग्राहक',
    soundboxVoiceText: speechTextMarathi,
    timestamp: new Date().toLocaleTimeString('mr-IN'),
  });
});

// ==========================================
// 24. Anti-Theft Shift Closure & Cash Reconciliation
// ==========================================
empireRouter.post('/shift-reconciliation', (req: Request, res: Response): void => {
  const { staffName, systemExpectedCash, actualDrawerCash, merchantPhone } = req.body;
  const expected = Number(systemExpectedCash) || 0;
  const actual = Number(actualDrawerCash) || 0;
  const difference = actual - expected;

  const hasMismatch = difference !== 0;
  let securityAlert = '';

  if (difference < 0) {
    securityAlert = `🚨 *सुरक्षा अलर्ट (कॅश गळती / तफावत)* 🚨\n\nकर्मचारी: *${staffName || 'कामगार'}*\nसिस्टमनुसार कॅश: ₹${expected.toLocaleString('en-IN')}\nगल्ल्यातील प्रत्यक्ष कॅश: ₹${actual.toLocaleString('en-IN')}\nफरक (तोटा): *₹${Math.abs(difference).toLocaleString('en-IN')} कमी भरले!*\n\nकृपया त्वरित खातरजमा करा.`;
  } else if (difference > 0) {
    securityAlert = `ℹ️ गल्ल्यात ₹${difference.toLocaleString('en-IN')} जास्तीची रक्कम आढळली.`;
  } else {
    securityAlert = `✅ कॅश हिशोब १००% तंतोतंत जुळला! (₹${expected.toLocaleString('en-IN')})`;
  }

  res.status(200).json({
    success: true,
    staffName,
    expected,
    actual,
    difference,
    reconciled: !hasMismatch,
    securityAlert,
    alertWhatsAppUrl: hasMismatch
      ? `https://wa.me/${merchantPhone || '919876543210'}?text=${encodeURIComponent(securityAlert)}`
      : null,
  });
});

// ==========================================
// 25. 1-Click Vernacular Marathi/Hindi Invoice Data Builder
// ==========================================
empireRouter.post('/vernacular-invoice', (req: Request, res: Response): void => {
  const { customerName, items, totalAmount, dueAmount } = req.body;
  const dateStr = new Date().toLocaleDateString('mr-IN');

  res.status(200).json({
    success: true,
    language: 'mr',
    invoiceTitle: 'कर बीजक / अधिकृत खरेदी पावती (Tax Invoice)',
    header: {
      shopName: 'राधे हार्डवेअर & सप्लायर्स',
      tagline: 'सर्व प्रकारचे सिमेंट, स्टील व बांधकाम साहित्य',
      gstin: '27AABCU9603R1ZM',
      date: dateStr,
    },
    customer: {
      name: customerName || 'राहुल पाटील',
    },
    items: items || [
      { itemMarathi: 'अल्ट्राटेक सिमेंट (५० kg)', qty: 10, rate: 385, amount: 3850 },
      { itemMarathi: 'TMT स्टील सळया १२mm', qty: 50, rate: 68, amount: 3400 },
    ],
    totals: {
      totalMarathi: `रु. ${(totalAmount || 7250).toLocaleString('en-IN')}`,
      dueMarathi: `रु. ${(dueAmount || 1250).toLocaleString('en-IN')}`,
    },
    footerNote: 'आमच्या दुकानात खरेदी केल्याबद्दल मनःपूर्वक धन्यवाद! पुन्हा भेट द्या.',
  });
});
