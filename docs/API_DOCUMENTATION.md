# ARTHIQ Fintech API Reference & Endpoint Specifications

**Version:** 1.0.0 Enterprise  
**Base URL:** `http://127.0.0.1:4000/api`  
**Protocol:** REST / JSON  
**Authentication:** Bearer JWT Token (`Authorization: Bearer <token>`)

---

## 1. System Telemetry & Health

### `GET /health` & `GET /api/health`
Verifies backend operational status, active database synchronization, and entity records inventory.

**Response `200 OK`:**
```json
{
  "status": "online",
  "app": "ARTHIQ Fintech Core API Gateway",
  "timestamp": "2026-11-04T03:54:00.000Z",
  "organization": "Apex Technologies Pvt Ltd",
  "records": {
    "expenses": 227,
    "invoices": 200,
    "clients": 30,
    "leakage": 10
  }
}
```

---

## 2. Executive Dashboard Overview

### `GET /api/dashboard/overview`
Provides high-level executive KPI metrics, risk radar scores, recent transactions, and top flagged invoices for executive oversight.

**Response `200 OK`:**
```json
{
  "organization": "Apex Technologies Pvt Ltd",
  "gstin": "27AAPFU0939F1ZV",
  "kpis": {
    "totalRevenue": 4500000,
    "totalExpenses": 7992549.35,
    "availableCash": 1850000,
    "cashRunwayMonths": 14.2,
    "financialHealthScore": 90,
    "healthStatus": "Excellent",
    "flaggedInvoicesCount": 9,
    "totalLeakageIdentified": 280365.45,
    "potentialAnnualSavings": 1182239.08
  },
  "riskRadar": {
    "credit_risk": 16,
    "fraud_risk": 18,
    "liquidity_risk": 5,
    "operational_risk": 50,
    "profitability_risk": 11
  }
}
```

---

## 3. SME Cash Flow Prediction Engine

### `POST /api/cash-flow/forecast` (Alias: `/api/cashflow/forecast`)
Executes forward-looking daily cash flow simulation based on empirical ledger trends and user-defined scenario parameters.

**Request Body:**
```json
{
  "horizon_days": 60,
  "safety_threshold": 600000,
  "opening_balance": 2500000,
  "monthly_revenue": 3000000,
  "monthly_opex": 1800000,
  "payroll_expenses": 800000,
  "customer_payment_cycle_days": 35,
  "supplier_payment_cycle_days": 28,
  "seasonal_pattern": "high_season"
}
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "company_name": "Apex Technologies Pvt Ltd",
  "horizon_days": 60,
  "current_balance": 2500000,
  "projected_ending_cash": 1037000,
  "confidence_interval_95": {
    "lower_bound": 985150,
    "upper_bound": 1088850
  },
  "safety_threshold": 600000,
  "runway_days": 999,
  "is_cash_flow_positive": true,
  "daily_burn_rate": 0,
  "forecast": [
    {
      "date": "2026-11-05",
      "predicted_inflow": 115000,
      "predicted_outflow": 69000,
      "predicted_net": 46000,
      "projected_balance": 2546000,
      "balance_lower_bound": 2418700,
      "balance_upper_bound": 2673300,
      "is_deficit": false
    }
  ],
  "deficit_occurrences": [],
  "alerts": []
}
```

### `GET /api/cash-flow/history`
Retrieves trailing 30-day audited cash balance history.

### `GET /api/cash-flow/summary`
Returns current liquidity buffer, burn rate, and runway calculations.

### `GET /api/cash-flow/alerts`
Returns liquidity warning triggers and recommended working capital interventions.

---

## 4. Profit Leakage Detector (PLD)

### `GET /api/leakage/findings`
Lists all active detected profit leakage anomalies categorized by verified losses, suspected operational leakage, and fee optimization opportunities.

### `POST /api/leakage/calculate-savings`
Dynamically calculates annual profit recovery potential based on user-adjusted monthly OPEX and recovery rate benchmarks.

**Request Body:**
```json
{
  "monthlyOpex": 4000000,
  "recoveryRate": 0.048
}
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "monthlyOpex": 4000000,
  "annualOpex": 48000000,
  "recoveryRate": 0.048,
  "estimatedAnnualSavings": 2304000,
  "estimatedMonthlyLeakage": 192000,
  "hundredDayTarget": 633600,
  "activeAnomaliesCount": 10
}
```

### `POST /api/leakage/scan-ledger`
Uploads and parses CSV or Excel General Ledger transactions to identify duplicate settlements, SaaS subscription overlaps, and vendor price creep (>15% inflation).

**Request:** `multipart/form-data` with field `file` or `ledgerFile`

**Response `200 OK`:**
```json
{
  "status": "success",
  "transactionsParsed": 4,
  "newLeakagesFound": 1,
  "newLeakageAmount": 45000,
  "totalIdentified": 45000,
  "potentialAnnualSavings": 540000,
  "findings": [
    {
      "id": "lf-scan-1730691000",
      "category": "Duplicate Payments",
      "title": "Duplicate Settlement: ₹45,000 to Cloud Hosting AWS",
      "department": "Accounts Payable",
      "vendor": "Cloud Hosting AWS",
      "estimated_financial_impact": 45000,
      "potential_annual_savings": 540000,
      "leakage_type": "Verified Loss"
    }
  ]
}
```

### `POST /api/leakage/resolve/:id`
Marks a leakage finding as remediated and updates annualized savings totals.

---

## 5. Invoice Forensics & Statutory Compliance

### `POST /api/invoices/validate-gstin`
Validates statutory Indian Goods and Services Tax Identification Number (GSTIN) using the Government of India Modulo 36 algorithm.

**Request Body:**
```json
{ "gstin": "27AAPFU0939F1ZV" }
```

**Response `200 OK` (Valid):**
```json
{
  "isValid": true,
  "gstin": "27AAPFU0939F1ZV",
  "stateCode": "27",
  "stateName": "Maharashtra",
  "pan": "AAPFU0939F",
  "entityNumber": "1",
  "actualCheckDigit": "V",
  "expectedCheckDigit": "V",
  "checksumMatched": true,
  "isOfficialVerification": true
}
```

**Response `200 OK` (Invalid Checksum):**
```json
{
  "isValid": false,
  "gstin": "27AAPFU0939F1Z0",
  "stateCode": "27",
  "stateName": "Maharashtra",
  "actualCheckDigit": "0",
  "expectedCheckDigit": "V",
  "checksumMatched": false,
  "error": "Checksum mismatch on character 15. Expected 'V', found '0'. Possible data entry typo or invalid GSTIN."
}
```

### `GET /api/invoices/risk-summary`
Aggregates forensic risk distribution metrics, count of duplicate submissions, and total capital flagged.

### `POST /api/invoices/analyze`
Submits an invoice for comprehensive forensic audit (statutory checksum, historical duplicate check, RBI IFSC validation, tax balance verification).

---

## 6. ARTHIQ Autonomous AI Assistant

### `POST /api/assistant/chat`
Interacts with the financial intelligence assistant with contextual access to business transactions, profit leakage findings, and cash flow projections.

**Request Body:**
```json
{ "message": "Where is my business losing unnecessary money?" }
```

**Response `200 OK`:**
```json
{
  "reply": {
    "id": "asst-1730691200",
    "sender": "assistant",
    "content": "### 🏢 Apex Technologies Financial Snapshot\nIdentified ₹2,80,365 in active profit leakage across duplicate disbursements, software seat overlaps, and unannounced vendor rate hikes...",
    "timestamp": "2026-11-04T03:54:00.000Z"
  }
}
```

