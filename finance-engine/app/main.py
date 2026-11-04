import os
import sys
import json
import time
from pathlib import Path
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import pandas as pd
import numpy as np

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ml.prediction.inference_service import ml_service
from ml.pipelines.training_pipeline import run_full_training_pipeline
from ml.training.cash_flow_training import train_cash_flow_models
from ml.training.invoice_fraud_training import train_invoice_fraud_models
from ml.preprocessing.cash_flow_preprocessing import CashFlowPreprocessor
from ml.preprocessing.invoice_preprocessing import verify_statutory_gstin, InvoicePreprocessor
from ml.monitoring.model_monitor import monitor
from ml.config.settings import MODELS_ROOT, MODEL_DIRS, DATASETS

# Legacy internal handlers for backward compatibility
from forecasting.cashflow_model import forecast_cashflow
from fraud_detection.invoice_fraud import analyze_invoice_fraud
from expense_analysis.expense_analyzer import analyze_expenses
from leakage_detection.leakage_analyzer import detect_profit_leakage
from risk_engine.risk_scorer import calculate_financial_health_and_risk, calculate_financial_ratios
from excel_engine.excel_processor import generate_financial_report_xlsx, parse_uploaded_excel

app = Flask(__name__)
CORS(app)

# -------------------------------------------------------------
# System & Model Telemetry Endpoints
# -------------------------------------------------------------
@app.route('/health', methods=['GET'])
def health_check():
    report_file = MODELS_ROOT / "training_report.json"
    trained = report_file.exists()
    return jsonify({
        "status": "online",
        "service": "ARTHIQ Multi-Algorithm Finance Intelligence Engine",
        "version": "1.0.0-enterprise",
        "models_active": [
            "Isolation Forest + Local Outlier Factor (Expenses)",
            "Random Forest + XGBoost + Isolation Forest (Invoice Fraud)",
            "ARIMA + Prophet + XGBoost Regressor + ETS (Cash Flow)",
            "Rule Engine Matrix + Isolation Forest (Profit Leakage)",
            "Logistic Regression + Risk Radar (Financial Risk)",
            "K-Means Clustering + Ridge Regression (Procurement)",
            "Trend Regression + 10 Financial Ratios (Analytics)",
            "RAG + Autonomous Tool Calling (ARTHIQ AI Assistant)"
        ],
        "trained_on_7_month_dataset": trained
    })

@app.route('/api/ml/models/status', methods=['GET'])
@app.route('/internal/models/status', methods=['GET'])
def get_model_status():
    report = ml_service.get_models_status()
    return jsonify(report)

@app.route('/api/ml/models/metrics', methods=['GET'])
def get_model_metrics():
    report = ml_service.get_models_status()
    metrics = {k: v for k, v in report.get("modules", {}).items()}
    return jsonify({
        "status": "success",
        "timestamp": report.get("pipeline_execution_timestamp"),
        "metrics": metrics
    })

@app.route('/api/ml/models/versions', methods=['GET'])
def get_model_versions():
    return jsonify({
        "platform_version": "1.0.0-enterprise",
        "algorithms": {
            "expense_analyzer": "v1.2 (IForest + LOF)",
            "invoice_fraud": "v2.0 (XGBoost 3.4.1 + Calibrated RF + IForest)",
            "cash_flow": "v2.1 (ARIMA + Prophet 1.5.0 + XGBoost + ETS)",
            "profit_leakage": "v1.4 (10 Configurable Rules + IForest)",
            "financial_risk": "v1.1 (Logistic Regression + Risk Radar)",
            "procurement": "v1.0 (K-Means k=3 + Ridge)",
            "analytics": "v1.0 (Linear/Polynomial + 10 Ratios)",
            "assistant": "v2.0 (TF-IDF Vector RAG + Tool Dispatcher)"
        }
    })

