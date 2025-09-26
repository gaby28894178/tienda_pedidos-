import React, { useEffect, useState } from 'react';
import { Search, Filter, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useThemeStore, themes } from '../stores/themeStore';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';

export const Catalog: React.FC = () => {
  const { theme } = useThemeStore();
  const {
    filteredProducts,
    categories,
    selectedCategory,
    searchTerm,
    loading,
    error,
    loadProducts,
    setSelectedCategory,
    setSearchTerm
  } = useProductStore();
  const { addToCart, items } = useCartStore();
  const currentTheme = themes[theme];
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getCartQuantity = (productId: string) => {
    const item = items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.colors.primary.replace('bg-', 'border-')}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`text-center p-8 rounded-lg ${currentTheme.colors.surface}`}>
          <p className={`text-lg ${currentTheme.colors.text}`}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${currentTheme.colors.text}`}>
            Catálogo de Productos
          </h1>
          <p className={currentTheme.colors.textSecondary}>
            Explora nuestra colección completa de productos
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.colors.textSecondary}`} size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200
                ${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.text}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
              ${currentTheme.colors.secondary} ${currentTheme.colors.text}
              hover:${currentTheme.colors.accent}
            `}
          >
            <Filter size={16} />
            <span>Filtros</span>
          </button>

          {/* Category Filters */}
          {showFilters && (
            <div className={`p-4 rounded-lg ${currentTheme.colors.surface} ${currentTheme.colors.border} border animate-fadeIn`}>
              <h3 className={`font-semibold mb-3 ${currentTheme.colors.text}`}>Categorías</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${!selectedCategory
                      ? `${currentTheme.colors.primary} text-white`
                      : `${currentTheme.colors.secondary} ${currentTheme.colors.textSecondary} hover:${currentTheme.colors.accent}`
                    }
                  `}
                >
                  Todos
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                      ${selectedCategory === category.id
                        ? `${currentTheme.colors.primary} text-white`
                        : `${currentTheme.colors.secondary} ${currentTheme.colors.textSecondary} hover:${currentTheme.colors.accent}`
                      }
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const cartQuantity = getCartQuantity(product.id);
            return (
              <div
                key={product.id}
                className={`
                  rounded-lg overflow-hidden shadow-lg transition-all duration-200 hover:scale-105
                  ${currentTheme.colors.surface} animate-fadeIn
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/300x200/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                  {cartQuantity > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-bounce-custom">
                      {cartQuantity}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className={`text-lg font-semibold mb-2 ${currentTheme.colors.text}`}>
                    {product.name}
                  </h3>
                  <p className={`text-sm mb-3 ${currentTheme.colors.textSecondary} line-clamp-2`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xl font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
                      ${product.price}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${currentTheme.colors.accent} ${currentTheme.colors.textSecondary}`}>
                      {categories.find(c => c.id === product.category)?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`
                      w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg
                      font-medium transition-all duration-200
                      ${currentTheme.colors.primary} text-white ${currentTheme.colors.primaryHover}
                      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  >
                    <ShoppingCart size={16} />
                    <span>Agregar al Carrito</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${currentTheme.colors.textSecondary}`}>
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;