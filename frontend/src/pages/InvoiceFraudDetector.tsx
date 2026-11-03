import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  UploadCloud,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Building2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const InvoiceFraudDetector: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'verified'>('all');
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload modal inputs
  const [invNum, setInvNum] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [gstin, setGstin] = useState('');
  const [amount, setAmount] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');

  const loadInvoices = () => {
    api.getInvoices().then((res) => {
      const list = res.invoices || [];
      setInvoices(list);
      if (list.length > 0 && !selectedInvoice) {
        // default select the highest risk one
        const highRisk = list.find((i: any) => i.risk_score >= 50) || list[0];
        setSelectedInvoice(highRisk);
      }
    });
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    if (invNum) formData.append('invoice_number', invNum);
    if (vendorName) formData.append('vendor_name', vendorName);
    if (gstin) formData.append('gstin', gstin);
    if (amount) formData.append('total_amount', amount);
    if (bankAcc) formData.append('bank_account', bankAcc);
    if (bankIfsc) formData.append('bank_ifsc', bankIfsc);

    const res = await api.uploadInvoice(formData);
    setUploading(false);
    setShowUploadModal(false);
    setInvNum('');
    setVendorName('');
    setGstin('');
    setAmount('');
    setBankAcc('');
    setBankIfsc('');

    if (res.invoice) {
      setSelectedInvoice(res.invoice);
    }
    loadInvoices();
  };

  const handleVerify = async (id: string) => {
    const res = await api.verifyInvoice(id);
    if (res.invoice) {
      setSelectedInvoice(res.invoice);
      loadInvoices();
    }
  };

  const filteredInvoices = invoices.filter((i) => {
    if (filter === 'flagged') return i.risk_score >= 50 || i.status === 'FLAGGED';
    if (filter === 'verified') return i.status === 'VERIFIED' || i.status === 'PAID';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-black font-['Plus_Jakarta_Sans']">
              Intelligent Invoice Fraud & Forensic Detector
            </h1>
            <MetricBadge label="OCR & Checksum Audit" variant="emerald" />
          </div>
          <p className="text-xs text-black mt-1 max-w-2xl">
            Statutory GSTIN checksum verification, RBI IFSC validation, duplicate disbursement hashing, tax calculation consistency, and Benford's Law anomaly detection.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors shadow-glow"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload & Verify Invoice</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Invoices List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2 p-1 bg-navy/60 rounded-xl border border-[#E2E8F0] text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'all' ? 'bg-accent-blue/20 text-white border border-accent-blue/30' : 'text-black'
              }`}
            >
              All Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`flex-1 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'flagged' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-black'
              }`}
            >
              Flagged ({invoices.filter((i) => i.risk_score >= 50).length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`flex-1 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-black'
              }`}
            >
              Verified ({invoices.filter((i) => i.status === 'VERIFIED' || i.status === 'PAID').length})
            </button>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-navy/90 border-accent-blue/50 shadow-[0_0_15px_-3px_rgba(86,139,255,0.2)]'
                      : 'glass-panel hover:bg-[#F8FAFC]/70 border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-black">#{inv.invoice_number}</span>
                    <MetricBadge label={inv.risk_classification} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-black">{inv.vendor_name}</span>
                    <span className="font-bold text-black">
                      ₹{inv.total_amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-black/70">
                    <span>Date: {inv.invoice_date}</span>
                    <span className="text-accent-cyan font-mono">Score: {inv.risk_score}/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Forensic Audit View */}
        <div className="lg:col-span-7">
          {selectedInvoice ? (
            <GlassCard className="p-6 space-y-6">
              {/* Header with Risk Meter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-black font-mono">
                      #{selectedInvoice.invoice_number}
                    </h2>
                    <MetricBadge label={selectedInvoice.risk_classification} />
                  </div>
                  <p className="text-xs text-black mt-1 flex items-center gap-2">
                    <span>{selectedInvoice.vendor_name}</span>
                    <span>•</span>
                    <span>Dated: {selectedInvoice.invoice_date}</span>
                  </p>
                </div>

                {/* Risk Gauge Pill */}
                <div className="text-right">
                  <span className="text-[11px] text-black uppercase tracking-wider block">
                    Forensic Risk Meter
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          selectedInvoice.risk_score >= 80
                            ? 'bg-rose-500'
                            : selectedInvoice.risk_score >= 55
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${selectedInvoice.risk_score}%` }}
                      />
                    </div>
                    <span className="text-base font-bold text-black font-mono">
                      {selectedInvoice.risk_score}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAFC]/70 border border-[#E2E8F0]">
                  <span className="text-black block text-[10px]">Subtotal (Excl Tax)</span>
                  <span className="font-bold text-black mt-1 block">
                    ₹{selectedInvoice.subtotal?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC]/70 border border-[#E2E8F0]">
                  <span className="text-black block text-[10px]">GST Rate</span>
                  <span className="font-bold text-black mt-1 block font-mono">
                    {selectedInvoice.gst_rate || 18}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC]/70 border border-[#E2E8F0]">
                  <span className="text-black block text-[10px]">Tax Amount</span>
                  <span className="font-bold text-black mt-1 block">
                    ₹{selectedInvoice.tax_amount?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC]/70 border border-[#E2E8F0]">
                  <span className="text-black block text-[10px]">Total Billed</span>
                  <span className="font-bold text-accent-cyan mt-1 block">
                    ₹{selectedInvoice.total_amount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Statutory & Banking Credentials */}
              <div className="p-4 rounded-xl bg-[#F8FAFC]/50 border border-[#E2E8F0] text-xs space-y-2">
                <h4 className="font-semibold text-black text-[11px] uppercase tracking-wider text-black">
                  Statutory & Remittance Authentication
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-black block text-[10px]">Vendor GSTIN</span>
                    <span className="font-mono text-white mt-0.5 block">
                      {selectedInvoice.gstin || 'None / Not itemized'}
                    </span>
                  </div>
                  <div>
                    <span className="text-black block text-[10px]">Remittance IFSC / Account</span>
                    <span className="font-mono text-white mt-0.5 block">
                      {selectedInvoice.bank_ifsc || 'HDFC0000002'} • Acc #{selectedInvoice.bank_account || '00021020008899'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detected Anomalies */}
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-black">Detected Forensic Anomalies:</h4>
                <div className="space-y-2">
                  {selectedInvoice.anomalies_detected?.map((anomaly: string, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{anomaly}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Evidence */}
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-black">Forensic Evidence & Findings:</h4>
                <ul className="list-disc pl-5 space-y-1 text-black leading-relaxed">
                  {selectedInvoice.supporting_evidence?.map((ev: string, i: number) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Actionable Verification Steps */}
              <div className="p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-xs space-y-2">
                <h4 className="font-semibold text-accent-cyan flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mandatory CFO Verification Protocol:</span>
                </h4>
                <ol className="list-decimal pl-5 space-y-1 text-black">
                  {selectedInvoice.recommended_verification_steps?.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <span className="text-[11px] text-black">
                  Never declare fraud without human controller verification.
                </span>
                <div className="flex items-center gap-3">
                  {selectedInvoice.status !== 'VERIFIED' && selectedInvoice.status !== 'PAID' && (
                    <button
                      onClick={() => handleVerify(selectedInvoice.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-midnight hover:bg-emerald-400 transition-colors shadow-emeraldGlow flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Verified by Controller</span>
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="p-12 text-center text-black glass-panel rounded-2xl">
              <FileCheck2 className="w-10 h-10 mx-auto text-black/50 mb-3" />
              <p className="text-xs">Select an invoice from the list to view its forensic audit report.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Invoice Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl glass-panel p-6 border border-[#E2E8F0] shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans']">
                Upload & Audit Invoice
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-black hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drag & Drop Simulation Area */}
            <div className="mt-4 p-5 rounded-xl border-2 border-dashed border-white/15 text-center bg-[#F8FAFC] hover:border-accent-blue/40 transition-colors">
              <UploadCloud className="w-8 h-8 text-accent-blue mx-auto mb-2" />
              <p className="text-xs font-medium text-black">Drag & drop invoice document (PDF, PNG, JPG, XLSX)</p>
              <p className="text-[11px] text-black mt-1">Automatic OCR extraction for GSTIN, items & total</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black mb-1">Invoice Number</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2026-9901"
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 54000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black mb-1">Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Logistics, SysMatrix"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black mb-1">Vendor GSTIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAPFU0939F1ZV"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1">Remittance IFSC</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0000002"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-white focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-black font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold shadow-glow disabled:opacity-50"
                >
                  {uploading ? 'Analyzing...' : 'Run Forensic Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

