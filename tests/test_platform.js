/**
 * ARTHIQ Comprehensive End-to-End Platform Verification Test Suite
 * Tests all 8 core platform routes, backend endpoints, financial engines,
 * statutory GSTIN validation, profit leakage scanner, and AI assistant.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const FRONTEND_BASE = 'http://127.0.0.1:3000';
const BACKEND_BASE = 'http://127.0.0.1:4000';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

function recordResult(testName, passed, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`  [PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}: ${details}`);
  }
  results.push({ testName, passed, details });
}

function makeRequest(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (postData && !reqOptions.headers['Content-Length']) {
      reqOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = client.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runSuite() {
  console.log('\n=============================================================');
  console.log(' ARTHIQ AUTOMATED FULL-STACK VERIFICATION & QUALITY TEST');
  console.log('=============================================================\n');

  // TEST SUITE 1: Route Reachability & SPA History Navigation
  console.log('--- 1. Frontend Route Navigation & Direct URL Verification ---');
  const routes = [
    { name: 'Root Landing Page', path: '/' },
    { name: 'Smart Expense Analyzer', path: '/platform/expense-analyzer' },
    { name: 'Invoice Fraud Forensics', path: '/platform/invoice-forensics' },
    { name: 'SME Cash Flow Prediction', path: '/platform/cash-flow' },
    { name: 'Profit Leakage Detector', path: '/platform/profit-leakage' },
    { name: 'Financial Analytics & BI', path: '/platform/analytics' },
    { name: 'Client & Receivables Isolation', path: '/platform/receivables' },
    { name: 'Financial Risk Radar', path: '/platform/risk-radar' },
    { name: 'ARTHIQ AI Assistant', path: '/platform/ai-assistant' },
    { name: 'Login Portal', path: '/login' },
    { name: 'Register Portal', path: '/register' }
  ];

  for (const r of routes) {
    try {
      const res = await makeRequest(`${FRONTEND_BASE}${r.path}`);
      const ok = res.statusCode === 200 && res.body.includes('<div id="root">');
      recordResult(`Route ${r.path} (${r.name})`, ok, `HTTP ${res.statusCode}`);
    } catch (e) {
      recordResult(`Route ${r.path} (${r.name})`, false, e.message);
    }
  }

  // TEST SUITE 2: Core API Gateway & Overview
  console.log('\n--- 2. Core API Gateway & Dashboard Telemetry ---');
  try {
    const res = await makeRequest(`${BACKEND_BASE}/health`);
    const data = JSON.parse(res.body);
    recordResult('Backend /health Endpoint', data.status === 'online' || data.status === 'healthy', `Status: ${data.status}`);
  } catch (e) {
    recordResult('Backend /health Endpoint', false, e.message);
  }

  try {
    const res = await makeRequest(`${BACKEND_BASE}/api/dashboard/overview`);
    const data = JSON.parse(res.body);
    const ok = data.organization && data.kpis && data.kpis.availableCash > 0;
    recordResult('Dashboard Overview Telemetry', ok, `Org: ${data.organization}, Cash: ₹${data.kpis?.availableCash}`);
  } catch (e) {
    recordResult('Dashboard Overview Telemetry', false, e.message);
  }

  // TEST SUITE 3: Statutory Modulo 36 GSTIN Validation
  console.log('\n--- 3. Statutory GSTIN Modulo 36 Checksum Validation ---');
  const validGstin = '27AAPFU0939F1ZV';
  try {
    const res = await makeRequest(
      `${BACKEND_BASE}/api/invoices/validate-gstin`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify({ gstin: validGstin })
    );
    const data = JSON.parse(res.body);
    recordResult('Valid GSTIN Checksum (27AAPFU0939F1ZV)', data.isValid === true && data.stateName === 'Maharashtra', `State: ${data.stateName}`);
  } catch (e) {
    recordResult('Valid GSTIN Checksum', false, e.message);
  }

  const tamperedGstin = '27AAPFU0939F1Z0'; // Wrong check character
  try {
    const res = await makeRequest(
      `${BACKEND_BASE}/api/invoices/validate-gstin`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify({ gstin: tamperedGstin })
    );
    const data = JSON.parse(res.body);
    recordResult('Tampered GSTIN Checksum Rejection', data.isValid === false && data.reason.includes('Checksum mismatch'), `Reason: ${data.reason}`);
  } catch (e) {
    recordResult('Tampered GSTIN Checksum Rejection', false, e.message);
  }

  // TEST SUITE 4: Invoice Forensic Audit & Risk Scoring
  console.log('\n--- 4. Invoice Forensic Audit & Multi-Signal Scoring ---');
  try {
    const res = await makeRequest(`${BACKEND_BASE}/api/invoices/risk-summary`);
    const data = JSON.parse(res.body);
    const ok = data.totalInvoices > 0 && data.flaggedInvoices >= 0;
    recordResult('Invoice Risk Summary KPIs', ok, `Total: ${data.totalInvoices}, Flagged: ${data.flaggedInvoices}`);
  } catch (e) {
    recordResult('Invoice Risk Summary KPIs', false, e.message);
  }

  try {
    const auditPayload = {
      invoice_number: `TEST-DUP-${Date.now()}`,
      vendor_name: 'BrightPack Supplies', // Duplicate historical PO
      gstin: '27AAPFU0939F1ZV',
      total_amount: 26886.37, // Matches known duplicate amount
      invoice_date: '2026-11-04'
    };
    const res = await makeRequest(
      `${BACKEND_BASE}/api/invoices/analyze`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify(auditPayload)
    );
    const data = JSON.parse(res.body);
    const score = data.invoice?.risk_score;
    const isFlagged = score >= 50;
    recordResult('Duplicate Invoice Multi-Signal Detection', isFlagged, `Risk Score: ${score}/100, Anomalies: ${data.invoice?.anomalies_detected?.length}`);
  } catch (e) {
    recordResult('Duplicate Invoice Multi-Signal Detection', false, e.message);
  }

  // TEST SUITE 5: SME Cash Flow Prediction Engine
  console.log('\n--- 5. SME Cash Flow Prediction Simulation Engine ---');
  try {
    const scenarioPayload = {
      horizon_days: 60,
      safety_threshold: 600000,
      opening_cash: 2500000,
      monthly_revenue: 3000000,
      monthly_opex: 1800000,
      payroll_expense: 800000,
      customer_payment_cycle_days: 35,
      supplier_payment_cycle_days: 28,
      seasonal_revenue_pattern: 'q4_spike'
    };
    const res = await makeRequest(
      `${BACKEND_BASE}/api/cash-flow/forecast`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify(scenarioPayload)
    );
    const data = JSON.parse(res.body);
    const hasForecast = data.forecast && data.forecast.length === 60;
    const hasConfidence = data.confidence_interval_95 && data.confidence_interval_95.lower_bound;
    recordResult('60-Day Cash Flow Forecast with Monte Carlo / ML Envelope', hasForecast && hasConfidence, `Days: ${data.forecast?.length}, Projected End: ₹${Math.round(data.projected_ending_cash)}`);
  } catch (e) {
    recordResult('60-Day Cash Flow Forecast', false, e.message);
  }

  // TEST SUITE 6: Profit Leakage Detector (Signature Feature)
  console.log('\n--- 6. Profit Leakage Detector: Dynamic OPEX & Ledger Scanner ---');
  try {
    const res = await makeRequest(
      `${BACKEND_BASE}/api/leakage/calculate-savings`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify({ monthlyOpex: 4000000, recoveryRate: 0.048 })
    );
    const data = JSON.parse(res.body);
    const ok = data.estimatedMonthlyLeakage === 192000 && data.estimatedAnnualSavings === 2304000;
    recordResult('OPEX Leakage Recalculation Formula', ok, `Annual Savings: ₹${data.estimatedAnnualSavings}`);
  } catch (e) {
    recordResult('OPEX Leakage Recalculation Formula', false, e.message);
  }

  try {
    // Generate mock CSV ledger with duplicate transaction & price creep
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const csvContent = 
      'Date,Vendor,Amount,Category,Reference\n' +
      '2026-10-01,Cloud Hosting AWS,45000,Infrastructure,INV-AWS-01\n' +
      '2026-10-02,Cloud Hosting AWS,45000,Infrastructure,INV-AWS-01\n' +
      '2026-10-05,Slack Technologies,28000,Subscriptions,INV-SLK-99\n' +
      '2026-10-15,Logistics India,60000,Logistics,INV-LOG-11\n';

    let body = `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="ledgerFile"; filename="test_ledger.csv"\r\n`;
    body += `Content-Type: text/csv\r\n\r\n`;
    body += csvContent;
    body += `\r\n--${boundary}--\r\n`;

    const res = await makeRequest(
      `${BACKEND_BASE}/api/leakage/scan-ledger`,
      {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`
        }
      },
      body
    );
    const data = JSON.parse(res.body);
    const ok = data.transactionsParsed === 4 && data.newLeakagesFound > 0;
    recordResult('General Ledger CSV Forensic Parser & Anomaly Extractor', ok, `Rows: ${data.transactionsParsed}, Leakages: ${data.newLeakagesFound}`);
  } catch (e) {
    recordResult('General Ledger CSV Forensic Parser', false, e.message);
  }

  // TEST SUITE 7: AI Assistant Financial Chat
  console.log('\n--- 7. ARTHIQ Autonomous AI Financial Assistant ---');
  try {
    const res = await makeRequest(
      `${BACKEND_BASE}/api/assistant/chat`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify({ message: 'Where is my business losing unnecessary money?' })
    );
    const data = JSON.parse(res.body);
    const hasReply = data.reply && data.reply.content && data.reply.content.length > 50;
    recordResult('AI Assistant Financial Reasoning', hasReply, `Snippet: "${data.reply?.content.substring(0, 45)}..."`);
  } catch (e) {
    recordResult('AI Assistant Financial Reasoning', false, e.message);
  }

  // TEST SUITE 8: Unified Machine Learning Subsystems
  console.log('\n--- 8. Multi-Model ML Subsystems & Model Artifacts ---');
  try {
    const res = await makeRequest(`${BACKEND_BASE}/api/ml/models/versions`);
    const data = JSON.parse(res.body);
    const ok = data.platform_version === '1.0.0-enterprise' && data.algorithms?.invoice_fraud?.includes('XGBoost');
    recordResult('Deployed ML Algorithm Versions Telemetry', ok, `Algorithms: ${Object.keys(data.algorithms || {}).length}`);
  } catch (e) {
    recordResult('Deployed ML Algorithm Versions Telemetry', false, e.message);
  }

  try {
    const res = await makeRequest(`${BACKEND_BASE}/api/ml/models/status`);
    const data = JSON.parse(res.body);
    const ok = data.modules && data.modules.expense_analyzer?.status === 'TRAINED_AND_DEPLOYED';
    recordResult('Master ML Model Training Status Report', ok, `Modules: ${Object.keys(data.modules || {}).length}`);
  } catch (e) {
    recordResult('Master ML Model Training Status Report', false, e.message);
  }

  try {
    const res = await makeRequest(
      `${BACKEND_BASE}/api/ml/procurement/optimize`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify({ vendors: [{ vendor_name: 'Vendor A', total_spend: 150000 }, { vendor_name: 'Vendor B', total_spend: 25000 }, { vendor_name: 'Vendor C', total_spend: 98000 }] })
    );
    const data = JSON.parse(res.body);
    const ok = data.clusters_count === 3 && data.silhouette_score !== undefined;
    recordResult('K-Means Vendor Clustering & Ridge Optimization', ok, `Silhouette: ${data.silhouette_score}, Clusters: ${data.clusters_count}`);
  } catch (e) {
    recordResult('K-Means Vendor Clustering & Ridge Optimization', false, e.message);
  }

  try {
    const res = await makeRequest(
      `${BACKEND_BASE}/api/assistant/query`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify({ query: 'Where is my business losing unnecessary money?' })
    );
    const data = JSON.parse(res.body);
    const ok = data.tool_invoked === 'scan_profit_leakage' && data.reply_content?.length > 40;
    recordResult('Autonomous Financial Assistant RAG & Tool Dispatcher', ok, `Tool: ${data.tool_invoked}()`);
  } catch (e) {
    recordResult('Autonomous Financial Assistant RAG & Tool Dispatcher', false, e.message);
  }

  // SUMMARY
  console.log('\n=============================================================');
  console.log(` TEST SUMMARY: ${passedTests} / ${totalTests} PASSED (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  if (failedTests > 0) {
    console.log(` FAILED TESTS: ${failedTests}`);
  } else {
    console.log(' ALL SUITES PASSED PERFECTLY!');
  }
  console.log('=============================================================\n');

  return { totalTests, passedTests, failedTests, results };
}

runSuite().catch(console.error);
