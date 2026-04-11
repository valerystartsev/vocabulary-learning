import React, { useState } from 'react';
import { useMode } from '../../context/ModeContext';
import { HelpCircle, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import SentenceBuilder from '../exercises/SentenceBuilder';

/**
 * ComprehensionQuestions
 * Supports question types:
 *   { q, model }               — open (show/hide model answer)
 *   { type:'trueFalse', q, answer, explanation }
 *   { type:'multipleChoice', q, options, answer, explanation }
 *   { type:'sentenceBuilder', q, tiles, answer }
 *   { type:'match', pairs: [{a,b}] }
 */
export default function ComprehensionQuestions({ questions }) {
  const { isTeacherMode } = useMode();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--col-heading)' }}>
        <HelpCircle className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
        Comprehension Questions
      </h2>
      <p className="text-sm mb-4" style={{ color: 'var(--col-secondary)' }}>
        Answer each question. Use vocabulary from the unit.
      </p>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionCard key={idx} q={q} idx={idx} isTeacherMode={isTeacherMode} />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ q, idx, isTeacherMode }) {
  const type = q.type || 'open';

  if (type === 'sentenceBuilder') {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
        <div className="px-4 pt-3 pb-1">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Q{idx + 1}</span>
          <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--col-heading)' }}>{q.q}</p>
        </div>
        <div className="px-4 pb-4">
          <SentenceBuilder prompt="Build the correct sentence:" tiles={q.tiles} answer={q.answer} />
        </div>
      </div>
    );
  }

  if (type === 'trueFalse') {
    return <TrueFalseCard q={q} idx={idx} isTeacherMode={isTeacherMode} />;
  }

  if (type === 'multipleChoice') {
    return <MultipleChoiceCard q={q} idx={idx} isTeacherMode={isTeacherMode} />;
  }

  if (type === 'match') {
    return <MatchCard q={q} idx={idx} isTeacherMode={isTeacherMode} />;
  }

  // Default: open question with model answer toggle
  return <OpenCard q={q} idx={idx} isTeacherMode={isTeacherMode} />;
}

