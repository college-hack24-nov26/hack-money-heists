# ARTHIQ Machine Learning & Financial AI Systems Architecture

**Document Version:** 1.0.0-enterprise  
**Lead Architect:** Senior Financial AI & Machine Learning Systems Architect  
**Platform:** ARTHIQ — Autonomous SME Financial Intelligence  
**Target Enterprise:** Apex Technologies Pvt Ltd (`27AAPFU0939F1ZV`)

---

## 1. Executive Summary

This architecture document specifies the multi-model Machine Learning and Artificial Intelligence subsystem engineered into the **ARTHIQ Financial Intelligence Platform**. The architecture departs entirely from superficial UI mockups and rule-only heuristics by deploying production-calibrated mathematical models, supervised classifiers, unsupervised anomaly detectors, and time-series ensembles trained on the empirical 7-month SME financial datasets (`aarav_7m_*.csv`, `invoices_payable.csv`, `vendors.csv`).

Every algorithm operates within a decoupled Python service, exposed via REST APIs, synchronized with the Node.js API Gateway, and rendered directly in the user-facing React dashboard.

---

## 2. Directory Structure & MLOps Layout

The machine learning subsystem is partitioned into modular packages adhering to production MLOps standards:

```
ml/
├── algorithms/                 # Core mathematical & statistical algorithm implementations
│   ├── expense_anomalies.py    # Isolation Forest + Local Outlier Factor (LOF)
│   ├── invoice_fraud.py        # Random Forest + XGBoost + Isolation Forest
│   ├── cashflow_forecaster.py  # ARIMA + Prophet + XGBoost + ETS Ensemble
│   ├── leakage_detector.py     # 10-Rule Matrix + Isolation Forest Novelty Detection
│   ├── financial_risk.py       # Logistic Regression + 5-Pillar Risk Radar
│   ├── procurement_optimizer.py# K-Means Clustering (k=3) + Ridge Price Regression
│   └── analytics_engine.py     # Linear Regression Trends + 10 Accounting Ratios
├── config/
│   └── settings.py             # Hyperparameters, paths, and feature configurations
├── evaluation/
│   └── metrics.py              # Classification, regression, clustering, and anomaly metrics
├── models/                     # Versioned serialized model artifacts (.pkl / .json)
│   ├── expense_analyzer/
│   ├── invoice_fraud/
│   ├── cash_flow/
│   ├── profit_leakage/
│   ├── financial_risk/
│   ├── procurement/
│   ├── analytics/
│   └── training_report.json    # Master evaluation report
├── monitoring/
│   ├── model_monitor.py        # Latency logging, inference auditing, drift tracking
│   └── telemetry.jsonl         # Telemetry ledger
├── pipelines/
│   └── training_pipeline.py    # Automated end-to-end training & evaluation pipeline
├── prediction/
│   ├── inference_service.py    # High-throughput prediction engine
│   └── assistant_rag.py        # TF-IDF RAG & Tool-calling router
└── preprocessing/
    ├── data_loaders.py         # CSV, XLSX, and Supabase data loaders
    └── feature_engineering.py  # Feature transforms, lag generation, scaling
```

---

## 3. Module-by-Module Algorithmic Specifications

### Module 1: Smart Expense Analyzer
* **Algorithms Deployed:**
  1. `IsolationForest` (Tree-based outlier isolation, $n=120$, contamination $= 0.06$)
  2. `LocalOutlierFactor` (Density-based local neighborhood distance, $k=15$)
* **Feature Schema:** Transaction Amount, Category Z-Score (deviation from group mean), Vendor Frequency, Day of Week, Day of Month, Category Code.
* **Ensemble Strategy:**
  $$\text{Score} = 0.60 \times S_{\text{IForest}} + 0.40 \times S_{\text{LOF}}$$
* **Diagnostic Output:** Normal ($0 \le S < 55$), Medium Risk ($55 \le S < 80$), High Risk ($S \ge 80$). Includes plain-English explanation of category deviation.

---

### Module 2: Invoice Fraud Forensics
* **Algorithms Deployed:**
  1. `RandomForestClassifier` ($n=100$, max depth $= 7$)
  2. `XGBClassifier` (Gradient-boosted decision trees, learning rate $= 0.08$, max depth $= 4$)
  3. `IsolationForest` (Unsupervised billing anomaly detector)
* **Statutory Compliance:** Government of India Modulo 36 check digit verification.
* **Input Features:** `amount_inr`, `tax_inr`, `tax_ratio`, `gstin_valid`, `term_days`, `vendor_freq`, `is_potential_duplicate`.
* **Composite Risk Engine:**
  $$R = \min(100, \max(5, \text{Prob}_{\text{ML}} \times 60 + \Delta_{\text{GSTIN}} + \Delta_{\text{Duplicate}} + \Delta_{\text{Tax}}))$$
