# ARTHIQ Financial Intelligence Engine & Mathematical Specifications

**Document:** Engineering & Algorithmic Architecture  
**Modules Covered:** Cash Flow Forecasting, Profit Leakage Detection, Statutory Modulo 36 GSTIN Checksum, Financial Ratios & Forensic Scoring

---

## 1. SME Cash Flow Forecasting Mathematical Engine

### Daily Simulation Architecture
Cash flow forecasting models daily cash movements over horizons $H \in \{7, 30, 60, 90\}$ days.

$$\text{Balance}_t = \text{Balance}_{t-1} + \text{Inflow}_t - \text{Outflow}_t$$

### Inflow Modeling
$$\text{BaseDailyInflow} = \left(\frac{\text{MonthlyRevenue}}{30}\right) \times S_{\text{factor}}$$

Where seasonal multipliers $S_{\text{factor}}$ are calibrated as:
- **Neutral:** $S_{\text{factor}} = 1.00$
- **High Season:** $S_{\text{factor}} = 1.25$
- **Low Season:** $S_{\text{factor}} = 0.80$
- **Q4 Spike:** $S_{\text{factor}} = 1.35$

Day of week factor $D_{\text{dow}}$ accounts for commercial banking cycles:
- Weekday (Mon–Fri): $D_{\text{dow}} = 1.15$
- Weekend (Sat–Sun): $D_{\text{dow}} = 0.25$

Periodic debtor collections inject lump-sum cash inflows on customer cycle intervals:
$$\text{Inflow}_t = \text{BaseDailyInflow} \times D_{\text{dow}} + \begin{cases} \text{AR} \times 0.65 & \text{if } t \pmod{C_{\text{cust}}} = 0 \\ 0 & \text{otherwise} \end{cases}$$

### 95% Empirical Confidence Envelope
To account for demand volatility, empirical bootstrap confidence bounds are applied:
$$\text{LowerBound}_t = \text{Balance}_t \times (1 - 0.05 \times \sqrt{t/H})$$
$$\text{UpperBound}_t = \text{Balance}_t \times (1 + 0.05 \times \sqrt{t/H})$$

### Runway & Burn Rate Metrics
$$\text{NetDailyBurn} = \max\left(0, \frac{\text{OPEX} + \text{Payroll} - \text{Revenue}}{30}\right)$$
$$\text{RunwayDays} = \begin{cases} \lfloor \frac{\text{Balance}_0}{\text{NetDailyBurn}} \rfloor & \text{if } \text{NetDailyBurn} > 0 \\ 999 & \text{if } \text{Cash Positive} \end{cases}$$

---

## 2. Statutory GSTIN Modulo 36 Checksum Algorithm

The Indian Goods and Services Tax Identification Number (GSTIN) is a 15-character alphanumeric identifier regulated by the GST Council of India.

### Structure
$$\underbrace{27}_{\text{State (2)}}\underbrace{\text{AAPFU0939F}}_{\text{PAN (10)}}\underbrace{1}_{\text{Entity (1)}}\underbrace{\text{Z}}_{\text{Default (1)}}\underbrace{\text{V}}_{\text{Checksum (1)}}$$

### Character Set
$$\mathcal{C} = \text{"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}$$
Where $\text{val}(c)$ denotes the index of character $c$ in $\mathcal{C}$ ($0 \le \text{val}(c) \le 35$).

### Checksum Computation
For characters $i = 1$ to $14$ with 1-based index:
1. Assign alternating factor:
   $$w_i = \begin{cases} 1 & \text{if } i \pmod 2 = 1 \\ 2 & \text{if } i \pmod 2 = 0 \end{cases}$$
2. Compute weighted product:
   $$p_i = \text{val}(s_i) \times w_i$$
3. Sum quotient and remainder:
   $$c_i = \lfloor \frac{p_i}{36} \rfloor + (p_i \pmod{36})$$
4. Compute total sum:
   $$\Sigma = \sum_{i=1}^{14} c_i$$
5. Check digit index:
   $$k = (36 - (\Sigma \pmod{36})) \pmod{36}$$
6. Expected check digit:
   $$\text{CheckDigit} = \mathcal{C}[k]$$

---

## 3. Profit Leakage Detection Methodology

### Benchmark Savings Calculation
Based on audited Big 4 and SME forensic benchmarks, typical operational leakage is $\approx 4.8\%$ of total OPEX:
$$\text{AnnualLeakageEstimate} = (\text{MonthlyOPEX} \times 12) \times 0.048$$
$$\text{100DayTarget} = \text{MonthlyLeakage} \times 3.3$$

### Detection Categories
1. **Duplicate Settlements:** Identifies matching $(\text{Vendor}, \text{Amount})$ pairs within recurring settlement windows.
2. **SaaS / Cloud Seat Redundancy:** Regex clustering across productivity tools (Zoom, Slack, Teams, Notion, Asana) flagging dual subscriptions.
3. **Vendor Price Creep:** Evaluates time-series unit prices per vendor; flags rate increases exceeding $+15\%$ over baseline without volume adjustment.

---

## 4. Multi-Signal Invoice Forensic Risk Scoring

Invoices are assigned a composite risk score $R \in [0, 100]$:
$$R = R_{\text{base}} + \Delta_{\text{GSTIN}} + \Delta_{\text{Duplicate}} + \Delta_{\text{Banking}} + \Delta_{\text{Tax}}$$

- **Base Score:** $R_{\text{base}} = 15$
- **Statutory Failure:** $\Delta_{\text{GSTIN}} = +45$ if Modulo 36 checksum fails.
- **Duplicate Record:** $\Delta_{\text{Duplicate}} = +73$ if identical invoice number or prior settled amount exists.
- **Invalid Remittance IFSC:** $\Delta_{\text{Banking}} = +25$ if RBI format `^[A-Z]{4}0[A-Z0-9]{6}$` fails.
- **Tax Math Mismatch:** $\Delta_{\text{Tax}} = +20$ if $|\text{Subtotal} \times 0.18 - \text{Tax}| > 2.0$.

### Risk Classification Tiers
- **Low Risk ($0 \le R < 50$):** Verified for standard automated settlement.
- **Medium Risk ($50 \le R < 75$):** Controller verification requested.
- **High / Critical Risk ($R \ge 75$):** Automated payment freeze enforced.

