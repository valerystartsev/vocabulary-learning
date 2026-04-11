import React, { useState, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { getAllVocabulary } from '../data/courseData';
import { getDueWords } from '../utils/spacedRepetition';
import { RotateCcw, CheckCircle, ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const RATINGS = [
  { label: 'Blackout', value: 0, color: '#E57373' },
  { label: 'Hard', value: 2, color: '#C79A4A' },
  { label: 'Good', value: 4, color: '#5E9E89' },
  { label: 'Easy', value: 5, color: '#3B8C6E' },
];

export default function Review() {
  const { progress, updateSRS } = useProgress();
  const allVocab = getAllVocabulary();
  const srsData = progress.srsData || {};

  const dueWords = useMemo(() => getDueWords(srsData, allVocab.map(v => v.id))
    .map(id => allVocab.find(v => v.id === id))
    .filter(Boolean), [srsData]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState({ easy: 0, good: 0, hard: 0 });

  if (dueWords.length === 0) {
    const srsStats = {
      total: allVocab.length,
      reviewed: Object.values(srsData).filter(c => c.repetitions > 0).length,
      mastered: Object.values(srsData).filter(c => c.interval >= 21).length,
    };
    return (
      <div className="max-w-lg mx-auto px-5 py-12" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="text-center mb-8">
          <CheckCircle className="h-14 w-14 mx-auto mb-4" style={{ color: 'var(--col-correct)' }} />
          <h1 className="font-bold text-xl mb-2" style={{ color: 'var(--col-heading)' }}>All caught up!</h1>
          <p className="text-sm" style={{ color: 'var(--col-muted)' }}>No words are due for review today. Check back tomorrow.</p>
          <p className="text-xs mt-1 italic" style={{ color: 'var(--col-muted)' }}>Сегодня нет слов для повторения.</p>
        </div>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[{ label: 'Total Words', value: srsStats.total, color: 'var(--col-accent)' }, { label: 'Reviewed', value: srsStats.reviewed, color: '#4A7FA8' }, { label: 'Mastered', value: srsStats.mastered, color: '#4A8C6A' }].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
              <p className="font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--col-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <Link to="/progress">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold" style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface)', minHeight: 48 }}>
            <Calendar className="h-4 w-4" /> View Review Schedule
          </button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-5 py-16 text-center" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <CheckCircle className="h-14 w-14 mx-auto mb-4" style={{ color: 'var(--col-correct)' }} />
        <h1 className="font-bold text-2xl mb-2" style={{ color: 'var(--col-heading)' }}>Session Complete</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--col-muted)' }}>Reviewed {dueWords.length} words</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ label: 'Easy', value: results.easy, color: '#3B8C6E' }, { label: 'Good', value: results.good, color: '#5E9E89' }, { label: 'Hard', value: results.hard, color: '#C79A4A' }].map(r => (
            <div key={r.label} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
              <p className="text-lg font-bold" style={{ color: r.color }}>{r.value}</p>
              <p className="text-xs" style={{ color: 'var(--col-muted)' }}>{r.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/progress">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold" style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface)', minHeight: 48 }}>
              <TrendingUp className="h-4 w-4" /> View Analytics & Schedule
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const word = dueWords[idx];

  const handleRate = (quality) => {
    updateSRS(word.id, quality);
    setResults(r => ({
      ...r,
      easy: quality >= 5 ? r.easy + 1 : r.easy,
      good: quality === 4 ? r.good + 1 : r.good,
      hard: quality <= 2 ? r.hard + 1 : r.hard,
    }));
    if (idx < dueWords.length - 1) {
      setIdx(i => i + 1);
      setFlipped(false);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-5 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: 'var(--col-accent-light)' }}>
          <RotateCcw className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
        </div>
        <div>
          <h1 className="font-bold text-xl" style={{ color: 'var(--col-heading)' }}>Smart Review</h1>
          <p className="text-xs" style={{ color: 'var(--col-muted)' }}>{idx + 1} of {dueWords.length} words due</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-6" style={{ backgroundColor: 'var(--col-divider)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${(idx / dueWords.length) * 100}%`, backgroundColor: 'var(--col-accent)' }} />
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8 text-center cursor-pointer min-h-48 flex flex-col items-center justify-center mb-5 transition-all"
        style={{ backgroundColor: 'var(--col-surface)', border: `2px solid ${flipped ? 'var(--col-accent)' : 'var(--col-border)'}` }}
        onClick={() => setFlipped(f => !f)}
      >
        {!flipped ? (
          <>
            <p className="text-3xl font-bold mb-2" style={{ color: 'var(--col-heading)' }}>{word.term}</p>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Tap to reveal translation</p>
          </>
        ) : (
          <>
            <p className="text-xl font-semibold mb-2" style={{ color: 'var(--col-accent)' }}>{word.translationRu}</p>
            <p className="text-sm mb-3" style={{ color: 'var(--col-body)' }}>{word.meaningEn}</p>
            <p className="text-xs italic" style={{ color: 'var(--col-secondary)' }}>"{word.example}"</p>
          </>
        )}
      </div>

      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map(r => (
            <button
              key={r.value}
              onClick={() => handleRate(r.value)}
              className="py-3 rounded-xl text-xs font-semibold text-white"
              style={{ backgroundColor: r.color, minHeight: 52 }}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}