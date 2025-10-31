# 📡 Documentación de Endpoints para Backend

## 🎯 Flujo de Checkout (Orden Correcto)

```
1. ESTADO (Nuevo/Refurbished)     → Endpoint 1
2. MODELO (iPhone 13, Pro, Max)   → Endpoint 2
3. ALMACENAMIENTO (128GB, 256GB)  → Endpoint 3
4. COLOR (Azul, Grafito, Oro)     → Endpoint 4
5. ACCESORIOS (Fundas, etc.)      → Endpoint 5
```

---

## 🌐 Base URL

```
https://api.tudominio.com/v1
```

---

## 📍 Endpoint 1: Datos Iniciales del Producto

### Request

```http
GET /products/{productId}/initial
```

**Cuándo se llama:** Al entrar a la página de producto

**Ejemplo:**

```http
GET /products/iphone-13-pro-max-001/initial
```

### Response 200 OK

```json
{
  "id": "iphone-13-pro-max-001",
  "marca": "Apple",
  "modelo": "iPhone 13 Pro Max",
  "bannerBackgroundImage": "https://cdn.ejemplo.com/banners/iphone13.webp",
  "bannerVariants": [
    { "id": "13", "label": "13" },
    { "id": "13-pro", "label": "PRO" },
    { "id": "13-pro-max", "label": "PRO MAX" }
  ],
  "thumbnailImage": "https://cdn.ejemplo.com/thumb/iphone13.webp",
  "conditions": [
    {
      "id": "new",
      "name": "Nuevo",
      "price": 22990,
      "description": "Producto completamente nuevo con garantía del fabricante",
      "images": [
        "https://cdn.ejemplo.com/products/iphone13-new-1.webp",
        "https://cdn.ejemplo.com/products/iphone13-new-2.webp",
        "https://cdn.ejemplo.com/products/iphone13-new-3.webp"
      ]
    },
    {
      "id": "refurbished",
      "name": "Refurbished",
      "price": 19541,
      "description": "Producto reacondicionado certificado con garantía de 6 meses",
      "images": [
        "https://cdn.ejemplo.com/products/iphone13-refurb-1.webp",
        "https://cdn.ejemplo.com/products/iphone13-refurb-2.webp"
      ]
    }
  ]
}
```

### Notas Importantes

- ✅ `conditions` es un array con las opciones de estado (Nuevo/Refurbished)
- ✅ `price` es el precio BASE del producto en ese estado (número entero, sin decimales)
- ✅ `images` son fotos del mismo producto desde diferentes ángulos
- ✅ Todas las URLs deben ser absolutas con HTTPS
- ✅ Este endpoint se cachea por 24 horas

---

## 📍 Endpoint 2: Obtener Modelos Disponibles

### Request

```http
GET /products/{productId}/conditions/{conditionId}/models
```

**Cuándo se llama:** Cuando el usuario selecciona un ESTADO (Nuevo o Refurbished)

**Parámetros:**

- `productId`: ID del producto (ej: `iphone-13-pro-max-001`)
- `conditionId`: ID del estado seleccionado (ej: `new` o `refurbished`)

**Ejemplo:**

```http
GET /products/iphone-13-pro-max-001/conditions/new/models
```

### Response 200 OK

