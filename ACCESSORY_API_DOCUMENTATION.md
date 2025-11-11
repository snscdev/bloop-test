# API Documentation - Sistema de Accesorios Multi-Marca

## Contexto

El sistema de accesorios permite que un mismo producto (ejemplo: "Funda MagSafe") tenga variantes para múltiples marcas (Apple y Samsung), donde cada marca tiene:

- **Modelos específicos**: iPhone 15, iPhone 15 Pro vs Galaxy S24, Galaxy S24 Ultra
- **Colores específicos**: "Gris Sideral" (Apple) vs "Phantom Gray" (Samsung)
- **Precios diferentes**: $249.99 MXN (Apple) vs $229.99 MXN (Samsung)
- **Stock independiente**: Cada combinación marca + modelo + color tiene su propio stock

## Endpoints Requeridos

### 1. Obtener Accesorio por ID

Obtiene la información básica de un accesorio y todas sus variantes de marca disponibles.

**Endpoint:**
```
GET /api/accessories/{accessoryId}
```

**Parámetros:**
- `accessoryId` (string, path): ID único del accesorio

**Respuesta exitosa (200):**

```typescript
{
  id: string;                          // ID único del accesorio
  name: string;                        // Nombre del accesorio (ej: "Funda con MagSafe")
  slug: string;                        // Slug para URL (ej: "magsafe-case-universal")
  shortDescription: string;            // Descripción corta para preview
  description: string;                 // Descripción completa del producto
  currency: string;                    // Moneda (ej: "MXN")
  brandVariants: AccessoryBrandVariant[]; // Array de variantes por marca
  compatibility: string[];             // Lista de compatibilidades
  highlights: string[];                // Puntos destacados del producto
}
```

**Ejemplo de respuesta:**

