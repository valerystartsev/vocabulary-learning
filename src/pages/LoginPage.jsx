import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, Mail, Lock, User, CheckCircle, AlertCircle, Loader2, ArrowLeft,
} from 'lucide-react';

// Translate raw Supabase auth errors into bilingual messages users can act on.
// Falls back to the original error.message if no mapping is known.
function translateAuthError(rawMsg) {
  if (!rawMsg) return { en: 'Something went wrong. Please try again.', ru: 'Что-то пошло не так. Попробуйте ещё раз.' };
  const m = rawMsg.toLowerCase();
  if (m.includes('invalid login credentials'))           return { en: 'Wrong email or password.',                       ru: 'Неверный email или пароль.' };
  if (m.includes('user already registered'))             return { en: 'This email is already registered. Try logging in instead.', ru: 'Этот email уже зарегистрирован. Попробуйте войти.' };
  if (m.includes('password should be at least'))         return { en: 'Password must be at least 6 characters long.', ru: 'Пароль должен быть не менее 6 символов.' };
  if (m.includes('unable to validate email'))            return { en: 'That email address looks invalid.',              ru: 'Этот email выглядит некорректным.' };
  if (m.includes('email rate limit'))                    return { en: 'Too many attempts. Please wait a minute and try again.', ru: 'Слишком много попыток. Подождите минуту и попробуйте снова.' };
  if (m.includes('email not confirmed'))                 return { en: 'Please confirm your email first — check your inbox.', ru: 'Подтвердите email из письма в почте.' };
  // Unknown — surface the original so we can diagnose
  return { en: rawMsg, ru: rawMsg };
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isFinUni, setIsFinUni] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);     // { en, ru } or null
  const [message, setMessage] = useState(null); // { en, ru } or null

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'forgot') {
        // Trigger Supabase recovery email. The link in the email lands on
        // /update-password and arrives with a recovery hash, which the
        // UpdatePassword page picks up via onAuthStateChange.
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (resetErr) {
          setError(translateAuthError(resetErr.message));
          return;
        }
        setMessage({
          en: 'Check your email for a password reset link.',
          ru: 'Проверьте почту — мы отправили ссылку для сброса пароля.',
        });
        // Stay on the page so the user can read the message
        return;
      }

      if (mode === 'register') {
        const trimmedName = fullName.trim();
        // Create the auth user. Pass display data in user_metadata — the
        // `handle_new_user` DB trigger reads from raw_user_meta_data and
        // writes both full_name and university_tracking into the profiles
        // row. We deliberately do NOT do a client-side upsert here:
        //   - if email-confirm is on, there's no session yet, so the call
        //     would run as anon and be blocked by RLS;
        //   - even with a session, the new RLS policy blocks changes to
        //     university_tracking, so a "no-op" upsert errors out.
        // The trigger runs as SECURITY DEFINER and bypasses RLS, so it's
        // the right place for the initial row write.
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: trimmedName || null,
              university_tracking: isFinUni,
            },
          },
        });

        if (signUpErr) {
          setError(translateAuthError(signUpErr.message));
          return;
        }

        // Route based on whether email confirmation is required.
        if (data?.session) {
          navigate('/dashboard');
        } else {
          setMessage({
            en: 'Account created. Check your email to confirm, then log in.',
            ru: 'Аккаунт создан. Проверьте почту для подтверждения и войдите.',
          });
          setMode('login');
        }
      } else {
        // Login
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          setError(translateAuthError(signInErr.message));
          return;
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(translateAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === 'register';
  const isForgot   = mode === 'forgot';

  // Header text per mode — kept in one place so we don't sprinkle ternaries in JSX.
  const headerEn = isRegister ? 'Create your account' : isForgot ? 'Forgot password?' : 'Welcome back';
  const headerRu = isRegister ? 'Создайте аккаунт'    : isForgot ? 'Забыли пароль?'  : 'Снова в учёбу';

  const submitLabelEn = isRegister ? 'Create account · Зарегистрироваться'
                      : isForgot   ? 'Send reset link · Отправить ссылку'
                                   : 'Sign in · Войти';
  const submitLoading = isRegister ? 'Creating account…'
                      : isForgot   ? 'Sending email…'
                                   : 'Signing in…';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--col-page-bg)' }}>
      <div className="w-full max-w-md">

        {/* Back to landing */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-5 px-3 py-2 rounded-lg transition-colors"
          style={{
            color: 'var(--col-muted)',
            border: '1px solid var(--col-border)',
            backgroundColor: 'var(--col-surface)',
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home · На главную
        </Link>

        {/* Card */}
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
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight" style={{ color: 'var(--col-heading)' }}>
                {headerEn}
              </h1>
              <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
                {headerRu}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isForgot && (
              <p className="text-xs leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
                Enter your email and we'll send you a link to set a new password.
                <br />
                <span className="italic" style={{ color: 'var(--col-muted)' }}>
                  Введите email — мы пришлём ссылку для установки нового пароля.
                </span>
              </p>
            )}

            <Field
              icon={<Mail className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />}
              label="Email"
              labelRu="Электронная почта"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            {!isForgot && (
              <Field
                icon={<Lock className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />}
                label="Password"
                labelRu="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'At least 6 characters' : ''}
                minLength={isRegister ? 6 : undefined}
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            )}

            {/* Login-mode-only: forgot password link */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs font-medium"
                  style={{ color: 'var(--col-accent)' }}
                >
                  Forgot password? · Забыли пароль?
                </button>
              </div>
            )}

            {/* Register-only fields */}
            {isRegister && (
              <>
                <Field
                  icon={<User className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />}
                  label="Full name (optional)"
                  labelRu="Имя и фамилия (необязательно)"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Anna Ivanova / Анна Иванова"
                  autoComplete="name"
                  hint="Visible to your teacher · Видно преподавателю"
                />

                {/* FinUni checkbox */}
                <label className="flex items-start gap-3 cursor-pointer rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: isFinUni ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                    border: `1px solid ${isFinUni ? 'var(--col-accent)' : 'var(--col-border)'}`,
                    transition: 'background-color 0.18s, border-color 0.18s',
                  }}
                >
                  <span className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={isFinUni}
                      onChange={(e) => setIsFinUni(e.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className="flex items-center justify-center rounded transition-colors"
                      style={{
                        width: 18, height: 18,
                        backgroundColor: isFinUni ? 'var(--col-accent)' : 'var(--col-surface)',
                        border: `2px solid ${isFinUni ? 'var(--col-accent)' : 'var(--col-border)'}`,
                      }}
                    >
                      {isFinUni && <CheckCircle className="h-3 w-3 text-white" />}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium" style={{ color: 'var(--col-heading)' }}>
                      I am a Financial University student
                    </span>
                    <span className="block text-xs italic mt-0.5" style={{ color: 'var(--col-secondary)' }}>
                      Я студент Финансового университета
                    </span>
                    <span className="block text-[11px] mt-1.5 leading-relaxed" style={{ color: 'var(--col-muted)' }}>
                      If checked, your teacher can see your progress and exercise results.
                      <br />
                      Если отметить — преподаватель будет видеть ваш прогресс.
                    </span>
                  </span>
                </label>
              </>
            )}

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

            {/* Success message */}
            {message && (
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
              >
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--col-accent)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--col-accent-text)' }}>{message.en}</p>
                  <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-accent-text)', opacity: 0.78 }}>{message.ru}</p>
                </div>
              </div>
            )}

            {/* Submit */}
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
                  {submitLoading}
                </>
              ) : (
                submitLabelEn
              )}
            </button>
          </form>

          {/* Mode switch */}
          <div className="mt-5 pt-5 text-center" style={{ borderTop: '1px solid var(--col-border)' }}>
            {isForgot ? (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-medium"
                style={{ color: 'var(--col-accent)' }}
              >
                ← Back to sign in
                <span style={{ color: 'var(--col-muted)' }}> · Вернуться ко входу</span>
              </button>
            ) : isRegister ? (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-medium"
                style={{ color: 'var(--col-accent)' }}
              >
                Already have an account? <strong>Sign in</strong>
                <span style={{ color: 'var(--col-muted)' }}> · Уже есть аккаунт? <strong>Войдите</strong></span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-xs font-medium"
                style={{ color: 'var(--col-accent)' }}
              >
                No account yet? <strong>Create one</strong>
                <span style={{ color: 'var(--col-muted)' }}> · Нет аккаунта? <strong>Зарегистрироваться</strong></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function Field({ icon, label, labelRu, hint, ...inputProps }) {
  return (
    <div>
      <label className="flex items-baseline gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--col-muted)' }}>
          {icon}
          {label}
        </span>
        <span className="text-[10px] italic" style={{ color: 'var(--col-muted)' }}>· {labelRu}</span>
      </label>
      <input
        {...inputProps}
        className="w-full px-4 py-2.5 rounded-xl text-sm"
        style={{
          backgroundColor: 'var(--col-surface-secondary)',
          border: '1px solid var(--col-border)',
          color: 'var(--col-body)',
          outline: 'none',
          minHeight: 44,
        }}
      />
      {hint && (
        <p className="text-[11px] mt-1 italic" style={{ color: 'var(--col-muted)' }}>{hint}</p>
      )}
    </div>
  );
}
