# Documentación API para Backend - Sistema de Checkout de Productos

## Base URL

```
https://api.tudominio.com/v1
```

---

## 1. Obtener Datos Iniciales del Producto

**Endpoint:** `GET /products/{productId}/initial`

**Descripción:** Retorna información básica del producto, banner y modelos disponibles (mini, pro, pro-max). Este es el primer endpoint que se llama al entrar a la página de producto.

**Parámetros:**

- `productId` (path, required): ID único del producto (ej: "iphone-13-pro-max-001")

**Ejemplo de Request:**

```
GET /products/iphone-13-pro-max-001/initial
```

**Response 200 - Success:**

```json
{
  "id": "iphone-13-pro-max-001",
  "marca": "Apple",
  "modelo": "iPhone 13 Pro Max",
  "bannerBackgroundImage": "https://cdn.tudominio.com/banners/iphone-13.png",
  "bannerVariants": [
    { "id": "mini", "label": "mini" },
    { "id": "pro", "label": "PRO" },
    { "id": "pro-max", "label": "PRO MAX" }
  ],
  "thumbnailImage": "https://cdn.tudominio.com/products/iphone-13-thumb.webp",
  "models": [
    {
      "id": "model-13",
      "name": "iPhone 13",
      "image": "https://cdn.tudominio.com/models/iphone-13.webp",
      "price": 0,
      "details": {
        "screenSize": "6.1 pulgadas",
        "camera": "Dual cámara 12MP",
        "otherDetail": "Chip A15 Bionic"
      }
    },
    {
      "id": "model-13-pro",
      "name": "iPhone 13 Pro",
      "image": "https://cdn.tudominio.com/models/iphone-13-pro.webp",
      "price": 0,
      "details": {
        "screenSize": "6.1 pulgadas ProMotion",
        "camera": "Triple cámara 12MP Pro",
        "otherDetail": "Chip A15 Bionic con GPU de 5 núcleos"
      }
    },
    {
      "id": "model-13-pro-max",
      "name": "iPhone 13 Pro Max",
      "image": "https://cdn.tudominio.com/models/iphone-13-pro-max.webp",
      "price": 0,
      "details": {
        "screenSize": "6.7 pulgadas ProMotion",
        "camera": "Triple cámara 12MP Pro",
        "otherDetail": "Mayor duración de batería"
      }
    }
  ]
}
```

**Notas:**

- `models.price` es 0 porque es el precio base incluido en la línea de productos
- `bannerVariants` son los chips que se muestran en el banner hero
- Todos los modelos de una familia de productos (ej: iPhone 13) deben retornarse aquí

---

## 2. Obtener Estados Disponibles (Nuevo/Refurbished)

**Endpoint:** `GET /products/{productId}/models/{modelId}/conditions`

**Descripción:** Retorna los estados disponibles (nuevo/refurbished) para un modelo específico con sus precios. Este endpoint se llama cuando el usuario selecciona un modelo.

**Parámetros:**

- `productId` (path, required): ID del producto
- `modelId` (path, required): ID del modelo seleccionado (ej: "model-13-pro-max")

**Ejemplo de Request:**

```
GET /products/iphone-13-pro-max-001/models/model-13-pro-max/conditions
```

**Response 200 - Success:**

```json
{
  "conditions": [
    {
      "id": "new",
      "name": "Nuevo",
      "price": 22990,
      "description": "Producto completamente nuevo con garantía completa del fabricante",
      "images": [
        "https://cdn.tudominio.com/products/iphone-13-new-1.webp",
        "https://cdn.tudominio.com/products/iphone-13-new-2.webp",
        "https://cdn.tudominio.com/products/iphone-13-new-3.webp"
      ]
    },
    {
      "id": "refurbished",
      "name": "Refurbished",
      "price": 19541,
      "description": "Producto reacondicionado certificado con garantía de 6 meses",
      "images": [
        "https://cdn.tudominio.com/products/iphone-13-refurb-1.webp",
        "https://cdn.tudominio.com/products/iphone-13-refurb-2.webp"
      ]
    }
  ]
}
```

**Notas:**

- `price` es el precio BASE del producto en ese estado
- `images` son fotos del mismo producto desde diferentes ángulos
- No todos los modelos tienen estado refurbished disponible

---

## 3. Obtener Opciones de Almacenamiento

**Endpoint:** `GET /products/{productId}/models/{modelId}/conditions/{conditionId}/storage`

**Descripción:** Retorna las opciones de almacenamiento disponibles para el modelo y estado seleccionados. Este endpoint se llama cuando el usuario selecciona un estado.

**Parámetros:**

- `productId` (path, required): ID del producto
- `modelId` (path, required): ID del modelo
- `conditionId` (path, required): ID del estado (ej: "new" o "refurbished")

