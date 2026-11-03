const API_BASE = '/api';

export const api = {
  async getDashboardOverview() {
    const res = await fetch(`${API_BASE}/dashboard/overview`);
    return res.json();
  },

  async getExpenses() {
    const res = await fetch(`${API_BASE}/expenses`);
    return res.json();
  },

  async addExpense(data: any) {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getExpensesAnalysis() {
    const res = await fetch(`${API_BASE}/expenses/analysis`);
    return res.json();
  },

  async getInvoices() {
    const res = await fetch(`${API_BASE}/invoices`);
    return res.json();
  },

  async getInvoiceById(id: string) {
    const res = await fetch(`${API_BASE}/invoices/${id}`);
    return res.json();
  },

  async getInvoiceRiskSummary() {
    const res = await fetch(`${API_BASE}/invoices/risk-summary`);
    return res.json();
  },

  async validateGstin(gstin: string) {
    const res = await fetch(`${API_BASE}/invoices/validate-gstin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gstin })
    });
    return res.json();
  },

  async analyzeInvoice(data: any) {
    const res = await fetch(`${API_BASE}/invoices/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async uploadInvoice(formData: FormData) {
    const res = await fetch(`${API_BASE}/invoices/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  async verifyInvoice(id: string) {
    const res = await fetch(`${API_BASE}/invoices/${id}/verify`, {
      method: 'POST'
    });
    return res.json();
  },

  async getCashflowForecast(horizonDays = 30, safetyThreshold = 500000, scenarioInputs?: any) {
    const res = await fetch(`${API_BASE}/cashflow/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        horizon_days: horizonDays,
        safety_threshold: safetyThreshold,
        ...scenarioInputs
      })
    });
    return res.json();
  },

  async getCashflowSummary() {
    const res = await fetch(`${API_BASE}/cashflow/summary`);
    return res.json();
  },

  async getCashflowAlerts() {
    const res = await fetch(`${API_BASE}/cashflow/alerts`);
    return res.json();
  },

  async getCashflowHistory() {
    const res = await fetch(`${API_BASE}/cashflow/history`);
    return res.json();
  },

  async getLeakageFindings() {
    const res = await fetch(`${API_BASE}/leakage/findings`);
    return res.json();
  },

  async calculateLeakageSavings(monthlyOpex: number, recoveryRate = 0.048) {
    const res = await fetch(`${API_BASE}/leakage/calculate-savings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monthlyOpex, recoveryRate })
    });
    return res.json();
  },

  async scanLedger(formData: FormData) {
    const res = await fetch(`${API_BASE}/leakage/scan-ledger`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  async resolveLeakage(id: string) {
    const res = await fetch(`${API_BASE}/leakage/resolve/${id}`, {
      method: 'POST'
    });
    return res.json();
  },

  async getFinancialRatios() {
    const res = await fetch(`${API_BASE}/analytics/ratios`);
    return res.json();
  },

  async getFinancialStatements() {
    const res = await fetch(`${API_BASE}/analytics/statements`);
    return res.json();
  },

  async getClients() {
    const res = await fetch(`${API_BASE}/clients`);
    return res.json();
  },

  async addClient(data: any) {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getProcurementVendors() {
    const res = await fetch(`${API_BASE}/procurement/vendors`);
    return res.json();
  },

  async getAssistantHistory() {
    const res = await fetch(`${API_BASE}/assistant/history`);
    return res.json();
  },

  async sendAssistantMessage(message: string) {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return res.json();
  }
};

