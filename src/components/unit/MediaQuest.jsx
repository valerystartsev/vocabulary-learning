import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProgress } from '../../context/ProgressContext';
import {
  Zap, CheckCircle, XCircle, ChevronDown, ChevronUp,
  Star, AlertTriangle, Target, Headphones, Video, FileText
} from 'lucide-react';

// Quest challenges keyed by media title
const MEDIA_QUESTS = {
  "What is a Market Economy?": [
    {
      type: 'vocab_sort',
      instruction: 'Sort these words: which ones are about SUPPLY? Which are about DEMAND?',
      items: [
        { word: 'seller', category: 'supply' },
        { word: 'buyer', category: 'demand' },
        { word: 'producer', category: 'supply' },
        { word: 'customer', category: 'demand' },
        { word: 'manufacturer', category: 'supply' },
        { word: 'consumer', category: 'demand' },
      ],
      categories: ['supply', 'demand'],
    },
    {
      type: 'summary_choice',
      instruction: 'Choose the best summary of this video:',
      options: [
        'A market economy means the government controls all prices.',
        'In a market economy, prices are set by supply and demand between buyers and sellers.',
        'Competition is bad for businesses in a market economy.',
        'Only big companies participate in a market economy.',
      ],
      answer: 1,
      explanation: 'A market economy is based on supply and demand between free buyers and sellers.',
    },
    {
      type: 'fill',
      instruction: 'Complete this sentence using a word from the video:',
      sentence: 'When there are many sellers, ______ keeps prices low.',
      answer: 'competition',
      hint: 'Think: what happens when companies fight for customers?',
    },
  ],
  "Monopoly Explained Simply": [
    {
      type: 'true_false',
      instruction: 'True or False? Decide for each statement:',
      items: [
        { statement: 'A monopoly means there is no competition.', answer: true },
        { statement: 'Monopoly prices are usually lower for customers.', answer: false },
        { statement: 'Governments can restrict monopolies.', answer: true },
        { statement: 'A legal monopoly is illegal.', answer: false },
      ],
    },
    {
      type: 'match_scene',
      instruction: 'Match each term to the correct situation:',
      pairs: [
        { term: 'monopoly', scene: 'One electric company serves the entire city. You cannot switch.' },
        { term: 'competition', scene: 'Five coffee shops are on the same street. They all have different prices.' },
        { term: 'restrict', scene: 'The government says no single company can own more than 40% of the market.' },
        { term: 'authority', scene: 'A government department checks if companies follow the rules.' },
      ],
    },
  ],
  "Business English: Starting a Company": [
    {
      type: 'order_events',
      instruction: 'Put these steps in the correct order (1–4) for starting a business:',
      items: [
        { text: 'Pay monthly overheads like rent and salaries.', correct: 2 },
        { text: 'Recruit your first workers.', correct: 1 },
        { text: 'Reach the break-even point.', correct: 3 },
        { text: 'Start making a profit.', correct: 4 },
      ],
    },
    {
      type: 'fill',
      instruction: 'Complete this sentence:',
      sentence: 'A new business must cover all its ______ before it can make a profit.',
      answer: 'overheads',
      hint: 'Fixed costs like rent and electricity.',
    },
    {
      type: 'summary_choice',
      instruction: 'What is the main message of this podcast?',
      options: [
        'It is easy to start a business with little money.',
        'Starting a business means managing costs, finding workers, and reaching break-even.',
        'Only large enterprises can break even.',
        'Recruitment is not important for new businesses.',
      ],
      answer: 1,
      explanation: 'The podcast shows the key challenges of starting a company: costs, staff, and profitability.',
    },
  ],
  "How Mergers Change Business": [
    {
      type: 'true_false',
      instruction: 'True or False?',
      items: [
        { statement: 'A merger always harms competition.', answer: false },
        { statement: 'After a merger, two companies become one.', answer: true },
        { statement: 'Governments must always authorize large mergers.', answer: true },
        { statement: 'Mergers never affect employees.', answer: false },
      ],
    },
    {
      type: 'match_scene',
      instruction: 'Match each word to what it means in this article:',
      pairs: [
        { term: 'merger', scene: 'Company A and Company B join. Now it is Company AB.' },
        { term: 'affect', scene: 'After the merger, prices in the market changed.' },
        { term: 'authorize', scene: 'The competition authority gave permission for the merger.' },
        { term: 'competition', scene: 'Before the merger, both companies were fighting for customers.' },
      ],
    },
  ],
};

