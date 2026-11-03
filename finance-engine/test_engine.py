import sys
import os
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from forecasting.cashflow_model import forecast_cashflow
from fraud_detection.invoice_fraud import analyze_invoice_fraud
from expense_analysis.expense_analyzer import analyze_expenses
from leakage_detection.leakage_analyzer import detect_profit_leakage
from risk_engine.risk_scorer import calculate_financial_health_and_risk

def test_all():
    print("Testing Cashflow Forecasting...")
    cf = forecast_cashflow([], current_balance=1800000, horizon_days=30)
    assert cf['status'] == 'success'
    assert len(cf['forecast']) == 30
    print(f" Cashflow forecast passed: {len(cf['forecast'])} days projected, runway={cf['runway_days']} days.")

    print("\nTesting Invoice Fraud Detector...")
    test_inv = {
        "invoice_number": "INV-2026-999",
        "vendor_name": "Apex Cloud Systems",
        "gstin": "INVALID_GST",
        "total_amount": 200000.0,
        "subtotal": 150000.0,
        "tax_amount": 10000.0,
        "gst_rate": 18.0
    }
    fraud = analyze_invoice_fraud(test_inv)
    assert fraud['risk_score'] > 30
    assert len(fraud['anomalies_detected']) > 0
    print(f" Invoice fraud detection passed: risk score={fraud['risk_score']}, level={fraud['risk_classification']}.")

    print("\nTesting Expense Analyzer...")
    test_exps = [
        {"id": 1, "vendor": "AWS", "description": "Cloud hosting", "amount": 120000, "date": "2026-10-01"},
        {"id": 2, "vendor": "AWS", "description": "Duplicate debit", "amount": 120000, "date": "2026-10-02"},
        {"id": 3, "vendor": "Slack", "description": "Monthly chat", "amount": 15000, "date": "2026-10-05"},
        {"id": 4, "vendor": "Slack", "description": "Monthly chat", "amount": 15000, "date": "2026-11-05"},
    ]
    exp = analyze_expenses(test_exps)
    assert len(exp['duplicates']) > 0
    print(f" Expense analyzer passed: duplicates detected={len(exp['duplicates'])}, subscriptions={len(exp['recurring_subscriptions'])}.")

    print("\nTesting Profit Leakage Detector (PLD)...")
    leak = detect_profit_leakage(test_exps)
    assert leak['status'] == 'success'
    assert leak['total_identified_leakage'] > 0
    print(f" PLD passed: identified leakage=₹{leak['total_identified_leakage']:,.2f}, annual savings=₹{leak['total_potential_annual_savings']:,.2f}.")

    print("\nTesting Risk Engine & Financial Health...")
    risk = calculate_financial_health_and_risk({"revenue": 5000000, "cogs": 2500000, "operating_expenses": 1300000})
    assert risk['status'] == 'success'
    assert 0 <= risk['financial_health_score'] <= 100
    print(f" Risk engine passed: health score={risk['financial_health_score']}, status={risk['health_band']}.")

    print("\n ALL FINANCE ENGINE TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_all()
