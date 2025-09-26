import React, { useState } from 'react';
import { Menu, X, Home, Package, ShoppingCart, List } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore, themes } from '../stores/themeStore';
import { useCartStore } from '../stores/cartStore';
import ThemeToggle from './ThemeToggle';

interface HamburgerMenuProps {
  className?: string;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeStore();
  const { getTotalItems } = useCartStore();
  const location = useLocation();
  const currentTheme = themes[theme];
  const totalItems = getTotalItems();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: <Home size={20} /> },
    { path: '/catalog', label: 'Catálogo', icon: <Package size={20} /> },
    { path: '/orders', label: 'Pedidos', icon: <ShoppingCart size={20} />, badge: totalItems > 0 ? totalItems : undefined },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={toggleMenu}
        className={`
          relative z-50 p-2 rounded-lg transition-all duration-200
          ${currentTheme.colors.secondary} ${currentTheme.colors.text}
          hover:${currentTheme.colors.accent} focus:outline-none focus:ring-2 focus:ring-blue-500
          md:hidden ${className}
        `}
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <Menu
            size={24}
            className={`absolute inset-0 transition-all duration-300 transform ${
              isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
            }`}
          />
          <X
            size={24}
            className={`absolute inset-0 transition-all duration-300 transform ${
              isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
            }`}
          />
        </div>
      </button>

      {/* Overlay with Maximum Distortion Effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black z-40 md:hidden animate-fadeIn"
          onClick={closeMenu}
          style={{
            backdropFilter: 'blur(40px) saturate(300%) contrast(150%) brightness(60%)',
            WebkitBackdropFilter: 'blur(40px) saturate(300%) contrast(150%) brightness(60%)',
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.99) 0%, rgba(0,0,0,1) 100%)'
          }}
        />
      )}

      {/* Mobile Menu with Completely Solid Background */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out
          ${currentTheme.colors.text}
          shadow-2xl border-r-8 border-gray-200 dark:border-gray-700
          md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: theme === 'dark' ? '#0f172a' : theme === 'blue' ? '#1e3a8a' : '#ffffff',
          borderRightColor: theme === 'dark' ? '#1e293b' : theme === 'blue' ? '#2563eb' : '#d1d5db',
          boxShadow: '8px 0 32px rgba(0, 0, 0, 0.6), inset -2px 0 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)',
          opacity: '1'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-4 border-gray-300 dark:border-gray-600"
               style={{ 
                 borderBottomColor: theme === 'blue' ? '#2563eb' : theme === 'dark' ? '#1e293b' : '#9ca3af',
                 backgroundColor: theme === 'dark' ? '#0f172a' : theme === 'blue' ? '#1e3a8a' : '#ffffff'
               }}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-lg"
                style={{ color: theme === 'blue' ? '#ffffff' : theme === 'dark' ? '#ffffff' : '#111827' }}>Menú</h2>
            <button
              onClick={closeMenu}
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600"
              style={{ 
                backgroundColor: theme === 'blue' ? '#2563eb' : theme === 'dark' ? '#1e293b' : '#f3f4f6',
                color: theme === 'blue' ? '#ffffff' : theme === 'dark' ? '#ffffff' : '#111827',
                borderColor: theme === 'blue' ? '#3b82f6' : theme === 'dark' ? '#374151' : '#d1d5db'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6"
               style={{
                 backgroundColor: theme === 'dark' ? '#0f172a' : theme === 'blue' ? '#1e3a8a' : '#ffffff',
                 opacity: '1'
               }}>
            <ul className="space-y-2 px-4"
                style={{
                  backgroundColor: theme === 'dark' ? '#0f172a' : theme === 'blue' ? '#1e3a8a' : '#ffffff',
                  opacity: '1'
                }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                      style={{
                        backgroundColor: isActive 
                          ? (theme === 'blue' ? '#2563eb' : '#3b82f6') 
                          : (theme === 'dark' ? '#1e293b' : theme === 'blue' ? '#1e40af' : '#f9fafb'),
                        color: isActive ? '#ffffff' : (theme === 'blue' ? '#ffffff' : theme === 'dark' ? '#ffffff' : '#111827'),
                        opacity: '1'
                      }}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center animate-bounce-custom">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Theme Toggle */}
          <div className="p-6 border-t-4 border-gray-300 dark:border-gray-600"
               style={{ 
                 borderTopColor: theme === 'blue' ? '#2563eb' : theme === 'dark' ? '#1e293b' : '#9ca3af',
                 backgroundColor: theme === 'dark' ? '#0f172a' : theme === 'blue' ? '#1e3a8a' : '#ffffff'
               }}>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-600 dark:text-gray-300 drop-shadow-lg"
                    style={{ color: theme === 'blue' ? '#ffffff' : theme === 'dark' ? '#ffffff' : '#111827' }}>
                Tema
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Menu - Only show when hamburger menu is not open */}
      <nav className={`hidden md:flex items-center space-x-6 ${isOpen ? 'md:hidden' : ''}`}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                ${isActive
                  ? `${currentTheme.colors.primary} text-white shadow-md`
                  : `${currentTheme.colors.textSecondary} hover:${currentTheme.colors.accent} hover:${currentTheme.colors.text}`
                }
              `}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center animate-bounce-custom">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
};

export default HamburgerMenu;