import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ShieldCheck,
} from 'lucide-react';

// Translate Supabase auth errors → bilingual messages users can act on.
// Mirrors LoginPage.translateAuthError, kept local so the two pages stay
// independent (no shared utility module yet).
function translateAuthError(rawMsg) {
  if (!rawMsg) return { en: 'Something went wrong. Please try again.', ru: 'Что-то пошло не так. Попробуйте ещё раз.' };
  const m = rawMsg.toLowerCase();
  if (m.includes('password should be at least')) return { en: 'Password must be at least 6 characters long.', ru: 'Пароль должен быть не менее 6 символов.' };
  if (m.includes('same as the old'))             return { en: 'New password must be different from the old one.', ru: 'Новый пароль должен отличаться от старого.' };
  if (m.includes('jwt') || m.includes('token'))  return { en: 'This reset link has expired. Request a new one.',  ru: 'Ссылка для сброса устарела. Запросите новую.' };
  return { en: rawMsg, ru: rawMsg };
}

/**
 * /update-password — landing page for the Supabase password-recovery link.
 *
 * Flow:
 *   1. User clicks "Forgot password?" on /login, gets an email.
 *   2. Email link points here with a recovery hash in the URL.
 *   3. Supabase fires the PASSWORD_RECOVERY auth event automatically;
 *      we listen via onAuthStateChange and unlock the form.
 *   4. User enters new password (+ confirmation) → supabase.auth.updateUser.
 *   5. On success → redirect to /dashboard (the user is already signed in
 *      thanks to the recovery session).
 *
 * If you reach this page WITHOUT a recovery hash (e.g. typing the URL
 * directly) you see an informational state with a link back to /login.
 */
