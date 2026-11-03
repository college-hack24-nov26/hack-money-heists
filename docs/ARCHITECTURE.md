# ARTHIQ System Architecture

## Vision & Architecture Overview

ARTHIQ is structured around a decoupled, resilient, multi-tiered architecture that separates the web presentation layer, the application API gateway, and the scientific/financial computation engine.

```
+-----------------------------------------------------------------------------------+
|                           FRONTEND LAYER (React + Vite)                           |
|  - Spatial Minimalism & Dark Glassmorphism                                        |
|  - Canvas Interactive Particle System                                             |
|  - 10 Interconnected Modules (Dashboard, Expense Analyzer, Invoice Fraud, etc.)  |
+------------------------------------------+----------------------------------------+
                                           | HTTP / REST (Port 3000 -> 4000)
                                           v
+-----------------------------------------------------------------------------------+
|                        API GATEWAY (Node.js + Express)                            |
|  - Authentication & RBAC (Admin, Analyst, Auditor)                                |
|  - Multi-tenant Tenant Isolation Boundary                                         |
|  - Audit Trail & Mutation Logging                                                 |
|  - General Ledger & In-Memory / Relational Store                                  |
+------------------------------------------+----------------------------------------+
                                           | HTTP / JSON Internal RPC (Port 5001)
                                           v
+-----------------------------------------------------------------------------------+
|                 FINANCE & ML MICROSERVICE (Python 3.14 + Flask)                    |
|  - Cash Flow Holt-Winters Exponential Smoothing & Uncertainty Envelopes           |
|  - Forensic Invoice Verification (GSTIN Checksum, IFSC, Benford's Law)            |
|  - Signature Profit Leakage Detector (PLD) Engine                                 |
|  - Statistical Z-Score / IQR Outlier Expense Detector                             |
|  - OpenPyXL / Pandas Excel Processing Engine                                      |
+-----------------------------------------------------------------------------------+
```

## Security & Tenant Boundary Rules

1. **Deterministic Financial Tooling:** The conversational assistant (ARTHIQ AI) does not hallucinate math or balances. Natural language requests are converted into validated parameter calls (`get_expenses()`, `predict_cashflow()`, `detect_profit_leakage()`).
2. **Statutory Checksums:** Indian GSTINs are verified against the 15-character alphanumeric checksum standard (2 state digits + 10 PAN characters + 1 entity code + 'Z' + 1 check digit).
3. **Escrow on Anomaly Detection:** Invoices with a forensic risk score $\ge 50$ are placed on automated hold. They are never classified as confirmed fraud without dual human controller review.

