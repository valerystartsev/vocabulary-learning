import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'local-dev-user',
    email: 'local@example.com',
    role: 'user',
    full_name: 'Local User',
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({
    id: 'local-settings',
    public_settings: {},
  });

  useEffect(() => {
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
    setIsLoadingPublicSettings(false);
    setAuthError(null);
  }, []);

  const checkAppState = async () => {
    setAuthError(null);
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
    setIsLoadingPublicSettings(false);
  };

  const refreshUser = async () => {
    return user;
  };

  const logout = () => {
  console.log('Logout disabled in local migration mode');
};

  const navigateToLogin = () => {
    console.log('Login disabled in local migration mode');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};