function TrueFalseCard({ q, idx, isTeacherMode }) {
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);

  const correct = checked && answer === q.answer;
  const wrong   = checked && answer !== q.answer;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
      <div className="px-4 pt-3 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Q{idx + 1} · True / False</span>
        <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--col-heading)' }}>{q.q}</p>
      </div>
      <div className="px-4 pb-4">
        <div className="flex gap-2 mb-2">
          {[true, false].map(v => {
            const sel = answer === v;
            const isRight = checked && v === q.answer;
            const isWrong = checked && sel && v !== q.answer;
            return (
              <button key={String(v)} disabled={checked && !isTeacherMode}
                onClick={() => { if (!checked || isTeacherMode) { setAnswer(v); setChecked(false); } }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  minHeight: 44,
                  border: isRight ? '2px solid var(--col-correct)' : isWrong ? '2px solid var(--col-incorrect)' : sel ? '2px solid var(--col-accent)' : '1px solid var(--col-border)',
                  backgroundColor: isRight ? '#F0FAF5' : isWrong ? '#FEF2F2' : sel ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                  color: isRight ? '#1F5E3A' : isWrong ? '#7F2020' : sel ? 'var(--col-accent-text)' : 'var(--col-secondary)',
                }}>
                {v ? 'True' : 'False'}
              </button>
            );
          })}
        </div>
        {!checked && answer !== null && (
          <button onClick={() => setChecked(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--col-accent)', minHeight: 44 }}>
            Check
          </button>
        )}
        {(checked || isTeacherMode) && q.explanation && (
          <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ backgroundColor: correct || isTeacherMode ? '#E8F5EE' : '#FEF2F2', color: correct || isTeacherMode ? '#1F5E3A' : '#7F2020' }}>
            {(correct || isTeacherMode) ? <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> : <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
            <span><strong>Answer: {q.answer ? 'True' : 'False'}.</strong> {q.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MultipleChoiceCard({ q, idx, isTeacherMode }) {
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
      <div className="px-4 pt-3 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Q{idx + 1} · Multiple Choice</span>
        <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--col-heading)' }}>{q.q}</p>
      </div>
      <div className="px-4 pb-4 space-y-2">
        {q.options.map(opt => {
          const sel = answer === opt;
          const isRight = (checked || isTeacherMode) && opt === q.answer;
          const isWrong = checked && sel && opt !== q.answer;
          return (
            <button key={opt} disabled={checked && !isTeacherMode}
              onClick={() => { setAnswer(opt); setChecked(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{
                minHeight: 44,
                border: isRight ? '2px solid var(--col-correct)' : isWrong ? '2px solid var(--col-incorrect)' : sel ? '2px solid var(--col-accent)' : '1px solid var(--col-border)',
                backgroundColor: isRight ? '#F0FAF5' : isWrong ? '#FEF2F2' : sel ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                color: isRight ? '#1F5E3A' : isWrong ? '#7F2020' : 'var(--col-body)',
                fontWeight: (sel || isRight) ? 600 : 400,
              }}>
              {opt}
            </button>
          );
        })}
        {!checked && answer !== null && (
          <button onClick={() => setChecked(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-1"
            style={{ backgroundColor: 'var(--col-accent)', minHeight: 44 }}>
            Check
          </button>
        )}
        {(checked || isTeacherMode) && q.explanation && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs mt-1"
            style={{ backgroundColor: '#E8F5EE', color: '#1F5E3A' }}>
            <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span><strong>Answer: {q.answer}.</strong> {q.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ q, idx, isTeacherMode }) {
  const [selections, setSelections] = useState({});
  const [checked, setChecked] = useState(false);
  const rightCol = [...q.pairs.map(p => p.b)].sort(() => Math.random() - 0.5);
  const [shuffled] = useState(rightCol);

  const allAnswered = q.pairs.every((_, i) => selections[i] !== undefined);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
      <div className="px-4 pt-3 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Q{idx + 1} · Match</span>
        <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--col-heading)' }}>{q.q || 'Match each item on the left with the correct answer.'}</p>
      </div>
      <div className="px-4 pb-4 space-y-2">
        {q.pairs.map((pair, pi) => {
          const sel = selections[pi];
          const correct = checked && sel === pair.b;
          const wrong   = checked && sel && sel !== pair.b;
          return (
            <div key={pi} className="flex items-center gap-2">
              <span className="text-sm w-36 shrink-0 font-medium" style={{ color: 'var(--col-body)' }}>{pair.a}</span>
              <select
                disabled={checked && !isTeacherMode}
                value={sel || ''}
                onChange={e => setSelections(s => ({ ...s, [pi]: e.target.value }))}
                className="flex-1 px-3 rounded-xl text-sm"
                style={{
                  minHeight: 40,
                  border: correct ? '2px solid var(--col-correct)' : wrong ? '2px solid var(--col-incorrect)' : '1px solid var(--col-border)',
                  backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : 'var(--col-surface)',
                  color: 'var(--col-body)',
                }}
              >
                <option value="">— choose —</option>
                {shuffled.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          );
        })}
        {!checked && allAnswered && (
          <button onClick={() => setChecked(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-1"
            style={{ backgroundColor: 'var(--col-accent)', minHeight: 44 }}>
            Check All
          </button>
        )}
        {(checked || isTeacherMode) && (
          <div className="px-3 py-2 rounded-lg text-xs mt-1"
            style={{ backgroundColor: '#E8F5EE', color: '#1F5E3A' }}>
            {q.pairs.map((p, pi) => (
              <div key={pi}><strong>{p.a}</strong> → {p.b}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OpenCard({ q, idx, isTeacherMode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
      <div className="px-4 pt-3 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Q{idx + 1}</span>
        <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--col-heading)' }}>{q.q}</p>
      </div>
      <div className="px-4 pb-4">
        <textarea
          placeholder="Write your answer here…"
          rows={3}
          className="w-full px-3 py-2 rounded-xl text-sm mb-2"
          style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-dict-bg)', color: 'var(--col-body)', resize: 'vertical', minHeight: 72, fontSize: 14 }}
        />
        <button onClick={() => setShow(s => !s)}
          className="flex items-center gap-2 text-sm px-4 rounded-xl"
          style={{ minHeight: 40, border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface-secondary)' }}>
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {show ? 'Hide Model Answer' : 'Show Model Answer'}
        </button>
        {(show || isTeacherMode) && (
          <div className="mt-2 p-3 rounded-lg text-sm" style={{ backgroundColor: '#F0FAF5', border: '1px solid #A8D5BA', color: '#1F5E3A' }}>
            <p className="text-xs font-semibold mb-1">Model Answer:</p>
            {q.model}
          </div>
        )}
      </div>
    </div>
  );
}