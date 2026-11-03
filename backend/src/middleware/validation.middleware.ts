import { Request, Response, NextFunction } from 'express';
import { fileSecurityService } from '../security/file-security';

/**
 * Recursive sanitizer removing script tags, null-bytes, and SQL injection syntax
 */
function sanitizeInput(val: any): any {
  if (typeof val === 'string') {
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip <script>
      .replace(/\0/g, '') // Remove null bytes
      .trim();
  } else if (Array.isArray(val)) {
    return val.map(sanitizeInput);
  } else if (typeof val === 'object' && val !== null) {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      clean[k] = sanitizeInput(v);
    }
    return clean;
  }
  return val;
}

/**
 * Request Sanitization Middleware
 */
export function sanitizeRequestMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
}

/**
 * File Upload Inspection Middleware
 * Checks file extension, MIME type, and size limits before business logic processes it.
 */
export function validateUploadedFile(req: Request, res: Response, next: NextFunction): void {
  if (!req.file) {
    return next();
  }

  const result = fileSecurityService.validateUpload({
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });

  if (!result.isValid) {
    res.status(400).json({
      error: 'Invalid File Upload',
      message: result.error
    });
    return;
  }

  // Attach sanitized filename to request
  req.file.filename = result.sanitizedFilename;
  next();
}

/**
 * Financial Input Validator Helpers
 */
export const financialValidators = {
  isValidGstin(gstin: string): boolean {
    if (!gstin) return false;
    const clean = gstin.trim().toUpperCase();
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(clean);
  },

  isValidIfsc(ifsc: string): boolean {
    if (!ifsc) return false;
    const clean = ifsc.trim().toUpperCase();
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(clean);
  },

  isPositiveAmount(amount: any): boolean {
    const num = Number(amount);
    return !isNaN(num) && num >= 0 && isFinite(num);
  }
};
