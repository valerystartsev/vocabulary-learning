import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

// Helper to fetch profile data and merge with auth user
async function fetchUserProfile(authUser) {
  if (!authUser) return null;
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, is_financial_university')
      .eq('id', authUser.id)
      .single();
    
    // PGRST116 = no rows found, which is fine for new users
    if (error && error.code !== 'PGRST116') {
      console.warn('Profile fetch error:', error);
    }
    
    // Merge profile data into user object
    return {
      ...authUser,
      displayName: profile?.full_name || null,
      isFinancialUniversity: profile?.is_financial_university || false,
    };
  } catch (e) {
    console.warn('Error fetching profile:', e);
    return {
      ...authUser,
      displayName: null,
      isFinancialUniversity: false,
    };
  }
}

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
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        if (session?.user) {
          // Set user immediately with auth data
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Fetch profile in background and update user
          fetchUserProfile(session.user).then(userWithProfile => {
            if (isMounted) {
              setUser(userWithProfile);
            }
          });
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        // Network error on initial load — still show the app, let onAuthStateChange recover
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    };

    initializeAuth();

    // Real-time listener: fires on login, logout, token refresh, tab focus
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      
      if (session?.user) {
        // Set user immediately with auth data
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Fetch profile in background and update user
        fetchUserProfile(session.user).then(userWithProfile => {
          if (isMounted) {
            setUser(userWithProfile);
          }
        });
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
          if (session?.user) {
            const userWithProfile = await fetchUserProfile(session.user);
            setUser(userWithProfile);
          }
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