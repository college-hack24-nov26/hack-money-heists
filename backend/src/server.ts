import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  SEED_ORGANIZATION,
  SEED_USERS,
  SEED_EXPENSES,
  SEED_INVOICES,
  SEED_CLIENTS,
  SEED_PROFIT_LEAKAGE,
  SEED_FINANCIAL_SUMMARY,
  Expense,
  Invoice,
  Client,
  ProfitLeakageFinding
} from './seedData';
import { financeEngineClient } from './services/financeEngineClient';
import { aiAssistantService } from './services/aiToolsService';
import { supabaseService } from './services/supabaseService';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory
const uploadDir = path.join(__dirname, '../../storage/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// In-Memory Database State (seeded with realistic SME data)
let organization = { ...SEED_ORGANIZATION };
let users = [...SEED_USERS];
let currentUser = users[0];
let expenses: Expense[] = [...SEED_EXPENSES];
let invoices: Invoice[] = [...SEED_INVOICES];
let clients: Client[] = [...SEED_CLIENTS];
let leakageFindings: ProfitLeakageFinding[] = [...SEED_PROFIT_LEAKAGE];
let financialSummary = { ...SEED_FINANCIAL_SUMMARY };

// ---------------------------------------------------------------------
// 1. AUTHENTICATION & ORGANIZATION
// ---------------------------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email) || users[0];
  currentUser = user;
  res.json({
    status: 'success',
    token: `arthiq-jwt-token-${user.id}`,
    user,
    organization
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, companyName, gstin } = req.body;
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || "Enterprise User",
    email: email || "user@example.com",
    role: "ADMIN" as const,
    organizationId: organization.id
  };
  if (companyName) organization.name = companyName;
  if (gstin) organization.gstin = gstin;
  users.push(newUser);
  currentUser = newUser;
  res.json({
    status: 'success',
    token: `arthiq-jwt-token-${newUser.id}`,
    user: newUser,
    organization
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    user: currentUser,
    organization
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
});

// ---------------------------------------------------------------------
// 2. DASHBOARD OVERVIEW & KPIS
// ---------------------------------------------------------------------
app.get('/api/dashboard/overview', async (req: Request, res: Response) => {
  const totalRev = financialSummary.revenue;
  const totalExp = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = totalRev - financialSummary.cogs - totalExp - financialSummary.interest_expense - financialSummary.tax_expense;
  const availableCash = financialSummary.cash_and_equivalents;
  const flaggedInvoicesCount = invoices.filter(i => i.risk_score >= 50).length;
  const totalLeakage = leakageFindings.reduce((s, l) => s + l.estimated_financial_impact, 0);

  const riskRes = await financeEngineClient.calculateRisk(financialSummary);

  res.json({
    organization: organization.name,
    gstin: organization.gstin,
    kpis: {
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      netProfit,
      netProfitMargin: Number(((netProfit / totalRev) * 100).toFixed(2)),
      availableCash,
      cashRunwayMonths: 14.2,
      financialHealthScore: riskRes.financial_health_score,
      healthStatus: riskRes.health_band,
      flaggedInvoicesCount,
      totalLeakageIdentified: totalLeakage,
      potentialAnnualSavings: leakageFindings.reduce((s, l) => s + l.potential_annual_savings, 0)
    },
    riskRadar: riskRes.risk_radar,
    recentTransactions: expenses.slice(0, 5),
    topSuspiciousInvoices: invoices.filter(i => i.risk_score >= 50).slice(0, 3)
  });
});

app.get('/api/dashboard/kpis', (req: Request, res: Response) => {
  const totalExp = expenses.reduce((s, e) => s + Number(e.amount), 0);
  res.json({
    revenue: financialSummary.revenue,
    expenses: totalExp,
    cash: financialSummary.cash_and_equivalents,
    runway: "14.2 months",
    healthScore: 84
  });
});

// ---------------------------------------------------------------------
// 3. EXPENSES
// ---------------------------------------------------------------------
app.get('/api/expenses', (req: Request, res: Response) => {
  res.json({
    total: expenses.length,
    expenses
  });
});

app.post('/api/expenses', async (req: Request, res: Response) => {
  const { vendor, category, description, amount, paymentMethod, referenceNo } = req.body;
  const newExp: Expense = {
    id: `EXP-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    vendor: vendor || 'General Vendor',
    category: category || 'Operating',
    description: description || 'Operational purchase',
    amount: Number(amount) || 0,
    status: 'Approved',
    paymentMethod: paymentMethod || 'Bank Transfer',
    referenceNo: referenceNo || `REF-${Math.floor(Math.random() * 90000 + 10000)}`
  };
  expenses.unshift(newExp);
  await supabaseService.insertExpense(newExp);
  res.status(201).json({ status: 'success', expense: newExp });
});

app.get('/api/expenses/analysis', async (req: Request, res: Response) => {
  const result = await financeEngineClient.analyzeExpenses(expenses, financialSummary.revenue);
  res.json(result);
});

// ---------------------------------------------------------------------
// 4. INVOICES & FRAUD INTELLIGENCE
// ---------------------------------------------------------------------
app.get('/api/invoices', (req: Request, res: Response) => {
  res.json({
    total: invoices.length,
    invoices
  });
});

app.post('/api/invoices/upload', upload.single('file'), async (req: Request, res: Response) => {
  const body = req.body || {};
  const invNum = body.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const vendorName = body.vendor_name || (req.file ? req.file.originalname.replace(/\.[^/.]+$/, "") : "Dynamic Vendor Solutions");
  const amount = Number(body.total_amount) || Math.floor(Math.random() * 80000 + 15000);
  const gstin = body.gstin || (amount > 50000 ? "27AAPFU0939F1ZV" : "INVALID_GST_777");
  const subtotal = Math.round((amount / 1.18) * 100) / 100;
  const tax = Math.round((amount - subtotal) * 100) / 100;

  const rawInvoice = {
    id: `inv-${Date.now()}`,
    invoice_number: invNum,
    vendor_name: vendorName,
    gstin,
    bank_account: body.bank_account || "00021020008899",
    bank_ifsc: body.bank_ifsc || "HDFC0000002",
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    subtotal,
    gst_rate: 18.0,
    tax_amount: tax,
    total_amount: amount,
    status: 'PENDING' as const
  };

  // Run forensic fraud analysis through Python engine
  const analysis = await financeEngineClient.analyzeInvoice(rawInvoice, invoices, {});

  const newInvoice: Invoice = {
    ...rawInvoice,
    risk_score: analysis.risk_score,
    risk_classification: analysis.risk_classification,
    anomalies_detected: analysis.anomalies_detected,
    supporting_evidence: analysis.supporting_evidence,
    recommended_verification_steps: analysis.recommended_verification_steps,
    status: analysis.risk_score >= 50 ? 'FLAGGED' : 'VERIFIED'
  };

  invoices.unshift(newInvoice);
  await supabaseService.insertInvoice(newInvoice);
  res.status(201).json({ status: 'success', invoice: newInvoice });
});

app.post('/api/invoices/:id/analyze', async (req: Request, res: Response) => {
  const invoice = invoices.find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  const analysis = await financeEngineClient.analyzeInvoice(invoice, invoices, {});
  invoice.risk_score = analysis.risk_score;
  invoice.risk_classification = analysis.risk_classification;
  invoice.anomalies_detected = analysis.anomalies_detected;
  invoice.supporting_evidence = analysis.supporting_evidence;
  invoice.recommended_verification_steps = analysis.recommended_verification_steps;
  res.json({ status: 'success', invoice });
});

app.post('/api/invoices/:id/verify', async (req: Request, res: Response) => {
  const invoice = invoices.find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  invoice.status = 'VERIFIED';
  invoice.risk_score = Math.min(15, invoice.risk_score);
  invoice.risk_classification = 'Low Risk';
  await supabaseService.updateInvoiceStatus(invoice.id, 'VERIFIED', invoice.risk_score, 'Low Risk');
  res.json({ status: 'success', message: 'Invoice verified by Finance Officer', invoice });
});

// ---------------------------------------------------------------------
// 5. CASH FLOW & FORECASTING
// ---------------------------------------------------------------------
app.get('/api/cashflow/history', (req: Request, res: Response) => {
  const base = financialSummary.cash_and_equivalents;
  const history = [];
  const now = new Date();
  let b = base;
  for (let i = 30; i >= 0; i--) {
    const dt = new Date(now.getTime() - i * 86400000);
    const inflow = 75000 + (i % 5 === 0 ? 120000 : 0);
    const outflow = 62000 + (i % 7 === 0 ? 80000 : 0);
    b += (inflow - outflow);
    history.push({
      date: dt.toISOString().split('T')[0],
      inflow,
      outflow,
      balance: b
    });
  }
  res.json({ history });
});

app.post('/api/cashflow/forecast', async (req: Request, res: Response) => {
  const { horizon_days = 30, safety_threshold = 500000 } = req.body;
  const result = await financeEngineClient.predictCashflow(
    [],
    financialSummary.cash_and_equivalents,
    Number(horizon_days),
    Number(safety_threshold)
  );
  res.json(result);
});

// ---------------------------------------------------------------------
// 6. PROFIT LEAKAGE DETECTOR (PLD)
// ---------------------------------------------------------------------
app.get('/api/leakage/findings', (req: Request, res: Response) => {
  const total = leakageFindings.reduce((s, l) => s + l.estimated_financial_impact, 0);
  const totalSavings = leakageFindings.reduce((s, l) => s + l.potential_annual_savings, 0);
  res.json({
    totalIdentified: total,
    potentialAnnualSavings: totalSavings,
    findings: leakageFindings
  });
});

app.post('/api/leakage/resolve/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  leakageFindings = leakageFindings.filter(f => f.id !== id);
  res.json({ status: 'success', message: `Leakage finding ${id} resolved & cost optimization logged.` });
});

// ---------------------------------------------------------------------
// 7. FINANCIAL ANALYTICS & BI
// ---------------------------------------------------------------------
app.get('/api/analytics/ratios', async (req: Request, res: Response) => {
  const result = await financeEngineClient.calculateRisk(financialSummary);
  res.json(result);
});

app.get('/api/analytics/statements', (req: Request, res: Response) => {
  res.json({
    summary: financialSummary,
    pl: [
      { name: 'Gross Revenue', q1: 4500000, q2: 4950000, var: '+10.0%' },
      { name: 'Cost of Goods Sold', q1: 2200000, q2: 2380000, var: '+8.2%' },
      { name: 'Gross Profit', q1: 2300000, q2: 2570000, var: '+11.7%' },
      { name: 'Operating Expenses', q1: 1250000, q2: 1310000, var: '+4.8%' },
      { name: 'Operating Income (EBIT)', q1: 955000, q2: 1165000, var: '+22.0%' },
      { name: 'Finance & Interest', q1: 65000, q2: 60000, var: '-7.7%' },
      { name: 'Statutory Taxes', q1: 195800, q2: 243100, var: '+24.2%' },
      { name: 'Net Profit After Tax', q1: 694200, q2: 861900, var: '+24.2%' }
    ]
  });
});

// ---------------------------------------------------------------------
// 8. CLIENT MANAGEMENT
// ---------------------------------------------------------------------
app.get('/api/clients', (req: Request, res: Response) => {
  res.json({ total: clients.length, clients });
});

app.post('/api/clients', async (req: Request, res: Response) => {
  const { name, companyName, gstin, email, phone, creditLimit } = req.body;
  const newClient: Client = {
    id: `cli-${Date.now()}`,
    name: name || "New Enterprise Client",
    companyName: companyName || name || "Enterprise Partner Ltd",
    gstin: gstin || "27AAPFU0939F1ZV",
    email: email || "accounts@client.example.com",
    phone: phone || "+91 80 4000 1122",
    outstandingBalance: 0.0,
    daysSalesOutstanding: 15,
    riskProfile: "Low",
    creditLimit: Number(creditLimit) || 1000000,
    lastPaymentDate: new Date().toISOString().split('T')[0],
    contractStatus: "Active"
  };
  clients.unshift(newClient);
  await supabaseService.insertClient(newClient);
  res.status(201).json({ status: 'success', client: newClient });
});

// ---------------------------------------------------------------------
// DATABASE & SUPABASE SYNC STATUS
// ---------------------------------------------------------------------
app.get('/api/database/status', async (req: Request, res: Response) => {
  const isHealthy = await supabaseService.testConnection();
  res.json({
    status: 'success',
    provider: 'Supabase Cloud (PostgreSQL)',
    projectRef: 'mmljatcvouyjfbznxjgs',
    projectUrl: 'https://mmljatcvouyjfbznxjgs.supabase.co',
    isAvailable: supabaseService.isAvailable(),
    connected: isHealthy,
    clientConfigured: true,
    tables: [
      'organizations',
      'users',
      'accounts',
      'clients',
      'vendors',
      'expenses',
      'invoices',
      'profit_leakage_findings',
      'audit_logs'
    ],
    timestamp: new Date().toISOString()
  });
});

// ---------------------------------------------------------------------
// 9. PROCUREMENT & VENDORS
// ---------------------------------------------------------------------
app.get('/api/procurement/vendors', (req: Request, res: Response) => {
  const vendorSpend: { [k: string]: { total: number; count: number; category: string } } = {};
  expenses.forEach(e => {
    if (!vendorSpend[e.vendor]) {
      vendorSpend[e.vendor] = { total: 0, count: 0, category: e.category };
    }
    vendorSpend[e.vendor].total += Number(e.amount);
    vendorSpend[e.vendor].count += 1;
  });

  const list = Object.entries(vendorSpend).map(([vendor, meta]) => ({
    vendor,
    totalSpend: meta.total,
    transactionCount: meta.count,
    category: meta.category,
    priceEscalationRisk: vendor.includes("Logistics") ? "High (+23% Creep)" : "Normal"
  }));

  res.json({ vendors: list });
});

// ---------------------------------------------------------------------
// 10. AI ASSISTANT CHAT
// ---------------------------------------------------------------------
app.get('/api/assistant/history', (req: Request, res: Response) => {
  res.json({ history: aiAssistantService.getHistory() });
});

app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const reply = await aiAssistantService.processQuery(message, expenses, invoices);
  res.json({ status: 'success', reply });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'ARTHIQ Fintech Core API Gateway',
    timestamp: new Date().toISOString(),
    organization: organization.name
  });
});

app.listen(PORT, () => {
  console.log(`[*] ARTHIQ Core API Gateway running on http://127.0.0.1:${PORT}`);
});

