import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { units, getAllVocabulary } from '../data/courseData';
import { useProgress } from '../context/ProgressContext';
import {
  Volume2, VolumeX, CheckCircle, XCircle, Lock, Unlock,
  ChevronRight, ChevronLeft, RotateCcw, Headphones, BookOpen, ArrowLeft, Play
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────

function buildClips(unit) {
  // Each clip: a spoken sentence + the exact text the user must type
  const clips = [];
  (unit.vocabulary || []).forEach(word => {
    if (word.example) {
      clips.push({
        id: `${word.id}_example`,
        wordId: word.id,
        term: word.term,
        pos: word.pos,
        translationRu: word.translationRu,
        spoken: word.example,
        target: word.example,
        hint: `Hint: the key word is "${word.term}" (${word.translationRu})`,
      });
    }
  });
  return clips;
}

function speak(text, rate = 0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-GB';
  utt.rate = rate;
  // Try to pick a good British English voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
  return utt;
}

// ── ClipCard ───────────────────────────────────────────────────────────────

function ClipCard({ clip, clipIndex, isUnlocked, isActive, onUnlock, onNext, isLast }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive && inputRef.current) inputRef.current.focus();
    setInput(''); setStatus('idle'); setAttempts(0); setShowHint(false); setShowAnswer(false);
  }, [clip.id, isActive]);

  const handleSpeak = useCallback((rate = 0.85) => {
    setSpeaking(true);
    const utt = speak(clip.spoken, rate);
    if (utt) {
      utt.onend = () => setSpeaking(false);
      utt.onerror = () => setSpeaking(false);
    } else {
      setSpeaking(false);
    }
  }, [clip.spoken]);

  const handleCheck = () => {
    const normalise = s => s.trim().replace(/\s+/g, ' ').replace(/[""'']/g, '"').toLowerCase();
    const correct = normalise(input) === normalise(clip.target);
    setAttempts(a => a + 1);
    if (correct) {
      setStatus('correct');
      onUnlock(clip.id);
    } else {
      setStatus('wrong');
      if (attempts + 1 >= 3) setShowHint(true);
    }
  };

  const handleRetry = () => {
    setInput(''); setStatus('idle'); setShowAnswer(false);
  };

  const locked = !isActive && !isUnlocked;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        backgroundColor: isUnlocked ? '#F0FAF5' : locked ? 'var(--col-surface-secondary)' : 'var(--col-surface)',
        border: `1px solid ${isUnlocked ? '#A8D5BA' : locked ? 'var(--col-border)' : 'var(--col-accent)'}`,
        opacity: locked ? 0.55 : 1,
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-3" style={{ borderBottom: `1px solid ${isUnlocked ? '#A8D5BA30' : 'var(--col-border)'}` }}>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-xl shrink-0 font-bold text-sm"
            style={{
              width: 36, height: 36,
              backgroundColor: isUnlocked ? '#5E9E89' : locked ? 'var(--col-surface)' : 'var(--col-accent-light)',
              border: `1px solid ${isUnlocked ? '#5E9E89' : 'var(--col-border)'}`,
              color: isUnlocked ? 'white' : locked ? 'var(--col-muted)' : 'var(--col-accent-text)',
            }}
          >
            {isUnlocked ? <CheckCircle className="h-4 w-4" /> : locked ? <Lock className="h-4 w-4" /> : clipIndex + 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>{clip.term}</span>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}>{clip.pos}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>{clip.translationRu}</p>
          </div>
        </div>
        {isUnlocked && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full shrink-0" style={{ backgroundColor: '#D0EDD8', color: '#1F6035' }}>
            ✓ Done
          </span>
        )}
      </div>

      {/* Body — only shown when active or unlocked */}
      {(isActive || isUnlocked) && (
        <div className="px-5 py-4 space-y-4">

          {/* Play controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleSpeak(0.85)}
              disabled={speaking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: speaking ? 'var(--col-accent-light)' : 'var(--col-accent)',
                color: speaking ? 'var(--col-accent-text)' : 'white',
                minHeight: 44, border: 'none',
              }}
            >
              <Volume2 className="h-4 w-4" />
              {speaking ? 'Speaking…' : 'Play'}
            </button>
            <button
              onClick={() => handleSpeak(0.6)}
              disabled={speaking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: 'var(--col-surface-secondary)',
                border: '1px solid var(--col-border)',
                color: 'var(--col-secondary)',
                minHeight: 44,
              }}
            >
              <Play className="h-4 w-4" />
              Slow
            </button>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
              {isUnlocked ? 'Replaying for review' : 'Listen carefully, then type exactly what you hear'}
            </p>
          </div>

          {/* Dictation input */}
          {!isUnlocked && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                Type what you hear · Напишите, что вы слышите
              </label>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value); setStatus('idle'); }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (input.trim()) handleCheck(); } }}
                placeholder="Type the sentence here…"
                rows={2}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{
                  border: `2px solid ${status === 'correct' ? 'var(--col-correct)' : status === 'wrong' ? 'var(--col-incorrect)' : 'var(--col-border)'}`,
                  backgroundColor: status === 'correct' ? '#F0FAF5' : status === 'wrong' ? '#FEF2F2' : 'var(--col-surface)',
                  color: 'var(--col-body)',
                  outline: 'none',
                  lineHeight: 1.6,
                }}
                disabled={status === 'correct'}
              />

              {/* Feedback */}
              {status === 'correct' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#D0EDD8', color: '#1F6035' }}>
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Perfect! That's exactly right. Clip unlocked.
                </div>
              )}
              {status === 'wrong' && (
                <div className="flex items-start gap-2 px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: '#FEF2F2', color: '#7F2020' }}>
                  <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Not quite. Listen again and try once more.</p>
                    <p className="text-xs mt-0.5 opacity-80">Check punctuation and capital letters.</p>
                  </div>
                </div>
              )}

              {/* Hint */}
              {showHint && status !== 'correct' && (
                <div className="px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', border: '1px solid var(--col-divider)' }}>
                  💡 {clip.hint}
                </div>
              )}

              {/* Show answer */}
              {attempts >= 5 && !showAnswer && status !== 'correct' && (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)' }}
                >
                  Show answer (give up)
                </button>
              )}
              {showAnswer && (
                <div className="px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: '#FFF8E1', border: '1px solid #E8D08A', color: '#7A5A00' }}>
                  <p className="font-semibold mb-1">Answer:</p>
                  <p className="font-lora italic">"{clip.target}"</p>
                  <button
                    onClick={() => {
                      setInput(clip.target);
                      setShowAnswer(false);
                      onUnlock(clip.id);
                      setStatus('correct');
                    }}
                    className="mt-2 text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ backgroundColor: 'var(--col-accent)', color: 'white' }}
                  >
                    Mark as seen & continue
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {status !== 'correct' && (
                  <>
                    <button
                      onClick={handleCheck}
                      disabled={!input.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ backgroundColor: input.trim() ? 'var(--col-accent)' : 'var(--col-divider)', minHeight: 44 }}
                    >
                      Check
                    </button>
                    {status === 'wrong' && (
                      <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                        style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', minHeight: 44 }}
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Clear
                      </button>
                    )}
                  </>
                )}
                {status === 'correct' && !isLast && (
                  <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: 'var(--col-accent)', minHeight: 44 }}
                  >
                    Next Clip <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                {status === 'correct' && isLast && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#D0EDD8', color: '#1F6035' }}>
                    <CheckCircle className="h-4 w-4" /> All clips complete!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Unlocked review */}
          {isUnlocked && (
            <div className="px-4 py-3 rounded-xl font-lora italic text-sm" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)', color: 'var(--col-accent-text)' }}>
              "{clip.target}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ListeningLab() {
  const { progress } = useProgress();
  const [selectedUnitId, setSelectedUnitId] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(new Set());

  const unit = units.find(u => u.id === selectedUnitId) || units[0];
  const clips = buildClips(unit);

  // Reset state when unit changes
  useEffect(() => {
    setActiveIndex(0);
    setUnlocked(new Set());
    window.speechSynthesis?.cancel();
  }, [selectedUnitId]);

  const handleUnlock = (clipId) => {
    setUnlocked(prev => new Set([...prev, clipId]));
  };

  const handleNext = () => {
    setActiveIndex(i => Math.min(i + 1, clips.length - 1));
  };

  const totalDone = unlocked.size;
  const pct = clips.length > 0 ? Math.round((totalDone / clips.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>

      {/* Header */}
      <div className="mb-7">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm mb-5" style={{ color: 'var(--col-muted)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, backgroundColor: 'var(--col-accent)', flexShrink: 0 }}>
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-2xl" style={{ color: 'var(--col-heading)', letterSpacing: '-0.4px' }}>Listening Lab</h1>
            <p className="text-sm" style={{ color: 'var(--col-muted)' }}>Dictation exercises · Лаборатория аудирования</p>
          </div>
        </div>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--col-secondary)', maxWidth: 560 }}>
          Listen to each sentence and type exactly what you hear — word for word, including punctuation and capital letters.
          Complete all clips to unlock full progress for this unit.
        </p>
        <p className="text-xs mt-1 italic" style={{ color: 'var(--col-muted)' }}>
          Слушайте каждое предложение и напишите его дословно. Завершите все клипы, чтобы разблокировать прогресс.
        </p>
      </div>

      {/* Unit picker */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {units.map(u => (
          <button
            key={u.id}
            onClick={() => setSelectedUnitId(u.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: selectedUnitId === u.id ? 'var(--col-accent)' : 'var(--col-surface)',
              color: selectedUnitId === u.id ? 'white' : 'var(--col-secondary)',
              border: `1px solid ${selectedUnitId === u.id ? 'var(--col-accent)' : 'var(--col-border)'}`,
              minHeight: 44,
            }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Unit {u.id}: {u.title}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {clips.length > 0 && (
        <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>
              Progress — {totalDone} / {clips.length} clips completed
            </p>
            <span className="font-bold text-lg" style={{ color: pct === 100 ? 'var(--col-correct)' : 'var(--col-accent)' }}>{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: pct === 100 ? 'var(--col-correct)' : 'var(--col-accent)' }}
            />
          </div>
          {pct === 100 && (
            <p className="text-sm font-semibold mt-2" style={{ color: 'var(--col-correct)' }}>
              🎉 All dictation clips complete for Unit {selectedUnitId}!
            </p>
          )}
        </div>
      )}

      {/* Clip navigator */}
      {clips.length > 0 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <p className="text-xs font-semibold uppercase tracking-wider mr-1" style={{ color: 'var(--col-muted)' }}>Jump to:</p>
          {clips.map((clip, i) => {
            const done = unlocked.has(clip.id);
            const active = i === activeIndex;
            return (
              <button
                key={clip.id}
                onClick={() => setActiveIndex(i)}
                className="flex items-center justify-center rounded-lg text-xs font-bold transition-all"
                style={{
                  width: 30, height: 30,
                  backgroundColor: done ? '#5E9E89' : active ? 'var(--col-accent-light)' : 'var(--col-surface)',
                  border: `1.5px solid ${done ? '#5E9E89' : active ? 'var(--col-accent)' : 'var(--col-border)'}`,
                  color: done ? 'white' : active ? 'var(--col-accent-text)' : 'var(--col-muted)',
                }}
                title={clip.term}
              >
                {done ? '✓' : i + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* Clips */}
      {clips.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--col-muted)' }}>
          <Headphones className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No audio clips available for this unit yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clips.map((clip, i) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              clipIndex={i}
              isUnlocked={unlocked.has(clip.id)}
              isActive={i === activeIndex && !unlocked.has(clip.id)}
              onUnlock={handleUnlock}
              onNext={handleNext}
              isLast={i === clips.length - 1}
            />
          ))}
        </div>
      )}

      {/* Speech synthesis notice */}
      <div className="mt-8 px-4 py-3 rounded-xl text-xs" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-muted)' }}>
        🔊 Audio is generated using your browser's built-in speech engine (Web Speech API). For best results, use Chrome or Edge with a British English voice selected.
      </div>
    </div>
  );
}