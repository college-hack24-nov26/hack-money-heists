import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertOctagon,
  FileCheck2,
  Receipt,
  BarChart3,
  Bot,
  Users2,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Zap,
  DollarSign,
  PieChart,
  Layers,
  Database,
  ExternalLink,
  ShieldAlert,
  Activity,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { HomeNavbar } from '../components/HomeNavbar';
import { Hero } from '../components/ui/hero-1';
import { Button } from '../components/ui/button';
import { ArthiqLogo } from '../components/ArthiqLogo';
import { InteractiveModuleShowcase } from '../components/InteractiveModuleShowcase';
import { DynamicGraphEngine } from '../components/DynamicGraphEngine';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onLoginClick?: () => void;
  onAskQuestion?: (question: string) => void;
  onLaunchModule?: (moduleId: string) => void;
}

interface CashFlowHorizonConfig {
  horizon: number;
  curvePath: string;
  areaPath: string;
  points: { x: number; y: number; val: string; day: string }[];
  runway: string;
  model: string;
  status: string;
  projectedLiquidity: string;
  bufferText: string;
}

const CASHFLOW_HORIZONS: Record<number, CashFlowHorizonConfig> = {
  7: {
    horizon: 7,
    curvePath: "M 0,90 Q 120,84 250,82 T 500,70",
    areaPath: "M 0,90 Q 120,84 250,82 T 500,70 L 500,150 L 0,150 Z",
    points: [
      { x: 0, y: 90, val: "₹18.50L", day: "Day 1" },
      { x: 140, y: 84, val: "₹18.72L", day: "Day 3" },
      { x: 280, y: 80, val: "₹18.95L", day: "Day 5" },
      { x: 500, y: 70, val: "₹19.12L", day: "Day 7" }
    ],
    runway: "15.2 Months Estimated Runway",
    model: "Multi-Model: XGBoost + ETS (Daily)",
    status: "+₹62,000 Net Inflow Projected",
    projectedLiquidity: "₹19.12 Lakh",
    bufferText: "Buffer Safe: ₹14.12L Above Floor"
  },
  30: {
    horizon: 30,
    curvePath: "M 0,90 Q 70,75 140,65 T 280,50 T 420,40 T 500,32",
    areaPath: "M 0,90 Q 70,75 140,65 T 280,50 T 420,40 T 500,32 L 500,150 L 0,150 Z",
    points: [
      { x: 0, y: 90, val: "₹18.50L", day: "Day 1" },
      { x: 140, y: 65, val: "₹19.40L", day: "Day 10" },
      { x: 280, y: 50, val: "₹20.80L", day: "Day 20" },
      { x: 500, y: 32, val: "₹22.90L", day: "Day 30" }
    ],
    runway: "14.2 Months Estimated Runway",
    model: "Multi-Model: ARIMA(1,1,1) + Prophet",
    status: "+₹4.40 Lakh Net Cash Expansion",
    projectedLiquidity: "₹22.90 Lakh",
    bufferText: "Buffer Safe: ₹17.90L Above Floor"
  },
  60: {
    horizon: 60,
    curvePath: "M 0,90 Q 90,70 190,56 T 340,40 T 500,20",
    areaPath: "M 0,90 Q 90,70 190,56 T 340,40 T 500,20 L 500,150 L 0,150 Z",
    points: [
      { x: 0, y: 90, val: "₹18.50L", day: "Day 1" },
      { x: 140, y: 56, val: "₹20.20L", day: "Day 20" },
      { x: 280, y: 40, val: "₹21.90L", day: "Day 40" },
      { x: 500, y: 20, val: "₹24.80L", day: "Day 60" }
    ],
    runway: "16.1 Months Estimated Runway",
    model: "Multi-Model: Prophet + Holt-Winters",
    status: "+₹6.30 Lakh Working Capital Surplus",
    projectedLiquidity: "₹24.80 Lakh",
    bufferText: "Buffer Safe: ₹19.80L Above Floor"
  },
  90: {
    horizon: 90,
    curvePath: "M 0,90 Q 110,65 220,50 T 370,30 T 500,10",
    areaPath: "M 0,90 Q 110,65 220,50 T 370,30 T 500,10 L 500,150 L 0,150 Z",
    points: [
      { x: 0, y: 90, val: "₹18.50L", day: "Day 1" },
      { x: 140, y: 50, val: "₹21.10L", day: "Day 30" },
      { x: 280, y: 30, val: "₹23.90L", day: "Day 60" },
      { x: 500, y: 10, val: "₹27.20L", day: "Day 90" }
    ],
    runway: "17.4 Months Estimated Runway",
    model: "Multi-Model: 4-Algorithm Ensemble (95% CI)",
    status: "+₹8.70 Lakh Cumulative Cash Growth",
    projectedLiquidity: "₹27.20 Lakh",
    bufferText: "Buffer Safe: ₹22.20L Above Floor"
  }
};

