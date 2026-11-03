import os
import json
import pickle
import numpy as np
import pandas as pd
from datetime import datetime
from collections import defaultdict

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'models')
ISO_MODEL_PATH = os.path.join(MODELS_DIR, 'isolation_forest_expense.pkl')
STATS_PATH = os.path.join(MODELS_DIR, 'baseline_stats.json')

_cached_model = None
_cached_stats = None

def get_ml_artifacts():
    global _cached_model, _cached_stats
    if _cached_model is None and os.path.exists(ISO_MODEL_PATH):
        try:
            with open(ISO_MODEL_PATH, 'rb') as f:
                _cached_model = pickle.load(f)
        except Exception:
            _cached_model = None
    if _cached_stats is None and os.path.exists(STATS_PATH):
        try:
            with open(STATS_PATH, 'r', encoding='utf-8') as f:
                _cached_stats = json.load(f)
        except Exception:
            _cached_stats = None
    return _cached_model, _cached_stats

CATEGORY_KEYWORDS = {
    "Operating": ["aws", "cloud", "hosting", "server", "electricity", "rent", "office rent", "utility", "maintenance", "internet", "bandwidth"],
    "Employee": ["salary", "payroll", "bonus", "pf", "provident fund", "gratuity", "health insurance", "reimbursement", "perks", "stipend"],
    "Marketing": ["google ads", "meta", "facebook", "linkedin ads", "advertising", "seo", "branding", "pr agency", "campaign", "sponsorship"],
    "Procurement": ["hardware", "laptops", "raw material", "inventory", "packaging", "freight", "components", "office supplies"],
    "Administrative": ["legal", "audit", "accounting", "compliance", "notary", "stationery", "courier", "cleaning", "cafeteria"],
    "Subscriptions": ["slack", "zoom", "jira", "github", "figma", "notion", "hubspot", "salesforce", "canva", "chatgpt", "openai", "copilot"]
}

def categorize_expense(description, vendor=""):
    text = f"{description} {vendor}".lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return category
    return "Operating"

