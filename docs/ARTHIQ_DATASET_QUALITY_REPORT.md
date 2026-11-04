# ARTHIQ Financial Dataset Quality & Audit Report

## Executive Summary
This document provides an inventory, audit, and quality assessment of all internal business datasets used to train, validate, and benchmark ARTHIQ's machine learning models. Data hygiene, missing value handling, duplicate handling, and chronological partition integrity are documented.

---

## 1. Dataset Inventory

| Dataset File | Source / Domain | Records | Columns | Date Range | Label Availability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `aarav_7m_transactions.csv` | General Ledger Bank Feed | 227 | 10 | 2024-04-01 to 2024-10-31 | Unsupervised (Amount, Type, Cat) |
| `aarav_7m_invoices.csv` | Accounts Receivable | 198 | 8 | 2024-04-01 to 2024-10-31 | Settlement Status (Paid/Overdue) |
| `invoices_payable.csv` | Accounts Payable (Forensics) | 63 | 12 | 2024-04-15 to 2024-10-28 | Labeled Fraud / Duplicate / Clean |
| `aarav_7m_monthly_summary.csv`| Executive P&L & Cash Summary| 7 | 8 | 2024-04 to 2024-10 | Aggregated Financial Statements |
| `aarav_7m_vendors.csv` | Vendor Registry & Procurement | 24 | 6 | Active Registry | Category, Country, Status |
| `aarav_7m_budgets_vs_actuals.csv`| Budgetary Variance Engine | 35 | 7 | 2024-04 to 2024-10 | Budget vs Actual Deviation |

---

## 2. Data Hygiene & Preprocessing Verification

### A. Missing Values
* **Transactions:** Zero missing values in `Date` or `Amount_INR`. Empty `Category` values are categorized as `"Uncategorized"`.
* **Invoices:** Missing `due_date` fields default to `invoice_date + 30 days` standard credit terms.
* **Tax Amounts:** When tax is omitted, it is computed from the statutory 18% benchmark rate; arithmetic checks flag discrepancies between taxable amount, tax, and gross total.

### B. Duplicate Detection Audit
* 2 intentional duplicate vouchers (`INV-SM-2024-DUP` duplicate billing of SysMatrix PO-2024 for ₹12,000) are maintained as positive benchmark controls for the fraud classification test suite.
* Clean production records have verified unique primary key identifiers.

### C. Date Formatting & Continuity
* Transaction timestamps are cast to standardized ISO `YYYY-MM-DD`.
* For daily cash flow forecasting, intermediate non-trading days (weekends/statutory bank holidays) are filled with `0.0` inflow and `0.0` outflow to maintain an unbroken calendar frequency ($D$).

---

## 3. Data Leakage Prevention Matrix

| Risk Factor | Preventive Mechanism Implemented in ARTHIQ |
| :--- | :--- |
| **Lookahead Bias in Lags** | Rolling windows and lag features are calculated strictly using `shift(1)`. Target values at day $t$ are never visible to features at day $t$. |
| **Feature Standardization Leak** | `StandardScaler` means and standard deviations are computed strictly on the training partition and applied as immutable transformations to the validation/test partitions. |
| **Vendor Leakage in Fraud Detection** | Stratified splitting maintains realistic positive/negative class distributions without leaking identical duplicate pairs between train and test. |
| **Synthetic Inflation** | Zero synthetic or fabricated records are introduced into evaluation datasets. All performance metrics reflect real ledger observations. |

