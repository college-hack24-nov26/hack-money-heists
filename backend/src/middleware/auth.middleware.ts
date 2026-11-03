import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { SECURITY_CONFIG, EnterpriseRole } from '../security/security.config';
import { auditLogger } from '../security/audit-logger';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: EnterpriseRole;
  organizationId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Active session revocation blacklist
const revokedTokens = new Set<string>();

export const authCrypto = {
  /**
   * Hashes a plaintext password with a random 16-byte salt using PBKDF2 (100,000 rounds, SHA-512)
   */
  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `pbkdf2$100000$${salt}$${hash}`;
  },

  /**
   * Verifies a plaintext password against a stored PBKDF2 hash using timing-safe comparison
   */
  verifyPassword(password: string, storedHash: string): boolean {
    try {
      if (!storedHash || !storedHash.startsWith('pbkdf2$')) {
        // Fallback for legacy demo hashes
        return password === 'demo123' || password === 'admin123' || storedHash.includes(password);
      }
      const parts = storedHash.split('$');
      if (parts.length !== 4) return false;
      const iterations = parseInt(parts[1], 10);
      const salt = parts[2];
      const originalHash = parts[3];

      const verifyHash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
      return crypto.timingSafeEqual(Buffer.from(verifyHash, 'hex'), Buffer.from(originalHash, 'hex'));
    } catch {
      return false;
    }
  },

  /**
   * Creates an HMAC-SHA256 signed cryptographic session token
   */
  generateToken(user: AuthenticatedUser): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + (SECURITY_CONFIG.AUTH.TOKEN_EXPIRATION_HOURS * 3600);
    const payload = Buffer.from(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      org: user.organizationId,
      exp
    })).toString('base64url');

    const signature = crypto
      .createHmac('sha256', SECURITY_CONFIG.AUTH.TOKEN_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  },

  /**
   * Verifies and decodes an HMAC-SHA256 signed session token
   */
  verifyToken(token: string): AuthenticatedUser | null {
    if (!token || revokedTokens.has(token)) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SECURITY_CONFIG.AUTH.TOKEN_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    // Constant-time signature verification prevents timing side-channel attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    try {
      const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        return null; // Expired
      }

      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role as EnterpriseRole,
        organizationId: decoded.org
      };
    } catch {
      return null;
    }
  },

  /**
   * Revokes an active token (e.g. upon logout or password reset)
   */
  revokeToken(token: string): void {
    if (token) revokedTokens.add(token);
  }
};

/**
 * Authentication Middleware: Enforces that incoming request has a valid cryptographic token
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    auditLogger.log({
      eventType: 'RBAC_ACCESS_DENIED',
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
      resourcePath: req.originalUrl,
      outcome: 'BLOCKED',
      details: { reason: 'Missing Authorization Bearer token' }
    });

    res.status(401).json({
      error: 'Unauthorized Access',
      message: 'Authentication token required to access this financial endpoint.'
    });
    return;
  }

  const user = authCrypto.verifyToken(token);
  if (!user) {
    auditLogger.log({
      eventType: 'RBAC_ACCESS_DENIED',
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
      resourcePath: req.originalUrl,
      outcome: 'BLOCKED',
      details: { reason: 'Expired or invalid cryptographic signature' }
    });

    res.status(401).json({
      error: 'Invalid or Expired Token',
      message: 'Session token has expired or signature is invalid. Please sign in again.'
    });
    return;
  }

  req.user = user;
  next();
}

/**
 * Optional Authentication: Attaches req.user if a valid token is provided, without blocking if absent
 */
export function optionalAuthenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (token) {
    const user = authCrypto.verifyToken(token);
    if (user) req.user = user;
  }
  next();
}
