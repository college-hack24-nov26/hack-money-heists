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
  ExternalLink
} from 'lucide-react';
import { HomeNavbar } from '../components/HomeNavbar';
import { Hero } from '../components/ui/hero-1';
import { Button } from '../components/ui/button';
import { ArthiqLogo } from '../components/ArthiqLogo';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [calcMonthlySpend, setCalcMonthlySpend] = useState<number>(1500000);
  const [previewHorizon, setPreviewHorizon] = useState<number>(30);
  const estimatedAnnualSavings = Math.round(calcMonthlySpend * 0.082 * 12);

  return (
    <div className="min-h-screen bg-white text-[#15151B] font-sans selection:bg-[#EDE7FF] selection:text-[#6D45CF]">
      {/* 1. HORIZONTAL STICKY NAVBAR (No vertical sidebar) */}
      <HomeNavbar onLaunchDashboard={onLaunchDashboard} />

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
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#15151B] mt-4 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Accounting Shows the Past. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              ARTHIQ Predicts the Future.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#71717A] mt-4 leading-relaxed">
            Traditional bookkeeping answers <em>what happened last month</em>. ARTHIQ behaves like a tireless, Chartered Accountant-level analyst working directly alongside you to identify where capital is leaking and how to protect liquidity.
          </p>
        </div>

        {/* 3 Value Pillars in Spacious Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#F7F7FA] border border-[#E5E5EB] hover:border-[#D4D4DE] transition-all hover:shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE7FF] text-[#6D45CF] flex items-center justify-center font-bold text-lg mb-6">
              01
            </div>
            <h3 className="text-xl font-bold text-[#15151B] mb-2 font-['Plus_Jakarta_Sans']">
              Understand Why Money Goes Where It Goes
            </h3>
            <p className="text-sm text-[#71717A] leading-relaxed">
              Automated categorization, machine learning outlier tracking on operating expenses, and visibility into subtle SaaS licensing sprawl across departments.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F7F7FA] border border-[#E5E5EB] hover:border-[#D4D4DE] transition-all hover:shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A879] flex items-center justify-center font-bold text-lg mb-6">
              02
            </div>
            <h3 className="text-xl font-bold text-[#15151B] mb-2 font-['Plus_Jakarta_Sans']">
              Forecast Cash Trajectories with Certainty
            </h3>
            <p className="text-sm text-[#71717A] leading-relaxed">
              Predict inflows, outflows, and working capital buffers over 7, 30, 60, and 90-day horizons with calibrated 95% uncertainty envelopes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F7F7FA] border border-[#E5E5EB] hover:border-[#D4D4DE] transition-all hover:shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E46D72] flex items-center justify-center font-bold text-lg mb-6">
              03
            </div>
            <h3 className="text-xl font-bold text-[#15151B] mb-2 font-['Plus_Jakarta_Sans']">
              Plug Involuntary Value Leakages
            </h3>
            <p className="text-sm text-[#71717A] leading-relaxed">
              Expose unannounced supplier price escalations (+23%), duplicate disbursements, and the silent interest drag of overdue client receivables.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CORE CAPABILITIES */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB] bg-[#F7F7FA] rounded-3xl my-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-[#6D45CF] border border-[#E5E5EB]">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15151B] mt-4 font-['Plus_Jakarta_Sans']">
            Comprehensive Financial Intelligence Architecture
          </h2>
          <p className="text-base text-[#71717A] mt-3">
            Every module is engineered as an independent but seamlessly interconnected financial system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Receipt,
              title: "Smart Expense Analyzer",
              desc: "Automated OPEX categorization, Z-score outlier detection, and duplicate payment audits.",
              badge: "ML Outlier Engine",
            },
            {
              icon: FileCheck2,
              title: "Invoice Fraud Detector",
              desc: "Statutory 15-char GSTIN checksum verification, IFSC routing, and risk scoring (0-100).",
              badge: "Forensics & OCR",
            },
            {
              icon: TrendingUp,
              title: "Cash Flow Prediction",
              desc: "Holt-Winters forecasting across 7-90 days with 95% bootstrap confidence bands.",
              badge: "Predictive AI",
            },
            {
              icon: AlertOctagon,
              title: "Profit Leakage Detector",
              desc: "ARTHIQ's signature feature uncovering price creep, double debits, and idle subscriptions.",
              badge: "Signature PLD",
            },
            {
              icon: BarChart3,
              title: "Financial Analytics & BI",
              desc: "Executive P&L statements, Balance Sheets, and 15+ CA ratios with real Excel XLSX export.",
              badge: "Power BI Grade",
            },
            {
              icon: Users2,
              title: "Client & Receivable Isolation",
              desc: "Centralized client directory, Days Sales Outstanding (DSO), and credit limits.",
              badge: "Multi-Tenant",
            },
            {
              icon: ShieldCheck,
              title: "Financial Risk Radar",
              desc: "Multi-factor SME stress test analyzing liquidity, profitability, credit, and fraud drag.",
              badge: "Early Warning",
            },
            {
              icon: Bot,
              title: "ARTHIQ AI Assistant",
              desc: "Grounded conversational financial intelligence executing ledger tools with zero hallucinated math.",
              badge: "Tool-Calling AI",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E5E5EB] hover:border-[#D4D4DE] transition-all hover:shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#EDE7FF] text-[#6D45CF] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#6D45CF] px-2 py-0.5 rounded-full bg-[#EDE7FF]/60 font-mono">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#15151B] mb-2 font-['Plus_Jakarta_Sans']">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-[#F0F0F5] text-xs font-semibold text-[#6D45CF] flex items-center gap-1">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CASH FLOW PREDICTION SHOWCASE */}
      <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-[#6D45CF] border border-indigo-100">
              Module 3: SME Cash Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15151B] font-['Plus_Jakarta_Sans'] leading-tight">
              Know Exactly When Cash Tightens — Weeks Before It Happens.
            </h2>
            <p className="text-base text-[#71717A] leading-relaxed">
              ARTHIQ models seasonal inflow spikes, client payment cycles, and payroll cadence to project your liquidity runway and alert you when your balance risks dipping below safety reserves.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#16A879]" />
                <span className="text-[#15151B] font-medium">Multi-Horizon Forecasting: 7, 30, 60, and 90 days ahead.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#16A879]" />
                <span className="text-[#15151B] font-medium">Statistical 95% confidence intervals showing realistic variance.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#16A879]" />
                <span className="text-[#15151B] font-medium">Automatic alerts when projected cash breaches configured safety targets.</span>
              </div>
            </div>

            <Button
              onClick={onLaunchDashboard}
              className="bg-[#6D45CF] hover:bg-[#5B37B5] text-white font-semibold text-xs h-11 px-6 shadow-sm gap-2"
            >
              <span>Test Cash Flow Engine</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Interactive Trajectory Visualization Preview */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5EB] shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EB]">
              <div>
                <span className="text-xs font-bold text-[#15151B]">Apex Technologies — Projected Liquidity</span>
                <p className="text-[11px] text-[#71717A]">Base Cash: ₹18.50L | Safety Floor: ₹5.00L</p>
              </div>

              {/* Horizon Switcher */}
              <div className="flex items-center gap-1.5 bg-[#F7F7FA] p-1 rounded-xl border border-[#E5E5EB] text-xs">
                {[7, 30, 60, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => setPreviewHorizon(d)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      previewHorizon === d
                        ? 'bg-[#6D45CF] text-white shadow-xs'
                        : 'text-[#71717A] hover:text-[#15151B]'
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Trajectory Chart */}
            <div className="mt-6 h-56 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="violetArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Safety target line */}
                <line x1="0" y1="120" x2="500" y2="120" stroke="#E5A33D" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x="400" y="115" fill="#E5A33D" fontSize="10" fontWeight="600">Safety: ₹5.00L</text>

                {/* Trajectory */}
                <path
                  d="M 0,90 Q 70,75 140,65 T 280,50 T 420,40 T 500,32 L 500,150 L 0,150 Z"
                  fill="url(#violetArea)"
                />
                <path
                  d="M 0,90 Q 70,75 140,65 T 280,50 T 420,40 T 500,32"
                  fill="none"
                  stroke="#6D45CF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {[
                  { x: 0, y: 90, val: "₹18.5L" },
                  { x: 140, y: 65, val: "₹19.4L" },
                  { x: 280, y: 50, val: "₹20.8L" },
                  { x: 500, y: 32, val: "₹22.9L" }
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#6D45CF" />
                    <text x={pt.x - 15} y={pt.y - 10} fill="#15151B" fontSize="9" fontWeight="700">{pt.val}</text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-[#71717A] pt-4 border-t border-[#F0F0F5]">
              <span className="text-[#16A879] font-semibold">14.2 Months Estimated Runway</span>
              <span>Model: Holt-Winters Seasonality</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROFIT LEAKAGE DETECTOR SHOWCASE (Signature Feature with Interactive Calculator) */}
      <section id="intelligence" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#E46D72] text-xs font-semibold border border-rose-200">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>ARTHIQ Signature Feature</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#15151B] font-['Plus_Jakarta_Sans'] leading-tight">
              Stop Involuntary Value Erosion Across Your Ledger.
            </h2>

            <p className="text-base text-[#71717A] leading-relaxed">
              Most businesses lose between <strong>6% to 12% of total operational expenditure</strong> to overlapping software subscriptions, unannounced vendor price creep, duplicate invoice settlements, and carrying costs on overdue receivables.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6D45CF] flex items-center justify-center flex-shrink-0 font-bold">
                  PLD
                </div>
                <div>
                  <h4 className="font-bold text-[#15151B]">Redundant SaaS Licenses Identified: ₹18,500/mo</h4>
                  <p className="text-[#71717A] mt-0.5">Dual video conferencing licenses (Zoom Pro + Google Meet) paid simultaneously for 8 months.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#E46D72] flex items-center justify-center flex-shrink-0 font-bold">
                  PLD
                </div>
                <div>
                  <h4 className="font-bold text-[#15151B]">Unannounced Supplier Rate Creep: ₹34,200/cycle</h4>
                  <p className="text-[#71717A] mt-0.5">Apex Logistics unit shipment price rose 23% from ₹320 to ₹394 without volume increase.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F7F7FA] border border-[#E5E5EB] shadow-card space-y-6">
            <h3 className="text-xl font-bold text-[#15151B] font-['Plus_Jakarta_Sans']">
              Live Profit Leakage Estimator
            </h3>
            <p className="text-xs text-[#71717A]">
              Slide to adjust your company's monthly operating expenses (OPEX):
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#71717A]">Monthly OPEX:</span>
                <span className="text-lg font-bold text-[#15151B] font-mono">
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
                className="w-full accent-[#6D45CF] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#71717A]">
                <span>₹5 Lakh/mo</span>
                <span>₹50 Lakh/mo</span>
                <span>₹1 Crore/mo</span>
              </div>
            </div>

            {/* Calculated Recovery Result */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5EB] text-center space-y-2">
              <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block">
                Estimated Recoverable Annual Savings
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#6D45CF] font-mono block">
                ₹{estimatedAnnualSavings.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-[#71717A]">
                Calculated on verified benchmark recovery rate of 8.2% across vetted SME ledgers.
              </p>
            </div>

            <Button
              onClick={onLaunchDashboard}
              className="w-full h-12 bg-[#6D45CF] hover:bg-[#5B37B5] text-white font-semibold text-xs shadow-md"
            >
              Scan Your Ledger with ARTHIQ →
            </Button>
          </div>
        </div>
      </section>

      {/* 7. INVOICE INTELLIGENCE SHOWCASE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-50 text-[#E46D72] border border-rose-200">
            Module 2: Invoice Forensics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15151B] mt-4 font-['Plus_Jakarta_Sans']">
            Autonomous Invoice Fraud & Statutory Verification
          </h2>
          <p className="text-base text-[#71717A] mt-3">
            Statutory 15-character GSTIN checksum validation, RBI IFSC routing checks, duplicate invoice detection, and forensic risk classification.
          </p>
        </div>

        {/* Invoice Audit Sample Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5EB] shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5EB] gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-lg text-[#15151B]">#INV-SM-2024-DUP</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-[#E46D72]">
                  Critical Risk (88/100)
                </span>
              </div>
              <p className="text-xs text-[#71717A] mt-1">Vendor: SysMatrix Technologies • Total: ₹12,000.00</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#71717A]">Status:</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#E46D72] border border-rose-200">
                Payment Blocked by Controller
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB]">
              <span className="font-semibold text-[#15151B] block mb-1">Detected Anomaly:</span>
              <p className="text-[#71717A] leading-relaxed">
                PO-SM-2024 was already settled on Oct 12 under voucher RTGS-SM-5511. Identical amount ₹12,000 billed again with duplicate line items within 48 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EDE7FF]/50 border border-[#DDD3FA]">
              <span className="font-semibold text-[#6D45CF] block mb-1">Recommended Verification:</span>
              <p className="text-[#15151B] leading-relaxed">
                MANDATORY: Reject payment immediately to avoid double disbursement. Issue credit reconciliation notice to vendor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINANCIAL ANALYTICS & CA RATIOS SHOWCASE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB] bg-[#F7F7FA] rounded-3xl my-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-[#6D45CF] border border-[#E5E5EB]">
            Module 5: Financial Analytics & BI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15151B] mt-4 font-['Plus_Jakarta_Sans']">
            Power BI-Grade Financial Ratios & Statement Analysis
          </h2>
          <p className="text-base text-[#71717A] mt-3">
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
            <div key={i} className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <span className="text-[11px] text-[#71717A] font-medium block">{r.label}</span>
              <span className="text-xl font-bold text-[#15151B] mt-1 font-mono block">{r.val}</span>
              <span className="text-[10px] text-[#16A879] font-semibold mt-1 block">{r.status}</span>
              <span className="text-[10px] text-[#71717A] mt-1 block">{r.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 9. ARTHIQ AI ASSISTANT SHOWCASE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#EDE7FF] text-[#6D45CF] border border-[#DDD3FA]">
              Module 10: ARTHIQ AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15151B] font-['Plus_Jakarta_Sans'] leading-tight">
              An AI Financial Consultant That Never Invents Numbers.
            </h2>
            <p className="text-base text-[#71717A] leading-relaxed">
              ARTHIQ AI executes audited mathematical tools directly against your verified ledger. Ask natural questions about expenses, runway, or suspicious transactions and receive precise, verifiable analysis.
            </p>

            <Button
              onClick={onLaunchDashboard}
              className="bg-[#6D45CF] hover:bg-[#5B37B5] text-white font-semibold text-xs h-11 px-6 shadow-sm gap-2"
            >
              <span>Consult ARTHIQ AI</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* AI Chat Simulation Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5EB] shadow-card space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5EB]">
              <div className="w-9 h-9 rounded-xl bg-[#EDE7FF] text-[#6D45CF] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#15151B]">ARTHIQ AI Financial Analyst</span>
                <p className="text-[11px] text-[#16A879]">Connected to Apex Technologies General Ledger</p>
              </div>
            </div>

            {/* User message */}
            <div className="p-3.5 rounded-2xl bg-[#F7F7FA] text-xs font-medium text-[#15151B] ml-auto max-w-sm">
              "Where is my business losing unnecessary money this month?"
            </div>

            {/* Assistant reply with tool pills */}
            <div className="p-4 rounded-2xl bg-[#EDE7FF]/40 border border-[#DDD3FA] text-xs text-[#15151B] space-y-2">
              <div className="flex items-center gap-1.5 pb-1 text-[10px] font-mono text-[#6D45CF]">
                <span>Tool Executed: detect_profit_leakage()</span>
              </div>
              <p className="leading-relaxed">
                I reconciled your general ledger across accounts: your company is losing approximately <strong>₹85,200 monthly</strong> (annualized recovery potential: <strong>₹8,88,400</strong>). Top sources:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[#71717A]">
                <li><strong>Redundant Video Licenses:</strong> ₹18,500/mo overlapping Zoom and Google Meet.</li>
                <li><strong>Logistics Rate Escalation:</strong> ₹34,200 cost spike from Apex Logistics (+23%).</li>
                <li><strong>Duplicate Disbursement:</strong> ₹12,000 double debit on PO-2024.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SECURITY & INFRASTRUCTURE */}
      <section id="resources" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-[#16A879] border border-emerald-200">
            Enterprise Security
          </span>
          <h2 className="text-3xl font-bold text-[#15151B] mt-4 font-['Plus_Jakarta_Sans']">
            Tenant-Level Row Isolation & Statutory Governance
          </h2>
          <p className="text-sm text-[#71717A] mt-2">
            Your financial statements, bank credentials, and general ledger records are encrypted with strict multi-tenant boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB] space-y-2">
            <Lock className="w-5 h-5 text-[#6D45CF] mb-2" />
            <h3 className="font-bold text-[#15151B] text-sm">Row-Level Tenant Isolation</h3>
            <p className="text-[#71717A] leading-relaxed">
              Every database query is cryptographically bound to your Organization ID. No client can ever access another tenant's financial statements.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB] space-y-2">
            <Database className="w-5 h-5 text-[#6D45CF] mb-2" />
            <h3 className="font-bold text-[#15151B] text-sm">Grounded Math, Zero Hallucination</h3>
            <p className="text-[#71717A] leading-relaxed">
              ARTHIQ AI executes validated deterministic mathematical tools. It never invents balances or claims to have analyzed data that was not uploaded.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB] space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#16A879] mb-2" />
            <h3 className="font-bold text-[#15151B] text-sm">Statutory Compliance Ready</h3>
            <p className="text-[#71717A] leading-relaxed">
              Built-in Indian GSTIN 15-character statutory verification, RBI IFSC routing checks, and dual-signoff accounts payable workflows.
            </p>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-[#EDE7FF]/40 to-[#F7F7FA] border border-[#DDD3FA] shadow-card">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#15151B] font-['Plus_Jakarta_Sans'] tracking-tight">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-base text-[#71717A] mt-4 max-w-xl mx-auto leading-relaxed">
            Experience ARTHIQ today with Apex Technologies' pre-loaded live demonstration dataset.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={onLaunchDashboard}
              className="h-12 px-8 text-sm font-bold bg-[#6D45CF] hover:bg-[#5B37B5] text-white shadow-[0_4px_20px_rgba(109,69,207,0.3)] gap-2"
            >
              <span>Launch ARTHIQ Workspace Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 12. PROFESSIONAL FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#E5E5EB] bg-white text-xs text-[#71717A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ArthiqLogo size="compact" />
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a href="#platform" className="hover:text-[#15151B]">Platform</a>
            <a href="#solutions" className="hover:text-[#15151B]">Solutions</a>
            <a href="#features" className="hover:text-[#15151B]">Features</a>
            <a href="#intelligence" className="hover:text-[#15151B]">Intelligence</a>
            <a href="#resources" className="hover:text-[#15151B]">Security</a>
          </div>

          <div className="text-center sm:text-right">
            <span>© 2026 ARTHIQ. All rights reserved. Built for SMEs, Startups & Finance Teams.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
