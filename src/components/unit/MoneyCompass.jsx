import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, PiggyBank, BarChart3, CreditCard, ChevronDown, CheckCircle, Compass } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const ICON_MAP = {
  ArrowRightLeft,
  PiggyBank,
  BarChart3,
  CreditCard,
  Compass,
};

// Section is marked done when at least 3 of 4 cards have been opened
const DONE_THRESHOLD = 3;

export default function MoneyCompass({ data = [], unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const [expanded, setExpanded] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const [markedDone, setMarkedDone] = useState(false);

  const handleToggle = (id) => {
    const opening = expanded !== id;
    setExpanded(opening ? id : null);
    if (opening) {
      setSeen(prev => new Set([...prev, id]));
    }
  };

  // Mark section complete once DONE_THRESHOLD cards have been opened
  useEffect(() => {
    if (!markedDone && seen.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'moneycompass');
    }
  }, [seen, markedDone, unitId, markSectionComplete]);

  // In teacher mode auto-expand first card if nothing is open
  useEffect(() => {
    if (isTeacherMode && data.length > 0 && expanded === null) {
      setExpanded(data[0].id);
      setSeen(new Set(data.map(d => d.id)));
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Instruction row */}
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
            Money serves four key functions. Click each card to explore the definition and a real example.
          </p>
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
            Деньги выполняют четыре ключевые функции. Нажмите на карточку, чтобы узнать больше.
          </p>
        </div>
        {/* Progress dots */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {data.map(item => (
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
        {data.map(item => {
          const Icon = ICON_MAP[item.icon] || BarChart3;
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
                    animate={{ backgroundColor: isOpen ? 'var(--col-accent)' : wasSeen ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)' }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{ width: 46, height: 46 }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: isOpen ? 'white' : 'var(--col-accent)', transition: 'color 0.2s' }}
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
                      className="px-5 pb-5 pt-3"
                      style={{ borderTop: '1px solid var(--col-border)' }}
                    >
                      {/* Definition */}
                      <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--col-body)' }}>
                        {item.definition}
                      </p>
                      <p className="text-xs italic mb-4 leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
                        {item.definitionRu}
                      </p>

                      {/* Example */}
                      <div
                        className="rounded-xl px-4 py-3"
                        style={{
                          backgroundColor: 'var(--col-accent-light)',
                          borderLeft: '3px solid var(--col-accent)',
                        }}
                      >
                        <p
                          className="font-semibold uppercase tracking-wider mb-1.5"
                          style={{ fontSize: 10, color: 'var(--col-muted)', letterSpacing: '0.06em' }}
                        >
                          Example · Пример
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--col-accent-text)' }}>
                          {item.example}
                        </p>
                        {item.exampleRu && (
                          <p className="text-xs italic mt-1.5 leading-relaxed" style={{ color: 'var(--col-accent-text)', opacity: 0.75 }}>
                            {item.exampleRu}
                          </p>
                        )}
                      </div>
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
              Money Compass complete — all four functions explored.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