```json
{
  "models": [
    {
      "id": "model-13",
      "name": "iPhone 13",
      "image": "https://cdn.ejemplo.com/models/iphone13.webp",
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
      "image": "https://cdn.ejemplo.com/models/iphone13-pro.webp",
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
      "image": "https://cdn.ejemplo.com/models/iphone13-pro-max.webp",
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

### Notas Importantes

- ✅ Los modelos disponibles pueden variar según el estado (ej: refurbished puede tener menos opciones)
- ✅ `price` normalmente es 0 (el precio base ya viene del estado)
- ✅ `details` son especificaciones técnicas del modelo
- ✅ Si el estado es "refurbished", pueden retornar menos modelos

---

## 📍 Endpoint 3: Obtener Opciones de Almacenamiento

### Request

```http
GET /products/{productId}/models/{modelId}/conditions/{conditionId}/storage
```

**Cuándo se llama:** Cuando el usuario selecciona un MODELO

**Parámetros:**

- `productId`: ID del producto
- `modelId`: ID del modelo seleccionado (ej: `model-13-pro-max`)
- `conditionId`: ID del estado seleccionado (ej: `new` o `refurbished`)

**Ejemplo:**

```http
GET /products/iphone-13-pro-max-001/models/model-13-pro-max/conditions/new/storage
```

### Response 200 OK

```json
{
  "storage": [
    {
      "id": "storage-128",
      "name": "128GB",
      "price": 0
    },
    {
      "id": "storage-256",
      "name": "256GB",
      "price": 3000
    },
    {
      "id": "storage-512",
      "name": "512GB",
      "price": 6000
    },
    {
      "id": "storage-1tb",
      "name": "1TB",
      "price": 9000
    }
  ]
}
```

### Notas Importantes

- ✅ `price` es el INCREMENTO sobre el precio base del estado (no el precio total)
- ✅ El primer almacenamiento normalmente tiene `price: 0` (incluido)
- ✅ Productos refurbished pueden tener menos opciones (ej: sin 1TB)
- ✅ Algunos productos (como AirPods) NO tienen almacenamiento → retornar `[]` (array vacío)

**Ejemplo de cálculo:**

```
Estado Nuevo: $22,990
+ Almacenamiento 256GB: +$3,000
= Total: $25,990
```

---

## 📍 Endpoint 4: Obtener Colores Disponibles

### Request

```http
GET /products/{productId}/storage/{storageId}/colors
```

**Cuándo se llama:** Cuando el usuario selecciona una opción de ALMACENAMIENTO

**Parámetros:**

- `productId`: ID del producto
- `storageId`: ID del almacenamiento seleccionado (ej: `storage-256`)

**Query Parameters (opcionales pero recomendados):**

- `modelId`: Para filtrar colores específicos del modelo
- `conditionId`: Para casos donde el estado afecta colores disponibles

**Ejemplo:**

```http
GET /products/iphone-13-pro-max-001/storage/storage-256/colors?modelId=model-13-pro-max&conditionId=new
```

### Response 200 OK

```json
{
  "colors": [
    {
      "id": "color-blue",
      "name": "Azul Sierra",
      "colorCode": "linear-gradient(180deg, #1A2A44 0%, #2D405B 20.31%, #0A1727 38.22%, #4A556E 55.29%)"
    },
    {
      "id": "color-graphite",
      "name": "Grafito",
      "colorCode": "linear-gradient(180deg, #54524F 0%, #3A3835 50%, #54524F 100%)"
    },
    {
      "id": "color-gold",
      "name": "Oro",
      "colorCode": "linear-gradient(180deg, #F4E8CE 0%, #E8D4A8 50%, #D4BD88 100%)"
    },
    {
      "id": "color-silver",
      "name": "Plata",
      "colorCode": "#E3E4E5"
    }
  ]
}
```

### Notas Importantes

- ✅ `colorCode` puede ser un color hexadecimal (`#RRGGBB`) o un gradiente CSS (`linear-gradient(...)`)
- ✅ **Gradientes:** Usar formato CSS estándar: `linear-gradient(angle, color stop%, ...)`
- ✅ **Hexadecimales:** Usar 6 dígitos: `#RRGGBB`
- ✅ Los colores disponibles pueden variar según modelo y capacidad

**Ejemplos válidos de colorCode:**

**Colores sólidos:**

- ✅ `"#FFFFFF"` (blanco sólido)
- ✅ `"#000000"` (negro sólido)
- ✅ `"#5F8D9F"` (azul sólido)

**Gradientes:**

- ✅ `"linear-gradient(180deg, #1A2A44 0%, #2D405B 20.31%, #0A1727 38.22%, #4A556E 55.29%)"`
- ✅ `"linear-gradient(90deg, #FF0000 0%, #00FF00 100%)"`
- ✅ `"linear-gradient(45deg, #3498db 0%, #2ecc71 50%, #e74c3c 100%)"`

**Ejemplos inválidos:**

