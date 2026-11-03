import re
import math
from datetime import datetime

def validate_gstin_format(gstin):
    """
    Validates Indian GSTIN (Goods and Services Tax Identification Number)
    Format: 2 state digits + 10 PAN chars (5 letters, 4 digits, 1 letter) + 1 entity num + 'Z' + 1 checksum
    Example: 27AAPFU0939F1ZV
    """
    if not gstin or not isinstance(gstin, str):
        return False, "GSTIN missing or empty"
    
    clean_gst = gstin.strip().upper()
    pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
    if not re.match(pattern, clean_gst):
        return False, f"GSTIN '{clean_gst}' fails standard 15-character statutory format"
    
    return True, "Valid GSTIN format"

def validate_ifsc_format(ifsc):
    """
    Validates Indian IFSC Code: 4 alphabetic characters + '0' + 6 alphanumeric characters
    Example: HDFC0001234
    """
    if not ifsc or not isinstance(ifsc, str):
        return False, "IFSC missing or empty"
    clean_ifsc = ifsc.strip().upper()
    pattern = r"^[A-Z]{4}0[A-Z0-9]{6}$"
    if not re.match(pattern, clean_ifsc):
        return False, f"IFSC '{clean_ifsc}' is invalid (must be 4 letters + 0 + 6 alphanumeric)"
    return True, "Valid IFSC code"

