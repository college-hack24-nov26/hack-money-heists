"""
ARTHIQ ML Configuration & Hyperparameters
Centralized settings for all Machine Learning algorithms, feature pipelines, and model artifacts.
"""

import os
from pathlib import Path

# Base Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "samples"
MODELS_ROOT = PROJECT_ROOT / "ml" / "models"
REPORTS_DIR = PROJECT_ROOT / "docs"

# Model Artifact Subdirectories
MODEL_DIRS = {
    "expense_analyzer": MODELS_ROOT / "expense_analyzer",
    "invoice_fraud": MODELS_ROOT / "invoice_fraud",
    "cash_flow": MODELS_ROOT / "cash_flow",
    "profit_leakage": MODELS_ROOT / "profit_leakage",
    "financial_risk": MODELS_ROOT / "financial_risk",
    "procurement": MODELS_ROOT / "procurement",
    "analytics": MODELS_ROOT / "analytics"
}

# Ensure directories exist
for m_dir in MODEL_DIRS.values():
    m_dir.mkdir(parents=True, exist_ok=True)

# Datasets Mapping
DATASETS = {
    "transactions": DATA_DIR / "aarav_7m_transactions.csv",
    "invoices_receivable": DATA_DIR / "aarav_7m_invoices.csv",
    "invoices_payable": DATA_DIR / "invoices_payable.csv",
    "monthly_summary": DATA_DIR / "aarav_7m_monthly_summary.csv",
    "vendors": DATA_DIR / "aarav_7m_vendors.csv",
    "budgets": DATA_DIR / "aarav_7m_budgets_vs_actuals.csv",
    "purchase_orders": DATA_DIR / "purchase_orders.csv",
    "category_budgets": DATA_DIR / "category_budgets.csv"
}

# Hyperparameters & Algorithm Configurations
HYPERPARAMS = {
    # Module 1: Smart Expense Analyzer
    "expense_isolation_forest": {
        "n_estimators": 120,
        "contamination": 0.06,
        "random_state": 42
    },
    "expense_lof": {
        "n_neighbors": 15,
        "contamination": 0.06,
        "novelty": True
    },
    # Module 2: Invoice Fraud Detector
    "invoice_random_forest": {
        "n_estimators": 100,
        "max_depth": 7,
        "min_samples_split": 3,
        "random_state": 42
    },
    "invoice_xgboost": {
        "n_estimators": 80,
        "max_depth": 4,
        "learning_rate": 0.08,
        "subsample": 0.85,
        "random_state": 42,
        "eval_metric": "logloss"
    },
    "invoice_isolation_forest": {
        "n_estimators": 100,
        "contamination": 0.08,
        "random_state": 42
    },
    # Module 3: Cash Flow Forecaster
    "cashflow_arima": {
        "order": (1, 1, 1),
        "seasonal_order": (0, 0, 0, 0)
    },
    "cashflow_prophet": {
        "yearly_seasonality": False,
        "weekly_seasonality": True,
        "daily_seasonality": False,
        "interval_width": 0.95
    },
    "cashflow_xgboost": {
        "n_estimators": 100,
        "max_depth": 4,
        "learning_rate": 0.05,
        "random_state": 42
    },
    "cashflow_ets": {
        "trend": "add",
        "damped_trend": True
    },
    # Module 4: Profit Leakage
    "leakage_isolation_forest": {
        "n_estimators": 100,
        "contamination": 0.07,
        "random_state": 42
    },
    # Module 5: Financial Risk Radar
    "risk_logistic_regression": {
        "max_iter": 1000,
        "C": 1.0,
        "solver": "lbfgs",
        "random_state": 42
    },
    "risk_isolation_forest": {
        "n_estimators": 100,
        "contamination": 0.08,
        "random_state": 42
    },
    # Module 6: Procurement Optimization
    "procurement_kmeans": {
        "n_clusters": 3,
        "random_state": 42,
        "n_init": 10
    },
    # Module 7: Financial Analytics Regression
    "analytics_regression": {
        "fit_intercept": True
    }
}

