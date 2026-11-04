import React, { useEffect, useState, useRef } from 'react';
import {
  AlertOctagon,
  Sparkles,
  TrendingDown,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  UploadCloud,
  FileSpreadsheet,
  Sliders,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';
import { api } from '../services/api';

export const ProfitLeakageDetector: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedIds, setResolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arthiq_resolved_leakages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Interactive OPEX Slider State
  const [monthlyOpex, setMonthlyOpex] = useState<number>(2500000);
  const [savingsEstimate, setSavingsEstimate] = useState<any>(null);
  const [calculatingSavings, setCalculatingSavings] = useState<boolean>(false);

  // Scan Ledger Modal State
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    setLoading(true);
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
    recalculateSavings(monthlyOpex);
  }, []);

  const recalculateSavings = (opex: number) => {
    setCalculatingSavings(true);
    api.calculateLeakageSavings(opex)
      .then((res) => {
        setSavingsEstimate(res);
        setCalculatingSavings(false);
      })
      .catch((err) => {
        console.error('Error calculating savings', err);
        setCalculatingSavings(false);
      });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMonthlyOpex(val);
    recalculateSavings(val);
  };

  const handleResolve = async (id: string) => {
    try {
      await api.resolveLeakage(id);
      setResolvedIds((prev) => {
        const next = [...prev, id];
        try { localStorage.setItem('arthiq_resolved_leakages', JSON.stringify(next)); } catch {}
        return next;
      });
      loadData();
    } catch (err) {
      console.error('Failed to resolve leakage', err);
    }
  };

  const handleResolveAll = async () => {
    try {
      await api.resolveAllLeakages();
      const allIds = findings.map((f: any) => f.id);
      setResolvedIds(allIds);
      try { localStorage.setItem('arthiq_resolved_leakages', JSON.stringify(allIds)); } catch {}
      loadData();
    } catch (err) {
      console.error('Failed to resolve all leakages', err);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setScanFile(e.dataTransfer.files[0]);
    }
  };

  const handleExecuteScan = async () => {
    if (!scanFile) return;
    setScanning(true);
    setScanError(null);
    try {
      const formData = new FormData();
      formData.append('ledgerFile', scanFile);
      const res = await api.scanLedger(formData);
      if (res.error) {
        setScanError(res.error);
      } else {
        setScanResult(res);
        // Refresh findings to include newly parsed items
        loadData();
      }
    } catch (err: any) {
      setScanError(err.message || 'Ledger scan failed. Check file format.');
    } finally {
      setScanning(false);
    }
  };

  const annualSavings = savingsEstimate?.estimatedAnnualSavings || data?.potentialAnnualSavings || 888400;
  const findings = data?.findings || [];

  // Compute live KPI splits from findings
  const verifiedLosses = findings
    .filter((f: any) => f.leakage_type === 'Verified Loss' && !resolvedIds.includes(f.id))
    .reduce((sum: number, f: any) => sum + (f.estimated_financial_impact || 0), 0);

  const suspectedLeakage = findings
    .filter((f: any) => f.leakage_type === 'Suspected Leakage' && !resolvedIds.includes(f.id))
    .reduce((sum: number, f: any) => sum + (f.estimated_financial_impact || 0), 0);

  const estimatedOptimizations = findings
    .filter((f: any) => f.leakage_type === 'Estimated Savings' && !resolvedIds.includes(f.id))
    .reduce((sum: number, f: any) => sum + (f.estimated_financial_impact || 0), 0);

  const totalLeakage = verifiedLosses + suspectedLeakage;

  return (
    <div className="space-y-6">
      {/* Signature Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden text-black">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-violet-50 text-[#6D45CF] border border-violet-100">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-black font-['Plus_Jakarta_Sans']">
                Profit Leakage Detector (PLD)
              </h1>
              <MetricBadge label="Signature Intelligence" variant="coral" />
            </div>
            <p className="text-xs text-black mt-2 max-w-2xl leading-relaxed">
              ARTHIQ scans your entire general ledger, vendor contracts, invoice price deltas, and debtor cycles to expose where money is bleeding unnoticed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6D45CF] text-white font-semibold text-xs hover:bg-[#5B37B5] transition-colors shadow-sm cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Scan Your Ledger</span>
            </button>

            {verifiedLosses > 0 && (
              <button
                onClick={handleResolveAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
                title="Resolve all detected leakages and clear red losses"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolve All & Recover Losses</span>
              </button>
            )}

            <div className="flex items-center gap-4 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <div>
                <span className="text-[11px] text-black block">Active Leakage</span>
                <span className={`text-lg font-bold ${totalLeakage > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {totalLeakage > 0 ? `₹${totalLeakage.toLocaleString('en-IN')}` : '₹0 (Safe)'}
                </span>
              </div>
              <div className="h-8 w-px bg-[#CBD5E1]" />
              <div>
                <span className="text-[11px] text-black block">Potential Savings</span>
                <span className="text-lg font-bold text-emerald-600">
                  ₹{annualSavings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive OPEX Slider Card */}
      <GlassCard className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-accent-blue" />
              <h2 className="text-sm font-bold text-black">Live OPEX Leakage & Recovery Calculator</h2>
            </div>
            <p className="text-xs text-black mt-1">
              Adjust your monthly operating expenses to calculate potential profit recovery using ARTHIQ's audited 4.8% benchmark.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-black block">Monthly Operating Expenses (OPEX)</span>
            <span className="text-xl font-bold text-accent-blue font-mono">
              ₹{monthlyOpex.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <input
            type="range"
            min="500000"
            max="20000000"
            step="250000"
            value={monthlyOpex}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
          />
          <div className="flex justify-between text-[11px] text-black font-mono">
            <span>₹5,00,000 / mo</span>
            <span>₹1,00,00,000 / mo</span>
            <span>₹2,00,00,000 / mo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[11px] text-black block">Estimated Monthly Leakage</span>
              <span className={`text-base font-bold font-mono mt-0.5 block ${totalLeakage > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                {totalLeakage > 0
                  ? `₹${(savingsEstimate?.estimatedMonthlyLeakage || Math.round(monthlyOpex * 0.048)).toLocaleString('en-IN')}`
                  : '₹0 (0% Leakage • Mitigated)'}
              </span>
              <span className="text-[10px] text-black">
                {totalLeakage > 0 ? '~4.8% typical SME leakage rate' : 'Audited: Zero active leakage detected'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-800 block font-semibold">Annual Recoverable Cash</span>
              <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">
                ₹{(savingsEstimate?.estimatedAnnualSavings || Math.round(monthlyOpex * 0.048 * 12)).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-700">Straight to EBITDA bottom line</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[11px] text-blue-800 block font-semibold">100-Day Payback Target</span>
              <span className="text-base font-bold text-blue-600 font-mono mt-0.5 block">
                ₹{(savingsEstimate?.hundredDayTarget || Math.round(monthlyOpex * 0.048 * 3.3)).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-blue-700">Immediate working capital boost</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* KPI Cards: Verified Losses vs Suspected vs Estimated */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs text-black font-semibold">Verified Immediate Losses</span>
            {verifiedLosses === 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                100% Mitigated
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                Action Required
              </span>
            )}
          </div>
          <div className={`text-xl font-bold mt-1 ${verifiedLosses > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
            {verifiedLosses > 0 ? `₹${verifiedLosses.toLocaleString('en-IN')}` : '₹0'}
          </div>
          <span className="text-[11px] text-black mt-1 block">
            {verifiedLosses > 0 ? 'Duplicate disbursements & confirmed billing overlaps' : 'No active leakages • All funds protected'}
          </span>
          {verifiedLosses > 0 && (
            <button
              onClick={handleResolveAll}
              className="mt-3 w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mitigate & Recover ₹{verifiedLosses.toLocaleString('en-IN')}</span>
            </button>
          )}
        </GlassCard>

        <GlassCard>
          <span className="text-xs text-black font-semibold">Suspected Operational Leakage</span>
          <div className="text-xl font-bold text-amber-600 mt-1">₹{suspectedLeakage.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-black mt-1 block">Software seat overlaps + unannounced vendor rate hikes</span>
        </GlassCard>

        <GlassCard>
          <span className="text-xs text-black font-semibold">Projected Fee Optimization</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">₹{estimatedOptimizations.toLocaleString('en-IN')}/mo</div>
          <span className="text-[11px] text-black mt-1 block">Payment gateway interchange & banking fee renegotiation</span>
        </GlassCard>
      </div>

      {/* List of Detected Profit Leakages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">Active Detected Leakages & Recommended Actions</h3>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 text-xs text-black hover:text-black transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Findings</span>
          </button>
        </div>

        {findings.length === 0 && !loading && (
          <GlassCard className="p-8 text-center text-black">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-black">No active profit leakages detected</p>
            <p className="text-xs mt-1">Your ledger is clean or all flagged leakages have been resolved.</p>
          </GlassCard>
        )}
        
        {findings.map((item: any) => {
          const isResolved = resolvedIds.includes(item.id) || item.status === 'Resolved';
          return (
            <GlassCard key={item.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-[#E2E8F0] flex items-center justify-center font-bold text-xs text-accent-blue font-mono">
                    PLD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black">{item.title}</h4>
                    <span className="text-[11px] text-black">
                      Category: {item.category} • Department: {item.department}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MetricBadge label={item.leakage_type} />
                  <div className="text-right">
                    <span className="text-sm font-bold text-rose-500 block font-mono">
                      ₹{item.estimated_financial_impact?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      ₹{item.potential_annual_savings?.toLocaleString('en-IN')}/yr
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-black uppercase tracking-wider block font-semibold">
                    Forensic Observation
                  </span>
                  <p className="text-black leading-relaxed">{item.explanation}</p>
                  <p className="text-[11px] text-black mt-1 italic">
                    Historical context: {item.historical_comparison}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <span className="text-[10px] text-blue-900 uppercase tracking-wider block font-semibold">
                    Recommended Corrective Action
                  </span>
                  <p className="text-black leading-relaxed">{item.suggested_action}</p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-black">
                  Beneficiary/Vendor: <strong className="text-black">{item.vendor}</strong>
                </span>
                
                {isResolved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 text-xs font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Cost Optimization Saved & Logged</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-md"
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

      {/* Scan Your Ledger Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-accent-coral" />
                <h3 className="text-base font-bold text-gray-900">Scan General Ledger with ARTHIQ</h3>
              </div>
              <button
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanFile(null);
                  setScanResult(null);
                  setScanError(null);
                }}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Upload your company's transactions report or general ledger (CSV or Excel). ARTHIQ inspects transaction lines to catch duplicate payments, software seat redundancies, and vendor price hikes.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-accent-coral rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50/60"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setScanFile(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              {scanFile ? (
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-accent-blue">
                  <FileText className="w-4 h-4" />
                  <span>{scanFile.name} ({(scanFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-semibold text-gray-700 block">
                    Click to browse or drag & drop CSV or Excel ledger
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Supported: .csv, .xlsx (Columns: Date, Vendor, Amount, Category)
                  </span>
                </div>
              )}
            </div>

            {scanError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {scanError}
              </div>
            )}

            {scanResult && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Scan Completed: {scanResult.transactionsParsed} rows parsed</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
                  <div>New Leakages: <strong>{scanResult.newLeakagesFound}</strong></div>
                  <div>Financial Value: <strong className="text-rose-600">₹{scanResult.newLeakageAmount?.toLocaleString('en-IN')}</strong></div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanFile(null);
                  setScanResult(null);
                  setScanError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!scanFile || scanning}
                onClick={handleExecuteScan}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-accent-coral text-white hover:bg-rose-600 transition-colors disabled:opacity-50 shadow-md"
              >
                {scanning && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{scanning ? 'Scanning Ledger...' : 'Run Forensic Scan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
