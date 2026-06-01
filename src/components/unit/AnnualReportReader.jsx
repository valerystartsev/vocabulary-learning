import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, BarChart3, FileText, Calculator, BookOpen,
  CheckCircle, ChevronRight,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const TAB_ICONS = {
  highlights: BarChart3,
  letter: FileText,
  balancesheet: Calculator,
  vocab: BookOpen,
};

const DONE_THRESHOLD = 3; // visited 3 of 4 tabs

// Render the shareholder letter with highlighted terms turned into chips.
// Looks for **bold** markdown-style and also case-insensitive matches of
// the highlightedTerms list.
function renderLetter(text, terms = [], onTermClick) {
  // First split by **bold** sections
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      const word = seg.slice(2, -2);
      return (
        <button
          key={i}
          onClick={() => onTermClick(word)}
          className="font-bold inline px-1 rounded transition-colors"
          style={{ color: 'var(--col-accent-text)', backgroundColor: 'var(--col-accent-light)' }}
        >
          {word}
        </button>
      );
    }
    // Newlines → paragraph breaks
    return seg.split('\n').map((line, j) =>
      <React.Fragment key={`${i}-${j}`}>
        {j > 0 && <><br /><br /></>}
        {line}
      </React.Fragment>
    );
  });
}

export default function AnnualReportReader({ data, unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const tabs = data?.tabs || [];
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [visited, setVisited] = useState(new Set(tabs[0] ? [tabs[0].id] : []));
  const [glossaryTerm, setGlossaryTerm] = useState(null);
  const [markedDone, setMarkedDone] = useState(false);

  // Build a quick lookup: term → entry from the vocab tab
  const vocabIndex = useMemo(() => {
    const vocabTab = tabs.find(t => t.id === 'vocab');
    const entries = vocabTab?.content?.entries || [];
    const m = {};
    entries.forEach(e => { m[e.term.toLowerCase()] = e; });
    return m;
  }, [tabs]);

  const handleTab = (id) => {
    setActiveId(id);
    setVisited(prev => new Set([...prev, id]));
    setGlossaryTerm(null);
  };

  useEffect(() => {
    if (!markedDone && visited.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'annualreport');
    }
  }, [visited, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode) setVisited(new Set(tabs.map(t => t.id)));
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!tabs.length) return null;

  const active = tabs.find(t => t.id === activeId) || tabs[0];

  return (
    <div className="mb-8">
      {/* Intro */}
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
          <div className="flex gap-1">
            {tabs.map(t => (
              <div
                key={t.id}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: visited.has(t.id) ? 'var(--col-accent)' : 'var(--col-divider)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>{visited.size}/{tabs.length}</span>
        </div>
      </div>

      {/* Company header */}
      {data.company && (
        <div
          className="rounded-2xl px-5 py-4 mb-3 flex items-center justify-between gap-3 flex-wrap"
          style={{ backgroundColor: 'var(--col-sidebar)', color: 'white' }}
        >
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70">Annual Report</p>
            <p className="font-bold text-lg">{data.company.name}</p>
            <p className="text-xs opacity-80">{data.company.sector}</p>
          </div>
          <p className="text-3xl font-bold opacity-90">{data.company.year}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-3 rounded-2xl p-1.5"
        style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
        {tabs.map(t => {
          const isActive = t.id === active.id;
          const Icon = TAB_ICONS[t.id] || FileText;
          return (
            <button
              key={t.id}
              onClick={() => handleTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--col-accent)' : 'transparent',
                color: isActive ? 'white' : 'var(--col-heading)',
                minHeight: 40,
                minWidth: 110,
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.title}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
        >
          {active.id === 'highlights' && <Highlights content={active.content} />}
          {active.id === 'letter' && (
            <Letter content={active.content} onTermClick={(w) => setGlossaryTerm(w.toLowerCase())} />
          )}
          {active.id === 'balancesheet' && <BalanceSheetView content={active.content} />}
          {active.id === 'vocab' && <VocabList content={active.content} />}
        </motion.div>
      </AnimatePresence>

      {/* Glossary popover (when a term is clicked in the letter) */}
      <AnimatePresence>
        {glossaryTerm && vocabIndex[glossaryTerm] && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 rounded-2xl p-4"
            style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '3px solid var(--col-accent)' }}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--col-accent-text)' }}>
                {vocabIndex[glossaryTerm].term}
              </p>
              <button
                onClick={() => setGlossaryTerm(null)}
                className="ml-auto text-xs"
                style={{ color: 'var(--col-muted)' }}
              >
                close
              </button>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>
              {vocabIndex[glossaryTerm].definition}
            </p>
            {vocabIndex[glossaryTerm].inContext && (
              <p className="text-xs italic mt-2" style={{ color: 'var(--col-secondary)' }}>
                In context: "{vocabIndex[glossaryTerm].inContext}"
              </p>
            )}
          </motion.div>
        )}
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
              Annual Report Reader complete — you can read a real company report.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Highlights({ content }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {(content.stats || []).map(stat => {
          const isUp = stat.direction === 'up';
          const ArrowIcon = isUp ? TrendingUp : TrendingDown;
          const color = isUp ? '#1F7A4D' : '#B91C1C';
          return (
            <div
              key={stat.label}
              className="rounded-xl p-3"
              style={{ backgroundColor: 'var(--col-surface-secondary)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: 'var(--col-muted)' }}>
                {stat.label}
              </p>
              <p className="text-xl font-bold" style={{ color: 'var(--col-heading)' }}>
                {stat.value}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowIcon className="h-3 w-3" style={{ color }} />
                <span className="text-[10px] font-semibold" style={{ color }}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {content.summary && (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>
          {content.summary}
        </p>
      )}
    </>
  );
}

function Letter({ content, onTermClick }) {
  return (
    <>
      {content.author && (
        <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
          {content.author}
          {content.authorRu && (
            <span className="font-normal italic ml-2" style={{ textTransform: 'none' }}>
              · {content.authorRu}
            </span>
          )}
        </p>
      )}
      <div className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>
        {renderLetter(content.letter, content.highlightedTerms, onTermClick)}
      </div>
      <p className="text-[10px] italic mt-4" style={{ color: 'var(--col-muted)' }}>
        Bold words are vocabulary terms. Click any to see its definition.
      </p>
    </>
  );
}

function BalanceSheetView({ content }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Assets */}
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
          <p className="font-semibold text-sm mb-2" style={{ color: 'var(--col-heading)' }}>
            {content.assets.title}
          </p>
          <div className="space-y-1">
            {content.assets.items.map(item => (
              <div key={item.label} className="flex justify-between text-xs py-1"
                style={{ color: 'var(--col-body)', borderBottom: '1px dashed var(--col-divider)' }}>
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-bold mt-2 pt-2"
            style={{ color: '#1F7A4D', borderTop: '2px solid #1F7A4D' }}>
            <span>{content.assets.total.label}</span>
            <span>{content.assets.total.value}</span>
          </div>
        </div>

        {/* Liabilities + Equity */}
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
          <p className="font-semibold text-sm mb-2" style={{ color: 'var(--col-heading)' }}>
            {content.liabilities.title}
          </p>
          <div className="space-y-1">
            {content.liabilities.items.map(item => (
              <div key={item.label} className="flex justify-between text-xs py-1"
                style={{
                  color: item.section === 'total' || item.section === 'equity' ? 'var(--col-heading)' : 'var(--col-body)',
                  fontWeight: item.section === 'total' || item.section === 'equity' ? 600 : 400,
                  borderBottom: '1px dashed var(--col-divider)',
                }}>
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-bold mt-2 pt-2"
            style={{ color: '#C9955A', borderTop: '2px solid #C9955A' }}>
            <span>{content.liabilities.total.label}</span>
            <span>{content.liabilities.total.value}</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl p-3 text-center"
        style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-accent)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--col-accent-text)' }}>
          {content.equation}
        </p>
        {content.equationRu && (
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-accent-text)', opacity: 0.85 }}>
            {content.equationRu}
          </p>
        )}
      </div>
    </>
  );
}

function VocabList({ content }) {
  return (
    <>
      {content.intro && (
        <p className="text-sm mb-1" style={{ color: 'var(--col-body)' }}>{content.intro}</p>
      )}
      {content.introRu && (
        <p className="text-xs italic mb-4" style={{ color: 'var(--col-muted)' }}>{content.introRu}</p>
      )}
      <div className="space-y-2">
        {(content.entries || []).map(entry => (
          <div key={entry.term} className="rounded-xl p-3"
            style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
            <div className="flex items-baseline gap-2 mb-1">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-accent)' }} />
              <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>{entry.term}</p>
            </div>
            <p className="text-sm leading-relaxed ml-5" style={{ color: 'var(--col-body)' }}>
              {entry.definition}
            </p>
            {entry.inContext && (
              <p className="text-xs italic ml-5 mt-1" style={{ color: 'var(--col-secondary)' }}>
                "{entry.inContext}"
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
