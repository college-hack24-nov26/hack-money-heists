import React, { useEffect, useState } from 'react';
import {
  Users2,
  Plus,
  Building,
  Mail,
  Phone,
  CreditCard,
  Clock,
  ShieldCheck,
  X
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  const loadClients = () => {
    api.getClients().then((res) => setClients(res.clients || []));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyName) return;
    await api.addClient({
      name,
      companyName,
      gstin,
      email,
      creditLimit: parseFloat(creditLimit) || 1000000
    });
    setName('');
    setCompanyName('');
    setGstin('');
    setEmail('');
    setCreditLimit('');
    setShowAddModal(false);
    loadClients();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Client & Enterprise Accounts Receivable
            </h1>
            <MetricBadge label="Multi-Tenant Isolation" variant="blue" />
          </div>
          <p className="text-xs text-neutral-muted mt-1 max-w-xl">
            Client profiles, GSTIN validation, Days Sales Outstanding (DSO) tracking, credit limits, and debtor collection monitoring.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Client</span>
        </button>
      </div>

      {/* Clients Table */}
      <GlassCard>
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Client Portfolio Directory</h3>
          <span className="text-xs text-neutral-muted">{clients.length} Enterprise Accounts</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-neutral-muted border-b border-white/[0.06]">
                <th className="pb-3 font-medium">Client / Company</th>
                <th className="pb-3 font-medium">GSTIN</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium text-right">Outstanding (₹)</th>
                <th className="pb-3 font-medium text-center">DSO (Days)</th>
                <th className="pb-3 font-medium text-center">Risk Profile</th>
                <th className="pb-3 font-medium text-right">Credit Limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5">
                    <span className="font-semibold text-white block">{c.companyName}</span>
                    <span className="text-[11px] text-neutral-muted">{c.name}</span>
                  </td>
                  <td className="py-3.5 font-mono text-neutral-muted">{c.gstin}</td>
                  <td className="py-3.5 text-neutral-muted">{c.email}</td>
                  <td className="py-3.5 text-right font-bold text-white font-mono">
                    ₹{c.outstandingBalance?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      c.daysSalesOutstanding > 60 ? 'bg-rose-500/15 text-rose-400' : 'text-neutral-offwhite'
                    }`}>
                      {c.daysSalesOutstanding}d
                    </span>
                  </td>
                  <td className="py-3.5 text-center">
                    <MetricBadge label={c.riskProfile} />
                  </td>
                  <td className="py-3.5 text-right font-mono text-neutral-muted">
                    ₹{c.creditLimit?.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Onboard Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                Onboard Enterprise Client
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-neutral-muted mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wipro Technologies Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-dark border border-white/10 text-white focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block text-neutral-muted mb-1">Primary Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Iyer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-dark border border-white/10 text-white focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-muted mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="29AAACW1234D1ZZ"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-dark border border-white/10 text-white focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-muted mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    placeholder="1500000"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-dark border border-white/10 text-white focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-muted mb-1">Accounts Email</label>
                <input
                  type="email"
                  placeholder="billing@wipro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-dark border border-white/10 text-white focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-offwhite font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold shadow-glow"
                >
                  Save & Validate Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

