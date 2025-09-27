# Sistema de Administración - Panel Oculto

## 1. Descripción General

Este documento describe el sistema de administración oculto para la gestión completa de la tienda online, incluyendo productos, configuración de WhatsApp y ajustes generales de la tienda.

### 1.1 Características Principales
- **Ruta oculta de administración**: Acceso restringido solo para administradores
- **Gestión completa de productos**: Crear, editar, eliminar productos con imágenes
- **Gestión de pedidos**: Control completo del estado de pedidos (pendiente, entregado, cancelado)
- **Configuración de WhatsApp**: Gestión de número, nombre de tienda y mensajes personalizados
- **Gestión de categorías**: Administración de categorías de productos
- **Interfaz intuitiva**: Panel de control fácil de usar
- **API RESTful**: Endpoints completos para todas las operaciones CRUD

## 2. Acceso al Panel de Administración

### 2.1 URLs de Acceso

#### Producción (Netlify)
```
URL Principal: https://muestras-productos-app.netlify.app/pm
Acceso: Directo sin autenticación (para desarrollo)
Estado: ✅ Funcionando correctamente
```

#### Desarrollo Local
```
URL Local: http://localhost:5173/pm
Comando: npm run dev
Puerto: 5173
```

### 2.2 Configuración de Rutas

#### Netlify SPA Configuration
El archivo `_redirects` en `/public` contiene:
```
/* /index.html 200
```

Esto asegura que:
- La ruta `/pm` funcione correctamente en producción
- No se produzcan errores 404 al acceder directamente
- El routing de React funcione sin problemas

### 2.3 Estado del Despliegue
- ✅ **Panel desplegado** en Netlify
- ✅ **Ruta /pm accesible** desde cualquier dispositivo
- ✅ **Gestión de pedidos** operativa
- ✅ **Interfaz responsive** funcionando
- ✅ **Cambio de temas** disponible

## 3. Gestión de Productos

### 3.1 Estructura de Producto
```typescript
interface Product {
  id: string;           // Identificador único
  name: string;         // Nombre del producto
  description: string;  // Descripción detallada
  price: number;        // Precio en USD
  category: string;     // ID de categoría
  image_url: string;    // URL de la imagen
  available: boolean;   // Disponibilidad
  created_at?: string;  // Fecha de creación
  updated_at?: string;  // Fecha de actualización
}
```

### 3.2 Operaciones Disponibles

#### Crear Producto
- **Formulario**: Nombre, descripción, precio, categoría
- **Imagen**: Subida de archivo o URL externa
- **Validaciones**: Campos obligatorios, formato de precio
- **Generación automática**: ID único y timestamps

#### Editar Producto
- **Búsqueda**: Por ID, nombre o categoría
- **Modificación**: Todos los campos editables
- **Previsualización**: Vista previa antes de guardar
- **Historial**: Registro de cambios

#### Eliminar Producto
- **Confirmación**: Diálogo de confirmación
- **Eliminación suave**: Marcar como no disponible
- **Eliminación permanente**: Remover completamente

### 3.3 Gestión de Imágenes

#### Opciones de Imagen
1. **Subida de archivo**: Formatos JPG, PNG, WebP
2. **URL externa**: Validación de URL válida
3. **Generación AI**: Integración con servicio de imágenes AI
4. **Galería**: Selección de imágenes predefinidas

#### Especificaciones Técnicas
- **Tamaño máximo**: 5MB por imagen
- **Resolución recomendada**: 800x800px
- **Formatos soportados**: JPG, PNG, WebP, SVG
- **Optimización automática**: Compresión y redimensionado

## 4. Gestión de Pedidos

### 4.1 Estructura de Pedido
```typescript
interface Order {
  id: string;              // Identificador único del pedido
  customerData: {
    name: string;          // Nombre del cliente
    email: string;         // Email del cliente
    phone: string;         // Teléfono del cliente
    address: string;       // Dirección de entrega
  };
  items: CartItem[];       // Productos del pedido
  totalAmount: number;     // Monto total del pedido
  status: 'pending' | 'delivered' | 'cancelled'; // Estado del pedido
  createdAt: string;       // Fecha de creación
}
```

### 4.2 Estados de Pedido

#### Estados Disponibles
1. **Pendiente (pending)**: Pedido recién creado, esperando procesamiento
2. **Entregado (delivered)**: Pedido completado y entregado al cliente
3. **Cancelado (cancelled)**: Pedido cancelado por el cliente o administrador

#### Flujo de Estados
```
Pendiente → Entregado
Pendiente → Cancelado
```

### 4.3 Funcionalidades del OrderManager

