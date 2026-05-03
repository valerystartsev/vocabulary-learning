import React, { useState, useRef, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  Video, Headphones, FileText, CheckCircle, ExternalLink,
  ChevronDown, ChevronUp, AlertTriangle, BookOpen, Info
} from 'lucide-react';
import SentenceBuilder from '../exercises/SentenceBuilder';

/* ─── Constants ─────────────────────────────────────────────── */
const TYPE_META = {
  video:   { icon: Video,      label: 'Video',   color: '#3B6EA5', bg: '#EEF4FB' },
  podcast: { icon: Headphones, label: 'Podcast', color: '#5E9E89', bg: '#E5F0EC' },
  audio:   { icon: Headphones, label: 'Audio',   color: '#5E9E89', bg: '#E5F0EC' },
  article: { icon: FileText,   label: 'Article', color: '#7A6A2E', bg: '#F5F0E4' },
};

/* ─── EmbedPlayer — handles error gracefully ─────────────────── */
function EmbedPlayer({ embedId, title, url }) {
  const [failed, setFailed] = useState(false);
  const timerRef = useRef(null);

  // If the iframe fires an error or stays blank, detect via a timeout
  useEffect(() => {
    setFailed(false);
    // Reset on new embedId
    return () => clearTimeout(timerRef.current);
  }, [embedId]);

  if (failed) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl text-center"
        style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', minHeight: 160 }}
      >
        <AlertTriangle className="h-7 w-7" style={{ color: 'var(--col-warning)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--col-heading)' }}>
          Embedded playback unavailable
        </p>
        <p className="text-xs" style={{ color: 'var(--col-secondary)' }}>
          The video cannot be played here. Open it directly on YouTube — the activity continues below.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: '#C00', minHeight: 44 }}
        >
          <ExternalLink className="h-4 w-4" /> Watch on YouTube ↗
        </a>
      </div>
    );
  }

  return (
    <div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ position: 'relative', paddingBottom: '56.25%', height: 0, border: '1px solid var(--col-border)' }}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${embedId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setFailed(true)}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 mt-2 text-xs py-1.5 rounded-lg"
          style={{ color: 'var(--col-muted)', border: '1px solid var(--col-border)' }}
        >
          <ExternalLink className="h-3 w-3" /> Can't see the video? Open on YouTube ↗
        </a>
      )}
    </div>
  );
}

