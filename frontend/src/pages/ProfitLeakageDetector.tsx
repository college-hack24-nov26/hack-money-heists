import React, { useEffect, useState } from 'react';
import {
  AlertOctagon,
  Sparkles,
  TrendingDown,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const ProfitLeakageDetector: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const loadData = () => {
    api.getLeakageFindings()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load leakage findings', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = async (id: string) => {
    await api.resolveLeakage(id);
    setResolvedIds([...resolvedIds, id]);
    loadData();
  };

  const totalLeakage = data?.totalIdentified || 85200;
  const annualSavings = data?.potentialAnnualSavings || 888400;
  const findings = data?.findings || [];

  return (
    <div className="space-y-6">
      {/* Signature Banner */}
      <div className="p-6 rounded-2xl glass-panel relative overflow-hidden bg-gradient-to-br from-rose-950/20 via-navy/60 to-midnight border border-accent-coral/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/20">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Profit Leakage Detector (PLD)
              </h1>
              <MetricBadge label="Signature Intelligence" variant="coral" />
            </div>
            <p className="text-xs text-neutral-muted mt-2 max-w-2xl leading-relaxed">
              ARTHIQ scans your entire general ledger, vendor contracts, invoice price deltas, and debtor cycles to expose where money is bleeding unnoticed.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-navy-dark/80 p-4 rounded-xl border border-white/[0.08]">
            <div>
              <span className="text-[11px] text-neutral-muted block">Identified Leakage</span>
              <span className="text-xl font-bold text-rose-400">
                ₹{totalLeakage.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-[11px] text-neutral-muted block">Annualized Savings Potential</span>
              <span className="text-xl font-bold text-emerald-400">
                ₹{annualSavings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: Verified Losses vs Suspected vs Estimated */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard>
          <span className="text-xs text-neutral-muted">Verified Immediate Losses</span>
          <div className="text-xl font-bold text-rose-400 mt-1">₹12,000.00</div>
          <span className="text-[11px] text-neutral-muted mt-1 block">Duplicate disbursement on PO-2024</span>
        </GlassCard>

        <GlassCard>
          <span className="text-xs text-neutral-muted">Suspected Operational Leakage</span>
          <div className="text-xl font-bold text-amber-400 mt-1">₹68,000.00</div>
          <span className="text-[11px] text-neutral-muted mt-1 block">Software overlaps + unannounced vendor rate hikes</span>
        </GlassCard>

        <GlassCard>
          <span className="text-xs text-neutral-muted">Projected Fee Optimization</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">₹5,200.00/mo</div>
          <span className="text-[11px] text-neutral-muted mt-1 block">Payment gateway MDR renegotiation</span>
        </GlassCard>
      </div>

      {/* List of Detected Profit Leakages */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Active Detected Leakages & Recommended Actions</h3>
        
        {findings.map((item: any) => {
          const isResolved = resolvedIds.includes(item.id);
          return (
            <GlassCard key={item.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-accent-cyan font-mono">
                    PLD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <span className="text-[11px] text-neutral-muted">
                      Category: {item.category} • Department: {item.department}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MetricBadge label={item.leakage_type} />
                  <div className="text-right">
                    <span className="text-sm font-bold text-rose-400 block font-mono">
                      ₹{item.estimated_financial_impact?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-400">
                      ₹{item.potential_annual_savings?.toLocaleString('en-IN')}/yr
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-navy-dark/60 border border-white/[0.04] space-y-1">
                  <span className="text-[10px] text-neutral-muted uppercase tracking-wider block">
                    Forensic Observation
                  </span>
                  <p className="text-neutral-offwhite leading-relaxed">{item.explanation}</p>
                  <p className="text-[11px] text-neutral-muted mt-1 italic">
                    Historical context: {item.historical_comparison}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20 space-y-1">
                  <span className="text-[10px] text-accent-cyan uppercase tracking-wider block font-semibold">
                    Recommended Corrective Action
                  </span>
                  <p className="text-neutral-offwhite leading-relaxed">{item.suggested_action}</p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-neutral-muted">
                  Beneficiary/Vendor: <strong className="text-neutral-offwhite">{item.vendor}</strong>
                </span>
                
                {isResolved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Cost Optimization Saved & Logged</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-midnight hover:bg-emerald-400 transition-colors shadow-emeraldGlow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Execute Fix & Recover ₹{item.estimated_financial_impact?.toLocaleString('en-IN')}</span>
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

