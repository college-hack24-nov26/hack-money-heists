# ARTHIQ — AI-Powered Financial Intelligence & Management Platform

> **"Don't just show businesses where their money goes. Help them understand why it goes there, where they are losing it, and how to make better financial decisions."**

ARTHIQ is a production-grade, AI-powered financial intelligence and decision-support platform engineered specifically for Small and Medium Enterprises (SMEs), startups, finance teams, business owners, and Chartered Accountants.

It goes beyond traditional retrospective accounting software. ARTHIQ proactively audits general ledgers, forecasts multi-horizon cash flow with empirical confidence intervals, scores vendor invoices for forensic fraud and statutory non-compliance, uncovers silent profit leakages, and provides an executive conversational AI financial analyst.

---

## 🏛️ Architectural Overview

ARTHIQ follows a modular, decoupled full-stack architecture:

- **Frontend (`frontend/`)**: React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, HTML5 Canvas Particle System, and ECharts/SVG visual charts designed with **Spatial Minimalism + Kinetic Minimalism + Dark Glassmorphism**.
- **API Gateway (`backend/`)**: Node.js & Express API Gateway in TypeScript. Provides JWT authentication, RBAC, tenant-level isolation, and orchestrates client, transaction, and invoice workflows.
- **Finance Engine (`finance-engine/`)**: Python microservice with Flask, NumPy, Pandas, Scikit-learn, and OpenPyXL. Executes statistical cash flow forecasting (Holt-Winters with day-of-week seasonality), invoice forensic checks (GSTIN checksum, IFSC routing, Benford's Law), Z-score outlier detection, and the signature **Profit Leakage Detector (PLD)**.
- **Pre-Loaded Demonstration Dataset**: Pre-seeded with a comprehensive, realistic SME dataset for **Apex Technologies Pvt Ltd** (Bangalore, GSTIN: `27AAPFU0939F1ZV`), complete with 90 days of transactions, recurring SaaS subscriptions, flagged forensic invoices, and overdue B2B receivables.

---

## ⚡ 10 Core Financial Intelligence Modules

| Module | Name | Key Capabilities |
| :--- | :--- | :--- |
| **Module 1** | **Smart Expense Analyzer** | Automated categorization, Z-score & IQR outlier spike alerts, duplicate disbursement detection, and SaaS creep auditing. |
| **Module 2** | **Invoice Fraud Detector** | Document OCR parsing, 15-character statutory GSTIN checksum validation, IFSC routing checks, forensic risk meter (0-100), and controller sign-off workflows. |
| **Module 3** | **SME Cash Flow Intelligence** | 7, 30, 60, and 90-day predictive forecasts, 95% bootstrap confidence bands, safety threshold breach monitoring, and burn rate runway calculations. |
| **Module 4** | **Profit Leakage Detector (PLD)** | ARTHIQ's signature feature. Exposes overlapping software licenses, supplier price creep (+23%), double settlements, and carrying cost on overdue debtors. |
| **Module 5** | **Financial Analytics & BI** | Executive P&L statements, Balance Sheet analysis, and 15+ Chartered Accountant ratios (Current, Quick, Gross Margin, EBIT, ROA, ROE, Debt-to-Equity). Real XLSX/CSV export. |
| **Module 6** | **Client Management** | Centralized client directory, Days Sales Outstanding (DSO) monitoring, credit limits, and tenant-level database row isolation. |
| **Module 7** | **Financial Risk Radar** | Multi-dimensional early warning system scoring Liquidity, Profitability, Credit Default, Operational Concentration, and Fraud ratios. |
| **Module 8** | **Procurement Cost Optimization** | Vendor price fluctuation tracking, unannounced price escalation warnings, and duplicate PO cross-checks. |
| **Module 9** | **Finance Infrastructure** | Unified relational data schema (`organizations`, `users`, `accounts`, `invoices`, `expenses`, `leakage_findings`, `audit_logs`). |
| **Module 10** | **ARTHIQ AI Financial Assistant** | Conversational financial intelligence engine executing verified general ledger tools with zero hallucinated figures. |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (`npm` or `npm.cmd` on Windows)
- **Python**: v3.10+ (with `pip`)

### 1. Run Finance Engine Unit Tests
Verify all mathematical forecasting models, GSTIN algorithms, and anomaly detectors:
```bash
python -u finance-engine/test_engine.py
```
*Output: All cashflow forecasts, fraud scores, expense anomaly checks, and PLD tests pass with 100% precision.*

### 2. Local Development (Step-by-Step)

#### Terminal 1 — Python Finance Microservice:
```bash
python finance-engine/app/main.py
```
*Runs on `http://127.0.0.1:5001`*

#### Terminal 2 — Node.js Core API Gateway:
```bash
cd backend
npm install
npm run build
npm start
```
*Runs on `http://127.0.0.1:4000`*

#### Terminal 3 — React Frontend:
```bash
cd frontend
npm install
npm run dev
```
*Access the platform at `http://localhost:3000`*

---

## 🐳 Docker Deployment

To spin up the entire multi-container stack (Frontend, Backend, Finance Microservice, PostgreSQL 16, Redis 7):

```bash
docker-compose up --build
```

- **Frontend Workspace**: `http://localhost:3000`
- **Core API Gateway**: `http://localhost:4000/api`
- **Python Finance Engine**: `http://localhost:5001/health`
- **PostgreSQL**: `localhost:5432`

---

## 🧪 Verification & Demonstration Walkthrough

When you open `http://localhost:3000`:
1. **Interactive Landing Page**: Click *"Explore ARTHIQ"* or *"Launch Dashboard"*. Watch the zero-gravity floating KPI elements and interactive particle canvas track your cursor.
2. **Dashboard Overview**: Inspect the live KPIs for **Apex Technologies Pvt Ltd**: Gross Revenue (₹45.00L), Operating Burn (₹12.74L), Net Profit (₹6.94L), Liquid Cash (₹18.50L), and Financial Health Score (84/100).
3. **Smart Expense Analyzer**: Review categorized expenses, observe the Z-score outlier on Apex Logistics (+2.8σ), and use the *"Record Expense"* modal to log an expense with live recalculation.
4. **Invoice Fraud Detector**: Select **Invoice #INV-SM-2024-DUP** (Risk Score: 88/100 Critical Risk) to see the duplicate payment evidence and recommended verification steps. Use *"Upload & Verify Invoice"* to test custom invoices.
5. **Cash Flow Predictor**: Slide the horizon selector across 7, 30, 60, and 90 days. Adjust the safety threshold slider to see dynamic alerts.
6. **Profit Leakage Detector (PLD)**: Inspect the ₹85,200 in identified leakages. Click *"Execute Fix"* to resolve a leakage and watch the realized savings update immediately.
7. **Financial Analytics & BI**: Review the 15+ Chartered Accountant ratios and click *"Export Financial Model (XLSX/CSV)"* to download a structured financial package.
8. **ARTHIQ AI Assistant**: Click any suggested prompt pill (e.g., *"Where is my business losing unnecessary money?"* or *"Find suspicious invoices"*) to see tool-calling in action with verified ledger math.

---

## 🔒 Security & Data Integrity Guarantees

- **Statutory Checksum Integrity**: Indian GSTINs strictly checked according to the 15-character alphanumeric standard.
- **Tenant Isolation**: Row-level database tenant isolation boundaries prevent cross-organization access.
- **Grounded AI Guardrails**: The conversational assistant executes audited application tools; it never executes arbitrary SQL or fabricates numbers.

---

**ARTHIQ — See Beyond Numbers. Think Ahead.**
