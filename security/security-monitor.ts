import { auditLogger, SecurityEvent } from './audit-logger';

export interface ThreatAlert {
  id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  sourceIp: string;
  recommendedAction: string;
}

class SecurityMonitor {
  private activeAlerts: ThreatAlert[] = [];

  public analyzeTrafficPatterns(): ThreatAlert[] {
    const recent = auditLogger.getRecentEvents(50);
    const now = Date.now();
    const alerts: ThreatAlert[] = [];

    // 1. Detect rapid failed logins from same IP
    const failedByIp = new Map<string, number>();
    recent.forEach(e => {
      if (e.eventType === 'AUTH_LOGIN_FAILED') {
        failedByIp.set(e.ipAddress, (failedByIp.get(e.ipAddress) || 0) + 1);
      }
    });

    for (const [ip, count] of failedByIp.entries()) {
      if (count >= 3) {
        alerts.push({
          id: `alt-bf-${now}-${ip.replace(/[^a-zA-Z0-9]/g, '')}`,
          timestamp: new Date().toISOString(),
          severity: count >= 5 ? 'CRITICAL' : 'HIGH',
          title: `Credential Stuffing / Brute Force Burst Detected`,
          description: `Observed ${count} failed login attempts originating from IP address: ${ip}.`,
          sourceIp: ip,
          recommendedAction: 'Enforce mandatory MFA challenge and apply IP lockout throttling.'
        });
      }
    }

    // 2. Detect unauthorized role escalation attempts
    const rbacViolations = recent.filter(e => e.eventType === 'RBAC_ACCESS_DENIED');
    if (rbacViolations.length >= 2) {
      alerts.push({
        id: `alt-rbac-${now}`,
        timestamp: new Date().toISOString(),
        severity: 'MEDIUM',
        title: 'Repeated Privilege Escalation Attempts',
        description: `Multiple requests attempted to execute administrative endpoints with insufficient role privileges.`,
        sourceIp: rbacViolations[0]?.ipAddress || 'Multiple',
        recommendedAction: 'Verify user credentials and inspect role assignments in tenant dashboard.'
      });
    }

    this.activeAlerts = alerts;
    return alerts;
  }

  public getActiveAlerts(): ThreatAlert[] {
    return this.analyzeTrafficPatterns();
  }

  public getLiveDashboard() {
    return {
      metrics: auditLogger.getMetrics(),
      alerts: this.getActiveAlerts(),
      recentAuditTrail: auditLogger.getRecentEvents(25),
      monitoringActive: true,
      encryptionStatus: 'AES-256-GCM / TLS 1.3',
      defenseLayers: ['Edge Headers & CSP', 'JWT & RBAC Gatekeeper', 'Tenant RLS & Isolated Storage']
    };
  }
}

export const securityMonitor = new SecurityMonitor();
