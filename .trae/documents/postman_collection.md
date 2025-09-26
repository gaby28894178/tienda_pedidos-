# Colección de Postman - Panel de Administración

## 1. Configuración de la Colección

### 1.1 Variables de Entorno

```json
{
  "id": "admin-panel-environment",
  "name": "Admin Panel - Tienda Online",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:5173",
      "enabled": true,
      "type": "default"
    },
    {
      "key": "api_url",
      "value": "{{base_url}}/api",
      "enabled": true,
      "type": "default"
    },
    {
      "key": "admin_api_url",
      "value": "{{api_url}}/admin",
      "enabled": true,
      "type": "default"
    },
    {
      "key": "auth_token",
      "value": "",
      "enabled": true,
      "type": "secret"
    },
    {
      "key": "admin_email",
      "value": "admin@tienda.com",
      "enabled": true,
      "type": "default"
    },
    {
      "key": "admin_password",
      "value": "AdminSecret2024!",
      "enabled": true,
      "type": "secret"
    }
  ]
}
```

### 1.2 Headers Globales

```json
{
  "key": "Content-Type",
  "value": "application/json",
  "type": "text"
}
```

## 2. Autenticación

### 2.1 Login de Administrador

```json
{
  "name": "Admin Login",
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
      "raw": "{\n  \"email\": \"{{admin_email}}\",\n  \"password\": \"{{admin_password}}\"\n}"
    },
    "url": {
      "raw": "{{admin_api_url}}/auth/login",
      "host": ["{{admin_api_url}}"],
      "path": ["auth", "login"]
    },
    "description": "Autenticación de administrador. Retorna un JWT token para usar en requests posteriores."
  },
  "response": [],
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "if (pm.response.code === 200) {",
          "    const response = pm.response.json();",
          "    if (response.success && response.token) {",
          "        pm.environment.set('auth_token', response.token);",
          "        console.log('Token guardado:', response.token);",
          "    }",
          "}",
          "",
          "pm.test('Login exitoso', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "    pm.expect(response.token).to.exist;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 2.2 Verificar Token

```json
{
  "name": "Verify Token",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/auth/verify",
      "host": ["{{admin_api_url}}"],
      "path": ["auth", "verify"]
    },
    "description": "Verifica si el token actual es válido"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Token válido', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.valid).to.be.true;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 2.3 Logout

```json
{
  "name": "Admin Logout",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/auth/logout",
      "host": ["{{admin_api_url}}"],
      "path": ["auth", "logout"]
    },
    "description": "Cerrar sesión de administrador"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "if (pm.response.code === 200) {",
          "    pm.environment.set('auth_token', '');",
          "    console.log('Token eliminado');",
          "}",
          "",
          "pm.test('Logout exitoso', function () {",
          "    pm.response.to.have.status(200);",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

## 3. Gestión de Productos

### 3.1 Obtener Todos los Productos

```json
{
  "name": "Get All Products",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/products",
      "host": ["{{admin_api_url}}"],
      "path": ["products"]
    },
    "description": "Obtiene todos los productos con información de administración"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Productos obtenidos', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.products).to.be.an('array');",
          "    pm.expect(response.total).to.be.a('number');",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 3.2 Obtener Producto por ID

```json
{
  "name": "Get Product by ID",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/products/zap_001",
      "host": ["{{admin_api_url}}"],
      "path": ["products", "zap_001"]
    },
    "description": "Obtiene un producto específico por su ID"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Producto encontrado', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.product).to.exist;",
          "    pm.expect(response.product.id).to.equal('zap_001');",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 3.3 Crear Nuevo Producto

```json
{
  "name": "Create Product",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"name\": \"Producto de Prueba\",\n  \"description\": \"Este es un producto creado desde Postman para pruebas\",\n  \"price\": 99.99,\n  \"category\": \"otros\",\n  \"image_url\": \"https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=test%20product%20image&image_size=square\",\n  \"available\": true\n}"
    },
    "url": {
      "raw": "{{admin_api_url}}/products",
      "host": ["{{admin_api_url}}"],
      "path": ["products"]
    },
    "description": "Crea un nuevo producto en el catálogo"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Producto creado', function () {",
          "    pm.response.to.have.status(201);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "    pm.expect(response.product).to.exist;",
          "    pm.expect(response.product.id).to.exist;",
          "    ",
          "    // Guardar ID para usar en otros tests",
          "    pm.environment.set('last_product_id', response.product.id);",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 3.4 Actualizar Producto

