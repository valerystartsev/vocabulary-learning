import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function MultipleChoiceExercise({ exercise, answers, setAnswers, submitted, showAnswers, showExplanation, onCheck, isTeacherMode }) {
  const items = exercise.items;

  const handleSelect = (idx, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [idx]: option }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const wrongAnswers = [];
    items.forEach((item, idx) => {
      const isCorrect = answers[idx] === item.answer;
      if (isCorrect) correct++;
      else if (item.wordId) wrongAnswers.push(item.wordId);
    });
    onCheck({ correct, total: items.length, wrongWordIds: wrongAnswers });
  };

  return (
    <div>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const isCorrect = submitted && answers[idx] === item.answer;
          return (
            <div
              key={idx}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: submitted ? (isCorrect ? '#F0FAF5' : '#FFF0F0') : 'var(--col-surface-secondary)',
                border: submitted ? `1px solid ${isCorrect ? '#A8D5BA' : '#F0CECE'}` : '1px solid var(--col-border)',
              }}
            >
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--col-heading)' }}>{item.sentence}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.options.map(opt => {
                  const isSelected = answers[idx] === opt;
                  const isCorrectOpt = opt === item.answer;
                  let bg = 'var(--col-surface)';
                  let border = 'var(--col-border)';
                  let color = 'var(--col-body)';
                  if (isSelected && !submitted) { bg = 'var(--col-sidebar)'; border = 'var(--col-sidebar)'; color = 'white'; }
                  if (submitted) {
                    if (isCorrectOpt) { bg = 'var(--col-accent-light)'; border = 'var(--col-accent)'; color = 'var(--col-accent-text)'; }
                    if (isSelected && !isCorrectOpt) { bg = '#FFF0F0'; border = 'var(--col-incorrect)'; color = '#C62828'; }
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(idx, opt)}
                      disabled={submitted}
                      className="text-left rounded-lg transition-colors"
                      style={{
                        minHeight: 44, padding: '10px 14px',
                        backgroundColor: bg,
                        border: `1px solid ${border}`,
                        color,
                        fontSize: 14,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="flex items-center gap-1.5 mt-2">
                  {isCorrect
                    ? <CheckCircle className="h-4 w-4" style={{ color: 'var(--col-correct)' }} />
                    : <XCircle className="h-4 w-4" style={{ color: 'var(--col-incorrect)' }} />
                  }
                  {(showAnswers || isTeacherMode) && (
                    <span className="text-xs font-medium" style={{ color: 'var(--col-correct)' }}>
                      Answer: {item.answer}
                    </span>
                  )}
                </div>
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