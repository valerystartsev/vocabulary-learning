import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function TrueFalseExercise({ exercise, answers, setAnswers, submitted, showAnswers, showExplanation, onCheck, isTeacherMode }) {
  const items = exercise.items;

  const handleSelect = (idx, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [idx]: val }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const wrongAnswers = [];
    const details = items.map((item, idx) => {
      const isCorrect = answers[idx] === item.answer;
      if (isCorrect) correct++;
      else if (item.wordId) wrongAnswers.push(item.wordId);
      return { isCorrect };
    });
    onCheck({ correct, total: items.length, details, wrongWordIds: wrongAnswers });
  };

  return (
    <div>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const detail = submitted ? (answers[idx] === item.answer) : null;
          return (
            <div
              key={idx}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: submitted ? (detail ? '#F0FAF5' : '#FFF0F0') : 'var(--col-surface-secondary)',
                border: submitted ? `1px solid ${detail ? '#A8D5BA' : '#F0CECE'}` : '1px solid var(--col-border)',
              }}
            >
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--col-heading)' }}>{item.statement}</p>
              <div className="flex flex-wrap gap-2">
                {[true, false].map(val => {
                  const isSelected = answers[idx] === val;
                  const isCorrectVal = item.answer === val;
                  let bg = 'var(--col-surface)';
                  let border = 'var(--col-border)';
                  let color = 'var(--col-body)';
                  if (isSelected && !submitted) { bg = 'var(--col-sidebar)'; border = 'var(--col-sidebar)'; color = 'white'; }
                  if (isSelected && submitted) {
                    if (isCorrectVal) { bg = 'var(--col-correct)'; border = 'var(--col-correct)'; color = 'white'; }
                    else { bg = 'var(--col-incorrect)'; border = 'var(--col-incorrect)'; color = 'white'; }
                  }
                  if (!isSelected && submitted && isCorrectVal) { border = 'var(--col-correct)'; color = 'var(--col-correct)'; }
                  return (
                    <button
                      key={String(val)}
                      onClick={() => handleSelect(idx, val)}
                      disabled={submitted}
                      className="font-medium rounded-xl transition-colors"
                      style={{
                        minHeight: 44, minWidth: 80,
                        padding: '8px 20px',
                        backgroundColor: bg,
                        border: `1px solid ${border}`,
                        color,
                        fontSize: 14,
                      }}
                    >
                      {val ? 'True' : 'False'}
                    </button>
                  );
                })}
                {submitted && (
                  detail
                    ? <CheckCircle className="h-5 w-5 self-center ml-1" style={{ color: 'var(--col-correct)' }} />
                    : <XCircle className="h-5 w-5 self-center ml-1" style={{ color: 'var(--col-incorrect)' }} />
                )}
              </div>
              {(showAnswers || isTeacherMode) && (
                <p className="text-xs mt-2 font-medium" style={{ color: 'var(--col-correct)' }}>
                  Correct answer: {item.answer ? 'True' : 'False'}
                </p>
              )}
              {(showExplanation || isTeacherMode) && item.explanation && (
                <p className="text-xs mt-1 italic" style={{ color: 'var(--col-secondary)' }}>{item.explanation}</p>
              )}
            </div>
          );
        })}
      </div>
      {!submitted && (
        <button
          className="mt-4 flex items-center justify-center rounded-xl font-semibold text-sm text-white transition-colors w-full sm:w-auto"
          style={{ minHeight: 50, padding: '10px 28px', backgroundColor: 'var(--col-accent)' }}
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < items.length}
          onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-accent-hover)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--col-accent)'}
        >
          Check Answers
        </button>
      )}
    </div>
  );
}