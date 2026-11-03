import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Receipt,
  FileCheck2,
  TrendingUp,
  AlertOctagon,
  ShieldAlert,
  BarChart3,
  ChevronDown,
  CheckCircle2,
  Bot,
  ExternalLink
} from 'lucide-react';
import { FinancialSpatial3D } from './FinancialSpatial3D';

interface InteractiveModuleShowcaseProps {
  onAskQuestion: (question: string) => void;
  onLaunchModule: (moduleId: string) => void;
}

interface ModuleData {
  id: string;
  num: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  spatialMode: 'liquidity' | 'fraud' | 'risk' | 'leakage';
  previewStats: { label: string; value: string; detail: string }[];
  questions: string[];
}

export const InteractiveModuleShowcase: React.FC<InteractiveModuleShowcaseProps> = ({
  onAskQuestion,
  onLaunchModule
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  const modules: ModuleData[] = [
    {
      id: 'expenses',
      num: '01',
      title: 'Expense Intelligence',
      shortDesc: 'Automated ML pattern discovery, subscription audits & outlier tracking.',
      fullDesc: 'Analyzes every ledger voucher using Z-score outlier detection and machine learning clustering. Automatically exposes recurring SaaS sprawl, accidental duplicate disbursements, and unbudgeted departmental expenditure spikes.',
      icon: Receipt,
      badge: 'ML Outlier Detection',
      badgeColor: 'text-[#6D45CF] bg-[#EDE7FF] border-[#DDD3FA]',
      spatialMode: 'liquidity',
      previewStats: [
        { label: 'Outlier Spikes', value: '3 Flagged', detail: '+2.8σ deviation' },
        { label: 'Duplicate Payments', value: '₹12,000', detail: 'SysMatrix PO match' },
        { label: 'SaaS Sprawl', value: '2 Overlapping', detail: 'Zoom & Slack licenses' }
      ],
      questions: [
        'Why did my expenses increase this month?',
        'Which department is spending the most?',
        'Which recurring expenses can be reduced?'
      ]
    },
    {
      id: 'invoices',
      num: '02',
      title: 'Invoice Fraud Detection',
      shortDesc: 'Forensic OCR, GSTIN checksum audit & duplicate bill interceptor.',
      fullDesc: 'Multi-layer forensic verification engine cross-examines uploaded invoices against registered tax portals, RBI bank IFSC tables, and historical purchase orders to prevent fraudulent and manipulated disbursements.',
      icon: FileCheck2,
      badge: 'Forensic Risk Scoring',
      badgeColor: 'text-rose-600 bg-rose-50 border-rose-200',
      spatialMode: 'fraud',
      previewStats: [
        { label: 'Critical Risk', value: 'INV-SM-2024', detail: 'Identical 48h duplicate' },
        { label: 'Checksum Status', value: 'Invalid GSTIN', detail: 'NovaTech non-compliant' },
        { label: 'Audit Intercepts', value: '₹1.12L Saved', detail: 'Pre-payment blocked' }
      ],
      questions: [
        'Which invoices contain suspicious patterns?',
        'Are there duplicate invoice payments?',
        'Which vendors have unusual invoice activity?'
      ]
    },
    {
      id: 'cashflow',
      num: '03',
      title: 'Cash Flow Prediction',
      shortDesc: 'Holt-Winters forecasting, seasonal day-of-week decay & liquidity alarms.',
      fullDesc: 'Proprietary predictive models forecast cash trajectories 7, 30, 60, and 90 days ahead with empirical 95% bootstrap intervals, ensuring you never breach statutory liquidity or working capital minimums.',
      icon: TrendingUp,
      badge: '90-Day Horizon Engine',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      spatialMode: 'liquidity',
      previewStats: [
        { label: 'Available Reserves', value: '₹18.50L', detail: 'Current liquid cash' },
        { label: 'Cash Runway', value: '14.2 Months', detail: 'Burn rate positive' },
        { label: 'Safety Buffer', value: '₹5.00L Floor', detail: 'Zero deficit projected' }
      ],
      questions: [
        'Will my business have a cash shortage?',
        'What will my cash position look like in 30 days?',
        'Which upcoming payments create liquidity risks?'
      ]
    },
    {
      id: 'leakage',
      num: '04',
      title: 'Profit Leakage Detector',
      shortDesc: 'Vendor price creep forensics, late payment drag & hidden cost recovery.',
      fullDesc: 'Uncovers involuntary value loss where vendors quietly escalate unit prices over successive quarters without volume changes, and calculates the silent financing penalty of overdue client receivables.',
      icon: AlertOctagon,
      badge: 'Unannounced Price Creep',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      spatialMode: 'leakage',
      previewStats: [
        { label: 'Identified Leakage', value: '₹85,200', detail: '5 Active findings' },
        { label: 'Annual Recoverable', value: '₹8.88L', detail: 'Negotiation targets' },
        { label: 'Top Offender', value: 'Apex Logistics', detail: '+23% Unit creep' }
      ],
      questions: [
        'Where is my business losing unnecessary money?',
        'Which vendors are increasing operational costs?',
        'How much potential savings can be recovered?'
      ]
    },
    {
      id: 'risks',
      num: '05',
      title: 'Financial Risk Management',
      shortDesc: 'Dynamic Risk Radar, client concentration & Altman Z-score health.',
      fullDesc: 'Holistic risk synthesis scanning liquidity stress, credit defaults, customer revenue concentration, operational leverage, and compliance exposure in one automated dashboard.',
      icon: ShieldAlert,
      badge: 'Altman Z-Score: 3.42',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      spatialMode: 'risk',
      previewStats: [
        { label: 'Health Score', value: '84 / 100', detail: 'Strong balance sheet' },
        { label: 'Concentration', value: '28% Top Client', detail: 'Diversified B2B' },
        { label: 'DSO Average', value: '24.5 Days', detail: 'Healthy collection' }
      ],
      questions: [
        'What is our overall financial risk rating?',
        'Are customer payment delays increasing credit risk?',
        'How does our Altman Z-score compare to industry?'
      ]
    },
    {
      id: 'analytics',
      num: '06',
      title: 'Financial Analytics & BI',
      shortDesc: 'Full P&L synthesis, 15+ CA ratios & automated board package exports.',
      fullDesc: 'Transforms raw accounting entries into Chartered Accountant-grade financial statements, real-time EBITDA margins, Quick & Current liquidity metrics, and one-click board presentations.',
      icon: BarChart3,
      badge: 'Executive BI Package',
      badgeColor: 'text-[#6D45CF] bg-[#EDE7FF] border-[#DDD3FA]',
      spatialMode: 'liquidity',
      previewStats: [
        { label: 'Gross Revenue', value: '₹45.00L', detail: '+10.0% QoQ growth' },
        { label: 'Net Profit Margin', value: '15.4%', detail: 'PAT: ₹6.94L' },
        { label: 'Current Ratio', value: '2.18x', detail: 'Optimal liquidity' }
      ],
      questions: [
        'What is my current net profit margin?',
        'How has my revenue changed historically?',
        'Which financial ratios indicate business risks?'
      ]
    }
  ];

  const currentModule = modules[activeModuleIndex];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5EB]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EDE7FF] text-[#6D45CF] border border-[#DDD3FA] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Architectural Simulation</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17171F] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          One Intelligence Layer. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">
            Complete Financial Clarity.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-[#626270] mt-4 leading-relaxed font-normal">
          Interact with ARTHIQ's six core financial intelligence systems. Select any module to inspect real-time forensic visualizations, or click any financial question to query your actual business ledger.
        </p>
      </div>

      {/* Aaru-Inspired Split Screen Simulation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Large Changing Visual Showcase (5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-4">
          {/* 3D Spatial Interactive Neural Canvas */}
          <FinancialSpatial3D activeMode={currentModule.spatialMode} />

          {/* Module Deep-Dive Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm text-left transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentModule.badgeColor}`}>
                {currentModule.badge}
              </span>
              <span className="font-mono text-xs font-bold text-[#727280]">
                MODULE {currentModule.num} / 06
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-[#17171F] font-['Plus_Jakarta_Sans']">
              {currentModule.title}
            </h3>

            <p className="text-sm text-[#41414D] mt-2 leading-relaxed font-normal">
              {currentModule.fullDesc}
            </p>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#E5E5EB]">
              {currentModule.previewStats.map((stat, i) => (
                <div key={i} className="text-left">
                  <span className="text-[10px] font-bold text-[#727280] uppercase tracking-wider block">
                    {stat.label}
                  </span>
                  <span className="text-sm font-extrabold text-[#17171F] font-mono mt-0.5 block">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-semibold text-[#6D45CF] block truncate">
                    {stat.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Direct Module Launch CTA */}
            <button
              onClick={() => onLaunchModule(currentModule.id)}
              className="mt-6 w-full py-3 rounded-2xl bg-[#17171F] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <span>Launch {currentModule.title} Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Vertically Organized Interactive Module List & Questions (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-3.5">
          {modules.map((mod, index) => {
            const isActive = activeModuleIndex === index;
            const Icon = mod.icon;

            return (
              <div
                key={mod.id}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden text-left ${
                  isActive
                    ? 'bg-white border-[#6D45CF] shadow-lg ring-1 ring-[#6D45CF]/20'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white'
                }`}
              >
                {/* Category Header Row (Clickable) */}
                <button
                  onClick={() => setActiveModuleIndex(index)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm sm:text-base font-extrabold text-[#6D45CF]">
                      {mod.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#EDE7FF] text-[#6D45CF] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-[#17171F] font-['Plus_Jakarta_Sans']">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-[#626270] mt-0.5 line-clamp-1 font-normal">
                        {mod.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isActive
                          ? 'bg-[#6D45CF] text-white rotate-90 shadow-sm'
                          : 'bg-white border border-[#E2E8F0] text-[#727280]'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>

                {/* Expandable Module Content with Interactive Question Pills */}
                {isActive && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#F0F0F5] bg-white animate-fade-in">
                    <div className="mt-4">
                      <span className="text-[11px] font-bold text-[#727280] uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-[#6D45CF]" />
                        <span>Click an intelligent financial question to consult ARTHIQ AI:</span>
                      </span>

                      <div className="grid grid-cols-1 gap-2">
                        {mod.questions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => onAskQuestion(q)}
                            className="w-full p-3 rounded-2xl bg-[#F8FAFC] hover:bg-[#EDE7FF] border border-[#E2E8F0] hover:border-[#DDD3FA] text-left text-xs font-bold text-[#17171F] hover:text-[#6D45CF] flex items-center justify-between gap-3 transition-all group"
                          >
                            <span className="leading-snug">{q}</span>
                            <span className="text-[11px] font-bold text-[#6D45CF] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <span>Ask AI</span>
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

