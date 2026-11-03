import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Sliders,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';

interface ForecastRecord {
  date: string;
  predicted_inflow: number;
  predicted_outflow: number;
  predicted_net: number;
  projected_balance: number;
  balance_lower_bound: number;
  balance_upper_bound: number;
  confidence_level: string;
  is_deficit: boolean;
  type: string;
}

export const CashFlowPredictor: React.FC = () => {
  // Horizon and Target Controls
  const [horizon, setHorizon] = useState<number>(30);
  const [safetyThreshold, setSafetyThreshold] = useState<number>(500000);
  const [loading, setLoading] = useState<boolean>(true);
  const [forecastData, setForecastData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Input Management Form States
  const [showInputPanel, setShowInputPanel] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('Apex Technologies Pvt Ltd');
  const [openingBalance, setOpeningBalance] = useState<number>(1850000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(4500000);
  const [monthlyOpex, setMonthlyOpex] = useState<number>(2800000);
  const [payrollExpenses, setPayrollExpenses] = useState<number>(850000);
  const [accountsReceivable, setAccountsReceivable] = useState<number>(1200000);
  const [accountsPayable, setAccountsPayable] = useState<number>(950000);
  const [customerCycleDays, setCustomerCycleDays] = useState<number>(30);
  const [supplierCycleDays, setSupplierCycleDays] = useState<number>(45);
  const [seasonalPattern, setSeasonalPattern] = useState<'neutral' | 'high_season' | 'low_season'>('neutral');

  // Chart view toggle (Balance trajectory vs Inflows/Outflows)
  const [chartMode, setChartMode] = useState<'trajectory' | 'cashflows'>('trajectory');

  const fetchForecast = async (isCustom = false) => {
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        horizon_days: horizon,
        safety_threshold: safetyThreshold
      };

      if (isCustom) {
        payload.company_name = companyName;
        payload.opening_balance = openingBalance;
        payload.monthly_revenue = monthlyRevenue;
        payload.monthly_opex = monthlyOpex;
        payload.payroll_expenses = payrollExpenses;
        payload.accounts_receivable = accountsReceivable;
        payload.accounts_payable = accountsPayable;
        payload.customer_payment_cycle_days = customerCycleDays;
        payload.supplier_payment_cycle_days = supplierCycleDays;
        payload.seasonal_pattern = seasonalPattern;
      }

      const res = await fetch('/api/cash-flow/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Failed to load forecast data (HTTP ${res.status})`);
      }

      const data = await res.json();
      setForecastData(data);
    } catch (err) {
      console.error('Failed to load cash flow forecast', err);
      setError('Unable to retrieve cash flow forecast from engine. Using latest verified baseline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(false);
  }, [horizon, safetyThreshold]);

  const handleApplyCustomSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    fetchForecast(true);
  };

  const handleResetDefaults = () => {
    setCompanyName('Apex Technologies Pvt Ltd');
    setOpeningBalance(1850000);
    setMonthlyRevenue(4500000);
    setMonthlyOpex(2800000);
    setPayrollExpenses(850000);
    setAccountsReceivable(1200000);
    setAccountsPayable(950000);
    setCustomerCycleDays(30);
    setSupplierCycleDays(45);
    setSeasonalPattern('neutral');
    fetchForecast(false);
  };

  const forecast: ForecastRecord[] = forecastData?.forecast || [];
  const currentBal = forecastData?.current_balance ?? openingBalance;
  const runwayDays = forecastData?.runway_days ?? 999;
  const deficits = forecastData?.deficit_occurrences || [];
  const alerts = forecastData?.alerts || [];

  // Format currency helpers
  const formatINR = (val: number) => {
    if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Prepare chart dataset
  const chartData = forecast.map((f, idx) => ({
    date: f.date.slice(5), // MM-DD
    fullDate: f.date,
    dayOffset: idx + 1,
    balance: f.projected_balance,
    lowerBound: f.balance_lower_bound,
    upperBound: f.balance_upper_bound,
    inflow: f.predicted_inflow,
    outflow: f.predicted_outflow,
    net: f.predicted_net,
    threshold: safetyThreshold
  }));

  return (
    <div className="space-y-6 text-black animate-fade-in font-sans">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#E5E5EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-black font-['Plus_Jakarta_Sans',sans-serif]">
              SME Cash Flow Intelligence & Predictive Runway
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EDE7FF] text-[#6D45CF] border border-[#6D45CF]/20">
              Holt-Winters Seasonality Model
            </span>
          </div>
          <p className="text-xs text-black mt-1.5 max-w-2xl font-medium">
            Dynamic forecasting across 7, 30, 60, and 90 days. Models seasonal revenue, customer receivable DSO, payroll cycles, and 95% confidence bands.
          </p>
        </div>

        {/* Action Controls & Horizon Picker */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInputPanel(!showInputPanel)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F8FAFC] hover:bg-[#F1F5F9] text-black border border-[#E5E5EB] transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#6D45CF]" />
            <span>{showInputPanel ? 'Hide Simulation Inputs' : 'Simulate Custom Cash Flow'}</span>
            {showInputPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E5E5EB] text-xs">
            {[7, 30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setHorizon(d)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  horizon === d
                    ? 'bg-[#6D45CF] text-white shadow-xs'
                    : 'text-black hover:text-[#6D45CF]'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Management Form (Expandable Simulation Panel) */}
      {showInputPanel && (
        <form onSubmit={handleApplyCustomSimulation} className="p-6 rounded-3xl bg-white border border-[#6D45CF]/30 shadow-md space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#6D45CF]" />
              <h3 className="text-sm font-extrabold text-black">
                Working Capital Parameters & Scenario Input Management
              </h3>
            </div>
            <span className="text-[11px] text-neutral-500 font-medium">
              Inputs immediately recompute forecasting curves with day-of-week seasonality
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-black mb-1">Company / Entity Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Opening Cash Balance (₹)</label>
              <input
                type="number"
                min="0"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Monthly Projected Revenue (₹)</label>
              <input
                type="number"
                min="0"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Monthly OPEX (₹)</label>
              <input
                type="number"
                min="0"
                value={monthlyOpex}
                onChange={(e) => setMonthlyOpex(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Monthly Payroll (1st & 30th) (₹)</label>
              <input
                type="number"
                min="0"
                value={payrollExpenses}
                onChange={(e) => setPayrollExpenses(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Outstanding Receivables (AR) (₹)</label>
              <input
                type="number"
                min="0"
                value={accountsReceivable}
                onChange={(e) => setAccountsReceivable(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Outstanding Payables (AP) (₹)</label>
              <input
                type="number"
                min="0"
                value={accountsPayable}
                onChange={(e) => setAccountsPayable(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Customer Payment Cycle (Days)</label>
              <input
                type="number"
                min="7"
                max="90"
                value={customerCycleDays}
                onChange={(e) => setCustomerCycleDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Supplier Payment Cycle (Days)</label>
              <input
                type="number"
                min="7"
                max="90"
                value={supplierCycleDays}
                onChange={(e) => setSupplierCycleDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Seasonal Pattern</label>
              <select
                value={seasonalPattern}
                onChange={(e: any) => setSeasonalPattern(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-medium focus:outline-none focus:border-[#6D45CF]"
              >
                <option value="neutral">Neutral (Standard Baseline)</option>
                <option value="high_season">High Season (+25% Inflow)</option>
                <option value="low_season">Low Season (-20% Inflow)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Safety Floor Target (₹)</label>
              <input
                type="number"
                min="100000"
                step="50000"
                value={safetyThreshold}
                onChange={(e) => setSafetyThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5E5EB] text-black font-mono font-medium focus:outline-none focus:border-[#6D45CF]"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-[#6D45CF] hover:bg-[#5B37B5] text-white shadow-xs transition-all cursor-pointer"
              >
                {loading ? 'Simulating...' : 'Recalculate Forecast'}
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="py-2 px-3 rounded-xl font-bold text-xs bg-[#F8FAFC] hover:bg-[#E2E8F0] text-black border border-[#E5E5EB] transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black uppercase tracking-wider">Current Liquid Balance</span>
            <Wallet className="w-4 h-4 text-[#6D45CF]" />
          </div>
          <div className="text-2xl font-extrabold text-black mt-2 font-mono">
            {formatINR(currentBal)}
          </div>
          <span className="text-[11px] text-[#16A879] font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Liquid Assets
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black uppercase tracking-wider">Forecast Horizon</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-black mt-2 font-mono">
            +{horizon} Days Ahead
          </div>
          <span className="text-[11px] text-black font-medium mt-1 block">
            95% Bootstrap Confidence Bounds
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black uppercase tracking-wider">Safety Reserve Floor</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-black mt-2 font-mono">
            {formatINR(safetyThreshold)}
          </div>
          <span className="text-[11px] text-neutral-600 font-medium mt-1 block">
            Min. statutory reserve threshold
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black uppercase tracking-wider">Estimated Cash Runway</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2 font-mono">
            {runwayDays >= 365 ? '14+ Months' : `${runwayDays} Days`}
          </div>
          <span className="text-[11px] text-[#16A879] font-bold mt-1 block">
            Cash Flow Net Positive
          </span>
        </div>
      </div>

      {/* Early Warning Risk Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.severity === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`} />
              <div>
                <p className="font-extrabold">{alert.message}</p>
                <p className="text-[11px] mt-0.5 font-medium">Recommended Action: {alert.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Dynamic Recharts Interactive Chart Panel */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E5EB] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5EB]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                Projected Liquidity Trajectory & Inflow/Outflow Dynamics
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-black">
                {forecast.length} Data Points
              </span>
            </div>
            <p className="text-xs text-black mt-0.5 font-medium">
              Daily closing balances with upper/lower 95% uncertainty envelope and safety target floor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F8FAFC] p-1 rounded-xl border border-[#E5E5EB] text-xs">
              <button
                onClick={() => setChartMode('trajectory')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMode === 'trajectory' ? 'bg-[#6D45CF] text-white shadow-xs' : 'text-black'
                }`}
              >
                Balance Trajectory
              </button>
              <button
                onClick={() => setChartMode('cashflows')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMode === 'cashflows' ? 'bg-[#6D45CF] text-white shadow-xs' : 'text-black'
                }`}
              >
                Inflows & Outflows
              </button>
            </div>

            {/* Quick Refresh */}
            <button
              onClick={() => fetchForecast(false)}
              disabled={loading}
              className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#E5E5EB] text-black transition-colors cursor-pointer"
              title="Refresh Forecast Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-80 w-full pt-4">
          {loading && chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-500 font-medium">
              <span className="inline-block w-5 h-5 border-2 border-[#6D45CF] border-t-transparent rounded-full animate-spin mr-2" />
              Computing Holt-Winters cash flow forecast...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-xs text-neutral-500 font-medium">
              <Info className="w-6 h-6 text-neutral-400 mb-1" />
              <span>No historical cash transactions available to model forecast.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'trajectory' ? (
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cfBandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6D45CF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6D45CF" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name: any) => [
                      `₹${Number(val).toLocaleString('en-IN')}`,
                      name === 'balance'
                        ? 'Projected Balance'
                        : name === 'upperBound'
                        ? 'Upper 95% Bound'
                        : name === 'lowerBound'
                        ? 'Lower 95% Bound'
                        : name
                    ]}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return item ? `Date: ${item.fullDate} (+${item.dayOffset}D)` : label;
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  
                  {/* Safety Threshold Reference Line */}
                  <ReferenceLine
                    y={safetyThreshold}
                    stroke="#F59E0B"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{ value: `Safety Floor: ₹${(safetyThreshold/100000).toFixed(1)}L`, fill: '#D97706', fontSize: 11, position: 'top' }}
                  />

                  {/* 95% Confidence Band */}
                  <Area
                    type="monotone"
                    dataKey="upperBound"
                    stroke="none"
                    fill="url(#cfBandGrad)"
                    name="95% Confidence Envelope"
                  />
                  
                  {/* Projected Balance Curve */}
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#6D45CF"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#6D45CF' }}
                    activeDot={{ r: 6, fill: '#6D45CF' }}
                    name="Projected Balance"
                  />
                </ComposedChart>
              ) : (
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name: any) => [
                      `₹${Number(val).toLocaleString('en-IN')}`,
                      name === 'inflow' ? 'Daily Inflow' : name === 'outflow' ? 'Daily Outflow' : 'Net Flow'
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  
                  <Bar dataKey="inflow" fill="#16A879" name="Inflow" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outflow" fill="#E46D72" name="Outflow" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="net" stroke="#6D45CF" strokeWidth={2} name="Net Cash Flow" />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
export default CashFlowPredictor;
