import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Orders } from './pages/Orders';
import { ProductPreview } from './pages/ProductPreview';
import { AdminPanel } from './components/admin/AdminPanel';
import { useThemeStore, themes } from './stores/themeStore';

function App() {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <ThemeProvider>
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${currentTheme.colors.background}`}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductPreview />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/pm" element={<AdminPanel />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            expand={true}
            richColors
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#1e40af' : '#ffffff',
                color: theme === 'dark' ? '#f9fafb' : theme === 'blue' ? '#ffffff' : '#111827',
                border: theme === 'dark' ? '1px solid #374151' : theme === 'blue' ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              },
              className: 'toast-custom',
            }}
          />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
