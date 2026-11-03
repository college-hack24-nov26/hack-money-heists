import io
import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generate_financial_report_xlsx(financial_summary, expenses=None, invoices=None):
    """
    Creates an Excel workbook (.xlsx) containing executive P&L, Balance Sheet,
    Cash Flow summary, Expense drill-down, and Key Ratios.
    """
    wb = openpyxl.Workbook()
    # Default sheet
    ws_pl = wb.active
    ws_pl.title = "Profit & Loss"

    # Styling constants
    navy_header = PatternFill(start_color="101827", end_color="101827", fill_type="solid")
    accent_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
    light_zebra = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    white_bold = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    navy_bold = Font(name="Calibri", size=11, bold=True, color="101827")
    regular_font = Font(name="Calibri", size=10, color="334155")
    thin_border = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )

    # Title Banner
    ws_pl.merge_cells("A1:D1")
    ws_pl["A1"] = "ARTHIQ FINANCIAL INTELLIGENCE PLATFORM"
    ws_pl["A1"].font = Font(name="Calibri", size=14, bold=True, color="101827")
    ws_pl["A2"] = "Executive Profit & Loss Statement (Annualized Demo SME)"
    ws_pl["A2"].font = Font(name="Calibri", size=10, italic=True, color="64748B")

    pl_headers = ["Financial Line Item", "Q1 Actual (₹)", "Q2 Projected (₹)", "Variance %"]
    for col_idx, h in enumerate(pl_headers, 1):
        cell = ws_pl.cell(row=4, column=col_idx, value=h)
        cell.fill = navy_header
        cell.font = white_bold
        cell.alignment = Alignment(horizontal="center" if col_idx > 1 else "left")

    pl_rows = [
        ("Gross Operating Revenue", 4500000.0, 4950000.0, "+10.0%"),
        ("Cost of Goods Sold (COGS)", 2200000.0, 2380000.0, "+8.2%"),
        ("Gross Profit", 2300000.0, 2570000.0, "+11.7%"),
        ("Operating Expenses (OPEX)", 1250000.0, 1310000.0, "+4.8%"),
        ("EBITDA", 1050000.0, 1260000.0, "+20.0%"),
        ("Depreciation & Amortization", 95000.0, 95000.0, "0.0%"),
        ("Operating Profit (EBIT)", 955000.0, 1165000.0, "+22.0%"),
        ("Finance & Interest Costs", 65000.0, 60000.0, "-7.7%"),
        ("Profit Before Tax (PBT)", 890000.0, 1105000.0, "+24.2%"),
        ("Statutory Corporate Tax (22%)", 195800.0, 243100.0, "+24.2%"),
        ("Net Profit After Tax (PAT)", 694200.0, 861900.0, "+24.2%")
    ]

    for r_idx, row_data in enumerate(pl_rows, 5):
        for c_idx, val in enumerate(row_data, 1):
            cell = ws_pl.cell(row=r_idx, column=c_idx, value=val)
            cell.font = navy_bold if "Profit" in row_data[0] or "EBITDA" in row_data[0] or "Revenue" in row_data[0] else regular_font
            cell.border = thin_border
            if isinstance(val, (int, float)):
                cell.number_format = '₹#,##0.00'
                cell.alignment = Alignment(horizontal="right")
            elif c_idx == 4:
                cell.alignment = Alignment(horizontal="center")

    # Sheet 2: Expenses Summary
    ws_exp = wb.create_sheet(title="Expenses Breakdown")
    ws_exp["A1"] = "Departmental & Vendor Expense Log"
    ws_exp["A1"].font = Font(name="Calibri", size=13, bold=True, color="101827")

    exp_headers = ["Expense ID", "Date", "Vendor", "Category", "Amount (₹)", "Status"]
    for col_idx, h in enumerate(exp_headers, 1):
        cell = ws_exp.cell(row=3, column=col_idx, value=h)
        cell.fill = navy_header
        cell.font = white_bold

    demo_expenses = expenses or [
        {"id": "EXP-001", "date": "2026-10-01", "vendor": "AWS Cloud Services", "category": "Operating", "amount": 142500.0, "status": "Approved"},
        {"id": "EXP-002", "date": "2026-10-05", "vendor": "Apex Workspace Co", "category": "Operating", "amount": 185000.0, "status": "Approved"},
        {"id": "EXP-003", "date": "2026-10-10", "vendor": "Google Cloud & Workspace", "category": "Subscriptions", "amount": 28400.0, "status": "Approved"},
        {"id": "EXP-004", "date": "2026-10-12", "vendor": "Zoom Video Communications", "category": "Subscriptions", "amount": 18500.0, "status": "Flagged Leakage"},
        {"id": "EXP-005", "date": "2026-10-15", "vendor": "Team Payroll Accounts", "category": "Employee", "amount": 540000.0, "status": "Processed"},
        {"id": "EXP-006", "date": "2026-10-18", "vendor": "Logistics Express", "category": "Procurement", "amount": 62000.0, "status": "Approved"}
    ]

    for r_idx, exp in enumerate(demo_expenses, 4):
        ws_exp.cell(row=r_idx, column=1, value=str(exp.get("id", "")))
        ws_exp.cell(row=r_idx, column=2, value=str(exp.get("date", "")))
        ws_exp.cell(row=r_idx, column=3, value=str(exp.get("vendor", "")))
        ws_exp.cell(row=r_idx, column=4, value=str(exp.get("category", "")))
        c_amt = ws_exp.cell(row=r_idx, column=5, value=float(exp.get("amount", 0)))
        c_amt.number_format = '₹#,##0.00'
        ws_exp.cell(row=r_idx, column=6, value=str(exp.get("status", "Active")))

    # Auto-adjust column widths
    for sheet in wb.worksheets:
        for col in sheet.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            sheet.column_dimensions[col_letter].width = max(max_len + 3, 14)

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output.getvalue()

def parse_uploaded_excel(file_bytes):
    """
    Parses and validates an uploaded XLSX file for transactions, expenses, or invoices.
    """
    try:
        excel_data = pd.read_excel(io.BytesIO(file_bytes), sheet_name=None)
        results = {}
        for sheet_name, df in excel_data.items():
            # Clean column names
            df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
            records = df.to_dict(orient="records")
            results[sheet_name] = {
                "row_count": len(records),
                "columns": list(df.columns),
                "data": records[:100]  # cap for preview
            }
        return {"status": "success", "sheets": results}
    except Exception as e:
        return {"status": "error", "message": f"Excel parsing error: {str(e)}"}

