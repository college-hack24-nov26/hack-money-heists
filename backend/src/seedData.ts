export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ANALYST' | 'AUDITOR';
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  gstin: string;
  pan: string;
  state: string;
  currency: string;
  safetyThreshold: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'INFLOW' | 'OUTFLOW';
  balance: number;
  counterparty: string;
  status: 'SETTLED' | 'PENDING';
}

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: 'Operating' | 'Administrative' | 'Marketing' | 'Employee' | 'Procurement' | 'Subscriptions';
  description: string;
  amount: number;
  status: 'Approved' | 'Flagged' | 'Audited';
  paymentMethod: string;
  referenceNo: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  vendor_name: string;
  gstin: string;
  bank_account: string;
  bank_ifsc: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  gst_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'PENDING' | 'VERIFIED' | 'FLAGGED' | 'PAID';
  risk_score: number;
  risk_classification: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk';
  anomalies_detected: string[];
  supporting_evidence: string[];
  recommended_verification_steps: string[];
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  gstin: string;
  email: string;
  phone: string;
  outstandingBalance: number;
  daysSalesOutstanding: number;
  riskProfile: 'Low' | 'Medium' | 'High';
  creditLimit: number;
  lastPaymentDate: string;
  contractStatus: 'Active' | 'Under Review' | 'Renewed';
}

export interface ProfitLeakageFinding {
  id: string;
  category: string;
  title: string;
  department: string;
  vendor: string;
  frequency: string;
  estimated_financial_impact: number;
  potential_annual_savings: number;
  leakage_type: 'Verified Loss' | 'Suspected Leakage' | 'Estimated Savings';
  historical_comparison: string;
  explanation: string;
  suggested_action: string;
}

export const SEED_ORGANIZATION: Organization = {
  id: "org-apex-01",
  name: "Apex Technologies Pvt Ltd",
  industry: "Enterprise B2B Software & Automation",
  gstin: "27AAPFU0939F1ZV",
  pan: "AAPFU0939F",
  state: "Karnataka",
  currency: "INR (₹)",
  safetyThreshold: 500000.0
};

export const SEED_USERS: User[] = [
  {
    id: "usr-01",
    name: "Vikramaditya Sharma",
    email: "vikram@apextech.in",
    role: "ADMIN",
    organizationId: "org-apex-01"
  },
  {
    id: "usr-02",
    name: "Ananya Deshmukh",
    email: "ananya.ca@apextech.in",
    role: "ANALYST",
    organizationId: "org-apex-01"
  }
];

export const SEED_CLIENTS: Client[] = [
  {
    id: "cli-01",
    name: "Tata Digital Solutions",
    companyName: "Tata Digital Pvt Ltd",
    gstin: "27AAACT2727Q1ZW",
    email: "finance@tatadigital.example.com",
    phone: "+91 22 6665 8282",
    outstandingBalance: 420000.0,
    daysSalesOutstanding: 24,
    riskProfile: "Low",
    creditLimit: 1500000.0,
    lastPaymentDate: "2026-10-25",
    contractStatus: "Active"
  },
  {
    id: "cli-02",
    name: "Reliance Retail Supply",
    companyName: "Reliance Retail Ltd",
    gstin: "24AABCR4918C1ZZ",
    email: "billing@relretail.example.com",
    phone: "+91 22 3555 5000",
    outstandingBalance: 680000.0,
    daysSalesOutstanding: 38,
    riskProfile: "Medium",
    creditLimit: 2000000.0,
    lastPaymentDate: "2026-10-18",
    contractStatus: "Active"
  },
  {
    id: "cli-03",
    name: "Zenith Global Logistics",
    companyName: "Zenith Logistics India",
    gstin: "07AAACZ1122D1ZP",
    email: "accounts@zenithlogistics.example.com",
    phone: "+91 11 4111 8800",
    outstandingBalance: 310000.0,
    daysSalesOutstanding: 74,
    riskProfile: "High",
    creditLimit: 500000.0,
    lastPaymentDate: "2026-08-14",
    contractStatus: "Under Review"
  },
  {
    id: "cli-04",
    name: "Infosys BPM Services",
    companyName: "Infosys Ltd",
    gstin: "29AAACI4398G1ZU",
    email: "vendorpay@infosys.example.com",
    phone: "+91 80 2852 0261",
    outstandingBalance: 850000.0,
    daysSalesOutstanding: 19,
    riskProfile: "Low",
    creditLimit: 2500000.0,
    lastPaymentDate: "2026-10-29",
    contractStatus: "Active"
  }
];