- ❌ `"#FFF"` (muy corto - debe ser 6 dígitos)
- ❌ `"#FFFFFF80"` (con alpha - no soportado)
- ❌ `"rgb(255, 255, 255)"` (formato rgb no soportado)
- ❌ `"radial-gradient(...)"` (solo linear-gradient permitido)

---

## 📍 Endpoint 5: Obtener Accesorios Compatibles

### Request

```http
GET /products/{productId}/colors/{colorId}/accessories
```

**Cuándo se llama:** Cuando el usuario selecciona un COLOR

**Parámetros:**

- `productId`: ID del producto
- `colorId`: ID del color seleccionado (ej: `color-blue`)

**Query Parameters (opcionales pero recomendados):**

- `modelId`: Para filtrar accesorios compatibles con el modelo
- `storageId`: Para casos de compatibilidad específica

**Ejemplo:**

```http
GET /products/iphone-13-pro-max-001/colors/color-blue/accessories?modelId=model-13-pro-max&storageId=storage-256
```

### Response 200 OK

```json
{
  "accessories": [
    {
      "id": "case-apple-1",
      "name": "Funda MagSafe",
      "image": "https://cdn.ejemplo.com/accessories/funda-magsafe.webp",
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
          "colorCode": "linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)"
        },
        {
          "id": "case-red",
          "name": "Rojo",
          "colorCode": "linear-gradient(180deg, #DC2626 0%, #EF4444 100%)"
        }
      ]
    },
    {
      "id": "charger-apple-1",
      "name": "Cargador 20W",
      "image": "https://cdn.ejemplo.com/accessories/cargador-20w.webp",
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
      "name": "Cable USB-C a Lightning (1m)",
      "image": "https://cdn.ejemplo.com/accessories/cable-usbc.webp",
      "price": 490,
      "availableColors": [
        {
          "id": "cable-white",
          "name": "Blanco",
          "colorCode": "#FFFFFF"
        }
      ]
    },
    {
      "id": "airpods-pro-2",
      "name": "AirPods Pro (2da Gen)",
      "image": "https://cdn.ejemplo.com/accessories/airpods-pro.webp",
      "price": 6990,
      "availableColors": [
        {
          "id": "airpods-white",
          "name": "Blanco",
          "colorCode": "#FFFFFF"
        }
      ]
    }
  ]
}
```

### Notas Importantes

- ✅ `availableColors` DEBE tener al menos 1 color (obligatorio)
- ✅ Si un accesorio solo tiene 1 color, igual debe estar en el array
- ✅ `price` es el precio del accesorio que se suma al total
- ✅ Retornar array vacío `[]` si no hay accesorios disponibles
- ✅ Los accesorios son OPCIONALES (no afectan si el usuario puede proceder al pago)

---

## 🚨 Manejo de Errores

### Error 404 - Not Found

**Cuándo:** Producto, modelo, estado o configuración no existe

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Producto no encontrado",
    "details": "El producto con ID 'iphone-99-pro-max' no existe en el catálogo"
  }
}
```

### Error 400 - Bad Request

**Cuándo:** Combinación de opciones no válida o parámetros incorrectos

```json
{
  "error": {
    "code": "INVALID_COMBINATION",
    "message": "Combinación no disponible",
    "details": "El iPhone 13 Pro Max refurbished no está disponible con 1TB de almacenamiento"
  }
}
```

### Error 500 - Internal Server Error

**Cuándo:** Error del servidor o base de datos

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error interno del servidor",
    "details": "Por favor intenta nuevamente más tarde"
  }
}
```

---

## 📊 Ejemplo Completo del Flujo

### Paso 1: Usuario entra a la página

```http
GET /products/iphone-13-pro-max-001/initial
```

**Frontend recibe:**

- Banner del producto
- 2 estados: Nuevo ($22,990) y Refurbished ($19,541)

---

### Paso 2: Usuario selecciona "Nuevo"

```http
GET /products/iphone-13-pro-max-001/conditions/new/models
```

**Frontend recibe:**

- 3 modelos: iPhone 13, 13 Pro, 13 Pro Max
- Precio actual: $22,990