#### Visualización de Pedidos
- **Lista completa**: Todos los pedidos con información básica
- **Detalles expandidos**: Información completa del cliente y productos
- **Filtros por estado**: Pendientes, entregados, cancelados
- **Búsqueda**: Por nombre de cliente o ID de pedido
- **Ordenamiento**: Por fecha, monto total o estado

#### Gestión de Estados
- **Cambio de estado**: Botones de acción para cada pedido
- **Confirmación**: Diálogos de confirmación para cambios críticos
- **Notificaciones**: Toast notifications para confirmar acciones
- **Historial**: Registro de cambios de estado (futuro)

#### Interfaz Responsive
- **Vista de escritorio**: Tabla completa con todas las columnas
- **Vista móvil**: Cards adaptables con información esencial
- **Navegación táctil**: Optimizada para dispositivos móviles

### 4.4 Operaciones Disponibles

#### Marcar como Entregado
1. Localizar pedido en estado "Pendiente"
2. Hacer clic en botón "Marcar como Entregado"
3. Confirmar acción en el diálogo
4. El estado cambia automáticamente a "Entregado"

#### Cancelar Pedido
1. Seleccionar pedido (cualquier estado excepto cancelado)
2. Hacer clic en "Cancelar Pedido"
3. Confirmar cancelación
4. El pedido se marca como "Cancelado"

#### Filtrar Pedidos
- **Todos**: Mostrar todos los pedidos
- **Pendientes**: Solo pedidos en espera
- **Entregados**: Solo pedidos completados
- **Cancelados**: Solo pedidos cancelados

#### Buscar Pedidos
- **Por nombre**: Buscar por nombre del cliente
- **Por ID**: Buscar por identificador único
- **Búsqueda en tiempo real**: Resultados instantáneos

### 4.5 Información Mostrada

#### Vista de Lista
- **ID del Pedido**: Identificador único
- **Cliente**: Nombre y teléfono
- **Fecha**: Fecha de creación del pedido
- **Total**: Monto total del pedido
- **Estado**: Estado actual con indicador visual
- **Acciones**: Botones para cambiar estado

#### Vista Detallada
- **Información del cliente**: Nombre, email, teléfono, dirección
- **Productos**: Lista detallada con cantidades y precios
- **Resumen**: Subtotal, total y fecha de pedido
- **Historial**: Cambios de estado (futuro)

## 5. Configuración de WhatsApp

### 5.1 Datos de Configuración
```typescript
interface WhatsAppConfig {
  phoneNumber: string;      // Número de WhatsApp del negocio
  businessName: string;     // Nombre de la tienda
  businessAddress: string;  // Dirección física
  businessHours: string;    // Horarios de atención
  messages: {
    orderConfirmation: string;
    orderReceived: string;
    orderProcessing: string;
    orderShipped: string;
    orderDelivered: string;
    welcome: string;
    support: string;
  };
}
```

### 5.2 Mensajes Personalizables

#### Variables Disponibles
- `{customerName}`: Nombre del cliente
- `{orderNumber}`: Número de pedido
- `{orderDetails}`: Detalles del pedido
- `{totalAmount}`: Monto total
- `{businessName}`: Nombre del negocio
- `{trackingNumber}`: Número de seguimiento

#### Plantillas Predefinidas
1. **Confirmación de Pedido**
2. **Pedido Recibido**
3. **Procesando Pedido**
4. **Pedido Enviado**
5. **Pedido Entregado**
6. **Mensaje de Bienvenida**
7. **Soporte al Cliente**

### 5.3 Configuración del Negocio

#### Información Básica
- **Nombre de la tienda**: Configurable
- **Número de WhatsApp**: Formato internacional
- **Dirección**: Dirección física del negocio
- **Horarios**: Horarios de atención al cliente
- **Email de contacto**: Para notificaciones

## 6. API Documentation

### 6.1 Endpoints de Productos

#### GET /api/products
**Descripción**: Obtener todos los productos
```http
GET /api/products
Content-Type: application/json
```