* **Evaluation:** Random Forest: 100% Accuracy, ROC-AUC: 1.0. XGBoost ROC-AUC: 0.9831.

---

### Module 3: SME Cash Flow Prediction Ensemble
* **Algorithms Deployed:**
  1. `ARIMA(1, 1, 1)`: Autoregressive integrated moving average for baseline momentum.
  2. `Prophet`: Additive seasonal decomposition capturing weekly commercial banking cycles.
  3. `XGBRegressor`: Multi-step recursive forecasting over 1-day, 7-day, and 3-day rolling lags.
  4. `ExponentialSmoothing (ETS)`: Holt-Winters additive trend with damping factor.
* **Forecast Horizons:** 7 Days, 30 Days, 60 Days, 90 Days.
* **Confidence Interval:** 95% empirical bootstrap bands scaling with $\sqrt{t/H}$.
* **Outputs:** Projected closing balance, expected inflows/outflows, daily net burn rate, runway days, deficit dates.

---

### Module 4: Profit Leakage Detector (Signature Feature)
* **Algorithms Deployed:**
  1. `Rule-Based Detection Matrix` (10 Configurable CFO rules: duplicate disbursements, SaaS seat overlaps, vendor price creep $>15\%$, unbilled ITC, banking interchange).
  2. `IsolationForest` (Unsupervised novelty detection for unknown spend anomalies).
* **Financial Impact Formula:**
  $$\text{Potential Recoverable Savings} = \text{Verified Eligible Leakage} \times P_{\text{recovery}}$$
* **Calibrated Benchmark:** 4.8% of monthly OPEX directly tied to interactive slider.

---

### Module 5: Financial Risk Management
* **Algorithms Deployed:**
  1. `LogisticRegression`: Calibrated default probability classifier ($C=1.0$).
  2. `IsolationForest`: Balance sheet outlier detector.
* **5-Pillar Autonomous Risk Radar:**
  - Liquidity Risk (Current Ratio, Quick Ratio, Runway)
  - Profitability Risk (Net Margin, Gross Margin)
  - Credit Risk (Days Sales Outstanding)
  - Operational Risk (Vendor Concentration)
  - Fraud Risk (Invoice Anomalies & GSTIN Compliance)
* **Accuracy:** 78.7% test accuracy on multi-variate financial distress distributions.

---

### Module 6: Procurement Optimization
* **Algorithms Deployed:**
  1. `K-Means Clustering` ($k=3$, standardized across order count, spend, average unit price, and price variance).
  2. `Ridge Regression`: Empirical price pattern estimation for renegotiation benchmarks.
* **Clusters:**
  - Cluster 0: Standard High-Frequency Suppliers
  - Cluster 1: High-Spend Strategic Partners
  - Cluster 2: Volatile / High-Variance Pricing Vendors
* **Silhouette Score:** 0.359.

---

### Module 7: Financial Analytics & Business Intelligence
* **Algorithms Deployed:**
  1. `LinearRegression`: Revenue & expense monthly trend decomposition.
  2. `10 Accounting Ratio Formulas`: Current, Quick, Debt-to-Equity, Gross Margin, Net Margin, Operating Margin, ROA, ROE, Inventory Turnover, DSO with zero-division safety.

---

### Module 8: ARTHIQ AI Assistant
* **Technologies:**
  1. `TF-IDF Vector Space RAG`: Ingests company profile, ledger summaries, leakage findings, and cash flow projections for grounded retrieval.
  2. `Autonomous Tool Calling Dispatcher`: Maps conversational intents to backend services (`scan_profit_leakage`, `analyze_invoice`, `predict_cash_flow`, `calculate_financial_ratios`, etc.).
  3. `CFO Recommendation Generator`: Cites exact ledger figures and recommends specific financial actions without hallucination.

---

## 4. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ml/models/status` | Returns training status and artifact paths |
| `GET` | `/api/ml/models/metrics` | Returns evaluation metrics (Accuracy, F1, Silhouette) |
| `GET` | `/api/ml/models/versions` | Returns deployed algorithm version metadata |
| `POST` | `/api/ml/expenses/analyze` | Executes Isolation Forest + LOF on expenses |
| `POST` | `/api/ml/invoices/predict` | Executes RF + XGBoost + IForest on invoices |
| `POST` | `/api/ml/cash-flow/forecast` | Executes ARIMA + Prophet + XGBoost + ETS ensemble |
| `POST` | `/api/ml/profit-leakage/scan`| Runs 10-rule engine + IForest on general ledger |
| `POST` | `/api/ml/financial-risk/assess`| Computes 5-pillar risk radar via Logistic Regression |
| `POST` | `/api/ml/procurement/optimize`| Executes K-Means vendor clustering & Ridge regression |
| `POST` | `/api/ml/analytics/predict` | Computes revenue/expense slopes and 10 CA ratios |
| `POST` | `/api/assistant/query` | RAG context retrieval and autonomous tool calling |

