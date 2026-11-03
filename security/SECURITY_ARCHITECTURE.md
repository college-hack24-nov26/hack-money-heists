# ARTHIQ 3-Layer Security Architecture Specification

## Architectural Overview

ARTHIQ implements defense-in-depth across three distinct security boundaries:

```
┌────────────────────────────────────────────────────────────────────────┐
│               LAYER 1: FRONTEND, EDGE & ACCESS SECURITY                │
│  • Content Security Policy (CSP)       • Strict Transport Security (HSTS)
│  • Frame Ancestors Deny (Anti-Click)   • X-Content-Type-Options: nosniff
│  • Whitelisted Origin CORS             • Sliding-Window Rate Limiting
│  • Production Source-Map Privacy       • Sanitized Client Data Binding
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (TLS 1.3)
┌───────────────────────────────────▼────────────────────────────────────┐
│              LAYER 2: BACKEND, API & APPLICATION SECURITY              │
│  • PBKDF2/Argon2id Salted Hashes       • HMAC-SHA256 Cryptographic Tokens
│  • 6 Enterprise Roles (RBAC Matrix)    • Tenant Isolation (Anti-IDOR)
│  • Input & Query Sanitization          • MIME & File Magic-Byte Validation
│  • Active Session Revocation Map       • Structured Security Audit Logging
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Parameterized SQL / IPC
┌───────────────────────────────────▼────────────────────────────────────┐
│           LAYER 3: DATABASE, STORAGE & INFRASTRUCTURE SECURITY         │
│  • Supabase Multi-Tenant RLS           • Private Storage Buckets
│  • Append-Only Audit Trail Logs        • Model Registry Checksum Seals
│  • Encrypted Environment Secrets       • Zero Cross-Company Queries
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Layer 1: Edge, Headers & Access Control
- **Content Security Policy**:
  Restricts script execution to `'self'`, blocking unauthorized script injection and DOM-based cross-site scripting (XSS).
- **Clickjacking Defense**:
  Enforces `X-Frame-Options: DENY` and `frame-ancestors 'none'`.
- **CORS Whitelisting**:
  Only requests matching trusted origin domains (`http://localhost:3000` or production hostname) are granted access-control headers.
- **Client IP & Logic Protection**:
  All financial valuation models, invoice fraud forensic heuristics, and Isolation Forest anomaly algorithms are kept strictly server-side.

---

## 2. Layer 2: API, Authentication & Application Logic
- **Authentication**:
  Passwords are never stored in plaintext. They are salted with 16 cryptographically random bytes and hashed using PBKDF2 with 100,000 iterations and SHA-512.
- **Session Tokens**:
  Tokens are signed using HMAC-SHA256 with 24-hour expiration. Active logout invalidates the token in an in-memory revocation registry.
- **Role-Based Access Control (RBAC)**:
  Six discrete roles are verified on every sensitive backend call:
  1. `Super Admin`: Universal tenant administration and system configuration.
  2. `Company Admin`: Company settings, user invitations, and financial report downloads.
  3. `Finance Manager`: Expense approval, invoice verification, and ML model training.
  4. `Accountant`: General ledger commits and payable invoice entries.
  5. `Employee`: View-only submission of personal reimbursement claims.
  6. `Read-Only Auditor`: Unmodifiable compliance inspection and audit trail review.

---

## 3. Layer 3: Database, Storage & Isolation
- **Row-Level Security (RLS)**:
  Company-owned tables (`organizations`, `expenses`, `invoices`, `clients`, `vendors`, `profit_leakage_findings`) enforce:
  `organization_id = current_setting('request.jwt.claims', true)::json->>'organization_id'`.
- **Private Storage**:
  Raw financial datasets and model artifacts (`isolation_forest_expense.pkl`) are stored outside public web directories.
- **Audit Logging**:
  Security events are appended to `audit_logs` with immutable permissions (inserts allowed, updates/deletions blocked).
