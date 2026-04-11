import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export default function FillGapExercise({ exercise, answers, setAnswers, submitted, showAnswers, showExplanation, onCheck, isTeacherMode }) {
  const items = exercise.items;

  const handleChange = (idx, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [idx]: val }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const wrongWordIds = [];
    items.forEach((item, idx) => {
      const isCorrect = (answers[idx] || '').trim().toLowerCase() === item.answer.toLowerCase();
      if (isCorrect) correct++;
      else if (item.wordId) wrongWordIds.push(item.wordId);
      // also use answer as fallback id
      else wrongWordIds.push(`wrong_${item.answer}`);
    });
    onCheck({ correct, total: items.length, wrongWordIds });
  };

  return (
    <div>
      {exercise.wordBank && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted rounded-lg">
          <span className="text-xs text-muted-foreground font-medium mr-2">Word bank:</span>
          {exercise.wordBank.map(w => (
            <Badge key={w} variant="secondary" className="text-xs">{w}</Badge>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const userVal = (answers[idx] || '').trim().toLowerCase();
          const isCorrect = submitted && userVal === item.answer.toLowerCase();
          const isWrong = submitted && userVal !== item.answer.toLowerCase();
          return (
            <div key={idx} className={`p-3 rounded-lg border ${
              submitted ? (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'border-border'
            }`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm flex-1">
                  {item.sentence.split('______')[0]}
                  <Input
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    disabled={submitted}
                    className={`inline-block w-40 mx-1 h-8 text-sm ${isCorrect ? 'border-green-400' : isWrong ? 'border-red-400' : ''}`}
                    placeholder="..."
                  />
                  {item.sentence.split('______')[1]}
                </span>
                {submitted && (isCorrect ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />)}
              </div>
              {(showAnswers || isTeacherMode) && (
                <p className="text-xs mt-2 text-green-700 font-medium">Answer: {item.answer}</p>
              )}
              {(showExplanation || isTeacherMode) && item.explanation && (
                <p className="text-xs mt-1 text-muted-foreground italic">{item.explanation}</p>
              )}
            </div>
          );
        })}
      </div>
      {!submitted && (
        <Button className="mt-4 min-h-[50px] w-full sm:w-auto text-sm font-semibold rounded-xl" onClick={handleSubmit}>Check Answers</Button>
      )}
    </div>
  );
}