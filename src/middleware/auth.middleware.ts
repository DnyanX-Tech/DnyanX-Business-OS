import { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth } from '../config/firebase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
    merchantId?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid Bearer token',
    });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  const auth = getFirebaseAuth();

  if (!auth) {
    // In dev mode without active Firebase, allow test token
    if (process.env.NODE_ENV === 'development' && token === 'dev-master-token') {
      req.user = {
        uid: 'dev-admin-001',
        email: 'admin@dnyanx.com',
        role: 'superadmin',
        merchantId: 'merchant-root-01',
      };
      next();
      return;
    }

    res.status(503).json({
      success: false,
      error: 'Firebase Auth is not initialized on the server',
    });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: (decodedToken.role as string) || 'merchant_admin',
      merchantId: (decodedToken.merchantId as string) || undefined,
    };
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid authentication token',
      details: err.message,
    });
  }
};
