"""
ARTHIQ ML Evaluation Metrics
Standardized performance evaluation for classification, regression, time-series forecasting, and anomaly detection.
"""

import numpy as np
from typing import Dict, Any, List
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    silhouette_score,
    confusion_matrix
)

def evaluate_classification(y_true, y_pred, y_prob=None) -> Dict[str, Any]:
    """Computes comprehensive classification metrics."""
    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    
    auc = None
    if y_prob is not None and len(np.unique(y_true)) > 1:
        try:
            auc = float(roc_auc_score(y_true, y_prob))
        except Exception:
            auc = None
            
    cm = confusion_matrix(y_true, y_pred).tolist()
    
    return {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4) if auc is not None else "N/A (Single class)",
        "confusion_matrix": cm
    }

def evaluate_regression(y_true, y_pred) -> Dict[str, Any]:
    """Computes regression and forecasting metrics: MAE, RMSE, MAPE, R2."""
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)
    
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    
    # MAPE with zero protection
    non_zeros = y_true != 0
    if np.any(non_zeros):
        mape = float(np.mean(np.abs((y_true[non_zeros] - y_pred[non_zeros]) / y_true[non_zeros])) * 100)
    else:
        mape = 0.0
        
    try:
        r2 = float(r2_score(y_true, y_pred))
    except Exception:
        r2 = 0.0
        
    return {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "mape_percent": round(mape, 2),
        "r2_score": round(r2, 4)
    }

def evaluate_clustering(X, labels) -> Dict[str, Any]:
    """Computes clustering quality metrics (Silhouette score)."""
    unique_labels = len(set(labels))
    if unique_labels < 2 or unique_labels >= len(X):
        return {"silhouette_score": -1.0, "status": "Insufficient clusters for silhouette"}
    
    sil = float(silhouette_score(X, labels))
    return {
        "silhouette_score": round(sil, 4),
        "cluster_count": unique_labels
    }

