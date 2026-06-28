import React, { useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { getAllVocabulary, units } from '../data/courseData';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyMistakes() {
  const { progress } = useProgress();
  const allVocab = getAllVocabulary();
  const errorLog = progress.errorLog || {};

  const wordErrors = useMemo(() => {
    return Object.entries(errorLog)
      .map(([wordId, count]) => {
        const word = allVocab.find(v => v.id === wordId);
        return word ? { word, count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.count - a.count);
  }, [errorLog]);

  const exerciseErrors = useMemo(() => {
    const ex = progress.exerciseErrors || {};
    return Object.entries(ex)
      .map(([id, count]) => ({ id: id.replace(/_/g, ' '), count }))
      .sort((a, b) => b.count - a.count);
  }, [progress.exerciseErrors]);

  if (wordErrors.length === 0 && exerciseErrors.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <XCircle className="h-14 w-14 mx-auto mb-4 opacity-30" style={{ color: 'var(--col-muted)' }} />
        <h1 className="font-bold text-xl mb-2" style={{ color: 'var(--col-heading)' }}>No mistakes recorded yet</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--col-muted)' }}>Complete exercises to see your error patterns here.</p>
        <Link to={`/unit/${units[0].id}`}>
          <button className="px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ backgroundColor: 'var(--col-accent)' }}>
            Go to Unit {units[0].id}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(229,115,115,0.1)' }}>
          <XCircle className="h-5 w-5" style={{ color: 'var(--col-incorrect)' }} />
        </div>
        <div>
          <h1 className="font-bold text-xl" style={{ color: 'var(--col-heading)' }}>My Mistakes</h1>
          <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Error analysis — Анализ ошибок</p>
        </div>
      </div>

      {wordErrors.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-sm mb-3 uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Most Confused Words</h2>
          <div className="space-y-2">
            {wordErrors.slice(0, 10).map(({ word, count }) => (
              <div key={word.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>{word.term}</p>
                  <p className="text-xs" style={{ color: 'var(--col-muted)' }}>{word.translationRu}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(229,115,115,0.1)', color: 'var(--col-incorrect)', border: '1px solid rgba(229,115,115,0.25)' }}>
                  {count} error{count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {exerciseErrors.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-sm mb-3 uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Errors by Exercise</h2>
          <div className="space-y-2">
            {exerciseErrors.map(({ id, count }) => (
              <div key={id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
                <p className="text-sm capitalize" style={{ color: 'var(--col-body)' }}>{id}</p>
                <span className="text-xs font-bold" style={{ color: 'var(--col-warning)' }}>{count} errors</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--col-accent-text)' }}>Review weak words</p>
        <p className="text-xs mb-3" style={{ color: 'var(--col-accent-text)', opacity: 0.8 }}>
          Practice the words you find hardest using the Smart Review or Glossary.
        </p>
        <div className="flex gap-2">
          <Link to="/review">
            <button className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: 'var(--col-accent)' }}>Smart Review</button>
          </Link>
          <Link to="/glossary?filter=weak">
            <button className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ border: '1px solid var(--col-accent)', color: 'var(--col-accent)' }}>Weak Words</button>
          </Link>
        </div>
      </div>
    </div>
  );
}