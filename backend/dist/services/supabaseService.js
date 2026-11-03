"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const seedData_1 = require("../seedData");
dotenv_1.default.config();
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mmljatcvouyjfbznxjgs.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_mt-NaU29NLLqSThp1Eym0A_BBs1NWo7';
let supabaseClient = null;
let isConnected = false;
try {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        supabaseClient = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: { persistSession: false }
        });
        console.log(`[*] Supabase client initialized for project: ${SUPABASE_URL}`);
    }
}
catch (err) {
    console.warn('[Supabase] Failed to initialize client:', err.message);
}
exports.supabaseService = {
    getClient() {
        return supabaseClient;
    },
    isAvailable() {
        return supabaseClient !== null;
    },
    async testConnection() {
        if (!supabaseClient)
            return false;
        try {
            const { data, error } = await supabaseClient.from('organizations').select('id').limit(1);
            if (error && error.code !== 'PGRST116') {
                console.warn('[Supabase] Connection test response:', error.message);
                return false;
            }
            isConnected = true;
            return true;
        }
        catch {
            return false;
        }
    },
    // -------------------------------------------------------------------
    // EXPENSES
    // -------------------------------------------------------------------
    async getExpenses(fallback) {
        if (!supabaseClient)
            return fallback;
        try {
            const { data, error } = await supabaseClient
                .from('expenses')
                .select('*')
                .order('expense_date', { ascending: false });
            if (error || !data || data.length === 0) {
                return fallback;
            }
            return data.map((d) => ({
                id: d.id,
                date: d.expense_date,
                vendor: d.vendor,
                category: d.category,
                description: d.description,
                amount: Number(d.amount),
                status: d.status || 'Approved',
                paymentMethod: d.payment_method || 'Bank Transfer',
                referenceNo: d.reference_no || d.id
            }));
        }
        catch {
            return fallback;
        }
    },
    async insertExpense(expense) {
        if (!supabaseClient)
            return;
        try {
            await supabaseClient.from('expenses').insert({
                id: expense.id,
                organization_id: seedData_1.SEED_ORGANIZATION.id,
                vendor: expense.vendor,
                category: expense.category,
                description: expense.description,
                amount: expense.amount,
                expense_date: expense.date,
                payment_method: expense.paymentMethod,
                status: expense.status,
                reference_no: expense.referenceNo
            });
        }
        catch (err) {
            console.warn('[Supabase] Failed to insert expense:', err.message);
        }
    },
    // -------------------------------------------------------------------
    // INVOICES
    // -------------------------------------------------------------------
    async getInvoices(fallback) {
        if (!supabaseClient)
            return fallback;
        try {
            const { data, error } = await supabaseClient
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });
            if (error || !data || data.length === 0) {
                return fallback;
            }
            return data.map((d) => ({
                id: d.id,
                invoice_number: d.invoice_number,
                vendor_name: d.vendor_name,
                gstin: d.gstin,
                bank_account: d.bank_account,
                bank_ifsc: d.bank_ifsc,
                invoice_date: d.invoice_date,
                due_date: d.due_date,
                subtotal: Number(d.subtotal),
                gst_rate: Number(d.gst_rate),
                tax_amount: Number(d.tax_amount),
                total_amount: Number(d.total_amount),
                status: d.status,
                risk_score: d.risk_score,
                risk_classification: d.risk_classification,
                anomalies_detected: d.anomalies_detected || [],
                supporting_evidence: d.supporting_evidence || [],
                recommended_verification_steps: d.recommended_verification_steps || []
            }));
        }
        catch {
            return fallback;
        }
    },
    async insertInvoice(invoice) {
        if (!supabaseClient)
            return;
        try {
            await supabaseClient.from('invoices').insert({
                id: invoice.id,
                organization_id: seedData_1.SEED_ORGANIZATION.id,
                invoice_number: invoice.invoice_number,
                vendor_name: invoice.vendor_name,
                gstin: invoice.gstin ? invoice.gstin.slice(0, 15) : null,
                bank_account: invoice.bank_account,
                bank_ifsc: invoice.bank_ifsc,
                invoice_date: invoice.invoice_date,
                due_date: invoice.due_date,
                subtotal: invoice.subtotal,
                gst_rate: invoice.gst_rate,
                tax_amount: invoice.tax_amount,
                total_amount: invoice.total_amount,
                status: invoice.status,
                risk_score: invoice.risk_score,
                risk_classification: invoice.risk_classification,
                anomalies_detected: invoice.anomalies_detected,
                supporting_evidence: invoice.supporting_evidence,
                recommended_verification_steps: invoice.recommended_verification_steps
            });
        }
        catch (err) {
            console.warn('[Supabase] Failed to insert invoice:', err.message);
        }
    },
    async updateInvoiceStatus(id, status, riskScore, classification) {
        if (!supabaseClient)
            return;
        try {
            await supabaseClient
                .from('invoices')
                .update({ status, risk_score: riskScore, risk_classification: classification })
                .eq('id', id);
        }
        catch (err) {
            console.warn('[Supabase] Failed to update invoice:', err.message);
        }
    },
    // -------------------------------------------------------------------
    // CLIENTS
    // -------------------------------------------------------------------
    async getClients(fallback) {
        if (!supabaseClient)
            return fallback;
        try {
            const { data, error } = await supabaseClient
                .from('clients')
                .select('*')
                .order('company_name', { ascending: true });
            if (error || !data || data.length === 0) {
                return fallback;
            }
            return data.map((d) => ({
                id: d.id,
                name: d.name,
                companyName: d.company_name,
                gstin: d.gstin,
                email: d.email,
                phone: d.phone,
                outstandingBalance: Number(d.outstanding_balance),
                daysSalesOutstanding: d.days_sales_outstanding,
                riskProfile: d.risk_profile,
                creditLimit: Number(d.credit_limit),
                lastPaymentDate: d.last_payment_date,
                contractStatus: d.contract_status
            }));
        }
        catch {
            return fallback;
        }
    },
    async insertClient(client) {
        if (!supabaseClient)
            return;
        try {
            await supabaseClient.from('clients').insert({
                id: client.id,
                organization_id: seedData_1.SEED_ORGANIZATION.id,
                name: client.name,
                company_name: client.companyName,
                gstin: client.gstin,
                email: client.email,
                phone: client.phone,
                outstanding_balance: client.outstandingBalance,
                days_sales_outstanding: client.daysSalesOutstanding,
                risk_profile: client.riskProfile,
                credit_limit: client.creditLimit,
                last_payment_date: client.lastPaymentDate,
                contract_status: client.contractStatus
            });
        }
        catch (err) {
            console.warn('[Supabase] Failed to insert client:', err.message);
        }
    }
};
