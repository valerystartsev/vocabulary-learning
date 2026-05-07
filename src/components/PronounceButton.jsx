import React, { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';

/**
 * Reusable pronunciation button.
 * If `audioUrl` prop is provided → plays MP3 file from public/audio/.
 * If file fails or audioUrl not given → falls back to Web Speech API (TTS).
 *
 * Props:
 *   term      — the word/phrase (used for TTS fallback and aria-label)
 *   audioUrl  — optional path like "/audio/overheads.mp3"
 *   size      — 'sm' (default) | 'xs'
 *   className — extra tailwind classes
 */
export default function PronounceButton({ term, audioUrl, size = 'sm', className = '' }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback((e) => {
    e.stopPropagation();
    if (!term) return;

    // ── Priority 1: MP3 file ───────────────────────────────────────────────
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onplay  = () => setPlaying(true);
      audio.onended = () => setPlaying(false);
      audio.onerror = () => {
        setPlaying(false);
        speakTTS(term, setPlaying); // fallback if file not found
      };
      audio.play().catch(() => speakTTS(term, setPlaying));
      return;
    }

    // ── Priority 2: Browser TTS ────────────────────────────────────────────
    speakTTS(term, setPlaying);
  }, [term, audioUrl]);

  const dim      = size === 'xs' ? 24 : 28;
  const iconSize = size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5';

  return (
    <button
      onClick={handlePlay}
      title={`Pronounce "${term}"`}
      aria-label={`Pronounce ${term}`}
      className={`flex items-center justify-center rounded-lg shrink-0 transition-all ${className}`}
      style={{
        width: dim, height: dim,
        backgroundColor: playing ? 'var(--col-accent-light)' : 'transparent',
        border: `1px solid ${playing ? 'var(--col-accent)' : 'var(--col-border)'}`,
        color: playing ? 'var(--col-accent)' : 'var(--col-muted)',
      }}
    >
      <Volume2 className={`${iconSize} ${playing ? 'animate-pulse' : ''}`} />
    </button>
  );
}

function speakTTS(term, setPlaying) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt      = new SpeechSynthesisUtterance(term);
  utt.lang       = 'en-GB';
  utt.rate       = 0.88;
  const voices   = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));
  if (preferred) utt.voice = preferred;
  utt.onstart = () => setPlaying(true);
  utt.onend   = () => setPlaying(false);
  utt.onerror = () => setPlaying(false);
  window.speechSynthesis.speak(utt);
}