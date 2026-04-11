import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = ['light', 'dark', 'stock'];

const ThemeContext = createContext({ theme: 'light', setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('adaptation_theme') || 'light';
  });

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem('adaptation_theme', t);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'stock-theme');
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'stock') root.classList.add('stock-theme');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}