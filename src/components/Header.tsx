import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useThemeStore, themes } from '../stores/themeStore';
import HamburgerMenu from './HamburgerMenu';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300`}
            style={{
              background: theme === 'dark'
                ? 'rgb(15, 23, 42)'
                : theme === 'blue'
                ? 'rgb(30, 58, 138)'
                : 'rgb(248, 250, 252)',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              borderBottom: '1px solid',
              borderBottomColor: theme === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : theme === 'blue'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          style={{
            color: theme === 'dark' ? '#ffffff' : theme === 'blue' ? '#ffffff' : '#1f2937'
          }}
        >
          <Store className="h-8 w-8" />
          <span className="text-xl font-bold">TechStore</span>
        </Link>

        {/* Hamburger Menu Component */}
        <HamburgerMenu />
      </div>
    </header>
  );
};

export default Header;