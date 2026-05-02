import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

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
        setUser(data.user);
        setIsAuthenticated(true);
      }

      setIsLoadingAuth(false);
    };

    loadUser();

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
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
      return;
    }

    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (userMetadata) => {
    const { data, error } = await supabase.auth.updateUser({
      data: userMetadata,
    });

    if (error) {
      throw error;
    }

    if (data?.user) {
      setUser(data.user);
    }

    return data;
  };

  const refreshUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (data?.user) {
      setUser(data.user);
    }

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        logout,
        updateUser,
        refreshUser,
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