export const SEED_EXPENSES: Expense[] = [
  {
    id: "EXP-101",
    date: "2026-10-02",
    vendor: "AWS Cloud Infrastructure",
    category: "Operating",
    description: "Production EC2, RDS cluster & CloudFront bandwidth",
    amount: 142500.0,
    status: "Approved",
    paymentMethod: "Corporate Credit Card",
    referenceNo: "CC-AWS-9021"
  },
  {
    id: "EXP-102",
    date: "2026-10-05",
    vendor: "Koramangala Office Parks",
    category: "Operating",
    description: "Office Floor Lease Rent - October 2026",
    amount: 185000.0,
    status: "Approved",
    paymentMethod: "NEFT / Bank Transfer",
    referenceNo: "NEFT-RENT-0012"
  },
  {
    id: "EXP-103",
    date: "2026-10-08",
    vendor: "Google Workspace & GCP",
    category: "Subscriptions",
    description: "Enterprise email accounts (120 seats) & BigQuery compute",
    amount: 28400.0,
    status: "Approved",
    paymentMethod: "Corporate Card",
    referenceNo: "CC-GW-4411"
  },
  {
    id: "EXP-104",
    date: "2026-10-10",
    vendor: "Zoom Video Communications",
    category: "Subscriptions",
    description: "Overlapping Video Conferencing Licenses (Unused)",
    amount: 18500.0,
    status: "Flagged",
    paymentMethod: "Corporate Card",
    referenceNo: "CC-ZM-1192"
  },
  {
    id: "EXP-105",
    date: "2026-10-12",
    vendor: "SysMatrix Technologies",
    category: "Procurement",
    description: "Developer workstations & monitors batch 1",
    amount: 12000.0,
    status: "Approved",
    paymentMethod: "RTGS",
    referenceNo: "RTGS-SM-5511"
  },
  {
    id: "EXP-106",
    date: "2026-10-14",
    vendor: "SysMatrix Technologies",
    category: "Procurement",
    description: "Accidental Duplicate Payment for developer workstations",
    amount: 12000.0,
    status: "Flagged",
    paymentMethod: "RTGS",
    referenceNo: "RTGS-SM-5512"
  },
  {
    id: "EXP-107",
    date: "2026-10-15",
    vendor: "Apex Tech Payroll Ledger",
    category: "Employee",
    description: "Monthly staff salaries & statutory contributions",
    amount: 540000.0,
    status: "Audited",
    paymentMethod: "Corporate CMS",
    referenceNo: "CMS-SAL-1026"
  },
  {
    id: "EXP-108",
    date: "2026-10-18",
    vendor: "Google Performance Ads",
    category: "Marketing",
    description: "Search advertising campaigns for enterprise pipeline",
    amount: 75000.0,
    status: "Approved",
    paymentMethod: "Corporate Card",
    referenceNo: "CC-GADS-228"
  },
  {
    id: "EXP-109",
    date: "2026-10-21",
    vendor: "Apex Logistics & Packaging",
    category: "Procurement",
    description: "Supply chain fulfillment & packaging supplies (Rate escalated)",
    amount: 54200.0,
    status: "Flagged",
    paymentMethod: "Bank Transfer",
    referenceNo: "NEFT-ALP-339"
  },
  {
    id: "EXP-110",
    date: "2026-10-24",
    vendor: "PwC & Co Statutory Auditors",
    category: "Administrative",
    description: "Quarterly statutory audit & GST filing retainer",
    amount: 45000.0,
    status: "Approved",
    paymentMethod: "Cheque",
    referenceNo: "CHQ-889102"
  },
  {
    id: "EXP-111",
    date: "2026-10-28",
    vendor: "Slack Technologies",
    category: "Subscriptions",
    description: "Enterprise Grid Team Messaging",
    amount: 22000.0,
    status: "Approved",
    paymentMethod: "Corporate Card",
    referenceNo: "CC-SLK-4401"
  },
  {
    id: "EXP-112",
    date: "2026-10-30",
    vendor: "HDFC Payment Aggregator",
    category: "Operating",
    description: "Payment gateway interchange charges & wire commissions",
    amount: 14800.0,
    status: "Approved",
    paymentMethod: "Auto-debit",
    referenceNo: "DEB-HDFC-991"
  }
];

