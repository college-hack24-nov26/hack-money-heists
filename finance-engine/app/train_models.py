import os
import json
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.ensemble import IsolationForest

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '../../data/samples')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

def load_training_transactions():
    """
    Loads all transactions from the 7-month SME dataset and sample datasets.
    """
    dfs = []
    
    # 1. Aarav 7-month General Ledger (275 records)
    aarav_path = os.path.join(DATA_DIR, 'aarav_general_ledger.csv')
    if os.path.exists(aarav_path):
        df_aarav = pd.read_csv(aarav_path)
        # Standardize columns
        df_aarav.rename(columns={
            'Transaction_ID': 'id',
            'Date': 'date',
            'Type': 'type',
            'Category': 'category',
            'Counterparty': 'vendor',
            'Amount_INR': 'amount'
        }, inplace=True)
        dfs.append(df_aarav)
        
    # 2. Sample Transactions (144 records)
    sample_path = os.path.join(DATA_DIR, 'sample_transactions.csv')
    if os.path.exists(sample_path):
        df_sample = pd.read_csv(sample_path)
        df_sample.rename(columns={
            'transaction_id': 'id',
            'amount_inr': 'amount',
            'counterparty_name': 'vendor'
        }, inplace=True)
        dfs.append(df_sample)
        
    if not dfs:
        raise FileNotFoundError(f"No training data found in {DATA_DIR}")
        
    combined = pd.concat(dfs, ignore_index=True)
    combined['amount'] = pd.to_numeric(combined['amount'], errors='coerce').fillna(0.0)
    combined['date'] = pd.to_datetime(combined['date'], errors='coerce')
    combined['type'] = combined['type'].astype(str).str.strip().str.title()
    return combined

def train_expense_models():
    """
    Trains Isolation Forest anomaly detector and computes historical category benchmarks.
    """
    print("[1/3] Loading training dataset...")
    df = load_training_transactions()
    
    # Filter to expenses
    expenses_df = df[df['type'].isin(['Expense', 'Outflow'])].copy()
    print(f"Loaded {len(expenses_df)} historical expense records across 7 months.")
    
    # Feature Engineering
    expenses_df['day_of_week'] = expenses_df['date'].dt.dayofweek
    expenses_df['day_of_month'] = expenses_df['date'].dt.day
    expenses_df['log_amount'] = np.log1p(expenses_df['amount'])
    
    # Compute Statistical Baselines by Category
    category_baselines = {}
    for cat, group in expenses_df.groupby('category'):
        amounts = group['amount'].values
        category_baselines[cat] = {
            "count": int(len(group)),
            "mean": float(round(np.mean(amounts), 2)),
            "std": float(round(np.std(amounts), 2)),
            "median": float(round(np.median(amounts), 2)),
            "p75": float(round(np.percentile(amounts, 75), 2)),
            "p95": float(round(np.percentile(amounts, 95), 2)),
            "max": float(round(np.max(amounts), 2)),
            "iqr_upper": float(round(np.percentile(amounts, 75) + 1.75 * (np.percentile(amounts, 75) - np.percentile(amounts, 25)), 2))
        }
        
    # Global benchmark metrics
    global_amounts = expenses_df['amount'].values
    overall_baseline = {
        "dataset_period": "2026-04-01 to 2026-10-31 (7 Months)",
        "total_records": len(expenses_df),
        "total_spend": float(round(np.sum(global_amounts), 2)),
        "mean_transaction": float(round(np.mean(global_amounts), 2)),
        "std_transaction": float(round(np.std(global_amounts), 2)),
        "median_transaction": float(round(np.median(global_amounts), 2)),
        "anomaly_threshold_zscore": 2.5,
        "categories": category_baselines
    }
    
    # Train Isolation Forest for multidimensional outlier detection
    print("[2/3] Fitting Isolation Forest model...")
    X = expenses_df[['amount', 'day_of_week', 'day_of_month', 'log_amount']].values
    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42
    )
    iso_forest.fit(X)
    
    # Save Model Artifacts
    print("[3/3] Saving model artifacts to disk...")
    model_pkl_path = os.path.join(MODELS_DIR, 'isolation_forest_expense.pkl')
    with open(model_pkl_path, 'wb') as f:
        pickle.dump(iso_forest, f)
        
    stats_json_path = os.path.join(MODELS_DIR, 'baseline_stats.json')
    with open(stats_json_path, 'w', encoding='utf-8') as f:
        json.dump(overall_baseline, f, indent=2)
        
    report = {
        "status": "success",
        "trained_at": datetime.now().isoformat(),
        "model": "IsolationForest (n_estimators=100, contamination=0.05)",
        "training_dataset_size": len(expenses_df),
        "total_spend_analyzed": overall_baseline["total_spend"],
        "categories_calibrated": list(category_baselines.keys()),
        "model_file": model_pkl_path,
        "baseline_file": stats_json_path
    }
    
    report_path = os.path.join(MODELS_DIR, 'training_report.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
        
    print(f" Training complete! Calibrated {len(category_baselines)} categories. Report saved to {report_path}")
    return report

if __name__ == '__main__':
    train_expense_models()

