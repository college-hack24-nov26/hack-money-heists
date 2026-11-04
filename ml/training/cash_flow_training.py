"""
ARTHIQ SME Cash Flow Multi-Model Training Pipeline
Trains and validates ARIMA/SARIMA, Prophet, XGBoost Regressor, and ETS (Holt-Winters).
Executes ADF stationarity testing, residual diagnostics, time-series backtesting,
and inverse-error weighting. Serializes model artifacts to ml/models/cash_flow/.
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

# Ensure project root in python path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from xgboost import XGBRegressor

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except Exception:
    PROPHET_AVAILABLE = False

from ml.config.settings import MODEL_DIRS, HYPERPARAMS
from ml.preprocessing.cash_flow_preprocessing import CashFlowPreprocessor
from ml.evaluation.cash_flow_evaluation import CashFlowEvaluator, compute_cashflow_metrics

def train_cash_flow_models() -> Dict[str, Any]:
    print("[*] Starting ARTHIQ SME Cash Flow Training Pipeline...")

    # 1. Load and aggregate historical daily transactions
    preprocessor = CashFlowPreprocessor(safety_threshold=500000.0)
    daily_df = preprocessor.load_and_aggregate_daily(initial_opening_cash=1850000.0)
    featured_df = preprocessor.engineer_features(daily_df)
    train_df, val_df = preprocessor.split_chronological(featured_df, test_ratio=0.20)

    print(f"[*] Aggregated Daily Records: {len(featured_df)} days (Train: {len(train_df)}, Val: {len(val_df)})")

    # 2. Stationarity Analysis (Augmented Dickey-Fuller Test)
    train_series = train_df["net_cash_flow"].values
    adf_result = adfuller(train_series, autolag="AIC")
    adf_stat, p_value, used_lag, nobs, crit_vals, ic_best = adf_result
    is_stationary = (p_value < 0.05)

    stationarity_report = {
        "adf_statistic": round(float(adf_stat), 4),
        "p_value": round(float(p_value), 6),
        "is_stationary": bool(is_stationary),
        "differencing_required": int(0 if is_stationary else 1),
        "critical_values": {k: round(float(v), 4) for k, v in crit_vals.items()}
    }
    print(f"[*] ADF Stationarity Test: stat={adf_stat:.4f}, p={p_value:.6f} -> Stationary: {is_stationary}")

    # 3. Model 1: ARIMA(p,d,q)
    d_order = 0 if is_stationary else 1
    arima_order = (1, d_order, 1)
    try:
        arima_fit = ARIMA(train_series, order=arima_order).fit()
        arima_val_pred = arima_fit.forecast(steps=len(val_df))
    except Exception as e:
        print(f"[!] ARIMA fallback due to: {e}")
        arima_fit = None
        arima_val_pred = np.full(len(val_df), float(np.mean(train_series)))

    # 4. Model 2: Prophet
    prophet_model = None
    if PROPHET_AVAILABLE:
        try:
            prophet_df = train_df[["date", "net_cash_flow"]].rename(columns={"date": "ds", "net_cash_flow": "y"})
            prophet_model = Prophet(
                yearly_seasonality=False,
                weekly_seasonality=True,
                daily_seasonality=False,
                interval_width=0.95
            )
            prophet_model.fit(prophet_df)
            future = prophet_model.make_future_dataframe(periods=len(val_df), freq="D")
            forecast_prophet = prophet_model.predict(future)
            prophet_val_pred = forecast_prophet.iloc[-len(val_df):]["yhat"].values
        except Exception as e:
            print(f"[!] Prophet training error: {e}")
            prophet_model = None
            prophet_val_pred = np.full(len(val_df), float(np.mean(train_series)))
    else:
        prophet_val_pred = np.full(len(val_df), float(np.mean(train_series)))

    # 5. Model 3: XGBoost Regressor (Lag & Rolling Financial Features)
    feature_cols = [c for c in preprocessor.feature_columns if c in train_df.columns]
    X_train = train_df[feature_cols].values
    y_train = train_df["net_cash_flow"].values
    X_val = val_df[feature_cols].values
    y_val = val_df["net_cash_flow"].values

    xgb_model = XGBRegressor(
        n_estimators=HYPERPARAMS["cashflow_xgboost"]["n_estimators"],
        max_depth=HYPERPARAMS["cashflow_xgboost"]["max_depth"],
        learning_rate=HYPERPARAMS["cashflow_xgboost"]["learning_rate"],
        random_state=HYPERPARAMS["cashflow_xgboost"]["random_state"]
    )
    xgb_model.fit(X_train, y_train)
    xgb_val_pred = xgb_model.predict(X_val)

    # 6. Model 4: ETS (Holt-Winters Exponential Smoothing)
    try:
        ets_fit = ExponentialSmoothing(
            train_series,
            trend="add",
            damped_trend=True,
            initialization_method="estimated"
        ).fit()
        ets_val_pred = ets_fit.forecast(steps=len(val_df))
    except Exception as e:
        print(f"[!] ETS fallback: {e}")
        ets_fit = None
        ets_val_pred = np.full(len(val_df), float(np.mean(train_series)))

    # 7. Model Evaluation & Inverse-WAPE Optimal Weight Calculation
    evaluator = CashFlowEvaluator()
    candidate_preds = {
        "arima": np.asarray(arima_val_pred),
        "xgboost": np.asarray(xgb_val_pred),
        "ets": np.asarray(ets_val_pred)
    }
    if PROPHET_AVAILABLE and prophet_model is not None:
        candidate_preds["prophet"] = np.asarray(prophet_val_pred)

    eval_result = evaluator.evaluate_model_predictions(
        actuals=y_val,
        model_predictions=candidate_preds,
        y_train_history=train_series
    )
    optimal_weights = eval_result["optimal_weights"]

    # Compute Ensemble Out-of-Sample Performance
    ensemble_val_pred = np.zeros(len(val_df))
    for mod_name, w in optimal_weights.items():
        ensemble_val_pred += w * candidate_preds[mod_name]

    ensemble_metrics = compute_cashflow_metrics(y_val, ensemble_val_pred, y_train_history=train_series)
    eval_result["model_metrics"]["ensemble"] = ensemble_metrics

    print(f"[*] Optimal Ensemble Weights: {optimal_weights}")
    print(f"[*] Ensemble Validation: WAPE={ensemble_metrics['wape']}, RMSE={ensemble_metrics['rmse']}, MAE={ensemble_metrics['mae']}")

    # 8. Re-fit Models on 100% of Historical Data for Production Inferences
    full_series = featured_df["net_cash_flow"].values
    full_X = featured_df[feature_cols].values
    full_y = full_series

    # Production Refits
    try:
        final_arima = ARIMA(full_series, order=arima_order).fit()
    except Exception:
        final_arima = arima_fit

    final_prophet = None
    if PROPHET_AVAILABLE:
        try:
            full_prophet_df = featured_df[["date", "net_cash_flow"]].rename(columns={"date": "ds", "net_cash_flow": "y"})
            final_prophet = Prophet(weekly_seasonality=True, interval_width=0.95)
            final_prophet.fit(full_prophet_df)
        except Exception:
            final_prophet = prophet_model

    final_xgb = XGBRegressor(
        n_estimators=HYPERPARAMS["cashflow_xgboost"]["n_estimators"],
        max_depth=HYPERPARAMS["cashflow_xgboost"]["max_depth"],
        learning_rate=HYPERPARAMS["cashflow_xgboost"]["learning_rate"],
        random_state=HYPERPARAMS["cashflow_xgboost"]["random_state"]
    )
    final_xgb.fit(full_X, full_y)

    try:
        final_ets = ExponentialSmoothing(
            full_series,
            trend="add",
            damped_trend=True,
            initialization_method="estimated"
        ).fit()
    except Exception:
        final_ets = ets_fit

    # 9. Serialize Production Model Artifact
    artifacts = {
        "arima_model": final_arima,
        "prophet_model": final_prophet,
        "xgb_model": final_xgb,
        "ets_model": final_ets,
        "optimal_weights": optimal_weights,
        "feature_columns": feature_cols,
        "stationarity_report": stationarity_report,
        "validation_metrics": eval_result["model_metrics"],
        "historical_daily_df": featured_df,
        "last_closing_balance": float(featured_df["closing_balance"].iloc[-1]),
        "safety_threshold": 500000.0,
        "training_timestamp": datetime.now().isoformat()
    }

    model_dir = MODEL_DIRS["cash_flow"]
    model_path = model_dir / "cashflow_ensemble.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(artifacts, f)

    metrics_path = model_dir / "cashflow_metrics.json"
    with open(metrics_path, "w") as f:
        json.dump({
            "status": "TRAINED_AND_DEPLOYED",
            "timestamp": datetime.now().isoformat(),
            "records_trained": len(featured_df),
            "stationarity": stationarity_report,
            "weights": optimal_weights,
            "validation_metrics": eval_result["model_metrics"]
        }, f, indent=2)

    print(f"[OK] Cash Flow Ensemble saved to {model_path}")
    return artifacts

if __name__ == "__main__":
    train_cash_flow_models()
