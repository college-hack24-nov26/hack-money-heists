import { Request, Response, NextFunction } from 'express';
import { SECURITY_CONFIG } from './security.config';

/**
 * Enterprise HTTP Security Headers Middleware
 * Protects against XSS, clickjacking, MIME-confusion, and protocol downgrade attacks.
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1. Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // 2. Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 3. Control referrer leakage
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. Disable insecure browser feature APIs
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=()'
  );

  // 5. XSS Filter (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 6. Strict Transport Security (HSTS)
  if (SECURITY_CONFIG.IS_PRODUCTION || req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // 7. Content Security Policy (CSP)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // React runtime in dev
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://mmljatcvouyjfbznxjgs.supabase.co",
    "connect-src 'self' http://127.0.0.1:* http://localhost:* https://mmljatcvouyjfbznxjgs.supabase.co wss://mmljatcvouyjfbznxjgs.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ];

  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));

  // 8. Remove fingerprinting headers
  res.removeHeader('X-Powered-By');

  next();
}
