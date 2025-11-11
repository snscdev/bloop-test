# API Documentation - Sistema de Servicios de Reparación

## Contexto

El sistema de servicios técnicos permite a los usuarios:

1. **Seleccionar su dispositivo**: Marca y modelo específico
2. **Elegir calidad del repuesto**: Original, Premium o Económica (según disponibilidad para su dispositivo)
3. **Ver precio total**: Servicio base + costo del repuesto
4. **Agendar reparación**: Agregar al carrito y completar el proceso

### Características Clave:

- **Disponibilidad dinámica**: Los repuestos varían según marca y modelo del dispositivo
- **Precio base fijo**: Cada servicio tiene un precio base (ej: $79.99 MXN)
- **Precio del repuesto**: Se suma al precio base según la calidad elegida
- **Garantías variables**: Cada calidad de repuesto tiene diferente garantía (30, 60 o 90 días)

---

## Endpoints Requeridos

### 1. Obtener Servicio de Reparación por ID

Obtiene la información completa de un servicio de reparación con todas las opciones disponibles.

**Endpoint:**

```
GET /api/repair-services/{serviceId}
```

**Parámetros:**

- `serviceId` (string, path): ID único del servicio (ej: "screen-replacement", "battery-replacement")

**Query Parameters (opcional):**

- `serviceSlug` (string): Slug del servicio para contexto adicional

**Respuesta exitosa (200):**

```typescript
{
  id: string;                          // ID único del servicio
  name: string;                        // Nombre del servicio (ej: "Cambio de pantalla")
  slug: string;                        // Slug para URL (ej: "screen-replacement")
  description: string;                 // Descripción del servicio
  basePrice: number;                   // Precio base del servicio en centavos (ej: 7999 = $79.99)
  currency: string;                    // Moneda (ej: "MXN")
  category: string;                    // Categoría (ej: "screen", "battery", "camera")
  estimatedTime: string;               // Tiempo estimado (ej: "2-3 horas", "24 horas")
  warrantyDays: number;                // Días de garantía del servicio base

  supportedBrands: DeviceBrand[];      // Marcas de dispositivos compatibles con sus modelos

  gallery: string[];                   // Imágenes del servicio
  highlights: string[];                // Puntos destacados
  termsAndConditions: string;          // Términos y condiciones del servicio
}
```

**Ejemplo de respuesta:**

```json
{
  "id": "screen-replacement",
  "name": "Cambio de pantalla",
  "slug": "cambio-de-pantalla",
  "description": "Reemplazo completo de la pantalla de tu dispositivo con repuestos de alta calidad. Incluye limpieza interna y pruebas de funcionamiento.",
  "basePrice": 7999,
  "currency": "MXN",
  "category": "screen",
  "estimatedTime": "2-3 horas",
  "warrantyDays": 90,

  "supportedBrands": [
    {
      "id": "apple",
      "name": "Apple",
      "slug": "apple",
      "iconUrl": "https://cdn.bloop.com/brands/apple.svg",
      "models": [
        {
          "id": "iphone-15-pro-max",
          "name": "iPhone 15 Pro Max",
          "slug": "iphone-15-pro-max",
          "releaseYear": 2023,
          "imageUrl": "https://cdn.bloop.com/devices/iphone-15-pro-max.png"
        },
        {
          "id": "iphone-15-plus",
          "name": "iPhone 15 Plus",
          "slug": "iphone-15-plus",
          "releaseYear": 2023,
          "imageUrl": "https://cdn.bloop.com/devices/iphone-15-plus.png"
        },
        {
          "id": "iphone-14",
          "name": "iPhone 14",
          "slug": "iphone-14",
          "releaseYear": 2022,
          "imageUrl": "https://cdn.bloop.com/devices/iphone-14.png"
        }
      ]
    },
    {
      "id": "samsung",
      "name": "Samsung",
      "slug": "samsung",
      "iconUrl": "https://cdn.bloop.com/brands/samsung.svg",
      "models": [
        {
          "id": "galaxy-s24-plus",
          "name": "Galaxy S24 Plus",
          "slug": "galaxy-s24-plus",
          "releaseYear": 2024,
          "imageUrl": "https://cdn.bloop.com/devices/galaxy-s24-plus.png"
        },
        {
          "id": "galaxy-s24-ultra",
          "name": "Galaxy S24 Ultra",
          "slug": "galaxy-s24-ultra",
          "releaseYear": 2024,
          "imageUrl": "https://cdn.bloop.com/devices/galaxy-s24-ultra.png"
        },
        {
          "id": "galaxy-z-flip-5",
          "name": "Galaxy Z Flip 5",
          "slug": "galaxy-z-flip-5",
          "releaseYear": 2023,
          "imageUrl": "https://cdn.bloop.com/devices/galaxy-z-flip-5.png"
        }
      ]
    },
    {
      "id": "google",
      "name": "Google",
      "slug": "google",
      "iconUrl": "https://cdn.bloop.com/brands/google.svg",
      "models": [
        {
          "id": "pixel-8-pro",
          "name": "Pixel 8 Pro",
          "slug": "pixel-8-pro",
          "releaseYear": 2023,
          "imageUrl": "https://cdn.bloop.com/devices/pixel-8-pro.png"
        },
        {
          "id": "pixel-7a",
          "name": "Pixel 7a",
          "slug": "pixel-7a",
          "releaseYear": 2023,
          "imageUrl": "https://cdn.bloop.com/devices/pixel-7a.png"
        }
      ]
    }
  ],

  "gallery": [
    "https://cdn.bloop.com/services/screen-replacement-1.jpg",
    "https://cdn.bloop.com/services/screen-replacement-2.jpg",
    "https://cdn.bloop.com/services/screen-replacement-3.jpg",
    "https://cdn.bloop.com/services/screen-replacement-4.jpg"
  ],

  "highlights": [
    "Técnicos certificados con más de 5 años de experiencia",
    "Proceso de reparación en ambiente controlado",
    "Pruebas exhaustivas antes de entrega",
    "Garantía extendida disponible"
  ],

  "termsAndConditions": "El servicio incluye mano de obra y limpieza interna. La garantía cubre defectos de fabricación del repuesto instalado. No cubre daños causados por mal uso o golpes posteriores..."
}
```

