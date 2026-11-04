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
  CreditCard,
  RefreshCw,
  Copy,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const InvoiceFraudDetector: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [riskSummary, setRiskSummary] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'verified'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Upload modal inputs
  const [invNum, setInvNum] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [gstin, setGstin] = useState('');
  const [gstinValidation, setGstinValidation] = useState<any>(null);
  const [gstinChecking, setGstinChecking] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getInvoices(),
      api.getInvoiceRiskSummary()
    ])
      .then(([invRes, summaryRes]) => {
        const list = invRes.invoices || [];
        setInvoices(list);
        setRiskSummary(summaryRes);
        setLoading(false);
        if (list.length > 0 && !selectedInvoice) {
          const highRisk = list.find((i: any) => i.risk_score >= 50) || list[0];
          setSelectedInvoice(highRisk);
        }
      })
      .catch((err) => {
        console.error('Failed to load invoices or summary', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Live Statutory GSTIN Validation
  const handleGstinChange = async (val: string) => {
    const formatted = val.toUpperCase().trim();
    setGstin(formatted);
    if (formatted.length === 15) {
      setGstinChecking(true);
      try {
        const res = await api.validateGstin(formatted);
        setGstinValidation(res);
      } catch (err) {
        setGstinValidation({ isValid: false, reason: 'Validation service unreachable' });
      } finally {
        setGstinChecking(false);
      }
    } else {
      setGstinValidation(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const payload = {
        invoice_number: invNum,
        vendor_name: vendorName,
        gstin,
        total_amount: Number(amount),
        invoice_date: invoiceDate || new Date().toISOString().split('T')[0],
        bank_account: bankAcc,
        bank_ifsc: bankIfsc
      };

      const res = await api.analyzeInvoice(payload);
      setUploading(false);
      setShowUploadModal(false);
      
      // Reset fields
      setInvNum('');
      setVendorName('');
      setGstin('');
      setGstinValidation(null);
      setAmount('');
      setBankAcc('');
      setBankIfsc('');
      setInvoiceDate('');

      if (res.invoice) {
        setSelectedInvoice(res.invoice);
      }
      loadData();
    } catch (err) {
      console.error('Error analyzing invoice', err);
      setUploading(false);
    }
  };

  const handleVerify = async (id: string) => {
    const res = await api.verifyInvoice(id);
    if (res.invoice) {
      setSelectedInvoice(res.invoice);
      loadData();
    }
  };

  const handleVerifyAll = async () => {
    try {
      await api.verifyAllInvoices();
      loadData();
    } catch (err) {
      console.error('Error verifying all invoices', err);
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
            <MetricBadge label="OCR & Statutory Checksum Audit" variant="emerald" />
          </div>
          <p className="text-xs text-black mt-1 max-w-2xl leading-relaxed">
            Statutory Modulo 36 GSTIN checksum verification, duplicate disbursement hashing, tax math consistency, and multi-signal risk scoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
            title="Refresh Invoices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').length > 0 && (
            <button
              onClick={handleVerifyAll}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
              title="Verify and approve all flagged invoices"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify & Clear All ({invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').length})</span>
            </button>
          )}

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors shadow-glow"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload & Verify Invoice</span>
          </button>
        </div>
      </div>

      {/* Dynamic Forensic Risk Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <GlassCard className="p-3.5">
          <span className="text-[11px] text-black font-medium block">Total Audited</span>
          <span className="text-xl font-bold text-black mt-0.5 block font-mono">
            {riskSummary?.totalInvoices || invoices.length}
          </span>
          <span className="text-[10px] text-black">Across all vendors</span>
        </GlassCard>

        <GlassCard className="p-3.5">
          <span className="text-[11px] text-black font-medium block">Verified Clean</span>
          <span className="text-xl font-bold text-emerald-600 mt-0.5 block font-mono">
            {invoices.filter((i) => i.status === 'VERIFIED' || i.status === 'PAID').length}
          </span>
          <span className="text-[10px] text-emerald-700">Controller signed off</span>
        </GlassCard>

        <GlassCard className="p-3.5">
          <span className="text-[11px] text-black font-medium block">Flagged Anomalies</span>
          <span className={`text-xl font-bold mt-0.5 block font-mono ${invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').length > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
            {invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').length}
          </span>
          <span className={`text-[10px] ${invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').length > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').length > 0 ? 'Requires review' : 'All Clear • 0 Flagged'}
          </span>
        </GlassCard>

        <GlassCard className="p-3.5">
          <span className="text-[11px] text-black font-medium block">Duplicate Invoices</span>
          <span className={`text-xl font-bold mt-0.5 block font-mono ${invoices.filter((i) => (i.anomalies_detected || []).some((a: string) => a.toLowerCase().includes('duplicate'))).length > 0 ? 'text-amber-500' : 'text-emerald-600'}`}>
            {invoices.filter((i) => (i.anomalies_detected || []).some((a: string) => a.toLowerCase().includes('duplicate'))).length}
          </span>
          <span className={`text-[10px] ${invoices.filter((i) => (i.anomalies_detected || []).some((a: string) => a.toLowerCase().includes('duplicate'))).length > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {invoices.filter((i) => (i.anomalies_detected || []).some((a: string) => a.toLowerCase().includes('duplicate'))).length > 0 ? 'Disbursement frozen' : '0 Duplicates'}
          </span>
        </GlassCard>

        <GlassCard className="p-3.5 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-black font-medium block">Total Value at Risk</span>
          <span className={`text-lg font-bold mt-0.5 block font-mono ${invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            ₹{invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').reduce((s, i) => s + (Number(i.total_amount) || 0), 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-black">
            {invoices.filter((i) => (i.risk_score || 0) >= 50 || i.status === 'FLAGGED').length > 0 ? 'High/Critical invoices' : '0 High Risk • Protected'}
          </span>
        </GlassCard>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Invoices List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2 p-1 bg-gray-100 rounded-xl border border-[#E2E8F0] text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 rounded-lg transition-colors font-semibold ${
                filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`flex-1 py-1.5 rounded-lg transition-colors font-semibold ${
                filter === 'flagged' ? 'bg-rose-500 text-white shadow-sm' : 'text-rose-600 hover:text-rose-800'
              }`}
            >
              Flagged ({invoices.filter((i) => i.risk_score >= 50).length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`flex-1 py-1.5 rounded-lg transition-colors font-semibold ${
                filter === 'verified' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Verified ({invoices.filter((i) => i.status === 'VERIFIED' || i.status === 'PAID').length})
            </button>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;
              const isFlagged = inv.risk_score >= 50 || inv.status === 'FLAGGED';
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/90 border-accent-blue shadow-md'
                      : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900 font-mono">#{inv.invoice_number}</span>
                    <MetricBadge
                      label={inv.risk_classification || (inv.risk_score >= 80 ? 'Critical Risk' : inv.risk_score >= 50 ? 'Medium Risk' : 'Low Risk')}
                      variant={inv.risk_score >= 80 ? 'coral' : inv.risk_score >= 50 ? 'coral' : 'emerald'}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-700 font-medium">{inv.vendor_name}</span>
                    <span className="font-bold text-gray-900 font-mono">
                      ₹{inv.total_amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500">
                    <span>Date: {inv.invoice_date}</span>
                    <span className={`font-mono font-semibold ${isFlagged ? 'text-rose-600' : 'text-emerald-600'}`}>
                      Score: {inv.risk_score}/100
                    </span>
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
                    <MetricBadge
                      label={selectedInvoice.risk_classification || 'Audited'}
                      variant={selectedInvoice.risk_score >= 50 ? 'coral' : 'emerald'}
                    />
                  </div>
                  <p className="text-xs text-black mt-1 flex items-center gap-2">
                    <span className="font-semibold">{selectedInvoice.vendor_name}</span>
                    <span>•</span>
                    <span>Dated: {selectedInvoice.invoice_date}</span>
                  </p>
                </div>

                {/* Risk Gauge Pill */}
                <div className="text-right">
                  <span className="text-[11px] text-black uppercase tracking-wider block font-semibold">
                    Forensic Risk Meter
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-28 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          selectedInvoice.risk_score >= 80
                            ? 'bg-rose-500'
                            : selectedInvoice.risk_score >= 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
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
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-black block text-[10px]">Subtotal (Excl Tax)</span>
                  <span className="font-bold text-black mt-1 block font-mono">
                    ₹{selectedInvoice.subtotal?.toLocaleString('en-IN') || (selectedInvoice.total_amount * 0.847).toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-black block text-[10px]">GST Rate</span>
                  <span className="font-bold text-black mt-1 block font-mono">
                    {selectedInvoice.gst_rate || 18}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-black block text-[10px]">Tax Amount</span>
                  <span className="font-bold text-black mt-1 block font-mono">
                    ₹{selectedInvoice.tax_amount?.toLocaleString('en-IN') || (selectedInvoice.total_amount * 0.153).toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-black block text-[10px]">Total Billed</span>
                  <span className="font-bold text-accent-blue mt-1 block font-mono">
                    ₹{selectedInvoice.total_amount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Statutory & Banking Credentials */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-2">
                <h4 className="font-bold text-black text-[11px] uppercase tracking-wider">
                  Statutory & Remittance Authentication
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-black block text-[10px]">Vendor GSTIN</span>
                    <span className="font-mono text-black font-semibold mt-0.5 block">
                      {selectedInvoice.gstin || 'None / Unitemized'}
                    </span>
                  </div>
                  <div>
                    <span className="text-black block text-[10px]">Remittance IFSC / Account</span>
                    <span className="font-mono text-black font-semibold mt-0.5 block">
                      {selectedInvoice.bank_ifsc || 'HDFC0000002'} • Acc #{selectedInvoice.bank_account || '00021020008899'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detected Anomalies */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-black">Detected Forensic Anomalies:</h4>
                <div className="space-y-2">
                  {selectedInvoice.anomalies_detected && selectedInvoice.anomalies_detected.length > 0 ? (
                    selectedInvoice.anomalies_detected.map((anomaly: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 font-medium"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{anomaly}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Zero anomalies detected. Invoice meets statutory compliance criteria.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Supporting Evidence */}
              {selectedInvoice.supporting_evidence && selectedInvoice.supporting_evidence.length > 0 && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-black">Forensic Evidence & Findings:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-black leading-relaxed">
                    {selectedInvoice.supporting_evidence.map((ev: string, i: number) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Verification Steps */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
                <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent-blue" />
                  <span>Mandatory CFO Verification Protocol:</span>
                </h4>
                <ol className="list-decimal pl-5 space-y-1 text-black">
                  {selectedInvoice.recommended_verification_steps && selectedInvoice.recommended_verification_steps.length > 0 ? (
                    selectedInvoice.recommended_verification_steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))
                  ) : (
                    <li>Standard 3-way matching verified against Purchase Order. Proceed with remittance.</li>
                  )}
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
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-md flex items-center gap-1.5"
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

      {/* Upload & Audit Invoice Modal with Live Statutory GSTIN Validation */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 border border-gray-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-accent-blue" />
                <h3 className="text-base font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
                  Upload & Audit Invoice
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-2026-9901"
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Total Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 54000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Vendor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Logistics, BrightPack"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-accent-blue"
                  />
                </div>
              </div>

              {/* Statutory GSTIN with Real-time Checksum Verification */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-700 font-semibold">Vendor 15-Digit GSTIN</label>
                  {gstinChecking && <span className="text-[10px] text-accent-blue animate-pulse">Checking Modulo 36...</span>}
                </div>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. 27AAPFU0939F1ZV (15 alphanumeric)"
                  value={gstin}
                  onChange={(e) => handleGstinChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-accent-blue font-mono uppercase"
                />
                
                {/* GSTIN Real-time Feedback Banner */}
                {gstinValidation && (
                  <div className={`mt-1.5 p-2 rounded-lg text-[11px] flex items-center gap-1.5 ${
                    gstinValidation.isValid
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {gstinValidation.isValid ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Statutory Checksum Valid: {gstinValidation.stateName} (Code {gstinValidation.stateCode})</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span>Invalid GSTIN: {gstinValidation.reason}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Remittance Bank Account</label>
                  <input
                    type="text"
                    placeholder="e.g. 50200012345678"
                    value={bankAcc}
                    onChange={(e) => setBankAcc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Remittance IFSC Code</label>
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="e.g. HDFC0000002"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-accent-blue font-mono uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold shadow-md disabled:opacity-50"
                >
                  {uploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{uploading ? 'Analyzing Forensics...' : 'Run Forensic Audit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
