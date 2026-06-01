import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, CheckCircle, RotateCcw } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const DONE_THRESHOLD = 3; // visited 3 of 4 phases

const ARROW_FOR = {
  up:   { Icon: ArrowUp,   color: '#1F7A4D', label: '↑' },
  down: { Icon: ArrowDown, color: '#B91C1C', label: '↓' },
  flat: { Icon: Minus,     color: '#6B7280', label: '≈' },
};

export default function BusinessCycleSwitcher({ data, unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const phases = data?.phases || [];
  const [activeId, setActiveId] = useState(phases[0]?.id);
  const [seen, setSeen] = useState(new Set(phases[0] ? [phases[0].id] : []));
  const [markedDone, setMarkedDone] = useState(false);

  const handleSelect = (id) => {
    setActiveId(id);
    setSeen(prev => new Set([...prev, id]));
  };

  useEffect(() => {
    if (!markedDone && seen.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'businesscycle');
    }
  }, [seen, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode && phases.length > 0) {
      setSeen(new Set(phases.map(p => p.id)));
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!phases.length) return null;

  const active = phases.find(p => p.id === activeId) || phases[0];
  const activeIdx = phases.findIndex(p => p.id === active.id);

  // Position the dot on the SVG sine curve based on active phase index
  // 4 phases distributed across the curve at x = 75, 225, 375, 525 (of viewBox 600)
  const dotX = 75 + activeIdx * 150;
  const dotY = activeIdx === 0 ? 90 : activeIdx === 1 ? 30 : activeIdx === 2 ? 80 : 110;

  return (
    <div className="mb-8">
      {/* Intro */}
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
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {phases.map(p => (
              <div
                key={p.id}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: seen.has(p.id) ? 'var(--col-accent)' : 'var(--col-divider)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {seen.size}/{phases.length}
          </span>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-3">
        {phases.map(p => {
          const isActive = p.id === active.id;
          const wasSeen = seen.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: isActive ? p.color : wasSeen ? 'var(--col-accent-light)' : 'var(--col-surface)',
                color: isActive ? 'white' : 'var(--col-heading)',
                border: `1px solid ${isActive ? p.color : 'var(--col-border)'}`,
                minHeight: 48,
              }}
            >
              {p.label}
              {wasSeen && !isActive && <CheckCircle className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />}
            </button>
          );
        })}
      </div>

      {/* SVG curve with marker on active phase */}
      <div
        className="rounded-2xl p-4 mb-3"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      >
        <svg viewBox="0 0 600 140" style={{ width: '100%', height: 'auto', maxHeight: 160 }} aria-label="Business cycle">
          <line x1="0" y1="100" x2="600" y2="100" stroke="var(--col-divider)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Sine-like curve through Expansion → Peak → Contraction → Trough */}
          <path
            d="M 0 100 Q 75 90 150 30 Q 225 30 300 80 Q 375 100 450 110 Q 525 100 600 30"
            fill="none"
            stroke="var(--col-accent)"
            strokeWidth="2"
          />
          {/* Phase labels under the curve */}
          {phases.map((p, i) => (
            <text
              key={p.id}
              x={75 + i * 150}
              y={132}
              textAnchor="middle"
              fontSize="11"
              fontWeight={p.id === active.id ? 700 : 400}
              fill={p.id === active.id ? p.color : 'var(--col-muted)'}
              style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {p.label}
            </text>
          ))}
          {/* Marker dot on the curve at active phase */}
          <motion.circle
            animate={{ cx: dotX, cy: dotY }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            r="6"
            fill={active.color}
            stroke="white"
            strokeWidth="2"
          />
          <motion.circle
            animate={{ cx: dotX, cy: dotY }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            r="10"
            fill={active.color}
            opacity="0.25"
          >
            <animate attributeName="r" values="8;12;8" dur="1.8s" repeatCount="indefinite" />
          </motion.circle>
        </svg>
      </div>

      {/* Active phase detail */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: 'var(--col-surface)',
            border: `2px solid ${active.color}`,
          }}
        >
          {/* Header */}
          <div className="mb-3">
            <p className="font-semibold text-base" style={{ color: 'var(--col-heading)' }}>
              {active.label}
              <span className="text-sm font-normal ml-2" style={{ color: 'var(--col-muted)' }}>
                · {active.labelRu}
              </span>
            </p>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--col-body)' }}>
              {active.summary}
            </p>
            {active.summaryRu && (
              <p className="text-xs italic mt-0.5 leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
                {active.summaryRu}
              </p>
            )}
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {active.metrics.map(m => {
              const cfg = ARROW_FOR[m.direction] || ARROW_FOR.flat;
              const { Icon } = cfg;
              return (
                <div
                  key={m.name}
                  className="rounded-xl p-3 flex items-start gap-2.5"
                  style={{ backgroundColor: 'var(--col-surface-secondary)' }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: 30, height: 30,
                      backgroundColor: cfg.color,
                      color: 'white',
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold" style={{ color: 'var(--col-heading)' }}>
                      {m.name}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--col-muted)' }}>
                      {m.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

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
              Business Cycle complete — you know how metrics move through each phase.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
