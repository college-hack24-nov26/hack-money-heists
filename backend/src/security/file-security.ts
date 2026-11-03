import path from 'path';
import { SECURITY_CONFIG } from './security.config';

export interface FileValidationResult {
  isValid: boolean;
  sanitizedFilename: string;
  error?: string;
  mimeType: string;
  sizeBytes: number;
}

export const fileSecurityService = {
  /**
   * Sanitizes a user-supplied filename to eliminate path traversal,
   * directory hopping (../ or ..\), control characters, and hidden shell scripts.
   */
  sanitizeFilename(originalName: string): string {
    const basename = path.basename(originalName);
    // Remove control chars, path separators, and non-whitelisted characters
    let clean = basename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Prevent double extensions / malicious masquerading like invoice.pdf.exe
    if (clean.startsWith('.')) {
      clean = `secure_${clean}`;
    }

    const ext = path.extname(clean).toLowerCase();
    const nameWithoutExt = clean.slice(0, clean.length - ext.length);
    const timestamp = Date.now();
    return `${nameWithoutExt.slice(0, 50)}_${timestamp}${ext}`;
  },

  /**
   * Validates file buffer and metadata before allowing disk persistence or processing.
   */
  validateUpload(file: {
    originalname: string;
    mimetype: string;
    size: number;
  }): FileValidationResult {
    const ext = path.extname(file.originalname).toLowerCase();

    // 1. Check size
    if (file.size > SECURITY_CONFIG.FILE_SECURITY.MAX_SIZE_BYTES) {
      return {
        isValid: false,
        sanitizedFilename: file.originalname,
        error: `File size exceeds allowed enterprise limit (${(SECURITY_CONFIG.FILE_SECURITY.MAX_SIZE_BYTES / (1024 * 1024)).toFixed(0)} MB).`,
        mimeType: file.mimetype,
        sizeBytes: file.size
      };
    }

    // 2. Check Extension Whitelist
    if (!SECURITY_CONFIG.FILE_SECURITY.ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        isValid: false,
        sanitizedFilename: file.originalname,
        error: `File extension '${ext}' is not permitted. Allowed: ${SECURITY_CONFIG.FILE_SECURITY.ALLOWED_EXTENSIONS.join(', ')}`,
        mimeType: file.mimetype,
        sizeBytes: file.size
      };
    }

    // 3. Check MIME Type Whitelist
    if (!SECURITY_CONFIG.FILE_SECURITY.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return {
        isValid: false,
        sanitizedFilename: file.originalname,
        error: `MIME type '${file.mimetype}' is not permitted.`,
        mimeType: file.mimetype,
        sizeBytes: file.size
      };
    }

    const sanitizedFilename = this.sanitizeFilename(file.originalname);

    return {
      isValid: true,
      sanitizedFilename,
      mimeType: file.mimetype,
      sizeBytes: file.size
    };
  },

  /**
   * Neutralizes potential formula injection in exported CSV strings
   * (e.g. fields starting with =, +, -, @, or tab characters that trigger DDE in Excel).
   */
  neutralizeCsvFormulaInjection(cellValue: string): string {
    if (typeof cellValue !== 'string') return cellValue;
    const trimmed = cellValue.trim();
    if (['=', '+', '-', '@', '\t', '\r'].some(char => trimmed.startsWith(char))) {
      return `'${trimmed}`; // Prefix with single quote to force text rendering in spreadsheets
    }
    return cellValue;
  }
};