**Ejemplo de Request:**

```
GET /products/iphone-13-pro-max-001/models/model-13-pro-max/conditions/new/storage
```

**Response 200 - Success:**

```json
{
  "storage": [
    {
      "id": "storage-128",
      "name": "128GB",
      "price": 0,
      "iconName": "INITIAL"
    },
    {
      "id": "storage-256",
      "name": "256GB",
      "price": 3000,
      "iconName": "MIDDLE"
    },
    {
      "id": "storage-512",
      "name": "512GB",
      "price": 6000,
      "iconName": "FULL"
    },
    {
      "id": "storage-1tb",
      "name": "1TB",
      "price": 9000,
      "iconName": "PRO"
    }
  ]
}
```

**Notas:**

- `iconName` puede ser: "INITIAL", "MIDDLE", "FULL", "PRO", "ULTRA"
- `price` es el INCREMENTO sobre el precio base del estado (no el precio total)
- Los productos refurbished pueden tener menos opciones de almacenamiento que los nuevos
- Algunos productos (como AirPods) no tienen almacenamiento y deben retornar array vacío `[]`

---

## 4. Obtener Colores Disponibles

**Endpoint:** `GET /products/{productId}/storage/{storageId}/colors`

**Descripción:** Retorna los colores disponibles para la configuración seleccionada. Este endpoint se llama cuando el usuario selecciona una opción de almacenamiento.

**Parámetros:**

- `productId` (path, required): ID del producto
- `storageId` (path, required): ID del almacenamiento seleccionado

**Query Params (opcionales):**

- `modelId` (string): ID del modelo (para filtrar colores específicos del modelo)
- `conditionId` (string): ID del estado (para casos donde el estado afecta los colores disponibles)

**Ejemplo de Request:**

```
GET /products/iphone-13-pro-max-001/storage/storage-256/colors?modelId=model-13-pro-max&conditionId=new
```

**Response 200 - Success:**

```json
{
  "colors": [
    {
      "id": "color-blue",
      "name": "Azul Sierra",
      "colorCode": "#5F8D9F"
    },
    {
      "id": "color-graphite",
      "name": "Grafito",
      "colorCode": "#54524F"
    },
    {
      "id": "color-gold",
      "name": "Oro",
      "colorCode": "#F4E8CE"
    },
    {
      "id": "color-silver",
      "name": "Plata",
      "colorCode": "#E3E4E5"
    }
  ]
}
```

**Notas:**

- `colorCode` DEBE ser un color hexadecimal válido en formato #RRGGBB (6 dígitos)
- No usar códigos cortos (#RGB) ni colores con alpha (#RRGGBBAA)
- Los colores disponibles pueden variar según el modelo y capacidad de almacenamiento

---

## 5. Obtener Accesorios Disponibles

**Endpoint:** `GET /products/{productId}/colors/{colorId}/accessories`

**Descripción:** Retorna los accesorios compatibles con la configuración final. Este endpoint se llama cuando el usuario selecciona un color.

**Parámetros:**

- `productId` (path, required): ID del producto
- `colorId` (path, required): ID del color seleccionado

**Query Params (opcionales):**

- `modelId` (string): Para filtrar accesorios específicos del modelo
- `storageId` (string): Para compatibilidad (algunos accesorios pueden no ser compatibles con ciertas capacidades)

**Ejemplo de Request:**

```
GET /products/iphone-13-pro-max-001/colors/color-blue/accessories?modelId=model-13-pro-max&storageId=storage-256
```

**Response 200 - Success:**

```json
{
  "accessories": [
    {
      "id": "case-apple-1",
      "name": "Funda MagSafe",
      "image": "https://cdn.tudominio.com/accessories/case-magsafe.webp",
      "price": 1290,
      "availableColors": [
        {
          "id": "case-black",
          "name": "Negro",
          "colorCode": "#000000"
        },
        {
          "id": "case-blue",
          "name": "Azul",
          "colorCode": "#1E3A8A"
        },
        {
          "id": "case-red",
          "name": "Rojo",
          "colorCode": "#DC2626"
        }
      ]
    },
    {
      "id": "charger-apple-1",
      "name": "Cargador 20W",
      "image": "https://cdn.tudominio.com/accessories/charger-20w.webp",
      "price": 590,
      "availableColors": [
        {
          "id": "charger-white",
          "name": "Blanco",
          "colorCode": "#FFFFFF"
        }
      ]
    },
    {
      "id": "cable-apple-1",
      "name": "Cable USB-C a Lightning",
      "image": "https://cdn.tudominio.com/accessories/cable-usbc.webp",
      "price": 490,
      "availableColors": [
        {
          "id": "cable-white",
          "name": "Blanco",
          "colorCode": "#FFFFFF"
        }
      ]
    }
  ]
}
```

**Notas:**

- `price` es el precio del accesorio (se suma al total)
- `availableColors` DEBE tener al menos un color
- Si un accesorio solo tiene un color, igual debe estar en el array `availableColors`
- `colorCode` debe seguir las mismas reglas que los colores de producto (#RRGGBB)
- Retornar array vacío `[]` si no hay accesorios disponibles para esa configuración

---

## Manejo de Errores

Todos los endpoints deben manejar errores de forma consistente usando el siguiente formato:

### Error 404 - Not Found

**Cuándo usarlo:**

- El producto no existe
- El modelo no existe
- El estado no existe para ese modelo
- La capacidad de almacenamiento no existe para esa configuración

**Response 404:**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Producto no encontrado",
    "details": "El producto con ID 'iphone-99-pro-max-001' no existe"
  }
}
```

### Error 400 - Bad Request

**Cuándo usarlo:**

- Parámetros inválidos o faltantes
- Combinación de opciones no disponible

**Response 400:**

```json
{
  "error": {
    "code": "INVALID_COMBINATION",
    "message": "Combinación no disponible",
    "details": "El modelo 'iPhone 13 Pro Max' no está disponible en estado refurbished con 1TB de almacenamiento"
  }
}
```

### Error 500 - Internal Server Error

**Cuándo usarlo:**

- Errores internos del servidor
- Problemas con la base de datos
- Errores inesperados

**Response 500:**

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error interno del servidor",
    "details": "Por favor intenta nuevamente más tarde"
  }
}
```

