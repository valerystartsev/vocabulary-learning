import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          setMessage('Регистрация прошла успешно. Теперь войди в аккаунт или подтверди почту, если Supabase требует подтверждение.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('Произошла ошибка.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 24, border: '1px solid #ddd', borderRadius: 16 }}>
        <h1 style={{ marginBottom: 16 }}>
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #ccc' }}
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #ccc' }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer' }}
          >
            {loading
              ? 'Загрузка...'
              : mode === 'login'
              ? 'Войти'
              : 'Зарегистрироваться'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 12, color: 'green' }}>{message}</p>
        )}

        {error && (
          <p style={{ marginTop: 12, color: 'crimson' }}>{error}</p>
        )}

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setMessage('');
            setError('');
          }}
          style={{
            marginTop: 16,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {mode === 'login'
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}