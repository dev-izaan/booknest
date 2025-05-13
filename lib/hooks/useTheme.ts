'use client';

import { useState, useEffect } from 'react';
import { isBrowser, withBrowser, safeLocalStorage } from '../utils/browser';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Initialize with a default theme (will be updated on mount)
  const [theme, setTheme] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme on client-side only
  useEffect(() => {
    setIsMounted(true);
    
    // Get stored theme or detect user preference
    const storedTheme = safeLocalStorage.getItem<Theme | null>('theme', null);
    const prefersDark = withBrowser(
      () => window.matchMedia('(prefers-color-scheme: dark)').matches, 
      false
    );
    
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // Apply theme to document
    applyTheme(initialTheme);
  }, []);

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    safeLocalStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Set theme explicitly
  const setThemeExplicitly = (newTheme: Theme) => {
    setTheme(newTheme);
    safeLocalStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Apply theme to document
  const applyTheme = (currentTheme: Theme) => {
    if (!isBrowser) return;
    
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return {
    theme,
    toggleTheme,
    setTheme: setThemeExplicitly,
    isMounted
  };
} 