import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Users,
  CreditCard,
  FileText
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const RiskManagement: React.FC = () => {
  const [riskData, setRiskData] = useState<any>(null);

  useEffect(() => {
    api.getFinancialRatios().then((res) => setRiskData(res));
  }, []);

  const healthScore = riskData?.financial_health_score || 84;
  const radar = riskData?.risk_radar || {
    liquidity_risk: 18,
    profitability_risk: 22,
    credit_risk: 15,
    operational_risk: 42,
    fraud_risk: 16
  };

  const riskFactors = [
    {
      title: "Liquidity & Cash Buffer Risk",
      score: radar.liquidity_risk,
      status: "Safe (18%)",
      desc: "Current ratio of 2.0x and liquid cash of ₹18.5L exceeds 3-month operational requirements.",
      action: "Maintain current working capital reserves."
    },
    {
      title: "Profitability & Margin Risk",
      score: radar.profitability_risk,
      status: "Safe (22%)",
      desc: "Gross profit margin of 51% provides strong pricing resilience against inflationary input costs.",
      action: "Monitor logistics packaging price creep."
    },
    {
      title: "Customer Credit & Default Risk",
      score: radar.credit_risk,
      status: "Low (15%)",
      desc: "Zenith Global Logistics holds ₹3.10L overdue at 74 days sales outstanding (DSO).",
      action: "Initiate prompt payment discount and automated payment follow-up."
    },
    {
      title: "Operational & Vendor Concentration",
      score: radar.operational_risk,
      status: "Moderate (42%)",
      desc: "Top 2 clients account for 58% of gross revenue; top infrastructure vendor represents 42% of OPEX.",
      action: "Diversify client pipeline across mid-tier accounts."
    },
    {
      title: "Invoice Forensic & Fraud Indicators",
      score: radar.fraud_risk,
      status: "Watch (16%)",
      desc: "3 invoices currently on forensic hold for duplicate number and unverified vendor GSTIN.",
      action: "Complete two-tier verification before disbursement."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Financial Risk Management & Early Warning System
            </h1>
            <MetricBadge label="Autonomous Risk Radar" variant="emerald" />
          </div>
          <p className="text-xs text-neutral-muted mt-1 max-w-xl">
            Proactive monitoring of liquidity stress, credit defaults, vendor dependency risks, and statutory tax compliance.
          </p>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-dark border border-white/[0.08]">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-[10px] text-neutral-muted block uppercase tracking-wider">Health Score</span>
            <span className="text-xl font-extrabold text-white font-mono">{healthScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Risk Radar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {riskFactors.map((rf, idx) => (
          <GlassCard key={idx} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white">{rf.title}</h3>
              <MetricBadge label={rf.status} />
            </div>

            {/* Gauge bar */}
            <div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    rf.score > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${rf.score}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-neutral-muted leading-relaxed">{rf.desc}</p>

            <div className="pt-2 border-t border-white/[0.05] text-[11px] text-accent-cyan flex items-start gap-1.5">
              <span className="font-semibold text-white">Mitigation:</span>
              <span>{rf.action}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Active Early Warning Triggers */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Live Proactive Warning Triggers</h3>
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Debtor Days Alert: Zenith Global Logistics (74 Days Overdue)</p>
              <p className="text-[11px] opacity-80 mt-1">
                Outstanding balance ₹3,10,000 exceeds standard 30-day net terms. Estimated working capital carry cost: ₹15,300.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Vendor Price Creep: Apex Logistics (+23% Cost Spike)</p>
              <p className="text-[11px] opacity-80 mt-1">
                Per-unit shipment cost escalated from ₹320 to ₹394 with zero volume growth. Recommendation: Trigger rate matching RFQ.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

