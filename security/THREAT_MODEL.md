# ARTHIQ Threat Model (STRIDE Methodology)

## 1. Scope & Primary Assets
The critical financial assets protected by ARTHIQ include:
1. **General Ledger & Accounting Data**: Real-time expenses, revenues, cash reserves, and bank balances.
2. **Proprietary Machine Learning Models**: Isolation Forest weights, category baseline statistics, and forecasting parameters.
3. **Vendor Invoices & Customer Receivables**: Sensitive banking details, GSTINs, and commercial purchase orders.
4. **Tenant Authentication Credentials**: User password hashes, session tokens, and MFA challenges.

---

## 2. STRIDE Threat Analysis & Mitigations

| Threat Category | Potential Attack Vector | Impact | Mitigations in ARTHIQ |
|---|---|---|---|
| **Spoofing Identity** | Attacker attempts credential stuffing or token forgery to impersonate a Finance Officer. | Unauthorized account access, false transaction approvals. | - PBKDF2/Argon2id multi-round password hashing.<br>- HMAC-SHA256 constant-time verified session tokens.<br>- Mandatory 6-digit MFA on administrative roles.<br>- 5-attempt/min rate limiting on `/api/auth/login`. |
| **Tampering with Data** | Uploading modified invoices or injecting formulas (`=cmd|...`) into CSV ledger rows. | Ledger corruption, fraud concealment, client spreadsheet exploitation. | - Strict schema parsing and type validation.<br>- Neutralization of leading spreadsheet formula characters (`=`, `+`, `-`, `@`).<br>- SHA-256 integrity checksum seals on ML model artifacts. |
| **Repudiation** | User denies verifying a fraudulent invoice or authorizing an unapproved expense. | Accountability loss, audit dispute. | - Tamper-evident `audit_logs` tracking user ID, IP address, timestamp, and action.<br>- Invoices log verification officers with unmodifiable timestamps. |
| **Information Disclosure** | Cross-tenant direct object references (IDOR) or leaking proprietary ML formulas to the browser. | Business competitor intelligence leakage, GDPR/statutory breach. | - PostgreSQL Row-Level Security (RLS) on all company tables.<br>- Tenant boundary verification (`requireTenantIsolation`).<br>- Sensitive calculation logic remains strictly server-side; production builds strip internal source maps. |
| **Denial of Service** | Flooding training endpoints or uploading 1GB files to exhaust server memory. | Platform outage, unresponsiveness for legitimate SME users. | - Request body ceiling at 10 MB.<br>- File upload cap at 15 MB.<br>- Sliding-window rate limiters across APIs (120 req/min) and ML training (5 req/min). |
| **Elevation of Privilege** | An `Employee` attempts to invoke `/api/ai/train` or view company-wide audit trails. | Unauthorized administrative modifications, compliance violation. | - Role-Based Access Control (RBAC) middleware verifying enterprise roles.<br>- Default-deny permission matrix on all write operations. |