export const SEED_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    invoice_number: "INV-2026-0891",
    vendor_name: "AWS Cloud Infrastructure",
    gstin: "27AAPFU0939F1ZV",
    bank_account: "00021020001928",
    bank_ifsc: "HDFC0000002",
    invoice_date: "2026-10-01",
    due_date: "2026-10-15",
    subtotal: 120762.71,
    gst_rate: 18.0,
    tax_amount: 21737.29,
    total_amount: 142500.0,
    status: "PAID",
    risk_score: 8,
    risk_classification: "Low Risk",
    anomalies_detected: ["Standard Verification Passed"],
    supporting_evidence: ["Consistent monthly cloud usage", "Verified GSTIN on portal"],
    recommended_verification_steps: ["Standard two-tier approval"]
  },
  {
    id: "inv-002",
    invoice_number: "INV-2026-1104",
    vendor_name: "Apex Logistics & Packaging",
    gstin: "29AAACT9918F1ZP",
    bank_account: "50200038819201",
    bank_ifsc: "HDFC0000502",
    invoice_date: "2026-10-18",
    due_date: "2026-11-02",
    subtotal: 45932.20,
    gst_rate: 18.0,
    tax_amount: 8267.80,
    total_amount: 54200.0,
    status: "FLAGGED",
    risk_score: 58,
    risk_classification: "High Risk",
    anomalies_detected: ["Unusually High Invoice Amount", "Price Creep Without Volume Increase"],
    supporting_evidence: [
      "Rate per shipment unit increased by 23% from ₹320 to ₹394.",
      "Total is 62% above 3-month moving average for this vendor."
    ],
    recommended_verification_steps: [
      "Inspect signed purchase order for agreed milestone rate slabs.",
      "Cross-examine delivery challans to verify actual weight/distance billed."
    ]
  },
  {
    id: "inv-003",
    invoice_number: "INV-SM-2024-DUP",
    vendor_name: "SysMatrix Technologies",
    gstin: "27AABCS7712E1ZZ",
    bank_account: "91802000491823",
    bank_ifsc: "UTIB0000918",
    invoice_date: "2026-10-14",
    due_date: "2026-10-20",
    subtotal: 10169.49,
    gst_rate: 18.0,
    tax_amount: 1830.51,
    total_amount: 12000.0,
    status: "FLAGGED",
    risk_score: 88,
    risk_classification: "Critical Risk",
    anomalies_detected: [
      "Duplicate Invoice Number Detected",
      "Identical Amount & Item Match Within 48 Hours"
    ],
    supporting_evidence: [
      "PO-SM-2024 was already settled on Oct 12 under voucher RTGS-SM-5511.",
      "Identical sum ₹12,000.00 billed again with duplicate line descriptions."
    ],
    recommended_verification_steps: [
      "MANDATORY: Reject payment immediately to avoid double disbursement.",
      "Issue payment reversal notice to vendor."
    ]
  },
  {
    id: "inv-004",
    invoice_number: "INV-KOR-1026",
    vendor_name: "Koramangala Office Parks",
    gstin: "29AABCK8812D1ZR",
    bank_account: "00110200039218",
    bank_ifsc: "ICIC0000011",
    invoice_date: "2026-10-04",
    due_date: "2026-10-10",
    subtotal: 156779.66,
    gst_rate: 18.0,
    tax_amount: 28220.34,
    total_amount: 185000.0,
    status: "PAID",
    risk_score: 5,
    risk_classification: "Low Risk",
    anomalies_detected: ["Standard Verification Passed"],
    supporting_evidence: ["Consistent registered lease agreement on file"],
    recommended_verification_steps: ["Standard lease reconciliation"]
  },
  {
    id: "inv-005",
    invoice_number: "INV-SUS-7701",
    vendor_name: "NovaTech Solutions",
    gstin: "99INVALIDGST99Z9",
    bank_account: "99881122334455",
    bank_ifsc: "SBIN0000099",
    invoice_date: "2026-10-26",
    due_date: "2026-11-05",
    subtotal: 84745.76,
    gst_rate: 18.0,
    tax_amount: 15254.24,
    total_amount: 100000.0,
    status: "FLAGGED",
    risk_score: 75,
    risk_classification: "High Risk",
    anomalies_detected: [
      "Non-Compliant / Suspicious GSTIN",
      "Unregistered Vendor In Master Registry",
      "Round Number Sum"
    ],
    supporting_evidence: [
      "GSTIN failed standard 15-character statutory checksum validation.",
      "Remittance account has no prior procurement audit history."
    ],
    recommended_verification_steps: [
      "Contact vendor through independent directory listing (not invoice phone).",
      "Require vendor to submit certified GST registration certificate (REG-06)."
    ]
  }
];

