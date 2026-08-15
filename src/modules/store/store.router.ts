import { Router, Request, Response, type IRouter } from 'express';

export const storeRouter: IRouter = Router();

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  inStock: boolean;
  image: string;
  description: string;
}

export interface StoreProfile {
  slug: string;
  storeName: string;
  tagline: string;
  phone: string;
  address: string;
  minOrderAmount: number;
  deliveryCharge: number;
  products: ProductItem[];
}

const storeDatabase = new Map<string, StoreProfile>();

// Seed default Hardware store
storeDatabase.set('radhe-hardware', {
  slug: 'radhe-hardware',
  storeName: 'राधे हार्डवेअर & सप्लायर्स',
  tagline: 'सर्व प्रकारचे बांधकाम साहित्य, सिमेंट, स्टील व टूल्स',
  phone: '919876543210',
  address: 'पुणे - नाशिक हायवे, चाकण, पुणे',
  minOrderAmount: 500,
  deliveryCharge: 150,
  products: [
    {
      id: 'p1',
      name: 'अल्ट्राटेक सिमेंट (UltraTech Cement 50kg)',
      category: 'सिमेंट',
      price: 385,
      unit: 'गोणी (Bag)',
      inStock: true,
      image: '🏗️',
      description: 'उच्च दर्जाचे PPC सिमेंट, स्लॅब आणि प्लास्टरसाठी सर्वोत्तम.',
    },
    {
      id: 'p2',
      name: 'TMT स्टील सळया 12mm (Fe 550D)',
      category: 'स्टील',
      price: 68,
      unit: 'प्रति kg',
      inStock: true,
      image: '🔩',
      description: 'भूकंपरोधक उच्च क्षमतेच्या ISI प्रमाणित सळया.',
    },
    {
      id: 'p3',
      name: 'लाल माती विटा (Red Clay Bricks)',
      category: 'विटा',
      price: 9.5,
      unit: 'प्रति नग (Piece)',
      inStock: true,
      image: '🧱',
      description: 'पक्की भाजलेली उत्तम दर्जाची लाल वीट.',
    },
    {
      id: 'p4',
      name: 'एशियन पेंट्स ॲपेक्स इमल्शन (Apex Paint 20L)',
      category: 'पेंट्स',
      price: 4200,
      unit: 'बकेट (Bucket)',
      inStock: true,
      image: '🎨',
      description: 'बाहेरील भिंतींसाठी वॉटरप्रूफ अँटी-फंगल वेदरप्रूफ पेंट.',
    },
    {
      id: 'p5',
      name: 'बॉश पॉवर ड्रिल मशीन 13mm (Drill Machine)',
      category: 'टूल्स',
      price: 2450,
      unit: 'नग (Piece)',
      inStock: true,
      image: '⚙️',
      description: 'हेवी ड्युटी ५५०W व्यावसायिक ड्रिल मशीन.',
    },
    {
      id: 'p6',
      name: 'नदी वाळू / क्रॅश सँड (Washed M-Sand)',
      category: 'वाळू',
      price: 1800,
      unit: 'प्रति ब्रास (Brass)',
      inStock: true,
      image: '⏳',
      description: 'चाळलेली स्वच्छ एम-सँड कॉंक्रीटिंगसाठी.',
    },
  ],
});

// Seed default Supermarket store
storeDatabase.set('vijay-supermarket', {
  slug: 'vijay-supermarket',
  storeName: 'विजय सुपर शॉपी & मार्ट',
  tagline: 'ताजा किराणा, ड्रायफ्रूट्स व घरगुती वस्तू',
  phone: '919822334455',
  address: 'शिवाजी चौक, पुणे',
  minOrderAmount: 300,
  deliveryCharge: 50,
  products: [
    {
      id: 'g1',
      name: 'वाडा कोलम तांदूळ (Wada Kolam Rice 10kg)',
      category: 'धान्य',
      price: 680,
      unit: '१० kg पॅक',
      inStock: true,
      image: '🍚',
      description: 'सुगंधी आणि मऊ शिजणारा प्रीमियम कोलम तांदूळ.',
    },
    {
      id: 'g2',
      name: 'फॉर्च्यून सूर्यफूल तेल (Sunflower Oil 1L)',
      category: 'तेल',
      price: 145,
      unit: '१ लिटर पाउच',
      inStock: true,
      image: '🌻',
      description: 'आरोग्यदायी १००% शुद्ध सूर्यफूल तेल.',
    },
    {
      id: 'g3',
      name: 'प्रीमियम काजू तुकडा (Cashew Nuts 500g)',
      category: 'ड्रायफ्रूट्स',
      price: 450,
      unit: '५०० ग्रॅम पॅक',
      inStock: true,
      image: '🥜',
      description: 'ताजे, कुरकुरीत आणि गोड चवीचे काजू.',
    },
  ],
});

// GET /api/store/:slug
storeRouter.get('/:slug', (req: Request, res: Response): void => {
  const rawSlug = req.params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string);
  const store = storeDatabase.get(slug);

  if (!store) {
    res.status(404).json({ success: false, error: 'Store not found' });
    return;
  }

  res.status(200).json({ success: true, store });
});

// POST /api/store/:slug/order
storeRouter.post('/:slug/order', (req: Request, res: Response): void => {
  try {
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string);
    const store = storeDatabase.get(slug);

    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const { customerName, customerPhone, address, cartItems, grandTotal } = req.body;

    // Structured Marathi WhatsApp Order Message
    let itemsText = '';
    (cartItems || []).forEach((item: any, idx: number) => {
      itemsText += `${idx + 1}. ${item.name} (${item.qty} ${item.unit || ''}) - ₹${item.price * item.qty}\n`;
    });

    const whatsappOrderMessage = `🛍️ *नवीन ऑनलाईन ऑर्डर (Website Order)* 🛒\n\n👤 *ग्राहक नाव:* ${customerName}\n📞 *मोबाईल:* +91 ${customerPhone}\n📍 *पत्ता:* ${address}\n\n📦 *ऑर्डर वस्तू (Items):*\n${itemsText}\n━━━━━━━━━━━━━━━━━━\n💰 *एकूण रक्कम (Grand Total):* *₹${grandTotal}*\n━━━━━━━━━━━━━━━━━━\n\n_DnyanX Digital Dukan Engine द्वारे प्राप्त._`;

    res.status(200).json({
      success: true,
      whatsappOrderMessage,
      merchantPhone: store.phone,
      whatsappUrl: `https://wa.me/${store.phone}?text=${encodeURIComponent(whatsappOrderMessage)}`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
