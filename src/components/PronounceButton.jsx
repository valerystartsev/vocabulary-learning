import React, { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';

/**
 * Reusable pronunciation button. Uses Web Speech API (browser TTS).
 * Prefers en-GB voice; falls back to any English voice.
 * Props:
 *   term   — the word/phrase to pronounce
 *   size   — 'sm' (default) | 'xs'
 *   className — extra tailwind classes
 */
export default function PronounceButton({ term, size = 'sm', className = '' }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback((e) => {
    e.stopPropagation();
    if (!window.speechSynthesis || !term) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(term);
    utt.lang = 'en-GB';
    utt.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utt.voice = preferred;
    utt.onstart = () => setPlaying(true);
    utt.onend = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  }, [term]);

  const dim = size === 'xs' ? 24 : 28;
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