"""
ARTHIQ ML Data Loaders
Ingests, cleans, and standardizes financial records from CSV, Excel, and Supabase database.
"""

import os
import pandas as pd
import numpy as np
from pathlib import Path
from ml.config.settings import DATASETS, DATA_DIR

def load_transactions() -> pd.DataFrame:
    """Loads and standardizes transaction ledger records."""
    path = DATASETS["transactions"]
    if not path.exists():
        raise FileNotFoundError(f"Transactions dataset missing at {path}")
    
    df = pd.read_csv(path)
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df["Amount_INR"] = pd.to_numeric(df["Amount_INR"], errors="coerce").fillna(0.0)
    df["Type"] = df["Type"].fillna("Expense")
    df["Category"] = df["Category"].fillna("Uncategorized")
    df["Counterparty"] = df["Counterparty"].fillna("Unknown Vendor")
    df["Payment_Method"] = df["Payment_Method"].fillna("Bank Transfer")
    df["Status"] = df["Status"].fillna("Completed")
    return df

def load_invoices_payable() -> pd.DataFrame:
    """Loads accounts payable invoices with vendor details and tax breakdown."""
    path = DATASETS["invoices_payable"]
    if not path.exists():
        raise FileNotFoundError(f"Payable invoices missing at {path}")
    
    df = pd.read_csv(path)
    df["invoice_date"] = pd.to_datetime(df["invoice_date"], errors="coerce")
    df["due_date"] = pd.to_datetime(df["due_date"], errors="coerce")
    df["amount_inr"] = pd.to_numeric(df["amount_inr"], errors="coerce").fillna(0.0)
    df["tax_inr"] = pd.to_numeric(df["tax_inr"], errors="coerce").fillna(0.0)
    df["vendor_name"] = df["vendor_name"].fillna("Unknown Vendor")
    df["status"] = df["status"].fillna("Pending")
    df["gstin_format_valid"] = df["gstin_format_valid"].astype(bool)
    return df

def load_invoices_receivable() -> pd.DataFrame:
    """Loads accounts receivable invoices for client analysis and DSO."""
    path = DATASETS["invoices_receivable"]
    if not path.exists():
        raise FileNotFoundError(f"Receivable invoices missing at {path}")
    
    df = pd.read_csv(path)
    df["Issue_Date"] = pd.to_datetime(df["Issue_Date"], errors="coerce")
    df["Due_Date"] = pd.to_datetime(df["Due_Date"], errors="coerce")
    df["Invoice_Amount_INR"] = pd.to_numeric(df["Invoice_Amount_INR"], errors="coerce").fillna(0.0)
    df["Customer_Name"] = df["Customer_Name"].fillna("Unknown Customer")
    df["Status"] = df["Status"].fillna("Pending")
    return df

def load_monthly_summary() -> pd.DataFrame:
    """Loads 7-month aggregated monthly summary."""
    path = DATASETS["monthly_summary"]
    if not path.exists():
        raise FileNotFoundError(f"Monthly summary missing at {path}")
    
    df = pd.read_csv(path)
    df["Opening_Cash_INR"] = pd.to_numeric(df["Opening_Cash_INR"], errors="coerce").fillna(0.0)
    df["Total_Income_INR"] = pd.to_numeric(df["Total_Income_INR"], errors="coerce").fillna(0.0)
    df["Total_Expenses_INR"] = pd.to_numeric(df["Total_Expenses_INR"], errors="coerce").fillna(0.0)
    df["Net_Cash_Flow_INR"] = pd.to_numeric(df["Net_Cash_Flow_INR"], errors="coerce").fillna(0.0)
    df["Closing_Cash_INR"] = pd.to_numeric(df["Closing_Cash_INR"], errors="coerce").fillna(0.0)
    return df

def load_vendors() -> pd.DataFrame:
    """Loads vendor registry for procurement clustering and risk evaluation."""
    path = DATASETS["vendors"]
    if not path.exists():
        raise FileNotFoundError(f"Vendors dataset missing at {path}")
    return pd.read_csv(path)

