import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    role: 'admin';
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  requestPasswordReset: (username: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

// Credenciales de administrador (en producción esto debería estar en el backend)
let ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Simulación de tokens de recuperación (en producción esto estaría en el backend)
const resetTokens = new Map<string, { username: string; expires: number }>();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (username: string, password: string) => {
        // Simular autenticación (en producción esto sería una llamada al backend)
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          const user = {
            id: '1',
            username: 'admin',
            role: 'admin' as const
          };
          set({ isAuthenticated: true, user });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      changePassword: async (currentPassword: string, newPassword: string) => {
        // Verificar contraseña actual
        if (currentPassword !== ADMIN_CREDENTIALS.password) {
          return false;
        }
        
        // Actualizar contraseña (en producción esto sería una llamada al backend)
        ADMIN_CREDENTIALS.password = newPassword;
        return true;
      },
      requestPasswordReset: async (username: string) => {
        // Verificar que el usuario existe
        if (username !== ADMIN_CREDENTIALS.username) {
          return false;
        }
        
        // Generar token de recuperación (en producción esto sería enviado por email)
        const token = Math.random().toString(36).substring(2, 15);
        const expires = Date.now() + 15 * 60 * 1000; // 15 minutos
        resetTokens.set(token, { username, expires });
        
        // Simular envío de email
        console.log(`Token de recuperación: ${token}`);
        alert(`Token de recuperación generado: ${token}\n\nEn un entorno real, este token se enviaría por email.`);
        
        return true;
      },
      resetPassword: async (token: string, newPassword: string) => {
        const tokenData = resetTokens.get(token);
        
        if (!tokenData || tokenData.expires < Date.now()) {
          return false;
        }
        
        // Actualizar contraseña
        ADMIN_CREDENTIALS.password = newPassword;
        resetTokens.delete(token);
        
        return true;
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);