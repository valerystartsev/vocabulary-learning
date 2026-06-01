import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, CheckCircle, AlertCircle, RotateCcw, Move, Sparkles,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

// Three zones an item can live in:
//   'pool'   — unsorted, top
//   'assets' — left column
//   'liab'   — right column (liabilities + equity)
const ZONES = ['pool', 'assets', 'liab'];

// Categorical key → zone for "what is the correct column for this item"
const correctZone = (category) => (category === 'asset' ? 'assets' : 'liab');

// Format value as "$1,200K"
const fmt = (n) => `$${n.toLocaleString('en-US')}K`;

export default function BalanceSheetBuilder({ data, unitId, isTeacherMode }) {
  const { markSectionComplete, saveSectionScore } = useProgress();
  const items = data?.items || [];

  // assignment: itemId → zone
  const [assignment, setAssignment] = useState(() => {
    const m = {};
    items.forEach(it => { m[it.id] = 'pool'; });
    return m;
  });
  const [markedDone, setMarkedDone] = useState(false);
  const [hoverZone, setHoverZone] = useState(null);

  const poolRef   = useRef(null);
  const assetsRef = useRef(null);
  const liabRef   = useRef(null);

  // Detect which drop zone contains the screen-coordinate point. Used both
  // during drag (to highlight the hovered zone) and on drag end (to commit).
  const detectZone = (point) => {
    const refs = { pool: poolRef, assets: assetsRef, liab: liabRef };
    for (const [name, ref] of Object.entries(refs)) {
      const el = ref.current;
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom) {
        return name;
      }
    }
    return null;
  };

  const handleDrop = (itemId, point) => {
    const zone = detectZone(point);
    setHoverZone(null);
    if (!zone) return; // dropped outside any zone → snap back via layout
    setAssignment(prev => ({ ...prev, [itemId]: zone }));
  };

  const resetAll = () => {
    const m = {};
    items.forEach(it => { m[it.id] = 'pool'; });
    setAssignment(m);
    setMarkedDone(false);
  };

  // Auto-arrange in teacher mode
  useEffect(() => {
    if (isTeacherMode) {
      const m = {};
      items.forEach(it => { m[it.id] = correctZone(it.category); });
      setAssignment(m);
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived collections
  const inZone = (zone) => items.filter(it => assignment[it.id] === zone);
  const poolItems   = inZone('pool');
  const assetItems  = inZone('assets');
  const liabItems   = inZone('liab');

  const totalAssets = assetItems.reduce((s, it) => s + it.value, 0);
  const totalLiab   = liabItems.reduce((s, it) => s + it.value, 0);
  const diff = totalAssets - totalLiab;

  // Are all items placed (none in pool)?
  const allPlaced = poolItems.length === 0;
  // Are all items in the right column?
  const allCorrect = items.every(it => assignment[it.id] === correctZone(it.category));
  // Section "done" criterion per concept: successfully balanced
  const isBalanced = allPlaced && allCorrect && totalAssets === totalLiab && totalAssets > 0;

  // Per-section score = ratio of correctly placed items, computed when
  // the student has placed all of them. Updates live so the best score
  // wins (handled by saveSectionScore in ProgressContext).
  useEffect(() => {
    if (!markedDone && isBalanced) {
      setMarkedDone(true);
      const correct = items.filter(it => assignment[it.id] === correctZone(it.category)).length;
      const score = items.length > 0 ? Math.round((correct / items.length) * 100) : 100;
      saveSectionScore?.(unitId, 'balancesheet', score);
      markSectionComplete?.(unitId, 'balancesheet');
    }
  }, [isBalanced, markedDone, unitId, markSectionComplete, saveSectionScore, items, assignment]);

  return (
    <div className="mb-8">
      {/* Intro + progress */}
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          {data.description && (
            <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>{data.description}</p>
          )}
          {data.descriptionRu && (
            <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{data.descriptionRu}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Sparkles className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {items.length - poolItems.length}/{items.length} placed
          </span>
        </div>
      </div>

      {/* Pool — unsorted cards */}
      <div
        ref={poolRef}
        className="rounded-2xl p-3 mb-3 transition-colors"
        style={{
          backgroundColor: hoverZone === 'pool' ? 'var(--col-accent-light)' : 'var(--col-surface)',
          border: `1px dashed ${hoverZone === 'pool' ? 'var(--col-accent)' : 'var(--col-border)'}`,
          minHeight: 90,
        }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Move className="h-3 w-3" style={{ color: 'var(--col-muted)' }} />
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
            Drag each card into the correct column
          </p>
          {poolItems.length === 0 && (
            <span className="ml-auto text-[10px] italic" style={{ color: 'var(--col-muted)' }}>
              All placed
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 min-h-[44px]">
          <AnimatePresence>
            {poolItems.map(item => (
              <DraggableCard
                key={item.id}
                item={item}
                onDrop={handleDrop}
                onHoverChange={setHoverZone}
                detectZone={detectZone}
                state="pool"
              />
            ))}
          </AnimatePresence>
          {poolItems.length === 0 && (
            <p className="text-xs italic self-center" style={{ color: 'var(--col-muted)' }}>
              ✓ Pool empty
            </p>
          )}
        </div>
      </div>

      {/* Two drop columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Assets */}
        <DropColumn
          dropRef={assetsRef}
          title="Assets"
          titleRu="Активы"
          subtitle="What the company owns"
          color="#5E9E89"
          isHover={hoverZone === 'assets'}
          items={assetItems}
          total={totalAssets}
          renderCard={(item) => (
            <DraggableCard
              key={item.id}
              item={item}
              onDrop={handleDrop}
              onHoverChange={setHoverZone}
              detectZone={detectZone}
              state="assets"
              isCorrect={item.category === 'asset'}
            />
          )}
        />
        {/* Liabilities + Equity */}
        <DropColumn
          dropRef={liabRef}
          title="Liabilities + Equity"
          titleRu="Обязательства + Капитал"
          subtitle="What the company owes + what is left for owners"
          color="#C9955A"
          isHover={hoverZone === 'liab'}
          items={liabItems}
          total={totalLiab}
          renderCard={(item) => (
            <DraggableCard
              key={item.id}
              item={item}
              onDrop={handleDrop}
              onHoverChange={setHoverZone}
              detectZone={detectZone}
              state="liab"
              isCorrect={item.category === 'liability' || item.category === 'equity'}
            />
          )}
        />
      </div>

      {/* Balance verdict */}
      <motion.div
        animate={{
          backgroundColor: isBalanced ? 'var(--col-accent-light)' : allPlaced ? '#FEE2E2' : 'var(--col-surface)',
          borderColor:     isBalanced ? 'var(--col-accent)'        : allPlaced ? '#FCA5A5' : 'var(--col-border)',
        }}
        transition={{ duration: 0.25 }}
        className="rounded-xl p-4 mb-3 flex items-start gap-3"
        style={{ border: '2px solid' }}
      >
        <Scale className="h-5 w-5 shrink-0 mt-0.5"
          style={{ color: isBalanced ? 'var(--col-accent)' : allPlaced ? '#B91C1C' : 'var(--col-muted)' }} />
        <div className="flex-1">
          <p className="text-sm font-semibold mb-0.5"
            style={{ color: isBalanced ? 'var(--col-accent-text)' : allPlaced ? '#7F1D1D' : 'var(--col-heading)' }}>
            {!allPlaced
              ? `Place ${poolItems.length} more card${poolItems.length === 1 ? '' : 's'} to check the balance.`
              : isBalanced
              ? `Balanced — Assets ${fmt(totalAssets)} = Liabilities + Equity ${fmt(totalLiab)}`
              : `Out of balance — difference: ${fmt(Math.abs(diff))} ${diff > 0 ? '(assets > liab + equity)' : '(liab + equity > assets)'}`}
          </p>
          <p className="text-xs leading-relaxed"
            style={{ color: isBalanced ? 'var(--col-accent-text)' : allPlaced ? '#7F1D1D' : 'var(--col-muted)', opacity: 0.85 }}>
            {isBalanced
              ? 'The accounting equation always holds. What the company owns equals what it owes plus what is left for owners.'
              : allPlaced
              ? 'Some cards are in the wrong column. Drag misplaced cards back to the pool and try again.'
              : 'Drag cards into the correct column. Once all cards are placed, the equation should balance.'}
          </p>
        </div>
        {isBalanced && <CheckCircle className="h-5 w-5 shrink-0" style={{ color: 'var(--col-accent)' }} />}
        {allPlaced && !isBalanced && <AlertCircle className="h-5 w-5 shrink-0" style={{ color: '#B91C1C' }} />}
      </motion.div>

      {/* Reset */}
      <div className="flex justify-end mb-3">
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
          style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', minHeight: 36 }}
        >
          <RotateCcw className="h-3 w-3" />
          Reset — return all cards to pool
        </button>
      </div>

      <AnimatePresence>
        {markedDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
          >
            <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--col-accent-text)' }}>
              Balance Sheet complete — Assets = Liabilities + Equity is now intuitive.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function DropColumn({ dropRef, title, titleRu, subtitle, color, isHover, items, total, renderCard }) {
  return (
    <div
      ref={dropRef}
      className="rounded-2xl p-4 flex flex-col transition-colors"
      style={{
        backgroundColor: isHover ? 'var(--col-accent-light)' : 'var(--col-surface)',
        border: `2px ${isHover ? 'dashed' : 'solid'} ${isHover ? 'var(--col-accent)' : color}`,
        minHeight: 220,
      }}
    >
      <div className="mb-3">
        <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>{titleRu}</p>
        <p className="text-[10px] italic mt-1" style={{ color: 'var(--col-secondary)' }}>{subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 flex-1 mb-3 content-start">
        <AnimatePresence>
          {items.map(renderCard)}
        </AnimatePresence>
        {items.length === 0 && (
          <p className="text-xs italic self-center w-full text-center py-4" style={{ color: 'var(--col-muted)' }}>
            Drop cards here
          </p>
        )}
      </div>

      <div className="rounded-lg px-3 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: color, color: 'white' }}>
        <p className="text-xs font-semibold uppercase tracking-wider">Total</p>
        <motion.p
          key={total}
          initial={{ opacity: 0.6, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="text-lg font-bold"
        >
          {fmt(total)}
        </motion.p>
      </div>
    </div>
  );
}

function DraggableCard({ item, onDrop, onHoverChange, detectZone, state, isCorrect }) {
  return (
    <motion.div
      layout
      layoutId={`card-${item.id}`}
      drag
      dragMomentum={false}
      dragSnapToOrigin
      whileDrag={{ scale: 1.06, zIndex: 50, boxShadow: '0 8px 24px rgba(26,40,40,0.18)' }}
      transition={{ layout: { duration: 0.2, ease: 'easeOut' } }}
      onDrag={(_, info) => onHoverChange(detectZone(info.point))}
      onDragEnd={(_, info) => onDrop(item.id, info.point)}
      className="rounded-xl px-3 py-2 cursor-grab active:cursor-grabbing select-none"
      style={{
        backgroundColor: state === 'pool'
          ? 'var(--col-surface-secondary)'
          : isCorrect
          ? '#D0EDD8'
          : '#FEE2E2',
        border: `1px solid ${state === 'pool'
          ? 'var(--col-border)'
          : isCorrect
          ? '#7ABD90'
          : '#FCA5A5'}`,
        minWidth: 130,
        maxWidth: 200,
        touchAction: 'none', // important for touch-drag on mobile
      }}
    >
      <p className="text-xs font-semibold leading-tight"
        style={{ color: state === 'pool' ? 'var(--col-heading)' : isCorrect ? '#1F5E3A' : '#7F1D1D' }}>
        {item.label}
      </p>
      <p className="text-[10px] mt-0.5"
        style={{ color: state === 'pool' ? 'var(--col-muted)' : isCorrect ? '#1F5E3A' : '#7F1D1D', opacity: 0.75 }}>
        {item.labelRu}
      </p>
      <p className="text-sm font-bold mt-0.5"
        style={{ color: state === 'pool' ? 'var(--col-accent-text)' : isCorrect ? '#1F5E3A' : '#7F1D1D' }}>
        ${item.value}K
      </p>
    </motion.div>
  );
}