**Errores:**

- `404 Not Found`: Servicio no encontrado
- `500 Internal Server Error`: Error del servidor

---

### 2. Obtener Repuestos Disponibles para Dispositivo

Obtiene solo los repuestos compatibles con un dispositivo específico. Este endpoint se llama cuando el usuario selecciona marca y modelo.

**Endpoint:**

```
GET /api/repair-services/{serviceId}/replacements
```

**Parámetros:**

- `serviceId` (string, path): ID del servicio

**Query Parameters:**

- `brandId` (string, required): ID de la marca del dispositivo
- `modelId` (string, required): ID del modelo del dispositivo

**Respuesta exitosa (200):**

```typescript
{
  availableReplacements: ReplacementOption[];
  recommendedReplacementId: string | null;
}
```

**Ejemplo de request:**

```
GET /api/repair-services/screen-replacement/replacements?brandId=apple&modelId=iphone-15-pro-max
```

**Ejemplo de respuesta:**

```json
{
  "availableReplacements": [
    {
      "id": "original",
      "name": "Pantalla original",
      "qualityLevel": "original",
      "price": 14999,
      "description": "Repuesto certificado por el fabricante con calibración original.",
      "imageUrl": "https://cdn.bloop.com/replacements/original-screen.jpg",
      "benefits": ["100% original", "True Tone compatible", "Garantía 90 días"],
      "warrantyDays": 90,
      "isRecommended": true
    }
  ],
  "recommendedReplacementId": "original"
}
```

**Errores:**

- `404 Not Found`: Servicio no encontrado
- `400 Bad Request`: Parámetros inválidos o faltantes
- `200 OK + Empty Array`: No hay repuestos disponibles para ese dispositivo
- `500 Internal Server Error`: Error del servidor

---

### 3. Listar Servicios de Reparación

Obtiene una lista de todos los servicios de reparación disponibles.

**Endpoint:**

```
GET /api/repair-services
```

**Query Parameters (opcional):**

- `category` (string): Filtrar por categoría (ej: "screen", "battery", "camera")
- `brandId` (string): Filtrar por marca compatible
- `modelId` (string): Filtrar por modelo compatible
- `page` (number): Número de página (default: 1)
- `limit` (number): Items por página (default: 20)

**Respuesta exitosa (200):**

```typescript
{
  services: RepairServiceSummary[];
  total: number;
  page: number;
  limit: number;
}

type RepairServiceSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: string;
  category: string;
  estimatedTime: string;
  iconUrl: string;
  thumbnailUrl: string;
}
```

**Ejemplo de respuesta:**

