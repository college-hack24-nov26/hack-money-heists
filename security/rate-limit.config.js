"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlTrainingRateLimiter = exports.uploadRateLimiter = exports.apiStandardRateLimiter = exports.loginRateLimiter = void 0;
exports.createRateLimiter = createRateLimiter;
const security_config_1 = require("./security.config");
const memoryStore = new Map();
// Periodic garbage collection every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
        if (now > record.resetTime && (!record.lockedUntil || now > record.lockedUntil)) {
            memoryStore.delete(key);
        }
    }
}, 5 * 60 * 1000);
function createRateLimiter(options) {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
        const key = `${options.prefix}:${ip}`;
        const now = Date.now();
        let record = memoryStore.get(key);
        if (!record || now > record.resetTime) {
            record = {
                count: 1,
                resetTime: now + options.windowMs
            };
            memoryStore.set(key, record);
            res.setHeader('X-RateLimit-Limit', options.maxRequests);
            res.setHeader('X-RateLimit-Remaining', options.maxRequests - 1);
            res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
            return next();
        }
        // Check if account / IP is locked out
        if (record.lockedUntil && now < record.lockedUntil) {
            const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
            res.status(429).json({
                error: 'Too Many Requests',
                message: `Security Lockout Active. Please wait ${waitSeconds} seconds before retrying.`,
                retryAfterSeconds: waitSeconds
            });
            return;
        }
        record.count += 1;
        // Trigger lockout if threshold exceeded
        if (record.count > options.maxRequests) {
            if (options.lockoutMinutes && !record.lockedUntil) {
                record.lockedUntil = now + options.lockoutMinutes * 60 * 1000;
            }
            res.setHeader('Retry-After', Math.ceil((options.windowMs) / 1000));
            res.status(429).json({
                error: 'Rate Limit Exceeded',
                message: options.message || 'Exceeded maximum request frequency. Security throttled.',
                retryAfterMs: options.windowMs
            });
            return;
        }
        res.setHeader('X-RateLimit-Limit', options.maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - record.count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
        next();
    };
}
// Pre-configured rate limiters
exports.loginRateLimiter = createRateLimiter({
    prefix: 'rl:auth:login',
    windowMs: security_config_1.SECURITY_CONFIG.RATE_LIMITS.LOGIN.WINDOW_MS,
    maxRequests: security_config_1.SECURITY_CONFIG.RATE_LIMITS.LOGIN.MAX_REQUESTS,
    lockoutMinutes: security_config_1.SECURITY_CONFIG.AUTH.LOCKOUT_DURATION_MINUTES,
    message: 'Multiple failed authentication attempts. Account access temporarily throttled.'
});
exports.apiStandardRateLimiter = createRateLimiter({
    prefix: 'rl:api:standard',
    windowMs: security_config_1.SECURITY_CONFIG.RATE_LIMITS.API_STANDARD.WINDOW_MS,
    maxRequests: security_config_1.SECURITY_CONFIG.RATE_LIMITS.API_STANDARD.MAX_REQUESTS
});
exports.uploadRateLimiter = createRateLimiter({
    prefix: 'rl:file:upload',
    windowMs: security_config_1.SECURITY_CONFIG.RATE_LIMITS.FILE_UPLOAD.WINDOW_MS,
    maxRequests: security_config_1.SECURITY_CONFIG.RATE_LIMITS.FILE_UPLOAD.MAX_REQUESTS
});
exports.mlTrainingRateLimiter = createRateLimiter({
    prefix: 'rl:ai:training',
    windowMs: security_config_1.SECURITY_CONFIG.RATE_LIMITS.ML_TRAINING.WINDOW_MS,
    maxRequests: security_config_1.SECURITY_CONFIG.RATE_LIMITS.ML_TRAINING.MAX_REQUESTS,
    message: 'Machine Learning training job queued. Please wait before triggering another training run.'
});
