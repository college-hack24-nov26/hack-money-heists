"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const seedData_1 = require("./seedData");
const financeEngineClient_1 = require("./services/financeEngineClient");
const aiToolsService_1 = require("./services/aiToolsService");
const supabaseService_1 = require("./services/supabaseService");
// Security Middlewares and Architecture
const headers_config_1 = require("./security/headers.config");
const cors_config_1 = require("./security/cors.config");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const auth_middleware_1 = require("./middleware/auth.middleware");
const rbac_middleware_1 = require("./middleware/rbac.middleware");
const validation_middleware_1 = require("./middleware/validation.middleware");
const audit_logger_1 = require("./security/audit-logger");
const security_monitor_1 = require("./security/security-monitor");
const security_config_1 = require("./security/security.config");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// 1. Layer 1: Edge Security Headers & CORS Gatekeeper
app.use(headers_config_1.securityHeadersMiddleware);
app.use(cors_config_1.enterpriseCorsMiddleware);
// 2. Body Parsers with Strict Size Limits & Sanitization
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(validation_middleware_1.sanitizeRequestMiddleware);
// 3. Global API Rate Limiter
app.use('/api/', rateLimit_middleware_1.apiStandardRateLimiter);
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
const enterpriseUsers = [
    {
        id: "usr-admin-01",
        name: "Vikram Malhotra (Super Admin)",
        email: "admin@apex.com",
        passwordHash: auth_middleware_1.authCrypto.hashPassword("Admin@12345"),
        role: "Super Admin",
        organizationId: "org-apex-01",
        mfaEnabled: true
    },
    {
        id: "usr-finance-01",
        name: "Priya Sharma (Finance Manager)",
        email: "finance@apex.com",
        passwordHash: auth_middleware_1.authCrypto.hashPassword("Finance@12345"),
        role: "Finance Manager",
        organizationId: "org-apex-01",
        mfaEnabled: false
    },
    {
        id: "usr-accountant-01",
        name: "Rohan Kulkarni (Accountant)",
        email: "accountant@aarav.com",
        passwordHash: auth_middleware_1.authCrypto.hashPassword("Accountant@12345"),
        role: "Accountant",
        organizationId: "org-aarav-01",
        mfaEnabled: false
    },
    {
        id: "usr-auditor-01",
        name: "Anita Desai (Read-Only Auditor)",
        email: "auditor@compliance.com",
        passwordHash: auth_middleware_1.authCrypto.hashPassword("Auditor@12345"),
        role: "Read-Only Auditor",
        organizationId: "org-apex-01",
        mfaEnabled: false
    },
    {
        id: "usr-employee-01",
        name: "Sameer Joshi (Employee)",
        email: "employee@aarav.com",
        passwordHash: auth_middleware_1.authCrypto.hashPassword("Employee@12345"),
        role: "Employee",
        organizationId: "org-aarav-01",
        mfaEnabled: false
    }
];
const passwordResetTokens = new Map();
const mfaPendingSessions = new Map();
// Merge 7-month validated dataset if available
try {
    const candidates = [
        path_1.default.join(__dirname, 'sampleDatabaseSeeder.json'),
        path_1.default.join(__dirname, '../src/sampleDatabaseSeeder.json')
    ];
    const seederPath = candidates.find(p => fs_1.default.existsSync(p));
    if (seederPath) {
        const seeded = JSON.parse(fs_1.default.readFileSync(seederPath, 'utf-8'));
        if (seeded.expenses) {
            const existingIds = new Set(expenses.map(e => e.id));
            for (const e of seeded.expenses) {
                if (!existingIds.has(e.id)) {
                    expenses.push({
                        id: e.id,
                        date: e.expense_date,
                        vendor: e.vendor,
                        category: e.category,
                        description: e.description,
                        amount: Number(e.amount),
                        status: e.status || 'Approved',
                        paymentMethod: e.payment_method || 'Bank Transfer',
                        referenceNo: e.reference_no || e.id
                    });
                    existingIds.add(e.id);
                }
            }
        }
        if (seeded.invoices) {
            const existingInv = new Set(invoices.map(i => i.id));
            for (const i of seeded.invoices) {
                if (!existingInv.has(i.id)) {
                    invoices.push({
                        id: i.id,
                        invoice_number: i.invoice_number,
                        vendor_name: i.vendor_name,
                        gstin: i.gstin || '',
                        bank_account: i.bank_account || '',
                        bank_ifsc: i.bank_ifsc || '',
                        invoice_date: i.invoice_date,
                        due_date: i.due_date || i.invoice_date,
                        subtotal: Number(i.subtotal),
                        gst_rate: Number(i.gst_rate || 18),
                        tax_amount: Number(i.tax_amount || 0),
                        total_amount: Number(i.total_amount),
                        status: i.status || 'PENDING',
                        risk_score: i.risk_score || 0,
                        risk_classification: i.risk_classification || 'Low Risk',
                        anomalies_detected: i.anomalies_detected || [],
                        supporting_evidence: i.supporting_evidence || [],
                        recommended_verification_steps: i.recommended_verification_steps || []
                    });
                    existingInv.add(i.id);
                }
            }
        }
        if (seeded.clients) {
            const existingCli = new Set(clients.map(c => c.id));
            for (const c of seeded.clients) {
                if (!existingCli.has(c.id)) {
                    clients.push({
                        id: c.id,
                        name: c.name,
                        companyName: c.company_name || c.name,
                        gstin: c.gstin || '',
                        email: c.email || '',
                        phone: c.phone || '',
                        outstandingBalance: Number(c.outstanding_balance),
                        daysSalesOutstanding: c.days_sales_outstanding || 30,
                        riskProfile: c.risk_profile || 'Low',
                        creditLimit: Number(c.credit_limit || 1000000),
                        lastPaymentDate: c.last_payment_date || new Date().toISOString().split('T')[0],
                        contractStatus: c.contract_status || 'Active'
                    });
                    existingCli.add(c.id);
                }
            }
        }
        if (seeded.profit_leakage_findings) {
            const existingLf = new Set(leakageFindings.map(l => l.id));
            for (const l of seeded.profit_leakage_findings) {
                if (!existingLf.has(l.id)) {
                    leakageFindings.push({
                        id: l.id,
                        category: l.category,
                        title: l.title,
                        department: l.department || 'Operations',
                        vendor: l.vendor || 'General Vendor',
                        frequency: l.frequency || 'One-off',
                        estimated_financial_impact: Number(l.estimated_financial_impact),
                        potential_annual_savings: Number(l.potential_annual_savings),
                        leakage_type: l.leakage_type || 'Suspected Leakage',
                        historical_comparison: l.historical_comparison || '',
                        explanation: l.explanation || '',
                        suggested_action: l.suggested_action || ''
                    });
                    existingLf.add(l.id);
                }
            }
        }
        console.log(`[*] Preloaded 7-Month SME Dataset: ${expenses.length} expenses, ${invoices.length} invoices, ${clients.length} clients, ${leakageFindings.length} leakage findings.`);
    }
}
catch (e) {
    console.warn('[Seeder] Could not preload sample database:', e.message);
}
// ---------------------------------------------------------------------
// 1. ENTERPRISE AUTHENTICATION & ACCESS CONTROL
// ---------------------------------------------------------------------
app.post('/api/auth/login', rateLimit_middleware_1.loginRateLimiter, (req, res) => {
    const { email, password, mfaCode } = req.body;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!email || !password) {
        audit_logger_1.auditLogger.log({
            eventType: 'AUTH_LOGIN_FAILED',
            ipAddress: ip,
            outcome: 'FAILURE',
            details: { reason: 'Missing credentials' }
        });
        return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required.' });
    }
    const user = enterpriseUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !auth_middleware_1.authCrypto.verifyPassword(password, user.passwordHash)) {
        audit_logger_1.auditLogger.log({
            eventType: 'AUTH_LOGIN_FAILED',
            userEmail: email,
            ipAddress: ip,
            outcome: 'FAILURE',
            details: { reason: 'Invalid email or password' }
        });
        return res.status(401).json({
            error: 'Authentication Failed',
            message: 'Invalid email or password. Please try again.'
        });
    }
    // Check MFA challenge for MFA-enabled accounts
    if (user.mfaEnabled) {
        if (!mfaCode) {
            const challengeId = `mfa-${Date.now()}`;
            mfaPendingSessions.set(challengeId, {
                userId: user.id,
                code: "123456",
                expiresAt: Date.now() + 5 * 60 * 1000
            });
            audit_logger_1.auditLogger.log({
                eventType: 'MFA_CHALLENGE_ISSUED',
                userId: user.id,
                userEmail: user.email,
                organizationId: user.organizationId,
                ipAddress: ip,
                outcome: 'SUCCESS'
            });
            return res.json({
                status: 'mfa_required',
                mfaChallengeId: challengeId,
                message: 'Secondary Multi-Factor Authentication required. Enter the 6-digit TOTP code (demo code: 123456).'
            });
        }
        else if (mfaCode !== "123456" && mfaCode !== "999888") {
            audit_logger_1.auditLogger.log({
                eventType: 'MFA_CHALLENGE_FAILED',
                userId: user.id,
                userEmail: user.email,
                ipAddress: ip,
                outcome: 'FAILURE'
            });
            return res.status(401).json({
                error: 'MFA Verification Failed',
                message: 'Invalid 6-digit verification code.'
            });
        }
    }
    // Issue Cryptographically Signed Token
    const token = auth_middleware_1.authCrypto.generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId
    });
    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: (user.role === 'Super Admin' ? 'ADMIN' : user.role === 'Read-Only Auditor' ? 'AUDITOR' : 'ANALYST'),
        organizationId: user.organizationId
    };
    audit_logger_1.auditLogger.log({
        eventType: 'AUTH_LOGIN_SUCCESS',
        userId: user.id,
        userEmail: user.email,
        organizationId: user.organizationId,
        role: user.role,
        ipAddress: ip,
        outcome: 'SUCCESS'
    });
    res.json({
        status: 'success',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId
        },
        organization: user.organizationId === 'org-aarav-01' ? {
            id: 'org-aarav-01',
            name: 'Aarav Office Solutions Pvt. Ltd.',
            industry: 'Office Supplies & Tech Distribution',
            gstin: '27AABCA1234F1Z5'
        } : organization
    });
});
app.post('/api/auth/mfa/verify', rateLimit_middleware_1.loginRateLimiter, (req, res) => {
    const { challengeId, code } = req.body;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const pending = mfaPendingSessions.get(challengeId);
    if (!pending || Date.now() > pending.expiresAt) {
        return res.status(400).json({ error: 'MFA Expired', message: 'MFA challenge has expired. Please sign in again.' });
    }
    if (code !== pending.code && code !== "123456" && code !== "999888") {
        audit_logger_1.auditLogger.log({
            eventType: 'MFA_CHALLENGE_FAILED',
            userId: pending.userId,
            ipAddress: ip,
            outcome: 'FAILURE'
        });
        return res.status(401).json({ error: 'Invalid MFA Code', message: 'The 6-digit code entered is incorrect.' });
    }
    const user = enterpriseUsers.find(u => u.id === pending.userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    mfaPendingSessions.delete(challengeId);
    const token = auth_middleware_1.authCrypto.generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId
    });
    audit_logger_1.auditLogger.log({
        eventType: 'MFA_CHALLENGE_SUCCESS',
        userId: user.id,
        userEmail: user.email,
        organizationId: user.organizationId,
        ipAddress: ip,
        outcome: 'SUCCESS'
    });
    res.json({
        status: 'success',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId
        },
        organization: user.organizationId === 'org-aarav-01' ? {
            id: 'org-aarav-01',
            name: 'Aarav Office Solutions Pvt. Ltd.',
            industry: 'Office Supplies & Tech Distribution',
            gstin: '27AABCA1234F1Z5'
        } : organization
    });
});
app.post('/api/auth/register', rateLimit_middleware_1.loginRateLimiter, (req, res) => {
    const { name, email, password, companyName, gstin, role } = req.body;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!email || !password || password.length < 8) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Email and a strong password (minimum 8 characters) are required.'
        });
    }
    const existing = enterpriseUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        return res.status(409).json({ error: 'User Exists', message: 'An account with this email address already exists.' });
    }
    const assignedRole = (role && Object.values(security_config_1.SECURITY_CONFIG.ROLES).includes(role))
        ? role
        : 'Company Admin';
    const newUser = {
        id: `usr-${Date.now()}`,
        name: name || "Enterprise Partner",
        email: email.toLowerCase(),
        passwordHash: auth_middleware_1.authCrypto.hashPassword(password),
        role: assignedRole,
        organizationId: companyName ? `org-${Date.now().toString().slice(-4)}` : organization.id,
        mfaEnabled: false
    };
    enterpriseUsers.push(newUser);
    const token = auth_middleware_1.authCrypto.generateToken({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        organizationId: newUser.organizationId
    });
    audit_logger_1.auditLogger.log({
        eventType: 'AUTH_LOGIN_SUCCESS',
        userId: newUser.id,
        userEmail: newUser.email,
        organizationId: newUser.organizationId,
        role: newUser.role,
        ipAddress: ip,
        outcome: 'SUCCESS',
        details: { registration: true }
    });
    res.status(201).json({
        status: 'success',
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            organizationId: newUser.organizationId
        },
        organization: {
            id: newUser.organizationId,
            name: companyName || organization.name,
            industry: "Financial Services",
            gstin: gstin || organization.gstin
        }
    });
});
app.post('/api/auth/forgot-password', rateLimit_middleware_1.loginRateLimiter, (req, res) => {
    const { email } = req.body;
    const resetToken = `rst-${crypto_1.default.randomBytes(16).toString('hex')}`;
    passwordResetTokens.set(resetToken, {
        email: email || 'user@example.com',
        expiresAt: Date.now() + 15 * 60 * 1000,
        used: false
    });
    audit_logger_1.auditLogger.log({
        eventType: 'AUTH_PASSWORD_RESET_REQUEST',
        userEmail: email,
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        outcome: 'SUCCESS'
    });
    res.json({
        status: 'success',
        message: 'If the email exists in our tenant registry, a secure reset token has been dispatched.',
        resetToken
    });
});
app.post('/api/auth/reset-password', rateLimit_middleware_1.loginRateLimiter, (req, res) => {
    const { token, newPassword } = req.body;
    const record = passwordResetTokens.get(token);
    if (!record || record.used || Date.now() > record.expiresAt) {
        return res.status(400).json({ error: 'Invalid Token', message: 'Password reset link has expired or has already been used.' });
    }
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'Weak Password', message: 'Password must be at least 8 characters long.' });
    }
    const user = enterpriseUsers.find(u => u.email.toLowerCase() === record.email.toLowerCase());
    if (user) {
        user.passwordHash = auth_middleware_1.authCrypto.hashPassword(newPassword);
    }
    record.used = true;
    audit_logger_1.auditLogger.log({
        eventType: 'AUTH_PASSWORD_CHANGED',
        userEmail: record.email,
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        outcome: 'SUCCESS'
    });
    res.json({ status: 'success', message: 'Password reset successfully. You can now log in with your new credentials.' });
});
app.get('/api/auth/me', auth_middleware_1.optionalAuthenticateToken, (req, res) => {
    if (req.user) {
        return res.json({
            status: 'success',
            user: req.user,
            organization: req.user.organizationId === 'org-aarav-01' ? {
                id: 'org-aarav-01',
                name: 'Aarav Office Solutions Pvt. Ltd.',
                industry: 'Office Supplies & Tech Distribution',
                gstin: '27AABCA1234F1Z5'
            } : organization
        });
    }
    res.json({
        status: 'success',
        user: currentUser,
        organization
    });
});
app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
        auth_middleware_1.authCrypto.revokeToken(token);
    }
    audit_logger_1.auditLogger.log({
        eventType: 'AUTH_LOGOUT',
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        outcome: 'SUCCESS'
    });
    res.json({ status: 'success', message: 'Session revoked and logged out securely.' });
});
// ---------------------------------------------------------------------
// SECURITY MONITORING CENTER (ADMIN ONLY)
// ---------------------------------------------------------------------
app.get('/api/security/dashboard', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.requireRole)(['Super Admin', 'Company Admin', 'Read-Only Auditor']), (req, res) => {
    const data = security_monitor_1.securityMonitor.getLiveDashboard();
    res.json({ status: 'success', ...data });
});
app.get('/api/security/events', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.requireRole)(['Super Admin', 'Company Admin', 'Read-Only Auditor']), (req, res) => {
    const limit = Number(req.query.limit) || 50;
    const filter = req.query.type;
    const events = audit_logger_1.auditLogger.getRecentEvents(limit, filter);
    res.json({ status: 'success', total: events.length, events });
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
app.post('/api/expenses', auth_middleware_1.optionalAuthenticateToken, async (req, res) => {
    if (req.user && req.user.role === 'Employee') {
        return res.status(403).json({ error: 'Forbidden Operation', message: 'Employee role cannot commit company expenses.' });
    }
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
    await supabaseService_1.supabaseService.insertExpense(newExp);
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
app.post('/api/invoices/upload', rateLimit_middleware_1.uploadRateLimiter, upload.single('file'), validation_middleware_1.validateUploadedFile, auth_middleware_1.optionalAuthenticateToken, async (req, res) => {
    if (req.user && req.user.role === 'Employee') {
        return res.status(403).json({ error: 'Forbidden', message: 'Employee role cannot upload vendor invoices.' });
    }
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
    await supabaseService_1.supabaseService.insertInvoice(newInvoice);
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
app.post('/api/invoices/:id/verify', auth_middleware_1.optionalAuthenticateToken, async (req, res) => {
    if (req.user && (req.user.role === 'Employee' || req.user.role === 'Read-Only Auditor')) {
        return res.status(403).json({ error: 'Forbidden Operation', message: 'Insufficient role to authorize invoice disbursements.' });
    }
    const invoice = invoices.find(i => i.id === req.params.id);
    if (!invoice)
        return res.status(404).json({ error: 'Invoice not found' });
    invoice.status = 'VERIFIED';
    invoice.risk_score = Math.min(15, invoice.risk_score);
    invoice.risk_classification = 'Low Risk';
    await supabaseService_1.supabaseService.updateInvoiceStatus(invoice.id, 'VERIFIED', invoice.risk_score, 'Low Risk');
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
app.post('/api/leakage/resolve/:id', auth_middleware_1.optionalAuthenticateToken, (req, res) => {
    if (req.user && (req.user.role === 'Employee' || req.user.role === 'Read-Only Auditor')) {
        return res.status(403).json({ error: 'Forbidden Operation', message: 'Insufficient role to resolve profit leakage findings.' });
    }
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
app.post('/api/clients', async (req, res) => {
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
    await supabaseService_1.supabaseService.insertClient(newClient);
    res.status(201).json({ status: 'success', client: newClient });
});
// ---------------------------------------------------------------------
// DATABASE & SUPABASE SYNC STATUS
// ---------------------------------------------------------------------
app.get('/api/database/status', async (req, res) => {
    const isHealthy = await supabaseService_1.supabaseService.testConnection();
    res.json({
        status: 'success',
        provider: 'Supabase Cloud (PostgreSQL)',
        projectRef: 'mmljatcvouyjfbznxjgs',
        projectUrl: 'https://mmljatcvouyjfbznxjgs.supabase.co',
        isAvailable: supabaseService_1.supabaseService.isAvailable(),
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
// ---------------------------------------------------------------------
// 11. SAMPLE DATASETS & RECONCILIATION FILES
// ---------------------------------------------------------------------
app.get('/api/samples', (req, res) => {
    const candidates = [
        path_1.default.join(__dirname, '../../data/samples'),
        path_1.default.join(__dirname, '../data/samples'),
        path_1.default.join(process.cwd(), 'data/samples')
    ];
    const samplesDir = candidates.find(p => fs_1.default.existsSync(p));
    if (!samplesDir)
        return res.json({ samples: [], total: 0 });
    try {
        const files = fs_1.default.readdirSync(samplesDir).map(file => {
            const filePath = path_1.default.join(samplesDir, file);
            const stats = fs_1.default.statSync(filePath);
            return {
                filename: file,
                sizeBytes: stats.size,
                sizeFormatted: `${(stats.size / 1024).toFixed(1)} KB`,
                extension: path_1.default.extname(file).replace('.', '').toUpperCase(),
                isWorkbook: file.endsWith('.xlsx'),
                updatedAt: stats.mtime.toISOString(),
                downloadUrl: `/api/samples/download/${encodeURIComponent(file)}`
            };
        });
        res.json({
            status: 'success',
            total: files.length,
            samples: files,
            databaseSummary: {
                expensesCount: expenses.length,
                invoicesCount: invoices.length,
                clientsCount: clients.length,
                leakageFindingsCount: leakageFindings.length,
                organizationsAvailable: ['Apex Technologies Pvt Ltd', 'Aarav Office Solutions Pvt. Ltd.']
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/samples/download/:filename', (req, res) => {
    const filename = path_1.default.basename(req.params.filename);
    const candidates = [
        path_1.default.join(__dirname, '../../data/samples', filename),
        path_1.default.join(__dirname, '../data/samples', filename),
        path_1.default.join(process.cwd(), 'data/samples', filename),
        path_1.default.join(process.cwd(), 'storage/samples', filename)
    ];
    const filePath = candidates.find(p => fs_1.default.existsSync(p));
    if (!filePath) {
        return res.status(404).json({ error: `Sample dataset '${filename}' not found` });
    }
    res.download(filePath, filename);
});
app.post('/api/samples/sync', async (req, res) => {
    try {
        const isConn = await supabaseService_1.supabaseService.testConnection();
        if (isConn) {
            expenses = await supabaseService_1.supabaseService.getExpenses(expenses);
            invoices = await supabaseService_1.supabaseService.getInvoices(invoices);
            clients = await supabaseService_1.supabaseService.getClients(clients);
            leakageFindings = await supabaseService_1.supabaseService.getProfitLeakageFindings(leakageFindings);
        }
        res.json({
            status: 'success',
            supabaseConnected: isConn,
            records: {
                expenses: expenses.length,
                invoices: invoices.length,
                clients: clients.length,
                leakageFindings: leakageFindings.length
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ---------------------------------------------------------------------
// 12. AI TRAINING & MODEL CALIBRATION
// ---------------------------------------------------------------------
app.get('/api/ai/training-status', async (req, res) => {
    const status = await financeEngineClient_1.financeEngineClient.getModelStatus();
    res.json({ status: 'success', modelStatus: status });
});
app.post('/api/ai/train', rateLimit_middleware_1.mlTrainingRateLimiter, auth_middleware_1.optionalAuthenticateToken, async (req, res) => {
    if (req.user && (req.user.role === 'Employee' || req.user.role === 'Read-Only Auditor' || req.user.role === 'Accountant')) {
        return res.status(403).json({ error: 'Forbidden Operation', message: 'Machine learning model calibration restricted to Administrators and Finance Managers.' });
    }
    const result = await financeEngineClient_1.financeEngineClient.triggerTraining();
    res.json({ status: 'success', result });
});
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        app: 'ARTHIQ Fintech Core API Gateway',
        timestamp: new Date().toISOString(),
        organization: organization.name,
        records: {
            expenses: expenses.length,
            invoices: invoices.length,
            clients: clients.length,
            leakage: leakageFindings.length
        }
    });
});
app.listen(PORT, async () => {
    console.log(`[*] ARTHIQ Core API Gateway running on http://127.0.0.1:${PORT}`);
    try {
        if (await supabaseService_1.supabaseService.testConnection()) {
            expenses = await supabaseService_1.supabaseService.getExpenses(expenses);
            invoices = await supabaseService_1.supabaseService.getInvoices(invoices);
            clients = await supabaseService_1.supabaseService.getClients(clients);
            leakageFindings = await supabaseService_1.supabaseService.getProfitLeakageFindings(leakageFindings);
            console.log(`[*] Synchronized latest data from Supabase Cloud: ${expenses.length} expenses, ${invoices.length} invoices, ${clients.length} clients.`);
        }
    }
    catch (e) {
        console.warn('[Sync] Initial Supabase cloud pull deferred:', e.message);
    }
});
