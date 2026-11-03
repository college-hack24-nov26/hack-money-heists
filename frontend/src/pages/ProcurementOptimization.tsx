import React, { useEffect, useState } from 'react';
import {
  ShoppingCart,
  TrendingDown,
  AlertTriangle,
  Building2,
  DollarSign,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const ProcurementOptimization: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    api.getProcurementVendors().then((res) => setVendors(res.vendors || []));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-black font-['Plus_Jakarta_Sans']">
              Procurement Cost Optimization & Vendor Benchmarking
            </h1>
            <MetricBadge label="Price Fluctuation Engine" variant="amber" />
          </div>
          <p className="text-xs text-black mt-1 max-w-xl">
            Track vendor price fluctuations, detect duplicate purchase orders, benchmark supplier tier rates, and eliminate procurement leakage.
          </p>
        </div>
      </div>

      {/* Flagged Procurement Inefficiency */}
      <GlassCard className="p-5 border border-accent-coral/20 bg-rose-950/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-black">Critical Procurement Price Creep Alert</h3>
          </div>
          <MetricBadge label="+23% Rate Hike" variant="coral" />
        </div>
        <p className="text-xs text-black leading-relaxed">
          <strong className="text-white">Apex Logistics & Packaging</strong> raised shipment unit pricing from ₹320 to ₹394 over the past two billing cycles. Our models show no corresponding increase in purchase volume, weight, or delivery speed. Annualized cost leakage: <strong className="text-rose-400">₹4,10,400</strong>.
        </p>
        <div className="pt-2 flex items-center gap-3">
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors">
            Initiate Vendor Rate Benchmark RFQ
          </button>
        </div>
      </GlassCard>

      {/* Vendor Spending & Comparison Matrix */}
      <GlassCard>
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-black">Vendor Spend Directory & Price Risk</h3>
          <span className="text-xs text-black">{vendors.length} Approved Suppliers</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-black border-b border-[#E2E8F0]">
                <th className="pb-3 font-medium">Supplier / Vendor</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-center">Orders</th>
                <th className="pb-3 font-medium text-right">Total Billed</th>
                <th className="pb-3 font-medium text-center">Price Escalation Risk</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {vendors.map((v: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-medium text-black">{v.vendor}</td>
                  <td className="py-3 text-black">{v.category}</td>
                  <td className="py-3 text-center text-black">{v.transactionCount}</td>
                  <td className="py-3 text-right font-bold text-black font-mono">
                    ₹{v.totalSpend?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-center">
                    <MetricBadge label={v.priceEscalationRisk} />
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-accent-cyan hover:underline text-xs">
                      Analyze Quotes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

