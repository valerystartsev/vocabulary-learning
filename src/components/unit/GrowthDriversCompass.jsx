import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Building2, Cpu, Zap, ChevronDown, CheckCircle,
  TrendingUp, AlertTriangle, Lightbulb, Sparkles,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const ICON_MAP = { Users, Building2, Cpu, Zap };

// Section marked done after at least 3 of 4 cards have been opened
const DONE_THRESHOLD = 3;

export default function GrowthDriversCompass({ data = [], unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const [expanded, setExpanded] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const [markedDone, setMarkedDone] = useState(false);

  const handleToggle = (id) => {
    const opening = expanded !== id;
    setExpanded(opening ? id : null);
    if (opening) setSeen((prev) => new Set([...prev, id]));
  };

  useEffect(() => {
    if (!markedDone && seen.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'growthdrivers');
    }
  }, [seen, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode && data.length > 0 && expanded === null) {
      setExpanded(data[0].id);
      setSeen(new Set(data.map((d) => d.id)));
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Instruction row */}
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
            Economic growth comes from four main drivers. Tap each one to see what it does, an example, and where it has limits.
          </p>
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
            Экономический рост опирается на четыре главных фактора. Нажмите на каждый, чтобы увидеть механизм, пример и ограничение.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {data.map((item) => (
              <div
                key={item.id}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: seen.has(item.id) ? 'var(--col-accent)' : 'var(--col-divider)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {seen.size}/{data.length}
          </span>
        </div>
      </div>

      {/* 2×2 grid on md+, 1 col on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.map((item) => {
          const Icon = ICON_MAP[item.icon] || Sparkles;
          const isOpen = expanded === item.id;
          const wasSeen = seen.has(item.id);

          return (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: 'var(--col-surface)',
                border: `1.5px solid ${isOpen ? 'var(--col-accent)' : wasSeen ? 'var(--col-divider)' : 'var(--col-border)'}`,
                transition: 'border-color 0.18s, box-shadow 0.18s',
                boxShadow: isOpen ? '0 2px 14px rgba(94,158,137,0.13)' : 'none',
              }}
            >
              {/* Card header */}
              <button
                onClick={() => handleToggle(item.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{ minHeight: 68, '--tw-ring-color': 'var(--col-accent)' }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      backgroundColor: isOpen
                        ? 'var(--col-accent)'
                        : wasSeen
                        ? 'var(--col-accent-light)'
                        : 'var(--col-surface-secondary)',
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{ width: 46, height: 46 }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{
                        color: isOpen ? 'white' : 'var(--col-accent)',
                        transition: 'color 0.2s',
                      }}
                    />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--col-heading)' }}>
                      {item.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>
                      {item.titleRu}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {wasSeen && !isOpen && (
                    <CheckCircle className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
                  )}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <ChevronDown className="h-4 w-4" style={{ color: 'var(--col-muted)' }} />
                  </motion.div>
                </div>
              </button>

              {/* Expandable body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.27, ease: 'easeOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="px-5 pb-5 pt-3 space-y-3"
                      style={{ borderTop: '1px solid var(--col-border)' }}
                    >
                      {/* Mechanism */}
                      <StatRow
                        Icon={TrendingUp}
                        label="Mechanism"
                        labelRu="Механизм"
                        valueEn={item.mechanism}
                        valueRu={item.mechanismRu}
                      />

                      {/* Example — slightly emphasised block */}
                      <div
                        className="rounded-xl px-4 py-3"
                        style={{
                          backgroundColor: 'var(--col-accent-light)',
                          borderLeft: '3px solid var(--col-accent)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Lightbulb className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
                          <p
                            className="font-semibold uppercase tracking-wider"
                            style={{ fontSize: 10, color: 'var(--col-muted)', letterSpacing: '0.06em' }}
                          >
                            Example · Пример
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--col-accent-text)' }}>
                          {item.example}
                        </p>
                        {item.exampleRu && (
                          <p
                            className="text-xs italic mt-1.5 leading-relaxed"
                            style={{ color: 'var(--col-accent-text)', opacity: 0.75 }}
                          >
                            {item.exampleRu}
                          </p>
                        )}
                      </div>

                      {/* Limit */}
                      <StatRow
                        Icon={AlertTriangle}
                        label="Where it has limits"
                        labelRu="Где упирается в ограничение"
                        valueEn={item.limit}
                        valueRu={item.limitRu}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Completion banner */}
      <AnimatePresence>
        {markedDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
          >
            <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--col-accent-text)' }}>
              Growth drivers explored — you've covered the four pillars of long-run growth.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// One row inside a card's expanded body — small icon, EN label,
// value EN with RU translation underneath.
function StatRow({ Icon, label, labelRu, valueEn, valueRu }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex items-center justify-center rounded-lg shrink-0 mt-0.5"
        style={{ width: 28, height: 28, backgroundColor: 'var(--col-surface-secondary)' }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: 'var(--col-muted)', letterSpacing: '0.06em' }}
        >
          {label} <span className="font-medium normal-case opacity-70">· {labelRu}</span>
        </p>
        <p className="text-sm leading-snug mt-0.5" style={{ color: 'var(--col-body)' }}>
          {valueEn}
        </p>
        {valueRu && (
          <p className="text-xs italic mt-0.5 leading-snug" style={{ color: 'var(--col-secondary)' }}>
            {valueRu}
          </p>
        )}
      </div>
    </div>
  );
}
