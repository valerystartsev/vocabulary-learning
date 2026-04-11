import React, { useState } from 'react';
import { X, CheckCircle, XCircle, MapPin, ExternalLink, BookOpen, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Mini interaction ───────────────────────────────────────────────────────

function MiniInteraction({ interaction, accentColor }) {
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = checked && String(answer) === String(interaction.answer);

  const reset = () => { setAnswer(null); setChecked(false); };

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--col-dict-bg)', border: '1px solid var(--col-border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>
        Quick Check · Быстрая проверка
      </p>
      <p className="text-sm font-medium mb-3 leading-relaxed" style={{ color: 'var(--col-heading)' }}>
        {interaction.q}
      </p>

      {interaction.type === 'trueFalse' && (
        <div className="flex gap-2">
          {[true, false].map(v => {
            const sel = answer === v;
            const correct = checked && v === interaction.answer;
            const wrong = checked && sel && v !== interaction.answer;
            return (
              <button key={String(v)} disabled={checked} onClick={() => setAnswer(v)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  minHeight: 44,
                  border: correct ? '2px solid var(--col-correct)' : wrong ? '2px solid var(--col-incorrect)' : sel ? `2px solid ${accentColor}` : '1px solid var(--col-border)',
                  backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : sel ? `${accentColor}18` : 'var(--col-surface)',
                  color: correct ? '#1F5E3A' : wrong ? '#7F2020' : 'var(--col-body)',
                }}>
                {v ? 'True' : 'False'}
              </button>
            );
          })}
        </div>
      )}

      {interaction.type === 'choice' && (
        <div className="space-y-1.5">
          {interaction.options.map(opt => {
            const sel = answer === opt;
            const correct = checked && opt === interaction.answer;
            const wrong = checked && sel && opt !== interaction.answer;
            return (
              <button key={opt} disabled={checked} onClick={() => setAnswer(opt)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  minHeight: 44,
                  border: correct ? '2px solid var(--col-correct)' : wrong ? '2px solid var(--col-incorrect)' : sel ? `2px solid ${accentColor}` : '1px solid var(--col-border)',
                  backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : sel ? `${accentColor}18` : 'var(--col-surface-secondary)',
                  color: correct ? '#1F5E3A' : wrong ? '#7F2020' : 'var(--col-body)',
                  fontWeight: (sel || correct) ? 600 : 400,
                }}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {!checked && answer !== null && (
        <button onClick={() => setChecked(true)}
          className="mt-2.5 w-full rounded-xl text-sm font-semibold text-white"
          style={{ minHeight: 44, backgroundColor: accentColor }}>
          Check
        </button>
      )}

      {checked && (
        <div className="mt-2.5 flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs"
          style={{
            backgroundColor: isCorrect ? '#E8F5EE' : '#FEF2F2',
            color: isCorrect ? '#1F5E3A' : '#7F2020',
            borderLeft: `3px solid ${isCorrect ? 'var(--col-correct)' : 'var(--col-incorrect)'}`,
          }}>
          {isCorrect
            ? <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            : <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
          <span>
            {isCorrect ? 'Correct. ' : `Answer: ${interaction.answer === true ? 'True' : interaction.answer === false ? 'False' : interaction.answer}. `}
            {interaction.explanation}
          </span>
        </div>
      )}
      {checked && (
        <button onClick={reset} className="mt-2 text-xs px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
          Try again
        </button>
      )}
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────

export default function CountryPanel({ profile, onClose, accentColor = '#5E9E89' }) {
  if (!profile) return null;

  return (
    <div className="flex flex-col" style={{ backgroundColor: 'var(--col-surface)' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-5 pb-4"
        style={{ backgroundColor: 'var(--col-surface)', borderBottom: '1px solid var(--col-border)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 flex items-center justify-center rounded-lg mt-0.5"
              style={{ width: 36, height: 36, backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
              <MapPin className="h-4 w-4" style={{ color: accentColor }} />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight" style={{ color: 'var(--col-heading)' }}>{profile.name}</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>{profile.region}</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--col-secondary)' }}>{profile.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="shrink-0 flex items-center justify-center rounded-xl transition-all"
            style={{ width: 44, height: 44, color: 'var(--col-secondary)', border: '1px solid var(--col-border)', flexShrink: 0 }}
            aria-label="Close panel">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">

        {/* Vocabulary Lens */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-3.5 w-3.5" style={{ color: accentColor }} />
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
              Vocabulary Lens · Лексический фокус
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.vocabLens.map(word => (
              <Link
                key={word}
                to={`/glossary`}
                className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--col-accent-light)',
                  color: 'var(--col-accent-text)',
                  border: '1.5px solid var(--col-divider)',
                  textDecoration: 'none',
                }}
                title={`See "${word}" in Glossary`}
              >
                {word}
              </Link>
            ))}
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: 'var(--col-muted)' }}>
            Click any word to open it in the Glossary
          </p>
        </div>

        {/* Why These Words Fit */}
        <div className="rounded-xl px-4 py-3"
          style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', borderLeft: `3px solid ${accentColor}` }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--col-muted)' }}>
            Why These Words Fit · Почему эти слова подходят
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>
            {profile.whyFit}
          </p>
        </div>

        {/* Competition Case */}
        <div className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--col-border)' }}>
          <div className="px-4 py-3 flex items-center gap-2"
            style={{ backgroundColor: 'var(--col-sec-test-bg)', borderBottom: '1px solid rgba(94,158,137,0.25)' }}>
            <Scale className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-accent)' }}>
              Competition Case · Антимонопольное дело
            </p>
          </div>
          <div className="px-4 py-3 space-y-3" style={{ backgroundColor: 'var(--col-surface)' }}>
            <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--col-heading)' }}>
              {profile.competitionCase.title}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>
              {profile.competitionCase.summary}
            </p>
            <div className="px-3 py-2.5 rounded-lg text-xs leading-relaxed"
              style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', borderLeft: '3px solid var(--col-accent)' }}>
              <span className="font-semibold">Vocabulary connection: </span>
              {profile.competitionCase.vocabConnection}
            </div>
            <a
              href={profile.competitionCase.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--col-surface-secondary)',
                border: '1px solid var(--col-border)',
                color: 'var(--col-link)',
                textDecoration: 'none',
              }}
            >
              <ExternalLink className="h-3 w-3 shrink-0" />
              {profile.competitionCase.sourceLabel}
            </a>
          </div>
        </div>

        {/* Mini interaction */}
        {profile.interaction && (
          <MiniInteraction interaction={profile.interaction} accentColor={accentColor} />
        )}

      </div>
    </div>
  );
}