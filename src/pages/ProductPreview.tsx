import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import { useThemeStore, themes } from '../stores/themeStore';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { toast } from 'sonner';
import { toast as toastify } from 'react-toastify';

export const ProductPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { products, categories, loadProducts } = useProductStore();
  const { addToCart, items } = useCartStore();
  const currentTheme = themes[theme];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products.length === 0) {
      loadProducts().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [products, loadProducts]);

  const product = products.find(p => p.id === id);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.colors.primary.replace('bg-', 'border-')}`}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`text-center p-8 rounded-lg ${currentTheme.colors.surface}`}>
          <p className={`text-lg ${currentTheme.colors.text} mb-4`}>Producto no encontrado</p>
          <button
            onClick={() => navigate('/catalog')}
            className={`px-4 py-2 rounded-lg ${currentTheme.colors.primary} text-white hover:${currentTheme.colors.primaryHover} transition-colors duration-200`}
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  // Para futuras implementaciones con múltiples imágenes
  // Por ahora, creamos un array con la imagen actual
  const images = [product.image_url];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Producto agregado al carrito');
  };

  const getCartQuantity = () => {
    const item = items.find(item => item.product.id === product.id);
    return item ? item.quantity : 0;
  };

  const categoryName = categories.find(c => c.id === product.category)?.name || 'Sin categoría';
  const cartQuantity = getCartQuantity();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header con botón de regreso */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/catalog')}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
              ${currentTheme.colors.secondary} ${currentTheme.colors.text}
              hover:${currentTheme.colors.accent}
            `}
          >
            <ArrowLeft size={20} />
            <span>Volver al Catálogo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sección de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className={`relative rounded-lg overflow-hidden ${currentTheme.colors.surface} shadow-lg`}>
              <div className="aspect-square relative">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/600x600/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                
                {/* Controles del carrusel - solo si hay múltiples imágenes */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
                
                {/* Indicador de cantidad en carrito */}
                {cartQuantity > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-sm rounded-full px-3 py-1 font-semibold animate-bounce-custom">
                    {cartQuantity} en carrito
                  </div>
                )}
              </div>
            </div>

            {/* Miniaturas - solo si hay múltiples imágenes */}
            {hasMultipleImages && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`
                      flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200
                      ${index === currentImageIndex 
                        ? `border-blue-500 ${currentTheme.colors.primary.replace('bg-', 'border-')}` 
                        : `border-gray-300 ${currentTheme.colors.border}`
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${currentTheme.colors.accent} ${currentTheme.colors.textSecondary}`}>
                {categoryName}
              </span>
              <h1 className={`text-3xl font-bold mb-4 ${currentTheme.colors.text}`}>
                {product.name}
              </h1>
              <p className={`text-lg leading-relaxed ${currentTheme.colors.textSecondary}`}>
                {product.description}
              </p>
            </div>

            <div className="border-t border-b py-6">
              <div className="flex items-center justify-between">
                <span className={`text-4xl font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
                  ${product.price}
                </span>
                <div className={`text-sm ${currentTheme.colors.textSecondary}`}>
                  {product.available ? (
                    <span className="text-green-500 font-medium">✓ Disponible</span>
                  ) : (
                    <span className="text-red-500 font-medium">✗ No disponible</span>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.available}
                className={`
                  w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg
                  font-semibold text-lg transition-all duration-200
                  ${product.available
                    ? `${currentTheme.colors.primary} text-white hover:${currentTheme.colors.primaryHover} hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500`
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                <ShoppingCart size={24} />
                <span>
                  {cartQuantity > 0 
                    ? `Agregar más (${cartQuantity} en carrito)` 
                    : 'Agregar al Carrito'
                  }
                </span>
              </button>

              <button
                onClick={() => toastify.info('función no está activa en este momento')}
                className={`
                  w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-lg
                  font-medium transition-all duration-200 border-2
                  ${currentTheme.colors.border} ${currentTheme.colors.text}
                  hover:${currentTheme.colors.accent}
                `}
              >
                <Heart size={20} />
                <span>Agregar a Favoritos</span>
              </button>
            </div>

            {/* Información adicional */}
            <div className={`p-4 rounded-lg ${currentTheme.colors.surface} ${currentTheme.colors.border} border`}>
              <h3 className={`font-semibold mb-2 ${currentTheme.colors.text}`}>Información del Producto</h3>
              <ul className={`space-y-1 text-sm ${currentTheme.colors.textSecondary}`}>
                <li>• Envío gratuito en pedidos superiores a $50</li>
                <li>• Garantía de satisfacción de 30 días</li>
                <li>• Soporte al cliente 24/7</li>
                <li>• Devoluciones fáciles y rápidas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;