import { Request, Response, NextFunction } from 'express';
import { SECURITY_CONFIG } from './security.config';

/**
 * Strict Enterprise CORS Middleware
 * Validates request origins against trusted whitelist and manages preflight OPTIONS.
 */
export function enterpriseCorsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;

  if (origin) {
    const isAllowed = SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin) ||
      (!SECURITY_CONFIG.IS_PRODUCTION && origin.startsWith('http://localhost:'));

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Tenant-ID'
      );
      res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours preflight cache
    } else {
      // Reject unauthorized origins
      res.status(403).json({
        error: 'CORS Policy Violation',
        message: `Origin '${origin}' is not permitted to access ARTHIQ API resources.`
      });
      return;
    }
  }

  // Handle browser preflight OPTIONS immediately
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
}
