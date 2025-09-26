import React from 'react';
import { Sun, Moon, Waves } from 'lucide-react';
import { useThemeStore, themes, Theme } from '../stores/themeStore';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useThemeStore();
  const currentTheme = themes[theme];

  const themeOptions: { key: Theme; icon: React.ReactNode; label: string }[] = [
    { key: 'light', icon: <Sun size={16} />, label: 'Light' },
    { key: 'dark', icon: <Moon size={16} />, label: 'Dark' },
    { key: 'blue', icon: <Waves size={16} />, label: 'Blue' },
  ];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {themeOptions.map((option) => (
        <button
          key={option.key}
          onClick={() => setTheme(option.key)}
          className={`
            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
            ${theme === option.key
              ? `${currentTheme.colors.primary} text-white shadow-md`
              : `${currentTheme.colors.secondary} ${currentTheme.colors.textSecondary} hover:${currentTheme.colors.accent}`
            }
          `}
          title={`Switch to ${option.label} theme`}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;