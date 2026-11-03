import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Receipt,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl glass-panel relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-accent-blue/10 via-accent-cyan/5 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Executive Financial Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Live Ledger Synced
            </span>
          </div>
          <p className="text-xs text-neutral-muted mt-1 max-w-xl">
            {data?.organization || "Apex Technologies Pvt Ltd"} (GSTIN: {data?.gstin || "27AAPFU0939F1ZV"}).
            ARTHIQ is continuously analyzing your cash velocity, invoices, and expense patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('assistant')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-accent-blue to-accent-cyan text-midnight hover:opacity-95 transition-opacity shadow-glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult ARTHIQ AI</span>
          </button>
          <button
            onClick={() => onNavigate('leakage')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-offwhite bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-accent-coral" />
            <span>Review Leakages (₹85.2K)</span>
          </button>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Gross Revenue */}
        <GlassCard hoverEffect onClick={() => onNavigate('analytics')}>
          <div className="flex items-center justify-between text-neutral-muted text-xs">
            <span>Gross Revenue</span>
            <span className="p-1.5 rounded-lg bg-accent-blue/10 text-accent-blue">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-white">
              ₹{(kpis.totalRevenue / 100000).toFixed(2)}L
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span>+10.0% QoQ</span>
            </div>
          </div>
        </GlassCard>

        {/* Total Expenses */}
        <GlassCard hoverEffect onClick={() => onNavigate('expenses')}>
          <div className="flex items-center justify-between text-neutral-muted text-xs">
            <span>Operating Burn</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Receipt className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-white">
              ₹{(kpis.totalExpenses / 100000).toFixed(2)}L
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1 font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span>+6.8% MoM</span>
            </div>
          </div>
        </GlassCard>

        {/* Net Profit */}
        <GlassCard hoverEffect onClick={() => onNavigate('analytics')}>
          <div className="flex items-center justify-between text-neutral-muted text-xs">
            <span>Net Profit (PAT)</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-white">
              ₹{(kpis.netProfit / 100000).toFixed(2)}L
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-medium">
              <span>{kpis.netProfitMargin}% Margin</span>
            </div>
          </div>
        </GlassCard>

        {/* Available Cash */}
        <GlassCard hoverEffect onClick={() => onNavigate('cashflow')}>
          <div className="flex items-center justify-between text-neutral-muted text-xs">
            <span>Available Liquid Cash</span>
            <span className="p-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan">
              <Wallet className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-white">
              ₹{(kpis.availableCash / 100000).toFixed(2)}L
            </span>
            <div className="text-[11px] text-neutral-muted mt-1 font-medium">
              <span>Target: ₹5.00L safety</span>
            </div>
          </div>
        </GlassCard>

        {/* Cash Runway */}
        <GlassCard hoverEffect onClick={() => onNavigate('cashflow')}>
          <div className="flex items-center justify-between text-neutral-muted text-xs">
            <span>Cash Runway</span>
            <span className="p-1.5 rounded-lg bg-accent-blue/10 text-accent-blue">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-white">
              {kpis.cashRunwayMonths} Mo
            </span>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">
              <span>Cash Flow Positive</span>
            </div>
          </div>
        </GlassCard>

        {/* Health Score */}
        <GlassCard hoverEffect onClick={() => onNavigate('risks')}>
          <div className="flex items-center justify-between text-neutral-muted text-xs">
            <span>Financial Health</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-emerald-400">
              {kpis.financialHealthScore}/100
            </span>
            <div className="text-[11px] text-neutral-muted mt-1 font-medium">
              <span>Status: {kpis.healthStatus}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Signature Alert Banner: Profit Leakage Detector (PLD) */}
      <div className="p-5 rounded-2xl glass-panel border border-accent-coral/20 bg-gradient-to-r from-rose-950/20 via-navy/50 to-midnight flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/20 flex-shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                ARTHIQ Profit Leakage Detector (PLD) Alert
              </h3>
              <MetricBadge label="₹85,200 Identified" variant="coral" />
            </div>
            <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
              We identified 5 cost leakages across redundant software licenses (₹18.5K/mo), unannounced vendor price creep from Apex Logistics (+23%), and double settlement on developer workstations. Total annualized recoverable savings: <strong className="text-emerald-400">₹8,88,400</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('leakage')}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-colors flex items-center gap-1.5"
        >
          <span>Open PLD Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Visualizations: Revenue vs Expenses & Cash Flow Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Outflow Cash Velocity Graph */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-white">Cash Velocity & Inflow vs Outflow</h3>
              <p className="text-xs text-neutral-muted mt-0.5">Historical 30-day liquidity trends (INR ₹)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-accent-cyan">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
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
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64D9E8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#64D9E8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F87171" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F87171" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Inflow Area & Path */}
              <path
                d="M 0,110 Q 70,80 140,55 T 280,45 T 420,35 T 500,25 L 500,150 L 0,150 Z"
                fill="url(#cyanGrad)"
              />
              <path
                d="M 0,110 Q 70,80 140,55 T 280,45 T 420,35 T 500,25"
                fill="none"
                stroke="#64D9E8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Outflow Area & Path */}
              <path
                d="M 0,125 Q 70,115 140,95 T 280,90 T 420,80 T 500,75 L 500,150 L 0,150 Z"
                fill="url(#roseGrad)"
              />
              <path
                d="M 0,125 Q 70,115 140,95 T 280,90 T 420,80 T 500,75"
                fill="none"
                stroke="#F87171"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 2"
              />
            </svg>
            <div className="flex justify-between text-[10px] text-neutral-muted mt-2">
              <span>Day 1 (Oct 1)</span>
              <span>Day 8</span>
              <span>Day 15</span>
              <span>Day 22</span>
              <span>Day 30 (Today)</span>
            </div>
          </div>
        </GlassCard>

        {/* Quick Risk Radar Summary */}
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-white">Risk Exposure Radar</h3>
              <p className="text-xs text-neutral-muted">Multi-factor SME stress test</p>
            </div>
            <MetricBadge label="Low Risk" variant="emerald" />
          </div>

          <div className="space-y-3.5 mt-4 text-xs">
            <div>
              <div className="flex justify-between text-neutral-muted mb-1">
                <span>Liquidity Risk</span>
                <span className="text-emerald-400 font-medium">18% (Safe)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-muted mb-1">
                <span>Profitability Margin Risk</span>
                <span className="text-emerald-400 font-medium">22% (Safe)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-muted mb-1">
                <span>Vendor Concentration Risk</span>
                <span className="text-amber-400 font-medium">42% (Moderate)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-muted mb-1">
                <span>Debtor Overdue Default Risk</span>
                <span className="text-amber-400 font-medium">35% (Watch)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-muted mb-1">
                <span>Invoice Fraud Flag Ratio</span>
                <span className="text-rose-400 font-medium">16% (3 Invoices)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '16%' }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('risks')}
            className="w-full mt-5 py-2 text-center text-xs font-medium text-accent-blue hover:text-accent-cyan transition-colors border border-accent-blue/20 rounded-xl bg-accent-blue/5"
          >
            Open Full Risk Engine →
          </button>
        </GlassCard>
      </div>

      {/* Flagged Invoices & Recent Ledger Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suspicious Invoices Requiring CFO Clearance */}
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-white">Suspicious Invoices Under Forensic Hold</h3>
            </div>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-xs text-accent-cyan hover:underline flex items-center gap-1"
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
                className="p-3.5 rounded-xl bg-navy-dark/60 border border-white/[0.06] hover:border-rose-500/30 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">#{inv.invoice_number}</span>
                  <MetricBadge label={inv.risk_classification} variant="coral" />
                </div>
                <div className="flex items-center justify-between text-neutral-muted mt-1.5">
                  <span>{inv.vendor_name}</span>
                  <span className="font-bold text-neutral-offwhite">₹{inv.total_amount?.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-rose-400/90 mt-1 font-medium">
                  {inv.anomalies_detected?.[0] || "Forensic anomaly flagged"}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Ledger Transactions */}
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Operating Transactions</h3>
              <p className="text-xs text-neutral-muted">Verified disbursements and settlements</p>
            </div>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs text-accent-cyan hover:underline flex items-center gap-1"
            >
              <span>Expense Log</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-white/[0.04] mt-2 text-xs">
            {data?.recentTransactions?.map((tx: any) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{tx.vendor}</p>
                  <p className="text-[11px] text-neutral-muted">{tx.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-offwhite">-₹{tx.amount?.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-neutral-muted">{tx.date}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

