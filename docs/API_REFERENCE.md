# ARTHIQ REST API Reference

All requests to the backend API Gateway should be made to `http://localhost:4000/api` (or proxied via Vite at `/api`).

## Authentication & Organization
- `POST /api/auth/register` — Onboard new user and organization.
- `POST /api/auth/login` — Authenticate and receive JWT session token.
- `GET /api/auth/me` — Retrieve active session profile and organization metadata.
- `POST /api/auth/logout` — Terminate session.

## Dashboard
- `GET /api/dashboard/overview` — Aggregated KPIs, liquidity velocity, flagged invoices, and risk breakdown.
- `GET /api/dashboard/kpis` — High-level summary metrics.

## Expenses (Module 1)
- `GET /api/expenses` — Paginated list of operating expenses.
- `POST /api/expenses` — Record an expense and run automated ML outlier scoring.
- `GET /api/expenses/analysis` — Z-score anomalies, duplicate payment warnings, and recurring subscriptions.

## Invoices & Fraud Intelligence (Module 2)
- `GET /api/invoices` — List all registered vendor invoices.
- `POST /api/invoices/upload` — Upload invoice file or metadata for instant forensic audit.
- `POST /api/invoices/:id/verify` — Controller verification and clearance of flagged invoice.

## Cash Flow & Forecasting (Module 3)
- `GET /api/cashflow/history` — 30-day historical inflows and outflows.
- `POST /api/cashflow/forecast` — Predictive Holt-Winters forecast (7, 30, 60, 90 days) with confidence intervals.

## Profit Leakage Detector (Module 4)
- `GET /api/leakage/findings` — Active profit leakage findings and annual savings calculations.
- `POST /api/leakage/resolve/:id` — Execute one-click mitigation and log realized savings.

## Financial Analytics & BI (Module 5)
- `GET /api/analytics/ratios` — 15+ Liquidity, Profitability, Efficiency, and Leverage ratios.
- `GET /api/analytics/statements` — Executive Profit & Loss statement and variance metrics.

## Clients & Receivables (Module 6)
- `GET /api/clients` — Client directory with DSO and credit limits.
- `POST /api/clients` — Onboard new enterprise client.

## Procurement Optimization (Module 8)
- `GET /api/procurement/vendors` — Supplier directory with price escalation creep flags.

## ARTHIQ AI Assistant (Module 10)
- `GET /api/assistant/history` — Session conversation thread.
- `POST /api/assistant/chat` — Natural language query execution against authorized financial tools.

