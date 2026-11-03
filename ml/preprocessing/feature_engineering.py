"""
ARTHIQ Feature Engineering
Extracts and transforms numerical, temporal, and categorical features for ML pipelines.
"""

import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any
from sklearn.preprocessing import StandardScaler, LabelEncoder

def extract_expense_features(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Extracts features for Isolation Forest and Local Outlier Factor (LOF).
    Features:
    - Amount_INR
    - Category_Mean_Dev: deviation from category average
    - Vendor_Frequency: count of transactions for the vendor
    - Day_Of_Week, Day_Of_Month
    - Category_Encoded
    """
    df = df.copy()
    if "Date" in df.columns:
        df["Date"] = pd.to_datetime(df["Date"])
        df["Day_Of_Week"] = df["Date"].dt.dayofweek
        df["Day_Of_Month"] = df["Date"].dt.day
    else:
        df["Day_Of_Week"] = 2
        df["Day_Of_Month"] = 15

    # Category deviation
    cat_means = df.groupby("Category")["Amount_INR"].transform("mean")
    cat_stds = df.groupby("Category")["Amount_INR"].transform("std").fillna(1.0)
    df["Category_ZScore"] = (df["Amount_INR"] - cat_means) / (cat_stds + 1e-5)

    # Vendor frequency
    vendor_counts = df["Counterparty"].value_counts()
    df["Vendor_Frequency"] = df["Counterparty"].map(vendor_counts).fillna(1)

    # Label encode category
    le = LabelEncoder()
    df["Category_Code"] = le.fit_transform(df["Category"].astype(str))

    feature_cols = [
        "Amount_INR",
        "Category_ZScore",
        "Vendor_Frequency",
        "Day_Of_Week",
        "Day_Of_Month",
        "Category_Code"
    ]
    
    meta = {
        "scaler": StandardScaler(),
        "label_encoder": le,
        "feature_cols": feature_cols,
        "category_means": df.groupby("Category")["Amount_INR"].mean().to_dict()
    }
    
    X = df[feature_cols].copy()
    X_scaled = meta["scaler"].fit_transform(X)
    return pd.DataFrame(X_scaled, columns=feature_cols), meta

def extract_invoice_features(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series, Dict[str, Any]]:
    """
    Extracts supervised classification features for Random Forest & XGBoost.
    Features:
    - amount_inr
    - tax_inr
    - tax_ratio: tax_inr / amount_inr
    - gstin_valid (binary)
    - term_days: due_date - invoice_date
    - vendor_prior_count
    - duplicate_risk_score
    """
    df = df.copy()
    df["invoice_date"] = pd.to_datetime(df["invoice_date"])
    df["due_date"] = pd.to_datetime(df["due_date"])
    
    df["term_days"] = (df["due_date"] - df["invoice_date"]).dt.days.fillna(30)
    df["tax_ratio"] = (df["tax_inr"] / (df["amount_inr"] + 1e-5)).clip(0, 0.4)
    df["gstin_valid"] = df["gstin_format_valid"].astype(int)
    
    # Vendor count
    vendor_counts = df["vendor_name"].value_counts()
    df["vendor_freq"] = df["vendor_name"].map(vendor_counts).fillna(1)
    
    # Duplicate indicators
    df["amount_round"] = df["amount_inr"].round(-2)
    dup_counts = df.groupby(["vendor_name", "amount_round"])["amount_inr"].transform("count")
    df["is_potential_duplicate"] = (dup_counts > 1).astype(int)

    # Ground truth label derivation for training:
    # Invoices with invalid GSTIN, high duplicates, or overdue status without payment = 1, else 0
    y = ((df["gstin_valid"] == 0) | (df["is_potential_duplicate"] == 1) | (df["status"] == "Disputed")).astype(int)
    
    # Ensure balanced training class representation
    if y.sum() == 0:
        # Synthetically label top 10% highest amounts as audit targets
        q90 = df["amount_inr"].quantile(0.90)
        y = (df["amount_inr"] >= q90).astype(int)

    feature_cols = [
        "amount_inr",
        "tax_inr",
        "tax_ratio",
        "gstin_valid",
        "term_days",
        "vendor_freq",
        "is_potential_duplicate"
    ]
    
    scaler = StandardScaler()
    X = df[feature_cols].copy()
    X_scaled = scaler.fit_transform(X)
    
    meta = {
        "scaler": scaler,
        "feature_cols": feature_cols
    }
    return pd.DataFrame(X_scaled, columns=feature_cols), y, meta

def prepare_cashflow_timeseries(transactions_df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregates transactions into daily cash inflows, outflows, and net cash flow.
    """
    df = transactions_df.copy()
    df["Date"] = pd.to_datetime(df["Date"])
    
    inflows = df[df["Type"].str.lower() == "income"].groupby("Date")["Amount_INR"].sum().rename("Inflow")
    outflows = df[df["Type"].str.lower() == "expense"].groupby("Date")["Amount_INR"].sum().rename("Outflow")
    
    daily = pd.concat([inflows, outflows], axis=1).fillna(0.0)
    daily["Net_Cash_Flow"] = daily["Inflow"] - daily["Outflow"]
    
    # Reindex to full daily range without gaps
    idx = pd.date_range(daily.index.min(), daily.index.max())
    daily = daily.reindex(idx, fill_value=0.0)
    daily.index.name = "Date"
    return daily.reset_index()

