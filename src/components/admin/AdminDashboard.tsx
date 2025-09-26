import React from 'react';
import { useThemeStore, themes } from '../../stores/themeStore';
import { useProductStore } from '../../stores/productStore';
import { useOrderStore } from '../../stores/orderStore';
import { Package, ShoppingCart, MessageCircle, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const { products } = useProductStore();
  const { orders } = useOrderStore();

  const stats = [
    {
      title: 'Total Productos',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Pedidos Totales',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Mensajes WhatsApp',
      value: orders.length * 2, // Estimación
      icon: MessageCircle,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Conversiones',
      value: `${Math.round((orders.length / (products.length || 1)) * 100)}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  const recentOrders = orders.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`${currentTheme.colors.surface} rounded-lg p-6 border ${currentTheme.colors.border}`}>
        <h1 className={`text-2xl font-bold ${currentTheme.colors.text} mb-2`}>
          Bienvenido al Panel de Administración
        </h1>
        <p className={`${currentTheme.colors.textSecondary}`}>
          Gestiona productos, configuraciones de WhatsApp y revisa estadísticas de tu tienda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${currentTheme.colors.surface} rounded-lg p-6 border ${currentTheme.colors.border}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${currentTheme.colors.textSecondary}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${currentTheme.colors.text}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
                <span className={`text-sm ${currentTheme.colors.textSecondary} ml-2`}>
                  vs mes anterior
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className={`${currentTheme.colors.surface} rounded-lg border ${currentTheme.colors.border}`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className={`text-lg font-semibold ${currentTheme.colors.text}`}>
            Pedidos Recientes
          </h2>
        </div>
        <div className="p-6">
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${currentTheme.colors.border}`}
                >
                  <div>
                    <p className={`font-medium ${currentTheme.colors.text}`}>
                      {order.customerData.name}
                    </p>
                    <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
                      {order.customerData.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${currentTheme.colors.text}`}>
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                    <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${currentTheme.colors.textSecondary}`}>
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay pedidos recientes</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${currentTheme.colors.surface} rounded-lg p-6 border ${currentTheme.colors.border}`}>
        <h2 className={`text-lg font-semibold ${currentTheme.colors.text} mb-4`}>
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className={`p-4 rounded-lg border-2 border-dashed ${currentTheme.colors.border} hover:border-blue-300 transition-colors duration-200`}>
            <Package className={`h-8 w-8 ${currentTheme.colors.textSecondary} mx-auto mb-2`} />
            <p className={`text-sm font-medium ${currentTheme.colors.text}`}>
              Agregar Producto
            </p>
          </button>
          <button className={`p-4 rounded-lg border-2 border-dashed ${currentTheme.colors.border} hover:border-green-300 transition-colors duration-200`}>
            <MessageCircle className={`h-8 w-8 ${currentTheme.colors.textSecondary} mx-auto mb-2`} />
            <p className={`text-sm font-medium ${currentTheme.colors.text}`}>
              Configurar WhatsApp
            </p>
          </button>
          <button className={`p-4 rounded-lg border-2 border-dashed ${currentTheme.colors.border} hover:border-purple-300 transition-colors duration-200`}>
            <TrendingUp className={`h-8 w-8 ${currentTheme.colors.textSecondary} mx-auto mb-2`} />
            <p className={`text-sm font-medium ${currentTheme.colors.text}`}>
              Ver Estadísticas
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};