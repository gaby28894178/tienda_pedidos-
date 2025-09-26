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
    <header
      className={`
        sticky top-0 z-40 w-full border-b backdrop-blur-sm
        ${currentTheme.colors.background} ${currentTheme.colors.border}
        bg-opacity-95 ${className}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className={`
              flex items-center space-x-2 font-bold text-xl transition-colors duration-200
              ${currentTheme.colors.text} hover:${currentTheme.colors.primary.replace('bg-', 'text-')}
            `}
          >
            <Store size={28} className={currentTheme.colors.primary.replace('bg-', 'text-')} />
            <span>TiendaOnline</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;