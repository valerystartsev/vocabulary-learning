import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw, Eye, EyeOff } from 'lucide-react';

// ─── Match part ───────────────────────────────────────────────────────────────
function MatchPart({ part, isTeacherMode, onCheck }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(isTeacherMode);

  const shuffledRu = useMemo(() => [...part.pairs.map(p => p.ru)].sort(() => Math.random() - 0.5), [part.id]);

  const handleSubmit = () => {
    let correct = 0;
    part.pairs.forEach((p, i) => { if (answers[i] === p.ru) correct++; });
    setSubmitted(true);
    onCheck({ correct, total: part.pairs.length });
  };

  const reset = () => { setAnswers({}); setSubmitted(false); setShowAnswers(isTeacherMode); };

  return (
    <div>
      <div className="space-y-2 mb-4">
        {part.pairs.map((p, i) => {
          const correct = submitted && answers[i] === p.ru;
          const wrong = submitted && answers[i] !== p.ru;
          return (
            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${correct ? 'bg-green-50' : wrong ? 'bg-red-50' : ''}`}>
              <span className="font-medium text-sm w-40 flex-shrink-0">{p.en}</span>
              <select
                className="flex-1 text-sm border border-input rounded-md px-2 py-1.5 bg-background"
                value={answers[i] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                disabled={submitted}
              >
                <option value="">— choose —</option>
                {shuffledRu.map((r, j) => <option key={j} value={r}>{r}</option>)}
              </select>
              {submitted && (correct ? <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> : <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />)}
            </div>
          );
        })}
      </div>
      {(submitted || isTeacherMode) && showAnswers && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
          <p className="text-xs font-semibold text-green-700 mb-1">Answer Key:</p>
          {part.pairs.map((p, i) => <p key={i} className="text-xs text-green-700">{p.en} → {p.ru}</p>)}
        </div>
      )}
      <div className="flex gap-2">
        {!submitted && <Button size="sm" onClick={handleSubmit} disabled={Object.keys(answers).length < part.pairs.length}>Check Answers</Button>}
        {submitted && (
          <>
            <Button size="sm" variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
              {showAnswers ? 'Hide Key' : 'Show Key'}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="mr-1 h-3 w-3" /> Retry</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── True/False part ──────────────────────────────────────────────────────────
function TrueFalsePart({ part, isTeacherMode, onCheck }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(isTeacherMode);

  const handleSubmit = () => {
    let correct = 0;
    part.items.forEach((it, i) => { if (answers[i] === it.answer) correct++; });
    setSubmitted(true);
    onCheck({ correct, total: part.items.length });
  };

  const reset = () => { setAnswers({}); setSubmitted(false); setShowAnswers(isTeacherMode); };

  return (
    <div>
      <div className="space-y-3 mb-4">
        {part.items.map((item, i) => {
          const correct = submitted && answers[i] === item.answer;
          const wrong = submitted && answers[i] !== item.answer && answers[i] !== undefined;
          return (
            <div key={i} className={`p-3 rounded-lg border ${submitted ? (correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'border-border'}`}>
              <p className="text-sm font-medium mb-2">{item.statement}</p>
              <div className="flex gap-2 items-center">
                {[true, false].map(val => (
                  <button key={String(val)}
                    onClick={() => !submitted && setAnswers(p => ({ ...p, [i]: val }))}
                    disabled={submitted}
                    className={`px-3 py-1 rounded-md text-sm border transition-colors ${answers[i] === val ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'}`}
                  >{val ? 'True' : 'False'}</button>
                ))}
                {submitted && (correct ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />)}
              </div>
              {(showAnswers || isTeacherMode) && submitted && (
                <p className="text-xs mt-1 text-green-700 font-medium">✓ {item.answer ? 'True' : 'False'} — {item.explanation}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        {!submitted && <Button size="sm" onClick={handleSubmit} disabled={Object.keys(answers).length < part.items.length}>Check Answers</Button>}
        {submitted && (
          <>
            <Button size="sm" variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? 'Hide Explanations' : 'Show Explanations'}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="mr-1 h-3 w-3" /> Retry</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── FillGap part ─────────────────────────────────────────────────────────────
function FillGapPart({ part, isTeacherMode, onCheck }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(isTeacherMode);

  const handleSubmit = () => {
    let correct = 0;
    part.items.forEach((it, i) => {
      if ((answers[i] || '').trim().toLowerCase() === it.answer.toLowerCase()) correct++;
    });
    setSubmitted(true);
    onCheck({ correct, total: part.items.length });
  };

  const reset = () => { setAnswers({}); setSubmitted(false); setShowAnswers(isTeacherMode); };

  return (
    <div>
      {part.wordBank && (
        <div className="flex flex-wrap gap-1.5 mb-4 p-3 bg-secondary rounded-lg">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Word bank:</span>
          {part.wordBank.map(w => <Badge key={w} variant="outline" className="text-xs">{w}</Badge>)}
        </div>
      )}
      <div className="space-y-3 mb-4">
        {part.items.map((item, i) => {
          const isCorrect = submitted && (answers[i] || '').trim().toLowerCase() === item.answer.toLowerCase();
          const isWrong = submitted && !isCorrect;
          const [before, after] = item.sentence.split('______');
          return (
            <div key={i} className={`p-3 rounded-lg border ${submitted ? (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'border-border'}`}>
              <div className="flex items-center flex-wrap gap-1 text-sm">
                <span>{before}</span>
                <input
                  type="text"
                  value={answers[i] || ''}
                  onChange={e => !submitted && setAnswers(p => ({ ...p, [i]: e.target.value }))}
                  disabled={submitted}
                  className={`border-b-2 px-1 bg-transparent text-sm font-medium min-w-24 outline-none ${submitted ? (isCorrect ? 'border-green-500 text-green-700' : 'border-red-400 text-red-700') : 'border-primary'}`}
                />
                <span>{after}</span>
                {submitted && (isCorrect ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />)}
              </div>
              {isWrong && (showAnswers || isTeacherMode) && (
                <p className="text-xs mt-1 text-green-700 font-medium">✓ Answer: {item.answer}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        {!submitted && <Button size="sm" onClick={handleSubmit} disabled={Object.keys(answers).length < part.items.length}>Check Answers</Button>}
        {submitted && (
          <>
            <Button size="sm" variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? 'Hide Answers' : 'Show Correct Answers'}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="mr-1 h-3 w-3" /> Retry</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Multiple Choice part ─────────────────────────────────────────────────────
function MultipleChoicePart({ part, isTeacherMode, onCheck }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(isTeacherMode);

  const handleSubmit = () => {
    let correct = 0;
    part.items.forEach((it, i) => { if (answers[i] === it.answer) correct++; });
    setSubmitted(true);
    onCheck({ correct, total: part.items.length });
  };

  const reset = () => { setAnswers({}); setSubmitted(false); setShowAnswers(isTeacherMode); };

  return (
    <div>
      <div className="space-y-4 mb-4">
        {part.items.map((item, i) => {
          const correct = submitted && answers[i] === item.answer;
          const wrong = submitted && answers[i] !== item.answer && answers[i] !== undefined;
          return (
            <div key={i} className={`p-3 rounded-lg border ${submitted ? (correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'border-border'}`}>
              <p className="text-sm font-medium mb-2">{i + 1}. {item.sentence}</p>
              <div className="grid grid-cols-2 gap-2">
                {item.options.map(opt => (
                  <button key={opt}
                    onClick={() => !submitted && setAnswers(p => ({ ...p, [i]: opt }))}
                    disabled={submitted}
                    className={`text-left text-xs px-3 py-2 rounded-md border transition-colors ${
                      answers[i] === opt ? (submitted && opt !== item.answer ? 'bg-red-100 border-red-300' : 'bg-primary text-primary-foreground border-primary') : 'border-border bg-background hover:bg-muted'
                    } ${submitted && opt === item.answer ? 'bg-green-100 border-green-400 text-green-800' : ''}`}
                  >{opt}</button>
                ))}
              </div>
              {submitted && (showAnswers || isTeacherMode) && (
                <p className="text-xs mt-2 text-green-700 font-medium">✓ {item.answer}{item.explanation ? ` — ${item.explanation}` : ''}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        {!submitted && <Button size="sm" onClick={handleSubmit} disabled={Object.keys(answers).length < part.items.length}>Check Answers</Button>}
        {submitted && (
          <>
            <Button size="sm" variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? 'Hide Answers' : 'Show Correct Answers'}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="mr-1 h-3 w-3" /> Retry</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── TotalTestPart wrapper ────────────────────────────────────────────────────
export default function TotalTestPart({ part, partNumber, isTeacherMode, onComplete, score }) {
  const [done, setDone] = useState(false);

  const handleComplete = (result) => {
    setDone(true);
    onComplete(result);
  };

  const renderPart = () => {
    switch (part.type) {
      case 'match': return <MatchPart part={part} isTeacherMode={isTeacherMode} onCheck={handleComplete} />;
      case 'trueFalse': return <TrueFalsePart part={part} isTeacherMode={isTeacherMode} onCheck={handleComplete} />;
      case 'fillGap': return <FillGapPart part={part} isTeacherMode={isTeacherMode} onCheck={handleComplete} />;
      case 'multipleChoice': return <MultipleChoicePart part={part} isTeacherMode={isTeacherMode} onCheck={handleComplete} />;
      default: return null;
    }
  };

  return (
    <Card className={`mb-5 ${done ? 'border-green-200' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            <span className="text-muted-foreground font-normal text-xs mr-2">Part {partNumber}</span>
            {part.title}
          </CardTitle>
          {score && (
            <Badge className={score.correct === score.total ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
              {score.correct}/{score.total}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{part.instruction}</p>
      </CardHeader>
      <CardContent>
        {renderPart()}
      </CardContent>
    </Card>
  );
}