export default function UpdatePassword() {
  const navigate = useNavigate();

  // 'checking' (initial) → 'ready' (recovery link confirmed) →
  // 'invalid' (no recovery hash, page opened directly) →
  // 'success' (password updated)
  const [state, setState] = useState('checking');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPwd, setShowPwd]   = useState(false);

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null); // { en, ru }

  useEffect(() => {
    let mounted = true;

    // SECURITY GATE — only treat this as a recovery flow if the URL has the
    // expected Supabase recovery markers. Without this check, any logged-in
    // user who navigates directly to /update-password could change their
    // password without re-authenticating, bypassing the "change password"
    // flow in Profile (which requires the current password).
    const hash = typeof window !== 'undefined' ? window.location.hash || '' : '';
    const looksLikeRecovery = /type=recovery/.test(hash) || /access_token=/.test(hash);

    if (!looksLikeRecovery) {
      setState('invalid');
      return;
    }

    // Listen for the recovery event Supabase fires after parsing the hash.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setState((s) => (s === 'checking' ? 'ready' : s));
      }
    });

    // Fallback: Supabase may have already consumed the hash before the
    // listener attached. Since the URL did contain recovery markers, allow
    // the form after a short delay.
    const timeout = setTimeout(() => {
      if (!mounted) return;
      setState((s) => (s === 'checking' ? 'ready' : s));
    }, 1500);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Convenience flags so the JSX below stays readable.
  const readyChecked = state !== 'checking';
  const hasRecoverySession = state === 'ready' || state === 'success';
  const success = state === 'success';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError({ en: 'Password must be at least 6 characters long.', ru: 'Пароль должен быть не менее 6 символов.' });
      return;
    }
    if (password !== confirm) {
      setError({ en: 'Passwords do not match.', ru: 'Пароли не совпадают.' });
      return;
    }

    setLoading(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) {
        setError(translateAuthError(updateErr.message));
        return;
      }
      setState('success');
      // Brief pause so the user sees the success state, then go home.
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(translateAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--col-page-bg)' }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{
            backgroundColor: 'var(--col-surface)',
            border: '1px solid var(--col-border)',
            boxShadow: '0 4px 24px rgba(26,40,40,0.06)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: 44, height: 44, backgroundColor: 'var(--col-accent)' }}
            >
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight" style={{ color: 'var(--col-heading)' }}>
                Set a new password
              </h1>
              <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
                Установите новый пароль
              </p>
            </div>
          </div>

          {/* Three states: checking → form (if recovery) / invalid link / success */}
          {!readyChecked ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--col-accent)' }} />
            </div>
          ) : success ? (
            <SuccessState />
          ) : !hasRecoverySession ? (
            <InvalidLinkState onBack={() => navigate('/login')} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <p className="text-xs leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
                Choose a strong password you'll remember. Minimum 6 characters.
                <br />
                <span className="italic" style={{ color: 'var(--col-muted)' }}>
                  Выберите надёжный пароль, который запомните. Минимум 6 символов.
                </span>
              </p>

              {/* New password */}
              <PasswordField
                label="New password"
                labelRu="Новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                show={showPwd}
                onToggleShow={() => setShowPwd((v) => !v)}
                autoComplete="new-password"
              />

              {/* Confirm */}
              <PasswordField
                label="Confirm new password"
                labelRu="Повторите пароль"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                show={showPwd}
                hideToggle
                autoComplete="new-password"
              />

              {/* Error banner */}
              {error && (
                <div
                  className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                  style={{ backgroundColor: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.3)' }}
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--col-incorrect)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--col-incorrect)' }}>{error.en}</p>
                    <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-incorrect)', opacity: 0.85 }}>{error.ru}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{
                  backgroundColor: 'var(--col-accent)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  minHeight: 48,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save new password · Сохранить'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function PasswordField({ label, labelRu, value, onChange, show, onToggleShow, hideToggle, autoComplete }) {
  return (
    <div>
      <label className="flex items-baseline gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--col-muted)' }}>
          <Lock className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
          {label}
        </span>
        <span className="text-[10px] italic" style={{ color: 'var(--col-muted)' }}>· {labelRu}</span>
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required
          minLength={6}
          autoComplete={autoComplete}
          className="w-full px-4 py-2.5 rounded-xl text-sm pr-10"
          style={{
            backgroundColor: 'var(--col-surface-secondary)',
            border: '1px solid var(--col-border)',
            color: 'var(--col-body)',
            outline: 'none',
            minHeight: 44,
          }}
        />
        {!hideToggle && (
          <button
            type="button"
            onClick={onToggleShow}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
            style={{ color: 'var(--col-muted)' }}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="text-center py-6">
      <div
        className="inline-flex items-center justify-center rounded-full mb-3"
        style={{ width: 56, height: 56, backgroundColor: 'var(--col-accent-light)' }}
      >
        <CheckCircle className="h-7 w-7" style={{ color: 'var(--col-accent)' }} />
      </div>
      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--col-heading)' }}>
        Password updated!
      </p>
      <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
        Пароль обновлён. Перенаправляем вас…
      </p>
    </div>
  );
}

function InvalidLinkState({ onBack }) {
  return (
    <div className="text-center py-4">
      <div
        className="inline-flex items-center justify-center rounded-full mb-3"
        style={{ width: 56, height: 56, backgroundColor: 'rgba(229,115,115,0.1)' }}
      >
        <AlertCircle className="h-7 w-7" style={{ color: 'var(--col-incorrect)' }} />
      </div>
      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--col-heading)' }}>
        Invalid or expired link
      </p>
      <p className="text-xs italic mb-4" style={{ color: 'var(--col-muted)' }}>
        Ссылка устарела или некорректна
      </p>
      <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--col-secondary)' }}>
        This page can only be opened from a fresh password-reset email.
        <br />
        <span className="italic" style={{ color: 'var(--col-muted)' }}>
          Эту страницу можно открыть только по свежей ссылке из письма для сброса пароля.
        </span>
      </p>
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ backgroundColor: 'var(--col-accent)', minHeight: 44 }}
      >
        Back to sign in · Вернуться ко входу
      </button>
    </div>
  );
}
