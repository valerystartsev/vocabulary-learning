import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Activity, History, CheckCircle, XCircle, RotateCcw, Sparkles,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const ICON_MAP = { TrendingUp, Activity, History };

// Section marked done after the student correctly places ≥ DONE_THRESHOLD
// indicators into the right category.
const DONE_THRESHOLD = 6;

// Flatten all indicators with their correct category for quick lookup
function flattenIndicators(categories) {
  const all = [];
  categories.forEach(cat => {
    (cat.indicators || []).forEach(ind => {
      all.push({ ...ind, correctCategory: cat.id });
    });
  });
  return all;
}

// Shuffle helper (Fisher-Yates) — but stable across renders by seed
function shuffled(arr, seed = 1) {
  const a = [...arr];
  // Simple deterministic shuffle so the pool order doesn't jitter on re-render
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EconomicIndicatorsDashboard({ data, unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const categories = data?.categories || [];

  // All indicators flattened, deterministically shuffled
  const allIndicators = useMemo(
    () => shuffled(flattenIndicators(categories), 7),
    [categories]
  );

  // Assignment state — Map<indicatorName, categoryId | 'pool'>
  const [assignments, setAssignments] = useState(() => {
    const m = {};
    allIndicators.forEach(ind => { m[ind.name] = 'pool'; });
    return m;
  });
  const [markedDone, setMarkedDone] = useState(false);

  const handleAssign = (indicatorName, targetCategoryId) => {
    setAssignments(prev => ({ ...prev, [indicatorName]: targetCategoryId }));
  };

  const resetAll = () => {
    const m = {};
    allIndicators.forEach(ind => { m[ind.name] = 'pool'; });
    setAssignments(m);
  };

  // Indicators in pool (not yet assigned)
  const pool = allIndicators.filter(ind => assignments[ind.name] === 'pool');

  // Count correct placements
  const correctCount = allIndicators.filter(
    ind => assignments[ind.name] === ind.correctCategory
  ).length;

  // Count wrong placements (assigned but to wrong cat)
  const wrongCount = allIndicators.filter(
    ind =>
      assignments[ind.name] !== 'pool' &&
      assignments[ind.name] !== ind.correctCategory
  ).length;

  useEffect(() => {
    if (!markedDone && correctCount >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'indicators');
    }
  }, [correctCount, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode) {
      // Auto-place all indicators correctly
      const m = {};
      allIndicators.forEach(ind => { m[ind.name] = ind.correctCategory; });
      setAssignments(m);
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!categories.length) return null;

  return (
    <div className="mb-8">
      {/* Intro + progress */}
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
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
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
            <span style={{ color: 'var(--col-accent-text)', fontWeight: 600 }}>{correctCount}</span>
          </div>
          {wrongCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <XCircle className="h-3 w-3" style={{ color: '#B91C1C' }} />
              <span style={{ color: '#B91C1C', fontWeight: 600 }}>{wrongCount}</span>
            </div>
          )}
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            of {allIndicators.length}
          </span>
        </div>
      </div>

      {/* Pool of unassigned indicators */}
      <div
        className="rounded-2xl p-4 mb-3"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px dashed var(--col-border)' }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
            Click an indicator, then click a category to sort it
          </p>
          {pool.length === 0 && (
            <span className="ml-auto text-[10px] italic" style={{ color: 'var(--col-muted)' }}>
              Pool empty — all indicators placed
            </span>
          )}
        </div>
        {pool.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {pool.map(ind => (
              <ChipMover
                key={ind.name}
                indicator={ind}
                categories={categories}
                onAssign={handleAssign}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
            Move misplaced chips back here if needed.
          </p>
        )}
      </div>

      {/* 3 category columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        {categories.map(cat => {
          const Icon = ICON_MAP[cat.icon] || Activity;
          const placedHere = allIndicators.filter(ind => assignments[ind.name] === cat.id);
          return (
            <div
              key={cat.id}
              className="rounded-2xl p-4 flex flex-col"
              style={{
                backgroundColor: 'var(--col-surface)',
                border: `2px solid ${cat.color}`,
                minHeight: 200,
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-2 mb-2">
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{ width: 34, height: 34, backgroundColor: cat.color, color: 'white' }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--col-heading)' }}>
                    {cat.title}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--col-muted)' }}>
                    {cat.titleRu}
                  </p>
                </div>
              </div>
              {cat.when && (
                <p className="text-[10px] italic mb-3" style={{ color: 'var(--col-secondary)' }}>
                  {cat.when}
                </p>
              )}

              {/* Placed chips */}
              <div className="flex flex-wrap gap-1.5 flex-1">
                {placedHere.map(ind => {
                  const isCorrect = ind.correctCategory === cat.id;
                  return (
                    <PlacedChip
                      key={ind.name}
                      indicator={ind}
                      isCorrect={isCorrect}
                      onReturn={() => handleAssign(ind.name, 'pool')}
                    />
                  );
                })}
                {placedHere.length === 0 && (
                  <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
                    Drop indicators here.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="flex justify-end">
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
          style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', minHeight: 36 }}
        >
          <RotateCcw className="h-3 w-3" />
          Reset all
        </button>
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
              Indicators Dashboard complete — you've sorted enough to know the categories.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Chip in the pool — click reveals a 3-button category picker
function ChipMover({ indicator, categories, onAssign }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        style={{
          backgroundColor: open ? 'var(--col-accent)' : 'var(--col-surface-secondary)',
          color: open ? 'white' : 'var(--col-heading)',
          border: `1px solid ${open ? 'var(--col-accent)' : 'var(--col-border)'}`,
          minHeight: 32,
        }}
      >
        {indicator.name}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 rounded-xl shadow-md z-10 overflow-hidden"
            style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)', minWidth: 160 }}
          >
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { onAssign(indicator.name, cat.id); setOpen(false); }}
                className="block w-full text-left px-3 py-2 text-xs font-medium"
                style={{
                  color: 'var(--col-heading)',
                  borderLeft: `3px solid ${cat.color}`,
                }}
              >
                {cat.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Chip that's been placed into a category
function PlacedChip({ indicator, isCorrect, onReturn }) {
  return (
    <motion.button
      onClick={onReturn}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
      style={{
        backgroundColor: isCorrect ? '#D0EDD8' : '#FEE2E2',
        color: isCorrect ? '#1F5E3A' : '#7F1D1D',
        border: `1px solid ${isCorrect ? '#7ABD90' : '#FCA5A5'}`,
      }}
      title="Click to remove"
    >
      {isCorrect ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {indicator.name}
    </motion.button>
  );
}
