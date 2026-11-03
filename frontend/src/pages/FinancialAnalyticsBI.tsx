import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  TrendingUp,
  Percent,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const FinancialAnalyticsBI: React.FC = () => {
  const [statements, setStatements] = useState<any>(null);
  const [ratios, setRatios] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'ratios' | 'pl' | 'kpis'>('ratios');

  useEffect(() => {
    Promise.all([api.getFinancialStatements(), api.getFinancialRatios()])
      .then(([stmtRes, ratRes]) => {
        setStatements(stmtRes);
        setRatios(ratRes?.ratios || null);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleExportExcel = () => {
    // Generate and download a real formatted CSV/Excel report
    const pl = statements?.pl || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ARTHIQ FINANCIAL INTELLIGENCE PLATFORM - EXECUTIVE REPORT\n";
    csvContent += "Company: Apex Technologies Pvt Ltd\n\n";
    csvContent += "Line Item,Q1 Actual (INR),Q2 Projected (INR),Variance %\n";
    pl.forEach((row: any) => {
      csvContent += `"${row.name}",${row.q1},${row.q2},"${row.var}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ARTHIQ_Apex_Financial_BI_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Financial Analysis & Business Intelligence
            </h1>
            <MetricBadge label="Chartered Accountant Ratios" variant="blue" />
          </div>
          <p className="text-xs text-neutral-muted mt-1 max-w-xl">
            Power BI-inspired multi-dimensional analytics. Liquidity, profitability, efficiency, and leverage ratios evaluated against SME industry benchmarks.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-midnight hover:bg-emerald-400 transition-colors shadow-emeraldGlow"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Model (XLSX/CSV)</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs">
        <button
          onClick={() => setActiveTab('ratios')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'ratios'
              ? 'bg-accent-blue/20 text-white border border-accent-blue/30 shadow-glow'
              : 'text-neutral-muted hover:text-white'
          }`}
        >
          Key Financial Ratios (15+)
        </button>
        <button
          onClick={() => setActiveTab('pl')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'pl'
              ? 'bg-accent-blue/20 text-white border border-accent-blue/30 shadow-glow'
              : 'text-neutral-muted hover:text-white'
          }`}
        >
          Profit & Loss Statement (P&L)
        </button>
        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'kpis'
              ? 'bg-accent-blue/20 text-white border border-accent-blue/30 shadow-glow'
              : 'text-neutral-muted hover:text-white'
          }`}
        >
          EBITDA & Unit Economics
        </button>
      </div>

      {/* Ratios Tab */}
      {activeTab === 'ratios' && (
        <div className="space-y-6">
          {/* Liquidity Ratios */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-cyan mb-3">
              1. Liquidity & Working Capital Health
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard>
                <div className="flex justify-between items-center text-xs text-neutral-muted">
                  <span>Current Ratio</span>
                  <MetricBadge label="Healthy" variant="emerald" />
                </div>
                <div className="text-2xl font-bold text-white mt-2">2.00x</div>
                <p className="text-[11px] text-neutral-muted mt-1">Benchmark: 1.5 - 2.0x (Safe Buffer)</p>
              </GlassCard>

              <GlassCard>
                <div className="flex justify-between items-center text-xs text-neutral-muted">
                  <span>Quick Ratio (Acid Test)</span>
                  <MetricBadge label="Healthy" variant="emerald" />
                </div>
                <div className="text-2xl font-bold text-white mt-2">1.59x</div>
                <p className="text-[11px] text-neutral-muted mt-1">Excludes inventory (Benchmark ≥ 1.0)</p>
              </GlassCard>

              <GlassCard>
                <div className="flex justify-between items-center text-xs text-neutral-muted">
                  <span>Cash Ratio</span>
                  <MetricBadge label="Strong" variant="emerald" />
                </div>
                <div className="text-2xl font-bold text-white mt-2">1.16x</div>
                <p className="text-[11px] text-neutral-muted mt-1">Direct cash to current liabilities</p>
              </GlassCard>

              <GlassCard>
                <div className="flex justify-between items-center text-xs text-neutral-muted">
                  <span>Working Capital</span>
                  <MetricBadge label="Positive" variant="emerald" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-2">₹16.00L</div>
                <p className="text-[11px] text-neutral-muted mt-1">Current Assets - Current Liabilities</p>
              </GlassCard>
            </div>
          </div>

          {/* Profitability Ratios */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
              2. Profitability Margins & Returns
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <GlassCard>
                <span className="text-xs text-neutral-muted">Gross Margin</span>
                <div className="text-2xl font-bold text-white mt-1">51.11%</div>
                <span className="text-[11px] text-emerald-400 mt-1 block">Healthy B2B pricing</span>
              </GlassCard>

              <GlassCard>
                <span className="text-xs text-neutral-muted">Operating Margin (EBIT)</span>
                <div className="text-2xl font-bold text-white mt-1">21.22%</div>
                <span className="text-[11px] text-emerald-400 mt-1 block">EBIT: ₹9.55L</span>
              </GlassCard>

              <GlassCard>
                <span className="text-xs text-neutral-muted">Net Profit Margin (PAT)</span>
                <div className="text-2xl font-bold text-white mt-1">15.43%</div>
                <span className="text-[11px] text-emerald-400 mt-1 block">PAT: ₹6.94L</span>
              </GlassCard>

              <GlassCard>
                <span className="text-xs text-neutral-muted">Return on Assets (ROA)</span>
                <div className="text-2xl font-bold text-white mt-1">10.21%</div>
                <span className="text-[11px] text-neutral-muted mt-1 block">Benchmark: &gt;8%</span>
              </GlassCard>

              <GlassCard>
                <span className="text-xs text-neutral-muted">Return on Equity (ROE)</span>
                <div className="text-2xl font-bold text-white mt-1">18.27%</div>
                <span className="text-[11px] text-emerald-400 mt-1 block">Strong shareholder yield</span>
              </GlassCard>
            </div>
          </div>

          {/* Leverage & Efficiency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                3. Leverage & Solvency
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-navy-dark/60 border border-white/[0.05]">
                  <span className="text-neutral-muted block">Debt to Equity</span>
                  <span className="text-xl font-bold text-white mt-1 block">0.37x</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Conservative gearing (&lt;1.0)</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-dark/60 border border-white/[0.05]">
                  <span className="text-neutral-muted block">Interest Coverage</span>
                  <span className="text-xl font-bold text-white mt-1 block">14.69x</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Safe debt servicing (&gt;3.0x)</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-cyan mb-3">
                4. Operational Efficiency & Working Cycle
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-navy-dark/60 border border-white/[0.05]">
                  <span className="text-neutral-muted block">Days Sales Outstanding (DSO)</span>
                  <span className="text-xl font-bold text-white mt-1 block">56.8 Days</span>
                  <span className="text-[10px] text-amber-400 mt-1 block">Expedite Zenith collection</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-dark/60 border border-white/[0.05]">
                  <span className="text-neutral-muted block">Asset Turnover</span>
                  <span className="text-xl font-bold text-white mt-1 block">0.66x</span>
                  <span className="text-[10px] text-neutral-muted mt-1 block">Revenue / Total Assets</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* P&L Statement Tab */}
      {activeTab === 'pl' && (
        <GlassCard>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-white">Executive Profit & Loss Statement</h3>
              <p className="text-xs text-neutral-muted">Quarterly actuals and next quarter predictive run-rate</p>
            </div>
            <button
              onClick={handleExportExcel}
              className="text-xs text-accent-cyan hover:underline flex items-center gap-1 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-neutral-muted border-b border-white/[0.08]">
                  <th className="pb-3 font-medium">Financial Line Item</th>
                  <th className="pb-3 font-medium text-right">Q1 Actual (₹)</th>
                  <th className="pb-3 font-medium text-right">Q2 Projected (₹)</th>
                  <th className="pb-3 font-medium text-center">Variance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {statements?.pl?.map((row: any, i: number) => {
                  const isHighlight = row.name.includes('Profit') || row.name.includes('Revenue') || row.name.includes('EBIT');
                  return (
                    <tr key={i} className={isHighlight ? 'bg-white/[0.02] font-semibold' : 'text-neutral-muted'}>
                      <td className={`py-3 ${isHighlight ? 'text-white' : 'text-neutral-offwhite'}`}>
                        {row.name}
                      </td>
                      <td className="py-3 text-right font-mono">
                        ₹{Number(row.q1).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-right font-mono text-accent-cyan">
                        ₹{Number(row.q2).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          row.var.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-muted'
                        }`}>
                          {row.var}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* EBITDA & KPIs Tab */}
      {activeTab === 'kpis' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <GlassCard>
            <span className="text-xs text-neutral-muted">Annualized EBITDA</span>
            <div className="text-2xl font-bold text-white mt-1">₹42.00L</div>
            <p className="text-[11px] text-neutral-muted mt-2">
              Earnings before interest, taxes, depreciation, and amortization. Reflects core cash-generating capacity.
            </p>
          </GlassCard>

          <GlassCard>
            <span className="text-xs text-neutral-muted">Operating Expense Ratio</span>
            <div className="text-2xl font-bold text-white mt-1">27.78%</div>
            <p className="text-[11px] text-emerald-400 mt-2">
              Well within healthy SME threshold (&lt;35%).
            </p>
          </GlassCard>

          <GlassCard>
            <span className="text-xs text-neutral-muted">Estimated Break-even Revenue</span>
            <div className="text-2xl font-bold text-white mt-1">₹18.35L / Qtr</div>
            <p className="text-[11px] text-neutral-muted mt-2">
              Fixed costs / Gross margin ratio. Current revenue is 2.45x break-even requirements.
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

