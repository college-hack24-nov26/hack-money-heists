"""
ARTHIQ High-Precision Invoice Fraud Model Evaluation & Threshold Optimization
Evaluates Random Forest, XGBoost, Isolation Forest, and Composite Forensic Risk models.
Computes PR-AUC, ROC-AUC, Precision, Recall, F1-Score, Confusion Matrix, and Brier Calibration Score.
Performs threshold tuning to maximize precision without sacrificing acceptable fraud recall.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    brier_score_loss,
    precision_recall_curve
)

def evaluate_fraud_classifier(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    threshold: float = 0.50
) -> Dict[str, Any]:
    """
    Computes rigorous classification metrics at a given decision threshold.
    """
    y_t = np.asarray(y_true, dtype=int)
    y_p = np.asarray(y_prob, dtype=float)
    y_pred = (y_p >= threshold).astype(int)

    cm = confusion_matrix(y_t, y_pred, labels=[0, 1])
    tn, fp, fn, tp = cm.ravel()

    precision = float(precision_score(y_t, y_pred, zero_division=0))
    recall = float(recall_score(y_t, y_pred, zero_division=0))
    f1 = float(f1_score(y_t, y_pred, zero_division=0))

    try:
        roc_auc = float(roc_auc_score(y_t, y_p))
    except Exception:
        roc_auc = 0.50

    try:
        pr_auc = float(average_precision_score(y_t, y_p))
    except Exception:
        pr_auc = float(np.mean(y_t))

    brier = float(brier_score_loss(y_t, y_p))
    fpr = float(fp / (fp + tn + 1e-5))
    fnr = float(fn / (fn + tp + 1e-5))

    return {
        "threshold": round(float(threshold), 3),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
        "pr_auc": round(pr_auc, 4),
        "roc_auc": round(roc_auc, 4),
        "brier_score": round(brier, 4),
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp)
        },
        "false_positive_rate": round(fpr, 4),
        "false_negative_rate": round(fnr, 4)
    }

class InvoiceFraudEvaluator:
    def __init__(self, target_precision: float = 0.90, min_acceptable_recall: float = 0.75):
        self.target_precision = target_precision
        self.min_acceptable_recall = min_acceptable_recall

    def optimize_operating_threshold(
        self,
        y_val: np.ndarray,
        y_val_prob: np.ndarray
    ) -> Dict[str, Any]:
        """
        Sweeps decision threshold across validation probabilities to identify
        the threshold that achieves target precision with acceptable recall.
        Falls back to maximum F1 threshold if target precision is unattainable.
        """
        y_t = np.asarray(y_val, dtype=int)
        y_p = np.asarray(y_val_prob, dtype=float)

        thresholds = np.linspace(0.10, 0.90, 41)
        candidates = []

        for th in thresholds:
            m = evaluate_fraud_classifier(y_t, y_p, threshold=th)
            candidates.append(m)

        # 1. Filter candidates meeting target precision & min recall
        constrained = [
            c for c in candidates
            if c["precision"] >= self.target_precision and c["recall"] >= self.min_acceptable_recall
        ]

        if constrained:
            # Pick highest recall among those meeting target precision
            optimal = max(constrained, key=lambda c: (c["recall"], c["f1_score"]))
            selection_rule = f"Target Precision >= {self.target_precision * 100:.0f}% Satisfied"
        else:
            # Fallback to maximum F1-score candidate
            optimal = max(candidates, key=lambda c: c["f1_score"])
            selection_rule = "Maximum F1-Score (Target precision constraint relaxed)"

        # Calculate PR curve points for frontend visualizer
        precisions, recalls, pr_thresholds = precision_recall_curve(y_t, y_p)
        pr_curve_sampled = [
            {"recall": round(float(recalls[i]), 3), "precision": round(float(precisions[i]), 3)}
            for i in range(0, len(precisions), max(1, len(precisions) // 10))
        ]

        return {
            "optimal_threshold": optimal["threshold"],
            "selection_rule": selection_rule,
            "metrics_at_optimal": optimal,
            "pr_curve_sample": pr_curve_sampled,
            "all_threshold_candidates": candidates[:5]
        }

