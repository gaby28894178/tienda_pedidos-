# Catálogo de Productos - Sistema de Gestión

Un sistema completo de catálogo de productos con panel de administración, integración de WhatsApp y gestión de pedidos.

## 🚀 Características

- **Catálogo de Productos**: Visualización de productos con filtros y búsqueda
- **Carrito de Compras**: Gestión de productos en el carrito
- **Integración WhatsApp**: Envío automático de pedidos por WhatsApp
- **Panel de Administración**: Gestión completa de productos, categorías y configuración
- **Temas**: Soporte para múltiples temas (claro, oscuro, azul)
- **Responsive**: Diseño adaptable a dispositivos móviles

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd muestras-productos
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── admin/           # Componentes del panel de administración
│   │   ├── AdminPanel.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── ProductManager.tsx
│   │   ├── WhatsAppConfig.tsx
│   │   ├── CategoryManager.tsx
│   │   └── LoginForm.tsx
│   ├── Header.tsx
│   ├── HamburgerMenu.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── pages/               # Páginas principales
│   ├── Home.tsx
│   ├── Catalog.tsx
│   └── Orders.tsx
├── stores/              # Estado global (Zustand)
│   ├── authStore.ts
│   ├── cartStore.ts
│   ├── orderStore.ts
│   ├── productStore.ts
│   └── themeStore.ts
├── services/            # Servicios externos
│   ├── emailService.ts
│   └── whatsappService.ts
├── data/               # Datos de configuración
│   └── whatsapp-config.json
└── lib/                # Utilidades
    └── utils.ts
```

## 🔐 Panel de Administración

El panel de administración está disponible en la ruta `/pm` y requiere autenticación.

### Acceso al Panel

1. Navega a `http://localhost:5173/pm`
2. Usa las credenciales por defecto:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`

### Funcionalidades del Panel

#### 📊 Dashboard
- Estadísticas generales del sistema
- Resumen de productos y pedidos
- Métricas de conversión
- Lista de pedidos recientes

#### 📦 Gestión de Productos
- **Crear**: Agregar nuevos productos con imagen
- **Editar**: Modificar productos existentes
- **Eliminar**: Remover productos del catálogo
- **Campos disponibles**:
  - Nombre del producto
  - Descripción
  - Precio
  - Categoría
  - Imagen (carga de archivos)
  - Mensaje personalizado de WhatsApp

#### 📱 Configuración de WhatsApp
- **Información del negocio**:
  - Número de teléfono
  - Nombre del negocio
  - Dirección
  - Email de contacto
- **Plantillas de mensajes**:
  - Mensaje de bienvenida
  - Confirmación de pedido
  - Estado del pedido
  - Mensaje de soporte
- **Prueba de mensajes**: Previsualización de mensajes

#### 🏷️ Gestión de Categorías
- **Crear**: Nuevas categorías con colores personalizados
- **Editar**: Modificar categorías existentes
- **Eliminar**: Remover categorías (solo si no tienen productos)
- **Estadísticas**: Conteo de productos por categoría

## 🎨 Temas

El sistema incluye tres temas predefinidos:

- **Claro**: Tema con colores claros
- **Oscuro**: Tema con colores oscuros
- **Azul**: Tema con tonalidades azules

Puedes cambiar el tema usando el botón en la esquina superior derecha.

## 📱 Integración WhatsApp

### Configuración

1. Accede al panel de administración (`/pm`)
2. Ve a la sección "WhatsApp"
3. Configura:
   - Número de teléfono del negocio
   - Información del negocio
   - Plantillas de mensajes

### Uso

- Los clientes pueden enviar pedidos directamente por WhatsApp
- Los mensajes se generan automáticamente con la información del pedido
- Se incluyen detalles del producto y total del pedido

## 🛒 Carrito de Compras

### Funcionalidades

- **Agregar productos**: Desde el catálogo
- **Modificar cantidades**: Aumentar/disminuir cantidades
- **Eliminar productos**: Remover del carrito
- **Calcular total**: Total automático con impuestos
- **Enviar pedido**: Integración con WhatsApp

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración de la aplicación
VITE_APP_NAME="Catálogo de Productos"
VITE_WHATSAPP_PHONE="+1234567890"
VITE_BUSINESS_EMAIL="contacto@empresa.com"
```

### Personalización de Temas

Puedes modificar los temas en `src/stores/themeStore.ts`:

```typescript
export const themes = {
  light: {
    name: 'Claro',
    colors: {
      background: 'bg-gray-50',
      surface: 'bg-white',
      // ... más colores
    }
  },
  // ... otros temas
};
```

## 📡 API Endpoints (Simulados)

El sistema actualmente usa datos locales, pero está preparado para integración con API:

### Productos
- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Pedidos
- `GET /api/orders` - Obtener todos los pedidos
- `POST /api/orders` - Crear nuevo pedido
- `PUT /api/orders/:id` - Actualizar estado del pedido

### Categorías
- `GET /api/categories` - Obtener todas las categorías
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

## 📮 Colección de Postman

Para probar los endpoints de la API, puedes usar la siguiente colección de Postman:

```json
{
  "info": {
    "name": "Catálogo de Productos API",
    "description": "Colección de endpoints para el sistema de catálogo",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Productos",
      "item": [
        {
          "name": "Obtener Productos",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/products",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products"]
            }
          }
        },
        {
          "name": "Crear Producto",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Producto Ejemplo\",\n  \"description\": \"Descripción del producto\",\n  \"price\": 99.99,\n  \"category\": \"Electrónicos\",\n  \"image\": \"https://ejemplo.com/imagen.jpg\",\n  \"whatsappMessage\": \"¡Hola! Me interesa este producto\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/products",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products"]
            }
          }
        }
      ]
    },
    {
      "name": "Pedidos",
      "item": [
        {
          "name": "Crear Pedido",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"customerName\": \"Juan Pérez\",\n  \"customerPhone\": \"+1234567890\",\n  \"items\": [\n    {\n      \"productId\": \"1\",\n      \"quantity\": 2,\n      \"price\": 99.99\n    }\n  ],\n  \"total\": 199.98\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/orders",
              "host": ["{{baseUrl}}"],
              "path": ["api", "orders"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5173",
      "type": "string"
    }
  ]
}
```

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

### Preview del Build

```bash
npm run preview
```

### Despliegue en Vercel

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Despliega:
```bash
vercel
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- 📧 Email: soporte@empresa.com
- 💬 WhatsApp: +1234567890
- 🐛 Issues: [GitHub Issues](https://github.com/usuario/repo/issues)

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- ✨ Lanzamiento inicial
- 🎨 Sistema de temas
- 📱 Integración WhatsApp
- 🔐 Panel de administración
- 🛒 Carrito de compras
- 📦 Gestión de productos
- 🏷️ Gestión de categorías

---

**Desarrollado con ❤️ usando React + TypeScript + Vite**
# tienda_pedidos-
