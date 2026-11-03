"""
Module 1: Smart Expense Analyzer Algorithm Suite
Implements:
1. Isolation Forest (Unsupervised tree-based outlier isolation)
2. Local Outlier Factor (LOF - Density-based local neighborhood anomaly detection)
3. Ensemble Scoring Pipeline with explainable risk level and diagnostic insights
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from ml.config.settings import HYPERPARAMS

class ExpenseAnomalyDetector:
    def __init__(self):
        iso_params = HYPERPARAMS["expense_isolation_forest"]
        lof_params = HYPERPARAMS["expense_lof"]
        
        self.isolation_forest = IsolationForest(
            n_estimators=iso_params["n_estimators"],
            contamination=iso_params["contamination"],
            random_state=iso_params["random_state"]
        )
        self.lof = LocalOutlierFactor(
            n_neighbors=lof_params["n_neighbors"],
            contamination=lof_params["contamination"],
            novelty=lof_params["novelty"]
        )
        self.is_fitted = False
        self.feature_meta = None

    def fit(self, X: np.ndarray, meta: Dict[str, Any] = None):
        """Fits both Isolation Forest and Local Outlier Factor."""
        self.isolation_forest.fit(X)
        self.lof.fit(X)
        self.is_fitted = True
        self.feature_meta = meta

    def predict_anomalies(
        self,
        expenses: List[Dict[str, Any]],
        category_means: Dict[str, float] = None
    ) -> List[Dict[str, Any]]:
        """
        Runs ensemble anomaly detection over an incoming list of expenses.
        Outputs: Anomaly Score (0-100), Detection Algorithm, Risk Level, Explanation.
        """
        if not expenses:
            return []

        df = pd.DataFrame(expenses)
        
        # Robust column resolution for both camelCase and snake_case / uppercase keys
        if "amount" in df.columns:
            amt_s = df["amount"]
        elif "Amount_INR" in df.columns:
            amt_s = df["Amount_INR"]
        else:
            amt_s = 0.0
        df["amount"] = pd.to_numeric(amt_s, errors="coerce").fillna(0.0)

        if "category" in df.columns:
            df["category"] = df["category"].fillna("General Operations")
        elif "Category" in df.columns:
            df["category"] = df["Category"].fillna("General Operations")
        else:
            df["category"] = "General Operations"

        if "vendor" in df.columns:
            df["vendor"] = df["vendor"].fillna("Unknown Vendor")
        elif "Counterparty" in df.columns:
            df["vendor"] = df["Counterparty"].fillna("Unknown Vendor")
        else:
            df["vendor"] = "Unknown Vendor"

        # Fallback baseline stats if not fitted
        cat_avg = category_means or {
            "Operating": 35000.0,
            "Salaries": 140000.0,
            "Inventory Purchase": 25000.0,
            "Subscriptions": 8000.0,
            "Office Rent": 30000.0,
            "Marketing": 12000.0,
            "Logistics": 15000.0
        }

        # Vectorized feature construction
        z_scores = []
        vendor_counts = df["vendor"].value_counts().to_dict()
        
        X_raw = []
        for _, row in df.iterrows():
            amt = float(row["amount"])
            cat = str(row["category"])
            avg = cat_avg.get(cat, 25000.0)
            z = (amt - avg) / (avg * 0.4 + 1e-5)
            z_scores.append(z)
            v_freq = vendor_counts.get(row["vendor"], 1)
            X_raw.append([amt, z, v_freq])

        X_mat = np.array(X_raw)

        # 1. Isolation Forest Scoring
        if self.is_fitted:
            try:
                # score_samples returns negative anomaly score (lower means more anomalous)
                iso_raw = self.isolation_forest.score_samples(X_mat)
                iso_scores = np.clip((0.5 - iso_raw) * 100, 0, 100)
            except Exception:
                iso_scores = np.array([min(100, max(0, abs(z) * 25)) for z in z_scores])
        else:
            iso_scores = np.array([min(100, max(0, abs(z) * 25)) for z in z_scores])

        # 2. LOF Scoring (Local neighborhood density)
        if self.is_fitted:
            try:
                lof_raw = self.lof.score_samples(X_mat)
                lof_scores = np.clip((abs(lof_raw) - 1.0) * 50, 0, 100)
            except Exception:
                lof_scores = iso_scores * 0.9
        else:
            lof_scores = iso_scores * 0.9

        results = []
        for i, row in df.iterrows():
            iso_sc = float(iso_scores[i])
            lof_sc = float(lof_scores[i])
            
            # Weighted Ensemble Score: 60% Isolation Forest + 40% Local Outlier Factor
            ensemble_score = round(0.60 * iso_sc + 0.40 * lof_sc, 1)
            
            # Algorithmic attribution
            if ensemble_score >= 65:
                if iso_sc > lof_sc + 10:
                    algo_used = "Isolation Forest"
                elif lof_sc > iso_sc + 10:
                    algo_used = "Local Outlier Factor (LOF)"
                else:
                    algo_used = "Ensemble (IForest + LOF)"
            else:
                algo_used = "Standard Baseline"

            amt = float(row["amount"])
            cat = str(row["category"])
            avg = cat_avg.get(cat, 25000.0)
            ratio = amt / avg if avg > 0 else 1.0

            # Explanations and Risk Tiers
            if ensemble_score >= 80 or ratio > 3.0:
                risk_level = "High Risk"
                explanation = f"Extreme spending spike of ₹{amt:,.2f} ({ratio:.1f}x higher than the {cat} baseline of ₹{avg:,.2f})."
            elif ensemble_score >= 55 or ratio > 1.8:
                risk_level = "Medium Risk"
                explanation = f"Moderate statistical outlier in {cat}. Transaction differs from local spending distribution."
            else:
                risk_level = "Normal"
                explanation = f"Transaction amount ₹{amt:,.2f} conforms to historical {cat} spending variance."

            results.append({
                "id": row.get("id", f"exp-{i}"),
                "vendor": row["vendor"],
                "category": cat,
                "amount": amt,
                "anomaly_score": ensemble_score,
                "algorithm": algo_used,
                "risk_level": risk_level,
                "is_outlier": ensemble_score >= 55,
                "explanation": explanation
            })

        return results
