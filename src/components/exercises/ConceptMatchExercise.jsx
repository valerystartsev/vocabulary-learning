import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ConceptMatchExercise({ exercise, submitted, showAnswers, showExplanation, onCheck, isTeacherMode }) {
  const pairs = exercise.pairs;
  const [selected, setSelected] = useState({});
  const [localSubmitted, setLocalSubmitted] = useState(false);

  const shuffledTerms = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).map(p => p.term),
    [exercise.id]
  );

  const handleSelect = (idx, term) => {
    if (localSubmitted || submitted) return;
    setSelected(prev => ({ ...prev, [idx]: term }));
  };

  const handleSubmit = () => {
    let correct = 0;
    pairs.forEach((pair, idx) => {
      if (selected[idx] === pair.term) correct++;
    });
    setLocalSubmitted(true);
    onCheck({ correct, total: pairs.length });
  };

  const isChecked = localSubmitted || submitted;

  return (
    <div>
      <div className="space-y-3">
        {pairs.map((pair, idx) => {
          const userAnswer = selected[idx];
          const isCorrect = isChecked && userAnswer === pair.term;
          const isWrong = isChecked && userAnswer && userAnswer !== pair.term;
          return (
            <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${
              isChecked ? (isCorrect ? 'bg-green-50 border-green-200' : isWrong ? 'bg-red-50 border-red-200' : 'border-border') : 'border-border'
            }`}>
              <span className="text-sm flex-1">{pair.description}</span>
              <span className="text-muted-foreground">→</span>
              <select
                value={selected[idx] || ''}
                onChange={e => handleSelect(idx, e.target.value)}
                disabled={isChecked}
                className="w-48 h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Choose...</option>
                {shuffledTerms.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {isChecked && (isCorrect ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />)}
              {(showAnswers || isTeacherMode) && (
                <span className="text-xs text-green-700 font-medium">{pair.term}</span>
              )}
            </div>
          );
        })}
      </div>
      {!isChecked && (
        <Button className="mt-4" onClick={handleSubmit} disabled={Object.keys(selected).length < pairs.length}>
          Check Answers
        </Button>
      )}
    </div>
  );
}