**Respuesta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_001",
      "name": "Producto Ejemplo",
      "description": "Descripción del producto",
      "price": 99.99,
      "category": "categoria_id",
      "image_url": "https://ejemplo.com/imagen.jpg",
      "available": true
    }
  ]
}
```

#### POST /api/products
**Descripción**: Crear nuevo producto
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**:
```json
{
  "name": "Nuevo Producto",
  "description": "Descripción detallada",
  "price": 149.99,
  "category": "categoria_id",
  "image_url": "https://ejemplo.com/nueva-imagen.jpg",
  "available": true
}
```

#### PUT /api/products/{id}
**Descripción**: Actualizar producto existente
```http
PUT /api/products/prod_001
Content-Type: application/json
Authorization: Bearer {token}
```

#### DELETE /api/products/{id}
**Descripción**: Eliminar producto
```http
DELETE /api/products/prod_001
Authorization: Bearer {token}
```

### 7.2 Endpoints de Configuración

#### GET /api/config/whatsapp
**Descripción**: Obtener configuración de WhatsApp
```http
GET /api/config/whatsapp
Authorization: Bearer {token}
```

#### PUT /api/config/whatsapp
**Descripción**: Actualizar configuración de WhatsApp
```http
PUT /api/config/whatsapp
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**:
```json
{
  "phoneNumber": "+1234567890",
  "businessName": "Mi Tienda Online",
  "businessAddress": "Calle Principal 123",
  "businessHours": "Lunes a Viernes: 9:00 AM - 6:00 PM",
  "messages": {
    "orderConfirmation": "¡Gracias por tu pedido! Detalles: {orderDetails}",
    "welcome": "¡Bienvenido a {businessName}!"
  }
}
```

### 7.3 Endpoints de Categorías

#### GET /api/categories
**Descripción**: Obtener todas las categorías

#### POST /api/categories
**Descripción**: Crear nueva categoría

#### PUT /api/categories/{id}
**Descripción**: Actualizar categoría

#### DELETE /api/categories/{id}
**Descripción**: Eliminar categoría

## 8. Colección de Postman

### 8.1 Configuración de Entorno
```json
{
  "name": "Tienda Online Admin",
  "values": [
    {
      "key": "base_url",
      "value": "https://muestras-productos-app.netlify.app/api",
      "enabled": true
    },
    {
      "key": "auth_token",
      "value": "{{token}}",
      "enabled": true
    }
  ]
}
```

### 8.2 Requests de Ejemplo

#### Autenticación
```json
{
  "name": "Login Admin",
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
      "raw": "{\n  \"email\": \"admin@tienda.com\",\n  \"password\": \"AdminSecret2024!\"\n}"
    },
    "url": {
      "raw": "{{base_url}}/auth/login",
      "host": ["{{base_url}}"],
      "path": ["auth", "login"]
    }
  }
}
```

#### Crear Producto
```json
{
  "name": "Crear Producto",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      },
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"name\": \"Producto de Prueba\",\n  \"description\": \"Descripción del producto de prueba\",\n  \"price\": 99.99,\n  \"category\": \"zapatillas\",\n  \"image_url\": \"https://ejemplo.com/imagen.jpg\",\n  \"available\": true\n}"
    },
    "url": {
      "raw": "{{base_url}}/products",
      "host": ["{{base_url}}"],
      "path": ["products"]
    }
  }
}
```

## 9. Manual de Usuario

### 9.1 Acceso Inicial

1. **Navegar a la URL oculta**: `/admin-panel-secret-2024`
2. **Iniciar sesión** con credenciales de administrador
3. **Verificar permisos** de acceso al panel

### 9.2 Gestión de Productos

#### Agregar Nuevo Producto
1. Hacer clic en "Agregar Producto"
2. Completar formulario:
   - Nombre del producto
   - Descripción detallada
   - Precio (formato: 99.99)
   - Seleccionar categoría
   - Subir imagen o proporcionar URL
3. Marcar disponibilidad
4. Hacer clic en "Guardar Producto"

#### Editar Producto Existente
1. Buscar producto en la lista
2. Hacer clic en "Editar"
3. Modificar campos necesarios
4. Previsualizar cambios
5. Guardar modificaciones

#### Eliminar Producto
1. Seleccionar producto a eliminar
2. Hacer clic en "Eliminar"
3. Confirmar acción en el diálogo
4. Elegir tipo de eliminación:
   - Suave (marcar como no disponible)
   - Permanente (eliminar completamente)

### 9.3 Configuración de WhatsApp

#### Actualizar Información del Negocio
1. Ir a "Configuración" > "WhatsApp"
2. Actualizar campos:
   - Número de WhatsApp
   - Nombre de la tienda
   - Dirección
   - Horarios de atención
3. Guardar cambios

#### Personalizar Mensajes
1. Seleccionar tipo de mensaje
2. Editar plantilla usando variables disponibles
3. Previsualizar mensaje
4. Guardar plantilla personalizada

### 9.4 Gestión de Categorías

#### Crear Nueva Categoría
1. Ir a "Categorías"
2. Hacer clic en "Nueva Categoría"
3. Completar:
   - ID único
   - Nombre de la categoría
   - Descripción
4. Guardar categoría

