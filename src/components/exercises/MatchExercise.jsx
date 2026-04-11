import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function MatchExercise({ exercise, submitted, showAnswers, showExplanation, onCheck, isTeacherMode }) {
  const pairs = exercise.pairs;
  const [selected, setSelected] = useState({});
  const [localSubmitted, setLocalSubmitted] = useState(false);

  const shuffledRu = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).map(p => p.ru),
    [exercise.id]
  );

  const handleSelect = (enIdx, ru) => {
    if (localSubmitted || submitted) return;
    setSelected(prev => ({ ...prev, [enIdx]: ru }));
  };

  const handleSubmit = () => {
    let correct = 0;
    pairs.forEach((pair, idx) => {
      if (selected[idx] === pair.ru) correct++;
    });
    setLocalSubmitted(true);
    onCheck({ correct, total: pairs.length });
  };

  const isChecked = localSubmitted || submitted;

  return (
    <div>
      <div className="space-y-2">
        {pairs.map((pair, idx) => {
          const userAnswer = selected[idx];
          const isCorrect = isChecked && userAnswer === pair.ru;
          const isWrong = isChecked && userAnswer && userAnswer !== pair.ru;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{
                backgroundColor: isChecked ? (isCorrect ? '#F0FAF5' : isWrong ? '#FFF0F0' : 'var(--col-surface-secondary)') : 'var(--col-surface-secondary)',
                border: isChecked
                  ? `1px solid ${isCorrect ? '#A8D5BA' : isWrong ? '#F0CECE' : 'var(--col-border)'}`
                  : '1px solid var(--col-border)',
              }}
            >
              <span className="font-medium text-sm w-40 shrink-0" style={{ color: 'var(--col-heading)' }}>
                {pair.en}
              </span>
              <span style={{ color: 'var(--col-muted)' }}>→</span>
              <select
                value={selected[idx] || ''}
                onChange={e => handleSelect(idx, e.target.value)}
                disabled={isChecked}
                className="flex-1 rounded-lg border px-3 text-sm"
                style={{
                  minHeight: 44,
                  backgroundColor: 'var(--col-surface)',
                  borderColor: 'var(--col-border)',
                  color: 'var(--col-body)',
                  fontSize: 14,
                }}
              >
                <option value="">Choose...</option>
                {shuffledRu.map(ru => (
                  <option key={ru} value={ru}>{ru}</option>
                ))}
              </select>
              {isChecked && (
                isCorrect
                  ? <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-correct)' }} />
                  : <XCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-incorrect)' }} />
              )}
              {(showAnswers || isTeacherMode) && isWrong && (
                <span className="text-xs shrink-0 font-medium" style={{ color: 'var(--col-correct)' }}>{pair.ru}</span>
              )}
            </div>
          );
        })}
      </div>
      {!isChecked && (
        <button
          className="mt-4 flex items-center justify-center rounded-lg font-medium text-sm text-white transition-colors w-full sm:w-auto"
          style={{ minHeight: 44, padding: '10px 24px', backgroundColor: 'var(--col-accent)' }}
          onClick={handleSubmit}
          disabled={Object.keys(selected).length < pairs.length}
          onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-accent-hover)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--col-accent)'}
        >
          Check Answers
        </button>
      )}
    </div>
  );
}