```json
{
  "id": "magsafe-case-universal",
  "name": "Funda con MagSafe",
  "slug": "magsafe-case-universal",
  "shortDescription": "Protección premium compatible con MagSafe.",
  "description": "La funda con MagSafe combina un diseño esbelto con una protección resistente...",
  "currency": "MXN",
  "brandVariants": [
    {
      "brandId": "apple",
      "brandName": "Apple",
      "brandSlug": "apple",
      "models": [
        {
          "id": "iphone-15",
          "name": "iPhone 15",
          "slug": "iphone-15"
        },
        {
          "id": "iphone-15-pro",
          "name": "iPhone 15 Pro",
          "slug": "iphone-15-pro"
        },
        {
          "id": "iphone-15-pro-max",
          "name": "iPhone 15 Pro Max",
          "slug": "iphone-15-pro-max"
        }
      ],
      "colorOptions": [
        {
          "id": "gris-sideral",
          "name": "Gris Sideral",
          "value": "gris-sideral",
          "hex": "#54524F"
        },
        {
          "id": "azul-pacifico",
          "name": "Azul Pacífico",
          "value": "azul-pacifico",
          "hex": "#3C5F74"
        },
        {
          "id": "medianoche",
          "name": "Medianoche",
          "value": "medianoche",
          "hex": "#1F1F1F"
        },
        {
          "id": "blanco-estelar",
          "name": "Blanco Estelar",
          "value": "blanco-estelar",
          "hex": "#F6F6F6"
        }
      ],
      "variants": [
        {
          "id": "magsafe-apple-gris-sideral",
          "colorId": "gris-sideral",
          "modelId": "iphone-15-pro",
          "price": 24999,
          "stock": 10,
          "sku": "ACC-APL-GS-001",
          "images": [
            {
              "id": "apple-gris-sideral-1",
              "url": "https://cdn.bloop.com/accessories/magsafe-apple-gray-1.jpg",
              "alt": "Funda MagSafe gris sideral para iPhone"
            },
            {
              "id": "apple-gris-sideral-2",
              "url": "https://cdn.bloop.com/accessories/magsafe-apple-gray-2.jpg",
              "alt": "Funda MagSafe gris sideral vista lateral"
            }
          ]
        }
      ],
      "price": 24999,
      "heroImage": {
        "id": "apple-hero",
        "url": "https://cdn.bloop.com/accessories/magsafe-apple-hero.jpg",
        "alt": "Funda MagSafe para iPhone"
      },
      "gallery": [
        {
          "id": "apple-gallery-1",
          "url": "https://cdn.bloop.com/accessories/magsafe-apple-1.jpg",
          "alt": "Funda MagSafe gris para iPhone"
        },
        {
          "id": "apple-gallery-2",
          "url": "https://cdn.bloop.com/accessories/magsafe-apple-2.jpg",
          "alt": "Funda MagSafe azul para iPhone"
        }
      ]
    },
    {
      "brandId": "samsung",
      "brandName": "Samsung",
      "brandSlug": "samsung",
      "models": [
        {
          "id": "galaxy-s24-plus",
          "name": "Galaxy S24 Plus",
          "slug": "galaxy-s24-plus"
        },
        {
          "id": "galaxy-s24-ultra",
          "name": "Galaxy S24 Ultra",
          "slug": "galaxy-s24-ultra"
        }
      ],
      "colorOptions": [
        {
          "id": "phantom-gray",
          "name": "Phantom Gray",
          "value": "phantom-gray",
          "hex": "#5F5F5F"
        },
        {
          "id": "phantom-black",
          "name": "Phantom Black",
          "value": "phantom-black",
          "hex": "#1F1F1F"
        },
        {
          "id": "cream",
          "name": "Cream",
          "value": "cream",
          "hex": "#D6C2A6"
        },
        {
          "id": "lavender",
          "name": "Lavender",
          "value": "lavender",
          "hex": "#C7C1E4"
        }
      ],
      "variants": [
        {
          "id": "magsafe-samsung-phantom-gray",
          "colorId": "phantom-gray",
          "modelId": "galaxy-s24-plus",
          "price": 22999,
          "stock": 12,
          "sku": "ACC-SAM-PG-001",
          "images": [
            {
              "id": "samsung-gray-1",
              "url": "https://cdn.bloop.com/accessories/magsafe-samsung-gray-1.jpg",
              "alt": "Funda MagSafe Phantom Gray para Galaxy"
            }
          ]
        }
      ],
      "price": 22999,
      "heroImage": {
        "id": "samsung-hero",
        "url": "https://cdn.bloop.com/accessories/magsafe-samsung-hero.jpg",
        "alt": "Funda MagSafe para Galaxy"
      },
      "gallery": [
        {
          "id": "samsung-gallery-1",
          "url": "https://cdn.bloop.com/accessories/magsafe-samsung-1.jpg",
          "alt": "Funda MagSafe Phantom Gray para Galaxy"
        }
      ]
    }
  ],
  "compatibility": [
    "iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max",
    "Samsung Galaxy S24 Plus, Galaxy S24 Ultra",
    "Cargadores magnéticos MagSafe",
    "Soportes magnéticos para auto"
  ],
  "highlights": [
    "Diseño ultrafino con agarre texturizado",
    "Protección de cámara elevada",
    "100% compatible con accesorios MagSafe",
    "Materiales flexibles que absorben impactos"
  ]
}
```

**Errores:**
- `404 Not Found`: Accesorio no encontrado
- `500 Internal Server Error`: Error del servidor

---

### 2. Obtener Variante de Marca Específica

Obtiene solo la información de una marca específica para un accesorio. Este endpoint se llama cuando el usuario cambia de marca en el selector.

**Endpoint:**
```
GET /api/accessories/{accessoryId}/brands/{brandId}
```

**Parámetros:**
- `accessoryId` (string, path): ID del accesorio
- `brandId` (string, path): ID de la marca (ej: "apple", "samsung")

**Respuesta exitosa (200):**

```typescript
{
  brandId: string;                    // ID de la marca
  brandName: string;                  // Nombre de la marca
  brandSlug: string;                  // Slug de la marca
  models: AccessoryModelOption[];     // Modelos compatibles
  colorOptions: AccessoryColorOption[]; // Colores disponibles
  variants: AccessoryVariant[];       // Variantes (combinaciones de modelo + color)
  gallery: AccessoryImage[];          // Galería de imágenes
  price: number;                      // Precio base
  heroImage: AccessoryImage;          // Imagen principal
}
```

**Ejemplo de respuesta:**

