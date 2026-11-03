import crypto from 'crypto';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 
    | 'AUTH_LOGIN_SUCCESS'
    | 'AUTH_LOGIN_FAILED'
    | 'AUTH_LOGOUT'
    | 'AUTH_PASSWORD_RESET_REQUEST'
    | 'AUTH_PASSWORD_CHANGED'
    | 'MFA_CHALLENGE_ISSUED'
    | 'MFA_CHALLENGE_SUCCESS'
    | 'MFA_CHALLENGE_FAILED'
    | 'RBAC_ACCESS_DENIED'
    | 'RATE_LIMIT_TRIPPED'
    | 'CROSS_TENANT_ACCESS_ATTEMPT'
    | 'FILE_UPLOAD_SUSPICIOUS'
    | 'ML_TRAINING_TRIGGERED'
    | 'FINANCIAL_EXPORT_DOWNLOADED'
    | 'SESSION_REVOKED';
  userId?: string;
  userEmail?: string;
  organizationId?: string;
  role?: string;
  ipAddress: string;
  userAgent?: string;
  resourcePath?: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  details?: Record<string, any>;
}

class AuditLogger {
  private events: SecurityEvent[] = [];
  private readonly maxInMemoryEvents = 2000;

  /**
   * Logs a security event. Strips sensitive tokens/passwords to prevent log leaks.
   */
  public log(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const sanitizedDetails = event.details ? this.sanitize(event.details) : undefined;

    const fullEvent: SecurityEvent = {
      id: `sec-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
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

  public getRecentEvents(limit = 100, filterType?: string): SecurityEvent[] {
    let list = this.events;
    if (filterType) {
      list = list.filter(e => e.eventType === filterType);
    }
    return list.slice(0, limit);
  }

  public getMetrics() {
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

  private sanitize(obj: Record<string, any>): Record<string, any> {
    const clean: Record<string, any> = {};
    const forbiddenKeys = ['password', 'token', 'secret', 'hash', 'authorization', 'apiKey'];

    for (const [key, value] of Object.entries(obj)) {
      if (forbiddenKeys.some(fk => key.toLowerCase().includes(fk.toLowerCase()))) {
        clean[key] = '[REDACTED_BY_SECURITY_POLICY]';
      } else if (typeof value === 'object' && value !== null) {
        clean[key] = this.sanitize(value);
      } else {
        clean[key] = value;
      }
    }
    return clean;
  }
}

export const auditLogger = new AuditLogger();
