"""
ARTHIQ Unified ML Inference Service
Loads serialized model artifacts and serves real-time predictions for all 8 platform modules.
Integrates high-precision Cash Flow Predictor and Invoice Fraud Forensics services.
"""

import os
import sys
import json
import joblib
from pathlib import Path
from typing import Dict, Any, List

# Ensure project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from ml.config.settings import MODEL_DIRS, MODELS_ROOT
from ml.prediction.assistant_rag import FinancialAssistantRAG
from ml.prediction.cash_flow_predictor import cash_flow_predictor
from ml.prediction.invoice_fraud_predictor import invoice_fraud_predictor

class MLInferenceService:
    def __init__(self):
        self.models = {}
        self.rag_assistant = FinancialAssistantRAG()
        self.cash_flow_predictor = cash_flow_predictor
        self.invoice_fraud_predictor = invoice_fraud_predictor
        self.load_all_models()

    def load_all_models(self):
        """Loads all serialized model artifacts from ml/models/."""
        paths = {
            "expense_analyzer": MODEL_DIRS["expense_analyzer"] / "expense_detector_ensemble.pkl",
            "invoice_fraud": MODEL_DIRS["invoice_fraud"] / "invoice_fraud_ensemble.pkl",
            "cash_flow": MODEL_DIRS["cash_flow"] / "cashflow_ensemble.pkl",
            "profit_leakage": MODEL_DIRS["profit_leakage"] / "profit_leakage_engine.pkl",
            "financial_risk": MODEL_DIRS["financial_risk"] / "risk_scorer_model.pkl",
            "procurement": MODEL_DIRS["procurement"] / "procurement_optimizer.pkl",
            "analytics": MODEL_DIRS["analytics"] / "financial_analytics_engine.pkl"
        }

        for name, p in paths.items():
            if p.exists():
                try:
                    self.models[name] = joblib.load(p)
                except Exception as e:
                    print(f"[!] Warning: Failed loading model {name}: {e}")
            else:
                print(f"[!] Model artifact not found at {p}")

        # Reload predictors
        self.cash_flow_predictor.load_model()
        self.invoice_fraud_predictor.load_model()

    def analyze_expenses(self, expenses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if "expense_analyzer" in self.models:
            return self.models["expense_analyzer"].predict_anomalies(expenses)
        from ml.algorithms.expense_anomalies import ExpenseAnomalyDetector
        return ExpenseAnomalyDetector().predict_anomalies(expenses)

    def predict_invoice_fraud(
        self,
        invoice: Dict[str, Any],
        history: List[Dict[str, Any]] = None,
        statutory_valid: bool = True
    ) -> Dict[str, Any]:
        return self.invoice_fraud_predictor.predict_invoice_risk(invoice, history)

    def forecast_cashflow(
        self,
        historical_series=None,
        horizon_days: int = 30,
        current_balance: float = 1850000.0,
        safety_threshold: float = 500000.0,
        scenario_overrides: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        return self.cash_flow_predictor.forecast_cash_flow(
            horizon_days=horizon_days,
            current_balance=current_balance,
            safety_threshold=safety_threshold,
            scenario_overrides=scenario_overrides
        )

    def detect_profit_leakage(
        self,
        transactions: List[Dict[str, Any]],
        monthly_opex: float = 2500000.0
    ) -> Dict[str, Any]:
        if "profit_leakage" in self.models:
            return self.models["profit_leakage"].scan_ledger_anomalies(transactions, monthly_opex=monthly_opex)
        from ml.algorithms.leakage_detector import ProfitLeakageEngine
        return ProfitLeakageEngine().scan_ledger_anomalies(transactions, monthly_opex=monthly_opex)

    def assess_financial_risk(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        if "financial_risk" in self.models:
            return self.models["financial_risk"].assess_financial_risk(metrics)
        from ml.algorithms.financial_risk import FinancialRiskScorer
        return FinancialRiskScorer().assess_financial_risk(metrics)

    def optimize_procurement(self, vendors: List[Dict[str, Any]]) -> Dict[str, Any]:
        if "procurement" in self.models:
            return self.models["procurement"].fit_and_cluster(vendors)
        from ml.algorithms.procurement_optimizer import ProcurementOptimizer
        return ProcurementOptimizer().fit_and_cluster(vendors)

    def predict_analytics(self, monthly_summary_df) -> Dict[str, Any]:
        if "analytics" in self.models:
            return self.models["analytics"].fit_trends(monthly_summary_df)
        from ml.algorithms.analytics_engine import FinancialAnalyticsEngine
        return FinancialAnalyticsEngine().fit_trends(monthly_summary_df)

    def query_assistant(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        if context:
            self.rag_assistant.update_context(context)
        return self.rag_assistant.process_query(query)

    def get_models_status(self) -> Dict[str, Any]:
        report_file = MODELS_ROOT / "training_report.json"
        if report_file.exists():
            with open(report_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "status": "ready",
            "models_loaded": list(self.models.keys())
        }

# Global Singleton Service
ml_service = MLInferenceService()
