import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore, themes } from '../../stores/themeStore';

const PasswordChange: React.FC = () => {
  const { changePassword } = useAuthStore();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }
    if (!/\d/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }
    return errors;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Validar campos requeridos
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors.join(', ');
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (success) {
        toast.success('Contraseña cambiada exitosamente');
        // Limpiar formulario después del éxito
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrors({ currentPassword: 'La contraseña actual es incorrecta' });
      }
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    const errors = validatePassword(password);
    const strength = Math.max(0, 5 - errors.length);
    
    if (strength === 0) return { strength: 0, label: 'Muy débil', color: 'bg-red-500' };
    if (strength === 1) return { strength: 20, label: 'Débil', color: 'bg-red-400' };
    if (strength === 2) return { strength: 40, label: 'Regular', color: 'bg-yellow-500' };
    if (strength === 3) return { strength: 60, label: 'Buena', color: 'bg-blue-500' };
    if (strength === 4) return { strength: 80, label: 'Fuerte', color: 'bg-green-500' };
    return { strength: 100, label: 'Muy fuerte', color: 'bg-green-600' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className={`${currentTheme.colors.surface} rounded-lg shadow-lg w-full max-w-2xl`}>
        <div className={`${currentTheme.colors.primary} text-white p-4 rounded-t-lg`}>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Cambiar Contraseña</h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-1`}>
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                } ${currentTheme.colors.background} ${currentTheme.colors.text}`}
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-1`}>
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                } ${currentTheme.colors.background} ${currentTheme.colors.text}`}
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Indicador de fortaleza */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className={currentTheme.colors.text}>Fortaleza:</span>
                  <span className={`font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-1`}>
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } ${currentTheme.colors.background} ${currentTheme.colors.text}`}
                placeholder="Confirma tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-4 py-2 ${currentTheme.colors.primary} text-white rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  );
};

export { PasswordChange };