interface InvoiceCaseStudy {
  id: string;
  invoiceNumber: string;
  vendor: string;
  amount: string;
  riskBadge: string;
  riskScore: number;
  status: string;
  statusBadgeClass: string;
  anomalyTitle: string;
  anomalyDesc: string;
  verificationTitle: string;
  verificationDesc: string;
  ruleTriggered: string;
}

const INVOICE_CASE_STUDIES: InvoiceCaseStudy[] = [
  {
    id: 'dup',
    invoiceNumber: '#INV-SM-2024-DUP',
    vendor: 'SysMatrix Technologies Pvt Ltd',
    amount: '₹12,000.00',
    riskBadge: 'Critical Risk (88/100)',
    riskScore: 88,
    status: 'Payment Blocked by Controller',
    statusBadgeClass: 'bg-rose-50 text-[#E46D72] border-rose-200',
    anomalyTitle: 'Duplicate Settlement Detected:',
    anomalyDesc: 'PO-SM-2024 was already settled on Oct 12 under voucher RTGS-SM-5511. Identical amount ₹12,000 billed again with duplicate line items within 48 hours.',
    verificationTitle: 'Recommended Verification:',
    verificationDesc: 'MANDATORY: Reject payment immediately to avoid double disbursement. Issue credit reconciliation notice to vendor.',
    ruleTriggered: 'Duplicate Payment Interceptor & Hash Match'
  },
  {
    id: 'gstin',
    invoiceNumber: '#INV-NT-2024-001',
    vendor: 'NovaTech Solutions',
    amount: '₹45,500.00',
    riskBadge: 'High Risk (76/100)',
    riskScore: 76,
    status: 'Flagged for Statutory Review',
    statusBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    anomalyTitle: 'Statutory GSTIN Checksum Failed:',
    anomalyDesc: 'Reported GSTIN 27ABCDE1234F1Z9 failed statutory Modulo 36 verification algorithm. Checksum digit mismatch against Central Board of Indirect Taxes rules.',
    verificationTitle: 'Tax Compliance Action:',
    verificationDesc: 'Withhold GST Input Tax Credit (ITC) claim. Demand authenticated tax invoice with valid 15-character statutory GSTIN before settlement.',
    ruleTriggered: 'Statutory Modulo 36 Checksum Verification'
  },
  {
    id: 'clean',
    invoiceNumber: '#INV-AX-2024-009',
    vendor: 'Apex Logistics Services',
    amount: '₹28,400.00',
    riskBadge: 'Verified Clean (04/100)',
    riskScore: 4,
    status: 'Approved for Disbursement',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    anomalyTitle: 'Clean Statutory Audit:',
    anomalyDesc: '15-character GSTIN 07AABCA1234A1Z5 verified against tax registry. IFSC SBIN0001234 valid. Line items match Approved Purchase Order PO-AX-8812.',
    verificationTitle: 'Automated Authorization:',
    verificationDesc: 'Ready for scheduled batch payout. Zero risk detected by Random Forest + XGBoost forensic ensemble.',
    ruleTriggered: 'Statutory Compliance & Bank Routing Verified'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onLoginClick,
  onAskQuestion,
  onLaunchModule
}) => {
  const [calcMonthlySpend, setCalcMonthlySpend] = useState<number>(1500000);
  const [previewHorizon, setPreviewHorizon] = useState<number>(30);
  const [selectedInvoiceCase, setSelectedInvoiceCase] = useState<string>('dup');

  const estimatedAnnualSavings = Math.round(calcMonthlySpend * 0.082 * 12);
  const currentHorizonData = CASHFLOW_HORIZONS[previewHorizon] || CASHFLOW_HORIZONS[30];
  const activeInvoice = INVOICE_CASE_STUDIES.find(c => c.id === selectedInvoiceCase) || INVOICE_CASE_STUDIES[0];

  const handleModuleClick = (moduleId: string) => {
    if (onLaunchModule) {
      onLaunchModule(moduleId);
    } else {
      onLaunchDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#EDE7FF] selection:text-[#6D45CF]">
      {/* 1. HORIZONTAL STICKY NAVBAR */}
      <HomeNavbar onLaunchDashboard={onLaunchDashboard} onLoginClick={onLoginClick} />

      {/* 2. PREMIUM ARTHIQ HERO COMPONENT */}
      <section id="home">
        <Hero
          eyebrow="AI-POWERED FINANCIAL INTELLIGENCE"
          title={
            <>
              See Beyond Numbers. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">
                Think Ahead.
              </span>
            </>
          }
          subtitle="An intelligent financial platform that helps businesses understand their expenses, detect financial risks, predict cash flow and uncover hidden profit opportunities."
          primaryCtaText="Explore ARTHIQ"
          onPrimaryCtaClick={() => {
            const el = document.getElementById('platform');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          secondaryCtaText="Launch Dashboard"
          onSecondaryCtaClick={onLaunchDashboard}
          showFloatingTelemetry={true}
        />
      </section>

      {/* 3. FINANCIAL INTELLIGENCE INTRODUCTION */}
      <section id="platform" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#EDE7FF] text-[#6D45CF] border border-[#DDD3FA]">
            The New Financial Paradigm
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-black mt-4 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Accounting Shows the Past. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              ARTHIQ Predicts the Future.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-black mt-4 leading-relaxed">
            Traditional bookkeeping answers <em>what happened last month</em>. ARTHIQ behaves like a tireless, Chartered Accountant-level analyst working directly alongside you to identify where capital is leaking and how to protect liquidity.
          </p>
        </div>

        {/* 3 Value Pillars in Spacious Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            onClick={() => handleModuleClick('expenses')}
            className="p-8 rounded-3xl bg-[#F7F7FA] border border-[#E5E5EB] hover:border-[#6D45CF] transition-all hover:shadow-card cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#EDE7FF] text-[#6D45CF] flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-105 transition-transform">
              01
            </div>
            <h3 className="text-xl font-bold text-black mb-2 font-['Plus_Jakarta_Sans'] group-hover:text-[#6D45CF] transition-colors">
              Understand Why Money Goes Where It Goes
            </h3>
            <p className="text-sm text-black leading-relaxed">
              Automated categorization, machine learning outlier tracking on operating expenses, and visibility into subtle SaaS licensing sprawl across departments.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D45CF] mt-4">
              Explore Expense Analyzer <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div
            onClick={() => handleModuleClick('cashflow')}
            className="p-8 rounded-3xl bg-[#F7F7FA] border border-[#E5E5EB] hover:border-[#16A879] transition-all hover:shadow-card cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A879] flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-105 transition-transform">
              02
            </div>
            <h3 className="text-xl font-bold text-black mb-2 font-['Plus_Jakarta_Sans'] group-hover:text-[#16A879] transition-colors">
              Forecast Cash Trajectories with Certainty
            </h3>
            <p className="text-sm text-black leading-relaxed">
              Predict inflows, outflows, and working capital buffers over 7, 30, 60, and 90-day horizons with calibrated 95% uncertainty envelopes.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A879] mt-4">
              Explore Cash Flow <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div
            onClick={() => handleModuleClick('leakage')}
            className="p-8 rounded-3xl bg-[#F7F7FA] border border-[#E5E5EB] hover:border-[#E46D72] transition-all hover:shadow-card cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E46D72] flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-105 transition-transform">
              03
            </div>
            <h3 className="text-xl font-bold text-black mb-2 font-['Plus_Jakarta_Sans'] group-hover:text-[#E46D72] transition-colors">
              Plug Involuntary Value Leakages
            </h3>
            <p className="text-sm text-black leading-relaxed">
              Expose unannounced supplier price escalations (+23%), duplicate disbursements, and the silent interest drag of overdue client receivables.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E46D72] mt-4">
              Explore Profit Leakage <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </section>

      {/* 4. CORE CAPABILITIES (SYSTEM ARCHITECTURE) */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB] bg-[#F7F7FA] rounded-3xl my-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-[#6D45CF] border border-[#E5E5EB]">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black mt-4 font-['Plus_Jakarta_Sans']">
            Comprehensive Financial Intelligence Architecture
          </h2>
          <p className="text-base text-black mt-3">
            Every module is engineered as an independent but seamlessly interconnected financial system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Receipt,
              id: "expenses",
              title: "Smart Expense Analyzer",
              desc: "Automated OPEX categorization, Z-score outlier detection, and duplicate payment audits.",
              badge: "ML Outlier Engine",
            },
            {
              icon: FileCheck2,
              id: "invoices",
              title: "Invoice Fraud Detector",
              desc: "Statutory 15-char GSTIN checksum verification, IFSC routing, and risk scoring (0-100).",
              badge: "Forensics & OCR",
            },
            {
              icon: TrendingUp,
              id: "cashflow",
              title: "Cash Flow Prediction",
              desc: "Holt-Winters forecasting across 7-90 days with 95% bootstrap confidence bands.",
              badge: "Predictive AI",
            },
            {
              icon: AlertOctagon,
              id: "leakage",
              title: "Profit Leakage Detector",
              desc: "ARTHIQ's signature feature uncovering price creep, double debits, and idle subscriptions.",
              badge: "Signature PLD",
            },
            {
              icon: BarChart3,
              id: "analytics",
              title: "Financial Analytics & BI",
              desc: "Executive P&L statements, Balance Sheets, and 15+ CA ratios with real Excel XLSX export.",
              badge: "Power BI Grade",
            },
            {
              icon: Users2,
              id: "clients",
              title: "Client & Receivable Isolation",
              desc: "Centralized client directory, Days Sales Outstanding (DSO), and credit limits.",
              badge: "Multi-Tenant",
            },
            {
              icon: ShieldCheck,
              id: "risks",
              title: "Financial Risk Radar",
              desc: "Multi-factor SME stress test analyzing liquidity, profitability, credit, and fraud drag.",
              badge: "Early Warning",
            },
            {
              icon: Bot,
              id: "assistant",
              title: "ARTHIQ AI Assistant",
              desc: "Grounded conversational financial intelligence executing ledger tools with zero hallucinated math.",
              badge: "Tool-Calling AI",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E5E5EB] hover:border-[#6D45CF] transition-all hover:shadow-card flex flex-col justify-between group/card cursor-pointer"
                onClick={() => handleModuleClick(item.id)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#EDE7FF] text-[#6D45CF] flex items-center justify-center group-hover/card:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#6D45CF] px-2 py-0.5 rounded-full bg-[#EDE7FF]/60 font-mono">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-black mb-2 font-['Plus_Jakarta_Sans'] group-hover/card:text-[#6D45CF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-black leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModuleClick(item.id);
                  }}
                  className="w-full pt-4 mt-2 border-t border-[#F0F0F5] text-xs font-bold text-[#6D45CF] hover:text-[#5B37B5] flex items-center justify-between group cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Explore Feature</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 group-hover:text-[#6D45CF]">Launch →</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CASH FLOW PREDICTION SHOWCASE (MODULE 3) */}
      <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-[#6D45CF] border border-indigo-100">
              Module 3: SME Cash Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black font-['Plus_Jakarta_Sans'] leading-tight">
              Know Exactly When Cash Tightens — Weeks Before It Happens.
            </h2>
            <p className="text-base text-black leading-relaxed">
              ARTHIQ models seasonal inflow spikes, client payment cycles, and payroll cadence to project your liquidity runway and alert you when your balance risks dipping below safety reserves.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#16A879]" />
                <span className="text-black font-medium">Multi-Horizon Forecasting: 7, 30, 60, and 90 days ahead.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#16A879]" />
                <span className="text-black font-medium">Statistical 95% confidence intervals showing realistic variance.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#16A879]" />
                <span className="text-black font-medium">Automatic alerts when projected cash breaches configured safety targets.</span>
              </div>
            </div>

            <Button
              onClick={() => handleModuleClick('cashflow')}
              className="bg-[#6D45CF] hover:bg-[#5B37B5] text-white font-semibold text-xs h-11 px-6 shadow-sm gap-2 cursor-pointer"
            >
              <span>Test Cash Flow Engine</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Interactive Trajectory Visualization Preview */}
          <div
            onClick={() => handleModuleClick('cashflow')}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5EB] shadow-card hover:border-[#6D45CF]/40 transition-all cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5EB] gap-3">
              <div>
                <span className="text-xs font-bold text-black flex items-center gap-2">
                  Apex Technologies — Projected Liquidity
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-[#16A879] font-mono font-semibold">
                    {currentHorizonData.projectedLiquidity}
                  </span>
                </span>
                <p className="text-[11px] text-black mt-0.5">Base Cash: ₹18.50L | Safety Floor: ₹5.00L | {currentHorizonData.status}</p>
              </div>

              {/* Horizon Switcher */}
              <div
                className="flex items-center gap-1.5 bg-[#F7F7FA] p-1 rounded-xl border border-[#E5E5EB] text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                {[7, 30, 60, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPreviewHorizon(d)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      previewHorizon === d
                        ? 'bg-[#6D45CF] text-white shadow-xs'
                        : 'text-black hover:text-black hover:bg-neutral-200/50'
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Trajectory Chart with Reactive Multi-Horizon Data */}
            <div className="mt-6 h-56 w-full relative">
              <svg className="w-full h-full overflow-visible transition-all duration-300" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="violetArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Safety target line */}
                <line x1="0" y1="120" x2="500" y2="120" stroke="#E5A33D" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x="390" y="115" fill="#E5A33D" fontSize="10" fontWeight="600">Safety: ₹5.00L</text>

                {/* Dynamic Area Fill */}
                <path
                  d={currentHorizonData.areaPath}
                  fill="url(#violetArea)"
                  className="transition-all duration-500 ease-in-out"
                />

                {/* Dynamic Trajectory Line */}
                <path
                  d={currentHorizonData.curvePath}
                  fill="none"
                  stroke="#6D45CF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-in-out"
                />

                {/* Horizon Coordinates */}
                {currentHorizonData.points.map((pt, i) => (
                  <g key={`${previewHorizon}-${i}`} className="transition-all duration-300">
                    <circle cx={pt.x} cy={pt.y} r="4.5" fill="#6D45CF" stroke="#FFFFFF" strokeWidth="2" />
                    <text x={Math.max(10, pt.x - 20)} y={Math.max(16, pt.y - 10)} fill="#15151B" fontSize="9.5" fontWeight="700">
                      {pt.val}
                    </text>
                    <text x={Math.max(10, pt.x - 15)} y={pt.y + 16} fill="#6B7280" fontSize="8" fontWeight="500">
                      {pt.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-black pt-4 border-t border-[#F0F0F5]">
              <span className="text-[#16A879] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentHorizonData.runway}
              </span>
              <span className="text-neutral-500 font-mono text-[11px]">{currentHorizonData.model}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROFIT LEAKAGE DETECTOR SHOWCASE (MODULE 4) */}
      <section id="intelligence" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div id="simulation" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#E46D72] text-xs font-semibold border border-rose-200">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>ARTHIQ Signature Feature</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-black font-['Plus_Jakarta_Sans'] leading-tight">
              Stop Involuntary Value Erosion Across Your Ledger.
            </h2>

            <p className="text-base text-black leading-relaxed">
              Most businesses lose between <strong>6% to 12% of total operational expenditure</strong> to overlapping software subscriptions, unannounced vendor price creep, duplicate invoice settlements, and carrying costs on overdue receivables.
            </p>

            {/* Clickable Ledger Leakage Findings */}
            <div className="space-y-3 text-xs">
              <div
                onClick={() => handleModuleClick('leakage')}
                className="p-4 rounded-2xl bg-white border border-[#E5E5EB] hover:border-[#6D45CF] shadow-xs flex items-start gap-3 cursor-pointer group transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6D45CF] flex items-center justify-center flex-shrink-0 font-bold group-hover:scale-105 transition-transform">
                  PLD
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-black group-hover:text-[#6D45CF] transition-colors">
                      Redundant SaaS Licenses Identified: ₹18,500/mo
                    </h4>
                    <span className="text-[10px] text-[#6D45CF] font-semibold flex items-center gap-0.5">
                      Investigate <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                  <p className="text-black mt-0.5">Dual video conferencing licenses (Zoom Pro + Google Meet) paid simultaneously for 8 months.</p>
                </div>
              </div>

              <div
                onClick={() => handleModuleClick('leakage')}
                className="p-4 rounded-2xl bg-white border border-[#E5E5EB] hover:border-[#E46D72] shadow-xs flex items-start gap-3 cursor-pointer group transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#E46D72] flex items-center justify-center flex-shrink-0 font-bold group-hover:scale-105 transition-transform">
                  PLD
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-black group-hover:text-[#E46D72] transition-colors">
                      Unannounced Supplier Rate Creep: ₹34,200/cycle
                    </h4>
                    <span className="text-[10px] text-[#E46D72] font-semibold flex items-center gap-0.5">
                      Investigate <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                  <p className="text-black mt-0.5">Apex Logistics unit shipment price rose 23% from ₹320 to ₹394 without volume increase.</p>
                </div>
              </div>

              <div
                onClick={() => handleModuleClick('leakage')}
                className="p-4 rounded-2xl bg-white border border-[#E5E5EB] hover:border-amber-500 shadow-xs flex items-start gap-3 cursor-pointer group transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold group-hover:scale-105 transition-transform">
                  PLD
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-black group-hover:text-amber-700 transition-colors">
                      Duplicate Invoice Disbursement: ₹12,000/voucher
                    </h4>
                    <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                      Investigate <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                  <p className="text-black mt-0.5">SysMatrix PO-SM-2024 double debit intercepted before payout authorization.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F7F7FA] border border-[#E5E5EB] shadow-card space-y-6">
            <h3 className="text-xl font-bold text-black font-['Plus_Jakarta_Sans'] flex items-center justify-between">
              <span>Live Profit Leakage Estimator</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#EDE7FF] text-[#6D45CF] font-semibold font-mono">
                8.2% SME Benchmark
              </span>
            </h3>
            <p className="text-xs text-black">
              Slide to adjust your company's monthly operating expenses (OPEX):
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-black font-medium">Monthly OPEX:</span>
                <span className="text-xl font-extrabold text-black font-mono">
                  ₹{calcMonthlySpend.toLocaleString('en-IN')}
                </span>
              </div>

              <input
                type="range"
                min="500000"
                max="10000000"
                step="250000"
                value={calcMonthlySpend}
                onChange={(e) => setCalcMonthlySpend(Number(e.target.value))}
                className="w-full accent-[#6D45CF] cursor-pointer h-2 bg-neutral-200 rounded-lg"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                {[
                  { label: "₹5 Lakh", val: 500000 },
                  { label: "₹15 Lakh", val: 1500000 },
                  { label: "₹30 Lakh", val: 3000000 },
                  { label: "₹50 Lakh", val: 5000000 },
                  { label: "₹1 Crore", val: 10000000 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setCalcMonthlySpend(preset.val)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      calcMonthlySpend === preset.val
                        ? 'bg-[#6D45CF] text-white shadow-xs'
                        : 'bg-white border border-[#E5E5EB] text-black hover:border-[#6D45CF]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Recovery Result */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5EB] text-center space-y-2">
              <span className="text-xs font-semibold text-black uppercase tracking-wider block">
                Estimated Recoverable Annual Savings
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#6D45CF] font-mono block">
                ₹{estimatedAnnualSavings.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-black">
                Calculated on verified benchmark recovery rate of 8.2% across vetted SME ledgers.
              </p>

              {/* Breakdown metrics */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F0F0F5] text-[10px] text-left">
                <div className="p-2 rounded-lg bg-[#F7F7FA]">
                  <span className="text-neutral-500 block">SaaS Sprawl</span>
                  <span className="font-bold text-black font-mono">₹{Math.round(estimatedAnnualSavings * 0.15).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#F7F7FA]">
                  <span className="text-neutral-500 block">Rate Creep</span>
                  <span className="font-bold text-black font-mono">₹{Math.round(estimatedAnnualSavings * 0.35).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#F7F7FA]">
                  <span className="text-neutral-500 block">Duplicate Debits</span>
                  <span className="font-bold text-black font-mono">₹{Math.round(estimatedAnnualSavings * 0.50).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleModuleClick('leakage')}
              className="w-full h-12 bg-[#6D45CF] hover:bg-[#5B37B5] text-white font-semibold text-xs shadow-md cursor-pointer gap-2"
            >
              <span>Scan Your Ledger with ARTHIQ</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 7. INVOICE FORENSICS SHOWCASE (MODULE 2) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-50 text-[#E46D72] border border-rose-200">
            Module 2: Invoice Forensics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black mt-4 font-['Plus_Jakarta_Sans']">
            Autonomous Invoice Fraud & Statutory Verification
          </h2>
          <p className="text-base text-black mt-3">
            Statutory 15-character GSTIN checksum validation, RBI IFSC routing checks, duplicate invoice detection, and forensic risk classification.
          </p>

          {/* Interactive Case Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {INVOICE_CASE_STUDIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedInvoiceCase(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedInvoiceCase === c.id
                    ? 'bg-[#15151B] text-white shadow-xs'
                    : 'bg-[#F7F7FA] text-black border border-[#E5E5EB] hover:bg-neutral-200'
                }`}
              >
                {c.invoiceNumber} ({c.riskScore > 50 ? 'Anomaly' : 'Clean'})
              </button>
            ))}
          </div>
        </div>

        {/* Invoice Audit Sample Card */}
        <div
          onClick={() => handleModuleClick('invoices')}
          className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5EB] shadow-card hover:border-[#6D45CF]/40 transition-all cursor-pointer group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5EB] gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-lg text-black">{activeInvoice.invoiceNumber}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${activeInvoice.riskScore > 50 ? 'bg-rose-100 text-[#E46D72]' : 'bg-emerald-100 text-emerald-700'}`}>
                  {activeInvoice.riskBadge}
                </span>
              </div>
              <p className="text-xs text-black mt-1">Vendor: {activeInvoice.vendor} • Total: {activeInvoice.amount}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-black">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${activeInvoice.statusBadgeClass}`}>
                {activeInvoice.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB]">
              <span className="font-semibold text-black block mb-1">{activeInvoice.anomalyTitle}</span>
              <p className="text-black leading-relaxed">
                {activeInvoice.anomalyDesc}
              </p>
              <span className="inline-block mt-2 text-[10px] font-mono text-neutral-500 bg-neutral-200/60 px-2 py-0.5 rounded">
                Rule: {activeInvoice.ruleTriggered}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#EDE7FF]/50 border border-[#DDD3FA]">
              <span className="font-semibold text-[#6D45CF] block mb-1">{activeInvoice.verificationTitle}</span>
              <p className="text-black leading-relaxed">
                {activeInvoice.verificationDesc}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#6D45CF]">Forensics Engine: Random Forest + XGBoost</span>
                <span className="text-[11px] font-bold text-[#6D45CF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Inspect in Fraud Detector →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LIVE GRAPHS & REAL-TIME SIMULATION ENGINE */}
      <section id="graphs" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-[#6D45CF] border border-indigo-100">
            Interactive Visual Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black mt-4 font-['Plus_Jakarta_Sans']">
            Real-Time Financial Knowledge Graph & Multi-Horizon Simulation
          </h2>
          <p className="text-base text-black mt-3">
            Interact with live charts, simulate revenue and expense shocks, and visualize working capital trajectories in real time.
          </p>
        </div>

        <DynamicGraphEngine />
      </section>

      {/* 9. FINANCIAL ANALYTICS & CA RATIOS SHOWCASE (MODULE 5) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB] bg-[#F7F7FA] rounded-3xl my-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-[#6D45CF] border border-[#E5E5EB]">
            Module 5: Financial Analytics & BI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black mt-4 font-['Plus_Jakarta_Sans']">
            Power BI-Grade Financial Ratios & Statement Analysis
          </h2>
          <p className="text-base text-black mt-3">
            Instant Chartered Accountant-level computation of Liquidity, Profitability, Efficiency, and Solvency ratios with 1-click Excel export.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Current Ratio", val: "2.00x", status: "Healthy", desc: "Benchmark 1.5 - 2.0x" },
            { label: "Quick Ratio", val: "1.59x", status: "Strong", desc: "Excludes inventory" },
            { label: "Gross Margin", val: "51.1%", status: "Healthy", desc: "₹23.00L Gross Profit" },
            { label: "Net Margin", val: "15.4%", status: "Solid", desc: "₹6.94L PAT" },
            { label: "Debt to Equity", val: "0.37x", status: "Safe", desc: "Conservative gearing" },
            { label: "Health Score", val: "84/100", status: "Strong", desc: "Multi-factor radar" }
          ].map((r, i) => (
            <div
              key={i}
              onClick={() => handleModuleClick('analytics')}
              className="p-5 rounded-2xl bg-white border border-[#E5E5EB] hover:border-[#6D45CF] shadow-xs cursor-pointer group transition-all"
            >
              <span className="text-[11px] text-black font-medium block">{r.label}</span>
              <span className="text-xl font-bold text-black mt-1 font-mono block group-hover:text-[#6D45CF] transition-colors">{r.val}</span>
              <span className="text-[10px] text-[#16A879] font-semibold mt-1 block">{r.status}</span>
              <span className="text-[10px] text-black mt-1 block">{r.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => handleModuleClick('analytics')}
            variant="outline"
            className="text-xs font-bold text-[#6D45CF] border-[#DDD3FA] hover:bg-[#EDE7FF] h-10 px-6 gap-2 cursor-pointer"
          >
            <span>Explore Full Balance Sheet & Statement Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </section>

      {/* 10. ARTHIQ AI ASSISTANT SHOWCASE (MODULE 10) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#EDE7FF] text-[#6D45CF] border border-[#DDD3FA]">
              Module 10: ARTHIQ AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black font-['Plus_Jakarta_Sans'] leading-tight">
              An AI Financial Consultant That Never Invents Numbers.
            </h2>
            <p className="text-base text-black leading-relaxed">
              ARTHIQ AI executes audited mathematical tools directly against your verified ledger. Ask natural questions about expenses, runway, or suspicious transactions and receive precise, verifiable analysis.
            </p>

            <Button
              onClick={() => handleModuleClick('assistant')}
              className="bg-[#6D45CF] hover:bg-[#5B37B5] text-white font-semibold text-xs h-11 px-6 shadow-sm gap-2 cursor-pointer"
            >
              <span>Consult ARTHIQ AI</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* AI Chat Simulation Card */}
          <div
            onClick={() => handleModuleClick('assistant')}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5EB] shadow-card space-y-4 hover:border-[#6D45CF]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5EB]">
              <div className="w-9 h-9 rounded-xl bg-[#EDE7FF] text-[#6D45CF] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black">ARTHIQ AI Financial Analyst</span>
                  <span className="text-xs text-[#6D45CF] font-bold flex items-center gap-1">
                    Open Assistant <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
                <p className="text-[11px] text-[#16A879]">Connected to Apex Technologies General Ledger</p>
              </div>
            </div>

            {/* User message */}
            <div className="p-3.5 rounded-2xl bg-[#F7F7FA] text-xs font-medium text-black ml-auto max-w-sm">
              "Where is my business losing unnecessary money this month?"
            </div>

            {/* Assistant reply with tool pills */}
            <div className="p-4 rounded-2xl bg-[#EDE7FF]/40 border border-[#DDD3FA] text-xs text-black space-y-2">
              <div className="flex items-center gap-1.5 pb-1 text-[10px] font-mono text-[#6D45CF]">
                <span>Tool Executed: detect_profit_leakage()</span>
              </div>
              <p className="leading-relaxed">
                I reconciled your general ledger across accounts: your company is losing approximately <strong>₹85,200 monthly</strong> (annualized recovery potential: <strong>₹8,88,400</strong>). Top sources:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-black">
                <li><strong>Redundant Video Licenses:</strong> ₹18,500/mo overlapping Zoom and Google Meet.</li>
                <li><strong>Logistics Rate Escalation:</strong> ₹34,200 cost spike from Apex Logistics (+23%).</li>
                <li><strong>Duplicate Disbursement:</strong> ₹12,000 double debit on PO-2024.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 11. SECURITY & INFRASTRUCTURE */}
      <section id="resources" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-[#16A879] border border-emerald-200">
            Enterprise Security
          </span>
          <h2 className="text-3xl font-bold text-black mt-4 font-['Plus_Jakarta_Sans']">
            Tenant-Level Row Isolation & Statutory Governance
          </h2>
          <p className="text-sm text-black mt-2">
            Your financial statements, bank credentials, and general ledger records are encrypted with strict multi-tenant boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB] space-y-2">
            <Lock className="w-5 h-5 text-[#6D45CF] mb-2" />
            <h3 className="font-bold text-black text-sm">Row-Level Tenant Isolation</h3>
            <p className="text-black leading-relaxed">
              Every database query is cryptographically bound to your Organization ID. No client can ever access another tenant's financial statements.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB] space-y-2">
            <Database className="w-5 h-5 text-[#6D45CF] mb-2" />
            <h3 className="font-bold text-black text-sm">Grounded Math, Zero Hallucination</h3>
            <p className="text-black leading-relaxed">
              ARTHIQ AI executes validated deterministic mathematical tools. It never invents balances or claims to have analyzed data that was not uploaded.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB] space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#16A879] mb-2" />
            <h3 className="font-bold text-black text-sm">Statutory Compliance Ready</h3>
            <p className="text-black leading-relaxed">
              Built-in Indian GSTIN 15-character statutory verification, RBI IFSC routing checks, and dual-signoff accounts payable workflows.
            </p>
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-[#EDE7FF]/40 to-[#F7F7FA] border border-[#DDD3FA] shadow-card">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-black font-['Plus_Jakarta_Sans'] tracking-tight">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-base text-black mt-4 max-w-xl mx-auto leading-relaxed">
            Experience ARTHIQ today with Apex Technologies' pre-loaded live demonstration dataset.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={onLaunchDashboard}
              className="h-12 px-8 text-sm font-bold bg-[#6D45CF] hover:bg-[#5B37B5] text-white shadow-[0_4px_20px_rgba(109,69,207,0.3)] gap-2 cursor-pointer"
            >
              <span>Launch ARTHIQ Workspace Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 13. PROFESSIONAL FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#E5E5EB] bg-white text-xs text-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ArthiqLogo size="compact" />
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a href="#platform" className="hover:text-black">Platform</a>
            <a href="#solutions" className="hover:text-black">Solutions</a>
            <a href="#features" className="hover:text-black">Features</a>
            <a href="#intelligence" className="hover:text-black">Intelligence</a>
            <a href="#graphs" className="hover:text-black">Live Graphs</a>
            <a href="#resources" className="hover:text-black">Security</a>
          </div>

          <div className="text-center sm:text-right">
            <span>© 2026 ARTHIQ. All rights reserved. Built for SMEs, Startups & Finance Teams.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
