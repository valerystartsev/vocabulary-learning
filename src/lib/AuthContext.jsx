// src/lib/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

// Загружает данные профиля из таблицы profiles и добавляет к auth-пользователю.
// Вызывается при каждом входе и при смене сессии.
async function loadProfile(authUser) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, display_name, university_tracking, email')
      .eq('id', authUser.id)
      .single();

    // Если email в profiles пустой — дописываем из auth (для старых аккаунтов)
    if (!profile?.email && authUser.email) {
      await supabase
        .from('profiles')
        .update({ email: authUser.email })
        .eq('id', authUser.id);
    }

    return {
      ...authUser,
      full_name: profile?.full_name || '',
      displayName: profile?.display_name || profile?.full_name || '',
      isFinancialUniversity: profile?.university_tracking || false,
    };
  } catch {
    return authUser;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  // App.jsx использует isLoadingPublicSettings — делаем равным isLoadingAuth
  const isLoadingPublicSettings = isLoadingAuth;

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (error || !data?.user) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
      } else {
        const enriched = await loadProfile(data.user);
        setUser(enriched);
        setIsAuthenticated(true);
        setAuthError(null);
      }
      setIsLoadingAuth(false);
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          const enriched = await loadProfile(session.user);
          setUser(enriched);
          setIsAuthenticated(true);
          setAuthError(null);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setAuthError(null);
        }
        setIsLoadingAuth(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Вызывается из Profile.jsx после нажатия Save —
  // обновляет данные пользователя в памяти без перезагрузки страницы
  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      const enriched = await loadProfile(data.user);
      setUser(enriched);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { console.error('Logout error:', error.message); return; }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}