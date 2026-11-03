"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = void 0;
const crypto_1 = __importDefault(require("crypto"));
class AuditLogger {
    events = [];
    maxInMemoryEvents = 2000;
    /**
     * Logs a security event. Strips sensitive tokens/passwords to prevent log leaks.
     */
    log(event) {
        const sanitizedDetails = event.details ? this.sanitize(event.details) : undefined;
        const fullEvent = {
            id: `sec-${Date.now()}-${crypto_1.default.randomBytes(4).toString('hex')}`,
            timestamp: new Date().toISOString(),
            ...event,
            details: sanitizedDetails
        };
        this.events.unshift(fullEvent);
        if (this.events.length > this.maxInMemoryEvents) {
            this.events.pop();
        }
        // Console output with standard ISO prefix for observability
        const prefix = `[SECURITY AUDIT] [${fullEvent.outcome}] [${fullEvent.eventType}]`;
        const userContext = fullEvent.userEmail ? `User: ${fullEvent.userEmail}` : `IP: ${fullEvent.ipAddress}`;
        console.log(`${prefix} ${userContext} -> ${fullEvent.resourcePath || ''}`);
        return fullEvent;
    }
    getRecentEvents(limit = 100, filterType) {
        let list = this.events;
        if (filterType) {
            list = list.filter(e => e.eventType === filterType);
        }
        return list.slice(0, limit);
    }
    getMetrics() {
        const failedLogins = this.events.filter(e => e.eventType === 'AUTH_LOGIN_FAILED').length;
        const rateLimitTrips = this.events.filter(e => e.eventType === 'RATE_LIMIT_TRIPPED').length;
        const rbacDenials = this.events.filter(e => e.eventType === 'RBAC_ACCESS_DENIED').length;
        const mfaChallenges = this.events.filter(e => e.eventType.startsWith('MFA_')).length;
        return {
            totalAuditedEvents: this.events.length,
            failedLogins,
            rateLimitTrips,
            rbacDenials,
            mfaChallenges,
            securityHealthScore: Math.max(70, 100 - (failedLogins * 3 + rbacDenials * 5 + rateLimitTrips * 2))
        };
    }
    sanitize(obj) {
        const clean = {};
        const forbiddenKeys = ['password', 'token', 'secret', 'hash', 'authorization', 'apiKey'];
        for (const [key, value] of Object.entries(obj)) {
            if (forbiddenKeys.some(fk => key.toLowerCase().includes(fk.toLowerCase()))) {
                clean[key] = '[REDACTED_BY_SECURITY_POLICY]';
            }
            else if (typeof value === 'object' && value !== null) {
                clean[key] = this.sanitize(value);
            }
            else {
                clean[key] = value;
            }
        }
        return clean;
    }
}
exports.auditLogger = new AuditLogger();
