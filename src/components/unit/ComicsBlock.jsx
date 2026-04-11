import React, { useState } from 'react';
import { useMode } from '../../context/ModeContext';
import { useProgress } from '../../context/ProgressContext';
import { ChevronDown, ChevronUp, CheckCircle, X, BookOpen } from 'lucide-react';
import SentenceBuilder from '../exercises/SentenceBuilder';

/* ─── Per-comic tasks ───────────────────────────────────────────────────── */
const COMIC_TASKS = {
  c1_market_war: [
    {
      id: 'tf',
      type: 'trueFalse',
      q: 'Multiple sellers competing for the same customers in a market create competition.',
      answer: true,
      explanation: '✓ Correct — competition exists when multiple sellers compete for the same customers in a market.'
    },
    {
      id: 'mc',
      type: 'choice',
      q: 'What happens when only one seller controls the whole market?',
      options: ['Competition increases', 'A monopoly forms', 'Prices fall', 'More sellers appear'],
      answer: 'A monopoly forms',
      explanation: 'When one seller controls the whole market, it is called a monopoly.'
    },
    {
      id: 'sb',
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['A', 'legal', 'monopoly', 'happens', 'when', 'the', 'government', 'gives', 'one', 'company', 'special', 'permission', 'many', 'sellers', 'compete', 'free'],
      answer: ['A', 'legal', 'monopoly', 'happens', 'when', 'the', 'government', 'gives', 'one', 'company', 'special', 'permission']
    }
  ],
  c1_business_start: [
    {
      id: 'tf',
      type: 'trueFalse',
      q: 'Overheads are fixed costs that a business must pay regularly.',
      answer: true,
      explanation: 'Correct — overheads are regular costs like rent, electricity, and salaries.'
    },
    {
      id: 'mc',
      type: 'choice',
      q: 'What is the break-even point?',
      options: ['When a company makes its biggest profit', 'When income equals all costs — no profit, no loss', 'When prices stop changing', 'When a company closes'],
      answer: 'When income equals all costs — no profit, no loss',
      explanation: 'Break even = income covers all costs exactly. No profit and no loss.'
    },
    {
      id: 'sb',
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['The', 'company', 'must', 'cover', 'overheads', 'before', 'it', 'can', 'break', 'even', 'profit', 'merge', 'fluctuate', 'cancel'],
      answer: ['The', 'company', 'must', 'cover', 'overheads', 'before', 'it', 'can', 'break', 'even']
    }
  ],
  c1_transactions: [
    {
      id: 'mc',
      type: 'choice',
      q: 'Which word means "to discuss prices and try to agree on a deal"?',
      options: ['purchase', 'permit', 'negotiate', 'procedure'],
      answer: 'negotiate',
      explanation: 'Negotiate = to talk with someone to reach an agreement.'
    },
    {
      id: 'tf',
      type: 'trueFalse',
      q: 'A permit is an official document giving you permission to do something.',
      answer: true,
      explanation: 'Correct — a permit is an official document that allows you to do something legally.'
    },
    {
      id: 'sb',
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['They', 'negotiate', 'a', 'good', 'deal', 'and', 'follow', 'the', 'procedure', 'to', 'get', 'the', 'permit', 'cancel', 'break', 'refund'],
      answer: ['They', 'negotiate', 'a', 'good', 'deal', 'and', 'follow', 'the', 'procedure', 'to', 'get', 'the', 'permit']
    }
  ],
  c1_authority: [
    {
      id: 'tf',
      type: 'trueFalse',
      q: 'Authority means official power to make decisions.',
      answer: true,
      explanation: 'Correct — authority is the official right or power to give orders and make decisions.'
    },
    {
      id: 'mc',
      type: 'choice',
      q: 'What happens in a merger?',
      options: ['One company closes down', 'Two companies join to become one', 'The government restricts a company', 'Workers are recruited'],
      answer: 'Two companies join to become one',
      explanation: 'A merger = two companies combine to become one larger company.'
    },
    {
      id: 'sb',
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['The', 'company', 'needs', 'authority', 'to', 'authorize', 'the', 'merger', 'cancel', 'restrict', 'recruit', 'permit'],
      answer: ['The', 'company', 'needs', 'authority', 'to', 'authorize', 'the', 'merger']
    }
  ],
  c1_recruitment: [
    {
      id: 'mc',
      type: 'choice',
      q: 'Which document shows a person\'s education and work history?',
      options: ['permit', 'deal', 'resume', 'complaint'],
      answer: 'resume',
      explanation: 'A resume (CV) lists your education, skills, and work experience.'
    },
    {
      id: 'tf',
      type: 'trueFalse',
      q: 'Recruitment is the process of finding and hiring new workers.',
      answer: true,
      explanation: 'Correct — recruitment means finding, selecting, and hiring new employees.'
    },
    {
      id: 'sb',
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['Recruitment', 'helps', 'an', 'enterprise', 'find', 'new', 'workers', 'cancel', 'damage', 'refund', 'restrict', 'authority'],
      answer: ['Recruitment', 'helps', 'an', 'enterprise', 'find', 'new', 'workers']
    }
  ],
  c1_refund: [
    {
      id: 'tf',
      type: 'trueFalse',
      q: 'A refund means the customer gets their money back.',
      answer: true,
      explanation: 'Correct — a refund is when a business returns money to a customer.'
    },
    {
      id: 'mc',
      type: 'choice',
      q: 'What is the correct sequence when a customer has a problem?',
      options: [
        'Refund → Complain → Cancel',
        'Complain → Cancel → Refund',
        'Cancel → Refund → Complain',
        'Complain → Request refund → Cancel if no response'
      ],
      answer: 'Complain → Request refund → Cancel if no response',
      explanation: 'The standard process: first complain, then request a refund, then cancel if unresolved.'
    },
    {
      id: 'sb',
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['If', 'the', 'product', 'is', 'broken', 'the', 'customer', 'may', 'complain', 'and', 'ask', 'for', 'a', 'refund', 'deal', 'cancel', 'permit'],
      answer: ['If', 'the', 'product', 'is', 'broken', 'the', 'customer', 'may', 'complain', 'and', 'ask', 'for', 'a', 'refund']
    }
  ],
  c1_cause_damage: [
    {
      id: 'mc',
      type: 'choice',
      q: 'Which word best completes this sentence: "The accident ______ serious problems for the company."',
      options: ['damaged', 'caused', 'cancelled', 'recruited'],
      answer: 'caused',
      explanation: '"Caused" = made something happen. The accident made the problems happen.'
    },
    {
      id: 'tf',
      type: 'trueFalse',
      q: '"Damage" can be used as both a noun and a verb in English.',
      answer: true,
      explanation: 'Correct — "damage" as noun: "There was damage." As verb: "It damaged the building."'
    },
    {
      id: 'sb',
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['The', 'accident', 'caused', 'damage', 'and', 'affected', 'the', 'work', 'cancel', 'refund', 'monopoly', 'authority'],
      answer: ['The', 'accident', 'caused', 'damage', 'and', 'affected', 'the', 'work']
    }
  ],
  c1_subject_illegal: [
    {
      id: 'tf',
      type: 'trueFalse',
      q: 'If workers are "subject to" rules, it means they must follow those rules.',
      answer: true,
      explanation: 'Correct — "subject to" means under the condition of, or required to obey.'
    },
    {
      id: 'mc',
      type: 'choice',
      q: 'What does "illegal" mean?',
      options: ['Difficult to understand', 'Against the law', 'Not very important', 'Expensive to do'],
      answer: 'Against the law',
      explanation: 'Illegal = not allowed by law. It is the opposite of legal.'
    },
    {
      id: 'sb',
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['Changing', 'official', 'documents', 'is', 'illegal', 'and', 'the', 'manager', 'must', 'control', 'the', 'situation', 'cancel', 'recruit', 'damage'],
      answer: ['Changing', 'official', 'documents', 'is', 'illegal', 'and', 'the', 'manager', 'must', 'control', 'the', 'situation']
    }
  ]
};