```json
{
  "brandId": "apple",
  "brandName": "Apple",
  "brandSlug": "apple",
  "models": [
    {
      "id": "iphone-15",
      "name": "iPhone 15",
      "slug": "iphone-15"
    },
    {
      "id": "iphone-15-pro",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro"
    }
  ],
  "colorOptions": [
    {
      "id": "gris-sideral",
      "name": "Gris Sideral",
      "value": "gris-sideral",
      "hex": "#54524F"
    }
  ],
  "variants": [
    {
      "id": "magsafe-apple-gris-sideral",
      "colorId": "gris-sideral",
      "modelId": "iphone-15-pro",
      "price": 24999,
      "stock": 10,
      "sku": "ACC-APL-GS-001",
      "images": [
        {
          "id": "apple-gris-sideral-1",
          "url": "https://cdn.bloop.com/accessories/magsafe-apple-gray-1.jpg",
          "alt": "Funda MagSafe gris sideral para iPhone"
        }
      ]
    }
  ],
  "price": 24999,
  "heroImage": {
    "id": "apple-hero",
    "url": "https://cdn.bloop.com/accessories/magsafe-apple-hero.jpg",
    "alt": "Funda MagSafe para iPhone"
  },
  "gallery": [
    {
      "id": "apple-gallery-1",
      "url": "https://cdn.bloop.com/accessories/magsafe-apple-1.jpg",
      "alt": "Funda MagSafe gris para iPhone"
    }
  ]
}
```

**Errores:**
- `404 Not Found`: Accesorio o marca no encontrada
- `500 Internal Server Error`: Error del servidor

---

### 3. Listar Accesorios (Resumen)

Obtiene una lista de todos los accesorios disponibles con información resumida.

**Endpoint:**
```
GET /api/accessories
```

**Query Parameters (opcional):**
- `brand` (string): Filtrar por marca (ej: "apple", "samsung")
- `category` (string): Filtrar por categoría (ej: "cases", "chargers", "cables")
- `page` (number): Número de página (default: 1)
- `limit` (number): Items por página (default: 20)

**Respuesta exitosa (200):**

```typescript
{
  accessories: AccessorySummary[];
  total: number;
  page: number;
  limit: number;
}

type AccessorySummary = {
  id: string;
  name: string;
  slug: string;
  price: number;                      // Precio mínimo entre todas las marcas
  currency: string;
  brand: {                            // Primera marca disponible
    id: string;
    name: string;
    slug: string;
  };
  model: {                            // Primer modelo de la primera marca
    id: string;
    name: string;
    slug: string;
  };
  heroImage: AccessoryImage;          // Imagen de la primera marca
}
```

**Ejemplo de respuesta:**

```json
{
  "accessories": [
    {
      "id": "magsafe-case-universal",
      "name": "Funda con MagSafe",
      "slug": "magsafe-case-universal",
      "price": 22999,
      "currency": "MXN",
      "brand": {
        "id": "apple",
        "name": "Apple",
        "slug": "apple"
      },
      "model": {
        "id": "iphone-15",
        "name": "iPhone 15",
        "slug": "iphone-15"
      },
      "heroImage": {
        "id": "apple-hero",
        "url": "https://cdn.bloop.com/accessories/magsafe-apple-hero.jpg",
        "alt": "Funda MagSafe para iPhone"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

## Tipos de Datos (TypeScript)

```typescript
// Imagen de accesorio
type AccessoryImage = {
  id: string;
  url: string;
  alt: string;
};

// Opción de color
type AccessoryColorOption = {
  id: string;
  name: string;
  value: string;
  hex?: string;                       // Código hexadecimal del color
};

// Modelo compatible
type AccessoryModelOption = {
  id: string;
  name: string;
  slug: string;
};

// Variante específica (combinación modelo + color + stock)
type AccessoryVariant = {
  id: string;
  colorId: string;
  modelId?: string;                   // Opcional si aplica para todos los modelos
  price: number;                      // Precio en centavos (ej: 24999 = $249.99)
  stock: number;                      // Cantidad disponible
  sku?: string;                       // SKU del producto
  images: AccessoryImage[];           // Imágenes de esta variante específica
};

// Variante por marca (toda la información de una marca)
type AccessoryBrandVariant = {
  brandId: string;
  brandName: string;
  brandSlug: string;
  models: AccessoryModelOption[];
  colorOptions: AccessoryColorOption[];
  variants: AccessoryVariant[];
  gallery: AccessoryImage[];
  price: number;                      // Precio base de esta marca
  heroImage: AccessoryImage;
};

