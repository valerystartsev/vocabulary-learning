import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote, Gauge, Activity, LifeBuoy, ShieldCheck, Lock,
  CheckCircle, Landmark, MapPin,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const ICON_MAP = { Banknote, Gauge, Activity, LifeBuoy, ShieldCheck, Lock };

// Section marked done after clicking 4 of 6 segments
const DONE_THRESHOLD = 4;

// SVG wheel geometry
const VIEW = 300;
const CENTER = VIEW / 2;
const OUTER_R = 138;
const INNER_R = 64;
const LABEL_R = (OUTER_R + INNER_R) / 2;

// Convert polar to cartesian — start at top (12 o'clock), go clockwise
function polar(angleDeg, radius) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return {
    x: CENTER + radius * Math.cos(a),
    y: CENTER + radius * Math.sin(a),
  };
}

// Build a ring-sector path (donut slice) between two angles
function sectorPath(startAngle, endAngle) {
  const p1 = polar(startAngle, OUTER_R);
  const p2 = polar(endAngle,   OUTER_R);
  const p3 = polar(endAngle,   INNER_R);
  const p4 = polar(startAngle, INNER_R);
  // sweep flag 1 for outer arc (clockwise), 0 for inner arc (counter-clockwise)
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${OUTER_R} ${OUTER_R} 0 0 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${INNER_R} ${INNER_R} 0 0 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

export default function CentralBankWheel({ data, unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const functions = data?.functions || [];
  const examples = data?.examples || [];

  const [activeId, setActiveId] = useState(functions[0]?.id);
  const [seen, setSeen] = useState(new Set(functions[0] ? [functions[0].id] : []));
  const [markedDone, setMarkedDone] = useState(false);

  // Mobile detection — used to enlarge the centre disc, shrink text,
  // and surface a fallback caption below the wheel so titles never
  // overflow onto the icon on narrow phones.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Visual centre radius — on mobile we steal ~14 SVG units from the
  // segment ring to give text inside the centre 47% more horizontal room.
  // Segment geometry itself (segments const, LABEL_R) stays put; the
  // bigger centre disc simply paints over the inner edge of the segments.
  const centerR = isMobile ? 78 : INNER_R;

  // Precompute segment geometry — depends only on segment count
  const segments = useMemo(() => {
    const n = functions.length || 1;
    const step = 360 / n;
    return functions.map((fn, i) => {
      const startAngle = i * step;
      const endAngle = (i + 1) * step;
      const midAngle = startAngle + step / 2;
      const labelPos = polar(midAngle, LABEL_R);
      return { fn, startAngle, endAngle, midAngle, labelPos, path: sectorPath(startAngle, endAngle) };
    });
  }, [functions]);

  const handleSelect = (id) => {
    setActiveId(id);
    setSeen(prev => new Set([...prev, id]));
  };

  useEffect(() => {
    if (!markedDone && seen.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'centralbank');
    }
  }, [seen, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode && functions.length > 0) {
      setSeen(new Set(functions.map(f => f.id)));
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!functions.length) return null;

  const active = functions.find(f => f.id === activeId) || functions[0];
  const ActiveIcon = ICON_MAP[active.icon] || Landmark;

  return (
    <div className="mb-8">
      {/* Intro + progress */}
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
            {functions.map(f => (
              <div
                key={f.id}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: seen.has(f.id) ? 'var(--col-accent)' : 'var(--col-divider)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {seen.size}/{functions.length}
          </span>
        </div>
      </div>

      {/* Wheel + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 mb-3 items-start">
        {/* SVG wheel */}
        <div className="mx-auto" style={{ width: '100%', maxWidth: 360, minWidth: 280 }}>
          <svg viewBox={`0 0 ${VIEW} ${VIEW}`} style={{ width: '100%', height: 'auto' }} aria-label="Central bank functions wheel">
            {/* Segments */}
            {segments.map(({ fn, path, labelPos, midAngle }) => {
              const isActive = fn.id === active.id;
              const wasSeen = seen.has(fn.id);
              const Icon = ICON_MAP[fn.icon] || Landmark;
              return (
                <g key={fn.id} onClick={() => handleSelect(fn.id)} style={{ cursor: 'pointer' }}>
                  <motion.path
                    d={path}
                    animate={{
                      fill: isActive
                        ? 'var(--col-accent)'
                        : wasSeen
                        ? 'var(--col-accent-light)'
                        : 'var(--col-surface)',
                    }}
                    initial={false}
                    transition={{ duration: 0.2 }}
                    stroke="var(--col-border)"
                    strokeWidth="1.5"
                  />
                  {/* Icon placeholder — render via foreignObject so we can use lucide-react */}
                  <foreignObject
                    x={labelPos.x - 14}
                    y={labelPos.y - 22}
                    width="28"
                    height="28"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div
                      style={{
                        width: 28, height: 28,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isActive ? 'white' : 'var(--col-accent)',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                  </foreignObject>
                  {/* Segment number under icon */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={isActive ? 'white' : 'var(--col-heading)'}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {functions.indexOf(fn) + 1}
                  </text>
                </g>
              );
            })}

            {/* Centre disc — radius varies with viewport */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={centerR - 4}
              fill="var(--col-sidebar)"
              stroke="var(--col-accent)"
              strokeWidth="2"
            />

            {/* Centre content — title via foreignObject with fade transition */}
            <foreignObject
              x={CENTER - centerR + 6}
              y={CENTER - centerR + 6}
              width={(centerR - 6) * 2}
              height={(centerR - 6) * 2}
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', padding: isMobile ? '6px 4px' : '8px',
                  color: 'white',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ width: '100%' }}
                  >
                    <ActiveIcon
                      size={isMobile ? 18 : 22}
                      style={{ margin: isMobile ? '0 auto 2px' : '0 auto 4px', display: 'block' }}
                    />
                    <div
                      style={{
                        fontSize: isMobile ? 10 : 11,
                        fontWeight: 700,
                        lineHeight: 1.25,
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                      }}
                    >
                      {active.title}
                    </div>
                    {/* Hide RU inside the circle on mobile — surfaced below the wheel instead */}
                    {!isMobile && (
                      <div style={{ fontSize: 9, opacity: 0.75, marginTop: 2, lineHeight: 1.25 }}>
                        {active.titleRu}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </foreignObject>
          </svg>

          {/* Mobile-only caption: shows active function EN + RU below the wheel.
              Acts as the safety net when long titles can't safely fit inside the
              centre disc on narrow phones. Hidden on md+ — desktop keeps the
              original "EN inside / RU inside" layout untouched. */}
          {isMobile && (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`caption-${active.id}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 rounded-lg px-3 py-2 flex items-start justify-center gap-2 text-center"
                style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
              >
                <div>
                  <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--col-accent-text)' }}>
                    {active.title}
                  </p>
                  <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-accent-text)', opacity: 0.75 }}>
                    {active.titleRu}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Mobile-friendly hint */}
          <p className="text-[10px] italic text-center mt-1" style={{ color: 'var(--col-muted)' }}>
            Click any segment of the wheel
          </p>
        </div>

        {/* Side panel — active function details */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
          >
            <div className="flex items-baseline justify-between gap-2 mb-3 flex-wrap">
              <p className="font-semibold text-base" style={{ color: 'var(--col-heading)' }}>
                <span className="opacity-50 mr-1.5">#{functions.indexOf(active) + 1}</span>
                {active.title}
              </p>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)' }}
              >
                Function
              </span>
            </div>
            <p className="text-xs mb-3 italic" style={{ color: 'var(--col-muted)' }}>
              {active.titleRu}
            </p>

            <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--col-body)' }}>
              {active.description}
            </p>
            <p className="text-xs italic mb-4 leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
              {active.descriptionRu}
            </p>

            {/* Generic example */}
            {active.example && (
              <div
                className="rounded-lg px-3 py-2.5 mb-2"
                style={{ backgroundColor: 'var(--col-surface-secondary)', borderLeft: '2px solid var(--col-accent)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--col-muted)' }}>
                  Example
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>
                  {active.example}
                </p>
              </div>
            )}

            {/* Bank of Russia specific example */}
            {active.exampleRu && (
              <div
                className="rounded-lg px-3 py-2.5"
                style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '2px solid var(--col-accent)' }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-accent-text)' }}>
                    Bank of Russia — Банк России
                  </p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--col-accent-text)' }}>
                  {active.exampleRu}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Example banks row (kept from previous version) */}
      {examples.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
        >
          <p
            className="font-semibold uppercase tracking-wider mb-2.5"
            style={{ fontSize: 10, color: 'var(--col-muted)', letterSpacing: '0.06em' }}
          >
            Examples of central banks
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {examples.map(bank => (
              <div
                key={bank.name}
                className="rounded-lg px-3 py-2 text-center"
                style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
              >
                <div style={{ fontSize: 22 }}>{bank.flag}</div>
                <p className="text-xs font-semibold mt-1 leading-tight" style={{ color: 'var(--col-heading)' }}>
                  {bank.name}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--col-muted)' }}>
                  {bank.country} · {bank.currency}
                </p>
              </div>
            ))}
          </div>
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
              Central Bank Wheel complete — you know the six functions and how Bank of Russia uses them.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
