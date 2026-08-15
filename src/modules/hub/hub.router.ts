import { Router, Request, Response, type IRouter } from 'express';

export const hubRouter: IRouter = Router();

interface BusinessHubProfile {
  businessName: string;
  category?: string;
  phone: string;
  whatsappMessage?: string;
  googleReviewUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  address?: string;
  slug: string;
}

// In-memory hub store
const hubDatabase = new Map<string, BusinessHubProfile>();

// Seed default profile
hubDatabase.set('radhe-hardware', {
  businessName: 'राधे हार्डवेअर & सप्लायर्स',
  category: 'सर्व प्रकारचे बांधकाम साहित्य व सेवा',
  phone: '919876543210',
  whatsappMessage: 'नमस्कार, मला साहित्याचे कोटेशन हवे आहे.',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
  instagramUrl: 'https://instagram.com/dnyanx.tech',
  facebookUrl: 'https://facebook.com/dnyanx.tech',
  address: 'पुणे - नाशिक हायवे, चाकण, पुणे',
  slug: 'radhe-hardware',
});

hubDatabase.set('vijay-super-shopee', {
  businessName: 'विजय सुपर शॉपी (Vijay Super Shopee)',
  category: 'किराणा, ड्रायफ्रूट्स व दैनंदिन वस्तू',
  phone: '919822334455',
  whatsappMessage: 'नमस्कार, मला चालू महिन्याचे किराणा सामान ऑर्डर करायचे आहे.',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
  instagramUrl: 'https://instagram.com/dnyanx.tech',
  facebookUrl: 'https://facebook.com/dnyanx.tech',
  address: 'शिवाजी चौक, पुणे',
  slug: 'vijay-super-shopee',
});

/**
 * POST /api/hub/create & POST /api/create-business-hub
 */
export const createHubHandler = (req: Request, res: Response): void => {
  try {
    const data: BusinessHubProfile = req.body;

    if (!data.businessName || !data.phone) {
      res.status(400).json({ success: false, error: 'Business name and phone are required.' });
      return;
    }

    const slug = (data.slug || data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    const hubProfile: BusinessHubProfile = {
      ...data,
      slug,
      whatsappMessage: data.whatsappMessage || 'नमस्कार, मला माहिती हवी आहे.',
    };

    hubDatabase.set(slug, hubProfile);

    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:5000';
    const hubUrl = `${protocol}://${host}/biz/${slug}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(hubUrl)}`;

    res.status(200).json({
      success: true,
      slug,
      hubUrl,
      qrImage: qrImageUrl,
      profile: hubProfile,
      message: 'Smart Universal Business Hub आणि QR Code तयार झाले!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/hub/:slug
 */
hubRouter.get('/:slug', (req: Request, res: Response): void => {
  const rawSlug = req.params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string);
  const profile = hubDatabase.get(slug);

  if (!profile) {
    res.status(404).json({ success: false, error: 'Business Hub not found' });
    return;
  }

  res.status(200).json({ success: true, profile });
});

hubRouter.post('/create', createHubHandler);