// Accesorio completo
type Accessory = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  currency: string;
  brandVariants: AccessoryBrandVariant[];
  compatibility: string[];
  highlights: string[];
};
```

---

## Flujo de Usuario

### Carga Inicial

1. Usuario visita `/accesorio/magsafe-case-universal`
2. Frontend llama `GET /api/accessories/magsafe-case-universal`
3. Backend retorna accesorio completo con todas las `brandVariants`
4. Frontend muestra la primera marca disponible (Apple)

### Cambio de Marca

1. Usuario selecciona "Samsung" en el dropdown de marca
2. Frontend muestra loading (CircularProgress + Skeleton)
3. Frontend llama `GET /api/accessories/magsafe-case-universal/brands/samsung`
4. Backend retorna solo la información de Samsung
5. Frontend actualiza:
   - Galería de imágenes (con las de Samsung)
   - Opciones de color (Phantom Gray, Phantom Black, etc.)
   - Precio base ($229.99)
   - Modelos disponibles (Galaxy S24 Plus, Galaxy S24 Ultra)
   - Stock disponible

### Agregar al Carrito

Cuando el usuario agrega al carrito, el frontend envía:

```json
{
  "accessoryId": "magsafe-case-universal",
  "variantId": "magsafe-samsung-phantom-gray",
  "quantity": 2,
  "selections": {
    "brandId": "samsung",
    "brandName": "Samsung",
    "modelId": "galaxy-s24-plus",
    "modelName": "Galaxy S24 Plus",
    "colorId": "phantom-gray",
    "colorName": "Phantom Gray",
    "colorHex": "#5F5F5F"
  }
}
```

---

## Validaciones Requeridas

### Backend debe validar:

1. **Stock disponible**: Verificar que `variant.stock >= quantity`
2. **Variante existe**: Verificar que la combinación marca + modelo + color existe
3. **Precio actual**: Retornar el precio actualizado al momento de agregar al carrito
4. **Disponibilidad**: Verificar que el accesorio esté activo y publicado

---

## Consideraciones de Performance

1. **Caché**: Cachear la respuesta de `GET /api/accessories/{id}` por 5 minutos
2. **Lazy Loading**: El endpoint `/brands/{brandId}` permite cargar solo lo necesario
3. **CDN**: Las imágenes deben estar en un CDN para carga rápida
4. **Compresión**: Comprimir respuestas JSON con gzip

---

## Notas Importantes

1. **Precios en centavos**: Todos los precios se manejan en centavos (ej: 24999 = $249.99 MXN)
2. **Stock en tiempo real**: El stock debe actualizarse en tiempo real cuando se complete una compra
3. **Imágenes optimizadas**: Las URLs de imágenes deben apuntar a versiones optimizadas (WebP)
4. **Colores consistentes**: Los códigos hex deben ser consistentes con los colores reales del producto
5. **SKU único**: Cada variante debe tener un SKU único para tracking de inventario

---

## Ejemplo de Implementación Mínima

Si necesitas implementar solo lo básico para empezar:

1. **Prioritario**: Implementar `GET /api/accessories/{id}` con todas las `brandVariants`
2. **Opcional (pero recomendado)**: Implementar `GET /api/accessories/{id}/brands/{brandId}`
   - Si no se implementa, el frontend usará los datos ya cargados del endpoint principal
3. **Listado**: Implementar `GET /api/accessories` para el catálogo

---

## Preguntas Frecuentes

**¿Por qué separar las variantes por marca?**
- Cada marca tiene diferentes modelos, colores y precios
- Permite escalar a más marcas sin cambiar la estructura
- Facilita la gestión de inventario por marca

**¿Qué pasa si una marca no tiene stock?**
- La marca sigue apareciendo en el selector
- Al seleccionarla, se muestran las opciones pero deshabilitadas
- El botón "Agregar al carrito" se deshabilita

**¿Cómo se manejan nuevos colores/modelos?**
- Simplemente agregar nuevos items al array `colorOptions` o `models`
- Crear nuevas `variants` para las combinaciones
- No requiere cambios en el frontend

