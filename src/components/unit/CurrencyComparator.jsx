import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Banknote, CheckCircle, Globe } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

// Section is complete after the user has flipped to both currency tabs
// and explored at least one coin/note item from each side.
const DONE_THRESHOLD = { sides: 2, items: 2 };

const SIDES = [
  { key: 'british',  label: 'British £',  labelRu: 'Британский фунт', flag: '🇬🇧', accent: '#C8102E' },
  { key: 'american', label: 'American $', labelRu: 'Доллар США',      flag: '🇺🇸', accent: '#0A3161' },
];

export default function CurrencyComparator({ data, unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const [side, setSide] = useState('british');
  const [showRu, setShowRu] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [sidesVisited, setSidesVisited] = useState(new Set(['british']));
  const [itemsTouched, setItemsTouched] = useState(new Set());
  const [markedDone, setMarkedDone] = useState(false);

  const system = side === 'british' ? data?.britishSystem : data?.americanSystem;

  const handleSideChange = (newSide) => {
    setSide(newSide);
    setActiveItem(null);
    setSidesVisited(prev => new Set([...prev, newSide]));
  };

  const handleItemClick = (item) => {
    setActiveItem(activeItem?.name === item.name ? null : item);
    setItemsTouched(prev => new Set([...prev, `${side}:${item.name}`]));
  };

  useEffect(() => {
    if (markedDone) return;
    if (sidesVisited.size >= DONE_THRESHOLD.sides && itemsTouched.size >= DONE_THRESHOLD.items) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'currency');
    }
  }, [sidesVisited, itemsTouched, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode) {
      setSidesVisited(new Set(['british', 'american']));
      // touch a couple of items virtually so the section counts as explored
      setItemsTouched(new Set(['british:£1 coin', 'american:1 cent']));
    }
  }, [isTeacherMode]);

  if (!data || !data.britishSystem || !data.americanSystem) return null;

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

      {/* Side toggle */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div
          className="inline-flex rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}
        >
          {SIDES.map(s => {
            const isActive = side === s.key;
            return (
              <button
                key={s.key}
                onClick={() => handleSideChange(s.key)}
                className="px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
                style={{
                  backgroundColor: isActive ? s.accent : 'transparent',
                  color: isActive ? 'white' : 'var(--col-heading)',
                  minHeight: 44,
                }}
              >
                <span style={{ fontSize: 16 }}>{s.flag}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setShowRu(v => !v)}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl"
          style={{ color: 'var(--col-muted)', border: '1px solid var(--col-border)', minHeight: 36 }}
        >
          <Globe className="h-3.5 w-3.5" />
          {showRu ? 'Hide RU' : 'Show RU'}
        </button>
      </div>

      {/* Currency header */}
      <div
        className="rounded-2xl mb-3 px-5 py-4"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      >
        <p className="font-semibold text-base" style={{ color: 'var(--col-heading)' }}>
          {system.currency}
        </p>
        {showRu && (
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
            {system.currencyRu}
          </p>
        )}
      </div>

      {/* Coins + Notes side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Coins */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Coins className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
              Coins · Монеты
            </p>
            <span className="ml-auto text-[10px]" style={{ color: 'var(--col-muted)' }}>
              {system.coins.length}
            </span>
          </div>
          <div className="space-y-1.5">
            {system.coins.map(coin => {
              const isActive = activeItem?.name === coin.name && itemsTouched.has(`${side}:${coin.name}`);
              const wasSeen = itemsTouched.has(`${side}:${coin.name}`);
              return (
                <button
                  key={coin.name}
                  onClick={() => handleItemClick(coin)}
                  className="w-full text-left rounded-lg px-3 py-2 text-sm flex items-start gap-2 transition-colors"
                  style={{
                    backgroundColor: isActive ? 'var(--col-accent-light)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--col-accent)' : 'transparent'}`,
                    minHeight: 40,
                  }}
                >
                  <span
                    className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-heading)' }}
                  >
                    {coin.slang || '—'}
                  </span>
                  <span className="flex-1" style={{ color: 'var(--col-body)' }}>
                    {coin.name}
                  </span>
                  {wasSeen && <CheckCircle className="h-3 w-3 shrink-0 mt-1" style={{ color: 'var(--col-accent)' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Banknote className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
              Notes · Купюры
            </p>
            <span className="ml-auto text-[10px]" style={{ color: 'var(--col-muted)' }}>
              {system.notes.length}
            </span>
          </div>
          <div className="space-y-1.5">
            {system.notes.map(note => {
              const isActive = activeItem?.name === note.name && itemsTouched.has(`${side}:${note.name}`);
              const wasSeen = itemsTouched.has(`${side}:${note.name}`);
              return (
                <button
                  key={note.name}
                  onClick={() => handleItemClick(note)}
                  className="w-full text-left rounded-lg px-3 py-2 text-sm flex items-start gap-2 transition-colors"
                  style={{
                    backgroundColor: isActive ? 'var(--col-accent-light)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--col-accent)' : 'transparent'}`,
                    minHeight: 40,
                  }}
                >
                  <span
                    className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-heading)' }}
                  >
                    {note.slang || '—'}
                  </span>
                  <span className="flex-1" style={{ color: 'var(--col-body)' }}>
                    {note.name}
                  </span>
                  {wasSeen && <CheckCircle className="h-3 w-3 shrink-0 mt-1" style={{ color: 'var(--col-accent)' }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail panel for active item */}
      <AnimatePresence mode="wait" initial={false}>
        {activeItem && (
          <motion.div
            key={`${side}:${activeItem.name}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mt-3 rounded-2xl p-4"
            style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '3px solid var(--col-accent)' }}
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
                {activeItem.name}
              </p>
              {activeItem.slang && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ backgroundColor: 'var(--col-surface)', color: 'var(--col-accent-text)' }}
                >
                  slang: {activeItem.slang}
                </span>
              )}
            </div>
            {activeItem.note ? (
              <p className="text-sm" style={{ color: 'var(--col-accent-text)' }}>
                {activeItem.note}
              </p>
            ) : (
              <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
                No additional notes.
              </p>
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
              Currency Comparator complete — you've explored both pound and dollar.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
