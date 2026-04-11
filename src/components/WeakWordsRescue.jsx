import React, { useState, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { getAllVocabulary } from '../data/courseData';
import { X, CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

// Pick up to 5 oldest stale weak words
function buildTasks(words, allVocab) {
  return words.slice(0, 5).map((id, i) => {
    const word = allVocab.find(v => v.id === id);
    if (!word) return null;

    const taskType = i % 5;
    const others = allVocab.filter(v => v.id !== id);
    const shuffled = [...others].sort(() => Math.random() - 0.5);

    if (taskType === 0) {
      // Flash review
      return { type: 'flash', word };
    } else if (taskType === 1) {
      // Translation match: pick the correct Russian translation
      const distractors = shuffled.slice(0, 3).map(v => v.translationRu);
      const opts = [...distractors, word.translationRu].sort(() => Math.random() - 0.5);
      return { type: 'translation', word, opts, answer: word.translationRu };
    } else if (taskType === 2) {
      // Reverse: given Russian, pick the English term
      const distractors = shuffled.slice(0, 3).map(v => v.term);
      const opts = [...distractors, word.term].sort(() => Math.random() - 0.5);
      return { type: 'reverse', word, opts, answer: word.term };
    } else if (taskType === 3) {
      // Fill gap: show example with term blanked
      const blanked = word.example.replace(new RegExp(word.term, 'i'), '______');
      const distractors = shuffled.slice(0, 3).map(v => v.term);
      const opts = [...distractors, word.term].sort(() => Math.random() - 0.5);
      return { type: 'fillgap', word, blanked, opts, answer: word.term };
    } else {
      // True/False meaning check
      const useCorrect = Math.random() > 0.5;
      const displayDef = useCorrect ? word.meaningEn : shuffled[0]?.meaningEn || word.meaningEn;
      return { type: 'trueFalse', word, displayDef, answer: useCorrect };
    }
  }).filter(Boolean);
}

// ── Task renderers ────────────────────────────────────────────────────────────

function FlashTask({ task, onResult }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <div
        className="rounded-xl p-6 text-center cursor-pointer min-h-36 flex flex-col items-center justify-center mb-4 transition-all"
        style={{
          backgroundColor: revealed ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
          border: `2px solid ${revealed ? 'var(--col-accent)' : 'var(--col-border)'}`,
        }}
        onClick={() => setRevealed(true)}
      >
        {!revealed ? (
          <>
            <p className="text-2xl font-bold mb-2" style={{ color: 'var(--col-heading)' }}>{task.word.term}</p>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Tap to reveal the translation</p>
            <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>Нажмите, чтобы увидеть перевод</p>
          </>
        ) : (
          <>
            <p className="text-xl font-semibold mb-1" style={{ color: 'var(--col-accent-text)' }}>{task.word.translationRu}</p>
            <p className="text-sm" style={{ color: 'var(--col-body)' }}>{task.word.meaningEn}</p>
          </>
        )}
      </div>
      {revealed && (
        <div className="flex gap-2">
          <button onClick={() => onResult(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ backgroundColor: 'var(--col-correct)', minHeight: 48 }}>
            <CheckCircle className="h-4 w-4" /> I know it
          </button>
          <button onClick={() => onResult(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
            style={{ border: '1px solid var(--col-warning)', color: 'var(--col-warning)', minHeight: 48 }}>
            <AlertTriangle className="h-4 w-4" /> Still unsure
          </button>
        </div>
      )}
    </div>
  );
}

function ChoiceTask({ task, onResult }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const correct = selected === task.answer;

  const handleCheck = () => {
    if (!selected) return;
    setChecked(true);
    setTimeout(() => onResult(selected === task.answer), 1200);
  };

  return (
    <div>
      <div className="space-y-2 mb-4">
        {task.opts.map(opt => {
          let bg = 'var(--col-surface-secondary)', border = 'var(--col-border)';
          if (checked) {
            if (opt === task.answer) { bg = '#E8F5EE'; border = 'var(--col-correct)'; }
            else if (opt === selected) { bg = '#FEF2F2'; border = 'var(--col-incorrect)'; }
          } else if (selected === opt) {
            bg = 'var(--col-accent-light)'; border = 'var(--col-accent)';
          }
          return (
            <button key={opt} disabled={checked} onClick={() => setSelected(opt)}
              className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
              style={{ backgroundColor: bg, border: `1px solid ${border}`, color: 'var(--col-body)', minHeight: 48 }}>
              {opt}
            </button>
          );
        })}
      </div>
      {!checked && (
        <button onClick={handleCheck} disabled={!selected}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white"
          style={{ backgroundColor: selected ? 'var(--col-accent)' : 'var(--col-divider)', minHeight: 48 }}>
          Check Answer
        </button>
      )}
    </div>
  );
}

function TrueFalseTask({ task, onResult }) {
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (answer === null) return;
    setChecked(true);
    setTimeout(() => onResult(answer === task.answer), 1200);
  };

  return (
    <div>
      <div className="px-4 py-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>
          "{task.displayDef}"
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--col-muted)' }}>Is this the correct definition of <strong>{task.word.term}</strong>?</p>
      </div>
      <div className="flex gap-2 mb-4">
        {[true, false].map(v => {
          let bg = 'var(--col-surface-secondary)', border = 'var(--col-border)';
          if (checked) {
            if (v === task.answer) { bg = '#E8F5EE'; border = 'var(--col-correct)'; }
            else if (v === answer) { bg = '#FEF2F2'; border = 'var(--col-incorrect)'; }
          } else if (answer === v) {
            bg = 'var(--col-accent-light)'; border = 'var(--col-accent)';
          }
          return (
            <button key={String(v)} disabled={checked} onClick={() => setAnswer(v)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ backgroundColor: bg, border: `1px solid ${border}`, color: 'var(--col-body)', minHeight: 48 }}>
              {v ? 'True' : 'False'}
            </button>
          );
        })}
      </div>
      {!checked && (
        <button onClick={handleCheck} disabled={answer === null}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white"
          style={{ backgroundColor: answer !== null ? 'var(--col-accent)' : 'var(--col-divider)', minHeight: 48 }}>
          Check
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function WeakWordsRescue({ staleWords, onClose }) {
  const { markWordLearned } = useProgress();
  const allVocab = getAllVocabulary();
  const tasks = useMemo(() => buildTasks(staleWords, allVocab), [staleWords]);

  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  if (tasks.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'var(--col-overlay)' }}>
        <div className="rounded-2xl p-8 text-center max-w-sm w-full" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <CheckCircle className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--col-correct)' }} />
          <h2 className="font-bold text-base mb-2" style={{ color: 'var(--col-heading)' }}>No stale words to rescue.</h2>
          <button onClick={onClose} className="mt-2 px-6 py-3 rounded-xl font-semibold text-sm text-white w-full" style={{ backgroundColor: 'var(--col-accent)' }}>Close</button>
        </div>
      </div>
    );
  }

  const handleResult = (correct) => {
    const task = tasks[idx];
    if (correct) markWordLearned(task.word.id);
    setResults(r => [...r, { wordId: task.word.id, correct }]);
    if (idx < tasks.length - 1) setIdx(i => i + 1);
    else setDone(true);
  };

  if (done) {
    const correct = results.filter(r => r.correct).length;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'var(--col-overlay)' }}>
        <div className="rounded-2xl p-6 max-w-sm w-full text-center" style={{ backgroundColor: 'var(--col-surface)', border: '2px solid var(--col-accent)' }}>
          <CheckCircle className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--col-correct)' }} />
          <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--col-heading)' }}>Rescue Session Complete</h2>
          <p className="text-sm mb-5" style={{ color: 'var(--col-muted)' }}>
            You reviewed {tasks.length} weak words. {correct} answered correctly.
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)' }}>
              Back to Dashboard
            </button>
            <button onClick={() => { setIdx(0); setResults([]); setDone(false); }}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white" style={{ backgroundColor: 'var(--col-accent)' }}>
              <RotateCcw className="h-4 w-4 inline mr-1.5" />Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const task = tasks[idx];
  const taskTypeLabel = {
    flash: 'Flash Review',
    translation: 'Translation Match',
    reverse: 'Reverse Translation',
    fillgap: 'Fill the Gap',
    trueFalse: 'True or False',
  }[task.type] || 'Review';

  const promptText = {
    flash: null,
    translation: `Choose the correct Russian translation of "${task.word.term}":`,
    reverse: `Which English word means "${task.word.translationRu}"?`,
    fillgap: `Choose the word that fits the gap:`,
    trueFalse: `True or False?`,
  }[task.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'var(--col-overlay)' }}>
      <div className="rounded-2xl w-full max-w-md" style={{ backgroundColor: 'var(--col-surface)', border: '2px solid var(--col-accent)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--col-border)' }}>
          <div>
            <h2 className="font-bold text-base" style={{ color: 'var(--col-heading)' }}>Weak Words Rescue</h2>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
              {taskTypeLabel} — {idx + 1} of {tasks.length}
            </p>
          </div>
          <button onClick={onClose} className="flex items-center justify-center rounded-lg" style={{ width: 40, height: 40, color: 'var(--col-muted)', border: '1px solid var(--col-border)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4">
          <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ backgroundColor: 'var(--col-divider)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(idx / tasks.length) * 100}%`, backgroundColor: 'var(--col-accent)' }} />
          </div>

          {promptText && (
            <p className="text-sm font-medium mb-4" style={{ color: 'var(--col-heading)' }}>
              {task.type === 'fillgap' && (
                <span className="block text-sm mb-2 font-normal leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
                  {task.blanked}
                </span>
              )}
              {promptText}
            </p>
          )}
        </div>

        <div className="px-5 pb-5">
          {task.type === 'flash' && <FlashTask task={task} onResult={handleResult} />}
          {(task.type === 'translation' || task.type === 'reverse' || task.type === 'fillgap') && (
            <ChoiceTask task={task} onResult={handleResult} />
          )}
          {task.type === 'trueFalse' && <TrueFalseTask task={task} onResult={handleResult} />}
        </div>
      </div>
    </div>
  );
}