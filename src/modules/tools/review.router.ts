import { Router, Request, Response, type IRouter } from 'express';

export const reviewRouter: IRouter = Router();

reviewRouter.post('/generate-qr', (req: Request, res: Response): void => {
  try {
    const { businessName = 'Vijay Super Shopee', googlePlaceId = '', customUrl = '' } = req.body;

    // Generate Google Review direct URL
    const reviewUrl = customUrl
      ? customUrl
      : googlePlaceId
      ? `https://search.google.com/local/writereview?placeid=${googlePlaceId}`
      : `https://www.google.com/search?q=${encodeURIComponent(businessName + ' reviews')}`;

    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(reviewUrl)}`;

    res.status(200).json({
      success: true,
      businessName,
      reviewUrl,
      qrCodeImageUrl,
      marketingTipMarathi: 'हा QR कोड दुकानाच्या काउंटरवर किंवा बिलाच्या खाली छापा, ग्राहकाला ५-स्टार रेटिंग देण्यासाठी फक्त ३ सेकंद लागतील!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
