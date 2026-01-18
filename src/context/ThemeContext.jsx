// ============================================
// CONTEXT DU THÈME
// Gère le mode clair/sombre (optionnel, pour futur dark mode)
// ============================================

import { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/utils/constants';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Charger le thème depuis localStorage au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    setTheme(savedTheme);
    
    // Appliquer la classe au document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  /**
   * Change le thème
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};