---

### Paso 3: Usuario selecciona "iPhone 13 Pro Max"

```http
GET /products/iphone-13-pro-max-001/models/model-13-pro-max/conditions/new/storage
```

**Frontend recibe:**

- 4 opciones: 128GB ($0), 256GB (+$3,000), 512GB (+$6,000), 1TB (+$9,000)
- Precio actual: $22,990

---

### Paso 4: Usuario selecciona "256GB"

```http
GET /products/iphone-13-pro-max-001/storage/storage-256/colors?modelId=model-13-pro-max&conditionId=new
```

**Frontend recibe:**

- 4 colores: Azul Sierra, Grafito, Oro, Plata
- **Precio actualizado: $22,990 + $3,000 = $25,990**

---

### Paso 5: Usuario selecciona "Azul Sierra"

```http
GET /products/iphone-13-pro-max-001/colors/color-blue/accessories?modelId=model-13-pro-max&storageId=storage-256
```

**Frontend recibe:**

- 4 accesorios: Funda MagSafe ($1,290), Cargador ($590), Cable ($490), AirPods ($6,990)
- Precio actual: $25,990

---

### Paso 6: Usuario agrega "Funda MagSafe en Negro"

**No hay request al backend** (se maneja en frontend)

**Precio final: $25,990 + $1,290 = $27,280**

---

## ⚡ Requisitos de Performance

| Endpoint       | Tiempo Máximo | Caché    |
| -------------- | ------------- | -------- |
| `/initial`     | 500ms         | 24 horas |
| `/models`      | 500ms         | No       |
| `/storage`     | 500ms         | No       |
| `/colors`      | 500ms         | No       |
| `/accessories` | 500ms         | No       |

---

## 🎯 Checklist para Backend

### Datos y Estructura

- [ ] Todos los precios son números enteros (sin decimales, sin punto)
- [ ] Todos los URLs de imágenes son absolutos con HTTPS
- [ ] `colorCode` puede ser hexadecimal `#RRGGBB` o gradiente CSS `linear-gradient(...)`
- [ ] Si usa gradiente, debe seguir formato CSS estándar válido
- [ ] `availableColors` en accesorios siempre tiene al menos 1 elemento
- [ ] Arrays vacíos `[]` cuando no hay datos (no null)

### Validaciones

- [ ] Validar que el producto existe antes de retornar datos
- [ ] Validar que la combinación estado + modelo + almacenamiento existe
- [ ] Retornar 400 si la combinación no es válida
- [ ] Retornar 404 si el producto/modelo/etc no existe

### Performance

- [ ] Todos los endpoints responden en < 500ms
- [ ] Endpoint `/initial` cacheado por 24 horas
- [ ] Usar CDN para servir imágenes
- [ ] Comprimir responses con gzip/brotli

### IDs y Naming

- [ ] IDs descriptivos (ej: `model-13-pro-max` en lugar de `1234`)
- [ ] Usar guiones `-` en lugar de guiones bajos `_`
- [ ] IDs únicos por contexto (cada modelo tiene un ID único)

### Headers HTTP

- [ ] `Content-Type: application/json; charset=utf-8`
- [ ] `X-Request-ID: <uuid>` para tracking
- [ ] Headers CORS configurados correctamente
- [ ] Rate limiting por IP (60 requests/minuto)

---

## 💡 Notas Finales

1. **El ESTADO es lo más importante** porque determina precio base y garantía
2. **Sin auto-selecciones** - El frontend NO selecciona nada automáticamente
3. **Precio progresivo** - Solo se actualiza con Estado + Almacenamiento
4. **Accesorios opcionales** - El usuario puede proceder sin agregar accesorios
5. **Validar combinaciones** - No todas las combinaciones son válidas (ej: refurbished puede no tener 1TB)

---

## 📞 Contacto

Para dudas o aclaraciones sobre estos endpoints:

- **Frontend Lead:** [Nombre]
- **Backend Lead:** [Nombre]
- **Slack:** #api-producto-checkout
- **Documentación completa:** Ver `API_DOCUMENTATION.md`
