"""
ARTHIQ High-Precision SME Cash Flow Feature Engineering & Preprocessing Pipeline
Calculates decimal-safe daily aggregated inflows, outflows, net cash flow, opening/closing balances,
rolling financial indicators (AR, AP, burn rate, runway), lag features, and calendar indicators.
Enforces strict chronological train/validation splitting without data leakage.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List, Optional
from datetime import datetime, timedelta
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP

from ml.config.settings import DATASETS, PROJECT_ROOT

def round_currency(val: float) -> float:
    """Decimal-safe monetary rounding to 2 decimal places."""
    try:
        d = Decimal(str(val))
        return float(d.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
    except Exception:
        return round(float(val), 2)

class CashFlowPreprocessor:
    def __init__(self, safety_threshold: float = 500000.0):
        self.safety_threshold = safety_threshold
        self.feature_columns: List[str] = []

    def load_and_aggregate_daily(
        self,
        transactions_df: Optional[pd.DataFrame] = None,
        initial_opening_cash: float = 1850000.0
    ) -> pd.DataFrame:
        """
        Aggregates transaction ledgers to a continuous daily frequency time series.
        Missing intermediate dates are filled with zero inflows/outflows.
        """
        if transactions_df is None:
            tx_path = DATASETS.get("transactions", PROJECT_ROOT / "data" / "samples" / "aarav_7m_transactions.csv")
            if not tx_path.exists():
                raise FileNotFoundError(f"Transactions dataset not found at {tx_path}")
            df = pd.read_csv(tx_path)
        else:
            df = transactions_df.copy()

        # Date normalization
        date_col = next((c for c in df.columns if c.lower() in ["date", "transaction_date", "txn_date"]), None)
        if not date_col:
            raise ValueError("No valid date column found in transactions dataset")
        df["date"] = pd.to_datetime(df[date_col], errors="coerce")
        df = df.dropna(subset=["date"]).sort_values("date")

        # Amount and Type normalization
        amt_col = next((c for c in df.columns if "amount" in c.lower()), "Amount_INR")
        df["amount"] = pd.to_numeric(df[amt_col], errors="coerce").fillna(0.0).abs()

        type_col = next((c for c in df.columns if "type" in c.lower()), "Type")
        df["type"] = df[type_col].astype(str).str.strip().str.lower()

        # Map to Inflow vs Outflow
        inflow_mask = df["type"].isin(["income", "inflow", "credit", "sales", "revenue", "collection"])
        df["inflow"] = np.where(inflow_mask, df["amount"], 0.0)
        df["outflow"] = np.where(~inflow_mask, df["amount"], 0.0)

        # Daily Aggregation
        daily = df.groupby(df["date"].dt.date).agg(
            total_inflow=("inflow", "sum"),
            total_outflow=("outflow", "sum"),
            tx_count=("amount", "count")
        ).reset_index()
        daily["date"] = pd.to_datetime(daily["date"])

        # Reindex to full continuous daily calendar
        min_date, max_date = daily["date"].min(), daily["date"].max()
        full_idx = pd.date_range(min_date, max_date, freq="D", name="date")
        daily = daily.set_index("date").reindex(full_idx, fill_value=0.0).reset_index()

        # Core Mathematical Formulation
        daily["net_cash_flow"] = daily["total_inflow"] - daily["total_outflow"]

        # Closing Balance recursive accumulation: C_t = C_{t-1} + net_t
        balances = []
        cur = initial_opening_cash
        for _, row in daily.iterrows():
            cur += float(row["net_cash_flow"])
            balances.append(round_currency(cur))
        daily["closing_balance"] = balances
        daily["opening_balance"] = daily["closing_balance"] - daily["net_cash_flow"]

        return daily

    def engineer_features(self, daily_df: pd.DataFrame) -> pd.DataFrame:
        """
        Creates rolling windows, lag features, working capital metrics, and calendar indicators.
        Enforces backward-looking shifts to prevent lookahead data leakage.
        """
        df = daily_df.copy().sort_values("date").reset_index(drop=True)

        # 1. Calendar & Cyclical Features
        df["day_of_week"] = df["date"].dt.dayofweek
        df["day_of_month"] = df["date"].dt.day
        df["month"] = df["date"].dt.month
        df["quarter"] = df["date"].dt.quarter
        df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)
        df["is_month_end"] = df["date"].dt.is_month_end.astype(int)
        df["is_payroll_period"] = df["day_of_month"].isin([1, 2, 3, 28, 29, 30, 31]).astype(int)

        # 2. Lag Features (Strictly Historical)
        for lag in [1, 2, 3, 7, 14, 21, 30]:
            df[f"net_lag_{lag}"] = df["net_cash_flow"].shift(lag)
            df[f"inflow_lag_{lag}"] = df["total_inflow"].shift(lag)
            df[f"outflow_lag_{lag}"] = df["total_outflow"].shift(lag)

        # 3. Rolling Window Aggregations (Backward looking: shift(1) to avoid target leak)
        for w in [7, 14, 30]:
            shifted_net = df["net_cash_flow"].shift(1)
            shifted_inflow = df["total_inflow"].shift(1)
            shifted_outflow = df["total_outflow"].shift(1)

            df[f"net_rolling_mean_{w}"] = shifted_net.rolling(window=w, min_periods=1).mean()
            df[f"net_rolling_std_{w}"] = shifted_net.rolling(window=w, min_periods=1).std().fillna(0.0)
            df[f"inflow_rolling_mean_{w}"] = shifted_inflow.rolling(window=w, min_periods=1).mean()
            df[f"outflow_rolling_mean_{w}"] = shifted_outflow.rolling(window=w, min_periods=1).mean()
            df[f"outflow_rolling_sum_{w}"] = shifted_outflow.rolling(window=w, min_periods=1).sum()

        # 4. Working Capital & Financial Health Indicators
        # Average Daily Net Cash Burn: mean of negative net cash flows over past 30 days
        def calc_burn(series: pd.Series) -> float:
            negatives = series[series < 0]
            return float(abs(negatives.mean())) if len(negatives) > 0 else 0.0

        shifted_net = df["net_cash_flow"].shift(1)
        df["avg_daily_burn_30d"] = shifted_net.rolling(30, min_periods=1).apply(calc_burn, raw=False).fillna(0.0)

        # Cash Runway in Months = Closing Balance / (Monthly Burn)
        monthly_burn = df["avg_daily_burn_30d"] * 30.0
        df["cash_runway_months"] = np.where(
            monthly_burn > 100.0,
            df["opening_balance"] / (monthly_burn + 1e-5),
            99.0  # Cash flow positive / self-sustaining
        )
        df["cash_runway_months"] = df["cash_runway_months"].clip(lower=0.0, upper=99.0).round(2)

        # Liquidity Shortage Flag against Safety Floor
        df["is_below_safety_floor"] = (df["opening_balance"] < self.safety_threshold).astype(int)

        # Fill remaining initial NaNs from lags with median or zeros
        feature_cols = [c for c in df.columns if c not in ["date", "net_cash_flow", "total_inflow", "total_outflow", "closing_balance"]]
        df[feature_cols] = df[feature_cols].fillna(0.0)

        self.feature_columns = feature_cols
        return df

    def split_chronological(
        self,
        df: pd.DataFrame,
        test_ratio: float = 0.20
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Splits dataset chronologically into train and test sets to prevent time leakage.
        """
        split_idx = int(len(df) * (1.0 - test_ratio))
        train_df = df.iloc[:split_idx].copy().reset_index(drop=True)
        test_df = df.iloc[split_idx:].copy().reset_index(drop=True)
        return train_df, test_df