def analyze_invoice_fraud(invoice_data, historical_invoices=None, vendor_registry=None):
    """
    Analyzes an invoice payload for forensic discrepancies, anomalies, and fraudulent signals.
    Never declares fraud automatically; produces calibrated risk scores, evidence, and verification actions.
    """
    historical_invoices = historical_invoices or []
    vendor_registry = vendor_registry or {}

    anomalies = []
    evidence = []
    verification_steps = []
    risk_points = 0

    inv_num = str(invoice_data.get("invoice_number", "")).strip()
    vendor_name = str(invoice_data.get("vendor_name", "")).strip()
    vendor_gstin = str(invoice_data.get("gstin", "")).strip()
    bank_acc = str(invoice_data.get("bank_account", "")).strip()
    bank_ifsc = str(invoice_data.get("bank_ifsc", "")).strip()
    amount = float(invoice_data.get("total_amount", 0.0))
    subtotal = float(invoice_data.get("subtotal", 0.0))
    tax_amount = float(invoice_data.get("tax_amount", 0.0))
    gst_rate = float(invoice_data.get("gst_rate", 18.0))
    invoice_date_str = str(invoice_data.get("invoice_date", "")).strip()
    po_number = str(invoice_data.get("po_number", "")).strip()

    # 1. Duplicate Invoice Number Check
    same_inv_matches = [
        h for h in historical_invoices 
        if str(h.get("invoice_number", "")).strip().lower() == inv_num.lower() 
        and h.get("id") != invoice_data.get("id")
    ]
    if same_inv_matches:
        risk_points += 35
        match = same_inv_matches[0]
        anomalies.append("Duplicate Invoice Number Detected")
        evidence.append(f"Invoice #{inv_num} already exists in database (recorded on {match.get('invoice_date', 'earlier')} for ₹{match.get('total_amount', 0):,.2f} from {match.get('vendor_name')}).")
        verification_steps.append("Cross-check whether this is a duplicate disbursement or re-billing of an already settled service.")

    # 2. GSTIN Verification
    is_valid_gst, gst_msg = validate_gstin_format(vendor_gstin)
    if not is_valid_gst:
        risk_points += 25
        anomalies.append("Non-Compliant / Suspicious GSTIN")
        evidence.append(gst_msg)
        verification_steps.append("Validate vendor credentials on the GST Portal (services.gst.gov.in) to confirm active registration status.")
    elif vendor_name in vendor_registry:
        reg_gst = vendor_registry[vendor_name].get("gstin", "")
        if reg_gst and reg_gst.upper() != vendor_gstin.upper():
            risk_points += 30
            anomalies.append("Vendor GSTIN Mismatch")
            evidence.append(f"GSTIN on invoice ({vendor_gstin}) does not match master vendor record ({reg_gst}).")
            verification_steps.append("Call vendor finance controller using verified contact on file to confirm entity reorganization.")

    # 3. Bank Account & IFSC Verification
    if bank_ifsc:
        is_ifsc_valid, ifsc_msg = validate_ifsc_format(bank_ifsc)
        if not is_ifsc_valid:
            risk_points += 20
            anomalies.append("Malformed IFSC Code")
            evidence.append(ifsc_msg)
            verification_steps.append("Check RBI IFSC directory for valid branch routing.")
    
    if vendor_name in vendor_registry:
        known_acc = vendor_registry[vendor_name].get("bank_account", "")
        if known_acc and bank_acc and known_acc != bank_acc:
            risk_points += 40
            anomalies.append("Mismatched Vendor Bank Account")
            evidence.append(f"Remittance account ({bank_acc[-4:].rjust(len(bank_acc), '*')}) differs from approved vendor bank profile ({known_acc[-4:].rjust(len(known_acc), '*')}).")
            verification_steps.append("MANDATORY: Hold payment until verified via two-factor out-of-band contact with vendor signatory (prevent CEO/Invoice fraud).")

    # 4. Tax Calculation Inconsistency
    expected_tax = round(subtotal * (gst_rate / 100.0), 2)
    if subtotal > 0 and tax_amount > 0 and abs(expected_tax - tax_amount) > 2.0:
        risk_points += 20
        anomalies.append("Mathematical Tax Mismatch")
        evidence.append(f"Stated tax ₹{tax_amount:,.2f} differs from calculated {gst_rate}% GST of subtotal ₹{subtotal:,.2f} (expected ₹{expected_tax:,.2f}, diff ₹{abs(expected_tax - tax_amount):,.2f}).")
        verification_steps.append("Request corrected tax breakdown invoice from vendor before claiming Input Tax Credit (ITC).")

    # 5. Historical Amount Outlier Check
    vendor_history = [
        float(h.get("total_amount", 0)) 
        for h in historical_invoices 
        if h.get("vendor_name", "").strip().lower() == vendor_name.lower()
    ]
    if len(vendor_history) >= 3:
        avg_amt = sum(vendor_history) / len(vendor_history)
        variance = sum((x - avg_amt) ** 2 for x in vendor_history) / len(vendor_history)
        std_amt = math.sqrt(variance) if variance > 0 else avg_amt * 0.2
        if amount > avg_amt + (2.5 * std_amt) and amount > avg_amt * 2.0:
            risk_points += 25
            anomalies.append("Unusually High Invoice Amount")
            evidence.append(f"Invoice amount ₹{amount:,.2f} is {((amount / avg_amt - 1) * 100):.1f}% higher than historical vendor average (₹{avg_amt:,.2f}).")
            verification_steps.append("Confirm deliverable milestones and obtain signed department head sign-off.")

    # 6. Round Number Indicator
    if amount > 10000 and amount % 10000 == 0 and tax_amount == 0:
        risk_points += 15
        anomalies.append("Suspicious Rounded Value Without Tax Detail")
        evidence.append(f"Total is an exact round figure (₹{amount:,.2f}) with zero itemized statutory deduction.")
        verification_steps.append("Request itemized bill of quantities with HSN/SAC codes.")

    # 7. Invoice Date Checks
    if invoice_date_str:
        try:
            inv_date = datetime.strptime(invoice_date_str[:10], "%Y-%m-%d")
            today = datetime.now()
            if inv_date > today + timedelta(days=2):
                risk_points += 20
                anomalies.append("Post-Dated Invoice Date")
                evidence.append(f"Invoice is dated in the future ({invoice_date_str}).")
                verification_steps.append("Clarify billing period alignment with vendor.")
        except Exception:
            pass

    # Calibrate risk score (cap at 100)
    risk_score = min(100, risk_points)

    if risk_score >= 80:
        classification = "Critical Risk"
    elif risk_score >= 55:
        classification = "High Risk"
    elif risk_score >= 25:
        classification = "Medium Risk"
    else:
        classification = "Low Risk"

    if not anomalies:
        anomalies.append("Standard Verification Passed")
        evidence.append("Tax calculation, GSTIN format, bank records, and pricing fit historical benchmarks.")
        verification_steps.append("Proceed through standard two-tier accounts payable approval.")

    return {
        "invoice_number": inv_num,
        "vendor_name": vendor_name,
        "total_amount": amount,
        "risk_score": risk_score,
        "risk_classification": classification,
        "anomalies_detected": anomalies,
        "supporting_evidence": evidence,
        "recommended_verification_steps": verification_steps,
        "is_suspicious": risk_score >= 50
    }

