import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Repeat2, Wheat, Coins, Banknote, Landmark, CreditCard, Bitcoin,
  CheckCircle,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const ICON_MAP = {
  Repeat2, Wheat, Coins, Banknote, Landmark, CreditCard, Bitcoin,
};

const DONE_THRESHOLD = 5; // out of 7 eras

export default function MoneyFormsSpectrum({ data, unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const [markedDone, setMarkedDone] = useState(false);

  const eras = data?.eras || [];

  const handleSelect = (id) => {
    const isToggle = active === id;
    setActive(isToggle ? null : id);
    if (!isToggle) setSeen(prev => new Set([...prev, id]));
  };

  useEffect(() => {
    if (!markedDone && seen.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'moneyforms');
    }
  }, [seen, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode && eras.length > 0 && active === null) {
      setActive(eras[0].id);
      setSeen(new Set(eras.map(e => e.id)));
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!eras.length) return null;

  const activeEra = eras.find(e => e.id === active);

  return (
    <div className="mb-8">
      {/* Intro */}
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          {data.intro && (
            <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
              {data.intro}
            </p>
          )}
          {data.introRu && (
            <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
              {data.introRu}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {eras.map(e => (
              <div
                key={e.id}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: seen.has(e.id) ? 'var(--col-accent)' : 'var(--col-divider)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {seen.size}/{eras.length}
          </span>
        </div>
      </div>

      {/* Spectrum strip — scrolls horizontally on small screens */}
      <div
        className="rounded-2xl overflow-hidden mb-3"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      >
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          {eras.map((era, idx) => {
            const Icon = ICON_MAP[era.icon] || Coins;
            const isActive = active === era.id;
            const wasSeen = seen.has(era.id);
            return (
              <button
                key={era.id}
                onClick={() => handleSelect(era.id)}
                aria-pressed={isActive}
                className="flex-1 min-w-[110px] flex flex-col items-center gap-1.5 px-3 py-3 text-center focus-visible:outline-none"
                style={{
                  borderRight: idx < eras.length - 1 ? '1px solid var(--col-border)' : 'none',
                  backgroundColor: isActive ? 'var(--col-accent)' : wasSeen ? 'var(--col-accent-light)' : 'transparent',
                  color: isActive ? 'white' : 'var(--col-heading)',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s, color 0.18s',
                  minHeight: 96,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 38, height: 38,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : 'var(--col-accent-light)',
                    color: isActive ? 'white' : 'var(--col-accent)',
                    transition: 'background-color 0.18s, color 0.18s',
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="font-semibold text-[11px] leading-tight px-1">{era.label}</div>
                <div
                  className="text-[9px]"
                  style={{ color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--col-muted)' }}
                >
                  {era.era}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel for active era */}
      <AnimatePresence mode="wait" initial={false}>
        {activeEra && (
          <motion.div
            key={activeEra.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <div>
                <h3 className="font-semibold text-base" style={{ color: 'var(--col-heading)' }}>
                  {activeEra.label}
                  <span className="text-sm font-normal ml-2" style={{ color: 'var(--col-muted)' }}>
                    · {activeEra.labelRu}
                  </span>
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>
                  {activeEra.era}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--col-body)' }}>
              {activeEra.description}
            </p>
            {activeEra.descriptionRu && (
              <p className="text-xs italic mb-3 leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
                {activeEra.descriptionRu}
              </p>
            )}

            {activeEra.why && (
              <div
                className="rounded-xl px-4 py-3 mb-3"
                style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '3px solid var(--col-accent)' }}
              >
                <p
                  className="font-semibold uppercase tracking-wider mb-1"
                  style={{ fontSize: 10, color: 'var(--col-muted)', letterSpacing: '0.06em' }}
                >
                  Why it changed
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--col-accent-text)' }}>
                  {activeEra.why}
                </p>
              </div>
            )}

            {activeEra.vocab && activeEra.vocab.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activeEra.vocab.map(term => (
                  <span
                    key={term}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--col-accent-light)',
                      color: 'var(--col-accent-text)',
                      border: '1px solid var(--col-divider)',
                    }}
                  >
                    {term}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              Forms of Money complete — you've explored the history of currency.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
