import React, { useState } from 'react';
import { Mail, Key, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

interface PasswordRecoveryProps {
  onBack: () => void;
}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onBack }) => {
  const { requestPasswordReset, resetPassword } = useAuthStore();
  const { currentTheme } = useThemeStore();
  
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
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

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setErrors({ username: 'El nombre de usuario es requerido' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await requestPasswordReset(formData.username);
      
      if (success) {
        toast.success('Token de recuperación generado');
        setStep('reset');
      } else {
        setErrors({ username: 'Usuario no encontrado' });
      }
    } catch (error) {
      toast.error('Error al solicitar recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.token.trim()) {
      newErrors.token = 'El token es requerido';
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
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await resetPassword(formData.token, formData.newPassword);
      
      if (success) {
        toast.success('Contraseña restablecida exitosamente');
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setErrors({ token: 'Token inválido o expirado' });
      }
    } catch (error) {
      toast.error('Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
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
    <div className={`min-h-screen flex items-center justify-center ${currentTheme.colors.background} p-4`}>
      <div className={`w-full max-w-md ${currentTheme.colors.surface} rounded-lg shadow-xl`}>
        <div className={`${currentTheme.colors.primary} text-white p-6 rounded-t-lg`}>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {step === 'request' ? <Mail className="w-6 h-6" /> : <Key className="w-6 h-6" />}
              <h1 className="text-xl font-bold">
                {step === 'request' ? 'Recuperar Acceso' : 'Restablecer Contraseña'}
              </h1>
            </div>
          </div>
          <p className="text-blue-100 mt-2 text-sm">
            {step === 'request' 
              ? 'Ingresa tu nombre de usuario para recibir un token de recuperación'
              : 'Ingresa el token recibido y tu nueva contraseña'
            }
          </p>
        </div>

        <div className="p-6">
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } ${currentTheme.colors.background} ${currentTheme.colors.text}`}
                  placeholder="Ingresa tu nombre de usuario"
                  autoFocus
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div className={`${currentTheme.colors.accent} p-4 rounded-md`}>
                <div className="flex items-start gap-2">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">Información importante</h3>
                    <p className="text-blue-700 text-sm">
                      En un entorno real, se enviaría un email con el token de recuperación. 
                      Para esta demostración, el token aparecerá en una alerta.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${currentTheme.colors.primary} text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Solicitar Token
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Token de Recuperación
                </label>
                <input
                  type="text"
                  value={formData.token}
                  onChange={(e) => handleInputChange('token', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.token ? 'border-red-500' : 'border-gray-300'
                  } ${currentTheme.colors.background} ${currentTheme.colors.text}`}
                  placeholder="Ingresa el token recibido"
                  autoFocus
                />
                {errors.token && (
                  <p className="text-red-500 text-xs mt-1">{errors.token}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  } ${currentTheme.colors.background} ${currentTheme.colors.text}`}
                  placeholder="Ingresa tu nueva contraseña"
                />
                
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

              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } ${currentTheme.colors.background} ${currentTheme.colors.text}`}
                  placeholder="Confirma tu nueva contraseña"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${currentTheme.colors.primary} text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Restablecer Contraseña
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;