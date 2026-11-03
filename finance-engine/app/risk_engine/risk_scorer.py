def calculate_financial_ratios(financial_data):
    """
    Chartered Accountant level financial ratio analysis engine.
    Computes Liquidity, Profitability, Efficiency, Leverage ratios and Business KPIs.
    """
    revenue = float(financial_data.get("revenue", 4500000.0))
    cogs = float(financial_data.get("cogs", 2200000.0))
    operating_expenses = float(financial_data.get("operating_expenses", 1250000.0))
    interest_expense = float(financial_data.get("interest_expense", 65000.0))
    tax_expense = float(financial_data.get("tax_expense", 185000.0))
    depreciation_amortization = float(financial_data.get("depreciation", 95000.0))

    current_assets = float(financial_data.get("current_assets", 3200000.0))
    inventory = float(financial_data.get("inventory", 650000.0))
    cash_and_equivalents = float(financial_data.get("cash_and_equivalents", 1850000.0))
    accounts_receivable = float(financial_data.get("accounts_receivable", 700000.0))

    current_liabilities = float(financial_data.get("current_liabilities", 1600000.0))
    accounts_payable = float(financial_data.get("accounts_payable", 550000.0))
    total_debt = float(financial_data.get("total_debt", 1400000.0))
    total_assets = float(financial_data.get("total_assets", 6800000.0))
    total_equity = float(financial_data.get("total_equity", 3800000.0))

    # Profitability calculations
    gross_profit = revenue - cogs
    operating_income = gross_profit - operating_expenses  # EBIT
    ebitda = operating_income + depreciation_amortization
    net_profit = operating_income - interest_expense - tax_expense

    gross_profit_margin = round((gross_profit / revenue) * 100, 2) if revenue > 0 else 0.0
    operating_profit_margin = round((operating_income / revenue) * 100, 2) if revenue > 0 else 0.0
    net_profit_margin = round((net_profit / revenue) * 100, 2) if revenue > 0 else 0.0
    roa = round((net_profit / total_assets) * 100, 2) if total_assets > 0 else 0.0
    roe = round((net_profit / total_equity) * 100, 2) if total_equity > 0 else 0.0

    # Liquidity calculations
    current_ratio = round(current_assets / current_liabilities, 2) if current_liabilities > 0 else 0.0
    quick_assets = current_assets - inventory
    quick_ratio = round(quick_assets / current_liabilities, 2) if current_liabilities > 0 else 0.0
    cash_ratio = round(cash_and_equivalents / current_liabilities, 2) if current_liabilities > 0 else 0.0
    working_capital = round(current_assets - current_liabilities, 2)

    # Efficiency calculations
    inventory_turnover = round(cogs / inventory, 2) if inventory > 0 else 0.0
    receivables_turnover = round(revenue / accounts_receivable, 2) if accounts_receivable > 0 else 0.0
    days_sales_outstanding = round(365 / receivables_turnover, 1) if receivables_turnover > 0 else 0.0
    payables_turnover = round(cogs / accounts_payable, 2) if accounts_payable > 0 else 0.0
    days_payables_outstanding = round(365 / payables_turnover, 1) if payables_turnover > 0 else 0.0
    asset_turnover = round(revenue / total_assets, 2) if total_assets > 0 else 0.0

    # Leverage calculations
    debt_to_equity = round(total_debt / total_equity, 2) if total_equity > 0 else 0.0
    interest_coverage_ratio = round(operating_income / interest_expense, 2) if interest_expense > 0 else 999.0

    # Business KPIs
    monthly_burn_rate = round(operating_expenses / 3.0, 2)
    cash_runway_months = round(cash_and_equivalents / monthly_burn_rate, 1) if monthly_burn_rate > 0 else 999.0
    opex_ratio = round((operating_expenses / revenue) * 100, 2) if revenue > 0 else 0.0

    # Break-even point (Fixed Costs / Gross Margin %)
    fixed_costs = operating_expenses * 0.75
    cm_ratio = gross_profit_margin / 100.0
    breakeven_revenue = round(fixed_costs / cm_ratio, 2) if cm_ratio > 0 else 0.0

    return {
        "statement_summary": {
            "revenue": revenue,
            "cogs": cogs,
            "gross_profit": gross_profit,
            "operating_expenses": operating_expenses,
            "operating_income_ebit": operating_income,
            "ebitda": ebitda,
            "interest_expense": interest_expense,
            "tax_expense": tax_expense,
            "net_profit": net_profit
        },
        "liquidity_ratios": {
            "current_ratio": {"value": current_ratio, "benchmark": "1.5 - 2.0", "status": "Healthy" if current_ratio >= 1.5 else "Watch"},
            "quick_ratio": {"value": quick_ratio, "benchmark": ">= 1.0", "status": "Healthy" if quick_ratio >= 1.0 else "Warning"},
            "cash_ratio": {"value": cash_ratio, "benchmark": ">= 0.5", "status": "Strong" if cash_ratio >= 0.5 else "Moderate"},
            "working_capital": {"value": working_capital, "status": "Positive" if working_capital > 0 else "Deficit"}
        },
        "profitability_ratios": {
            "gross_profit_margin": {"value": gross_profit_margin, "unit": "%", "benchmark": "40% - 60%", "status": "Healthy"},
            "operating_profit_margin": {"value": operating_profit_margin, "unit": "%", "benchmark": "15% - 25%", "status": "Healthy"},
            "net_profit_margin": {"value": net_profit_margin, "unit": "%", "benchmark": "10% - 20%", "status": "Solid"},
            "return_on_assets_roa": {"value": roa, "unit": "%", "benchmark": "> 8%", "status": "Good"},
            "return_on_equity_roe": {"value": roe, "unit": "%", "benchmark": "> 15%", "status": "Strong"}
        },
        "efficiency_ratios": {
            "inventory_turnover": {"value": inventory_turnover, "benchmark": "4x - 8x"},
            "receivables_turnover": {"value": receivables_turnover, "days_sales_outstanding_dso": days_sales_outstanding},
            "payables_turnover": {"value": payables_turnover, "days_payables_outstanding_dpo": days_payables_outstanding},
            "asset_turnover": {"value": asset_turnover, "benchmark": "0.8 - 1.5"}
        },
        "leverage_ratios": {
            "debt_to_equity": {"value": debt_to_equity, "benchmark": "< 1.5", "status": "Conservative" if debt_to_equity < 1.0 else "Moderate"},
            "interest_coverage_ratio": {"value": interest_coverage_ratio, "benchmark": "> 3.0", "status": "Safe" if interest_coverage_ratio > 3.0 else "Tight"}
        },
        "business_kpis": {
            "ebitda": ebitda,
            "operating_expense_ratio": opex_ratio,
            "monthly_burn_rate": monthly_burn_rate,
            "cash_runway_months": cash_runway_months,
            "breakeven_point_revenue": breakeven_revenue
        }
    }

