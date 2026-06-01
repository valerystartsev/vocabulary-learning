import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, Search, Scale, CheckCircle2, CheckCircle,
  ChevronRight, MessageSquare,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const ICON_MAP = { AlertCircle, Search, Scale, CheckCircle2 };

// Section is marked done after at least 3 of 4 steps have been opened
const DONE_THRESHOLD = 3;

// Render **bold** markdown chunks inside the vocab-in-context lines as
// chip-style highlights. Anything outside ** ** stays plain.
function renderInlineVocab(text) {
  if (!text) return null;
  return text.split(/(\*\*[^*]+\*\*)/g).map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong
          key={i}
          style={{
            color: 'var(--col-accent-text)',
            backgroundColor: 'var(--col-accent-light)',
            padding: '1px 5px',
            borderRadius: 4,
            fontWeight: 700,
          }}
        >
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{seg}</React.Fragment>;
  });
}

export default function ComplaintResolutionPath({ data, unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const steps = data?.steps || [];

  const [activeId, setActiveId] = useState(steps[0]?.id);
  const [seen, setSeen] = useState(new Set(steps[0] ? [steps[0].id] : []));
  const [markedDone, setMarkedDone] = useState(false);

  const handleSelect = (id) => {
    setActiveId(id);
    setSeen((prev) => new Set([...prev, id]));
  };

  useEffect(() => {
    if (!markedDone && seen.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'complaintpath');
    }
  }, [seen, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode && steps.length > 0) {
      setSeen(new Set(steps.map((s) => s.id)));
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!steps.length) return null;
  const active = steps.find((s) => s.id === activeId) || steps[0];
  const ActiveIcon = ICON_MAP[active.icon] || MessageSquare;

  return (
    <div className="mb-8">
      {/* Intro + progress */}
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          {data.intro && (
            <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>{data.intro}</p>
          )}
          {data.introRu && (
            <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{data.introRu}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {steps.map((s) => (
              <div
                key={s.id}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: seen.has(s.id) ? 'var(--col-accent)' : 'var(--col-divider)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {seen.size}/{steps.length}
          </span>
        </div>
      </div>

      {/* Stepper — horizontal on md+, vertical stack on mobile. */}
      <div className="flex flex-col md:flex-row items-stretch gap-1.5 mb-4">
        {steps.map((step, idx) => {
          const Icon = ICON_MAP[step.icon] || MessageSquare;
          const isActive = step.id === active.id;
          const wasSeen = seen.has(step.id);

          return (
            <React.Fragment key={step.id}>
              {/* Arrow between steps (desktop only) */}
              {idx > 0 && (
                <div className="hidden md:flex items-center shrink-0" style={{ color: 'var(--col-muted)' }}>
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}

              <button
                onClick={() => handleSelect(step.id)}
                aria-pressed={isActive}
                className="flex-1 flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-colors"
                style={{
                  backgroundColor: isActive ? 'var(--col-accent)' : wasSeen ? 'var(--col-accent-light)' : 'var(--col-surface)',
                  border: `1.5px solid ${isActive ? 'var(--col-accent)' : wasSeen ? 'var(--col-divider)' : 'var(--col-border)'}`,
                  minHeight: 56,
                  boxShadow: isActive ? '0 2px 10px rgba(94,158,137,0.13)' : 'none',
                }}
              >
                {/* Step number badge */}
                <span
                  className="flex items-center justify-center rounded-lg shrink-0 text-xs font-bold"
                  style={{
                    width: 24, height: 24,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--col-surface-secondary)',
                    color: isActive ? 'white' : 'var(--col-muted)',
                  }}
                >
                  {idx + 1}
                </span>

                {/* Step icon */}
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: isActive ? 'white' : 'var(--col-accent)' }}
                />

                {/* Step labels */}
                <span className="min-w-0 flex-1">
                  <span
                    className="block text-sm font-semibold leading-tight"
                    style={{ color: isActive ? 'white' : 'var(--col-heading)' }}
                  >
                    {step.title}
                  </span>
                  <span
                    className="block text-[11px] italic leading-tight mt-0.5"
                    style={{
                      color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--col-muted)',
                    }}
                  >
                    {step.titleRu}
                  </span>
                </span>

                {wasSeen && !isActive && (
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-accent)' }} />
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Active step detail */}
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
          {/* Step header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: 38, height: 38, backgroundColor: 'var(--col-accent-light)' }}
            >
              <ActiveIcon className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            </div>
            <div>
              <p className="font-semibold text-base leading-tight" style={{ color: 'var(--col-heading)' }}>
                {active.title}
              </p>
              <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
                Step {steps.indexOf(active) + 1} of {steps.length} · {active.titleRu}
              </p>
            </div>
          </div>

          {/* What happens */}
          <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--col-body)' }}>
            {active.what}
          </p>
          <p className="text-xs italic mb-4 leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
            {active.whatRu}
          </p>

          {/* Vocab in context */}
          {active.vocab && (
            <div
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: 'var(--col-surface-secondary)', borderLeft: '3px solid var(--col-accent)' }}
            >
              <p
                className="font-semibold uppercase tracking-wider mb-2"
                style={{ fontSize: 10, color: 'var(--col-muted)', letterSpacing: '0.06em' }}
              >
                Vocabulary in context · Лексика в контексте
              </p>
              <p className="text-sm leading-relaxed mb-1.5" style={{ color: 'var(--col-body)' }}>
                {renderInlineVocab(active.vocab)}
              </p>
              {active.vocabRu && (
                <p className="text-xs italic leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
                  {renderInlineVocab(active.vocabRu)}
                </p>
              )}
            </div>
          )}
        </motion.div>
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
              Complaint path complete — you've walked through the full resolution flow.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
