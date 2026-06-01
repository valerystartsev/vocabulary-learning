import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, Info, CheckCircle, XCircle, Eye, EyeOff, Settings } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

function RenderParagraph({ text, glossary, supportMode }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className={`leading-relaxed mb-4 ${supportMode ? 'text-base leading-loose' : 'text-sm'}`}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const word = part.slice(2, -2);
          const meaning = glossary?.[word] || glossary?.[word.toLowerCase()];
          if (meaning) {
            return (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-semibold text-primary underline decoration-accent decoration-2 underline-offset-2 cursor-help">
                      {word}
                      {supportMode && <span className="text-xs text-muted-foreground ml-1">({meaning.split('—')[0].trim()})</span>}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{meaning}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
          return <strong key={i} className="font-semibold text-primary">{word}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function PostReadingTasks({ tasks, unitId }) {
  const { saveSectionScore, markSectionComplete } = useProgress();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showModel, setShowModel] = useState({});
  const [results, setResults] = useState(null);

  const checkAnswers = () => {
    let correct = 0, total = 0;
    tasks.forEach((t, i) => {
      if (t.type === 'trueFalse' || t.type === 'choice') {
        total++;
        if (String(answers[i]) === String(t.answer)) correct++;
      }
    });
    setResults({ correct, total });
    setSubmitted(true);
    // Persist the result: 'reading' section is now scored, the score
    // feeds into Teacher Dashboard's Section Activity grid (with the
    // % shown next to the chip) and into the unit progress %.
    if (typeof unitId === 'number') {
      const score = total > 0 ? Math.round((correct / total) * 100) : 100;
      saveSectionScore?.(unitId, 'reading', score);
      markSectionComplete?.(unitId, 'reading');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-accent" /> Check Your Understanding
      </h3>
      <div className="space-y-3">
        {tasks.map((task, i) => {
          const isCorrect = submitted && task.type !== 'open' && String(answers[i]) === String(task.answer);
          const isWrong = submitted && task.type !== 'open' && String(answers[i]) !== String(task.answer);
          return (
            <Card key={i} className={`${isCorrect ? 'border-green-200 bg-green-50/30' : isWrong ? 'border-red-200 bg-red-50/30' : ''}`}>
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-2">{i + 1}. {task.q}</p>

                {task.type === 'trueFalse' && (
                  <div className="flex gap-2 mb-2">
                    {['True', 'False'].map(v => (
                      <button
                        key={v}
                        disabled={submitted}
                        onClick={() => setAnswers(a => ({ ...a, [i]: v === 'True' }))}
                        className={`px-4 py-1.5 rounded-lg border text-sm transition-all ${
                          answers[i] === (v === 'True')
                            ? submitted ? (isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300') : 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}

                {task.type === 'choice' && (
                  <div className="space-y-1.5 mb-2">
                    {task.options.map(opt => (
                      <button
                        key={opt}
                        disabled={submitted}
                        onClick={() => setAnswers(a => ({ ...a, [i]: opt }))}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                          answers[i] === opt
                            ? submitted ? (opt === task.answer ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300') : 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {task.type === 'open' && (
                  <textarea
                    className="w-full text-sm border rounded px-2 py-1.5 h-16 mb-2"
                    placeholder="Write your answer..."
                    value={answers[i] || ''}
                    onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                  />
                )}

                {submitted && task.explanation && (
                  <p className="text-xs text-foreground/70 mt-1 p-2 bg-muted rounded">
                    {isCorrect ? '✓ ' : isWrong ? '✗ Correct answer: ' + task.answer + '. ' : ''}{task.explanation}
                  </p>
                )}

                {task.type === 'open' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowModel(m => ({ ...m, [i]: !m[i] }))}
                  >
                    {showModel[i] ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                    {showModel[i] ? 'Hide' : 'Show'} Model Answer
                  </Button>
                )}
                {showModel[i] && task.model && (
                  <p className="text-sm text-green-800 mt-1 p-2 bg-green-50 rounded">{task.model}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!submitted ? (
        <Button className="mt-4 w-full" onClick={checkAnswers}>Check My Answers</Button>
      ) : (
        <div className={`mt-4 p-3 rounded-lg border text-center ${results?.score >= 70 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          {results?.total > 0 && (
            <p className="font-semibold text-sm">
              Score: {results.correct}/{results.total} ({Math.round((results.correct / results.total) * 100)}%)
            </p>
          )}
          {results?.total === 0 && <p className="text-sm text-muted-foreground">Open question recorded.</p>}
          <Button variant="outline" size="sm" className="mt-2" onClick={() => { setSubmitted(false); setAnswers({}); setResults(null); }}>
            <CheckCircle className="mr-1 h-3 w-3" /> Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ReadingSection({ reading, unitId }) {
  const [supportMode, setSupportMode] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);

  const defaultTasks = reading.postReadingTasks || [
    {
      type: 'trueFalse',
      q: 'Competition is good for customers because it keeps prices low.',
      answer: true,
      explanation: 'Yes — when companies compete, they offer lower prices and better products.'
    },
    {
      type: 'choice',
      q: 'Which of the following best describes a monopoly?',
      options: [
        'Many companies compete in one market',
        'One company controls the whole market',
        'The government sells products directly',
        'Prices go up and down quickly'
      ],
      answer: 'One company controls the whole market',
      explanation: 'A monopoly = one company, no competition, often high prices.'
    },
    {
      type: 'open',
      q: 'Why is it difficult for a new business to reach the break-even point?',
      model: 'A new business must pay overheads like rent and salaries. These costs are high. It takes time to sell enough to cover all costs.'
    },
    {
      type: 'choice',
      q: 'Choose the statement that best summarises this reading.',
      options: [
        'Markets and competition are bad for businesses.',
        'Monopolies always help customers get lower prices.',
        'Markets work through competition; monopolies reduce choice; governments set rules.',
        'All companies are the same in a market economy.'
      ],
      answer: 'Markets work through competition; monopolies reduce choice; governments set rules.',
      explanation: 'The reading covers all three: market competition, monopoly risks, and government control.'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" /> Reading: {reading.title}
        </h2>
        <Button
          size="sm"
          variant={supportMode ? 'default' : 'outline'}
          onClick={() => setSupportMode(!supportMode)}
          className="text-xs"
        >
          <Settings className="mr-1 h-3 w-3" />
          {supportMode ? 'Support On' : 'Support Mode'}
        </Button>
      </div>

      {supportMode && (
        <Card className="mb-4 border-blue-200 bg-blue-50/50">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-blue-700">
              Support Mode is ON. Text is larger, spacing is wider, and Russian hints appear next to key words.
            </p>
          </CardContent>
        </Card>
      )}

      {showGuidance && (
        <Card className="mb-4 border-accent/30 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">How to use this section</p>
                <p className="text-sm text-muted-foreground">{reading.guidance}</p>
                <p className="text-xs text-muted-foreground italic mt-1">{reading.guidanceRu}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px]">Hover over highlighted words for translations</Badge>
                  <Badge variant="outline" className="text-[10px]">Use Support Mode for help</Badge>
                </div>
                <Button size="sm" variant="ghost" className="mt-2 h-6 text-xs" onClick={() => setShowGuidance(false)}>
                  Got it, hide this
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className={`p-6 ${supportMode ? 'leading-loose' : ''}`}>
          {reading.paragraphs.map((para, i) => (
            <RenderParagraph key={i} text={para.text} glossary={para.glossary} supportMode={supportMode} />
          ))}
        </CardContent>
      </Card>

      <PostReadingTasks tasks={defaultTasks} unitId={unitId} />
    </div>
  );
}