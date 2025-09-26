import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore, themes } from '../../stores/themeStore';
import { LoginForm } from './LoginForm';
import { AdminDashboard } from './AdminDashboard';
import { ProductManager } from './ProductManager';
import { WhatsAppConfig } from './WhatsAppConfig';
import { CategoryManager } from './CategoryManager';
import { PasswordChange } from './PasswordChange';
import OrderManager from './OrderManager';
import { 
  LayoutDashboard, 
  Package, 
  MessageCircle, 
  Tags, 
  LogOut,
  Menu,
  X,
  Key,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

type AdminSection = 'dashboard' | 'products' | 'orders' | 'whatsapp' | 'categories' | 'password';

export const AdminPanel: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLoginSuccess = () => {
    toast.success('Bienvenido al panel de administración');
  };

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as AdminSection, label: 'Productos', icon: Package },
    { id: 'orders' as AdminSection, label: 'Pedidos', icon: ShoppingCart },
    { id: 'whatsapp' as AdminSection, label: 'WhatsApp', icon: MessageCircle },
    { id: 'categories' as AdminSection, label: 'Categorías', icon: Tags },
    { id: 'password' as AdminSection, label: 'Cambiar Contraseña', icon: Key },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <ProductManager />;
      case 'orders':
        return <OrderManager />;
      case 'whatsapp':
        return <WhatsAppConfig />;
      case 'categories':
        return <CategoryManager />;
      case 'password':
        return <PasswordChange />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.colors.background} flex`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${currentTheme.colors.surface} border-r ${currentTheme.colors.border}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className={`text-xl font-bold ${currentTheme.colors.text}`}>
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors duration-200 ${
                    activeSection === item.id
                      ? `${currentTheme.colors.primary} text-white`
                      : `${currentTheme.colors.text} hover:bg-gray-100`
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 px-4">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors duration-200 ${currentTheme.colors.text} hover:bg-red-50 hover:text-red-600`}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className={`h-16 ${currentTheme.colors.surface} border-b ${currentTheme.colors.border} flex items-center justify-between px-4 flex-shrink-0`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className={`text-lg font-semibold ${currentTheme.colors.text}`}>
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${currentTheme.colors.textSecondary}`}>
              Administrador
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};