**Otros códigos de error útiles:**

- `INVALID_PRODUCT_ID`: El formato del ID de producto es inválido
- `INVALID_MODEL_ID`: El formato del ID de modelo es inválido
- `OUT_OF_STOCK`: El producto existe pero no está disponible
- `VALIDATION_ERROR`: Error en la validación de parámetros

---

## Notas Importantes para el Equipo de Backend

### 1. Caché y Performance

- **Endpoint inicial (`/initial`):** Puede ser cacheado por 24 horas (TTL: 24h). Los modelos de una familia de productos cambian muy poco.
- **Endpoints de configuración:** Deben responder en **< 500ms** (conditions, storage, colors, accessories).
- Usar Redis o similar para cachear respuestas de combinaciones populares.
- Implementar compresión gzip/brotli para reducir tamaño de respuestas.

### 2. Validación de Combinaciones

- **CRÍTICO:** Validar que las combinaciones modelo + estado + almacenamiento + color existan antes de retornar.
- No asumir que todas las combinaciones son válidas.
- Ejemplo: Un iPhone 13 refurbished puede no tener opción de 1TB.
- Retornar error 400 (`INVALID_COMBINATION`) cuando una combinación no es válida.

### 3. Imágenes y Assets

- Todas las URLs de imágenes DEBEN ser absolutas con HTTPS.
- Usar CDN (Cloudflare, AWS CloudFront, etc.) para servir imágenes.
- Formato recomendado: WebP con fallback a JPEG/PNG.
- Resoluciones sugeridas:
  - Banner: 1920x600px (desktop), 750x300px (mobile)
  - Modelos: 600x600px
  - Accesorios: 400x400px
  - Thumbnails: 200x200px

### 4. Precios

- SIEMPRE en números enteros (no usar flotantes).
- Representar en centavos/céntimos (ej: $229.90 = 22990).
- Frontend se encarga del formateo como moneda.
- No incluir símbolos de moneda en la respuesta JSON.
- El precio total se calcula así:
  ```
  Total = precio_estado + precio_almacenamiento + suma(precios_accesorios)
  ```

### 5. IDs y Naming

- Usar strings descriptivos para IDs, no números secuenciales.
- **Bueno:** `"model-13-pro-max"`, `"storage-256"`, `"color-blue"`
- **Malo:** `"1234"`, `"56"`, `"789"`
- IDs deben ser únicos dentro de su contexto (un modelo con ID único, un color con ID único, etc.).
- No usar guiones bajos `_`, preferir guiones `-`.

### 6. Disponibilidad y Stock

- Si un modelo/estado no tiene stock, NO retornarlo en la respuesta.
- No retornar opciones con `available: false` o similar.
- Frontend asume que todo lo que recibe está disponible.
- Si algo se agota después de seleccionarlo, manejarlo en el endpoint de checkout final.

### 7. Rate Limiting

- Implementar rate limiting por IP:
  - `/initial`: 20 requests/minuto
  - Otros endpoints: 60 requests/minuto
- Retornar headers estándar:
  ```
  X-RateLimit-Limit: 60
  X-RateLimit-Remaining: 45
  X-RateLimit-Reset: 1672531200
  ```

