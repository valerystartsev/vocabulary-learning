// src/pages/Profile.jsx

import { supabase } from '../lib/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User, Save, CheckCircle, GraduationCap,
  ArrowLeft, Sun, Moon, TrendingUp,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState('');
  const [isFinancialUniversity, setIsFinancialUniversity] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tourReset, setTourReset] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.full_name || '');
      setIsFinancialUniversity(!!user.isFinancialUniversity);
    }
  }, [user]);

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

  // Реальное сохранение в Supabase.
  // Раньше здесь был console.log('Profile save disabled...') — данные никуда не писались.
  const handleSave = async () => {
    setSaving(true);
    try {
      const trimmed = displayName.trim();

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: trimmed || null,
          university_tracking: Boolean(isFinancialUniversity),
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

        {/* Блок: Identity */}
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
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Anna Ivanova / Анна Иванова"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-body)', outline: 'none' }} />
              <p className="text-xs mt-1.5 italic" style={{ color: 'var(--col-muted)' }}>
                This name is visible to your teacher. / Это имя видит преподаватель.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--col-muted)' }}>
                Email (read-only)
              </label>
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-secondary)' }}>
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Блок: University Tracking */}
        <div className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"
            style={{ color: 'var(--col-heading)' }}>
            <GraduationCap className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            University Tracking
          </h2>

          {/*
            Чекбокс: <label> оборачивает весь блок.
            Клик в любом месте — по тексту ИЛИ по квадратику — идёт через
            label → скрытый input → onChange → одно изменение состояния.

            Раньше на визуальном <div> был onClick, который тоже менял состояние.
            Получалось два изменения подряд → возврат в исходное → квадратик не работал.
            Теперь onClick с <div> убран.
          */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-0.5">
              <input type="checkbox" checked={isFinancialUniversity}
                onChange={(e) => setIsFinancialUniversity(e.target.checked)}
                className="sr-only" />
              {/* Визуальный квадратик — только отображение, без onClick */}
              <div className="w-5 h-5 rounded flex items-center justify-center transition-all"
                style={{
                  backgroundColor: isFinancialUniversity ? 'var(--col-accent)' : 'var(--col-surface-secondary)',
                  border: `2px solid ${isFinancialUniversity ? 'var(--col-accent)' : 'var(--col-border)'}`,
                }}>
                {isFinancialUniversity && <CheckCircle className="h-3.5 w-3.5 text-white" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--col-body)' }}>
                I am studying at the Financial University
              </p>
              <p className="text-xs mt-0.5 italic" style={{ color: 'var(--col-secondary)' }}>
                Я обучаюсь в Финансовом университете
              </p>
            </div>
          </label>

          <div className="mt-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
            <p className="text-xs" style={{ color: 'var(--col-accent-text)' }}>
              If you check this box, your teacher can see your progress and exercise results.
            </p>
            <p className="text-xs mt-1 italic" style={{ color: 'var(--col-accent-text)', opacity: 0.75 }}>
              Если вы отметите этот пункт, преподаватель будет видеть ваш прогресс.
            </p>
          </div>
        </div>

        {/* Блок: Appearance */}
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
            ].map((t) => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-center transition-all"
                style={{
                  backgroundColor: theme === t.id ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                  border: `2px solid ${theme === t.id ? 'var(--col-accent)' : 'var(--col-border)'}`,
                  minHeight: 72,
                }}>
                <t.icon className="h-5 w-5" style={{ color: theme === t.id ? 'var(--col-accent)' : 'var(--col-muted)' }} />
                <span className="text-xs font-semibold" style={{ color: theme === t.id ? 'var(--col-accent-text)' : 'var(--col-secondary)' }}>
                  {t.label}
                </span>
                <span className="text-[10px] italic" style={{ color: 'var(--col-muted)' }}>{t.labelRu}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Блок: App Tour */}
        <div className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--col-heading)' }}>
            App Tour / Тур по приложению
          </h2>
          <button onClick={handleRestartTour} className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{ border: '1px solid var(--col-border)', color: tourReset ? 'var(--col-correct)' : 'var(--col-secondary)', backgroundColor: 'var(--col-surface-secondary)', minHeight: 48 }}>
            {tourReset ? 'The tour will start on your next Dashboard visit.' : 'Restart App Tour / Перезапустить тур'}
          </button>
        </div>

        {/* Кнопка Save */}
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