# ARTHIQ Security Incident Response Plan & Playbook

## 1. Incident Classification

| Severity Level | Criteria | Escalation Target | Response SLA |
|---|---|---|---|
| **P1 - Critical** | Active cross-tenant data breach, remote code execution attempt, or compromise of administrative credentials. | Incident Commander, Lead Architect, Legal Counsel | < 15 minutes |
| **P2 - High** | Repeated brute-force burst from botnet, unauthorized privilege escalation attempt, or persistent rate-limit failure. | Security Operations On-Call, Backend Lead | < 1 hour |
| **P3 - Medium** | Localized XSS attempt blocked by CSP, isolated failed MFA event, or single unauthorized file upload rejection. | Application Security Engineer | < 4 hours |
| **P4 - Low** | Dependency vulnerability alert without active exploit vector or minor configuration discrepancy. | Assigned Engineering Team | Next release cycle |

---

## 2. Six-Phase Response Lifecycle

### Phase 1: Detection & Triage
1. Review automated alerts from `securityMonitor` in the administrative **Security Center**.
2. Correlate timestamps, IP addresses, and user IDs using `auditLogger.getRecentEvents()`.
3. Assess whether an active exploit has compromised data integrity or confidentiality.

### Phase 2: Containment
1. **Compromised Account**: Immediately revoke active session tokens via `authCrypto.revokeToken(token)`.
2. **Attacking IP Range**: Apply firewall IP blacklist or reduce rate-limiting threshold in `rate-limit.config.ts`.
3. **Compromised Tenant Secret**: Rotate `JWT_SECRET` in environment variables and restart API Gateway services.

### Phase 3: Eradication
1. Neutralize malicious artifacts in `storage/uploads/`.
2. Verify integrity of ML models using `compute_model_hash('isolation_forest_expense.pkl')`.
3. Roll back any unauthorized database mutations using point-in-time PostgreSQL backups.

### Phase 4: Recovery
1. Force password resets on affected accounts with single-use expiring reset tokens.
2. Require mandatory MFA re-enrollment for all administrative users.
3. Verify that all 3 microservices return clean health probes (`/health`).

### Phase 5: Post-Incident Review
1. Conduct root-cause analysis (RCA) within 72 hours.
2. Publish an internal post-mortem document.
3. Update security tests and automated rules to prevent recurrence.