#### Modificar Categoría
1. Seleccionar categoría existente
2. Editar información
3. Verificar productos asociados
4. Guardar cambios

### 9.5 Gestión de Pedidos

#### Acceder a la Gestión de Pedidos
1. Ir a la sección "Pedidos" en el menú lateral
2. Visualizar lista completa de pedidos
3. Usar filtros para encontrar pedidos específicos

#### Cambiar Estado de Pedido
1. **Marcar como Entregado**:
   - Localizar pedido en estado "Pendiente"
   - Hacer clic en botón verde "Marcar como Entregado"
   - Confirmar acción en el diálogo
   - El estado cambia automáticamente

2. **Cancelar Pedido**:
   - Seleccionar cualquier pedido (excepto ya cancelados)
   - Hacer clic en botón rojo "Cancelar"
   - Confirmar cancelación
   - El pedido se marca como "Cancelado"

#### Filtrar y Buscar Pedidos
1. **Filtros por Estado**:
   - Todos los pedidos
   - Solo pendientes
   - Solo entregados
   - Solo cancelados

2. **Búsqueda**:
   - Por nombre del cliente
   - Por ID del pedido
   - Resultados en tiempo real

#### Ver Detalles del Pedido
1. Hacer clic en cualquier pedido de la lista
2. Se expande mostrando:
   - Información completa del cliente
   - Lista detallada de productos
   - Cantidades y precios
   - Total del pedido

### 9.6 Monitoreo y Reportes

#### Dashboard Principal
- **Productos totales**: Contador de productos activos
- **Pedidos recientes**: Lista de últimos pedidos
- **Configuración actual**: Estado de configuraciones
- **Actividad reciente**: Log de acciones realizadas

#### Reportes Disponibles
1. **Productos más vendidos**
2. **Categorías populares**
3. **Actividad de administración**
4. **Configuraciones modificadas**

## 10. Seguridad y Mejores Prácticas

### 10.1 Medidas de Seguridad
- **Autenticación obligatoria**: Token JWT requerido
- **Ruta oculta**: URL no indexable ni visible
- **Validación de permisos**: Verificación en cada operación
- **Logs de auditoría**: Registro de todas las acciones
- **Sesiones limitadas**: Timeout automático

### 10.2 Recomendaciones
1. **Cambiar credenciales** regularmente
2. **Usar HTTPS** en producción
3. **Realizar backups** antes de cambios importantes
4. **Monitorear accesos** al panel de administración
5. **Mantener logs** de actividad

### 10.3 Troubleshooting

#### Problemas Comunes
1. **No puedo acceder al panel**
   - Verificar URL correcta
   - Comprobar credenciales
   - Revisar permisos de usuario

2. **Error al subir imágenes**
   - Verificar tamaño de archivo
   - Comprobar formato soportado
   - Revisar conexión a internet

3. **Mensajes de WhatsApp no se envían**
   - Verificar número de teléfono
   - Comprobar formato de mensaje
   - Revisar configuración de variables

## 11. Estructura de Archivos

### 11.1 Archivos de Configuración
```
/src/data/
├── whatsapp-config.json     # Configuración de WhatsApp
├── admin-config.json        # Configuración del panel admin
└── store-settings.json      # Configuraciones generales

/public/
├── products.json           # Base de datos de productos
└── categories.json         # Categorías disponibles
```

### 11.2 Componentes del Admin Panel
```
/src/components/admin/
├── AdminPanel.tsx       # Panel principal
├── ProductManager.tsx   # Gestión de productos
├── OrderManager.tsx     # Gestión de pedidos
├── WhatsAppConfig.tsx   # Configuración WhatsApp
├── CategoryManager.tsx  # Gestión de categorías
├── LoginForm.tsx        # Formulario de acceso
├── PasswordChange.tsx   # Cambio de contraseña
└── PasswordRecovery.tsx # Recuperación de contraseña
```

## 12. Próximas Funcionalidades

### 12.1 Funciones Planificadas
- **Editor de temas**: Personalización de colores y estilos
- **Gestión de usuarios**: Múltiples administradores
- **Análisis avanzado**: Métricas detalladas de ventas
- **Integración con pagos**: Configuración de métodos de pago
- **Notificaciones push**: Alertas en tiempo real

### 12.2 Mejoras Técnicas
- **Base de datos real**: Migración desde JSON a PostgreSQL
- **API GraphQL**: Alternativa a REST API
- **Caché inteligente**: Optimización de rendimiento
- **Backup automático**: Respaldos programados
- **Monitoreo avanzado**: Métricas de sistema

---

**Versión del documento**: 1.0  
**Última actualización**: Diciembre 2024  
**Contacto de soporte**: admin@tienda.com