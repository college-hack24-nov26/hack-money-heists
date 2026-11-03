"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const seedData_1 = require("./seedData");
const financeEngineClient_1 = require("./services/financeEngineClient");
const aiToolsService_1 = require("./services/aiToolsService");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Ensure upload directory
const uploadDir = path_1.default.join(__dirname, '../../storage/uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const upload = (0, multer_1.default)({ dest: uploadDir });
// In-Memory Database State (seeded with realistic SME data)
let organization = { ...seedData_1.SEED_ORGANIZATION };
let users = [...seedData_1.SEED_USERS];
let currentUser = users[0];
let expenses = [...seedData_1.SEED_EXPENSES];
let invoices = [...seedData_1.SEED_INVOICES];
let clients = [...seedData_1.SEED_CLIENTS];
let leakageFindings = [...seedData_1.SEED_PROFIT_LEAKAGE];
let financialSummary = { ...seedData_1.SEED_FINANCIAL_SUMMARY };
// ---------------------------------------------------------------------
// 1. AUTHENTICATION & ORGANIZATION
// ---------------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
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
app.post('/api/auth/register', (req, res) => {
    const { name, email, companyName, gstin } = req.body;
    const newUser = {
        id: `usr-${Date.now()}`,
        name: name || "Enterprise User",
        email: email || "user@example.com",
        role: "ADMIN",
        organizationId: organization.id
    };
    if (companyName)
        organization.name = companyName;
    if (gstin)
        organization.gstin = gstin;
    users.push(newUser);
    currentUser = newUser;
    res.json({
        status: 'success',
        token: `arthiq-jwt-token-${newUser.id}`,
        user: newUser,
        organization
    });
});
app.get('/api/auth/me', (req, res) => {
    res.json({
        status: 'success',
        user: currentUser,
        organization
    });
});
app.post('/api/auth/logout', (req, res) => {
    res.json({ status: 'success', message: 'Logged out successfully' });
});
// ---------------------------------------------------------------------
// 2. DASHBOARD OVERVIEW & KPIS
// ---------------------------------------------------------------------
app.get('/api/dashboard/overview', async (req, res) => {
    const totalRev = financialSummary.revenue;
    const totalExp = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const netProfit = totalRev - financialSummary.cogs - totalExp - financialSummary.interest_expense - financialSummary.tax_expense;
    const availableCash = financialSummary.cash_and_equivalents;
    const flaggedInvoicesCount = invoices.filter(i => i.risk_score >= 50).length;
    const totalLeakage = leakageFindings.reduce((s, l) => s + l.estimated_financial_impact, 0);
    const riskRes = await financeEngineClient_1.financeEngineClient.calculateRisk(financialSummary);
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
app.get('/api/dashboard/kpis', (req, res) => {
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
app.get('/api/expenses', (req, res) => {
    res.json({
        total: expenses.length,
        expenses
    });
});
app.post('/api/expenses', (req, res) => {
    const { vendor, category, description, amount, paymentMethod, referenceNo } = req.body;
    const newExp = {
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
    res.status(201).json({ status: 'success', expense: newExp });
});
app.get('/api/expenses/analysis', async (req, res) => {
    const result = await financeEngineClient_1.financeEngineClient.analyzeExpenses(expenses, financialSummary.revenue);
    res.json(result);
});
// ---------------------------------------------------------------------
// 4. INVOICES & FRAUD INTELLIGENCE
// ---------------------------------------------------------------------
app.get('/api/invoices', (req, res) => {
    res.json({
        total: invoices.length,
        invoices
    });
});
app.post('/api/invoices/upload', upload.single('file'), async (req, res) => {
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
        status: 'PENDING'
    };
    // Run forensic fraud analysis through Python engine
    const analysis = await financeEngineClient_1.financeEngineClient.analyzeInvoice(rawInvoice, invoices, {});
    const newInvoice = {
        ...rawInvoice,
        risk_score: analysis.risk_score,
        risk_classification: analysis.risk_classification,
        anomalies_detected: analysis.anomalies_detected,
        supporting_evidence: analysis.supporting_evidence,
        recommended_verification_steps: analysis.recommended_verification_steps,
        status: analysis.risk_score >= 50 ? 'FLAGGED' : 'VERIFIED'
    };
    invoices.unshift(newInvoice);
    res.status(201).json({ status: 'success', invoice: newInvoice });
});
app.post('/api/invoices/:id/analyze', async (req, res) => {
    const invoice = invoices.find(i => i.id === req.params.id);
    if (!invoice)
        return res.status(404).json({ error: 'Invoice not found' });
    const analysis = await financeEngineClient_1.financeEngineClient.analyzeInvoice(invoice, invoices, {});
    invoice.risk_score = analysis.risk_score;
    invoice.risk_classification = analysis.risk_classification;
    invoice.anomalies_detected = analysis.anomalies_detected;
    invoice.supporting_evidence = analysis.supporting_evidence;
    invoice.recommended_verification_steps = analysis.recommended_verification_steps;
    res.json({ status: 'success', invoice });
});
app.post('/api/invoices/:id/verify', (req, res) => {
    const invoice = invoices.find(i => i.id === req.params.id);
    if (!invoice)
        return res.status(404).json({ error: 'Invoice not found' });
    invoice.status = 'VERIFIED';
    invoice.risk_score = Math.min(15, invoice.risk_score);
    invoice.risk_classification = 'Low Risk';
    res.json({ status: 'success', message: 'Invoice verified by Finance Officer', invoice });
});
// ---------------------------------------------------------------------
// 5. CASH FLOW & FORECASTING
// ---------------------------------------------------------------------
app.get('/api/cashflow/history', (req, res) => {
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
app.post('/api/cashflow/forecast', async (req, res) => {
    const { horizon_days = 30, safety_threshold = 500000 } = req.body;
    const result = await financeEngineClient_1.financeEngineClient.predictCashflow([], financialSummary.cash_and_equivalents, Number(horizon_days), Number(safety_threshold));
    res.json(result);
});
// ---------------------------------------------------------------------
// 6. PROFIT LEAKAGE DETECTOR (PLD)
// ---------------------------------------------------------------------
app.get('/api/leakage/findings', (req, res) => {
    const total = leakageFindings.reduce((s, l) => s + l.estimated_financial_impact, 0);
    const totalSavings = leakageFindings.reduce((s, l) => s + l.potential_annual_savings, 0);
    res.json({
        totalIdentified: total,
        potentialAnnualSavings: totalSavings,
        findings: leakageFindings
    });
});
app.post('/api/leakage/resolve/:id', (req, res) => {
    const id = req.params.id;
    leakageFindings = leakageFindings.filter(f => f.id !== id);
    res.json({ status: 'success', message: `Leakage finding ${id} resolved & cost optimization logged.` });
});
// ---------------------------------------------------------------------
// 7. FINANCIAL ANALYTICS & BI
// ---------------------------------------------------------------------
app.get('/api/analytics/ratios', async (req, res) => {
    const result = await financeEngineClient_1.financeEngineClient.calculateRisk(financialSummary);
    res.json(result);
});
app.get('/api/analytics/statements', (req, res) => {
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
app.get('/api/clients', (req, res) => {
    res.json({ total: clients.length, clients });
});
app.post('/api/clients', (req, res) => {
    const { name, companyName, gstin, email, phone, creditLimit } = req.body;
    const newClient = {
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
    res.status(201).json({ status: 'success', client: newClient });
});
// ---------------------------------------------------------------------
// 9. PROCUREMENT & VENDORS
// ---------------------------------------------------------------------
app.get('/api/procurement/vendors', (req, res) => {
    const vendorSpend = {};
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
app.get('/api/assistant/history', (req, res) => {
    res.json({ history: aiToolsService_1.aiAssistantService.getHistory() });
});
app.post('/api/assistant/chat', async (req, res) => {
    const { message } = req.body;
    if (!message)
        return res.status(400).json({ error: 'Message required' });
    const reply = await aiToolsService_1.aiAssistantService.processQuery(message, expenses, invoices);
    res.json({ status: 'success', reply });
});
// Health check
app.get('/api/health', (req, res) => {
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