### 8. Headers Requeridos

Todos los endpoints deben incluir:

```
Content-Type: application/json; charset=utf-8
X-Request-ID: <uuid>
X-Response-Time: <ms>
```

### 9. CORS

Configurar CORS para permitir requests desde el dominio del frontend:

```
Access-Control-Allow-Origin: https://tudominio.com
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 10. Logging y Monitoring

- Logear todas las requests con:
  - Timestamp
  - Product ID
  - Model ID (si aplica)
  - Condition ID (si aplica)
  - Response time
  - Status code
- Monitorear:
  - Tasa de errores por endpoint
  - Tiempo de respuesta (p50, p95, p99)
  - Combinaciones más solicitadas
  - Combinaciones que retornan 400 (pueden indicar bug en frontend)

---

## Flujo Completo de Datos

### Paso 1: Usuario entra a `/producto/apple/iphone-13-pro-max/iphone-13-pro-max-001`

```
Frontend → GET /products/iphone-13-pro-max-001/initial
Backend  → Retorna datos iniciales + MODELOS
Frontend → Muestra banner y modelos (TODO disabled excepto modelos)
```

### Paso 2: Usuario selecciona MODELO (ej: iPhone 13 Pro Max)

```
Frontend → GET /products/iphone-13-pro-max-001/models/model-13-pro-max/conditions
Backend  → Retorna ESTADOS (Nuevo: $22,990 / Refurbished: $19,541)
Frontend → Habilita sección "Estado" (TODO lo demás disabled)
```

### Paso 3: Usuario selecciona ESTADO (ej: Nuevo)

```
Frontend → GET /products/.../models/model-13-pro-max/conditions/new/storage
Backend  → Retorna ALMACENAMIENTOS (128GB: $0, 256GB: +$3,000, etc.)
Frontend → Habilita sección "Almacenamiento" (TODO lo demás disabled)
Frontend → Precio total = $22,990
```

### Paso 4: Usuario selecciona ALMACENAMIENTO (ej: 256GB)

```
Frontend → GET /products/.../storage/storage-256/colors
Backend  → Retorna COLORES (Azul, Grafito, Oro, Plata)
Frontend → Habilita sección "Color" (Accesorios still disabled)
Frontend → Precio total = $22,990 + $3,000 = $25,990
```

### Paso 5: Usuario selecciona COLOR (ej: Azul Sierra)

```
Frontend → GET /products/.../colors/color-blue/accessories
Backend  → Retorna ACCESORIOS (Funda: $1,290, Cargador: $590, etc.)
Frontend → Habilita sección "Accesorios"
Frontend → Precio total sigue siendo $25,990 (accesorios opcionales)
```

### Paso 6: Usuario agrega ACCESORIOS (ej: Funda MagSafe en color Negro)

```
Frontend → Actualiza precio localmente (no hay request)
Frontend → Precio total = $25,990 + $1,290 = $27,280
```

### Paso 7: Usuario procede al pago

```
Frontend → POST /checkout (endpoint separado, fuera del scope de este doc)
Envía todas las selecciones para validar y procesar el pago
```

---

## Testing

### Datos de Prueba Recomendados

Crear los siguientes productos para pruebas:

1. **iPhone 13 Pro Max** (`iphone-13-pro-max-001`)
   - 3 modelos: 13, 13 Pro, 13 Pro Max
   - 2 estados: Nuevo, Refurbished
   - 4 almacenamientos (Nuevo): 128GB, 256GB, 512GB, 1TB
   - 3 almacenamientos (Refurbished): 128GB, 256GB, 512GB
   - 4 colores: Azul, Grafito, Oro, Plata
   - 4 accesorios

2. **Samsung Galaxy S23 Ultra** (`s23-ultra-001`)
   - 3 modelos: S23, S23 Plus, S23 Ultra
   - 2 estados: Nuevo, Refurbished
   - 3 almacenamientos: 256GB, 512GB, 1TB
   - 4 colores: Phantom Black, Cream, Green, Lavender
   - 4 accesorios

3. **AirPods Pro 2da Gen** (`airpods-pro-2gen-001`)
   - 1 modelo: AirPods Pro (2da Gen)
   - 2 estados: Nuevo, Refurbished
   - 0 almacenamientos: [] (no aplica)
   - 1 color: Blanco
   - 3 accesorios

---

## Changelog

### v1.0.0 - 2024-01-XX

- Documentación inicial
- 5 endpoints principales
- Estructura de errores estandarizada
- Notas para backend team

---

## Contacto

Para preguntas o aclaraciones sobre esta API, contactar a:

- **Frontend Lead:** [nombre]
- **Backend Lead:** [nombre]
- **Slack Channel:** #api-producto-checkout









