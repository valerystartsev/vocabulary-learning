import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import {
  Car, Percent, Calendar, Wallet, CheckCircle, RotateCcw, Info,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

// Section is marked done once the student has moved at least 2 of the 4
// sliders (i.e. they've actively explored the simulator, not just glanced).
const DONE_THRESHOLD = 2;

// Standard annuity (PMT) formula:
//   M = P × r × (1+r)^n / ((1+r)^n − 1)
// where r is the monthly rate (annualRate / 12 / 100) and n is the number
// of months. Falls back to P/n when rate is zero.
function calcMonthly(principal, annualRatePct, months) {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

// Walk through every month and accumulate how much of each payment goes
// toward the principal vs interest. Returns an array of length `months`.
function amortizationSchedule(principal, annualRatePct, months, monthlyPayment) {
  const r = annualRatePct / 100 / 12;
  const rows = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = r === 0 ? 0 : balance * r;
    let principalPaid = monthlyPayment - interest;
    if (principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    rows.push({
      month: i,
      principal: Math.max(0, Math.round(principalPaid)),
      interest: Math.max(0, Math.round(interest)),
    });
  }
  return rows;
}

// Ruble formatter — non-breaking spaces between thousands, currency suffix
const fmtRub = (n) => {
  const rounded = Math.round(n);
  return `${rounded.toLocaleString('ru-RU').replace(/,/g, ' ')} ₽`;
};
const fmtRubShort = (n) => {
  // For chart axis ticks — convert to thousands
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return String(Math.round(n));
};

export default function LoanSimulator({ data, unitId, isTeacherMode }) {
  const { markSectionComplete, saveSectionScore } = useProgress();
  const defaults = data?.defaults || { price: 1500000, downPaymentPct: 20, termMonths: 36, ratePct: 14.5 };
  const sliders = data?.sliders || {
    price:          { min: 500000, max: 5000000, step: 50000, label: 'Car price', labelRu: 'Цена' },
    downPaymentPct: { min: 0,      max: 50,      step: 1,     label: 'Down payment', labelRu: 'Первый взнос' },
    termMonths:     { min: 6,      max: 60,      step: 6,     label: 'Term',  labelRu: 'Срок' },
    ratePct:        { min: 5,      max: 25,      step: 0.5,   label: 'Rate',  labelRu: 'Ставка' },
  };

  const [price, setPrice]         = useState(defaults.price);
  const [downPct, setDownPct]     = useState(defaults.downPaymentPct);
  const [months, setMonths]       = useState(defaults.termMonths);
  const [rate, setRate]           = useState(defaults.ratePct);
  const [slidersTouched, setSlidersTouched] = useState(new Set());
  const [markedDone, setMarkedDone] = useState(false);

  // Derived values — recompute on any slider change
  const { downPaymentAmount, principal, monthly, totalPaid, totalOverpay, totalCost, schedule } = useMemo(() => {
    const dp = price * (downPct / 100);
    const p = price - dp;
    const m = calcMonthly(p, rate, months);
    const paid = m * months;
    const overpay = paid - p;
    const cost = dp + paid;
    const sched = amortizationSchedule(p, rate, months, m);
    return {
      downPaymentAmount: dp,
      principal: p,
      monthly: m,
      totalPaid: paid,
      totalOverpay: overpay,
      totalCost: cost,
      schedule: sched,
    };
  }, [price, downPct, months, rate]);

  const touch = (key, setter) => (e) => {
    setter(Number(e.target.value));
    setSlidersTouched(prev => new Set([...prev, key]));
  };

  useEffect(() => {
    if (!markedDone && slidersTouched.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      // Score scales with how many of the 4 sliders the student tried.
      saveSectionScore?.(unitId, 'loansim', Math.round((slidersTouched.size / 4) * 100));
      markSectionComplete?.(unitId, 'loansim');
    }
  }, [slidersTouched, markedDone, unitId, markSectionComplete, saveSectionScore]);

  useEffect(() => {
    if (isTeacherMode) {
      setSlidersTouched(new Set(['price', 'downPct', 'months', 'rate']));
    }
  }, [isTeacherMode]);

  const resetAll = () => {
    setPrice(defaults.price);
    setDownPct(defaults.downPaymentPct);
    setMonths(defaults.termMonths);
    setRate(defaults.ratePct);
  };

  const sliderStyle = { accentColor: 'var(--col-accent)' };

  return (
    <div className="mb-8">
      {/* Intro */}
      <div className="mb-4">
        {data?.description && (
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
            {data.description}
          </p>
        )}
        {data?.descriptionRu && (
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
            {data.descriptionRu}
          </p>
        )}
      </div>

      {/* Output cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        <OutputCard
          label="Monthly payment"
          labelRu="Ежемесячный платёж"
          value={fmtRub(monthly)}
          hint={`× ${months} months`}
          color="var(--col-accent)"
          primary
        />
        <OutputCard
          label="Total overpay"
          labelRu="Переплата по процентам"
          value={fmtRub(totalOverpay)}
          hint="interest only"
          color="#B87820"
        />
        <OutputCard
          label="Loan amount"
          labelRu="Сумма кредита"
          value={fmtRub(principal)}
          hint={`after ${fmtRub(downPaymentAmount)} down`}
        />
        <OutputCard
          label="Total cost"
          labelRu="Итоговая стоимость"
          value={fmtRub(totalCost)}
          hint="down + all instalments"
        />
      </div>

      {/* Sliders panel */}
      <div
        className="rounded-2xl p-5 mb-3"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      >
        <Slider
          icon={<Car className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />}
          label={sliders.price.label}
          labelRu={sliders.price.labelRu}
          value={price}
          displayValue={fmtRub(price)}
          min={sliders.price.min}
          max={sliders.price.max}
          step={sliders.price.step}
          minLabel={fmtRub(sliders.price.min)}
          maxLabel={fmtRub(sliders.price.max)}
          onChange={touch('price', setPrice)}
          style={sliderStyle}
        />
        <Slider
          icon={<Wallet className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />}
          label={sliders.downPaymentPct.label}
          labelRu={sliders.downPaymentPct.labelRu}
          value={downPct}
          displayValue={`${downPct}% — ${fmtRub(downPaymentAmount)}`}
          min={sliders.downPaymentPct.min}
          max={sliders.downPaymentPct.max}
          step={sliders.downPaymentPct.step}
          minLabel="0%"
          maxLabel="50%"
          onChange={touch('downPct', setDownPct)}
          style={sliderStyle}
        />
        <Slider
          icon={<Calendar className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />}
          label={sliders.termMonths.label}
          labelRu={sliders.termMonths.labelRu}
          value={months}
          displayValue={`${months} ${months === 1 ? 'month' : 'months'}`}
          min={sliders.termMonths.min}
          max={sliders.termMonths.max}
          step={sliders.termMonths.step}
          minLabel="6 mo"
          maxLabel="60 mo"
          onChange={touch('months', setMonths)}
          style={sliderStyle}
        />
        <Slider
          icon={<Percent className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />}
          label={sliders.ratePct.label}
          labelRu={sliders.ratePct.labelRu}
          value={rate}
          displayValue={`${rate.toFixed(1)}% per year`}
          min={sliders.ratePct.min}
          max={sliders.ratePct.max}
          step={sliders.ratePct.step}
          minLabel="5%"
          maxLabel="25%"
          onChange={touch('rate', setRate)}
          style={sliderStyle}
          isLast
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
            style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', minHeight: 36 }}
          >
            <RotateCcw className="h-3 w-3" />
            Reset to defaults
          </button>
        </div>
      </div>

      {/* Amortization chart */}
      <div
        className="rounded-2xl p-5 mb-3"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      >
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
            Amortization — where does each instalment go?
          </p>
          <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
            График погашения · принципал vs проценты
          </p>
        </div>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <BarChart
              data={schedule}
              margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
              barCategoryGap={1}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--col-divider)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: 'var(--col-muted)' }}
                interval={months > 24 ? 5 : 2}
                tickFormatter={(m) => `${m}`}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--col-muted)' }}
                tickFormatter={fmtRubShort}
                width={48}
              />
              <Tooltip
                cursor={{ fill: 'rgba(94,158,137,0.06)' }}
                contentStyle={{
                  backgroundColor: 'var(--col-surface)',
                  border: '1px solid var(--col-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, name) => [fmtRub(value), name === 'principal' ? 'Principal' : 'Interest']}
                labelFormatter={(m) => `Month ${m}`}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                formatter={(v) => v === 'principal' ? 'Principal · основной долг' : 'Interest · проценты'}
              />
              <Bar dataKey="principal" stackId="a" fill="var(--col-accent)" />
              <Bar dataKey="interest"  stackId="a" fill="#D4A24A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] mt-2 italic" style={{ color: 'var(--col-muted)' }}>
          Early instalments are mostly interest; later ones pay down the principal. This is how every annuity loan works.
        </p>
      </div>

      {/* Bank officer narrative */}
      <div
        className="rounded-2xl p-4 mb-3"
        style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '3px solid var(--col-accent)' }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Info className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
            The bank officer says
          </p>
        </div>
        <p className="text-sm leading-relaxed italic" style={{ color: 'var(--col-accent-text)' }}>
          "On a car priced at {fmtRub(price)}, you put {downPct}% down — that's {fmtRub(downPaymentAmount)} from your savings. The <strong>principal</strong> of your loan is {fmtRub(principal)}. At {rate.toFixed(1)}% per year over {months} months, your monthly <strong>instalment</strong> is {fmtRub(monthly)}. You will <strong>repay</strong> {fmtRub(totalPaid)} in total — that's {fmtRub(totalOverpay)} in <strong>interest</strong> on top of what you borrowed."
        </p>
      </div>

      <AnimatePresence>
        {markedDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="mt-3 flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
          >
            <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--col-accent-text)' }}>
              Loan Simulator complete — you've felt how each parameter shapes the cost.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function OutputCard({ label, labelRu, value, hint, color, primary }) {
  return (
    <div
      className="rounded-2xl p-3"
      style={{
        backgroundColor: primary ? (color || 'var(--col-accent)') : 'var(--col-surface)',
        color: primary ? 'white' : 'var(--col-heading)',
        border: primary ? 'none' : '1px solid var(--col-border)',
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
        style={{ color: primary ? 'rgba(255,255,255,0.85)' : 'var(--col-muted)' }}>
        {label}
      </p>
      <p className="text-[9px] italic mb-1"
        style={{ color: primary ? 'rgba(255,255,255,0.7)' : 'var(--col-muted)' }}>
        {labelRu}
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0.6, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="text-base font-bold leading-tight"
        style={{ color: primary ? 'white' : color || 'var(--col-heading)' }}
      >
        {value}
      </motion.p>
      {hint && (
        <p className="text-[10px] mt-0.5"
          style={{ color: primary ? 'rgba(255,255,255,0.7)' : 'var(--col-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Slider({ icon, label, labelRu, value, displayValue, min, max, step, minLabel, maxLabel, onChange, style, isLast }) {
  return (
    <div style={{ marginBottom: isLast ? 0 : 18 }}>
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--col-heading)' }}>
          {icon}
          {label}
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>· {labelRu}</span>
        </label>
        <span className="font-bold text-sm" style={{ color: 'var(--col-heading)' }}>
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full"
        style={style}
      />
      <div className="flex justify-between text-[10px] mt-0.5" style={{ color: 'var(--col-muted)' }}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