def calculate_financial_health_and_risk(financial_data, invoices_summary=None, customer_concentration=None):
    """
    Dynamic financial risk monitoring engine:
    Overall Financial Health Score (0-100) and multi-factor risk radar.
    """
    ratios = calculate_financial_ratios(financial_data)
    
    liq = ratios['liquidity_ratios']
    prof = ratios['profitability_ratios']
    lev = ratios['leverage_ratios']
    kpis = ratios['business_kpis']

    # Health Scoring (out of 100)
    health_points = 0
    alerts = []

    # 1. Liquidity Health (max 25 pts)
    cr = liq['current_ratio']['value']
    runway = kpis['cash_runway_months']
    if cr >= 1.75:
        health_points += 15
    elif cr >= 1.2:
        health_points += 10
    else:
        health_points += 4
        alerts.append({
            "dimension": "Liquidity",
            "severity": "CRITICAL",
            "message": f"Current ratio ({cr}) is below recommended working capital threshold (1.5).",
            "mitigation": "Accelerate debtor collections and negotiate 15-day supplier credit terms extension."
        })

    if runway >= 6.0:
        health_points += 10
    elif runway >= 3.0:
        health_points += 7
    else:
        health_points += 2
        alerts.append({
            "dimension": "Liquidity",
            "severity": "WARNING",
            "message": f"Cash runway is tight at {runway} months of operational burn.",
            "mitigation": "Establish an emergency bank overdraft / working capital facility."
        })

    # 2. Profitability Health (max 25 pts)
    npm = prof['net_profit_margin']['value']
    if npm >= 15.0:
        health_points += 25
    elif npm >= 8.0:
        health_points += 18
    elif npm > 0:
        health_points += 10
    else:
        health_points += 0
        alerts.append({
            "dimension": "Profitability",
            "severity": "CRITICAL",
            "message": "Company is currently operating at a net deficit.",
            "mitigation": "Perform urgent unit economics audit on core revenue streams."
        })

    # 3. Leverage & Solvency (max 25 pts)
    icr = lev['interest_coverage_ratio']['value']
    dte = lev['debt_to_equity']['value']
    if icr >= 4.0 and dte <= 0.8:
        health_points += 25
    elif icr >= 2.0:
        health_points += 18
    else:
        health_points += 8
        alerts.append({
            "dimension": "Credit & Debt",
            "severity": "WARNING",
            "message": f"Interest coverage ratio ({icr}x) leaves little buffer for rising borrowing rates.",
            "mitigation": "Prioritize paying down high-interest short-term debt."
        })

    # 4. Operational & Customer Concentration (max 25 pts)
    top_customer_pct = float(customer_concentration or 28.0)
    if top_customer_pct <= 20.0:
        health_points += 25
    elif top_customer_pct <= 35.0:
        health_points += 18
    else:
        health_points += 8
        alerts.append({
            "dimension": "Revenue Concentration",
            "severity": "WARNING",
            "message": f"Top single client accounts for {top_customer_pct}% of total firm revenue.",
            "mitigation": "Diversify enterprise pipeline to prevent single-client default vulnerability."
        })

    health_score = min(100, max(0, health_points))

    # Multi-dimensional risk levels (0 - 100, where higher means higher risk)
    liquidity_risk = max(5, int((2.0 - min(2.0, cr)) * 50))
    profitability_risk = max(5, int((20.0 - min(20.0, npm)) * 4.5))
    credit_risk = max(5, int(min(100, dte * 45)))
    operational_risk = int(top_customer_pct * 1.8)
    fraud_risk = 18 if not invoices_summary else int(invoices_summary.get("suspicious_ratio", 0.15) * 100)

    return {
        "status": "success",
        "financial_health_score": health_score,
        "health_band": "Excellent" if health_score >= 80 else ("Stable" if health_score >= 60 else "Vulnerable"),
        "risk_radar": {
            "liquidity_risk": min(100, liquidity_risk),
            "profitability_risk": min(100, profitability_risk),
            "credit_risk": min(100, credit_risk),
            "operational_risk": min(100, operational_risk),
            "fraud_risk": min(100, fraud_risk)
        },
        "ratios": ratios,
        "active_alerts": alerts
    }

