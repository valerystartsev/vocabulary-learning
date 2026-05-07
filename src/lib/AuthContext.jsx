import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // ─── FIX: Use getSession() instead of getUser() ──────────────────────────
    // getUser() makes a NETWORK request to Supabase on every page load.
    // If the network is slow or Supabase is briefly unreachable → app hangs.
    // getSession() reads the session from LOCALSTORAGE instantly (no network).
    // onAuthStateChange then keeps the session fresh in the background.
    // ─────────────────────────────────────────────────────────────────────────
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoadingAuth(false);
      })
      .catch(() => {
        // Network error on initial load — still show the app, let onAuthStateChange recover
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoadingAuth(false);
        }
      });

    // Real-time listener: fires on login, logout, token refresh, tab focus
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(session.user);
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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e.message);
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
        // These aliases keep App.jsx working without changes:
        isLoadingPublicSettings: isLoadingAuth,
        authError: null,
        logout,
        refreshUser: async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) setUser(session.user);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}