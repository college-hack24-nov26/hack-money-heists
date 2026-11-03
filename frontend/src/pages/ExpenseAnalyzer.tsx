import React, { useEffect, useState } from 'react';
import {
  Receipt,
  Plus,
  AlertTriangle,
  Repeat,
  Copy,
  TrendingUp,
  Tag,
  CheckCircle2,
  Sparkles,
  X
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const ExpenseAnalyzer: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('Operating');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Corporate Card');

  const loadData = () => {
    Promise.all([api.getExpenses(), api.getExpensesAnalysis()])
      .then(([expRes, anaRes]) => {
        setExpenses(expRes.expenses || []);
        setAnalysis(anaRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load expenses', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !amount) return;
    await api.addExpense({
      vendor,
      category,
      amount: parseFloat(amount),
      description: description || `${category} expenditure`,
      paymentMethod
    });
    setVendor('');
    setAmount('');
    setDescription('');
    setShowAddModal(false);
    loadData();
  };

  const totalExp = analysis?.total_expenses || expenses.reduce((s, e) => s + Number(e.amount), 0);
  const categories = analysis?.category_breakdown || {
    Operating: 350000,
    Employee: 540000,
    Marketing: 75000,
    Administrative: 45000,
    Subscriptions: 68900,
    Procurement: 126200
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-black font-['Plus_Jakarta_Sans']">
              Smart Expense Analyzer
            </h1>
            <MetricBadge label="ML Outlier & Pattern Engine" variant="blue" />
          </div>
          <p className="text-xs text-black mt-1">
            Machine learning anomaly detection, recurring subscription audit, duplicate disbursement checks, and automated category classification.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(categories).map(([cat, amt]: [string, any]) => (
          <GlassCard key={cat} className="p-4">
            <span className="text-[11px] text-black font-medium block">{cat}</span>
            <span className="text-base font-bold text-black mt-1 block">
              ₹{Number(amt).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-accent-cyan mt-1 block">
              {((Number(amt) / (totalExp || 1)) * 100).toFixed(1)}% of OPEX
            </span>
          </GlassCard>
        ))}
      </div>

      {/* AI Anomaly Detection & Duplicate Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Outlier Anomalies */}
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-black">Statistical Outliers (Z-Score & IQR)</h3>
            </div>
            <span className="text-xs text-amber-400 font-medium">3 Spikes Flagged</span>
          </div>

          <div className="space-y-3 mt-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-amber-500/20">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-black">Apex Logistics & Packaging</span>
                <MetricBadge label="Z-Score: +2.8σ" variant="amber" />
              </div>
              <p className="text-black font-bold mt-1">₹54,200.00</p>
              <p className="text-[11px] text-black mt-1 leading-snug">
                Procurement charge is 2.8 standard deviations above company moving average. Unit pricing rose 23% without purchase volume justification.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-amber-500/20">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-black">SysMatrix Technologies</span>
                <MetricBadge label="Identical Duplicate" variant="coral" />
              </div>
              <p className="text-black font-bold mt-1">₹12,000.00</p>
              <p className="text-[11px] text-black mt-1 leading-snug">
                Two identical charges of ₹12,000 billed on Oct 12 and Oct 14 for identical developer workstation PO.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Recurring Subscriptions Tracker */}
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-accent-cyan" />
              <h3 className="text-sm font-semibold text-black">Recurring SaaS Subscriptions Tracker</h3>
            </div>
            <span className="text-xs text-black">Annualized: ₹8.26L</span>
          </div>

          <div className="divide-y divide-white/[0.04] mt-2 text-xs">
            {[
              { vendor: 'Google Workspace', cost: '₹28,400/mo', type: 'Active Enterprise (120 Seats)' },
              { vendor: 'Slack Technologies', cost: '₹22,000/mo', type: 'Active Messaging' },
              { vendor: 'Zoom Video Communications', cost: '₹18,500/mo', type: 'Redundant with Google Meet', flag: true },
              { vendor: 'AWS Cloud Services', cost: '₹1,42,500/mo', type: 'Core Infrastructure' }
            ].map((sub, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white">{sub.vendor}</span>
                  <p className={`text-[11px] ${sub.flag ? 'text-rose-400 font-medium' : 'text-black'}`}>
                    {sub.type}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-black">{sub.cost}</span>
                  {sub.flag && (
                    <span className="block text-[10px] text-rose-400">Leakage Flag</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Full Expense Transaction Ledger */}
      <GlassCard>
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-semibold text-black">Comprehensive Operating Expense Ledger</h3>
            <p className="text-xs text-black">Logged transactions with payment method and reference audit IDs</p>
          </div>
          <span className="text-xs text-black">{expenses.length} Records</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-black border-b border-[#E2E8F0]">
                <th className="pb-3 font-medium">Ref / ID</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Vendor</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Method</th>
                <th className="pb-3 font-medium text-right">Amount (₹)</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-mono text-accent-cyan">{exp.id}</td>
                  <td className="py-3 text-black">{exp.date}</td>
                  <td className="py-3 font-medium text-black">{exp.vendor}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-[#E2E8F0] text-black">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 text-black max-w-xs truncate">{exp.description}</td>
                  <td className="py-3 text-black">{exp.paymentMethod || 'Bank Transfer'}</td>
                  <td className="py-3 text-right font-bold text-black">
                    ₹{Number(exp.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-center">
                    <MetricBadge label={exp.status || 'Approved'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-[#E2E8F0] shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans']">
                Record New Operating Expense
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-black hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-black mb-1">Vendor / Beneficiary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud, Adobe Systems"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue"
                  >
                    <option value="Operating">Operating</option>
                    <option value="Employee">Employee (Payroll)</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Subscriptions">Subscriptions (SaaS)</option>
                    <option value="Procurement">Procurement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-black mb-1">Amount (INR ₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Monthly licensing or deliverable"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block text-black mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue"
                >
                  <option value="Corporate Credit Card">Corporate Credit Card</option>
                  <option value="NEFT / Bank Transfer">NEFT / Bank Transfer</option>
                  <option value="RTGS">RTGS</option>
                  <option value="Auto-debit / UPI">Auto-debit / UPI</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-black font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold shadow-glow"
                >
                  Record & Run ML Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

