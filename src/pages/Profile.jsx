// src/pages/Profile.jsx

import { supabase } from '../lib/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User, Save, CheckCircle, GraduationCap, Info, Lock,
  ArrowLeft, Sun, Moon, TrendingUp,
  Shield, Eye, EyeOff, AlertCircle, Loader2, KeyRound,
  Mail, Send, MailCheck, Pencil, X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState('');
  // Read-only — sourced from the profiles table (set during registration),
  // not editable here. B1 of the auth refactor.
  const [isFinancialUniversity, setIsFinancialUniversity] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tourReset, setTourReset] = useState(false);

  // ── Change-password state ──────────────────────────────────────────
  // The form is collapsed by default; opens via "Change password" button.
  // Verifies current password through a reauthentication call before
  // calling updateUser — Supabase does NOT check the current password
  // for updateUser by itself.
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdShow, setPwdShow] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState(null);   // { en, ru }
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // ── Change-email state (B3 hybrid) ─────────────────────────────────
  // Email is editable via supabase.auth.updateUser({ email }). Supabase
  // sends confirmation links to BOTH the old and the new mailbox; the
  // change only applies after both are clicked. We surface this pending
  // state so the user knows nothing is broken if it doesn't take effect
  // immediately.
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailNew, setEmailNew] = useState('');
  const [emailPwd, setEmailPwd] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);   // { en, ru }
  const [emailPending, setEmailPending] = useState(null); // string (new email) or null

  // Pull the canonical profile row from Supabase on mount.
  // Previously this component read from user.displayName / user.isFinancialUniversity
  // — but AuthContext stores the raw auth.users object, which has neither field.
  // The form fields were always empty / unchecked as a result.
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, full_name, university_tracking')
          .eq('id', user.id)
          .single();
        if (cancelled) return;
        if (error) {
          // No profile row yet (legacy account before B1). Fall back to user_metadata.
          const meta = user.user_metadata || {};
          setDisplayName(meta.full_name || '');
          setIsFinancialUniversity(!!meta.university_tracking);
        } else {
          setDisplayName(data.display_name || data.full_name || '');
          setIsFinancialUniversity(!!data.university_tracking);
        }
        setProfileLoaded(true);
      } catch {
        if (!cancelled) setProfileLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleRestartTour = () => {
    localStorage.removeItem('adaptation_onboarding_done');
    setTourReset(true);
    setTimeout(() => setTourReset(false), 3000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'var(--col-divider)', borderTopColor: 'var(--col-accent)' }} />
      </div>
    );
  }

  // Translate raw Supabase auth errors → bilingual messages.
  // Kept inline so the file is self-contained.
  const translatePwdError = (rawMsg) => {
    if (!rawMsg) return { en: 'Something went wrong. Please try again.', ru: 'Что-то пошло не так. Попробуйте ещё раз.' };
    const m = rawMsg.toLowerCase();
    if (m.includes('invalid login credentials'))    return { en: 'Current password is incorrect.', ru: 'Текущий пароль неверный.' };
    if (m.includes('password should be at least'))  return { en: 'New password must be at least 6 characters.', ru: 'Новый пароль должен быть не менее 6 символов.' };
    if (m.includes('same as the old'))              return { en: 'New password must differ from the current one.', ru: 'Новый пароль должен отличаться от текущего.' };
    if (m.includes('rate limit'))                   return { en: 'Too many attempts. Please wait a minute.', ru: 'Слишком много попыток. Подождите минуту.' };
    return { en: rawMsg, ru: rawMsg };
  };

  const closePasswordForm = () => {
    setPwdOpen(false);
    setPwdCurrent('');
    setPwdNew('');
    setPwdConfirm('');
    setPwdShow(false);
    setPwdError(null);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError(null);

    // Local validation
    if (pwdNew.length < 6) {
      setPwdError({ en: 'New password must be at least 6 characters.', ru: 'Новый пароль должен быть не менее 6 символов.' });
      return;
    }
    if (pwdNew !== pwdConfirm) {
      setPwdError({ en: 'New passwords do not match.', ru: 'Новые пароли не совпадают.' });
      return;
    }
    if (pwdNew === pwdCurrent) {
      setPwdError({ en: 'New password must differ from the current one.', ru: 'Новый пароль должен отличаться от текущего.' });
      return;
    }

    setPwdLoading(true);
    try {
      // Step 1 — reauthenticate. Supabase has no "verify current password"
      // RPC; the standard pattern is to call signInWithPassword and treat
      // an error as "wrong current password". This re-issues a token on
      // success but does not log the user out.
      const { error: reauthErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: pwdCurrent,
      });
      if (reauthErr) {
        setPwdError(translatePwdError(reauthErr.message));
        return;
      }

      // Step 2 — update the password on the (now-fresh) session.
      const { error: updateErr } = await supabase.auth.updateUser({ password: pwdNew });
      if (updateErr) {
        setPwdError(translatePwdError(updateErr.message));
        return;
      }

      setPwdSuccess(true);
      // Hold the success state briefly so the user sees it, then collapse.
      setTimeout(() => {
        setPwdSuccess(false);
        closePasswordForm();
      }, 2200);
    } catch (err) {
      setPwdError(translatePwdError(err?.message));
    } finally {
      setPwdLoading(false);
    }
  };

  // Translate email-change errors → bilingual.
  const translateEmailError = (rawMsg) => {
    if (!rawMsg) return { en: 'Something went wrong. Please try again.', ru: 'Что-то пошло не так. Попробуйте ещё раз.' };
    const m = rawMsg.toLowerCase();
    if (m.includes('invalid login credentials'))     return { en: 'Current password is incorrect.', ru: 'Текущий пароль неверный.' };
    if (m.includes('already') && m.includes('user')) return { en: 'This email is already in use by another account.', ru: 'Этот email уже используется другим аккаунтом.' };
    if (m.includes('unable to validate email'))      return { en: 'That email address looks invalid.', ru: 'Этот email выглядит некорректным.' };
    if (m.includes('rate limit'))                    return { en: 'Too many attempts. Please wait a minute.', ru: 'Слишком много попыток. Подождите минуту.' };
    if (m.includes('same as the current'))           return { en: 'New email must differ from your current one.', ru: 'Новый email должен отличаться от текущего.' };
    return { en: rawMsg, ru: rawMsg };
  };

  const closeEmailForm = () => {
    setEmailOpen(false);
    setEmailNew('');
    setEmailPwd('');
    setEmailError(null);
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailError(null);

    const trimmed = emailNew.trim().toLowerCase();
    const current = (user?.email || '').toLowerCase();

    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      setEmailError({ en: 'Please enter a valid email.', ru: 'Введите корректный email.' });
      return;
    }
    if (trimmed === current) {
      setEmailError({ en: 'New email must differ from your current one.', ru: 'Новый email должен отличаться от текущего.' });
      return;
    }

    setEmailLoading(true);
    try {
      // Step 1 — verify current password (same pattern as change-password)
      const { error: reauthErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: emailPwd,
      });
      if (reauthErr) {
        setEmailError(translateEmailError(reauthErr.message));
        return;
      }

      // Step 2 — request the email change. Supabase sends a confirmation
      // link to BOTH old and new mailboxes (with "Secure email change"
      // enabled in the project settings — on by default). The change
      // only takes effect once both links are clicked.
      const { error: updateErr } = await supabase.auth.updateUser({ email: trimmed });
      if (updateErr) {
        setEmailError(translateEmailError(updateErr.message));
        return;
      }

      setEmailPending(trimmed);
      // Keep the form open briefly so the user reads the "check your
      // mailbox" message; then collapse — pending banner stays.
      setTimeout(() => closeEmailForm(), 100);
    } catch (err) {
      setEmailError(translateEmailError(err?.message));
    } finally {
      setEmailLoading(false);
    }
  };

  // Save display_name only. `university_tracking` is set at registration time
  // and is read-only here (B1) — to change it, the user contacts support.
  const handleSave = async () => {
    setSaving(true);
    try {
      const trimmed = displayName.trim();
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: trimmed || null,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Failed to save profile:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-8"
      style={{ backgroundColor: 'var(--col-page-bg)' }}>
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium mb-6 px-4 py-2 rounded-xl transition-all"
        style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)', minHeight: 40 }}>
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-bold text-2xl mb-1"
        style={{ color: 'var(--col-heading)', letterSpacing: '-0.4px' }}>
        Profile & Settings
      </h1>
      <p className="text-sm mb-7" style={{ color: 'var(--col-muted)' }}>Профиль и настройки</p>

      <div className="space-y-5">

        <div className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"
            style={{ color: 'var(--col-heading)' }}>
            <User className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            Identity
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--col-muted)' }}>
                Full Name / Имя и фамилия
              </label>
              <input type="text" value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Anna Ivanova / Анна Иванова"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-body)', outline: 'none' }} />
              <p className="text-xs mt-1.5 italic" style={{ color: 'var(--col-muted)' }}>
                This name is visible to your teacher. / Это имя видит преподаватель.
              </p>
            </div>
            <div>
              <label className="flex items-baseline gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--col-muted)' }}>
                  <Mail className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
                  Email
                </span>
                <span className="text-[10px] italic" style={{ color: 'var(--col-muted)' }}>· Электронная почта</span>
              </label>

              {!emailOpen ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl text-sm truncate"
                    style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-body)' }}>
                    {user.email}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0"
                    style={{
                      backgroundColor: 'var(--col-surface)',
                      border: '1px solid var(--col-border)',
                      color: 'var(--col-secondary)',
                      minHeight: 40,
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                    Change
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangeEmail} className="space-y-2.5">
                  <div className="px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                    style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-muted)' }}>
                    <Mail className="h-3 w-3 shrink-0" style={{ color: 'var(--col-accent)' }} />
                    <span className="truncate">Current: {user.email}</span>
                  </div>

                  <input
                    type="email"
                    value={emailNew}
                    onChange={(e) => setEmailNew(e.target.value)}
                    placeholder="new.email@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2.5 rounded-xl text-sm"
                    style={{
                      backgroundColor: 'var(--col-surface-secondary)',
                      border: '1px solid var(--col-border)',
                      color: 'var(--col-body)',
                      outline: 'none',
                      minHeight: 44,
                    }}
                  />

                  <input
                    type="password"
                    value={emailPwd}
                    onChange={(e) => setEmailPwd(e.target.value)}
                    placeholder="Current password · Текущий пароль"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 rounded-xl text-sm"
                    style={{
                      backgroundColor: 'var(--col-surface-secondary)',
                      border: '1px solid var(--col-border)',
                      color: 'var(--col-body)',
                      outline: 'none',
                      minHeight: 44,
                    }}
                  />

                  {emailError && (
                    <div
                      className="rounded-xl px-3 py-2 flex items-start gap-2"
                      style={{ backgroundColor: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.3)' }}
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: 'var(--col-incorrect)' }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--col-incorrect)' }}>{emailError.en}</p>
                        <p className="text-[11px] italic mt-0.5" style={{ color: 'var(--col-incorrect)', opacity: 0.85 }}>{emailError.ru}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{
                        backgroundColor: 'var(--col-accent)',
                        opacity: emailLoading ? 0.7 : 1,
                        cursor: emailLoading ? 'not-allowed' : 'pointer',
                        minHeight: 44,
                      }}
                    >
                      {emailLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                      ) : (
                        <><Send className="h-3.5 w-3.5" /> Send confirmation · Подтвердить</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeEmailForm}
                      disabled={emailLoading}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1"
                      style={{
                        color: 'var(--col-secondary)',
                        border: '1px solid var(--col-border)',
                        backgroundColor: 'var(--col-surface-secondary)',
                        minHeight: 44,
                      }}
                      aria-label="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Pending confirmation banner — sits below the field whether collapsed or open */}
              {emailPending && (
                <div
                  className="mt-2 px-3 py-2.5 rounded-xl flex items-start gap-2"
                  style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-accent)' }}
                >
                  <MailCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: 'var(--col-accent)' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--col-accent-text)' }}>
                      Confirmation sent to {emailPending}
                    </p>
                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--col-accent-text)', opacity: 0.85 }}>
                      Open the link in <strong>both</strong> mailboxes — old and new — to complete the change.
                    </p>
                    <p className="text-[11px] italic mt-0.5 leading-relaxed" style={{ color: 'var(--col-accent-text)', opacity: 0.7 }}>
                      Откройте ссылку и в старом, и в новом ящике — иначе изменение не применится.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"
            style={{ color: 'var(--col-heading)' }}>
            <GraduationCap className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            University status · Статус
          </h2>

          {/* Read-only badge — set at registration, not editable here (B1) */}
          {profileLoaded ? (
            isFinancialUniversity ? (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--col-accent-light)',
                  border: '1px solid var(--col-accent)',
                }}
              >
                <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--col-accent-text)' }}>
                    Verified Financial University student
                  </p>
                  <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-accent-text)', opacity: 0.78 }}>
                    Студент Финансового университета — подтверждено
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--col-surface-secondary)',
                  border: '1px solid var(--col-border)',
                }}
              >
                <User className="h-4 w-4 shrink-0" style={{ color: 'var(--col-muted)' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>
                    Independent learner
                  </p>
                  <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
                    Свободный учащийся
                  </p>
                </div>
              </div>
            )
          ) : (
            <div
              className="h-[58px] rounded-xl animate-pulse"
              style={{ backgroundColor: 'var(--col-surface-secondary)' }}
            />
          )}

          {/* Why is this read-only? */}
          <div className="mt-3 px-4 py-3 rounded-xl flex items-start gap-2"
            style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
            <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: 'var(--col-muted)' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--col-secondary)' }}>
                This status is set when you register and cannot be changed here.
                To update it, contact support.
              </p>
              <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
                Этот статус задаётся при регистрации и здесь не меняется.
                Чтобы его изменить, напишите в поддержку.
              </p>
            </div>
          </div>
        </div>

        {/* ── Security · смена пароля (B2b) ── */}
        <div className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"
            style={{ color: 'var(--col-heading)' }}>
            <Shield className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            Security · Безопасность
          </h2>

          {!pwdOpen ? (
            <button
              type="button"
              onClick={() => setPwdOpen(true)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors"
              style={{
                backgroundColor: 'var(--col-surface-secondary)',
                border: '1px solid var(--col-border)',
                color: 'var(--col-heading)',
                minHeight: 52,
              }}
            >
              <span className="flex items-center gap-2.5">
                <KeyRound className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
                <span className="text-sm font-medium">
                  Change password
                  <span className="text-xs italic ml-1.5" style={{ color: 'var(--col-muted)' }}>
                    · Сменить пароль
                  </span>
                </span>
              </span>
              <span className="text-xs" style={{ color: 'var(--col-muted)' }}>→</span>
            </button>
          ) : pwdSuccess ? (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-accent)' }}
            >
              <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--col-accent-text)' }}>
                  Password updated
                </p>
                <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-accent-text)', opacity: 0.78 }}>
                  Пароль обновлён
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-3">
              <PwdField
                label="Current password"
                labelRu="Текущий пароль"
                value={pwdCurrent}
                onChange={(e) => setPwdCurrent(e.target.value)}
                show={pwdShow}
                onToggleShow={() => setPwdShow((v) => !v)}
                autoComplete="current-password"
              />
              <PwdField
                label="New password"
                labelRu="Новый пароль"
                value={pwdNew}
                onChange={(e) => setPwdNew(e.target.value)}
                show={pwdShow}
                hideToggle
                autoComplete="new-password"
              />
              <PwdField
                label="Confirm new password"
                labelRu="Повторите новый пароль"
                value={pwdConfirm}
                onChange={(e) => setPwdConfirm(e.target.value)}
                show={pwdShow}
                hideToggle
                autoComplete="new-password"
              />

              {pwdError && (
                <div
                  className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                  style={{ backgroundColor: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.3)' }}
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--col-incorrect)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--col-incorrect)' }}>{pwdError.en}</p>
                    <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-incorrect)', opacity: 0.85 }}>{pwdError.ru}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{
                    backgroundColor: 'var(--col-accent)',
                    opacity: pwdLoading ? 0.7 : 1,
                    cursor: pwdLoading ? 'not-allowed' : 'pointer',
                    minHeight: 44,
                  }}
                >
                  {pwdLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    'Save · Сохранить'
                  )}
                </button>
                <button
                  type="button"
                  onClick={closePasswordForm}
                  disabled={pwdLoading}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{
                    color: 'var(--col-secondary)',
                    border: '1px solid var(--col-border)',
                    backgroundColor: 'var(--col-surface-secondary)',
                    minHeight: 44,
                  }}
                >
                  Cancel · Отмена
                </button>
              </div>
            </form>
          )}

          {/* Helper: forgot current password */}
          {!pwdOpen && (
            <p className="text-[11px] italic mt-3" style={{ color: 'var(--col-muted)' }}>
              Forgot your current password? Log out and use "Forgot password?" on the sign-in screen.
              <br />
              Забыли текущий пароль? Выйдите и используйте «Забыли пароль?» на странице входа.
            </p>
          )}
        </div>

        <div className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"
            style={{ color: 'var(--col-heading)' }}>
            <Sun className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            Appearance / Оформление
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Light', labelRu: 'Светлая', icon: Sun },
              { id: 'dark', label: 'Dark', labelRu: 'Тёмная', icon: Moon },
              { id: 'stock', label: 'Stock Exchange', labelRu: 'Биржа', icon: TrendingUp },
            ].map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-center transition-all"
                style={{
                  backgroundColor: theme === t.id ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                  border: `2px solid ${theme === t.id ? 'var(--col-accent)' : 'var(--col-border)'}`,
                  minHeight: 72,
                }}>
                <t.icon className="h-5 w-5"
                  style={{ color: theme === t.id ? 'var(--col-accent)' : 'var(--col-muted)' }} />
                <span className="text-xs font-semibold"
                  style={{ color: theme === t.id ? 'var(--col-accent-text)' : 'var(--col-secondary)' }}>
                  {t.label}
                </span>
                <span className="text-[10px] italic" style={{ color: 'var(--col-muted)' }}>
                  {t.labelRu}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--col-heading)' }}>
            App Tour / Тур по приложению
          </h2>
          <button onClick={handleRestartTour} className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{
              border: '1px solid var(--col-border)',
              color: tourReset ? 'var(--col-correct)' : 'var(--col-secondary)',
              backgroundColor: 'var(--col-surface-secondary)',
              minHeight: 48,
            }}>
            {tourReset
              ? 'The tour will start on your next Dashboard visit.'
              : 'Restart App Tour / Перезапустить тур'}
          </button>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: saved ? 'var(--col-correct)' : 'var(--col-accent)', minHeight: 52 }}>
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            <><CheckCircle className="h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> Save Settings / Сохранить</>
          )}
        </button>

      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function PwdField({ label, labelRu, value, onChange, show, onToggleShow, hideToggle, autoComplete }) {
  return (
    <div>
      <label className="flex items-baseline gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--col-muted)' }}>
          <Lock className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
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