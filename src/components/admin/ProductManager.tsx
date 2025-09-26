import React, { useState } from 'react';
import { useThemeStore, themes } from '../../stores/themeStore';
import { useProductStore } from '../../stores/productStore';
import { Plus, Edit, Trash2, Upload, X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ProductForm {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  whatsappMessage?: string;
}

export const ProductManager: React.FC = () => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const { products, addProduct, updateProduct, removeProduct } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    whatsappMessage: ''
  });

  const categories = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Otros'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      whatsappMessage: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      whatsappMessage: product.whatsappMessage || ''
    });
    setEditingProduct(product.id);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      removeProduct(productId);
      toast.success('Producto eliminado correctamente');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      image: formData.image || 'https://via.placeholder.com/300x200?text=Sin+Imagen',
      whatsappMessage: formData.whatsappMessage
    };

    if (editingProduct) {
      updateProduct(editingProduct, productData);
      toast.success('Producto actualizado correctamente');
    } else {
      addProduct(productData);
      toast.success('Producto agregado correctamente');
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${currentTheme.colors.text}`}>
          Gestión de Productos
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className={`flex items-center px-4 py-2 rounded-md ${currentTheme.colors.primary} text-white hover:opacity-90 transition-opacity duration-200`}
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar Producto
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${currentTheme.colors.surface} rounded-lg shadow-lg`}>
            <div className={`p-6 border-b ${currentTheme.colors.border}`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${currentTheme.colors.text}`}>
                  {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
                </h2>
                <button
                  onClick={resetForm}
                  className={`p-2 rounded-md hover:bg-gray-100 ${currentTheme.colors.textSecondary}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                    placeholder="Ingresa el nombre del producto"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                    Categoría *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Descripción *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  placeholder="Describe el producto"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Precio *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Imagen del Producto
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Mensaje Personalizado de WhatsApp
                </label>
                <textarea
                  rows={2}
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsappMessage: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  placeholder="Mensaje personalizado para WhatsApp (opcional)"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-4 py-2 border rounded-md ${currentTheme.colors.border} ${currentTheme.colors.text} hover:bg-gray-50 transition-colors duration-200`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex items-center px-4 py-2 rounded-md ${currentTheme.colors.primary} text-white hover:opacity-90 transition-opacity duration-200`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={`${currentTheme.colors.surface} rounded-lg border ${currentTheme.colors.border}`}>
        <div className="p-6">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg overflow-hidden ${currentTheme.colors.border} hover:shadow-lg transition-shadow duration-200`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className={`font-semibold ${currentTheme.colors.text} mb-2`}>
                      {product.name}
                    </h3>
                    <p className={`text-sm ${currentTheme.colors.textSecondary} mb-2 line-clamp-2`}>
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-lg font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
                        ${product.price.toFixed(2)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${currentTheme.colors.textSecondary}`}>
                        {product.category}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${currentTheme.colors.textSecondary}`}>
              <Upload className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hay productos</h3>
              <p className="mb-4">Comienza agregando tu primer producto</p>
              <button
                onClick={() => setShowForm(true)}
                className={`inline-flex items-center px-4 py-2 rounded-md ${currentTheme.colors.primary} text-white hover:opacity-90 transition-opacity duration-200`}
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Producto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};