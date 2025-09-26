import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'blue';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Theme configurations
export const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      secondary: 'bg-gray-100',
      background: 'bg-white',
      surface: 'bg-gray-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      accent: 'bg-blue-50',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: 'bg-purple-600',
      primaryHover: 'hover:bg-purple-700',
      secondary: 'bg-gray-800',
      background: 'bg-gray-900',
      surface: 'bg-gray-800',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700',
      accent: 'bg-purple-900',
    },
  },
  blue: {
    name: 'Blue',
    colors: {
      primary: 'bg-cyan-600',
      primaryHover: 'hover:bg-cyan-700',
      secondary: 'bg-blue-100',
      background: 'bg-blue-50',
      surface: 'bg-white',
      text: 'text-blue-900',
      textSecondary: 'text-blue-700',
      border: 'border-blue-200',
      accent: 'bg-cyan-50',
    },
  },
};