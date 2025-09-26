import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react';
import { useThemeStore, themes } from '../stores/themeStore';
import { useProductStore } from '../stores/productStore';

export const Home: React.FC = () => {
  const { theme } = useThemeStore();
  const { products, loadProducts, loading } = useProductStore();
  const currentTheme = themes[theme];

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const featuredProducts = products.slice(0, 3);

  const features = [
    {
      icon: <ShoppingBag size={24} />,
      title: 'Amplio Catálogo',
      description: 'Encuentra productos de calidad en todas nuestras categorías'
    },
    {
      icon: <Truck size={24} />,
      title: 'Envío Rápido',
      description: 'Entrega rápida y segura en todo el país'
    },
    {
      icon: <Shield size={24} />,
      title: 'Compra Segura',
      description: 'Tus datos y pagos están completamente protegidos'
    },
    {
      icon: <Star size={24} />,
      title: 'Calidad Garantizada',
      description: 'Productos de las mejores marcas con garantía'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`py-20 px-4 ${currentTheme.colors.accent}`}>
        <div className="container mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${currentTheme.colors.text} animate-fadeIn`}>
            Bienvenido a TiendaOnline
          </h1>
          <p className={`text-xl mb-8 ${currentTheme.colors.textSecondary} max-w-2xl mx-auto animate-fadeIn`}>
            Descubre nuestra increíble colección de zapatillas, ropa, bolsos y accesorios. 
            Calidad premium a precios increíbles.
          </p>
          <Link
            to="/catalog"
            className={`
              inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-lg
              ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover}
              transform transition-all duration-200 hover:scale-105 shadow-lg
              animate-fadeIn
            `}
          >
            <ShoppingBag className="mr-2" size={20} />
            Explorar Catálogo
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 px-4 ${currentTheme.colors.background}`}>
        <div className="container mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${currentTheme.colors.text}`}>
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`
                  text-center p-6 rounded-lg transition-all duration-200 hover:scale-105
                  ${currentTheme.colors.surface} ${currentTheme.colors.border} border
                  animate-fadeIn
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${currentTheme.colors.primary} text-white`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${currentTheme.colors.text}`}>
                  {feature.title}
                </h3>
                <p className={currentTheme.colors.textSecondary}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`py-16 px-4 ${currentTheme.colors.accent}`}>
        <div className="container mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${currentTheme.colors.text}`}>
            Productos Destacados
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.colors.primary.replace('bg-', 'border-')}`}></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`
                    rounded-lg overflow-hidden shadow-lg transition-all duration-200 hover:scale-105
                    ${currentTheme.colors.surface} animate-fadeIn
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className={`text-lg font-semibold mb-2 ${currentTheme.colors.text}`}>
                      {product.name}
                    </h3>
                    <p className={`mb-4 ${currentTheme.colors.textSecondary}`}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${currentTheme.colors.primary.replace('bg-', 'text-')}`}>
                        ${product.price}
                      </span>
                      <Link
                        to="/catalog"
                        className={`
                          px-4 py-2 text-sm font-medium text-white rounded-lg
                          ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover}
                          transition-colors duration-200
                        `}
                      >
                        Ver más
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;