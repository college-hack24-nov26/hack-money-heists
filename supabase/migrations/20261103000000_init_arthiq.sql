-- =====================================================================
-- ARTHIQ FINANCIAL INTELLIGENCE PLATFORM
-- Unified Multi-Tenant Financial Schema (Supabase / PostgreSQL)
-- =====================================================================

CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    gstin VARCHAR(15) NOT NULL UNIQUE,
    pan VARCHAR(10) NOT NULL,
    state VARCHAR(64),
    currency VARCHAR(16) DEFAULT 'INR',
    safety_threshold NUMERIC(15,2) DEFAULT 500000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'ANALYST',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    account_number VARCHAR(64) NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    ifsc VARCHAR(16) NOT NULL,
    account_type VARCHAR(32) DEFAULT 'CURRENT',
    current_balance NUMERIC(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    gstin VARCHAR(15),
    email VARCHAR(255),
    phone VARCHAR(32),
    outstanding_balance NUMERIC(15,2) DEFAULT 0.00,
    days_sales_outstanding INT DEFAULT 0,
    risk_profile VARCHAR(32) DEFAULT 'Low',
    credit_limit NUMERIC(15,2) DEFAULT 1000000.00,
    last_payment_date DATE,
    contract_status VARCHAR(32) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    bank_account VARCHAR(64),
    bank_ifsc VARCHAR(16),
    category VARCHAR(64),
    risk_rating VARCHAR(32) DEFAULT 'Verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    vendor VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT,
    amount NUMERIC(15,2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(64),
    status VARCHAR(32) DEFAULT 'Approved',
    reference_no VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(64) NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    bank_account VARCHAR(64),
    bank_ifsc VARCHAR(16),
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal NUMERIC(15,2) NOT NULL,
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    tax_amount NUMERIC(15,2) DEFAULT 0.00,
    total_amount NUMERIC(15,2) NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING',
    risk_score INT DEFAULT 0,
    risk_classification VARCHAR(32) DEFAULT 'Low Risk',
    anomalies_detected JSONB,
    supporting_evidence JSONB,
    recommended_verification_steps JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profit_leakage_findings (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(128),
    vendor VARCHAR(255),
    frequency VARCHAR(64),
    estimated_financial_impact NUMERIC(15,2) NOT NULL,
    potential_annual_savings NUMERIC(15,2) NOT NULL,
    leakage_type VARCHAR(64) NOT NULL,
    historical_comparison TEXT,
    explanation TEXT,
    suggested_action TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    ip_address VARCHAR(45),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_org_date ON expenses(organization_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_invoices_org_status ON invoices(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_leakage_org ON profit_leakage_findings(organization_id);

-- Enable RLS and permissive policy for authenticated & anon clients
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profit_leakage_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for demo tenant" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo tenant" ON users FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo tenant" ON accounts FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo tenant" ON clients FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo tenant" ON vendors FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo tenant" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo tenant" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo tenant" ON profit_leakage_findings FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo tenant" ON audit_logs FOR ALL USING (true);

