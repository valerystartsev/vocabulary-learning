import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import PronounceButton from '../PronounceButton';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Search, BookOpen } from 'lucide-react';
import WordMorphologyBlock from './WordMorphologyBlock';
import { wordMorphology } from '../../data/wordMorphology';

// ── Visual memory icons (SVG inline, 24×24) ──────────────────────────────────
// One icon per semantic concept category. Words are assigned by term stem matching.
function WordIcon({ term }) {
  const t = term.toLowerCase().replace(/[^a-z\s]/g, '');

  const icon = (() => {
    // Markets / competition
    if (t.includes('market') || t.includes('supply') || t.includes('demand'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    // Competition / compete
    if (t.includes('competi'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3"/>
          <path d="M6 20v-2a6 6 0 0112 0v2"/>
          <path d="M18.5 8.5L20 7"/>
          <path d="M5.5 8.5L4 7"/>
        </svg>
      );
    // Monopoly / monopolise
    if (t.includes('monopol'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>
        </svg>
      );
    // Merger
    if (t.includes('merger') || t.includes('merge'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h6l6 6-6 6H5"/>
          <path d="M5 12h8"/>
          <path d="M19 6v12"/>
        </svg>
      );
    // Revenue / money / returns
    if (t.includes('revenue') || t.includes('return') || t.includes('profit') || t.includes('refund'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      );
    // Growth / economic growth
    if (t.includes('growth') || t.includes('increase') || t.includes('gdp'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
          <polyline points="16 7 22 7 22 13"/>
        </svg>
      );
    // Fluctuate / fluctuation
    if (t.includes('fluctu'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2 12 6 7 10 17 14 7 18 14 22 10"/>
        </svg>
      );
    // Break even
    if (t.includes('break'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="20" x2="21" y2="4"/>
          <line x1="3" y1="4" x2="21" y2="20"/>
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
        </svg>
      );
    // Overhead / cost
    if (t.includes('overhead') || t.includes('cost'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      );
    // Recruit / recruitment / hire / enlist
    if (t.includes('recruit') || t.includes('hire') || t.includes('enlist'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="7" r="4"/>
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="16" y1="11" x2="22" y2="11"/>
        </svg>
      );
    // Resume / CV
    if (t.includes('resume') || t.includes(' cv'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      );
    // Restrict / control / authority
    if (t.includes('restrict') || t.includes('control') || t.includes('authorit'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      );
    // Permit / authorize
    if (t.includes('permit') || t.includes('authoriz'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      );
    // Negotiate / deal
    if (t.includes('negotiat') || t.includes('deal'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      );
    // Purchase / buy
    if (t.includes('purchase') || t.includes('buy'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
        </svg>
      );
    // Complaint / complain
    if (t.includes('complain'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );
    // Damage
    if (t.includes('damage'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );
    // Cancel
    if (t.includes('cancel'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      );
    // Capital goods / capital accumulation
    if (t.includes('capital'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
          <line x1="10" y1="14" x2="14" y2="14"/>
        </svg>
      );
    // Redundant / unemployment / retrain
    if (t.includes('redundant') || t.includes('unemploy') || t.includes('retrain'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="23" y1="11" x2="17" y2="17"/>
          <line x1="17" y1="11" x2="23" y2="17"/>
        </svg>
      );
    // Replace
    if (t.includes('replace'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/>
          <polyline points="23 20 23 14 17 14"/>
          <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
        </svg>
      );
    // Pollution / natural resources / social costs
    if (t.includes('pollut') || t.includes('natural') || t.includes('social cost'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      );
    // Opportunity cost
    if (t.includes('opportunit'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 8 12 12 14 14"/>
          <line x1="8" y1="12" x2="16" y2="12" strokeOpacity="0.3"/>
        </svg>
      );
    // Standard of living / benefit / leisure
    if (t.includes('standard') || t.includes('benefit') || t.includes('leisure'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      );
    // Insurance
    if (t.includes('insuran'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      );
    // Save / rent / rental
    if (t.includes('save') || t.includes('rent'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z"/>
        </svg>
      );
    // Employment / work
    if (t.includes('employ') || t.includes('work') || t.includes('labour'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        </svg>
      );
    // Support / encourage
    if (t.includes('support') || t.includes('encourag'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 010 8h-1"/>
          <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      );
    // Technology / technological
    if (t.includes('technolog') || t.includes('advance'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2"/>
          <rect x="9" y="9" width="6" height="6"/>
          <line x1="9" y1="1" x2="9" y2="4"/>
          <line x1="15" y1="1" x2="15" y2="4"/>
          <line x1="9" y1="20" x2="9" y2="23"/>
          <line x1="15" y1="20" x2="15" y2="23"/>
          <line x1="20" y1="9" x2="23" y2="9"/>
          <line x1="20" y1="14" x2="23" y2="14"/>
          <line x1="1" y1="9" x2="4" y2="9"/>
          <line x1="1" y1="14" x2="4" y2="14"/>
        </svg>
      );
    // Enterprise / business
    if (t.includes('enterprise') || t.includes('business'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    // Output / input / amount / average
    if (t.includes('output') || t.includes('input') || t.includes('amount') || t.includes('average') || t.includes('range'))
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      );
    // Default
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    );
  })();

  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-lg"
      style={{
        width: 36, height: 36,
        backgroundColor: 'var(--col-accent-light)',
        border: '1px solid var(--col-divider)',
        color: 'var(--col-accent)',
      }}
    >
      <div style={{ width: 18, height: 18 }}>{icon}</div>
    </div>
  );
}

export default function Dictionary({ vocabulary }) {
  const { progress, markWordLearned, markWordWeak } = useProgress();
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = vocabulary.filter(v =>
    v.term.toLowerCase().includes(search.toLowerCase()) ||
    v.translationRu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
          <h2 className="font-semibold" style={{ fontSize: 16, color: 'var(--col-heading)' }}>
            Dictionary
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}
          >
            {vocabulary.length} words
          </span>
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--col-muted)' }} />
        <Input
          placeholder="Search words..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
          style={{ minHeight: 40 }}
        />
      </div>

      <div className="space-y-1.5">
        {filtered.map(word => {
          const isExpanded = expandedId === word.id;
          const isLearned = progress.learnedWords.includes(word.id);
          const isWeak = progress.weakWords.includes(word.id);

          return (
            <div
              key={word.id}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: isLearned ? '#F0FAF5' : isWeak ? '#FFFBF0' : 'var(--col-surface)',
                border: `1px solid ${isLearned ? '#A8D5BA' : isWeak ? '#E8D08A' : 'var(--col-border)'}`,
              }}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : word.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                   <WordIcon term={word.term} />
                   <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold" style={{ fontSize: 15, color: 'var(--col-heading)' }}>
                        {word.term}
                      </span>
                      <PronounceButton term={word.term} size="xs" />
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                        style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}
                      >
                        {word.pos}
                      </span>
                      {isLearned && <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-correct)' }} />}
                      {isWeak && !isLearned && <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-warning)' }} />}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--col-secondary)' }}>{word.translationRu}</span>
                  </div>
                </div>
                {isExpanded
                  ? <ChevronUp className="h-4 w-4 shrink-0 ml-2" style={{ color: 'var(--col-muted)' }} />
                  : <ChevronDown className="h-4 w-4 shrink-0 ml-2" style={{ color: 'var(--col-muted)' }} />
                }
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--col-border)' }}>
                  <div className="space-y-3 mt-3">
                    {/* Morphology: IPA + forms */}
                    <WordMorphologyBlock morphology={wordMorphology[word.id]} derivedForms={wordMorphology[word.id]?.derivedForms} />

                  {/* Memory trick */}
                    <div
                      className="rounded-lg px-4 py-3"
                      style={{ backgroundColor: 'var(--col-dict-bg)', borderLeft: '3px solid var(--col-accent)' }}
                    >
                      <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--col-muted)', letterSpacing: '0.06em' }}>
                        Memory Trick · Мнемоника
                      </p>
                      <p className="text-sm" style={{ color: 'var(--col-body)' }}>{word.trick}</p>
                    </div>

                    {/* Definitions */}
                    <div className="grid md:grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
                        <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--col-muted)' }}>English definition</p>
                        <p className="text-sm" style={{ color: 'var(--col-body)', lineHeight: 1.6 }}>{word.meaningEn}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
                        <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--col-muted)' }}>Русское значение</p>
                        <p className="text-sm" style={{ color: 'var(--col-body)', lineHeight: 1.6 }}>{word.meaningRu}</p>
                      </div>
                    </div>

                    {/* Collocations */}
                    {word.collocations && word.collocations.length > 0 && (
                      <div
                        className="rounded-lg px-4 py-3"
                        style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
                      >
                        <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: 'var(--col-muted)', letterSpacing: '0.06em' }}>
                          Collocations · Сочетания
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {word.collocations.map((col, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: 'var(--col-tag-bg)',
                                color: 'var(--col-tag-text)',
                                border: '1px solid var(--col-divider)',
                                lineHeight: 1.5,
                              }}
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Example sentence — improved typography */}
                    <div
                      className="px-4 py-3 rounded-lg"
                      style={{
                        backgroundColor: 'var(--col-accent-light)',
                        borderLeft: '3px solid var(--col-accent)',
                        border: '1px solid var(--col-divider)',
                      }}
                    >
                      <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: 'var(--col-accent-text)', letterSpacing: '0.06em', opacity: 0.7 }}>
                        Example
                      </p>
                      <p
                        className="font-lora"
                        style={{
                          fontSize: 15,
                          fontStyle: 'italic',
                          color: 'var(--col-accent-text)',
                          lineHeight: 1.65,
                        }}
                      >
                        "{word.example}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: isLearned ? 'var(--col-correct)' : 'transparent',
                          border: `1px solid var(--col-correct)`,
                          color: isLearned ? 'white' : 'var(--col-correct)',
                          minHeight: 40,
                        }}
                        onClick={() => markWordLearned(word.id)}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {isLearned ? 'Learned ✓' : 'Mark Learned'}
                      </button>
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: isWeak ? '#FFF8E7' : 'transparent',
                          border: `1px solid ${isWeak ? 'var(--col-warning)' : 'var(--col-border)'}`,
                          color: isWeak ? 'var(--col-warning)' : 'var(--col-secondary)',
                          minHeight: 40,
                        }}
                        onClick={() => markWordWeak(word.id)}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {isWeak ? 'Weak ⚠' : 'Add to Weak Words'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}