function VocabSortChallenge({ challenge, onScore }) {
  const [sorted, setSorted] = useState({}); // { word: category | null }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const assign = (word, cat) => {
    if (submitted) return;
    setSorted(p => ({ ...p, [word]: p[word] === cat ? null : cat }));
  };

  const check = () => {
    let correct = 0;
    challenge.items.forEach(item => {
      if (sorted[item.word] === item.category) correct++;
    });
    const pct = Math.round((correct / challenge.items.length) * 100);
    setScore({ correct, total: challenge.items.length, pct });
    setSubmitted(true);
    onScore(pct);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {challenge.categories.map(cat => (
          <div key={cat} className="border-2 border-dashed border-border rounded-xl p-3 min-h-[80px]">
            <p className="text-xs font-bold uppercase text-muted-foreground mb-2">{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {challenge.items.filter(i => sorted[i.word] === cat).map(i => {
                const isCorrect = submitted && i.category === cat;
                const isWrong = submitted && i.category !== cat;
                return (
                  <Badge
                    key={i.word}
                    className={`cursor-pointer text-xs py-1 ${
                      isCorrect ? 'bg-green-100 text-green-800 border-green-300' :
                      isWrong ? 'bg-red-100 text-red-800 border-red-300' :
                      'bg-primary/10 text-primary'
                    }`}
                    onClick={() => assign(i.word, cat)}
                  >
                    {i.word}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {challenge.items.filter(i => !sorted[i.word]).map(i => (
          <div key={i.word} className="flex gap-1">
            {challenge.categories.map(cat => (
              <button
                key={cat}
                disabled={submitted}
                onClick={() => assign(i.word, cat)}
                className="text-xs px-2.5 py-1.5 rounded-lg border bg-white hover:bg-muted transition-colors"
              >
                {i.word} → {cat}
              </button>
            ))}
          </div>
        ))}
      </div>
      {!submitted ? (
        <Button size="sm" onClick={check} disabled={Object.keys(sorted).length < challenge.items.length}>
          Check Sorting
        </Button>
      ) : (
        <div className={`p-2 rounded text-xs font-semibold ${score.pct >= 70 ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
          {score.correct}/{score.total} correct ({score.pct}%)
        </div>
      )}
    </div>
  );
}

function SummaryChoiceChallenge({ challenge, onScore }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const check = () => {
    setSubmitted(true);
    onScore(selected === challenge.answer ? 100 : 0);
  };

  return (
    <div className="space-y-2">
      {challenge.options.map((opt, i) => {
        const isSelected = selected === i;
        const isCorrect = submitted && i === challenge.answer;
        const isWrong = submitted && isSelected && i !== challenge.answer;
        return (
          <button
            key={i}
            disabled={submitted}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all min-h-[44px] ${
              isCorrect ? 'bg-green-100 border-green-300 text-green-800 font-medium' :
              isWrong ? 'bg-red-100 border-red-300 text-red-800' :
              isSelected ? 'bg-primary text-primary-foreground border-primary' :
              'bg-white border-border hover:bg-muted'
            }`}
          >
            {opt}
          </button>
        );
      })}
      {submitted && challenge.explanation && (
        <p className="text-xs text-green-700 p-2 bg-green-50 rounded mt-1">{challenge.explanation}</p>
      )}
      {!submitted && (
        <Button size="sm" onClick={check} disabled={selected === null} className="mt-2 w-full sm:w-auto min-h-[44px]">
          Check Answer
        </Button>
      )}
    </div>
  );
}

function FillChallenge({ challenge, onScore }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const check = () => {
    setSubmitted(true);
    onScore(answer.trim().toLowerCase() === challenge.answer.toLowerCase() ? 100 : 0);
  };

  const parts = challenge.sentence.split('______');
  const isCorrect = submitted && answer.trim().toLowerCase() === challenge.answer.toLowerCase();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 text-sm mb-3 p-3 bg-muted rounded-lg">
        <span>{parts[0]}</span>
        <input
          disabled={submitted}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !submitted && check()}
          placeholder="..."
          className={`inline-block w-32 px-2 py-1 border rounded text-sm text-center font-semibold ${
            submitted ? (isCorrect ? 'bg-green-100 border-green-300 text-green-700' : 'bg-red-100 border-red-300 text-red-700') : 'border-border'
          }`}
        />
        <span>{parts[1]}</span>
      </div>
      {challenge.hint && (
        <button className="text-xs text-muted-foreground underline mb-2" onClick={() => setShowHint(!showHint)}>
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>
      )}
      {showHint && <p className="text-xs text-blue-700 p-2 bg-blue-50 rounded mb-2 italic">{challenge.hint}</p>}
      {submitted && (
        <p className="text-xs mt-1">
          {isCorrect ? '✓ Correct!' : `✗ Answer: "${challenge.answer}"`}
        </p>
      )}
      {!submitted && (
        <Button size="sm" onClick={check} disabled={!answer.trim()} className="min-h-[44px] w-full sm:w-auto">
          Check Answer
        </Button>
      )}
    </div>
  );
}

function TrueFalseChallenge({ challenge, onScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const check = () => {
    let correct = 0;
    challenge.items.forEach((item, i) => {
      if (answers[i] === item.answer) correct++;
    });
    const pct = Math.round((correct / challenge.items.length) * 100);
    setScore({ correct, total: challenge.items.length, pct });
    setSubmitted(true);
    onScore(pct);
  };

  return (
    <div className="space-y-2">
      {challenge.items.map((item, i) => {
        const userAns = answers[i];
        const isCorrect = submitted && userAns === item.answer;
        const isWrong = submitted && userAns !== item.answer;
        return (
          <div key={i} className={`p-3 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : isWrong ? 'bg-red-50 border-red-200' : 'border-border'}`}>
            <p className="text-sm mb-2">{item.statement}</p>
            <div className="flex gap-2">
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  disabled={submitted}
                  onClick={() => setAnswers(p => ({ ...p, [i]: val }))}
                  className={`min-h-[44px] px-5 py-2 rounded-lg border text-sm font-medium transition-all ${
                    answers[i] === val
                      ? submitted
                        ? (isCorrect && answers[i] === val ? 'bg-green-500 text-white border-green-500' : 'bg-red-400 text-white border-red-400')
                        : 'bg-primary text-primary-foreground border-primary'
                      : submitted && item.answer === val ? 'bg-green-100 border-green-300 text-green-800' : 'border-border hover:bg-muted'
                  }`}
                >
                  {val ? 'True' : 'False'}
                </button>
              ))}
              {submitted && (isCorrect
                ? <CheckCircle className="h-5 w-5 text-green-600 self-center" />
                : <XCircle className="h-5 w-5 text-red-500 self-center" />)}
            </div>
          </div>
        );
      })}
      {!submitted ? (
        <Button size="sm" onClick={check} disabled={Object.keys(answers).length < challenge.items.length} className="min-h-[44px] w-full sm:w-auto">
          Check Answers
        </Button>
      ) : (
        <div className={`text-xs font-semibold p-2 rounded ${score.pct >= 70 ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
          {score.correct}/{score.total} correct ({score.pct}%)
        </div>
      )}
    </div>
  );
}

function MatchSceneChallenge({ challenge, onScore }) {
  const [matches, setMatches] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const shuffledScenes = useMemo(
    () => [...challenge.pairs].sort(() => Math.random() - 0.5).map(p => p.scene),
    []
  );

  const check = () => {
    let correct = 0;
    challenge.pairs.forEach((pair, i) => {
      if (matches[i] === pair.scene) correct++;
    });
    const pct = Math.round((correct / challenge.pairs.length) * 100);
    setScore({ correct, total: challenge.pairs.length, pct });
    setSubmitted(true);
    onScore(pct);
  };

  return (
    <div className="space-y-3">
      {challenge.pairs.map((pair, i) => {
        const isCorrect = submitted && matches[i] === pair.scene;
        const isWrong = submitted && matches[i] !== pair.scene;
        return (
          <div key={i} className={`p-3 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : isWrong ? 'bg-red-50 border-red-200' : 'border-border'}`}>
            <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">{pair.term}</Badge>
            <select
              disabled={submitted}
              value={matches[i] || ''}
              onChange={e => setMatches(p => ({ ...p, [i]: e.target.value }))}
              className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose the correct situation...</option>
              {shuffledScenes.map((scene, j) => (
                <option key={j} value={scene}>{scene}</option>
              ))}
            </select>
            {submitted && isWrong && (
              <p className="text-xs text-green-700 mt-1.5">✓ Correct: {pair.scene}</p>
            )}
          </div>
        );
      })}
      {!submitted ? (
        <Button size="sm" onClick={check} disabled={Object.keys(matches).length < challenge.pairs.length} className="min-h-[44px] w-full sm:w-auto">
          Check Matches
        </Button>
      ) : (
        <div className={`text-xs font-semibold p-2 rounded ${score.pct >= 70 ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
          {score.correct}/{score.total} correct ({score.pct}%)
        </div>
      )}
    </div>
  );
}

function OrderEventsChallenge({ challenge, onScore }) {
  const [order, setOrder] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const check = () => {
    let correct = 0;
    challenge.items.forEach((item, i) => {
      if (parseInt(order[i]) === item.correct) correct++;
    });
    const pct = Math.round((correct / challenge.items.length) * 100);
    setScore({ correct, total: challenge.items.length, pct });
    setSubmitted(true);
    onScore(pct);
  };

  return (
    <div className="space-y-2">
      {challenge.items.map((item, i) => {
        const userOrder = parseInt(order[i]);
        const isCorrect = submitted && userOrder === item.correct;
        const isWrong = submitted && userOrder !== item.correct;
        return (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : isWrong ? 'bg-red-50 border-red-200' : 'border-border'}`}>
            <select
              disabled={submitted}
              value={order[i] || ''}
              onChange={e => setOrder(p => ({ ...p, [i]: e.target.value }))}
              className="w-16 h-11 rounded-lg border border-input bg-background px-2 text-sm font-bold text-center shrink-0"
            >
              <option value="">?</option>
              {[1, 2, 3, 4].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-sm">{item.text}</span>
            {submitted && (isCorrect
              ? <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              : <span className="text-xs text-green-700 shrink-0">→ {item.correct}</span>)}
          </div>
        );
      })}
      {!submitted ? (
        <Button size="sm" onClick={check} disabled={Object.keys(order).length < challenge.items.length} className="min-h-[44px] w-full sm:w-auto">
          Check Order
        </Button>
      ) : (
        <div className={`text-xs font-semibold p-2 rounded ${score.pct >= 70 ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
          {score.correct}/{score.total} correct ({score.pct}%)
        </div>
      )}
    </div>
  );
}

function QuestChallenge({ challenge, onScore }) {
  switch (challenge.type) {
    case 'vocab_sort': return <VocabSortChallenge challenge={challenge} onScore={onScore} />;
    case 'summary_choice': return <SummaryChoiceChallenge challenge={challenge} onScore={onScore} />;
    case 'fill': return <FillChallenge challenge={challenge} onScore={onScore} />;
    case 'true_false': return <TrueFalseChallenge challenge={challenge} onScore={onScore} />;
    case 'match_scene': return <MatchSceneChallenge challenge={challenge} onScore={onScore} />;
    case 'order_events': return <OrderEventsChallenge challenge={challenge} onScore={onScore} />;
    default: return null;
  }
}

const typeIcons = { video: Video, podcast: Headphones, article: FileText };

export default function MediaQuest({ media, unitId }) {
  const { markMediaComplete, addWeakWordsFromExercise } = useProgress();
  const [expanded, setExpanded] = useState({});
  const [questScores, setQuestScores] = useState({});
  const [questDone, setQuestDone] = useState({});

  const toggle = (idx) => setExpanded(p => ({ ...p, [idx]: !p[idx] }));

  const handleScore = (mediaIdx, challengeIdx, score, mediaItem) => {
    const key = `${mediaIdx}_${challengeIdx}`;
    setQuestScores(p => {
      const next = { ...p, [key]: score };
      const challenges = MEDIA_QUESTS[mediaItem.title] || [];
      const allDone = challenges.every((_, ci) => next[`${mediaIdx}_${ci}`] !== undefined);
      if (allDone) {
        const scores = challenges.map((_, ci) => next[`${mediaIdx}_${ci}`] || 0);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        markMediaComplete(`${unitId}_quest_${mediaIdx}`, avg);
        setQuestDone(pd => ({ ...pd, [mediaIdx]: { avg, scores } }));
        if (avg < 70) {
          const weakIds = (mediaItem.vocabToListen || []).map(v => `u1_${v.replace(/\s+/g, '')}`);
          addWeakWordsFromExercise(weakIds);
        }
      }
      return next;
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Media Quest</h2>
        <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs">Interactive</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        For each media item, complete a short interactive challenge. Apply the vocabulary you learned.
      </p>

      <div className="space-y-3">
        {media.map((item, idx) => {
          const challenges = MEDIA_QUESTS[item.title] || [];
          const Icon = typeIcons[item.type] || FileText;
          const done = questDone[idx];
          const isExpanded = expanded[idx];

          if (!challenges.length) return null;

          return (
            <Card key={idx} className={`overflow-hidden transition-all ${done ? 'border-green-200' : 'border-border'}`}>
              <button
                className="w-full p-4 flex items-start justify-between text-left"
                style={{ minHeight: 68 }}
                onClick={() => toggle(idx)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${done ? 'bg-green-100' : 'bg-accent/10'}`}>
                    <Icon className={`h-4 w-4 ${done ? 'text-green-600' : 'text-accent'}`} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{item.title}</span>
                      <Badge variant="outline" className="text-[10px]">{challenges.length} task{challenges.length !== 1 ? 's' : ''}</Badge>
                      {done && (
                        <Badge className={`text-[10px] ${done.avg >= 70 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                          {done.avg >= 70 ? '✓' : '!'} {done.avg}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {done ? 'Quest completed — well done!' : `Complete ${challenges.length} challenge${challenges.length !== 1 ? 's' : ''} based on this ${item.type}`}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-1 ml-2">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <CardContent className="border-t pt-4 pb-5 space-y-6">
                  {/* Vocab focus */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground mr-1">Vocab focus:</span>
                    {item.vocabToListen.map(v => (
                      <Badge key={v} variant="secondary" className="text-[10px]">{v}</Badge>
                    ))}
                  </div>

                  {challenges.map((challenge, ci) => {
                    const scoreKey = `${idx}_${ci}`;
                    const isDone = questScores[scoreKey] !== undefined;
                    return (
                      <div key={ci} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isDone ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                          }`}>
                            {isDone ? '✓' : ci + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold mb-2">{challenge.instruction}</p>
                            <QuestChallenge
                              challenge={challenge}
                              onScore={(score) => handleScore(idx, ci, score, item)}
                            />
                          </div>
                        </div>
                        {ci < challenges.length - 1 && <hr className="border-border" />}
                      </div>
                    );
                  })}

                  {done && (
                    <div className={`p-3 rounded-xl text-center ${done.avg >= 70 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <Star className={`h-6 w-6 mx-auto mb-1 ${done.avg >= 70 ? 'text-green-500' : 'text-amber-500'}`} />
                      <p className="text-sm font-bold">Quest Score: {done.avg}%</p>
                      {done.avg < 70 && (
                        <p className="text-xs text-amber-700 mt-1">
                          <AlertTriangle className="inline h-3 w-3 mr-1" />
                          Related words added to Weak Words list for review.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Target words reminder */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Target className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase">Quest Vocabulary Targets</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {[...new Set(media.flatMap(m => m.vocabToListen || []))].map(v => (
            <Badge key={v} variant="outline" className="text-[10px]">{v}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}