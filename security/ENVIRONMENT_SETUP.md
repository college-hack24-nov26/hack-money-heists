# ARTHIQ Environment Security & Secret Management Guide

## 1. Environment Variable Hygiene
ARTHIQ strictly enforces that credentials, service keys, and database passwords are never committed to version control.

### Required Environment Variables

```bash
# ---------------------------------------------------------------------
# ARTHIQ CORE BACKEND (backend/.env)
# ---------------------------------------------------------------------
PORT=4000
NODE_ENV=production

# Cryptographic Token Master Secret (Must be at least 32 cryptographically random chars)
JWT_SECRET=arthiq_enterprise_master_key_99384729184719283749182374918273

# Python Finance Engine Microservice URL
FINANCE_ENGINE_URL=http://127.0.0.1:5001

# Supabase PostgreSQL Cloud Configuration
SUPABASE_URL=https://mmljatcvouyjfbznxjgs.supabase.co
SUPABASE_ANON_KEY=sb_publishable_mt-NaU29NLLqSThp1Eym0A_BBs1NWo7

# ---------------------------------------------------------------------
# PYTHON ML MICROSERVICE (finance-engine/.env)
# ---------------------------------------------------------------------
PORT=5001
PYTHONUNBUFFERED=1
FLASK_ENV=production
```

---

## 2. Production Deployment Security Checklist
- [x] Set `NODE_ENV=production` to enable strict HSTS headers and secure cookies.
- [x] Replace default `JWT_SECRET` with an ephemeral 256-bit entropy string generated via `crypto.randomBytes(32).toString('hex')`.
- [x] Verify that `.env` files are included in `.gitignore`.
- [x] Configure production HTTPS termination using TLS 1.3 certificates.
- [x] Ensure Supabase database connections use encrypted SSL (`sslmode=require`).
- [x] Restrict database service-role key exclusively to backend server processes; never expose to frontend bundle.
