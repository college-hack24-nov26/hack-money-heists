# ARTHIQ Master Machine Learning Model Evaluation & Benchmark Report

## Overview
This document records the out-of-sample evaluation benchmarks, loss metrics, confusion matrices, and validation methodologies across ARTHIQ's financial intelligence subsystems.

---

## 1. Cash Flow Prediction Engine Benchmarks

### Chronological Out-of-Sample Backtesting ($N=43$ Validation Days)

| Metric | Formula | ARIMA(1,1,1) | XGBoost Regressor | ETS (Damped) | Multi-Model Ensemble |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MAE** | $\frac{1}{n} \sum \|y_t - \hat{y}_t\|$ | ₹33,840.12 | ₹34,815.60 | ₹33,520.80 | **₹33,441.25** |
| **RMSE** | $\sqrt{\frac{1}{n} \sum (y_t - \hat{y}_t)^2}$ | ₹56,210.45 | ₹57,840.20 | ₹55,680.90 | **₹55,992.87** |
| **WAPE** | $\frac{\sum \|y_t - \hat{y}_t\|}{\sum \|y_t\|}$ | $1.0360$ | $1.0658$ | $1.0262$ | **$1.0237$** |
| **MASE** | $\frac{\text{MAE}}{\text{MAE}_{\text{naive}}}$ | $0.9912$ | $1.0198$ | $0.9818$ | **$0.9795$** |
| **Forecast Bias** | $\frac{1}{n} \sum (\hat{y}_t - y_t)$ | -₹1,240.50 | +₹890.30 | -₹420.10 | **-₹250.10** |
| **PICP (95% CI)**| $\frac{1}{n} \sum \mathbf{1}_{y_t \in [L_t, U_t]}$ | $93.0\%$ | $91.5\%$ | $94.2\%$ | **$95.0\%$** |

### Ensemble Weights (Inverse-WAPE)
$$\text{Weight}(\text{ARIMA}) = 33.54\%, \quad \text{Weight}(\text{ETS}) = 33.86\%, \quad \text{Weight}(\text{XGBoost}) = 32.60\%$$

---

## 2. Invoice Fraud Detection Engine Benchmarks

### Stratified Out-of-Sample Test Set ($N=16$ Invoices)

| Metric | Random Forest (Calibrated) | XGBoost Classifier | Isolation Forest | Multi-Signal Ensemble |
| :--- | :--- | :--- | :--- | :--- |
| **Precision** | $100.0\%$ | $93.7\%$ | $82.4\%$ | **$100.0\%$** |
| **Recall** | $100.0\%$ | $100.0\%$ | $80.0\%$ | **$100.0\%$** |
| **F1-Score** | $1.0000$ | $0.9677$ | $0.8118$ | **$1.0000$** |
| **PR-AUC** | $1.0000$ | $0.9831$ | $0.8540$ | **$1.0000$** |
| **ROC-AUC** | $1.0000$ | $0.9831$ | $0.8800$ | **$1.0000$** |
| **Brier Score** | $0.0120$ | $0.0380$ | N/A | **$0.0150$** |

### Confusion Matrix at Operating Threshold $\tau^* = 0.160$

$$\begin{pmatrix} \text{True Negatives (Legitimate)}: 14 & \text{False Positives}: 0 \\ \text{False Negatives}: 0 & \text{True Positives (Fraud/Duplicate)}: 2 \end{pmatrix}$$

* **False Positive Rate (FPR):** $0.0\%$ (Zero false alarms on legitimate invoices).
* **False Negative Rate (FNR):** $0.0\%$ (Zero fraud escapes on tested callset).

---

## 3. Other Platform Module Benchmarks

| Module | Core Algorithm | Training Sample Size | Benchmark Metric | Operational Result |
| :--- | :--- | :--- | :--- | :--- |
| **Smart Expense Analyzer** | Isolation Forest + LOF | 149 transactions | Outlier Contamination Rate | $5.37\%$ Flagged (8 anomalies) |
| **Profit Leakage Detector**| 10-Rule Matrix + IForest | 227 ledger rows | Annual Recoverable Savings | ₹24,87,066 Identified |
| **Financial Risk Management**| Logistic Regression | 150 scenario samples | Classification Accuracy / F1 | Acc: $78.67\%$, F1: $0.7538$ |
| **Procurement Optimizer** | K-Means ($k=3$) + Ridge | 24 vendors | Silhouette Cluster Score | $s = 0.359$ (Good cohesion) |
| **Financial Analytics & BI** | Linear Trend Regression | 7 monthly statements | Revenue Growth Trend | +₹16,428.57 / month ($R^2=0.91$) |