export const SEED_PROFIT_LEAKAGE: ProfitLeakageFinding[] = [
  {
    id: "PLD-SUB-01",
    category: "Overlapping Software Subscriptions",
    title: "Dual Video Conferencing Platform Waste",
    department: "IT & Operations",
    vendor: "Zoom Video Communications & Google Workspace",
    frequency: "Monthly Recurring",
    estimated_financial_impact: 18500.0,
    potential_annual_savings: 222000.0,
    leakage_type: "Suspected Leakage",
    historical_comparison: "Company has paid for standalone Zoom Pro licenses alongside Google Workspace Meet for 8 months.",
    explanation: "Your business is spending approximately ₹18,500 monthly on three overlapping software subscriptions.",
    suggested_action: "Decommission standalone Zoom licenses and migrate users to Google Workspace Enterprise Meet included in base suite."
  },
  {
    id: "PLD-PRICE-02",
    category: "Supplier Price Creep",
    title: "Procurement Cost Escalation without Volume Increase",
    department: "Procurement",
    vendor: "Apex Logistics & Packaging",
    frequency: "Bi-weekly Cycles",
    estimated_financial_impact: 34200.0,
    potential_annual_savings: 410400.0,
    leakage_type: "Suspected Leakage",
    historical_comparison: "Cost per shipping package rose 23% from ₹320 to ₹394 over 60 days.",
    explanation: "Vendor procurement costs increased by 23% without a corresponding increase in purchase volume or delivery SLAs.",
    suggested_action: "Benchmark quotes against competing logistics carriers and invoke contractual most-favored-pricing clause."
  },
  {
    id: "PLD-DUP-03",
    category: "Duplicate Vendor Payments",
    title: "Double Settlement on Workstation Hardware",
    department: "Accounts Payable",
    vendor: "SysMatrix Technologies",
    frequency: "Single Event",
    estimated_financial_impact: 12000.0,
    potential_annual_savings: 12000.0,
    leakage_type: "Verified Loss",
    historical_comparison: "Duplicate debits of ₹12,000 on Oct 12 and Oct 14 against identical invoice descriptions.",
    explanation: "Repeated duplicate payments may have caused a potential cash loss of ₹12,000.",
    suggested_action: "Deduct ₹12,000 against upcoming server maintenance milestone payment."
  },
  {
    id: "PLD-REC-04",
    category: "Delayed Receivables Working Capital Drain",
    title: "Interest Drag on Overdue Debtor Balances",
    department: "Credit Control",
    vendor: "Zenith Global Logistics & Delayed B2B Portfolios",
    frequency: "Continuous Monthly Drain",
    estimated_financial_impact: 15300.0,
    potential_annual_savings: 183600.0,
    leakage_type: "Suspected Leakage",
    historical_comparison: "Zenith Logistics invoice overdue by 74 days (portfolio debtor days average: 38).",
    explanation: "Outstanding customer balances over 60 days lock up ₹3,10,000 in capital at an imputed cost of capital of 12% p.a.",
    suggested_action: "Enforce automated dunning workflows and offer a 1.5% prompt payment discount."
  },
  {
    id: "PLD-GATEWAY-05",
    category: "Excessive Transaction Charges",
    title: "Unoptimized Merchant Processing MDR",
    department: "Finance & Treasury",
    vendor: "HDFC Payment Aggregator",
    frequency: "Monthly",
    estimated_financial_impact: 5200.0,
    potential_annual_savings: 62400.0,
    leakage_type: "Estimated Savings",
    historical_comparison: "Currently paying flat 2.4% gateway fee; industry benchmark for ₹40L+ monthly volume is 1.6%.",
    explanation: "Excessive transaction charges on inward client wire settlements accumulating into unnecessary operational drag.",
    suggested_action: "Negotiate tiered MDR slab pricing or shift corporate collections to Virtual Account e-NACH."
  }
];

export const SEED_FINANCIAL_SUMMARY = {
  revenue: 4500000.0,
  cogs: 2200000.0,
  operating_expenses: 1250000.0,
  interest_expense: 65000.0,
  tax_expense: 195800.0,
  depreciation: 95000.0,
  current_assets: 3200000.0,
  inventory: 650000.0,
  cash_and_equivalents: 1850000.0,
  accounts_receivable: 700000.0,
  current_liabilities: 1600000.0,
  accounts_payable: 550000.0,
  total_debt: 1400000.0,
  total_assets: 6800000.0,
  total_equity: 3800000.0
};

