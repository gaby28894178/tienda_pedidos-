import React, { useState, useEffect } from 'react';
import { useThemeStore, themes } from '../../stores/themeStore';
import { MessageCircle, Save, Phone, Mail, Building } from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppConfigData {
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  orderConfirmationMessage: string;
  orderStatusMessage: string;
  welcomeMessage: string;
  supportMessage: string;
}

export const WhatsAppConfig: React.FC = () => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [config, setConfig] = useState<WhatsAppConfigData>({
    phoneNumber: '',
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    orderConfirmationMessage: '',
    orderStatusMessage: '',
    welcomeMessage: '',
    supportMessage: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      // Cargar configuración desde el archivo JSON existente
      const response = await fetch('/src/data/whatsapp-config.json');
      if (response.ok) {
        const data = await response.json();
        setConfig({
          phoneNumber: data.phoneNumber || '',
          businessName: data.businessInfo?.name || '',
          businessAddress: data.businessInfo?.address || '',
          businessEmail: data.emailConfig?.supportEmail || '',
          orderConfirmationMessage: data.messages?.orderConfirmation || '',
          orderStatusMessage: data.messages?.orderStatus || '',
          welcomeMessage: data.messages?.welcome || '',
          supportMessage: data.messages?.support || ''
        });
      }
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // En un entorno real, esto sería una llamada a la API
      // Por ahora, solo guardamos en localStorage
      const configData = {
        phoneNumber: config.phoneNumber,
        businessInfo: {
          name: config.businessName,
          address: config.businessAddress
        },
        emailConfig: {
          supportEmail: config.businessEmail,
          orderEmail: config.businessEmail
        },
        messages: {
          orderConfirmation: config.orderConfirmationMessage,
          orderStatus: config.orderStatusMessage,
          welcome: config.welcomeMessage,
          support: config.supportMessage
        }
      };
      
      localStorage.setItem('whatsapp-config', JSON.stringify(configData));
      toast.success('Configuración de WhatsApp guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof WhatsAppConfigData, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const testWhatsApp = () => {
    if (!config.phoneNumber) {
      toast.error('Por favor ingresa un número de teléfono');
      return;
    }
    
    const message = encodeURIComponent(config.welcomeMessage || 'Hola, me interesa conocer más sobre sus productos.');
    const url = `https://wa.me/${config.phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${currentTheme.colors.text}`}>
          Configuración de WhatsApp
        </h1>
        <button
          onClick={testWhatsApp}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Probar WhatsApp
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <div className={`${currentTheme.colors.surface} rounded-lg p-6 border ${currentTheme.colors.border}`}>
          <h2 className={`text-lg font-semibold ${currentTheme.colors.text} mb-4 flex items-center`}>
            <Building className="h-5 w-5 mr-2" />
            Información del Negocio
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                Número de WhatsApp
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.colors.textSecondary}`} />
                <input
                  type="tel"
                  value={config.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                Nombre del Negocio
              </label>
              <input
                type="text"
                value={config.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                placeholder="Mi Tienda"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                Dirección
              </label>
              <input
                type="text"
                value={config.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                placeholder="Calle Principal 123"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                Email de Contacto
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.colors.textSecondary}`} />
                <input
                  type="email"
                  value={config.businessEmail}
                  onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  placeholder="contacto@mitienda.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message Templates */}
        <div className={`${currentTheme.colors.surface} rounded-lg p-6 border ${currentTheme.colors.border}`}>
          <h2 className={`text-lg font-semibold ${currentTheme.colors.text} mb-4 flex items-center`}>
            <MessageCircle className="h-5 w-5 mr-2" />
            Plantillas de Mensajes
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                Mensaje de Bienvenida
              </label>
              <textarea
                rows={3}
                value={config.welcomeMessage}
                onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                placeholder="¡Hola! Bienvenido a nuestra tienda..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                Confirmación de Pedido
              </label>
              <textarea
                rows={3}
                value={config.orderConfirmationMessage}
                onChange={(e) => handleInputChange('orderConfirmationMessage', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                placeholder="Gracias por tu pedido. Hemos recibido..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                Estado del Pedido
              </label>
              <textarea
                rows={3}
                value={config.orderStatusMessage}
                onChange={(e) => handleInputChange('orderStatusMessage', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                placeholder="Tu pedido está siendo procesado..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                Mensaje de Soporte
              </label>
              <textarea
                rows={3}
                value={config.supportMessage}
                onChange={(e) => handleInputChange('supportMessage', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                placeholder="¿Necesitas ayuda? Estamos aquí para..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`flex items-center px-6 py-3 rounded-md ${currentTheme.colors.primary} text-white hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Save className="h-5 w-5 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {/* Preview Section */}
      <div className={`${currentTheme.colors.surface} rounded-lg p-6 border ${currentTheme.colors.border}`}>
        <h2 className={`text-lg font-semibold ${currentTheme.colors.text} mb-4`}>
          Vista Previa del Mensaje
        </h2>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="font-medium text-green-800">
              {config.businessName || 'Mi Tienda'}
            </span>
          </div>
          <p className="text-green-700">
            {config.welcomeMessage || 'Mensaje de bienvenida aparecerá aquí...'}
          </p>
        </div>
      </div>
    </div>
  );
};