@app.route('/api/ml/models/train', methods=['POST'])
@app.route('/internal/models/train', methods=['POST'])
def trigger_training():
    try:
        report = run_full_training_pipeline()
        ml_service.load_all_models()
        return jsonify({
            "status": "success",
            "message": "Full-stack ML model training completed successfully",
            "report": report
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# -------------------------------------------------------------
# Engine 1: Advanced SME Cash Flow Prediction APIs
# -------------------------------------------------------------
@app.route('/api/cash-flow/forecast', methods=['POST'])
@app.route('/api/ml/cash-flow/forecast', methods=['POST'])
@app.route('/internal/analyze/cashflow', methods=['POST'])
def handle_cashflow_forecast():
    t0 = time.time()
    data = request.get_json(force=True) or {}
    horizon_days = int(data.get("horizon_days", 30))
    current_balance = float(data.get("current_balance") or data.get("opening_balance") or 1850000.0)
    safety_threshold = float(data.get("safety_threshold", 500000.0))
    history = data.get("history", [])

    result = ml_service.forecast_cashflow(
        horizon_days=horizon_days,
        current_balance=current_balance,
        safety_threshold=safety_threshold,
        scenario_overrides=data
    )
    duration = (time.time() - t0) * 1000
    monitor.log_inference("cash_flow", len(history) or horizon_days, duration, {"horizon_days": horizon_days})
    return jsonify(result)

@app.route('/api/cash-flow/train', methods=['POST'])
def handle_cashflow_train():
    try:
        artifacts = train_cash_flow_models()
        ml_service.cash_flow_predictor.load_model()
        return jsonify({
            "status": "success",
            "message": "SME Cash Flow multi-model ensemble retrained successfully",
            "records_trained": len(artifacts.get("historical_daily_df", [])),
            "optimal_weights": artifacts.get("optimal_weights", {}),
            "validation_metrics": artifacts.get("validation_metrics", {})
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/cash-flow/history', methods=['GET'])
def handle_cashflow_history():
    try:
        preprocessor = CashFlowPreprocessor()
        daily = preprocessor.load_and_aggregate_daily(initial_opening_cash=1850000.0)
        records = daily.tail(90).to_dict(orient="records")
        for r in records:
            r["date"] = r["date"].strftime("%Y-%m-%d")
        return jsonify({
            "status": "success",
            "total_days": len(records),
            "history": records
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/cash-flow/summary', methods=['GET'])
def handle_cashflow_summary():
    try:
        preprocessor = CashFlowPreprocessor()
        daily = preprocessor.load_and_aggregate_daily(initial_opening_cash=1850000.0)
        current_bal = float(daily["closing_balance"].iloc[-1])
        recent_30 = daily.tail(30)
        inflow_30 = float(recent_30["total_inflow"].sum())
        outflow_30 = float(recent_30["total_outflow"].sum())
        net_30 = inflow_30 - outflow_30
        avg_burn = float(recent_30[recent_30["net_cash_flow"] < 0]["net_cash_flow"].abs().mean() or 0.0)

        runway_months = round(current_bal / (avg_burn * 30.0), 1) if avg_burn > 100.0 else 99.0

        return jsonify({
            "status": "success",
            "opening_balance": 1850000.0,
            "current_balance": round(current_bal, 2),
            "safety_floor": 500000.0,
            "safety_buffer_available": max(0.0, round(current_bal - 500000.0, 2)),
            "monthly_inflow": round(inflow_30, 2),
            "monthly_outflow": round(outflow_30, 2),
            "monthly_net": round(net_30, 2),
            "average_daily_burn": round(avg_burn, 2),
            "cash_runway_months": runway_months,
            "health_status": "Healthy Liquidity Buffer" if current_bal > 500000.0 else "Liquidity Alert"
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/cash-flow/alerts', methods=['GET'])
def handle_cashflow_alerts():
    forecast_res = ml_service.forecast_cashflow(horizon_days=30)
    return jsonify({
        "status": "success",
        "risk_category": forecast_res.get("risk_assessment", {}).get("category", "Low Risk"),
        "risk_reason": forecast_res.get("risk_assessment", {}).get("reason", ""),
        "alerts": forecast_res.get("alerts", []),
        "runway_months": forecast_res.get("runway_months", 99.0)
    })

@app.route('/api/cash-flow/model-performance', methods=['GET'])
def handle_cashflow_model_performance():
    metrics_path = MODEL_DIRS["cash_flow"] / "cashflow_metrics.json"
    if metrics_path.exists():
        with open(metrics_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)
    return jsonify({"status": "warning", "message": "Model performance metrics not generated yet"})

@app.route('/api/cash-flow/evaluate', methods=['POST'])
def handle_cashflow_evaluate():
    data = request.get_json(force=True) or {}
    series = data.get("series", [])
    if len(series) < 7:
        return jsonify({"error": "Insufficient test series: Minimum 7 daily records required for backtesting"}), 400
    from ml.evaluation.cash_flow_evaluation import compute_cashflow_metrics
    actuals = np.array([float(s.get("actual") or s.get("net_flow") or 0.0) for s in series])
    preds = np.array([float(s.get("predicted") or 0.0) for s in series])
    metrics = compute_cashflow_metrics(actuals, preds)
    return jsonify({"status": "success", "metrics": metrics})

# -------------------------------------------------------------
# Engine 2: Intelligent Invoice Fraud Forensics APIs
# -------------------------------------------------------------
@app.route('/api/invoices/analyze', methods=['POST'])
@app.route('/api/ml/invoices/predict', methods=['POST'])
@app.route('/internal/analyze/invoice', methods=['POST'])
def handle_invoice_prediction():
    t0 = time.time()
    data = request.get_json(force=True) or {}
    invoice = data.get("invoice") or data
    history = data.get("historical_invoices", [])

    result = ml_service.predict_invoice_fraud(invoice, history)
    duration = (time.time() - t0) * 1000

    monitor.log_inference("invoice_fraud", 1, duration, {"risk_score": result.get("risk_score", 0)})
    return jsonify({
        "status": "success",
        **result
    })

@app.route('/api/invoices/validate-gstin', methods=['POST'])
def handle_validate_gstin():
    data = request.get_json(force=True) or {}
    gstin = data.get("gstin", "")
    is_valid, reason, breakdown = verify_statutory_gstin(gstin)
    return jsonify({
        "status": "success",
        "gstin": gstin,
        "is_valid": is_valid,
        "reason": reason,
        "breakdown": breakdown
    })

@app.route('/api/invoices/detect-duplicates', methods=['POST'])
def handle_detect_duplicates():
    data = request.get_json(force=True) or {}
    invoices_list = data.get("invoices", [])
    preprocessor = InvoicePreprocessor()
    df = pd.DataFrame(invoices_list)
    if df.empty:
        return jsonify({"status": "success", "duplicate_count": 0, "duplicates": []})

    processed_df = preprocessor.load_and_standardize_invoices(df)
    dup_df = preprocessor.detect_deterministic_duplicates(processed_df)
    duplicates = dup_df[(dup_df["is_duplicate_number"] == 1) | (dup_df["is_duplicate_amount"] == 1)].to_dict(orient="records")

    return jsonify({
        "status": "success",
        "duplicate_count": len(duplicates),
        "duplicates": duplicates
    })

@app.route('/api/invoices/train-model', methods=['POST'])
def handle_invoices_train():
    try:
        artifacts = train_invoice_fraud_models()
        ml_service.invoice_fraud_predictor.load_model()
        return jsonify({
            "status": "success",
            "message": "Invoice Fraud classification models retrained successfully",
            "optimal_threshold": artifacts.get("optimal_threshold"),
            "validation_metrics": artifacts.get("validation_metrics", {}),
            "top_features": list(artifacts.get("feature_importance", {}).items())[:5]
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/invoices/model-performance', methods=['GET'])
def handle_invoices_model_performance():
    metrics_path = MODEL_DIRS["invoice_fraud"] / "invoice_fraud_metrics.json"
    if metrics_path.exists():
        with open(metrics_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)
    return jsonify({"status": "warning", "message": "Invoice model performance metrics not generated yet"})

@app.route('/api/invoices/evaluate', methods=['POST'])
def handle_invoices_evaluate():
    data = request.get_json(force=True) or {}
    records = data.get("invoices", [])
    if len(records) < 5:
        return jsonify({"error": "Minimum 5 labeled invoice records required for evaluation"}), 400
    from ml.evaluation.invoice_fraud_evaluation import evaluate_fraud_classifier
    y_true = np.array([int(r.get("is_fraud", 0)) for r in records])
    y_prob = np.array([float(r.get("predicted_prob", 0.2)) for r in records])
    metrics = evaluate_fraud_classifier(y_true, y_prob)
    return jsonify({"status": "success", "metrics": metrics})

# -------------------------------------------------------------
# Module 1: Smart Expense Analyzer (IForest + LOF)
# -------------------------------------------------------------
@app.route('/api/ml/expenses/analyze', methods=['POST'])
@app.route('/internal/analyze/expenses', methods=['POST'])
def handle_expenses_analysis():
    t0 = time.time()
    data = request.get_json(force=True) or {}
    expenses_list = data.get("expenses", [])

    findings = ml_service.analyze_expenses(expenses_list)
    duration = (time.time() - t0) * 1000

    outliers = [f for f in findings if f.get("is_outlier")]
    monitor.log_inference("expense_analyzer", len(expenses_list), duration, {"outliers_found": len(outliers)})

    return jsonify({
        "status": "success",
        "total_analyzed": len(expenses_list),
        "anomalies_detected": len(outliers),
        "results": findings
    })

# -------------------------------------------------------------
# Module 4: Profit Leakage Detector (10 Rules + IForest)
# -------------------------------------------------------------
@app.route('/api/ml/profit-leakage/scan', methods=['POST'])
@app.route('/internal/analyze/leakage', methods=['POST'])
def handle_profit_leakage_scan():
    t0 = time.time()
    data = request.get_json(force=True) or {}
    transactions = data.get("transactions") or data.get("expenses") or []
    monthly_opex = float(data.get("monthly_opex", 2500000.0))

    result = ml_service.detect_profit_leakage(transactions, monthly_opex=monthly_opex)
    duration = (time.time() - t0) * 1000
    monitor.log_inference("profit_leakage", len(transactions), duration, {"findings": result.get("anomalies_count", 0)})
    return jsonify(result)

# -------------------------------------------------------------
# Module 5: Financial Risk Management (Logistic Regression + IForest)
# -------------------------------------------------------------
@app.route('/api/ml/financial-risk/assess', methods=['POST'])
@app.route('/internal/analyze/risk', methods=['POST'])
def handle_financial_risk_assessment():
    t0 = time.time()
    data = request.get_json(force=True) or {}
    metrics = data.get("financial_data") or data.get("metrics") or {}

    result = ml_service.assess_financial_risk(metrics)
    duration = (time.time() - t0) * 1000
    monitor.log_inference("financial_risk", 1, duration, {"health_score": result.get("financial_health_score")})
    return jsonify(result)

# -------------------------------------------------------------
# Module 6: Procurement Optimization (K-Means + Ridge Regression)
# -------------------------------------------------------------
@app.route('/api/ml/procurement/optimize', methods=['POST'])
def handle_procurement_optimization():
    t0 = time.time()
    data = request.get_json(force=True) or {}
    vendors = data.get("vendors", [])

    result = ml_service.optimize_procurement(vendors)
    duration = (time.time() - t0) * 1000
    monitor.log_inference("procurement", len(vendors), duration, {"clusters": result.get("clusters_count")})
    return jsonify(result)

# -------------------------------------------------------------
# Module 7: Financial Analytics & BI (Trends + 10 Ratios)
# -------------------------------------------------------------
@app.route('/api/ml/analytics/predict', methods=['POST'])
@app.route('/internal/analyze/financial-ratios', methods=['POST'])
def handle_analytics_prediction():
    t0 = time.time()
    data = request.get_json(force=True) or {}
    financial_data = data.get("financial_data") or data.get("summary") or {}

    from ml.algorithms.analytics_engine import FinancialAnalyticsEngine
    ratios = FinancialAnalyticsEngine.calculate_ten_financial_ratios(financial_data)
    duration = (time.time() - t0) * 1000
    monitor.log_inference("analytics", 1, duration, {"ratios_calculated": 10})
    return jsonify({
        "status": "success",
        "ten_financial_ratios": ratios,
        "summary": financial_data
    })

# -------------------------------------------------------------
# Module 8: ARTHIQ AI Assistant (RAG + Autonomous Tool Calling)
# -------------------------------------------------------------
@app.route('/api/assistant/query', methods=['POST'])
def handle_assistant_query():
    t0 = time.time()
    data = request.get_json(force=True) or {}
    query = data.get("query") or data.get("message") or "Provide financial health summary"
    context = data.get("context", {})

    result = ml_service.query_assistant(query, context)
    duration = (time.time() - t0) * 1000
    monitor.log_inference("assistant", 1, duration, {"tool_called": result.get("tool_invoked")})
    return jsonify(result)

# -------------------------------------------------------------
# Excel Financial Modeling Engine
# -------------------------------------------------------------
@app.route('/internal/excel/export', methods=['POST'])
def handle_excel_export():
    data = request.get_json(force=True) or {}
    financial_summary = data.get("summary", {})
    expenses = data.get("expenses", [])
    invoices = data.get("invoices", [])

    file_bytes = generate_financial_report_xlsx(financial_summary, expenses, invoices)
    return send_file(
        io.BytesIO(file_bytes),
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name="ARTHIQ_Financial_Report.xlsx"
    )

@app.route('/internal/excel/process', methods=['POST'])
def handle_excel_process():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400
    file = request.files['file']
    file_bytes = file.read()
    result = parse_uploaded_excel(file_bytes)
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"[*] ARTHIQ Multi-Algorithm Finance Intelligence Engine starting on port {port}...")
    app.run(host='127.0.0.1', port=port, debug=False)