def analyze_expenses(expenses_list, total_revenue=4500000.0, historical_previous_expenses=None):
    """
    Analyzes list of expenses with ML anomaly detection, duplicate detection,
    recurring subscription identification, and categorization.
    """
    if not expenses_list:
        return {
            "total_expenses": 0.0,
            "category_breakdown": {},
            "anomalies": [],
            "duplicates": [],
            "subscriptions": [],
            "metrics": {},
            "recommendations": []
        }

    df = pd.DataFrame(expenses_list)
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0.0)
    df['date_dt'] = pd.to_datetime(df['date'], errors='coerce')

    # Apply categorization if not present or generic
    if 'category' not in df.columns or df['category'].isnull().all():
        df['category'] = df.apply(lambda r: categorize_expense(r.get('description', ''), r.get('vendor', '')), axis=1)

    total_expense = float(df['amount'].sum())
    
    # Category totals
    category_totals = df.groupby('category')['amount'].sum().to_dict()
    for cat in ["Operating", "Administrative", "Marketing", "Employee", "Procurement", "Subscriptions"]:
        if cat not in category_totals:
            category_totals[cat] = 0.0

    # 1. Duplicate Expense Detection
    duplicates = []
    seen = defaultdict(list)
    for idx, row in df.iterrows():
        key = (str(row.get('vendor', '')).strip().lower(), round(float(row['amount']), 2))
        seen[key].append(row)

    for (v, amt), group in seen.items():
        if len(group) > 1 and amt > 1000:
            duplicates.append({
                "vendor": v.title(),
                "amount": amt,
                "count": len(group),
                "potential_loss": round(amt * (len(group) - 1), 2),
                "dates": [str(g.get('date', '')) for g in group],
                "description": f"Identified {len(group)} identical charges of ₹{amt:,.2f} for {v.title()}."
            })

    # 2. Outlier / Anomaly Detection using Trained Isolation Forest + Statistical Z-Score
    anomalies = []
    iso_model, trained_stats = get_ml_artifacts()
    cat_baselines = trained_stats.get("categories", {}) if trained_stats else {}

    if len(df) >= 4:
        amounts = df['amount'].values
        q25, q75 = np.percentile(amounts, 25), np.percentile(amounts, 75)
        iqr = q75 - q25
        upper_bound = q75 + (1.75 * iqr)
        mean_amt = np.mean(amounts)
        std_amt = np.std(amounts) if np.std(amounts) > 0 else 1.0

        for idx, row in df.iterrows():
            amt = float(row['amount'])
            z_score = (amt - mean_amt) / std_amt
            cat = str(row.get('category', 'Operating'))
            vendor = str(row.get('vendor', 'Unknown'))
            
            # Category baseline check from 7-month trained ground truth
            cat_stat = cat_baselines.get(cat, {})
            cat_thresh = cat_stat.get("iqr_upper", upper_bound)
            is_cat_anomaly = amt > cat_thresh and amt > 25000.0

            # Isolation Forest anomaly inference if model artifact is available
            ml_anomaly_flag = False
            ml_score = 0.0
            if iso_model is not None:
                try:
                    dt = pd.to_datetime(row.get('date'), errors='coerce')
                    dow = dt.day_of_week if pd.notna(dt) else 2
                    dom = dt.day if pd.notna(dt) else 15
                    log_amt = np.log1p(amt)
                    feat = np.array([[amt, dow, dom, log_amt]])
                    pred = iso_model.predict(feat)[0]  # -1 for anomaly, 1 for inlier
                    dec_score = float(iso_model.decision_function(feat)[0])
                    ml_score = round(float(-dec_score), 3)
                    if pred == -1 and amt > 30000.0:
                        ml_anomaly_flag = True
                except Exception:
                    pass

            if amt > upper_bound or z_score > 2.5 or is_cat_anomaly or ml_anomaly_flag:
                reason = f"Amount is {z_score:.1f} standard deviations above company transaction mean (threshold: ₹{upper_bound:,.2f})."
                if is_cat_anomaly:
                    reason = f"Amount exceeds calibrated 7-month '{cat}' ceiling (benchmark: ₹{cat_thresh:,.2f}, 95th percentile: ₹{cat_stat.get('p95', 0):,.2f})."
                if ml_anomaly_flag:
                    reason += f" Isolation Forest AI model flagged spending pattern (ML anomaly score: {ml_score})."

                anomalies.append({
                    "id": row.get('id', idx),
                    "date": str(row.get('date', '')),
                    "vendor": vendor,
                    "description": row.get('description', ''),
                    "amount": round(amt, 2),
                    "category": cat,
                    "z_score": round(float(z_score), 2),
                    "ml_anomaly_score": ml_score,
                    "reason": reason,
                    "action": "Audit authorization voucher and verify if this was an approved one-off capital purchase."
                })

    # 3. Recurring Subscriptions Identification
    subscriptions = []
    vendor_groups = df.groupby('vendor')
    for vendor, vdf in vendor_groups:
        if len(vdf) >= 2:
            amounts = vdf['amount'].unique()
            # If amounts are consistent (within 5% variance)
            if np.std(vdf['amount']) / max(1.0, np.mean(vdf['amount'])) < 0.05:
                avg_sub = float(np.mean(vdf['amount']))
                subscriptions.append({
                    "vendor": vendor,
                    "cadence": "Monthly" if len(vdf) >= 2 else "Recurring",
                    "monthly_cost": round(avg_sub, 2),
                    "annualized_impact": round(avg_sub * 12, 2),
                    "occurrences": len(vdf),
                    "category": vdf['category'].iloc[0]
                })

    # 4. Expense Growth & Metrics
    prev_total = float(historical_previous_expenses) if historical_previous_expenses else (total_expense * 0.91)
    growth_pct = round(((total_expense - prev_total) / prev_total) * 100, 2) if prev_total > 0 else 0.0
    exp_to_rev = round((total_expense / total_revenue) * 100, 2) if total_revenue > 0 else 0.0

    # 5. AI Recommendations
    recommendations = []
    if exp_to_rev > 75.0:
        recommendations.append({
            "type": "HIGH_BURN",
            "title": "Expense-to-Revenue Ratio Exceeds Prudent SME Benchmark",
            "explanation": f"Current expense ratio is {exp_to_rev}% of gross revenue (healthy SME ceiling: 65-70%).",
            "action": "Freeze non-essential departmental hiring and consolidate SaaS licenses."
        })
    if duplicates:
        tot_dup = sum(d['potential_loss'] for d in duplicates)
        recommendations.append({
            "type": "DUPLICATE_PAYMENTS",
            "title": f"Recoverable Duplicate Charges: ₹{tot_dup:,.2f}",
            "explanation": f"Detected {len(duplicates)} duplicate vendor billing cycles that may have caused accidental double-debiting.",
            "action": "Issue vendor credit notes or reverse double bank transactions."
        })
    if category_totals.get("Subscriptions", 0) > 40000:
        recommendations.append({
            "type": "SUBSCRIPTION_CREEP",
            "title": "Software Tool Sprawl Optimization",
            "explanation": f"Recurring SaaS subscriptions account for ₹{category_totals.get('Subscriptions', 0):,.2f}/mo across teams.",
            "action": "Audit active seat licenses and decommission unassigned seats."
        })

    return {
        "total_expenses": round(total_expense, 2),
        "operating_expenses": round(category_totals.get("Operating", 0.0), 2),
        "administrative_expenses": round(category_totals.get("Administrative", 0.0), 2),
        "marketing_expenses": round(category_totals.get("Marketing", 0.0), 2),
        "employee_expenses": round(category_totals.get("Employee", 0.0), 2),
        "procurement_expenses": round(category_totals.get("Procurement", 0.0), 2),
        "subscription_expenses": round(category_totals.get("Subscriptions", 0.0), 2),
        "category_breakdown": {k: round(v, 2) for k, v in category_totals.items()},
        "expense_growth_percentage": growth_pct,
        "expense_to_revenue_ratio": exp_to_rev,
        "anomalies": anomalies,
        "duplicates": duplicates,
        "recurring_subscriptions": subscriptions,
        "recommendations": recommendations
    }