```json
{
  "services": [
    {
      "id": "screen-replacement",
      "name": "Cambio de pantalla",
      "slug": "cambio-de-pantalla",
      "description": "Reemplazo completo de la pantalla de tu dispositivo",
      "basePrice": 7999,
      "currency": "MXN",
      "category": "screen",
      "estimatedTime": "2-3 horas",
      "iconUrl": "https://cdn.bloop.com/icons/screen.svg",
      "thumbnailUrl": "https://cdn.bloop.com/services/screen-thumb.jpg"
    },
    {
      "id": "battery-replacement",
      "name": "Cambio de batería",
      "slug": "cambio-de-bateria",
      "description": "Reemplazo de batería con repuesto de alta capacidad",
      "basePrice": 5999,
      "currency": "MXN",
      "category": "battery",
      "estimatedTime": "1-2 horas",
      "iconUrl": "https://cdn.bloop.com/icons/battery.svg",
      "thumbnailUrl": "https://cdn.bloop.com/services/battery-thumb.jpg"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

---

### 4. Validar Disponibilidad de Servicio

Valida si un servicio específico está disponible para un dispositivo antes de agregar al carrito.

**Endpoint:**

```
POST /api/repair-services/{serviceId}/validate
```

**Parámetros:**

- `serviceId` (string, path): ID del servicio

**Body:**

```typescript
{
  brandId: string;
  modelId: string;
  replacementId: string;
}
```

**Ejemplo de request:**

```json
{
  "brandId": "apple",
  "modelId": "iphone-15-pro-max",
  "replacementId": "original"
}
```

**Respuesta exitosa (200):**

```typescript
{
  available: boolean;
  servicePrice: number;               // Precio base del servicio
  replacementPrice: number;           // Precio del repuesto
  totalPrice: number;                 // Suma total
  currency: string;
  estimatedTime: string;
  warrantyDays: number;               // Días de garantía del repuesto
  message?: string;                   // Mensaje si no está disponible
}
```

**Ejemplo de respuesta (disponible):**

```json
{
  "available": true,
  "servicePrice": 7999,
  "replacementPrice": 14999,
  "totalPrice": 22998,
  "currency": "MXN",
  "estimatedTime": "2-3 horas",
  "warrantyDays": 90
}
```

**Ejemplo de respuesta (no disponible):**

```json
{
  "available": false,
  "servicePrice": 7999,
  "replacementPrice": 0,
  "totalPrice": 0,
  "currency": "MXN",
  "estimatedTime": "2-3 horas",
  "warrantyDays": 0,
  "message": "El repuesto seleccionado no está disponible para este modelo"
}
```

**Errores:**

- `404 Not Found`: Servicio, marca, modelo o repuesto no encontrado
- `400 Bad Request`: Datos inválidos
- `500 Internal Server Error`: Error del servidor

---

## Tipos de Datos (TypeScript)

```typescript
// Modelo de dispositivo
type DeviceModel = {
  id: string;
  name: string;
  slug: string;
  releaseYear: number;
  imageUrl?: string;
};

// Marca de dispositivo con sus modelos
type DeviceBrand = {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  models: DeviceModel[];
};

// Disponibilidad del repuesto
type ReplacementAvailability = {
  brands: string[]; // IDs de marcas compatibles
  models: string[]; // IDs de modelos compatibles
};

// Opción de repuesto
type ReplacementOption = {
  id: string;
  name: string;
  qualityLevel: 'original' | 'premium' | 'economy';
  price: number; // Precio en centavos
  description: string;
  imageUrl: string;
  benefits: string[]; // Lista de beneficios
  warrantyDays: number; // Días de garantía del repuesto
  isRecommended: boolean;
  availability: ReplacementAvailability;
};

// Servicio de reparación completo (usado por endpoint GET /api/repair-services/{id})
type RepairService = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number; // Precio base en centavos
  currency: string;
  category: string;
  estimatedTime: string;
  warrantyDays: number; // Garantía del servicio base

  supportedBrands: DeviceBrand[]; // Marcas y modelos compatibles

  gallery: string[];
  highlights: string[];
  termsAndConditions: string;
};

