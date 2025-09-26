import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, User, Mail, Phone, MapPin, CreditCard, MessageCircle } from 'lucide-react';
import { useThemeStore, themes } from '../stores/themeStore';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { EmailService } from '../services/emailService';
import { WhatsAppService } from '../services/whatsappService';
import { toast } from 'sonner';

export const Orders: React.FC = () => {
  const { theme } = useThemeStore();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const { createOrder, orders } = useOrderStore();
  const currentTheme = themes[theme];
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removed showOrderForm state - form will show automatically when cart has items

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, address } = customerData;
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, ingresa un email válido');
      return false;
    }
    
    return true;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customerData,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        totalAmount: getTotalPrice()
      };
      
      const order = createOrder(orderData.customerData, orderData.items, orderData.totalAmount);
      const orderNumber = order.id.slice(-8);
      
      // Preparar datos para servicios externos
      const emailData = {
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        customerAddress: `${customerData.address}, ${customerData.city} ${customerData.postalCode}`.trim(),
        orderItems: orderData.items,
        totalAmount: orderData.totalAmount,
        orderNumber,
        orderDate: new Date().toLocaleDateString('es-ES')
      };
      
      const whatsappData = {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        orderItems: orderData.items,
        totalAmount: orderData.totalAmount,
        orderNumber
      };
      
      // Enviar notificaciones
      try {
        await EmailService.sendOrderNotification(emailData);
        await EmailService.sendCustomerConfirmation(emailData);
        toast.success('📧 Emails enviados correctamente');
      } catch (emailError) {
        console.error('Error enviando emails:', emailError);
        toast.warning('Pedido creado, pero hubo un problema enviando los emails');
      }
      
      // Mostrar opciones de WhatsApp
      setTimeout(() => {
        const shouldSendWhatsApp = window.confirm(
          '¿Deseas enviar los detalles del pedido por WhatsApp?'
        );
        
        if (shouldSendWhatsApp) {
          WhatsAppService.sendOrderToBusiness(whatsappData);
          setTimeout(() => {
            const shouldSendToCustomer = window.confirm(
              '¿Deseas enviar confirmación al cliente por WhatsApp?'
            );
            if (shouldSendToCustomer) {
              WhatsAppService.sendOrderToCustomer(whatsappData);
            }
          }, 1000);
        }
      }, 1500);
      
      clearCart();
      setCustomerData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
      });
      
      toast.success('¡Pedido realizado con éxito!');
    } catch (error) {
      console.error('Error procesando pedido:', error);
      toast.error('Error al procesar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${currentTheme.colors.text}`}>
            Mis Pedidos
          </h1>
          <p className={currentTheme.colors.textSecondary}>
            Gestiona tu carrito de compras y realiza pedidos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shopping Cart */}
          <div className={`rounded-lg p-6 ${currentTheme.colors.surface} shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${currentTheme.colors.text} flex items-center`}>
                <ShoppingBag className="mr-2" size={20} />
                Pedidos de Compras
              </h2>
              <span className={`text-sm ${currentTheme.colors.textSecondary}`}>
                {items.length} {items.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className={`mx-auto mb-4 ${currentTheme.colors.textSecondary}`} size={48} />
                <p className={`text-lg ${currentTheme.colors.textSecondary}`}>
                  Tu carrito está vacío
                </p>
                <p className={`text-sm ${currentTheme.colors.textSecondary} mt-2`}>
                  Agrega productos desde el catálogo
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg ${currentTheme.colors.secondary} animate-fadeIn`}
                  >
                    <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/64x64/e5e7eb/6b7280?text=${encodeURIComponent(item.product.name.charAt(0))}`;
                        }}
                      />
                    <div className="flex-1">
                      <h3 className={`font-medium ${currentTheme.colors.text}`}>
                        {item.product.name}
                      </h3>
                      <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
                        ${item.product.price} c/u
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className={`p-1 rounded ${currentTheme.colors.accent} ${currentTheme.colors.text} hover:${currentTheme.colors.primary} hover:text-white transition-colors`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className={`w-8 text-center ${currentTheme.colors.text}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className={`p-1 rounded ${currentTheme.colors.accent} ${currentTheme.colors.text} hover:${currentTheme.colors.primary} hover:text-white transition-colors`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${currentTheme.colors.text}`}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className={`border-t pt-4 ${currentTheme.colors.border}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-lg font-semibold ${currentTheme.colors.text}`}>
                      Total:
                    </span>
                    <span className={`text-xl font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  
                  {/* WhatsApp Contact Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        const businessInfo = WhatsAppService.getBusinessInfo();
                        const message = `Hola! Me interesa hacer una consulta sobre los productos en mi carrito. Total: $${getTotalPrice().toFixed(2)}`;
                        const whatsappURL = `https://wa.me/${businessInfo.phoneNumber || '+1234567890'}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappURL, '_blank');
                      }}
                      className={`
                        w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
                        bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500
                      `}
                    >
                      <MessageCircle size={18} />
                      <span>Consultar por WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Form */}
          <div className={`rounded-lg p-6 ${currentTheme.colors.surface} shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-6 ${currentTheme.colors.text} flex items-center`}>
              <CreditCard className="mr-2" size={20} />
              Información de Entrega
            </h2>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <User className={`mx-auto mb-4 ${currentTheme.colors.textSecondary}`} size={48} />
                <p className={`text-lg ${currentTheme.colors.textSecondary}`}>
                  Completa tu carrito para continuar
                </p>
                <p className={`text-sm ${currentTheme.colors.textSecondary} mt-2`}>
                  Agrega productos y procede al checkout
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme.colors.text}`}>
                      <User size={16} className="inline mr-1" />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerData.name}
                      onChange={handleInputChange}
                      required
                      className={`
                        w-full px-3 py-2 rounded-lg border transition-colors duration-200
                        ${currentTheme.colors.secondary} ${currentTheme.colors.border} ${currentTheme.colors.text}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme.colors.text}`}>
                      <Mail size={16} className="inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerData.email}
                      onChange={handleInputChange}
                      required
                      className={`
                        w-full px-3 py-2 rounded-lg border transition-colors duration-200
                        ${currentTheme.colors.secondary} ${currentTheme.colors.border} ${currentTheme.colors.text}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme.colors.text}`}>
                      <Phone size={16} className="inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleInputChange}
                      required
                      className={`
                        w-full px-3 py-2 rounded-lg border transition-colors duration-200
                        ${currentTheme.colors.secondary} ${currentTheme.colors.border} ${currentTheme.colors.text}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme.colors.text}`}>
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerData.city}
                      onChange={handleInputChange}
                      className={`
                        w-full px-3 py-2 rounded-lg border transition-colors duration-200
                        ${currentTheme.colors.secondary} ${currentTheme.colors.border} ${currentTheme.colors.text}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.colors.text}`}>
                    <MapPin size={16} className="inline mr-1" />
                    Dirección *
                  </label>
                  <textarea
                    name="address"
                    value={customerData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors duration-200
                      ${currentTheme.colors.secondary} ${currentTheme.colors.border} ${currentTheme.colors.text}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.colors.text}`}>
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={customerData.postalCode}
                    onChange={handleInputChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors duration-200
                      ${currentTheme.colors.secondary} ${currentTheme.colors.border} ${currentTheme.colors.text}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  />
                </div>

                <div className={`p-4 rounded-lg ${currentTheme.colors.accent}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${currentTheme.colors.text}`}>Total del Pedido:</span>
                    <span className={`text-xl font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <p className={`text-xs ${currentTheme.colors.textSecondary}`}>
                    * Campos obligatorios
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className={`
                      flex-1 py-3 rounded-lg font-medium transition-colors duration-200
                      ${currentTheme.colors.secondary} ${currentTheme.colors.text}
                      hover:${currentTheme.colors.accent}
                    `}
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      flex-1 py-3 rounded-lg font-medium transition-all duration-200
                      ${currentTheme.colors.primary} text-white ${currentTheme.colors.primaryHover}
                      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Order History */}
        {orders.length > 0 && (
          <div className={`mt-8 rounded-lg p-6 ${currentTheme.colors.surface} shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-6 ${currentTheme.colors.text}`}>
              Historial de Pedidos
            </h2>
            <div className="space-y-4">
              {orders.slice(-5).reverse().map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg ${currentTheme.colors.secondary} animate-fadeIn`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`font-medium ${currentTheme.colors.text}`}>
                        Pedido #{order.id.slice(-8)}
                      </p>
                      <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
                        {new Date(order.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
                        ${(order.totalAmount || 0).toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${currentTheme.colors.accent} ${currentTheme.colors.textSecondary}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;