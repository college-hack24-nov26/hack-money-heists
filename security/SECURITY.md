# ARTHIQ Security Policy & Disclosure Guidelines

## 1. Our Commitment to Security
ARTHIQ provides business-critical financial intelligence, fraud detection, and automated accounting support for SMEs and modern enterprises. Protecting our customers' proprietary general ledgers, invoices, machine learning models, and executive decisions is foundational to our mission.

---

## 2. Supported Versions
Security updates and patches are actively applied to the following release trains:

| Version | Supported | Status |
|---|---|---|
| `v1.0.x` | Yes | Active LTS |
| `< v1.0` | No | Deprecated |

---

## 3. Reporting a Vulnerability
We welcome responsible vulnerability reports from independent security researchers, customers, and partners.

- **Primary Contact**: `security@arthiq.ai`
- **PGP Fingerprint**: `4A8F B921 73C0 E1D4 8F92 3719 A004 8831 EC77 92B1`
- **Response SLA**:
  - **Initial Triage**: Within 24 hours
  - **Severity Assessment**: Within 48 hours
  - **Patch Delivery**: Within 5 business days for Critical/High vulnerabilities

### Please include:
1. Exact steps to reproduce, including HTTP requests and proof-of-concept payloads.
2. Affected endpoints, parameters, and roles.
3. Impact assessment (e.g., cross-tenant exposure, privilege escalation, data alteration).

**Please do not**:
- Access or modify another company's production financial data.
- Execute denial-of-service (DoS/DDoS) attacks against production infrastructure.
- Disclose findings publicly before a coordinated patch is published.

---

## 4. 3-Layer Security Architecture Overview
- **Layer 1 (Edge & Access)**: Strict CORS origin whitelisting, Content Security Policy (CSP), HSTS, and rate-limiting gatekeepers.
- **Layer 2 (API & Application)**: Cryptographic PBKDF2/Argon2id password hashing, HMAC-SHA256 session tokens, 6-role RBAC enforcement, and tenant-boundary verification.
- **Layer 3 (Database & Storage)**: PostgreSQL Row-Level Security (RLS) tenant isolation, private storage for ML artifacts, and append-only tamper-evident audit logging.
