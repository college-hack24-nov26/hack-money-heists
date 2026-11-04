# ARTHIQ Machine Learning API Reference

## Authentication & Multi-Tenant Headers
All API endpoints support Bearer Token authentication and enforce multi-tenant organization isolation:
```http
Authorization: Bearer <jwt_auth_token>
Content-Type: application/json
```

---

## 1. SME Cash Flow Prediction APIs

### `POST /api/cash-flow/forecast`
Generates daily multi-horizon liquidity forecasts (7, 30, 60, 90 days) using the trained 4-model ensemble.

#### Request Body
```json
{
  "horizon_days": 30,
  "opening_balance": 1850000.00,
  "safety_threshold": 500000.00,
  "monthly_revenue": 4500000.00,
  "monthly_opex": 2800000.00,
  "payroll_expenses": 850000.00,
  "accounts_receivable": 1200000.00,
  "accounts_payable": 950000.00,
  "customer_payment_cycle_days": 30,
  "supplier_payment_cycle_days": 45,
  "seasonal_pattern": "neutral"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "forecast_horizon_days": 30,
  "opening_balance": 1850000.00,
  "projected_closing_balance": 2290450.00,
  "safety_threshold": 500000.00,
  "runway_months": 14.2,
  "total_projected_inflow": 4650000.00,
  "total_projected_outflow": 4209550.00,
  "net_flow_total": 440450.00,
  "risk_assessment": {
    "category": "Low Risk",
    "reason": "Healthy liquidity trajectory. Reserves remain comfortably above safety thresholds."
  },
  "alerts": [],
  "model_architecture": {
    "selected_models": ["ARIMA(1,d,1)", "Prophet", "XGBoost Regressor", "ETS (Holt-Winters)"],
    "optimal_weights": { "arima": 0.3354, "ets": 0.3386, "xgboost": 0.3260 },
    "confidence_interval": "95%",
    "data_sufficiency": "SUFFICIENT (7-Month Transaction History)"
  },
  "forecast": [
    {
      "date": "2026-11-05",
      "predicted_inflow": 150000.00,
      "predicted_outflow": 93333.33,
      "predicted_net": 56666.67,
      "projected_balance": 1906666.67,
      "balance_lower_bound": 1780000.00,
      "balance_upper_bound": 2033333.33,
      "confidence_level": "95% Empirical Uncertainty Envelope",
      "is_deficit": false,
      "type": "Forecast"
    }
  ]
}
```

### `GET /api/cash-flow/summary`
Returns current financial summary, working capital reserves, burn rate, and runway.

### `GET /api/cash-flow/alerts`
Returns active liquidity warning alerts, safety buffer breaches, and credit cycle alerts.

### `GET /api/cash-flow/model-performance`
Returns out-of-sample backtesting metrics (MAE, RMSE, WAPE, MASE, Forecast Bias, PICP) and model weights.

### `POST /api/cash-flow/train`
Triggers an automated retraining run on the latest transaction ledgers.

---

## 2. Intelligent Invoice Fraud Detection APIs

### `POST /api/invoices/analyze`
Executes multi-layer forensic analysis combining Calibrated Random Forest, XGBoost, Isolation Forest, and statutory Modulo 36 GSTIN verification.

#### Request Body
```json
{
  "invoice_number": "INV-SM-2024-DUP",
  "vendor_name": "SysMatrix Technologies Pvt Ltd",
  "total_amount": 12000.00,
  "gstin": "27AAPFU0939F1ZV"
}
```

#### Response (201 Created)
```json
{
  "status": "success",
  "invoice_id": "INV-SM-2024-DUP",
  "invoice_number": "INV-SM-2024-DUP",
  "vendor_name": "SysMatrix Technologies Pvt Ltd",
  "amount_inr": 12000.00,
  "risk_score": 88,
  "risk_category": "Critical Risk",
  "status": "BLOCKED",
  "is_suspicious": true,
  "gstin_validation": {
    "gstin": "27AAPFU0939F1ZV",
    "is_valid": true,
    "reason": "Statutory GSTIN format & Modulo 36 checksum verified"
  },
  "duplicate_audit": {
    "is_duplicate": true,
    "details": {
      "type": "Identical Vendor & Amount (Potential Duplicate Settlement)",
      "matched_invoice": "PO-SM-2024",
      "matched_amount": 12000.00
    }
  },
  "anomalies_detected": [
    "Duplicate Billing Alert: Identical Vendor & Amount (Matches #PO-SM-2024)"
  ],
  "forensic_evidence": [
    {
      "factor": "Duplicate Ledger Audit",
      "finding": "Matches prior voucher #PO-SM-2024 for ₹12,000.00",
      "severity": "CRITICAL",
      "impact": "+40 Risk Points"
    }
  ],
  "model_contributions": {
    "random_forest_probability": 0.4820,
    "xgboost_probability": 0.5110,
    "isolation_forest_anomaly": 0.1250,
    "rule_penalty_points": 40.0
  },
  "explainable_ai": {
    "top_risk_drivers": [
      { "feature": "is_duplicate_number", "importance_weight": 0.6289 },
      { "feature": "vendor_freq", "importance_weight": 0.1049 },
      { "feature": "amount_inr", "importance_weight": 0.0747 }
    ],
    "primary_reason": "Duplicate Billing Alert: Identical Vendor & Amount"
  },
  "recommended_action": "MANDATORY: Reject payment immediately. Issue credit reconciliation notice to vendor."
}
```

### `POST /api/invoices/validate-gstin`
Validates 15-character Indian statutory GSTIN structure and Modulo 36 checksum algorithm.

#### Request Body
```json
{ "gstin": "27AAPFU0939F1ZV" }
```

### `POST /api/invoices/detect-duplicates`
Scans uploaded invoices against the enterprise ledger to detect duplicate numbers or matching vendor/amount combinations.

### `GET /api/invoices/risk-summary`
Aggregates invoice statistics: total invoices processed, valid invoices, flagged invoices, duplicate count, and risk distribution (Low, Medium, High, Critical).

### `GET /api/invoices/model-performance`
Returns Precision, Recall, F1-Score, PR-AUC, ROC-AUC, Brier score, and operating threshold $\tau^*$.

### `POST /api/invoices/train-model`
Triggers supervised and unsupervised retraining of Random Forest, XGBoost, and Isolation Forest.

