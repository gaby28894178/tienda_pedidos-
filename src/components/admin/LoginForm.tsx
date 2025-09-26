import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore, themes } from '../../stores/themeStore';
import { toast } from 'sonner';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import PasswordRecovery from './PasswordRecovery';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const { login } = useAuthStore();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast.success('Inicio de sesión exitoso');
        onLoginSuccess();
      } else {
        toast.error('Credenciales incorrectas');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  if (showRecovery) {
    return <PasswordRecovery onBack={() => setShowRecovery(false)} />;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${currentTheme.colors.background}`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-lg shadow-lg ${currentTheme.colors.surface} border ${currentTheme.colors.border}`}>
        <div className="text-center mb-8">
          <Lock className={`mx-auto h-12 w-12 ${currentTheme.colors.primary.replace('bg-', 'text-')}`} />
          <h2 className={`mt-4 text-3xl font-bold ${currentTheme.colors.text}`}>
            Panel de Administración
          </h2>
          <p className={`mt-2 ${currentTheme.colors.textSecondary}`}>
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
              Usuario
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.colors.textSecondary}`} />
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
              Contraseña
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.colors.textSecondary}`} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.colors.textSecondary} hover:${currentTheme.colors.text} transition-colors duration-200`}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${currentTheme.colors.primary} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowRecovery(true)}
            className={`text-sm ${currentTheme.colors.primary.replace('bg-', 'text-')} hover:underline transition-colors duration-200`}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className={`mt-6 text-center text-sm ${currentTheme.colors.textSecondary}`}>
          <p>Credenciales de prueba:</p>
          <p>Usuario: admin | Contraseña: admin123</p>
        </div>
      </div>
    </div>
  );
};