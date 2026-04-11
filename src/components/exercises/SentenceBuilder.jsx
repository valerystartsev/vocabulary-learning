import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react';

/**
 * SentenceBuilder
 * Props:
 *   prompt       — string: the instruction shown above the builder
 *   tiles        — string[]: ALL word tiles (correct + distractors)
 *   answer       — string[]: the correct sequence of words
 *   onComplete?  — (correct: boolean) => void
 */
export default function SentenceBuilder({ prompt, tiles: rawTiles, answer, onComplete }) {
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const [pool, setPool]       = useState(() => shuffle(rawTiles));
  const [built, setBuilt]     = useState([]);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setPool(shuffle(rawTiles));
    setBuilt([]);
    setChecked(false);
    setRevealed(false);
  }, [prompt]);

  const addTile = (tile, poolIdx) => {
    if (checked) return;
    setPool(p => p.filter((_, i) => i !== poolIdx));
    setBuilt(b => [...b, tile]);
  };

  const removeTile = (tile, builtIdx) => {
    if (checked) return;
    setBuilt(b => b.filter((_, i) => i !== builtIdx));
    setPool(p => [...p, tile]);
  };

  const isCorrect = () => built.join(' ') === answer.join(' ');

  const check = () => {
    setChecked(true);
    onComplete?.(isCorrect());
  };

  const reset = () => {
    setPool(shuffle(rawTiles));
    setBuilt([]);
    setChecked(false);
    setRevealed(false);
  };

  const reveal = () => {
    setRevealed(true);
    setBuilt([...answer]);
    setPool([]);
    setChecked(false);
  };

  const correct = checked && isCorrect();
  const wrong   = checked && !isCorrect();

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
      {/* Prompt */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm font-medium" style={{ color: 'var(--col-heading)' }}>{prompt}</p>
      </div>

      {/* Answer bar */}
      <div
        className="mx-4 mb-3 min-h-[52px] px-3 py-2 rounded-xl flex flex-wrap gap-1.5 items-center"
        style={{
          backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : 'var(--col-dict-bg)',
          border: correct ? '1.5px solid var(--col-correct)' : wrong ? '1.5px solid var(--col-incorrect)' : '1px solid var(--col-border)',
          minHeight: 52,
        }}
      >
        {built.length === 0 && !checked && (
          <span className="text-xs italic" style={{ color: 'var(--col-muted)' }}>Tap words below to build your answer…</span>
        )}
        {built.map((tile, i) => {
          const tileCorrect = checked && answer[i] === tile;
          const tileWrong   = checked && answer[i] !== tile;
          return (
            <button
              key={`${tile}-${i}`}
              onClick={() => removeTile(tile, i)}
              disabled={checked}
              className="px-2.5 py-1 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: tileCorrect ? 'var(--col-accent)' : tileWrong ? 'var(--col-incorrect)' : revealed ? 'var(--col-accent)' : 'var(--col-surface)',
                color: tileCorrect || tileWrong || revealed ? 'white' : 'var(--col-heading)',
                border: tileCorrect ? 'none' : tileWrong ? 'none' : '1px solid var(--col-border)',
                minHeight: 36,
                cursor: checked ? 'default' : 'pointer',
              }}
            >
              {tile}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {checked && (
        <div className="mx-4 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
          style={{ backgroundColor: correct ? '#E8F5EE' : '#FEF2F2', color: correct ? '#1F5E3A' : '#7F2020' }}>
          {correct
            ? <><CheckCircle className="h-3.5 w-3.5 shrink-0" /> Correct!</>
            : <><XCircle className="h-3.5 w-3.5 shrink-0" /> Not quite. Try again or show the answer.</>}
        </div>
      )}

      {revealed && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', border: '1px solid var(--col-divider)' }}>
          Correct answer: <strong>{answer.join(' ')}</strong>
        </div>
      )}

      {/* Word pool */}
      <div className="mx-4 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--col-muted)' }}>Word tiles</p>
        <div className="flex flex-wrap gap-1.5">
          {pool.map((tile, i) => (
            <button
              key={`pool-${tile}-${i}`}
              onClick={() => addTile(tile, i)}
              disabled={checked}
              className="px-2.5 py-1 rounded-lg text-sm font-medium transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--col-surface-secondary)',
                border: '1px solid var(--col-border)',
                color: 'var(--col-body)',
                minHeight: 36,
                cursor: checked ? 'default' : 'pointer',
                opacity: checked ? 0.5 : 1,
              }}
            >
              {tile}
            </button>
          ))}
          {pool.length === 0 && !checked && (
            <span className="text-xs italic" style={{ color: 'var(--col-muted)' }}>All tiles placed.</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {!checked && built.length > 0 && (
          <button
            onClick={check}
            className="flex items-center gap-2 px-4 rounded-xl text-sm font-semibold text-white"
            style={{ minHeight: 44, backgroundColor: 'var(--col-accent)' }}
          >
            <CheckCircle className="h-4 w-4" /> Check
          </button>
        )}
        {(checked || built.length > 0) && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 rounded-xl text-sm font-medium"
            style={{ minHeight: 44, border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface-secondary)' }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        )}
        {!revealed && (
          <button
            onClick={reveal}
            className="flex items-center gap-2 px-4 rounded-xl text-sm font-medium"
            style={{ minHeight: 44, border: '1px solid var(--col-border)', color: 'var(--col-muted)', backgroundColor: 'transparent' }}
          >
            <Eye className="h-3.5 w-3.5" /> Show Answer
          </button>
        )}
      </div>
    </div>
  );
}