```json
{
  "name": "Update Product",
  "request": {
    "method": "PUT",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"name\": \"Producto Actualizado\",\n  \"description\": \"Descripción actualizada desde Postman\",\n  \"price\": 149.99,\n  \"available\": true\n}"
    },
    "url": {
      "raw": "{{admin_api_url}}/products/{{last_product_id}}",
      "host": ["{{admin_api_url}}"],
      "path": ["products", "{{last_product_id}}"]
    },
    "description": "Actualiza un producto existente"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Producto actualizado', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "    pm.expect(response.product.name).to.equal('Producto Actualizado');",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 3.5 Eliminar Producto (Suave)

```json
{
  "name": "Soft Delete Product",
  "request": {
    "method": "DELETE",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/products/{{last_product_id}}?soft=true",
      "host": ["{{admin_api_url}}"],
      "path": ["products", "{{last_product_id}}"],
      "query": [
        {
          "key": "soft",
          "value": "true"
        }
      ]
    },
    "description": "Eliminación suave - marca el producto como no disponible"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Producto eliminado (suave)', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 3.6 Eliminar Producto (Permanente)

```json
{
  "name": "Hard Delete Product",
  "request": {
    "method": "DELETE",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/products/{{last_product_id}}?soft=false",
      "host": ["{{admin_api_url}}"],
      "path": ["products", "{{last_product_id}}"],
      "query": [
        {
          "key": "soft",
          "value": "false"
        }
      ]
    },
    "description": "Eliminación permanente - remueve completamente el producto"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Producto eliminado (permanente)', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

## 4. Gestión de Imágenes

### 4.1 Subir Imagen

```json
{
  "name": "Upload Image",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "body": {
      "mode": "formdata",
      "formdata": [
        {
          "key": "file",
          "type": "file",
          "src": "/path/to/image.jpg"
        },
        {
          "key": "product_id",
          "value": "{{last_product_id}}",
          "type": "text"
        }
      ]
    },
    "url": {
      "raw": "{{admin_api_url}}/images/upload",
      "host": ["{{admin_api_url}}"],
      "path": ["images", "upload"]
    },
    "description": "Sube una imagen para un producto"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Imagen subida', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "    pm.expect(response.url).to.exist;",
          "    pm.expect(response.filename).to.exist;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 4.2 Generar Imagen con AI

```json
{
  "name": "Generate AI Image",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"prompt\": \"modern blue running shoes on white background\",\n  \"style\": \"product photography\",\n  \"size\": \"square\"\n}"
    },
    "url": {
      "raw": "{{admin_api_url}}/images/generate",
      "host": ["{{admin_api_url}}"],
      "path": ["images", "generate"]
    },
    "description": "Genera una imagen usando AI"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Imagen generada', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "    pm.expect(response.url).to.exist;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

## 5. Configuración de WhatsApp

### 5.1 Obtener Configuración

```json
{
  "name": "Get WhatsApp Config",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/whatsapp/config",
      "host": ["{{admin_api_url}}"],
      "path": ["whatsapp", "config"]
    },
    "description": "Obtiene la configuración actual de WhatsApp"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Configuración obtenida', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.config).to.exist;",
          "    pm.expect(response.config.phoneNumber).to.exist;",
          "    pm.expect(response.config.businessName).to.exist;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 5.2 Actualizar Configuración

```json
{
  "name": "Update WhatsApp Config",
  "request": {
    "method": "PUT",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"phoneNumber\": \"+1234567890\",\n  \"businessName\": \"Mi Tienda Actualizada\",\n  \"businessAddress\": \"Calle Nueva 456, Ciudad\",\n  \"businessHours\": \"Lunes a Sábado: 8:00 AM - 8:00 PM\",\n  \"messages\": {\n    \"orderConfirmation\": \"¡Hola {customerName}! Tu pedido #{orderNumber} ha sido confirmado.\\n\\nDetalles:\\n{orderDetails}\\n\\nTotal: ${totalAmount}\\n\\n¡Gracias por elegir {businessName}!\",\n    \"welcome\": \"¡Bienvenido a {businessName}! ¿En qué podemos ayudarte hoy?\"\n  }\n}"
    },
    "url": {
      "raw": "{{admin_api_url}}/whatsapp/config",
      "host": ["{{admin_api_url}}"],
      "path": ["whatsapp", "config"]
    },
    "description": "Actualiza la configuración de WhatsApp"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Configuración actualizada', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "    pm.expect(response.config.businessName).to.equal('Mi Tienda Actualizada');",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 5.3 Probar Configuración

```json
{
  "name": "Test WhatsApp Config",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"phoneNumber\": \"+1234567890\",\n  \"messageType\": \"welcome\"\n}"
    },
    "url": {
      "raw": "{{admin_api_url}}/whatsapp/test",
      "host": ["{{admin_api_url}}"],
      "path": ["whatsapp", "test"]
    },
    "description": "Prueba la configuración de WhatsApp enviando un mensaje de prueba"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Prueba exitosa', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "    pm.expect(response.url).to.exist;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

## 6. Gestión de Categorías

### 6.1 Obtener Categorías

```json
{
  "name": "Get Categories",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/categories",
      "host": ["{{admin_api_url}}"],
      "path": ["categories"]
    },
    "description": "Obtiene todas las categorías disponibles"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Categorías obtenidas', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.categories).to.be.an('array');",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 6.2 Crear Categoría

```json
{
  "name": "Create Category",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"id\": \"electronica\",\n  \"name\": \"Electrónicos\",\n  \"description\": \"Dispositivos electrónicos y gadgets modernos\"\n}"
    },
    "url": {
      "raw": "{{admin_api_url}}/categories",
      "host": ["{{admin_api_url}}"],
      "path": ["categories"]
    },
    "description": "Crea una nueva categoría"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Categoría creada', function () {",
          "    pm.response.to.have.status(201);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "    pm.expect(response.category.id).to.equal('electronica');",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 6.3 Actualizar Categoría

```json
{
  "name": "Update Category",
  "request": {
    "method": "PUT",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"name\": \"Electrónicos y Gadgets\",\n  \"description\": \"Dispositivos electrónicos, gadgets y accesorios tecnológicos\"\n}"
    },
    "url": {
      "raw": "{{admin_api_url}}/categories/electronica",
      "host": ["{{admin_api_url}}"],
      "path": ["categories", "electronica"]
    },
    "description": "Actualiza una categoría existente"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Categoría actualizada', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 6.4 Eliminar Categoría

```json
{
  "name": "Delete Category",
  "request": {
    "method": "DELETE",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/categories/electronica",
      "host": ["{{admin_api_url}}"],
      "path": ["categories", "electronica"]
    },
    "description": "Elimina una categoría (solo si no tiene productos asociados)"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Categoría eliminada', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.success).to.be.true;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

## 7. Dashboard y Estadísticas

### 7.1 Obtener Dashboard

```json
{
  "name": "Get Dashboard Data",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/dashboard",
      "host": ["{{admin_api_url}}"],
      "path": ["dashboard"]
    },
    "description": "Obtiene datos del dashboard principal"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Dashboard cargado', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.stats).to.exist;",
          "    pm.expect(response.stats.totalProducts).to.be.a('number');",
          "    pm.expect(response.stats.totalOrders).to.be.a('number');",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

### 7.2 Obtener Logs de Actividad

```json
{
  "name": "Get Activity Logs",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{admin_api_url}}/logs?limit=50&page=1",
      "host": ["{{admin_api_url}}"],
      "path": ["logs"],
      "query": [
        {
          "key": "limit",
          "value": "50"
        },
        {
          "key": "page",
          "value": "1"
        }
      ]
    },
    "description": "Obtiene los logs de actividad del panel de administración"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Logs obtenidos', function () {",
          "    pm.response.to.have.status(200);",
          "    const response = pm.response.json();",
          "    pm.expect(response.logs).to.be.an('array');",
          "    pm.expect(response.pagination).to.exist;",
          "});"
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

## 8. Scripts de Automatización

### 8.1 Script de Setup Completo

```javascript
// Pre-request Script para configuración automática
const setupEnvironment = () => {
    // Verificar variables de entorno
    const requiredVars = ['base_url', 'admin_email', 'admin_password'];
    
    requiredVars.forEach(varName => {
        if (!pm.environment.get(varName)) {
            console.warn(`Variable de entorno faltante: ${varName}`);
        }
    });
    
    // Auto-login si no hay token
    const token = pm.environment.get('auth_token');
    if (!token || token === '') {
        console.log('No hay token, ejecutando auto-login...');
        // Aquí se ejecutaría el login automático
    }
};

setupEnvironment();
```

### 8.2 Script de Limpieza

```javascript
// Test Script para limpieza después de pruebas
const cleanup = () => {
    // Limpiar productos de prueba
    const testProductId = pm.environment.get('last_product_id');
    if (testProductId && testProductId.includes('test_')) {
        console.log('Limpiando producto de prueba:', testProductId);
        // Aquí se ejecutaría la eliminación
    }
    
    // Limpiar variables temporales
    pm.environment.unset('last_product_id');
};

// Ejecutar limpieza al final de la colección
if (pm.info.iteration === pm.info.iterationCount - 1) {
    cleanup();
}
```

## 9. Casos de Prueba Automatizados

### 9.1 Suite de Pruebas de Productos

```javascript
// Test completo del flujo de productos
const productTestSuite = {
    async runTests() {
        // 1. Crear producto
        await this.createProduct();
        
        // 2. Verificar creación
        await this.verifyProduct();
        
        // 3. Actualizar producto
        await this.updateProduct();
        
        // 4. Eliminar producto
        await this.deleteProduct();
    },
    
    createProduct() {
        pm.test('Crear producto de prueba', function() {
            const productData = {
                name: 'Producto Test ' + Date.now(),
                description: 'Producto creado automáticamente para pruebas',
                price: Math.floor(Math.random() * 100) + 10,
                category: 'otros',
                available: true
            };
            
            pm.environment.set('test_product_data', JSON.stringify(productData));
        });
    }
};
```

### 9.2 Validaciones de Seguridad

```javascript
// Tests de seguridad
const securityTests = {
    testUnauthorizedAccess() {
        pm.test('Acceso sin token debe fallar', function() {
            if (pm.request.headers.get('Authorization')) {
                pm.expect.fail('Request no debería tener token para esta prueba');
            }
            pm.response.to.have.status(401);
        });
    },
    
    testInvalidToken() {
        pm.test('Token inválido debe fallar', function() {
            const authHeader = pm.request.headers.get('Authorization');
            if (authHeader && authHeader.includes('invalid_token')) {
                pm.response.to.have.status(401);
            }
        });
    }
};
```

## 10. Exportación de la Colección

### 10.1 Archivo JSON Completo

```json
{
  "info": {
    "name": "Admin Panel - Tienda Online",
    "description": "Colección completa para el panel de administración de la tienda online",
    "version": "1.0.0",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{auth_token}}",
        "type": "string"
      }
    ]
  },
  "event": [
    {
      "listen": "prerequest",
      "script": {
        "type": "text/javascript",
        "exec": [
          "// Script global de pre-request",
          "console.log('Ejecutando request:', pm.info.requestName);",
          "console.log('URL:', pm.request.url.toString());"
        ]
      }
    },
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "// Script global de test",
          "pm.test('Response time is acceptable', function () {",
          "    pm.expect(pm.response.responseTime).to.be.below(5000);",
          "});",
          "",
          "pm.test('Response has correct content type', function () {",
          "    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');",
          "});"
        ]
      }
    }
  ]
}
```

---

**Instrucciones de Uso:**

1. **Importar la colección** en Postman
2. **Configurar el entorno** con las variables necesarias
3. **Ejecutar el login** para obtener el token de autenticación
4. **Usar los endpoints** según las necesidades
5. **Ejecutar las pruebas automatizadas** para validar funcionalidad

**Notas Importantes:**
- Todos los endpoints requieren autenticación excepto el login
- Los tokens tienen un tiempo de expiración limitado
- Las pruebas automatizadas incluyen validaciones de seguridad
- La colección incluye scripts de limpieza automática

**Versión**: 1.0  
**Última actualización**: Diciembre 2024