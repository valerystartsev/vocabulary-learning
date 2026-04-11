import React from 'react';

// Reusable morphology display block: IPA + noun plural/countability + verb 5-form block.
// Used in Dictionary (unit page), Glossary (global), and any expanded word card.
// Receives the morphology object directly from wordMorphology[word.id].

export default function WordMorphologyBlock({ morphology, derivedForms }) {
  if (!morphology && !derivedForms) return null;
  const { ipa, noun, verb } = morphology || {};
  const hasBoth = noun && verb;
  const hasAnyMorphology = noun || verb;

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--col-border)' }}
    >
      {/* IPA row */}
      {ipa && (
        <div
          className="flex items-center gap-3 px-4 py-2.5 flex-wrap"
          style={{ backgroundColor: 'var(--col-accent-light)', borderBottom: hasAnyMorphology ? '1px solid var(--col-divider)' : 'none' }}
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-widest shrink-0"
            style={{ color: 'var(--col-accent-text)', opacity: 0.7 }}
          >
            Pronunciation
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 15,
              color: 'var(--col-accent-text)',
              letterSpacing: '0.03em',
              fontWeight: 500,
            }}
          >
            {ipa}
          </span>
        </div>
      )}

      {/* Noun morphology */}
      {noun && (
        <div
          className="px-4 py-2.5 flex items-center gap-3 flex-wrap"
          style={{
            backgroundColor: 'var(--col-surface-secondary)',
            borderBottom: verb ? '1px solid var(--col-divider)' : 'none',
          }}
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-widest shrink-0"
            style={{ color: 'var(--col-muted)' }}
          >
            {hasBoth ? 'Noun' : 'Noun form'}
          </span>
          {noun.plural && (
            <span className="text-sm" style={{ color: 'var(--col-body)' }}>
              Plural:{' '}
              <strong style={{ color: 'var(--col-heading)', fontWeight: 600 }}>
                {noun.plural}
              </strong>
            </span>
          )}
          {noun.countability && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: 'var(--col-tag-bg)',
                color: 'var(--col-tag-text)',
                border: '1px solid var(--col-divider)',
              }}
            >
              {noun.countability}
            </span>
          )}
        </div>
      )}

      {/* Verb forms */}
      {verb && (
        <div
          className="px-4 py-2.5"
          style={{ backgroundColor: 'var(--col-surface-secondary)' }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--col-muted)' }}
          >
            {hasBoth ? 'Verb forms' : 'Verb forms'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {[
              ['Base', verb.base],
              ['3rd person', verb.third],
              ['Past Simple', verb.pastSimple],
              ['Past Participle', verb.pastParticiple],
              ['-ing form', verb.ing],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center gap-2 min-w-0">
                <span
                  className="text-xs shrink-0"
                  style={{ color: 'var(--col-muted)', minWidth: 96 }}
                >
                  {label}
                </span>
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--col-heading)' }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Derived forms */}
      {derivedForms && derivedForms.length > 0 && (
        <div style={{ borderTop: '1px solid var(--col-divider)' }}>
          {derivedForms.map((df, i) => (
            <div key={i} className="px-4 py-2.5" style={{ backgroundColor: 'var(--col-dict-bg)' }}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-widest shrink-0" style={{ color: 'var(--col-muted)' }}>Derived form</span>
                <span className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>{df.form}</span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}>{df.pos}</span>
                <span className="text-xs" style={{ color: 'var(--col-muted)' }}>{df.translationRu}</span>
              </div>
              <p className="text-xs mb-0.5" style={{ color: 'var(--col-body)' }}>{df.meaningEn}</p>
              <p className="text-xs italic" style={{ color: 'var(--col-secondary)' }}>{df.meaningRu}</p>
              {df.example && (
                <p className="text-xs mt-1 font-lora italic" style={{ color: 'var(--col-accent-text)' }}>"{df.example}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}