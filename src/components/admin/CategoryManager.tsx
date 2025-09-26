import React, { useState } from 'react';
import { useThemeStore, themes } from '../../stores/themeStore';
import { useProductStore } from '../../stores/productStore';
import { Plus, Edit, Trash2, Tag, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  productCount: number;
}

export const CategoryManager: React.FC = () => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const { products } = useProductStore();
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Electrónicos', description: 'Dispositivos y gadgets electrónicos', color: 'bg-blue-500', productCount: 0 },
    { id: '2', name: 'Ropa', description: 'Vestimenta y accesorios', color: 'bg-purple-500', productCount: 0 },
    { id: '3', name: 'Hogar', description: 'Artículos para el hogar', color: 'bg-green-500', productCount: 0 },
    { id: '4', name: 'Deportes', description: 'Equipamiento deportivo', color: 'bg-orange-500', productCount: 0 },
    { id: '5', name: 'Libros', description: 'Libros y material educativo', color: 'bg-red-500', productCount: 0 },
    { id: '6', name: 'Otros', description: 'Productos varios', color: 'bg-gray-500', productCount: 0 }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500'
  });

  const colorOptions = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
    'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500',
    'bg-teal-500', 'bg-gray-500'
  ];

  // Calcular el número de productos por categoría
  React.useEffect(() => {
    setCategories(prev => prev.map(category => ({
      ...category,
      productCount: products.filter(product => product.category === category.name).length
    })));
  }, [products]);

  const resetForm = () => {
    setFormData({ name: '', description: '', color: 'bg-blue-500' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setEditingCategory(category.id);
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.productCount > 0) {
      toast.error('No puedes eliminar una categoría que tiene productos asignados');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      toast.success('Categoría eliminada correctamente');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = categories.find(c => 
      c.name.toLowerCase() === formData.name.toLowerCase() && c.id !== editingCategory
    );
    
    if (existingCategory) {
      toast.error('Ya existe una categoría con ese nombre');
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(category => 
        category.id === editingCategory
          ? { ...category, ...formData }
          : category
      ));
      toast.success('Categoría actualizada correctamente');
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        productCount: 0
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success('Categoría agregada correctamente');
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${currentTheme.colors.text}`}>
          Gestión de Categorías
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className={`flex items-center px-4 py-2 rounded-md ${currentTheme.colors.primary} text-white hover:opacity-90 transition-opacity duration-200`}
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar Categoría
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`max-w-md w-full mx-4 ${currentTheme.colors.surface} rounded-lg shadow-lg`}>
            <div className={`p-6 border-b ${currentTheme.colors.border}`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${currentTheme.colors.text}`}>
                  {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
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
              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  placeholder="Ingresa el nombre de la categoría"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}`}
                  placeholder="Describe la categoría (opcional)"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.colors.text} mb-2`}>
                  Color de la Categoría
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-md ${color} border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      } hover:scale-110 transition-transform duration-200`}
                    />
                  ))}
                </div>
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
                  {editingCategory ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className={`${currentTheme.colors.surface} rounded-lg border ${currentTheme.colors.border}`}>
        <div className="p-6">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`border rounded-lg p-6 ${currentTheme.colors.border} hover:shadow-lg transition-shadow duration-200`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${category.color} mr-3`} />
                      <h3 className={`font-semibold ${currentTheme.colors.text}`}>
                        {category.name}
                      </h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${currentTheme.colors.textSecondary}`}>
                      {category.productCount} productos
                    </span>
                  </div>
                  
                  <p className={`text-sm ${currentTheme.colors.textSecondary} mb-4 min-h-[3rem]`}>
                    {category.description || 'Sin descripción'}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={category.productCount > 0}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors duration-200 ${
                        category.productCount > 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${currentTheme.colors.textSecondary}`}>
              <Tag className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hay categorías</h3>
              <p className="mb-4">Comienza agregando tu primera categoría</p>
              <button
                onClick={() => setShowForm(true)}
                className={`inline-flex items-center px-4 py-2 rounded-md ${currentTheme.colors.primary} text-white hover:opacity-90 transition-opacity duration-200`}
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Categoría
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className={`${currentTheme.colors.surface} rounded-lg p-6 border ${currentTheme.colors.border}`}>
        <h2 className={`text-lg font-semibold ${currentTheme.colors.text} mb-4`}>
          Estadísticas de Categorías
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className={`text-2xl font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
              {categories.length}
            </p>
            <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
              Total Categorías
            </p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
            </p>
            <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
              Total Productos
            </p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
              {categories.filter(cat => cat.productCount > 0).length}
            </p>
            <p className={`text-sm ${currentTheme.colors.textSecondary}`}>
              Categorías Activas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};