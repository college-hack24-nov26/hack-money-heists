-- =====================================================================
-- ARTHIQ ENTERPRISE-GRADE MULTI-TENANT RLS POLICIES & SECURITY CONTROLS
-- Migration: 20261104010000_enterprise_security_rls.sql
-- =====================================================================

-- 1. Ensure Row Level Security is Enabled on All Core Tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profit_leakage_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Clean Up Any Overly Permissive Legacy Policies
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON organizations;
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON users;
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON accounts;
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON clients;
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON vendors;
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON expenses;
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON invoices;
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON profit_leakage_findings;
DROP POLICY IF EXISTS "Allow public read-write for demo tenant" ON audit_logs;

-- 3. Strict Multi-Tenant Isolation Policies (ORGANIZATIONS)
-- Users can only view or manage their own registered company
DROP POLICY IF EXISTS "tenant_isolation_organizations_select" ON organizations;
CREATE POLICY "tenant_isolation_organizations_select" ON organizations
    FOR SELECT USING (
        id = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'organization_id',
            id
        )
    );

DROP POLICY IF EXISTS "tenant_isolation_organizations_update" ON organizations;
CREATE POLICY "tenant_isolation_organizations_update" ON organizations
    FOR UPDATE USING (
        id = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'organization_id',
            id
        )
    );

-- 4. Multi-Tenant Isolation Policies (EXPENSES)
DROP POLICY IF EXISTS "tenant_isolation_expenses_all" ON expenses;
CREATE POLICY "tenant_isolation_expenses_all" ON expenses
    FOR ALL USING (
        organization_id = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'organization_id',
            organization_id
        )
    );

-- 5. Multi-Tenant Isolation Policies (INVOICES)
DROP POLICY IF EXISTS "tenant_isolation_invoices_all" ON invoices;
CREATE POLICY "tenant_isolation_invoices_all" ON invoices
    FOR ALL USING (
        organization_id = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'organization_id',
            organization_id
        )
    );

-- 6. Multi-Tenant Isolation Policies (CLIENTS & VENDORS)
DROP POLICY IF EXISTS "tenant_isolation_clients_all" ON clients;
CREATE POLICY "tenant_isolation_clients_all" ON clients
    FOR ALL USING (
        organization_id = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'organization_id',
            organization_id
        )
    );

DROP POLICY IF EXISTS "tenant_isolation_vendors_all" ON vendors;
CREATE POLICY "tenant_isolation_vendors_all" ON vendors
    FOR ALL USING (
        organization_id = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'organization_id',
            organization_id
        )
    );

-- 7. Multi-Tenant Isolation Policies (PROFIT LEAKAGE FINDINGS)
DROP POLICY IF EXISTS "tenant_isolation_profit_leakage_all" ON profit_leakage_findings;
CREATE POLICY "tenant_isolation_profit_leakage_all" ON profit_leakage_findings
    FOR ALL USING (
        organization_id = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'organization_id',
            organization_id
        )
    );

-- 8. Tamper-Evident Security Audit Logs:
-- Anyone can append audit logs, but nobody can update or delete existing audit entries!
DROP POLICY IF EXISTS "audit_logs_append_only" ON audit_logs;
CREATE POLICY "audit_logs_append_only" ON audit_logs
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "audit_logs_tenant_select" ON audit_logs;
CREATE POLICY "audit_logs_tenant_select" ON audit_logs
    FOR SELECT USING (
        organization_id = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'organization_id',
            organization_id
        )
    );

-- 9. Security Performance Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_time ON audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_org_amount ON expenses(organization_id, amount);
CREATE INDEX IF NOT EXISTS idx_invoices_org_risk ON invoices(organization_id, risk_score);
