import os
import sys
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io

# Ensure paths
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from forecasting.cashflow_model import forecast_cashflow
from fraud_detection.invoice_fraud import analyze_invoice_fraud
from expense_analysis.expense_analyzer import analyze_expenses
from leakage_detection.leakage_analyzer import detect_profit_leakage
from risk_engine.risk_scorer import calculate_financial_health_and_risk, calculate_financial_ratios
from excel_engine.excel_processor import generate_financial_report_xlsx, parse_uploaded_excel

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    report_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'training_report.json')
    trained = os.path.exists(report_file)
    return jsonify({
        "status": "online",
        "service": "ARTHIQ Finance Intelligence Engine",
        "version": "1.0.0",
        "models_loaded": [
            "isolation_forest_anomaly_detector",
            "cashflow_holt_seasonality",
            "invoice_fraud_forensics",
            "profit_leakage_detector",
            "risk_radar_engine"
        ],
        "trained_on_7_month_dataset": trained
    })

@app.route('/internal/models/status', methods=['GET'])
def model_status():
    report_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'training_report.json')
    if os.path.exists(report_file):
        with open(report_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    return jsonify({
        "status": "ready",
        "model": "IsolationForest & Heuristic Baselines",
        "note": "Initial baseline active"
    })

@app.route('/internal/models/train', methods=['POST'])
def trigger_training():
    try:
        from train_models import train_expense_models
        res = train_expense_models()
        return jsonify(res)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/internal/analyze/cashflow', methods=['POST'])
def handle_cashflow():
    data = request.get_json(force=True) or {}
    history = data.get("history", [])
    current_balance = float(data.get("current_balance", 1850000.0))
    horizon_days = int(data.get("horizon_days", 30))
    safety_threshold = float(data.get("safety_threshold", 500000.0))

    result = forecast_cashflow(
        history_data=history,
        current_balance=current_balance,
        horizon_days=horizon_days,
        safety_threshold=safety_threshold
    )
    return jsonify(result)

@app.route('/internal/analyze/invoice', methods=['POST'])
def handle_invoice():
    data = request.get_json(force=True) or {}
    invoice_data = data.get("invoice", {})
    history = data.get("historical_invoices", [])
    vendor_registry = data.get("vendor_registry", {})

    result = analyze_invoice_fraud(
        invoice_data=invoice_data,
        historical_invoices=history,
        vendor_registry=vendor_registry
    )
    return jsonify(result)

@app.route('/internal/analyze/expenses', methods=['POST'])
def handle_expenses():
    data = request.get_json(force=True) or {}
    expenses_list = data.get("expenses", [])
    total_revenue = float(data.get("total_revenue", 4500000.0))
    historical_prev = data.get("historical_previous_expenses")

    result = analyze_expenses(
        expenses_list=expenses_list,
        total_revenue=total_revenue,
        historical_previous_expenses=historical_prev
    )
    return jsonify(result)

@app.route('/internal/analyze/leakage', methods=['POST'])
def handle_leakage():
    data = request.get_json(force=True) or {}
    expenses = data.get("expenses", [])
    invoices = data.get("invoices", [])
    receivables = data.get("receivables", [])
    vendors = data.get("vendors", [])

    result = detect_profit_leakage(
        expenses=expenses,
        invoices=invoices,
        receivables=receivables,
        vendors=vendors
    )
    return jsonify(result)

@app.route('/internal/analyze/risk', methods=['POST'])
def handle_risk():
    data = request.get_json(force=True) or {}
    financial_data = data.get("financial_data", {})
    invoices_summary = data.get("invoices_summary")
    customer_concentration = data.get("customer_concentration")

    result = calculate_financial_health_and_risk(
        financial_data=financial_data,
        invoices_summary=invoices_summary,
        customer_concentration=customer_concentration
    )
    return jsonify(result)

@app.route('/internal/analyze/financial-ratios', methods=['POST'])
def handle_ratios():
    data = request.get_json(force=True) or {}
    financial_data = data.get("financial_data", {})
    result = calculate_financial_ratios(financial_data)
    return jsonify({"status": "success", "ratios": result})

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
    print(f"[*] ARTHIQ Finance Intelligence Engine starting on port {port}...")
    app.run(host='127.0.0.1', port=port, debug=False)

