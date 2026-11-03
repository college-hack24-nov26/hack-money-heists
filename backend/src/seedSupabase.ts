import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  SEED_ORGANIZATION,
  SEED_USERS,
  SEED_CLIENTS,
  SEED_EXPENSES,
  SEED_INVOICES,
  SEED_PROFIT_LEAKAGE
} from './seedData';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mmljatcvouyjfbznxjgs.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_mt-NaU29NLLqSThp1Eym0A_BBs1NWo7';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
  console.log('[*] Seeding Supabase database:', SUPABASE_URL);

  // 1. Organization
  const { error: orgErr } = await supabase.from('organizations').upsert({
    id: SEED_ORGANIZATION.id,
    name: SEED_ORGANIZATION.name,
    industry: SEED_ORGANIZATION.industry,
    gstin: SEED_ORGANIZATION.gstin,
    pan: SEED_ORGANIZATION.pan,
    state: SEED_ORGANIZATION.state,
    currency: 'INR',
    safety_threshold: SEED_ORGANIZATION.safetyThreshold
  });
  if (orgErr) console.error('Org error:', orgErr.message);
  else console.log(' Organization seeded.');

  // 2. Users
  const usersData = SEED_USERS.map(u => ({
    id: u.id,
    organization_id: SEED_ORGANIZATION.id,
    name: u.name,
    email: u.email,
    password_hash: 'argon2id_mock_hash_for_demo',
    role: u.role
  }));
  const { error: userErr } = await supabase.from('users').upsert(usersData);
  if (userErr) console.error('User error:', userErr.message);
  else console.log(` ${usersData.length} Users seeded.`);

  // 3. Clients
  const clientsData = SEED_CLIENTS.map(c => ({
    id: c.id,
    organization_id: SEED_ORGANIZATION.id,
    name: c.name,
    company_name: c.companyName,
    gstin: c.gstin,
    email: c.email,
    phone: c.phone,
    outstanding_balance: c.outstandingBalance,
    days_sales_outstanding: c.daysSalesOutstanding,
    risk_profile: c.riskProfile,
    credit_limit: c.creditLimit,
    last_payment_date: c.lastPaymentDate,
    contract_status: c.contractStatus
  }));
  const { error: clientErr } = await supabase.from('clients').upsert(clientsData);
  if (clientErr) console.error('Client error:', clientErr.message);
  else console.log(` ${clientsData.length} Clients seeded.`);

  // 4. Expenses
  const expensesData = SEED_EXPENSES.map(e => ({
    id: e.id,
    organization_id: SEED_ORGANIZATION.id,
    vendor: e.vendor,
    category: e.category,
    description: e.description,
    amount: e.amount,
    expense_date: e.date,
    payment_method: e.paymentMethod,
    status: e.status,
    reference_no: e.referenceNo
  }));
  const { error: expErr } = await supabase.from('expenses').upsert(expensesData);
  if (expErr) console.error('Expense error:', expErr.message);
  else console.log(` ${expensesData.length} Expenses seeded.`);

  // 5. Invoices
  const invoicesData = SEED_INVOICES.map(i => ({
    id: i.id,
    organization_id: SEED_ORGANIZATION.id,
    invoice_number: i.invoice_number,
    vendor_name: i.vendor_name,
    gstin: i.gstin ? i.gstin.slice(0, 15) : null,
    bank_account: i.bank_account,
    bank_ifsc: i.bank_ifsc,
    invoice_date: i.invoice_date,
    due_date: i.due_date,
    subtotal: i.subtotal,
    gst_rate: i.gst_rate,
    tax_amount: i.tax_amount,
    total_amount: i.total_amount,
    status: i.status,
    risk_score: i.risk_score,
    risk_classification: i.risk_classification,
    anomalies_detected: i.anomalies_detected,
    supporting_evidence: i.supporting_evidence,
    recommended_verification_steps: i.recommended_verification_steps
  }));
  const { error: invErr } = await supabase.from('invoices').upsert(invoicesData);
  if (invErr) console.error('Invoice error:', invErr.message);
  else console.log(` ${invoicesData.length} Invoices seeded.`);

  // 6. Profit Leakage Findings
  const leakageData = SEED_PROFIT_LEAKAGE.map(l => ({
    id: l.id,
    organization_id: SEED_ORGANIZATION.id,
    category: l.category,
    title: l.title,
    department: l.department,
    vendor: l.vendor,
    frequency: l.frequency,
    estimated_financial_impact: l.estimated_financial_impact,
    potential_annual_savings: l.potential_annual_savings,
    leakage_type: l.leakage_type,
    historical_comparison: l.historical_comparison,
    explanation: l.explanation,
    suggested_action: l.suggested_action,
    is_resolved: false
  }));
  const { error: leakErr } = await supabase.from('profit_leakage_findings').upsert(leakageData);
  if (leakErr) console.error('Leakage error:', leakErr.message);
  else console.log(` ${leakageData.length} Profit leakage findings seeded.`);

  console.log('[*] Supabase database seeding complete!');
}

seed().catch(console.error);
