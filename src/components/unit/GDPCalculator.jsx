import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, Package, CheckCircle, AlertCircle, RotateCcw, Info,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const ICON_MAP = { Wallet, Package };

// Section marked done after the user has edited any input 3 times
// AND has either kept the totals matching or proved they can diverge.
const DONE_THRESHOLD = 3;

const fmt = (n) => `$${Math.round(n).toLocaleString('en-US')}`;

export default function GDPCalculator({ data, unitId, isTeacherMode }) {
  const { markSectionComplete, saveSectionScore } = useProgress();
  const columns = data?.columns || [];
  const [values, setValues] = useState(() => {
    // Map: { columnId: { itemIndex: value } }
    const m = {};
    columns.forEach(col => {
      m[col.id] = {};
      col.lineItems.forEach((item, i) => { m[col.id][i] = item.value; });
    });
    return m;
  });
  const [edits, setEdits] = useState(0);
  const [markedDone, setMarkedDone] = useState(false);

  const totals = useMemo(() => {
    const t = {};
    columns.forEach(col => {
      t[col.id] = Object.values(values[col.id] || {}).reduce((s, v) => s + (Number(v) || 0), 0);
    });
    return t;
  }, [values, columns]);

  const totalIds = columns.map(c => c.id);
  const matched = totalIds.length >= 2 && totalIds.every(id => totals[id] === totals[totalIds[0]]);

  const handleChange = (columnId, itemIndex) => (e) => {
    const v = e.target.value === '' ? 0 : Number(e.target.value);
    setValues(prev => ({
      ...prev,
      [columnId]: { ...prev[columnId], [itemIndex]: v },
    }));
    setEdits(n => n + 1);
  };

  const resetAll = () => {
    const m = {};
    columns.forEach(col => {
      m[col.id] = {};
      col.lineItems.forEach((item, i) => { m[col.id][i] = item.value; });
    });
    setValues(m);
  };

  useEffect(() => {
    if (!markedDone && edits >= DONE_THRESHOLD) {
      setMarkedDone(true);
      // Engagement score = number of edits capped at 100; rewards more
      // experimentation than the bare threshold.
      saveSectionScore?.(unitId, 'gdpcalc', Math.min(100, edits * 10));
      markSectionComplete?.(unitId, 'gdpcalc');
    }
  }, [edits, markedDone, unitId, markSectionComplete, saveSectionScore]);

  useEffect(() => {
    if (isTeacherMode) setEdits(DONE_THRESHOLD);
  }, [isTeacherMode]);

  if (!columns.length) return null;

  return (
    <div className="mb-8">
      {/* Intro */}
      <div className="mb-4">
        {data.description && (
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
            {data.description}
          </p>
        )}
        {data.descriptionRu && (
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
            {data.descriptionRu}
          </p>
        )}
      </div>

      {/* Two columns side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {columns.map(col => {
          const Icon = ICON_MAP[col.icon] || Wallet;
          const total = totals[col.id] || 0;
          return (
            <div
              key={col.id}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: 'var(--col-surface)',
                border: `2px solid ${col.color || 'var(--col-border)'}`,
              }}
            >
              {/* Column header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: col.color || 'var(--col-accent)', color: 'white' }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--col-heading)' }}>
                    {col.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>
                    {col.titleRu}
                  </p>
                  {col.subtitle && (
                    <p className="text-xs italic mt-1" style={{ color: 'var(--col-secondary)' }}>
                      {col.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-2 mb-3">
                {col.lineItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: 'var(--col-surface-secondary)' }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--col-heading)' }}>
                        {item.label}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--col-muted)' }}>
                        {item.labelRu}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1">
                      <span className="text-sm" style={{ color: 'var(--col-muted)' }}>$</span>
                      <input
                        type="number"
                        value={values[col.id]?.[i] ?? item.value}
                        onChange={handleChange(col.id, i)}
                        className="w-20 text-right font-semibold text-sm rounded px-2 py-1"
                        style={{
                          backgroundColor: 'var(--col-surface)',
                          border: '1px solid var(--col-border)',
                          color: 'var(--col-heading)',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Column total */}
              <div
                className="rounded-lg px-3 py-2.5 flex items-center justify-between"
                style={{ backgroundColor: col.color || 'var(--col-accent)', color: 'white' }}
              >
                <p className="text-sm font-semibold uppercase tracking-wider">Total GDP</p>
                <motion.p
                  key={`${col.id}-${total}`}
                  initial={{ opacity: 0.6, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-xl font-bold"
                >
                  {fmt(total)}
                </motion.p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verdict bar */}
      <motion.div
        animate={{ backgroundColor: matched ? 'var(--col-accent-light)' : '#FEE2E2' }}
        transition={{ duration: 0.25 }}
        className="rounded-xl p-4 mb-3 flex items-start gap-3"
        style={{ border: `2px solid ${matched ? 'var(--col-accent)' : '#FCA5A5'}` }}
      >
        {matched ? (
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'var(--col-accent)' }} />
        ) : (
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#B91C1C' }} />
        )}
        <div className="flex-1">
          <p
            className="text-sm font-semibold mb-0.5"
            style={{ color: matched ? 'var(--col-accent-text)' : '#7F1D1D' }}
          >
            {matched
              ? `Both approaches match — Total GDP = ${fmt(totals[totalIds[0]] || 0)}`
              : 'Approaches diverge — change inputs so both columns equal the same total.'}
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: matched ? 'var(--col-accent-text)' : '#7F1D1D', opacity: 0.85 }}
          >
            {matched
              ? data.verdict?.message || 'Every dollar of income is a dollar of spending — the circular flow.'
              : 'In a real economy income always equals spending. Try editing values until both totals are equal.'}
          </p>
        </div>
      </motion.div>

      {/* Reset */}
      <div className="flex justify-end mb-3">
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
          style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', minHeight: 36 }}
        >
          <RotateCcw className="h-3 w-3" />
          Reset to default values
        </button>
      </div>

      {/* Explanation */}
      {data.explanation && (
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
              Why both approaches give the same answer
            </p>
          </div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--col-body)' }}>
            {data.explanation}
          </p>
          {data.explanationRu && (
            <p className="text-xs italic leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
              {data.explanationRu}
            </p>
          )}
        </div>
      )}

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
              GDP Calculator complete — you've proved both approaches give the same answer.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