// Resumen de servicio para listados
type RepairServiceSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: string;
  category: string;
  estimatedTime: string;
  iconUrl: string;
  thumbnailUrl: string;
};
```

---

## Flujo de Usuario

### 1. Carga Inicial de Servicio

1. Usuario visita `/reparar/cambio-de-pantalla/screen-replacement`
2. Frontend llama `GET /api/repair-services/screen-replacement`
3. Backend retorna:
   - Información básica del servicio (nombre, descripción, precio base)
   - Marcas compatibles con sus modelos
   - Galería de imágenes
4. Frontend muestra:
   - Banner del servicio
   - Sección de selección de dispositivo (marca y modelo vacíos)
   - Steps del proceso (definidos en frontend, siempre fijos)

### 2. Selección de Dispositivo

1. Usuario selecciona marca (ej: "Apple")
2. Frontend actualiza dropdown de modelos con los de esa marca
3. Usuario selecciona modelo (ej: "iPhone 15 Pro Max")
4. Frontend llama:
   ```
   GET /api/repair-services/screen-replacement/replacements?brandId=apple&modelId=iphone-15-pro-max
   ```
5. Backend retorna solo repuestos compatibles con ese dispositivo
6. Frontend muestra sección de calidad de repuesto con opciones filtradas
7. Frontend hace scroll automático a la sección de calidad

### 3. Selección de Calidad de Repuesto

1. Usuario selecciona calidad (ej: "Pantalla original")
2. Frontend actualiza precio total: `BASE_SERVICE_PRICE + replacementOption.price`
3. Frontend muestra sección de checkout con:
   - Carrusel de imágenes del servicio
   - Resumen del servicio con precio total
   - Botones "Comprar ahora" y "Agregar al carrito"
4. Frontend hace scroll automático a la sección de checkout

### 4. Agregar al Carrito

1. Usuario hace clic en "Agregar al carrito"
2. Frontend llama (opcional pero recomendado):
   ```
   POST /api/repair-services/screen-replacement/validate
   ```
   Body:
   ```json
   {
     "brandId": "apple",
     "modelId": "iphone-15-pro-max",
     "replacementId": "original"
   }
   ```
3. Backend valida disponibilidad y retorna precio actualizado
4. Si disponible, frontend agrega al carrito local:
   ```json
   {
     "id": "service|screen-replacement|apple|iphone-15-pro-max|original",
     "type": "servicio",
     "servicio": "cambio-de-pantalla",
     "nombre": "Cambio de pantalla - iPhone 15 Pro Max - Pantalla original",
     "precio": 22998,
     "imagen": "https://cdn.bloop.com/replacements/original-screen.jpg",
     "options": {
       "service": {
         "id": "screen-replacement",
         "name": "Cambio de pantalla",
         "basePrice": 7999
       },
       "device": {
         "brandId": "apple",
         "brandName": "Apple",
         "modelId": "iphone-15-pro-max",
         "modelName": "iPhone 15 Pro Max"
       },
       "replacement": {
         "id": "original",
         "name": "Pantalla original",
         "qualityLevel": "original",
         "price": 14999,
         "warrantyDays": 90
       }
     }
   }
   ```
5. Frontend redirige a `/cart`

### 5. Comprar Ahora

Similar a "Agregar al carrito", pero:

1. Valida disponibilidad
2. Agrega al carrito
3. Redirige directamente al checkout/pago

---

## Validaciones Requeridas

### Backend debe validar:

1. **Compatibilidad del dispositivo**:
   - Verificar que la marca existe en `supportedBrands`
   - Verificar que el modelo existe en `brand.models`

2. **Disponibilidad del repuesto**:
   - Verificar que `brandId` está en `availability.brands`
   - Verificar que `modelId` está en `availability.models`
   - Verificar que hay stock disponible del repuesto

3. **Precio actualizado**:
   - Retornar precio actual del servicio
   - Retornar precio actual del repuesto
   - Calcular total correctamente

4. **Servicio activo**:
   - Verificar que el servicio está activo y publicado
   - Verificar que acepta nuevas solicitudes

---

## Consideraciones de Performance

1. **Caché**:
   - Cachear respuesta de `GET /api/repair-services/{id}` por 10 minutos
   - Cachear listado de servicios por 15 minutos
   - Invalidar caché al actualizar precios o disponibilidades

2. **Optimización de Queries**:
   - Usar índices en `brandId` y `modelId`
   - Pre-cargar relaciones (brands → models, service → replacements)

3. **CDN para imágenes**:
   - Todas las imágenes en CDN
   - Usar WebP con fallback a JPEG
   - Imágenes optimizadas por tamaño de pantalla

4. **Validación en Frontend**:
   - Filtrar opciones localmente cuando sea posible
   - Reducir llamadas al servidor
   - Validar en servidor solo antes de agregar al carrito

---

## Notas Importantes

1. **Precios en centavos**: Todos los precios en centavos (ej: 7999 = $79.99 MXN)

2. **Precio total**: Siempre es `basePrice + replacementPrice`

3. **Disponibilidad dinámica**: Los repuestos disponibles cambian según el dispositivo

4. **Garantías separadas**:
   - Servicio base tiene su propia garantía (ej: 90 días)
   - Cada repuesto puede tener garantía diferente (30, 60 o 90 días)
   - La garantía final es la menor de las dos

5. **Servicios sin cantidad**: En el carrito, los servicios NO tienen contador de cantidad (siempre 1)

6. **Imágenes del repuesto**: Se muestran en el checkout, no del servicio genérico

7. **Stock**: Aunque el servicio esté disponible, validar stock del repuesto específico

8. **Steps fijos**: Los pasos del proceso (Elige modelo, Confirma solicitud, Entrega dispositivo, Recibe dispositivo) están hardcodeados en el frontend y son iguales para todos los servicios. No necesitan venir del backend.

9. **Carga de repuestos bajo demanda**: Los repuestos no se cargan en el primer request. Se obtienen solo después de seleccionar marca y modelo para reducir payload y asegurar datos actualizados.

---

## Ejemplo de Implementación Mínima

Si necesitas implementar solo lo básico:

1. **Prioritario**:
   - `GET /api/repair-services/{id}` con información básica (sin steps ni replacementOptions)
   - `GET /api/repair-services/{id}/replacements` para obtener repuestos por dispositivo
   - `POST /api/repair-services/{id}/validate` para validar antes de agregar al carrito

2. **Opcional**:
   - `GET /api/repair-services` para el catálogo de servicios

---

## Estructura de Carrito para Servicios

Cuando se agrega un servicio al carrito:

```typescript
{
  id: string; // ID único: "service|serviceId|brandId|modelId|replacementId"
  type: 'servicio'; // Tipo fijo
  servicio: string; // Slug del servicio
  nombre: string; // Nombre descriptivo completo
  precio: number; // Precio total (servicio + repuesto)
  imagen: string; // Imagen del repuesto seleccionado
  cantidad: 1; // Siempre 1 (no se permite cambiar)

  options: {
    service: {
      id: string;
      name: string;
      basePrice: number;
    }
    device: {
      brandId: string;
      brandName: string;
      modelId: string;
      modelName: string;
    }
    replacement: {
      id: string;
      name: string;
      qualityLevel: string;
      price: number;
      warrantyDays: number;
    }
  }
}
```

**Importante**:

- El campo `options.accessories` NO existe en servicios (solo en productos)
- El `type` debe ser exactamente `'servicio'` para identificarlo en el carrito
- La imagen debe ser la del repuesto, no del servicio

---

## Diferencias con Productos

| Aspecto    | Productos         | Servicios               |
| ---------- | ----------------- | ----------------------- |
| Cantidad   | Variable (1-99)   | Siempre 1               |
| Precio     | Fijo por variante | Base + Repuesto         |
| Stock      | Por variante      | Por repuesto            |
| Accesorios | Sí                | No                      |
| Colores    | Sí                | No                      |
| Garantía   | Por producto      | Por servicio + repuesto |
| Envío      | Sí                | No (se agenda)          |

---

## Preguntas Frecuentes

**¿Por qué separar el precio base y el del repuesto?**

- Permite flexibilidad en precios sin replicar servicios
- Facilita actualizaciones de precios independientes
- Usuario ve desglose transparente

**¿Qué pasa si no hay repuestos disponibles para un dispositivo?**

- El servicio sigue apareciendo
- Al seleccionar el dispositivo, se muestra mensaje: "No hay repuestos disponibles para este modelo"
- El botón de continuar se deshabilita

**¿Cómo se agrega stock de repuestos?**

- Cada `ReplacementOption` debe tener un campo `stock` en la base de datos
- Validar stock antes de confirmar la reparación
- Restar del stock al confirmar el servicio

**¿Se pueden combinar múltiples servicios?**

- Sí, cada servicio es un item independiente en el carrito
- Usuario puede agregar "Cambio de pantalla" + "Cambio de batería" para el mismo dispositivo

**¿Cómo se maneja la agenda de reparación?**

- Eso es parte del proceso de checkout/pago (no documentado aquí)
- Después del pago, se solicita fecha y método de entrega