/* ─── Stage 1: Before ───────────────────────────────────────── */
function BeforeStage({ item, onReady }) {
  const [answers, setAnswers] = useState({});
  const preds = item.predictionTask || [
    { type: 'open', q: `What do you think this ${item.type} is about? Write your prediction.` },
    { type: 'wordCheck', q: 'Which words do you expect to encounter? Select all that apply.', options: item.vocabToListen },
  ];

  return (
    <div className="space-y-4">
      {/* Why it helps + teacher guidance */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--col-muted)' }}>
          Why this helps
        </p>
        <p className="text-sm" style={{ color: 'var(--col-body)' }}>{item.whyHelps}</p>
        {item.teacherGuidance && (
          <div className="flex items-start gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid var(--col-border)' }}>
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <p className="text-xs italic" style={{ color: 'var(--col-secondary)' }}>{item.teacherGuidance}</p>
          </div>
        )}
        {item.externalNote && (
          <div className="flex items-start gap-1.5 mt-2">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: 'var(--col-muted)' }} />
            <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>{item.externalNote}</p>
          </div>
        )}
      </div>

      {/* Vocabulary chips */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>
          {item.type === 'article' ? 'Vocabulary to read for' : 'Vocabulary to listen for'}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {item.vocabToListen.map(w => (
            <span
              key={w}
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', border: '1px solid var(--col-divider)' }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Prediction tasks */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>
          Prepare — answer before you start
        </p>
        <div className="space-y-3">
          {preds.map((p, i) => (
            <div
              key={i}
              className="p-3 rounded-xl"
              style={{ backgroundColor: 'var(--col-dict-bg)', border: '1px solid var(--col-border)' }}
            >
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--col-heading)' }}>{p.q}</p>
              {p.type === 'open' && (
                <textarea
                  className="w-full text-sm rounded-lg px-3 py-2"
                  rows={2}
                  placeholder="Write your answer here..."
                  value={answers[`p${i}`] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [`p${i}`]: e.target.value }))}
                  style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)', color: 'var(--col-body)', resize: 'vertical', minHeight: 60, fontSize: 14 }}
                />
              )}
              {p.type === 'sentenceBuilder' && p.tiles && p.answer && (
                <SentenceBuilder
                  prompt={p.q}
                  tiles={p.tiles}
                  answer={p.answer}
                />
              )}
              {p.type === 'wordCheck' && (
                <div className="flex flex-wrap gap-2">
                  {(p.options || item.vocabToListen).map(w => {
                    const sel = answers[`p${i}_${w}`];
                    return (
                      <button
                        key={w}
                        onClick={() => setAnswers(a => ({ ...a, [`p${i}_${w}`]: !a[`p${i}_${w}`] }))}
                        className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
                        style={{
                          minHeight: 36,
                          border: sel ? '1.5px solid var(--col-accent)' : '1px solid var(--col-border)',
                          backgroundColor: sel ? 'var(--col-accent-light)' : 'var(--col-surface)',
                          color: sel ? 'var(--col-accent-text)' : 'var(--col-secondary)',
                        }}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ready button */}
      <button
        onClick={onReady}
        className="w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ minHeight: 52, backgroundColor: 'var(--col-accent)' }}
      >
        Ready — Open the {TYPE_META[item.type]?.label || 'Media'} →
      </button>
    </div>
  );
}

/* ─── Stage 2: During ───────────────────────────────────────── */
function DuringStage({ item, onFinished }) {
  const [ticked, setTicked] = useState({});
  const tickedCount = Object.values(ticked).filter(Boolean).length;

  const toggle = (w) => setTicked(t => ({ ...t, [w]: !t[w] }));

  return (
    <div className="space-y-4">
      {/* Media access */}
      {item.type === 'video' && item.localSrc ? (
        <video
          controls
          controlsList="nodownload"
          style={{ width: '100%', borderRadius: '12px', display: 'block', backgroundColor: '#000' }}
          src={item.localSrc}
        >
          Ваш браузер не поддерживает видео.
        </video>
      ) : item.type === 'video' && item.embedId ? (
        <EmbedPlayer embedId={item.embedId} title={item.title} url={item.url} />
      ) : item.type === 'audio' || item.audioFile ? (
        <div
          className="p-4 rounded-xl text-center"
          style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
        >
          <Headphones className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--col-accent)' }} />
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--col-heading)' }}>Audio Lesson</p>
          <p className="text-xs mb-3" style={{ color: 'var(--col-secondary)' }}>
            {item.externalNote || 'Play the uploaded audio file for this lesson.'}
          </p>
          {item.url ? (
            <audio controls className="w-full" style={{ marginTop: 4 }}>
              <source src={item.url} />
              Your browser does not support audio playback.
            </audio>
          ) : (
            <div
              className="px-4 py-3 rounded-xl text-xs"
              style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', border: '1px solid var(--col-divider)' }}
            >
              Use the audio player provided by your teacher, or ask for the audio file link.
            </div>
          )}
        </div>
      ) : (
        <div
          className="p-4 rounded-xl"
          style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
        >
          {item.externalNote && (
            <p className="text-xs mb-3 italic" style={{ color: 'var(--col-secondary)' }}>{item.externalNote}</p>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl text-sm font-semibold text-white transition-all"
              style={{ minHeight: 52, backgroundColor: item.type === 'podcast' ? 'var(--col-accent)' : '#7A6A2E' }}
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              Open {TYPE_META[item.type]?.label || 'Media'} — external ↗
            </a>
          )}
          {item.type === 'article' && (
            <p className="text-xs text-center mt-2" style={{ color: 'var(--col-muted)' }}>
              Opens on an external website. Follow the reading focus instructions below.
            </p>
          )}
        </div>
      )}

      {/* Focus reminder */}
      {item.task && (
        <div
          className="flex items-start gap-2 px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
        >
          <BookOpen className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--col-accent)' }} />
          <p className="text-xs" style={{ color: 'var(--col-accent-text)' }}>
            <strong>Focus task:</strong> {item.task}
          </p>
        </div>
      )}

      {/* Vocabulary checklist */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
            Vocabulary spotter — tick each word as you hear / see it
          </p>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-secondary)', border: '1px solid var(--col-border)' }}>
            {tickedCount}/{item.vocabToListen.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {item.vocabToListen.map(w => (
            <button
              key={w}
              onClick={() => toggle(w)}
              className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium text-left transition-all"
              style={{
                minHeight: 48,
                border: ticked[w] ? '1.5px solid var(--col-correct)' : '1px solid var(--col-border)',
                backgroundColor: ticked[w] ? '#F0FAF5' : 'var(--col-surface)',
                color: ticked[w] ? '#1F5E3A' : 'var(--col-body)',
              }}
            >
              <span
                className="shrink-0 flex items-center justify-center rounded-md"
                style={{ width: 20, height: 20, border: ticked[w] ? 'none' : '1.5px solid var(--col-border)', backgroundColor: ticked[w] ? 'var(--col-correct)' : 'transparent' }}
              >
                {ticked[w] && <CheckCircle className="h-4 w-4 text-white" style={{ strokeWidth: 2.5 }} />}
              </span>
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Done button */}
      <button
        onClick={() => onFinished(tickedCount)}
        className="w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all"
        style={{ minHeight: 52, backgroundColor: 'var(--col-surface-secondary)', border: '2px solid var(--col-accent)', color: 'var(--col-accent-text)' }}
      >
        I finished — Go to Check Understanding →
      </button>
    </div>
  );
}

/* ─── Stage 3: After ────────────────────────────────────────── */
function AfterStage({ item, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  const quiz = item.postQuiz || [
    {
      type: 'trueFalse',
      q: `This ${item.type} is about: ${item.description?.slice(0, 60)}...`,
      answer: true,
      explanation: item.description || ''
    },
    {
      type: 'open',
      q: `Use 2 words from the ${item.type} in one sentence about work or business.`,
      hint: `Try: ${item.vocabToListen.slice(0, 2).join(' or ')}`
    }
  ];

  const check = () => {
    let correct = 0, total = 0;
    quiz.forEach((q, i) => {
      if (q.type === 'open' || q.type === 'sentenceBuilder' || !q.answer) return;
      total++;
      if (String(answers[i]) === String(q.answer)) correct++;
    });
    const score = total > 0 ? Math.round((correct / total) * 100) : 100;
    setResults({ correct, total, score });
    setSubmitted(true);
    onComplete(score);
  };

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--col-muted)' }}>
        Check Understanding
      </p>

      {quiz.map((q, i) => {
        if (q.type === 'sentenceBuilder' && q.tiles && q.answer) {
          return (
            <div key={i}>
              <SentenceBuilder prompt={q.q} tiles={q.tiles} answer={q.answer} />
            </div>
          );
        }
        const isObjQ = q.type !== 'open';
        const isCorrect = submitted && isObjQ && String(answers[i]) === String(q.answer);
        const isWrong = submitted && isObjQ && String(answers[i]) !== String(q.answer) && answers[i] !== undefined;
        return (
          <div
            key={i}
            className="p-4 rounded-xl"
            style={{
              border: isCorrect ? '1.5px solid var(--col-correct)' : isWrong ? '1.5px solid var(--col-incorrect)' : '1px solid var(--col-border)',
              backgroundColor: isCorrect ? '#F0FAF5' : isWrong ? '#FEF2F2' : 'var(--col-surface)',
            }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--col-heading)' }}>
              {i + 1}. {q.q}
            </p>

            {q.type === 'trueFalse' && (
              <div className="flex gap-2">
                {[true, false].map(v => {
                  const selected = answers[i] === v;
                  const isThisCorrect = submitted && v === q.answer;
                  const isThisWrong = submitted && selected && v !== q.answer;
                  return (
                    <button
                      key={String(v)}
                      disabled={submitted}
                      onClick={() => setAnswers(a => ({ ...a, [i]: v }))}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        minHeight: 48,
                        border: isThisCorrect ? '2px solid var(--col-correct)' : isThisWrong ? '2px solid var(--col-incorrect)' : selected ? '2px solid var(--col-accent)' : '1px solid var(--col-border)',
                        backgroundColor: isThisCorrect ? '#F0FAF5' : isThisWrong ? '#FEF2F2' : selected ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                        color: isThisCorrect ? '#1F5E3A' : isThisWrong ? 'var(--col-incorrect)' : selected ? 'var(--col-accent-text)' : 'var(--col-secondary)',
                      }}
                    >
                      {v ? 'True' : 'False'}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'choice' && (
              <div className="space-y-2">
                {q.options.map(opt => {
                  const selected = answers[i] === opt;
                  const isThisCorrect = submitted && opt === q.answer;
                  const isThisWrong = submitted && selected && opt !== q.answer;
                  return (
                    <button
                      key={opt}
                      disabled={submitted}
                      onClick={() => setAnswers(a => ({ ...a, [i]: opt }))}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                      style={{
                        minHeight: 48,
                        border: isThisCorrect ? '2px solid var(--col-correct)' : isThisWrong ? '2px solid var(--col-incorrect)' : selected ? '2px solid var(--col-accent)' : '1px solid var(--col-border)',
                        backgroundColor: isThisCorrect ? '#F0FAF5' : isThisWrong ? '#FEF2F2' : selected ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                        color: isThisCorrect ? '#1F5E3A' : isThisWrong ? 'var(--col-incorrect)' : selected ? 'var(--col-accent-text)' : 'var(--col-body)',
                        fontWeight: selected || isThisCorrect ? 600 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'open' && (
              <div>
                {q.hint && (
                  <p className="text-xs italic mb-2" style={{ color: 'var(--col-muted)' }}>Hint: {q.hint}</p>
                )}
                <textarea
                  className="w-full text-sm rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Write your answer here..."
                  value={answers[i] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                  disabled={submitted}
                  style={{
                    border: '1px solid var(--col-border)',
                    backgroundColor: submitted ? 'var(--col-surface-secondary)' : 'var(--col-surface)',
                    color: 'var(--col-body)',
                    resize: 'vertical',
                    minHeight: 72,
                    fontSize: 14,
                  }}
                />
                {submitted && (
                  <p className="text-xs mt-1 px-2 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)' }}>
                    Written answer recorded.
                  </p>
                )}
              </div>
            )}
            {submitted && q.explanation && isObjQ && (
              <p
                className="text-xs mt-2.5 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: isCorrect ? '#E8F5EE' : '#FEF2F2',
                  color: isCorrect ? '#1F5E3A' : '#7F2020',
                  borderLeft: `3px solid ${isCorrect ? 'var(--col-correct)' : 'var(--col-incorrect)'}`,
                }}
              >
                {isCorrect ? '✓ Correct. ' : `✗ Answer: ${q.answer === true ? 'True' : q.answer === false ? 'False' : q.answer}. `}
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={check}
          className="w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ minHeight: 52, backgroundColor: 'var(--col-accent)' }}
        >
          Check My Answers
        </button>
      ) : (
        <div
          className="p-4 rounded-xl text-center"
          style={{
            backgroundColor: results.score >= 70 ? '#F0FAF5' : '#FFF8E7',
            border: `1.5px solid ${results.score >= 70 ? 'var(--col-correct)' : 'var(--col-warning)'}`,
          }}
        >
          <CheckCircle className="h-7 w-7 mx-auto mb-2" style={{ color: results.score >= 70 ? 'var(--col-correct)' : 'var(--col-warning)' }} />
          <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
            {results.total > 0
              ? `${results.correct}/${results.total} correct (${results.score}%)`
              : 'Open task recorded'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--col-secondary)' }}>
            {results.score >= 70 ? 'Good understanding. Progress updated.' : 'Review the vocabulary and try again later if needed.'}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Main MediaLab component ───────────────────────────────── */
export default function MediaLab({ media, unitId }) {
  const { progress, markMediaComplete, markSectionComplete } = useProgress();
  const [expandedIdx, setExpandedIdx] = useState(null);
  // stage: 'before' | 'during' | 'after' | 'done'
  const [stages, setStages] = useState({});

  if (!media || media.length === 0) return null;

  const getStage = (idx) => stages[idx] || 'before';
  const setStage = (idx, s) => setStages(st => ({ ...st, [idx]: s }));

  // Use stable mediaId from item data, fallback to title-slug for legacy items
  const stableId = (item, idx) =>
    item.mediaId || `${unitId}_media_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}`;
  const isComplete = (item, idx) => progress.completedMedia?.includes(stableId(item, idx));

  // Check if all required items are complete
  const handleComplete = (item, idx, score) => {
    markMediaComplete(stableId(item, idx), score);
    setStage(idx, 'done');
    const allDone = media.every((m, i) => i === idx || isComplete(m, i));
    if (allDone) markSectionComplete?.(unitId, 'media');
  };

  const STAGE_LABELS = { before: '1. Before', during: '2. During', after: '3. After' };

  return (
    <div className="mb-8 space-y-4">
      {media.map((item, idx) => {
        const meta = TYPE_META[item.type] || TYPE_META.article;
        const Icon = meta.icon;
        const done = isComplete(item, idx);
        const stage = getStage(idx);
        const expanded = expandedIdx === idx;

        return (
          <div
            key={idx}
            className="rounded-2xl overflow-hidden transition-all"
            style={{
              backgroundColor: 'var(--col-surface)',
              border: done ? '1.5px solid var(--col-correct)' : '1px solid var(--col-border)',
            }}
          >
            {/* Card header */}
            <button
              onClick={() => setExpandedIdx(expanded ? null : idx)}
              className="w-full p-4 flex items-start gap-3 text-left"
              style={{ minHeight: 72 }}
            >
              {/* Icon */}
              <div
                className="shrink-0 flex items-center justify-center rounded-xl mt-0.5"
                style={{ width: 40, height: 40, backgroundColor: done ? '#E5F5EC' : meta.bg }}
              >
                <Icon className="h-5 w-5" style={{ color: done ? 'var(--col-correct)' : meta.color }} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>{item.title}</h3>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  {item.source && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-muted)', border: '1px solid var(--col-border)' }}>
                      {item.source}
                    </span>
                  )}
                  {item.duration && (
                    <span className="text-[10px]" style={{ color: 'var(--col-muted)' }}>{item.duration}</span>
                  )}
                  {done && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E5F5EC', color: '#1F6035' }}>
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--col-secondary)' }}>{item.description}</p>
              </div>

              {/* Expand icon */}
              <div className="shrink-0 mt-1" style={{ color: 'var(--col-muted)' }}>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>

            {/* Expanded content */}
            {expanded && (
              <div className="px-4 pb-5 pt-0" style={{ borderTop: '1px solid var(--col-border)' }}>
                {/* Stage tabs */}
                {stage !== 'done' && (
                  <div
                    className="flex gap-1 my-4 p-1 rounded-xl"
                    style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
                  >
                    {['before', 'during', 'after'].map((s) => {
                      const isActive = stage === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setStage(idx, s)}
                          className="flex-1 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            minHeight: 44,
                            backgroundColor: isActive ? 'var(--col-surface)' : 'transparent',
                            color: isActive ? 'var(--col-heading)' : 'var(--col-muted)',
                            boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            border: isActive ? '1px solid var(--col-border)' : 'none',
                          }}
                        >
                          {STAGE_LABELS[s]}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Stage content */}
                {stage === 'before' && (
                  <BeforeStage item={item} onReady={() => setStage(idx, 'during')} />
                )}
                {stage === 'during' && (
                  <DuringStage item={item} onFinished={(count) => setStage(idx, 'after')} />
                )}
                {stage === 'after' && (
                  <AfterStage item={item} onComplete={(score) => handleComplete(item, idx, score)} />
                )}
                {stage === 'done' && (
                  <div
                    className="p-5 rounded-xl text-center mt-4"
                    style={{ backgroundColor: '#F0FAF5', border: '1.5px solid var(--col-correct)' }}
                  >
                    <CheckCircle className="h-10 w-10 mx-auto mb-2.5" style={{ color: 'var(--col-correct)' }} />
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--col-heading)' }}>
                      {item.title} — completed
                    </p>
                    <p className="text-xs" style={{ color: 'var(--col-secondary)' }}>
                      All 3 stages finished. Progress recorded.
                    </p>
                    <button
                      onClick={() => setStage(idx, 'before')}
                      className="mt-4 text-xs px-4 py-2 rounded-xl transition-all"
                      style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface)' }}
                    >
                      Review again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}