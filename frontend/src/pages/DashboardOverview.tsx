import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Receipt,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { Button } from '../components/ui/button';
import { api } from '../services/api';

interface DashboardOverviewProps {
  onNavigate: (view: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard overview', err);
        setLoading(false);
      });
  }, []);

  const kpis = data?.kpis || {
    totalRevenue: 4500000,
    totalExpenses: 1274400,
    netProfit: 694200,
    netProfitMargin: 15.4,
    availableCash: 1850000,
    cashRunwayMonths: 14.2,
    financialHealthScore: 84,
    healthStatus: 'Strong',
    flaggedInvoicesCount: 3,
    totalLeakageIdentified: 85200,
    potentialAnnualSavings: 888400
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Health Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E5EB] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-violet-100/40 via-purple-50/20 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight font-['Plus_Jakarta_Sans']">
              Executive Financial Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#16A879] border border-emerald-200">
              Live Ledger Synced
            </span>
          </div>
          <p className="text-xs text-black mt-1.5 max-w-xl">
            {data?.organization || "Apex Technologies Pvt Ltd"} (GSTIN: {data?.gstin || "27AAPFU0939F1ZV"}).
            ARTHIQ is continuously analyzing your cash velocity, invoices, and expense patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate('assistant')}
            className="bg-[#6D45CF] hover:bg-[#5B37B5] text-white text-xs font-semibold h-10 px-4 gap-2 shadow-[0_4px_14px_rgba(109,69,207,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult ARTHIQ AI</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate('leakage')}
            className="text-xs font-semibold h-10 px-4 gap-1.5 text-black border-[#E5E5EB]"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-[#E46D72]" />
            <span>Review Leakages (₹85.2K)</span>
          </Button>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Gross Revenue */}
        <GlassCard hoverEffect onClick={() => onNavigate('analytics')}>
          <div className="flex items-center justify-between text-black text-xs">
            <span>Gross Revenue</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#6D45CF]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-black font-mono">
              ₹{(kpis.totalRevenue / 100000).toFixed(2)}L
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#16A879] mt-1 font-semibold">
              <ArrowUpRight className="w-3 h-3" />
              <span>+10.0% QoQ</span>
            </div>
          </div>
        </GlassCard>

        {/* Total Expenses */}
        <GlassCard hoverEffect onClick={() => onNavigate('expenses')}>
          <div className="flex items-center justify-between text-black text-xs">
            <span>Operating Burn</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-[#E5A33D]">
              <Receipt className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-black font-mono">
              ₹{(kpis.totalExpenses / 100000).toFixed(2)}L
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#E5A33D] mt-1 font-semibold">
              <ArrowUpRight className="w-3 h-3" />
              <span>+6.8% MoM</span>
            </div>
          </div>
        </GlassCard>

        {/* Net Profit */}
        <GlassCard hoverEffect onClick={() => onNavigate('analytics')}>
          <div className="flex items-center justify-between text-black text-xs">
            <span>Net Profit (PAT)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#16A879]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-black font-mono">
              ₹{(kpis.netProfit / 100000).toFixed(2)}L
            </span>
            <div className="text-[11px] text-[#16A879] mt-1 font-semibold">
              <span>{kpis.netProfitMargin}% Margin</span>
            </div>
          </div>
        </GlassCard>

        {/* Available Cash */}
        <GlassCard hoverEffect onClick={() => onNavigate('cashflow')}>
          <div className="flex items-center justify-between text-black text-xs">
            <span>Available Liquid Cash</span>
            <span className="p-1.5 rounded-lg bg-violet-50 text-[#6D45CF]">
              <Wallet className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-[#6D45CF] font-mono">
              ₹{(kpis.availableCash / 100000).toFixed(2)}L
            </span>
            <div className="text-[11px] text-black mt-1">
              <span>Target: ₹5.00L safety</span>
            </div>
          </div>
        </GlassCard>

        {/* Cash Runway */}
        <GlassCard hoverEffect onClick={() => onNavigate('cashflow')}>
          <div className="flex items-center justify-between text-black text-xs">
            <span>Cash Runway</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#6D45CF]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-[#16A879] font-mono">
              {kpis.cashRunwayMonths} Mo
            </span>
            <div className="text-[11px] text-[#16A879] mt-1 font-semibold">
              <span>Cash Flow Positive</span>
            </div>
          </div>
        </GlassCard>

        {/* Health Score */}
        <GlassCard hoverEffect onClick={() => onNavigate('risks')}>
          <div className="flex items-center justify-between text-black text-xs">
            <span>Financial Health</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#16A879]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-[#16A879] font-mono">
              {kpis.financialHealthScore}/100
            </span>
            <div className="text-[11px] text-black mt-1">
              <span>Status: {kpis.healthStatus}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Signature Alert Banner: Profit Leakage Detector (PLD) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-white to-white border border-rose-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-100 text-[#E46D72] flex-shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-black">
                ARTHIQ Profit Leakage Detector (PLD) Alert
              </h3>
              <MetricBadge label="₹85,200 Identified" variant="coral" />
            </div>
            <p className="text-xs text-black mt-1 leading-relaxed">
              We identified 5 cost leakages across redundant software licenses (₹18.5K/mo), unannounced vendor price creep from Apex Logistics (+23%), and double settlement on developer workstations. Total annualized recoverable savings: <strong className="text-[#16A879]">₹8,88,400</strong>.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => onNavigate('leakage')}
          className="flex-shrink-0 text-xs font-semibold text-[#E46D72] border-rose-200 hover:bg-rose-50 gap-1.5"
        >
          <span>Open PLD Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Main Visualizations: Selective Dark Glass & Risk Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selective Dark Glass Panel for High-End Financial Telemetry */}
        <GlassCard variant="dark" className="lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-semibold text-black">Cash Velocity & Inflow vs Outflow</h3>
              <p className="text-xs text-black mt-0.5">Historical 30-day liquidity trends (INR ₹)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                Inflows
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                Outflows
              </span>
            </div>
          </div>

          {/* SVG Trend Graph */}
          <div className="mt-6 h-56 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="violetGlassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="roseGlassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E46D72" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#E46D72" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

              <path
                d="M 0,110 Q 70,80 140,55 T 280,45 T 420,35 T 500,25 L 500,150 L 0,150 Z"
                fill="url(#violetGlassGrad)"
              />
              <path
                d="M 0,110 Q 70,80 140,55 T 280,45 T 420,35 T 500,25"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M 0,125 Q 70,115 140,95 T 280,90 T 420,80 T 500,75 L 500,150 L 0,150 Z"
                fill="url(#roseGlassGrad)"
              />
              <path
                d="M 0,125 Q 70,115 140,95 T 280,90 T 420,80 T 500,75"
                fill="none"
                stroke="#E46D72"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 2"
              />
            </svg>
            <div className="flex justify-between text-[10px] text-black mt-2">
              <span>Day 1 (Oct 1)</span>
              <span>Day 8</span>
              <span>Day 15</span>
              <span>Day 22</span>
              <span>Day 30 (Today)</span>
            </div>
          </div>
        </GlassCard>

        {/* Risk Radar Card */}
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
            <div>
              <h3 className="text-sm font-bold text-black">Risk Exposure Radar</h3>
              <p className="text-xs text-black">Multi-factor SME stress test</p>
            </div>
            <MetricBadge label="Low Risk" variant="emerald" />
          </div>

          <div className="space-y-3.5 mt-4 text-xs">
            <div>
              <div className="flex justify-between text-black mb-1">
                <span>Liquidity Risk</span>
                <span className="text-[#16A879] font-bold">18% (Safe)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#ECECF1] overflow-hidden">
                <div className="h-full bg-[#16A879] rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-black mb-1">
                <span>Profitability Margin Risk</span>
                <span className="text-[#16A879] font-bold">22% (Safe)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#ECECF1] overflow-hidden">
                <div className="h-full bg-[#16A879] rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-black mb-1">
                <span>Vendor Concentration Risk</span>
                <span className="text-[#E5A33D] font-bold">42% (Moderate)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#ECECF1] overflow-hidden">
                <div className="h-full bg-[#E5A33D] rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-black mb-1">
                <span>Debtor Overdue Default Risk</span>
                <span className="text-[#E5A33D] font-bold">35% (Watch)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#ECECF1] overflow-hidden">
                <div className="h-full bg-[#E5A33D] rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-black mb-1">
                <span>Invoice Fraud Flag Ratio</span>
                <span className="text-[#E46D72] font-bold">16% (3 Invoices)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#ECECF1] overflow-hidden">
                <div className="h-full bg-[#E46D72] rounded-full" style={{ width: '16%' }} />
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigate('risks')}
            className="w-full mt-5 text-xs font-semibold text-[#6D45CF] border-[#E5E5EB]"
          >
            Open Full Risk Engine →
          </Button>
        </GlassCard>
      </div>

      {/* Flagged Invoices & Recent Ledger Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suspicious Invoices */}
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E46D72]" />
              <h3 className="text-sm font-bold text-black">Suspicious Invoices Under Forensic Hold</h3>
            </div>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-xs text-[#6D45CF] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {data?.topSuspiciousInvoices?.map((inv: any) => (
              <div
                key={inv.id}
                onClick={() => onNavigate('invoices')}
                className="p-3.5 rounded-xl bg-[#F7F7FA] border border-[#E5E5EB] hover:border-rose-300 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black">#{inv.invoice_number}</span>
                  <MetricBadge label={inv.risk_classification} variant="coral" />
                </div>
                <div className="flex items-center justify-between text-black mt-1.5">
                  <span>{inv.vendor_name}</span>
                  <span className="font-bold text-black">₹{inv.total_amount?.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-[#E46D72] mt-1 font-medium">
                  {inv.anomalies_detected?.[0] || "Forensic anomaly flagged"}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Ledger Transactions */}
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
            <div>
              <h3 className="text-sm font-bold text-black">Recent Operating Transactions</h3>
              <p className="text-xs text-black">Verified disbursements and settlements</p>
            </div>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs text-[#6D45CF] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Expense Log</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#F0F0F5] mt-2 text-xs">
            {data?.recentTransactions?.map((tx: any) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-black">{tx.vendor}</p>
                  <p className="text-[11px] text-black">{tx.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">-₹{tx.amount?.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-black">{tx.date}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
