import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

// Вспомогательная функция: загружает профиль из таблицы profiles
async function loadProfile(authUser) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, display_name, university_tracking')
    .eq('id', authUser.id)
    .single();

  return {
    ...authUser,
    full_name: profile?.full_name || '',
    displayName: profile?.display_name || profile?.full_name || '',
    isFinancialUniversity: profile?.university_tracking || false,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (error || !data?.user) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        const enriched = await loadProfile(data.user);
        setUser(enriched);
        setIsAuthenticated(true);
      }
      setIsLoadingAuth(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const enriched = await loadProfile(session.user);
        setUser(enriched);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Эта функция вызывается после сохранения профиля — обновляет данные пользователя
  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      const enriched = await loadProfile(data.user);
      setUser(enriched);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      return;
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        logout,
        refreshUser,   // ← теперь экспортируется
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}