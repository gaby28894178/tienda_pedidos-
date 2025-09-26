import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, User, Calendar, DollarSign, Eye, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { useThemeStore, themes } from '../../stores/themeStore';
import { useOrderStore, Order } from '../../stores/orderStore';
import { toast } from 'sonner';

const OrderManager: React.FC = () => {
  const { theme } = useThemeStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const currentTheme = themes[theme];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtrar y buscar pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customerData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, searchTerm, statusFilter]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Estado del pedido actualizado a ${getStatusLabel(newStatus)}`);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'confirmed': return <CheckCircle size={16} className="text-blue-500" />;
      case 'shipped': return <Truck size={16} className="text-purple-500" />;
      case 'delivered': return <Package size={16} className="text-green-500" />;
      default: return <XCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      default: return 'Desconocido';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className={`p-6 ${currentTheme.colors.background} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${currentTheme.colors.text} mb-2`}>
            Gestión de Pedidos
          </h1>
          <p className={`${currentTheme.colors.textSecondary}`}>
            Administra y actualiza el estado de todos los pedidos
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className={`${currentTheme.colors.secondary} rounded-lg p-6 mb-6`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.colors.textSecondary}`} size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o ID de pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${currentTheme.colors.background} ${currentTheme.colors.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>
            
            {/* Filtro por estado */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.colors.textSecondary}`} size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | Order['status'])}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${currentTheme.colors.background} ${currentTheme.colors.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {['pending', 'confirmed', 'shipped', 'delivered'].map((status) => {
            const count = orders.filter(order => order.status === status).length;
            return (
              <div key={status} className={`${currentTheme.colors.secondary} rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
                      {getStatusLabel(status as Order['status'])}
                    </p>
                    <p className={`text-2xl font-bold ${currentTheme.colors.text}`}>
                      {count}
                    </p>
                  </div>
                  {getStatusIcon(status as Order['status'])}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabla de pedidos */}
        <div className={`${currentTheme.colors.secondary} rounded-lg overflow-hidden`}>
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Package size={48} className={`mx-auto ${currentTheme.colors.textSecondary} mb-4`} />
              <h3 className={`text-lg font-semibold ${currentTheme.colors.text} mb-2`}>
                No se encontraron pedidos
              </h3>
              <p className={`${currentTheme.colors.textSecondary}`}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay pedidos registrados'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${currentTheme.colors.background}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.colors.text}`}>
                      ID Pedido
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.colors.text}`}>
                      Cliente
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.colors.text}`}>
                      Fecha
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.colors.text}`}>
                      Total
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.colors.text}`}>
                      Estado
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.colors.text}`}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      className={`border-t ${currentTheme.colors.background} hover:${currentTheme.colors.accent} transition-colors`}
                    >
                      <td className={`px-6 py-4 text-sm ${currentTheme.colors.text}`}>
                        <div className="font-mono">
                          {order.id.substring(0, 12)}...
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${currentTheme.colors.text}`}>
                        <div>
                          <div className="font-semibold">{order.customerData.name}</div>
                          <div className={`text-xs ${currentTheme.colors.textSecondary}`}>
                            {order.customerData.email}
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${currentTheme.colors.text}`}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td className={`px-6 py-4 text-sm font-semibold ${currentTheme.colors.text}`}>
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className={`p-2 rounded-lg ${currentTheme.colors.accent} ${currentTheme.colors.text} hover:${currentTheme.colors.primary} hover:text-white transition-colors`}
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          
                          {/* Botones de cambio de estado */}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'confirmed')}
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                              title="Confirmar pedido"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'shipped')}
                              className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                              title="Marcar como enviado"
                            >
                              <Truck size={16} />
                            </button>
                          )}
                          
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                              title="Marcar como entregado"
                            >
                              <Package size={16} />
                            </button>
                          )}
                          
                          {/* Dropdown para cambio directo de estado */}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                            className="text-xs px-2 py-1 rounded border bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de detalles del pedido */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.colors.secondary} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.colors.text}`}>
                    Detalles del Pedido
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className={`p-2 rounded-lg ${currentTheme.colors.accent} ${currentTheme.colors.text} hover:${currentTheme.colors.primary} hover:text-white transition-colors`}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
                
                {/* Información del pedido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className={`text-lg font-semibold ${currentTheme.colors.text} mb-3`}>
                      Información del Cliente
                    </h3>
                    <div className="space-y-2">
                      <p className={`${currentTheme.colors.text}`}>
                        <span className="font-semibold">Nombre:</span> {selectedOrder.customerData.name}
                      </p>
                      <p className={`${currentTheme.colors.text}`}>
                        <span className="font-semibold">Email:</span> {selectedOrder.customerData.email}
                      </p>
                      <p className={`${currentTheme.colors.text}`}>
                        <span className="font-semibold">Teléfono:</span> {selectedOrder.customerData.phone}
                      </p>
                      <p className={`${currentTheme.colors.text}`}>
                        <span className="font-semibold">Dirección:</span> {selectedOrder.customerData.address}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-semibold ${currentTheme.colors.text} mb-3`}>
                      Información del Pedido
                    </h3>
                    <div className="space-y-2">
                      <p className={`${currentTheme.colors.text}`}>
                        <span className="font-semibold">ID:</span> {selectedOrder.id}
                      </p>
                      <p className={`${currentTheme.colors.text}`}>
                        <span className="font-semibold">Fecha:</span> {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p className={`${currentTheme.colors.text}`}>
                        <span className="font-semibold">Estado:</span>
                        <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          {getStatusLabel(selectedOrder.status)}
                        </span>
                      </p>
                      <p className={`${currentTheme.colors.text}`}>
                        <span className="font-semibold">Total:</span> {formatCurrency(selectedOrder.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Productos del pedido */}
                <div>
                  <h3 className={`text-lg font-semibold ${currentTheme.colors.text} mb-3`}>
                    Productos ({selectedOrder.items.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className={`flex items-center space-x-4 p-3 rounded-lg ${currentTheme.colors.background}`}>
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/48x48/e5e7eb/6b7280?text=${encodeURIComponent(item.product.name.charAt(0))}`;
                          }}
                        />
                        <div className="flex-1">
                          <h4 className={`font-semibold ${currentTheme.colors.text}`}>
                            {item.product.name}
                          </h4>
                          <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
                            {formatCurrency(item.product.price)} x {item.quantity}
                          </p>
                        </div>
                        <div className={`text-right ${currentTheme.colors.text} font-semibold`}>
                          {formatCurrency(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;