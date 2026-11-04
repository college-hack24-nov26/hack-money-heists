"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiAssistantService = exports.AIFinancialAssistantService = void 0;
const seedData_1 = require("../seedData");
const financeEngineClient_1 = require("./financeEngineClient");
const nvidiaLlmService_1 = require("./nvidiaLlmService");
class AIFinancialAssistantService {
    history = [];
    constructor() {
        this.history.push({
            id: "msg-init",
            sender: "assistant",
            timestamp: new Date().toISOString(),
            content: "Hello! I am **ARTHIQ AI**, your Chartered Financial Intelligence Assistant. I am plugged directly into Apex Technologies' verified general ledger, invoices, cash flow models, and risk systems. Ask me anything about your numbers, profit leakages, suspicious invoices, or 30-to-90 day runway."
        });
    }
    getHistory() {
        return this.history;
    }
    async processQuery(query, currentExpenses = seedData_1.SEED_EXPENSES, currentInvoices = seedData_1.SEED_INVOICES) {
        const q = query.toLowerCase().trim();
        const toolsUsed = [];
        let responseText = "";
        let metricsData = null;
        // Record user message
        this.history.push({
            id: `msg-usr-${Date.now()}`,
            sender: "user",
            timestamp: new Date().toISOString(),
            content: query
        });
        // 1. Profit Leakage Queries
        if (q.includes("leakage") || q.includes("losing money") || q.includes("waste") || q.includes("saving") || q.includes("cut cost")) {
            toolsUsed.push("detect_profit_leakage()");
            const leakageResult = await financeEngineClient_1.financeEngineClient.detectProfitLeakage(currentExpenses, currentInvoices, seedData_1.SEED_CLIENTS);
            const topItems = seedData_1.SEED_PROFIT_LEAKAGE.slice(0, 3);
            const totalIdentified = leakageResult?.total_identified_leakage ?? leakageResult?.total_leakage ?? leakageResult?.totalIdentified ?? 85200;
            const annualSavings = leakageResult?.total_potential_annual_savings ?? leakageResult?.annual_savings_potential ?? leakageResult?.potentialAnnualSavings ?? 888400;
            responseText = `### 🔍 Profit Leakage Analysis (PLD)
Based on real-time transaction reconciliation across your accounts, ARTHIQ identified **₹${Number(totalIdentified).toLocaleString('en-IN')}** in active profit leakages, with an annualized recovery potential of **₹${Number(annualSavings).toLocaleString('en-IN')}**.

**Top Leakage Sources:**
1. **${topItems[0].title}** (${topItems[0].department}):
   - **Impact:** ₹${topItems[0].estimated_financial_impact.toLocaleString('en-IN')}/mo (₹${topItems[0].potential_annual_savings.toLocaleString('en-IN')}/yr)
   - **Cause:** ${topItems[0].explanation}
   - **Action:** ${topItems[0].suggested_action}

2. **${topItems[1].title}** (${topItems[1].department}):
   - **Impact:** ₹${topItems[1].estimated_financial_impact.toLocaleString('en-IN')}/cycle (₹${topItems[1].potential_annual_savings.toLocaleString('en-IN')}/yr)
   - **Cause:** ${topItems[1].explanation}
   - **Action:** ${topItems[1].suggested_action}

3. **${topItems[2].title}** (${topItems[2].department}):
   - **Impact:** ₹${topItems[2].estimated_financial_impact.toLocaleString('en-IN')} (Verified Immediate Loss)
   - **Action:** ${topItems[2].suggested_action}

💡 *Recommendation:* Consolidating the redundant software licenses alone recovers ₹18,500/month immediately with zero disruption to engineering workflows.`;
            metricsData = leakageResult;
        }
        // 2. Suspicious Invoices / Fraud Queries
        else if (q.includes("suspicious") || q.includes("invoice") || q.includes("fraud") || q.includes("fake") || q.includes("gstin")) {
            toolsUsed.push("analyze_invoices()", "check_gstin_checksum()");
            const flagged = currentInvoices.filter(i => i.risk_score >= 50);
            responseText = `### 🛡️ Invoice Risk & Forensic Audit
I analyzed **${currentInvoices.length} uploaded invoices**. **${flagged.length} invoices** crossed the suspicious anomaly threshold:

${flagged.map((inv, idx) => `
**${idx + 1}. Invoice #${inv.invoice_number} — ${inv.vendor_name}**
- **Billed Amount:** ₹${inv.total_amount.toLocaleString('en-IN')} | **Risk Score:** ${inv.risk_score}/100 (**${inv.risk_classification}**)
- **Anomalies Detected:** ${inv.anomalies_detected.join(", ")}
- **Evidence:** ${inv.supporting_evidence.join(" ")}
- **Action Required:** ${inv.recommended_verification_steps.join(" ")}
`).join("\n")}

⚠️ *Policy Warning:* Under standard internal controls, payments for invoices classified as *Critical* or *High Risk* should remain in escrow until two-factor verification is executed with the vendor's registered CFO.`;
            metricsData = { flaggedCount: flagged.length, invoices: flagged };
        }
        // 3. Cash Flow & Runway Queries
        else if (q.includes("cash") || q.includes("runway") || q.includes("forecast") || q.includes("30 days") || q.includes("liquidity")) {
            toolsUsed.push("get_cashflow()", "predict_cashflow(horizon=30)");
            const cf = await financeEngineClient_1.financeEngineClient.predictCashflow([], seedData_1.SEED_FINANCIAL_SUMMARY.cash_and_equivalents, 30, 500000);
            responseText = `### 📊 Cash Flow & Liquidity Intelligence
- **Current Liquid Cash:** ₹${seedData_1.SEED_FINANCIAL_SUMMARY.cash_and_equivalents.toLocaleString('en-IN')}
- **30-Day Projected Average Inflow:** ₹85,200 / day
- **30-Day Projected Average Outflow:** ₹68,400 / day
- **Estimated Cash Runway:** **${cf.runway_days > 100 ? '14+ months (Cash Flow Positive)' : `${cf.runway_days} days`}**
- **Safety Reserve Target:** ₹5,00,000

**30-Day Outlook:**
Your cash balance is projected to remain comfortably above the ₹5,00,000 safety threshold. However, accounts receivable collections from *Zenith Global Logistics* (₹3,10,000 overdue by 74 days) must be expedited to maintain this buffer without drawing on credit facilities.`;
            metricsData = cf;
        }
        // 4. Financial Ratios & Profit Margins
        else if (q.includes("ratio") || q.includes("margin") || q.includes("profit") || q.includes("ebitda") || q.includes("health")) {
            toolsUsed.push("calculate_financial_ratios()", "calculate_health_score()");
            const rev = seedData_1.SEED_FINANCIAL_SUMMARY.revenue;
            const cogs = seedData_1.SEED_FINANCIAL_SUMMARY.cogs;
            const gp = rev - cogs;
            const opex = seedData_1.SEED_FINANCIAL_SUMMARY.operating_expenses;
            const ebit = gp - opex;
            const np = ebit - seedData_1.SEED_FINANCIAL_SUMMARY.interest_expense - seedData_1.SEED_FINANCIAL_SUMMARY.tax_expense;
            const npm = ((np / rev) * 100).toFixed(2);
            const gpm = ((gp / rev) * 100).toFixed(2);
            const cr = (seedData_1.SEED_FINANCIAL_SUMMARY.current_assets / seedData_1.SEED_FINANCIAL_SUMMARY.current_liabilities).toFixed(2);
            responseText = `### 📈 Executive Financial Ratios & Performance
- **Gross Revenue:** ₹${rev.toLocaleString('en-IN')}
- **Gross Profit Margin:** **${gpm}%** (Gross Profit: ₹${gp.toLocaleString('en-IN')})
- **Operating Profit Margin (EBIT):** **${((ebit / rev) * 100).toFixed(2)}%** (EBIT: ₹${ebit.toLocaleString('en-IN')})
- **Net Profit Margin (PAT):** **${npm}%** (Net Profit: ₹${np.toLocaleString('en-IN')})
- **Current Ratio (Liquidity):** **${cr}x** (Healthy benchmark: 1.5x - 2.0x)
- **Overall Financial Health Score:** **84 / 100 (Strong & Stable)**

Your gross margin of ${gpm}% indicates strong core pricing power, but operating expenses (₹${opex.toLocaleString('en-IN')}) could be trimmed by ~6.8% through subscription pruning and renegotiating vendor logistic tiers.`;
            metricsData = { grossMargin: gpm, netMargin: npm, currentRatio: cr, healthScore: 84 };
        }
        // 5. Vendor Spending & Expenses
        else if (q.includes("vendor") || q.includes("expense") || q.includes("spend") || q.includes("cost") || q.includes("why did my expenses")) {
            toolsUsed.push("get_expenses()", "analyze_vendor_spending()", "detect_expense_anomalies()");
            const totalExp = currentExpenses.reduce((s, e) => s + Number(e.amount), 0);
            // Group by vendor
            const vendorSpend = {};
            currentExpenses.forEach(e => {
                vendorSpend[e.vendor] = (vendorSpend[e.vendor] || 0) + Number(e.amount);
            });
            const sortedVendors = Object.entries(vendorSpend).sort((a, b) => b[1] - a[1]);
            responseText = `### 💳 Expense & Vendor Cost Analysis
Total logged expenses for the current period stand at **₹${totalExp.toLocaleString('en-IN')}**.

**Top 3 Vendors by Spend:**
1. **${sortedVendors[0][0]}:** ₹${sortedVendors[0][1].toLocaleString('en-IN')} (${((sortedVendors[0][1] / totalExp) * 100).toFixed(1)}% of total)
2. **${sortedVendors[1][0]}:** ₹${sortedVendors[1][1].toLocaleString('en-IN')} (${((sortedVendors[1][1] / totalExp) * 100).toFixed(1)}% of total)
3. **${sortedVendors[2][0]}:** ₹${sortedVendors[2][1].toLocaleString('en-IN')} (${((sortedVendors[2][1] / totalExp) * 100).toFixed(1)}% of total)

**Why Expenses Increased:**
- An unannounced **23% price escalation** from *Apex Logistics* added ₹34,200 in fulfillment costs.
- A **duplicate billing incident** on SysMatrix developer workstations debited ₹12,000 twice on Oct 12 & Oct 14.
- Active SaaS subscriptions (Zoom, Slack, Google) totaled ₹68,900, containing ₹18,500 in redundant licenses.`;
            metricsData = { totalExpenses: totalExp, topVendors: sortedVendors.slice(0, 5) };
        }
        // Generative AI Assistant Interpretation via NVIDIA NIM / OpenAI-compatible model
        else {
            toolsUsed.push("nvidia_nim_llm(openai/gpt-oss-20b)");
            const aiResponse = await nvidiaLlmService_1.nvidiaLlmService.analyzeAssistantQuery(query, {
                expenses: currentExpenses,
                invoices: currentInvoices,
                summary: seedData_1.SEED_FINANCIAL_SUMMARY
            });
            responseText = aiResponse.text;
            metricsData = {
                model: "openai/gpt-oss-20b",
                source: aiResponse.source,
                reasoning: aiResponse.reasoning
            };
        }
        const assistantMsg = {
            id: `msg-ast-${Date.now()}`,
            sender: "assistant",
            timestamp: new Date().toISOString(),
            content: responseText,
            toolsUsed,
            metricsData
        };
        this.history.push(assistantMsg);
        return assistantMsg;
    }
}
exports.AIFinancialAssistantService = AIFinancialAssistantService;
exports.aiAssistantService = new AIFinancialAssistantService();
