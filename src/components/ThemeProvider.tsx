import React, { useEffect } from 'react';
import { useThemeStore, themes } from '../stores/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme classes to document body
    const body = document.body;
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-blue');
    
    // Add current theme class
    body.classList.add(`theme-${theme}`);
    
    // Apply background color to body
    const currentTheme = themes[theme];
    body.className = body.className.replace(/bg-\S+/g, '');
    body.classList.add(currentTheme.colors.background.replace('bg-', 'bg-'));
  }, [theme]);

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme.colors.background} ${currentTheme.colors.text}`}>
      {children}
    </div>
  );
};

export default ThemeProvider;