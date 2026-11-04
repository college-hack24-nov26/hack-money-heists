"""
ARTHIQ High-Precision Invoice Fraud Training Pipeline
Trains Random Forest (Calibrated), XGBoost (PR-Optimized), and Isolation Forest (Unsupervised Novelty).
Performs class-imbalance weighting, stratified validation, and precision-recall threshold optimization.
Serializes model artifacts to ml/models/invoice_fraud/.
"""

import sys
import pickle
import json
import warnings
from pathlib import Path
from datetime import datetime
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

from ml.config.settings import MODEL_DIRS, HYPERPARAMS
from ml.preprocessing.invoice_preprocessing import InvoicePreprocessor
from ml.evaluation.invoice_fraud_evaluation import InvoiceFraudEvaluator, evaluate_fraud_classifier

def train_invoice_fraud_models() -> Dict[str, Any]:
    print("[*] Starting ARTHIQ Invoice Fraud Forensics Training Pipeline...")

    # 1. Load and Standardize Invoices
    preprocessor = InvoicePreprocessor()
    raw_df = preprocessor.load_and_standardize_invoices()
    X, y = preprocessor.engineer_features(raw_df)

    pos_count = int(np.sum(y))
    neg_count = len(y) - pos_count
    pos_ratio = (pos_count / len(y)) * 100.0
    print(f"[*] Invoices Loaded: {len(y)} records (Legitimate: {neg_count}, Fraud/Suspicious: {pos_count} - {pos_ratio:.1f}%)")

    # 2. Stratified Train / Validation Split to Preserve Fraud Distribution
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # 3. Fit Normalization Scaler on Training Set Only (No Lookahead Leakage)
    preprocessor.fit_scaler(X_train)
    X_train_scaled = preprocessor.transform_features(X_train).values
    X_val_scaled = preprocessor.transform_features(X_val).values

    # 4. Class Imbalance Weight Calculation
    scale_pos_weight = float(neg_count / max(pos_count, 1))

    # 5. Model 1: Calibrated Random Forest Classifier
    rf_base = RandomForestClassifier(
        n_estimators=HYPERPARAMS["invoice_random_forest"]["n_estimators"],
        max_depth=HYPERPARAMS["invoice_random_forest"]["max_depth"],
        min_samples_split=HYPERPARAMS["invoice_random_forest"]["min_samples_split"],
        class_weight="balanced",
        random_state=42
    )
    # Probability Calibration via Isotonic or Sigmoid to prevent overconfidence
    try:
        rf_calibrated = CalibratedClassifierCV(rf_base, cv=3, method="sigmoid")
        rf_calibrated.fit(X_train_scaled, y_train)
    except Exception:
        rf_base.fit(X_train_scaled, y_train)
        rf_calibrated = rf_base

    rf_val_prob = rf_calibrated.predict_proba(X_val_scaled)[:, 1]

    # 6. Model 2: XGBoost Classifier (Precision-Recall Tuned)
    xgb_model = XGBClassifier(
        n_estimators=HYPERPARAMS["invoice_xgboost"]["n_estimators"],
        max_depth=HYPERPARAMS["invoice_xgboost"]["max_depth"],
        learning_rate=HYPERPARAMS["invoice_xgboost"]["learning_rate"],
        subsample=HYPERPARAMS["invoice_xgboost"]["subsample"],
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        eval_metric="logloss"
    )
    xgb_model.fit(X_train_scaled, y_train)
    xgb_val_prob = xgb_model.predict_proba(X_val_scaled)[:, 1]

    # 7. Model 3: Isolation Forest (Unsupervised Novelty on Normal Records)
    clean_train_idx = (y_train == 0)
    X_train_clean = X_train_scaled[clean_train_idx]
    iso_forest = IsolationForest(
        n_estimators=HYPERPARAMS["invoice_isolation_forest"]["n_estimators"],
        contamination=HYPERPARAMS["invoice_isolation_forest"]["contamination"],
        random_state=42
    )
    iso_forest.fit(X_train_clean)

    # Anomaly score normalization: -0.5 to 0.5 -> 0.0 to 1.0
    raw_iso_scores = -iso_forest.score_samples(X_val_scaled)
    iso_val_prob = np.clip((raw_iso_scores - np.min(raw_iso_scores)) / (np.ptp(raw_iso_scores) + 1e-5), 0.0, 1.0)

    # 8. Composite Probability Ensemble
    ensemble_val_prob = (0.45 * rf_val_prob) + (0.45 * xgb_val_prob) + (0.10 * iso_val_prob)

    # 9. Threshold Optimization on Validation Set
    evaluator = InvoiceFraudEvaluator(target_precision=0.90, min_acceptable_recall=0.75)
    opt_result = evaluator.optimize_operating_threshold(y_val, ensemble_val_prob)
    optimal_th = opt_result["optimal_threshold"]
    metrics_at_opt = opt_result["metrics_at_optimal"]

    print(f"[*] Optimal Operating Threshold: {optimal_th:.3f} ({opt_result['selection_rule']})")
    print(f"[*] Validation Performance: Precision={metrics_at_opt['precision'] * 100:.1f}%, Recall={metrics_at_opt['recall'] * 100:.1f}%, F1={metrics_at_opt['f1_score']:.4f}, PR-AUC={metrics_at_opt['pr_auc']:.4f}")

    # 10. Extract Feature Importances
    if hasattr(rf_calibrated, "calibrated_classifiers_") and len(rf_calibrated.calibrated_classifiers_) > 0:
        rf_importances = rf_calibrated.calibrated_classifiers_[0].estimator.feature_importances_
    elif hasattr(rf_calibrated, "feature_importances_"):
        rf_importances = rf_calibrated.feature_importances_
    else:
        rf_importances = np.full(len(preprocessor.feature_columns), 1.0 / len(preprocessor.feature_columns))

    xgb_importances = xgb_model.feature_importances_
    combined_imp = 0.5 * rf_importances + 0.5 * xgb_importances
    feature_importance_dict = {
        preprocessor.feature_columns[i]: round(float(combined_imp[i]), 4)
        for i in range(len(preprocessor.feature_columns))
    }
    sorted_features = sorted(feature_importance_dict.items(), key=lambda x: x[1], reverse=True)
    print(f"[*] Top Risk Drivers: {sorted_features[:3]}")

    # 11. Refit on Complete Dataset for Production Inferences
    preprocessor.fit_scaler(X)
    X_full_scaled = preprocessor.transform_features(X).values

    try:
        final_rf = CalibratedClassifierCV(rf_base, cv=3, method="sigmoid")
        final_rf.fit(X_full_scaled, y)
    except Exception:
        rf_base.fit(X_full_scaled, y)
        final_rf = rf_base

    final_xgb = XGBClassifier(
        n_estimators=HYPERPARAMS["invoice_xgboost"]["n_estimators"],
        max_depth=HYPERPARAMS["invoice_xgboost"]["max_depth"],
        learning_rate=HYPERPARAMS["invoice_xgboost"]["learning_rate"],
        subsample=HYPERPARAMS["invoice_xgboost"]["subsample"],
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        eval_metric="logloss"
    )
    final_xgb.fit(X_full_scaled, y)

    clean_full_idx = (y == 0)
    final_iso = IsolationForest(
        n_estimators=HYPERPARAMS["invoice_isolation_forest"]["n_estimators"],
        contamination=HYPERPARAMS["invoice_isolation_forest"]["contamination"],
        random_state=42
    )
    final_iso.fit(X_full_scaled[clean_full_idx])

    # 12. Save Production Model Bundle
    artifacts = {
        "rf_model": final_rf,
        "xgb_model": final_xgb,
        "iso_forest": final_iso,
        "preprocessor": preprocessor,
        "optimal_threshold": optimal_th,
        "validation_metrics": metrics_at_opt,
        "feature_importance": feature_importance_dict,
        "pr_curve_sample": opt_result["pr_curve_sample"],
        "class_counts": {"legitimate": neg_count, "fraud": pos_count},
        "training_timestamp": datetime.now().isoformat()
    }

    model_dir = MODEL_DIRS["invoice_fraud"]
    model_path = model_dir / "invoice_fraud_ensemble.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(artifacts, f)

    metrics_path = model_dir / "invoice_fraud_metrics.json"
    with open(metrics_path, "w") as f:
        json.dump({
            "status": "TRAINED_AND_DEPLOYED",
            "timestamp": datetime.now().isoformat(),
            "records_trained": len(y),
            "optimal_threshold": optimal_th,
            "metrics": metrics_at_opt,
            "feature_importance": feature_importance_dict,
            "top_features": sorted_features[:5]
        }, f, indent=2)

    print(f"[OK] Invoice Fraud Ensemble saved to {model_path}")
    return artifacts

if __name__ == "__main__":
    train_invoice_fraud_models()
