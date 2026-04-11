import React, { useEffect, useRef } from 'react';
import { useMode } from '../context/ModeContext';
import { Lock } from 'lucide-react';

export default function TeacherPinModal() {
  const { pinModalOpen, pinInput, pinError, submitPin, cancelPin, handlePinInput } = useMode();
  const inputRef = useRef(null);

  useEffect(() => {
    if (pinModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [pinModalOpen]);

  if (!pinModalOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitPin();
    if (e.key === 'Escape') cancelPin();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) cancelPin(); }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-xl p-6"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      >
        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2.5 rounded-xl shrink-0"
            style={{ backgroundColor: 'var(--col-accent-light)' }}
          >
            <Lock className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
          </div>
          <div>
            <h2 className="font-semibold text-base" style={{ color: 'var(--col-heading)' }}>
              Teacher Mode Access
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>
              Enter the teacher PIN to view answers.
            </p>
            <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
              Введите PIN-код преподавателя.
            </p>
          </div>
        </div>

        {/* PIN input */}
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={6}
          value={pinInput}
          onChange={(e) => handlePinInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="• • • • • •"
          className="w-full rounded-xl px-4 py-3 text-center text-lg tracking-widest font-mono outline-none transition-all"
          style={{
            backgroundColor: 'var(--col-surface-secondary)',
            border: pinError
              ? '2px solid var(--col-incorrect)'
              : '2px solid var(--col-border)',
            color: 'var(--col-heading)',
            minHeight: 52,
            caretColor: 'var(--col-accent)',
          }}
          onFocus={(e) => {
            if (!pinError) e.target.style.borderColor = 'var(--col-accent)';
          }}
          onBlur={(e) => {
            if (!pinError) e.target.style.borderColor = 'var(--col-border)';
          }}
        />

        {/* Error */}
        {pinError && (
          <p className="mt-2 text-xs text-center font-medium" style={{ color: 'var(--col-incorrect)' }}>
            {pinError}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={cancelPin}
            className="flex-1 rounded-xl font-medium text-sm transition-colors"
            style={{
              minHeight: 44,
              border: '1px solid var(--col-border)',
              color: 'var(--col-secondary)',
              backgroundColor: 'transparent',
            }}
          >
            Cancel
          </button>
          <button
            onClick={submitPin}
            className="flex-1 rounded-xl font-semibold text-sm text-white transition-colors"
            style={{
              minHeight: 44,
              backgroundColor: 'var(--col-accent)',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-accent-hover)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--col-accent)'}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}