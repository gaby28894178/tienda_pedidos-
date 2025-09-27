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

      {/* Enhanced Overlay with Intense Blur Effect */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden animate-fadeIn"
          onClick={closeMenu}
          style={{
            backdropFilter: 'blur(20px) saturate(180%) brightness(120%) contrast(110%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(120%) contrast(110%)',
            background: theme === 'dark'
              ? 'rgba(15, 23, 42, 0.75)'
              : theme === 'blue'
              ? 'rgba(30, 58, 138, 0.65)'
              : 'rgba(71, 85, 105, 0.55)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'fadeInBlur 0.4s ease-out'
          }}
        />
      )}

      {/* Enhanced Mobile Menu with Premium Design */}
      <div
        className={`
          fixed top-0 h-full w-full z-50 transform transition-all duration-500 ease-out
          ${currentTheme.colors.text}
          md:hidden
          ${isOpen ? 'translate-x-0 scale-100' : '-translate-x-full scale-95'}
        `}
        style={{
          left: '0px',
          margin: '0px',
          padding: '0px',
          backdropFilter: 'blur(24px) saturate(200%) brightness(105%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%) brightness(105%)',
          background: theme === 'dark' 
            ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 20%, rgba(51, 65, 85, 0.90) 40%, rgba(71, 85, 105, 0.88) 60%, rgba(100, 116, 139, 0.85) 80%, rgba(148, 163, 184, 0.82) 100%)'
            : theme === 'blue' 
            ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.92) 20%, rgba(37, 99, 235, 0.90) 40%, rgba(59, 130, 246, 0.88) 60%, rgba(96, 165, 250, 0.85) 80%, rgba(147, 197, 253, 0.82) 100%)'
            : 'linear-gradient(145deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.95) 20%, rgba(226, 232, 240, 0.92) 40%, rgba(203, 213, 225, 0.90) 60%, rgba(148, 163, 184, 0.87) 80%, rgba(100, 116, 139, 0.85) 100%)',
          boxShadow: theme === 'dark'
            ? '0 32px 64px rgba(0, 0, 0, 0.4), 0 16px 32px rgba(15, 23, 42, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            : theme === 'blue'
            ? '0 32px 64px rgba(30, 58, 138, 0.25), 0 16px 32px rgba(37, 99, 235, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            : '0 32px 64px rgba(71, 85, 105, 0.2), 0 16px 32px rgba(100, 116, 139, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          border: '1px solid',
          borderColor: theme === 'dark'
            ? 'rgba(148, 163, 184, 0.4)'
            : theme === 'blue'
            ? 'rgba(147, 197, 253, 0.4)'
            : 'rgba(203, 213, 225, 0.5)',
          animation: isOpen ? 'slideInRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'slideOutLeft 0.3s ease-in'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/20"
               style={{ 
                 background: theme === 'dark'
                   ? 'rgba(30, 41, 59, 0.6)'
                   : theme === 'blue'
                   ? 'rgba(30, 58, 138, 0.5)'
                   : 'rgba(241, 245, 249, 0.7)',
                 backdropFilter: 'blur(16px) saturate(150%)',
                 WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                 borderBottom: '2px solid',
                 borderBottomColor: theme === 'dark'
                   ? 'rgba(255, 255, 255, 0.25)'
                   : theme === 'blue'
                   ? 'rgba(255, 255, 255, 0.3)'
                   : 'rgba(148, 163, 184, 0.4)',
                 boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
               }}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-lg"
                style={{ color: '#ffffff' }}>Menú</h2>
            <button
              onClick={closeMenu}
              className="p-3 rounded-lg transition-all duration-200 hover:scale-105"
              style={{ 
                background: theme === 'dark'
                  ? 'rgba(139, 92, 246, 0.4)'
                  : theme === 'blue'
                  ? 'rgba(96, 165, 250, 0.4)'
                  : 'rgba(248, 250, 252, 0.6)',
                color: '#ffffff',
                border: '1px solid',
                borderColor: theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : theme === 'blue'
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(148, 163, 184, 0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Enhanced Navigation Items */}
          <nav className="flex-1 py-8"
               style={{
                 background: 'transparent'
               }}>
            <ul className="space-y-4 px-6"
                style={{
                  background: theme === 'dark'
                    ? 'rgba(51, 65, 85, 0.25)'
                    : theme === 'blue'
                    ? 'rgba(37, 99, 235, 0.2)'
                    : 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '20px',
                  padding: '24px',
                  margin: '0 16px',
                  border: '2px solid',
                  borderColor: theme === 'dark'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : theme === 'blue'
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'rgba(148, 163, 184, 0.3)',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className={`
                        flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-500
                        ${isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                      style={{
                        background: isActive 
                          ? (theme === 'dark'
                            ? 'rgba(99, 102, 241, 0.6)'
                            : theme === 'blue'
                            ? 'rgba(29, 78, 216, 0.6)'
                            : 'rgba(37, 99, 235, 0.6)')
                          : (theme === 'dark'
                            ? 'rgba(168, 85, 247, 0.15)'
                            : theme === 'blue'
                            ? 'rgba(221, 214, 254, 0.25)'
                            : 'rgba(255, 255, 255, 0.35)'),
                        color: isActive ? '#ffffff' : (theme === 'blue' ? '#1e40af' : theme === 'dark' ? '#ffffff' : '#374151'),
                        border: '2px solid',
                        borderColor: isActive 
                          ? 'rgba(255, 255, 255, 0.4)'
                          : (theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.25)'
                            : theme === 'blue'
                            ? 'rgba(147, 197, 253, 0.4)'
                            : 'rgba(209, 213, 219, 0.4)'),
                        backdropFilter: 'blur(12px) saturate(120%)',
                        WebkitBackdropFilter: 'blur(12px) saturate(120%)',
                        boxShadow: isActive 
                          ? '0 12px 35px rgba(99, 102, 241, 0.3), 0 0 20px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          : '0 4px 16px rgba(0, 0, 0, 0.1)',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.5s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = theme === 'dark'
                            ? 'rgba(99, 102, 241, 0.5)'
                            : theme === 'blue'
                            ? 'rgba(59, 130, 246, 0.4)'
                            : 'rgba(255, 255, 255, 0.6)';
                          e.currentTarget.style.transform = 'translateX(12px) scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = theme === 'dark'
                            ? 'rgba(168, 85, 247, 0.15)'
                            : theme === 'blue'
                            ? 'rgba(221, 214, 254, 0.25)'
                            : 'rgba(255, 255, 255, 0.35)';
                          e.currentTarget.style.transform = 'translateX(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.borderColor = theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.25)'
                            : theme === 'blue'
                            ? 'rgba(147, 197, 253, 0.4)'
                            : 'rgba(209, 213, 219, 0.4)';
                        }
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

          {/* Enhanced Theme Toggle */}
          <div className="p-8 border-t border-white/20"
               style={{ 
                 borderTop: '2px solid',
                 borderTopColor: theme === 'dark'
                   ? 'rgba(255, 255, 255, 0.25)'
                   : theme === 'blue'
                   ? 'rgba(255, 255, 255, 0.3)'
                   : 'rgba(148, 163, 184, 0.4)',
                 background: theme === 'dark'
                   ? 'rgba(30, 41, 59, 0.6)'
                   : theme === 'blue'
                   ? 'rgba(30, 58, 138, 0.5)'
                   : 'rgba(241, 245, 249, 0.7)',
                 backdropFilter: 'blur(16px) saturate(150%)',
                 WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                 boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
               }}>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-600 dark:text-gray-300 drop-shadow-lg"
                    style={{ color: '#ffffff' }}>
                Tema
              </span>
              <div className="enhanced-theme-toggle">
                <ThemeToggle />
              </div>
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