/* ─── Task sub-component ─────────────────────────────────────────────────── */
function ComicTask({ task }) {
  const [answer, setAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (task.type === 'sentenceBuilder') {
    return (
      <div className="mt-3">
        <SentenceBuilder prompt={task.q} tiles={task.tiles} answer={task.answer} />
      </div>
    );
  }

  const isCorrect = submitted && String(answer) === String(task.answer);
  const isWrong = submitted && String(answer) !== String(task.answer);

  return (
    <div
      className="p-4 rounded-xl mt-3"
      style={{
        border: isCorrect ? '1.5px solid var(--col-correct)' : isWrong ? '1.5px solid var(--col-incorrect)' : '1px solid var(--col-border)',
        backgroundColor: isCorrect ? '#F0FAF5' : isWrong ? '#FEF2F2' : 'var(--col-surface)'
      }}
    >
      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--col-heading)' }}>{task.q}</p>

      {task.type === 'trueFalse' && (
        <div className="flex gap-2">
          {[true, false].map(v => {
            const sel = answer === v;
            const correct = submitted && v === task.answer;
            const wrong = submitted && sel && v !== task.answer;
            return (
              <button
                key={String(v)}
                disabled={submitted}
                onClick={() => setAnswer(v)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  minHeight: 44,
                  border: correct ? '2px solid var(--col-correct)' : wrong ? '2px solid var(--col-incorrect)' : sel ? '2px solid var(--col-accent)' : '1px solid var(--col-border)',
                  backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : sel ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                  color: correct ? '#1F5E3A' : wrong ? 'var(--col-incorrect)' : sel ? 'var(--col-accent-text)' : 'var(--col-secondary)'
                }}
              >
                {v ? 'True' : 'False'}
              </button>
            );
          })}
        </div>
      )}

      {task.type === 'choice' && (
        <div className="space-y-2">
          {task.options.map(opt => {
            const sel = answer === opt;
            const correct = submitted && opt === task.answer;
            const wrong = submitted && sel && opt !== task.answer;
            return (
              <button
                key={opt}
                disabled={submitted}
                onClick={() => setAnswer(opt)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  minHeight: 44,
                  border: correct ? '2px solid var(--col-correct)' : wrong ? '2px solid var(--col-incorrect)' : sel ? '2px solid var(--col-accent)' : '1px solid var(--col-border)',
                  backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : sel ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                  color: correct ? '#1F5E3A' : wrong ? 'var(--col-incorrect)' : sel ? 'var(--col-accent-text)' : 'var(--col-body)',
                  fontWeight: (sel || correct) ? 600 : 400
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {!submitted && answer !== null && (
        <button
          onClick={() => setSubmitted(true)}
          className="mt-3 w-full rounded-xl text-sm font-semibold text-white transition-all"
          style={{ minHeight: 44, backgroundColor: 'var(--col-accent)' }}
        >
          Check Answer
        </button>
      )}

      {submitted && task.explanation && (
        <p
          className="mt-2.5 text-xs px-3 py-2 rounded-lg"
          style={{
            backgroundColor: isCorrect ? '#E8F5EE' : '#FEF2F2',
            color: isCorrect ? '#1F5E3A' : '#7F2020',
            borderLeft: `3px solid ${isCorrect ? 'var(--col-correct)' : 'var(--col-incorrect)'}`
          }}
        >
          {isCorrect ? '✓ ' : `✗ Answer: ${task.answer === true ? 'True' : task.answer === false ? 'False' : task.answer}. `}
          {task.explanation}
        </p>
      )}

      {submitted && (
        <button
          onClick={() => { setAnswer(null); setSubmitted(false); }}
          className="mt-2 text-xs px-3 py-1.5 rounded-lg transition-all"
          style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

/* ─── Full-image lightbox ────────────────────────────────────────────────── */
function ComicLightbox({ comic, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--col-overlay)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--col-surface)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--col-border)' }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>{comic.title}</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 36, height: 36, backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-secondary)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 56px)' }}>
          <img
            src={comic.imageUrl}
            alt={comic.title}
            className="w-full"
            style={{ display: 'block', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Single comic card ──────────────────────────────────────────────────── */
function ComicCard({ comic, index, isCompleted, onMarkComplete }) {
  const { isTeacherMode } = useMode();
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const tasks = COMIC_TASKS[comic.id] || [];

  return (
    <>
      {lightbox && <ComicLightbox comic={comic} onClose={() => setLightbox(false)} />}
      <div
        className="rounded-xl overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--col-surface)',
          border: isCompleted ? '1.5px solid var(--col-correct)' : '1px solid var(--col-border)'
        }}
      >
        {/* Header row */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-4 flex items-start gap-3 text-left"
          style={{ minHeight: 68 }}
        >
          {/* Number badge */}
          <div
            className="shrink-0 flex items-center justify-center rounded-lg font-bold text-sm"
            style={{
              width: 32, height: 32,
              backgroundColor: isCompleted ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
              color: isCompleted ? 'var(--col-accent-text)' : 'var(--col-secondary)',
              border: isCompleted ? '1px solid var(--col-divider)' : '1px solid var(--col-border)'
            }}
          >
            {isCompleted ? <CheckCircle className="h-4 w-4" style={{ color: 'var(--col-correct)' }} /> : index + 1}
          </div>

          {/* Thumbnail */}
          <div
            className="shrink-0 rounded-lg overflow-hidden"
            style={{ width: 64, height: 44, backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
          >
            <img
              src={comic.imageUrl}
              alt={comic.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title + tags */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight mb-1" style={{ color: 'var(--col-heading)' }}>{comic.title}</p>
            <div className="flex flex-wrap gap-1">
              {comic.vocabTags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)', border: '1px solid var(--col-divider)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Expand chevron */}
          <div className="shrink-0" style={{ color: 'var(--col-muted)' }}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-5" style={{ borderTop: '1px solid var(--col-border)' }}>
            {/* Description */}
            <p className="text-xs pt-4 pb-3" style={{ color: 'var(--col-secondary)', lineHeight: 1.6 }}>{comic.description}</p>

            {/* Comic image — inline expand */}
            <div
              className="rounded-xl overflow-hidden cursor-pointer mb-4 relative group"
              style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface-secondary)' }}
              onClick={() => setLightbox(true)}
            >
              <img
                src={comic.imageUrl}
                alt={comic.title}
                className="w-full"
                style={{ display: 'block', objectFit: 'contain', maxHeight: 420 }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
              >
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--col-heading)' }}
                >
                  Click to enlarge
                </span>
              </div>
            </div>

            {/* Tasks label */}
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                Tasks — answer for this comic
              </span>
            </div>

            {/* Per-comic tasks */}
            <div className="space-y-1">
              {tasks.map(task => (
                <ComicTask key={task.id} task={task} />
              ))}
            </div>

            {/* Mark complete button */}
            {!isCompleted && (
              <button
                onClick={onMarkComplete}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  minHeight: 48,
                  border: '1.5px solid var(--col-accent)',
                  color: 'var(--col-accent-text)',
                  backgroundColor: 'var(--col-accent-light)'
                }}
              >
                <CheckCircle className="h-4 w-4" />
                Mark Comic Complete
              </button>
            )}
            {isCompleted && (
              <div
                className="mt-4 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold py-3"
                style={{ backgroundColor: '#F0FAF5', border: '1.5px solid var(--col-correct)', color: '#1F6035' }}
              >
                <CheckCircle className="h-4 w-4" style={{ color: 'var(--col-correct)' }} />
                Comic completed
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Main ComicsBlock ───────────────────────────────────────────────────── */
export default function ComicsBlock({ comics }) {
  const { progress, markSectionComplete } = useProgress();
  const [completedComics, setCompletedComics] = useState(
    () => JSON.parse(localStorage.getItem('u1_comics_done') || '{}')
  );

  const handleMarkComplete = (comicId) => {
    const next = { ...completedComics, [comicId]: true };
    setCompletedComics(next);
    localStorage.setItem('u1_comics_done', JSON.stringify(next));
    if (comics.every(c => next[c.id])) {
      markSectionComplete?.(1, 'comics');
    }
  };

  const doneCount = comics.filter(c => completedComics[c.id]).length;

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
            Look at each comic. Read the vocabulary. Answer the tasks.
          </p>
          <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
            Посмотрите каждый комикс. Читайте словарь. Ответьте на задания.
          </p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)', border: '1px solid var(--col-divider)' }}
        >
          {doneCount}/{comics.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.round((doneCount / comics.length) * 100)}%`, backgroundColor: 'var(--col-accent)' }}
          />
        </div>
        <span className="text-xs whitespace-nowrap" style={{ color: 'var(--col-muted)' }}>
          {Math.round((doneCount / comics.length) * 100)}%
        </span>
      </div>

      {/* Comic list */}
      <div className="space-y-3">
        {comics.map((comic, i) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            index={i}
            isCompleted={!!completedComics[comic.id]}
            onMarkComplete={() => handleMarkComplete(comic.id)}
          />
        ))}
      </div>
    </div>
  );
}