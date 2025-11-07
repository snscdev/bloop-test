# Sistema de Autenticación - Documentación

## Resumen

Se ha implementado y sincronizado un sistema de autenticación robusto que combina:

1. **AuthStore (Zustand)** - Manejo de estado global con persistencia
2. **JwtAuthProvider (Context API)** - Proveedor de contexto para componentes

Ambos sistemas ahora están **completamente sincronizados** y persisten el login correctamente.

---

## 🔐 Flujo de Autenticación

### Login
1. Usuario ingresa credenciales en `/auth/sign-in/password`
2. `AuthStore.login()` envía petición al backend
3. Backend responde con `access_token`
4. Token se guarda en:
   - `localStorage` (key: `access_token`) - para persistencia
   - `sessionStorage` (key: `jwt_access_token`) - para compatibilidad
5. Se obtienen datos del usuario desde `/auth/profile`
6. Usuario se redirige a la ruta deseada
7. Página se recarga para sincronizar `JwtAuthProvider`

### Persistencia de Sesión
1. Al cargar la app, `JwtAuthProvider` verifica token en:
   - Primero busca en `localStorage` (AuthStore)
   - Si no existe, busca en `sessionStorage`
2. Si el token es válido:
   - Configura headers de axios
   - Obtiene datos del usuario
   - Marca como autenticado
3. Si no hay token o es inválido:
   - Usuario permanece como no autenticado

### Logout
1. Usuario hace clic en "Cerrar Sesión"
2. `AuthStore.logout()` limpia:
   - Estado de Zustand (user, accessToken, etc.)
   - `localStorage` (todo)
   - `sessionStorage` (todo)
3. Usuario redirige a home `/`
4. Página se recarga para limpiar `JwtAuthProvider`

---

## 🛡️ Interceptor 401

Cuando el backend responde con 401 Unauthorized:

1. Interceptor de axios detecta el error
2. Guarda la ruta actual en `postLoginRedirectPath`
3. Limpia el token inválido
4. Redirige a `/auth/sign-in`
5. Después del login, regresa automáticamente a la ruta guardada

---

## 📁 Archivos Modificados

### 1. `src/store/AuthStore.ts`
**Cambios:**
- `login()` ahora guarda token en ambos storages y obtiene datos del usuario
- `signup()` hace lo mismo que login
- `logout()` limpia completamente ambos storages y estado
- Agregado `clearPostLoginRedirectPath()` para limpiar ruta guardada

### 2. `src/auth/context/jwt/auth-provider.tsx`
**Cambios:**
- `checkUserSession()` ahora busca token primero en `localStorage`, luego en `sessionStorage`
- Usa endpoint `/auth/profile` en lugar de `/auth/me`
- Sincronizado con AuthStore

### 3. `src/auth/context/jwt/utils.ts`
**Cambios:**
- `setSession()` ahora guarda token en ambos storages (localStorage y sessionStorage)
- Al limpiar, elimina de ambos storages
- Mantiene sincronización entre sistemas

### 4. `src/layouts/main/nav/user-menu-button.tsx`
**Cambios:**
- Implementado logout robusto
- Usa `AuthStore.logout()` para limpiar todo
- Redirige y recarga para limpiar estado completamente
- Manejo de errores incluido

### 5. `src/auth/view/custom/custom-sign-in-view.tsx`
**Cambios:**
- Después del login exitoso, redirige a ruta guardada o dashboard
- Recarga página para sincronizar JwtAuthProvider
- Limpia `postLoginRedirectPath` después de usarlo

### 6. `src/lib/axios.ts`
**Cambios:**
- Interceptor 401 guarda ruta actual antes de redirigir
- Limpia token inválido
- Redirige automáticamente al login

---

## 🔑 Endpoints Utilizados

```typescript
// Login
POST /auth/login
Body: { email, password }
Response: { access_token }

// Signup
POST /auth/create-user
Body: { name, email, password, ... }
Response: { access_token }

// Obtener usuario
GET /auth/profile
Headers: { Authorization: Bearer <token> }
Response: { user data }
```

---

## 💾 Storage Keys

```typescript
// localStorage
'access_token'           // Token de acceso (AuthStore)
'auth-storage'           // Estado persistente de Zustand

// sessionStorage
'jwt_access_token'       // Token de acceso (JwtAuthProvider)
```

---

## ✅ Ventajas del Sistema Actual

1. **Persistencia robusta**: Login se mantiene después de recargar página
2. **Sincronización completa**: AuthStore y JwtAuthProvider trabajan juntos
3. **Logout completo**: Limpia todo el estado y storage
4. **Redirección inteligente**: Guarda y regresa a ruta deseada después del login
5. **Manejo de 401**: Interceptor automático para tokens inválidos
6. **Doble verificación**: Token se busca en ambos storages para máxima compatibilidad

---

## 🔄 Flujo de Redirección Post-Login

### Ejemplo:
1. Usuario no autenticado intenta acceder: `/producto/Apple/iPhone/123`
2. Backend responde 401
3. Sistema guarda: `postLoginRedirectPath = '/producto/Apple/iPhone/123'`
4. Redirige a: `/auth/sign-in`
5. Usuario hace login exitoso
6. Sistema redirige a: `/producto/Apple/iPhone/123` ✅
7. Limpia `postLoginRedirectPath`

---

## 🧪 Testing

### Probar Login Persistente:
1. Hacer login en `/auth/sign-in`
2. Recargar la página varias veces
3. ✅ Usuario debe permanecer logueado

### Probar Logout:
1. Estando logueado, hacer clic en "Cerrar Sesión"
2. ✅ Redirige a home
3. ✅ Estado limpio
4. ✅ Tokens eliminados de ambos storages

### Probar Redirección:
1. Sin login, navegar a página protegida
2. Backend responde 401
3. ✅ Guarda ruta y redirige a login
4. Hacer login
5. ✅ Regresa a página original

---

## 🚀 Uso del Hook Opcional

Para proteger rutas de forma proactiva:

```tsx
import { useRequireAuth } from 'src/hooks/use-require-auth';

export default function ProtectedPage() {
  useRequireAuth(); // Redirige si no está autenticado
  
  return <div>Contenido protegido</div>;
}
```

Este hook verifica autenticación **antes** de hacer peticiones al backend.

---

## 📝 Notas Importantes

1. **Recarga después de login/logout**: Necesaria para sincronizar JwtAuthProvider con nuevo estado
2. **Doble storage**: Mantiene compatibilidad con código legacy mientras migra
3. **Limpieza completa**: Logout elimina TODO el estado para evitar inconsistencias
4. **Endpoint /auth/profile**: Usado en lugar de /auth/me para obtener datos del usuario

---

## 🐛 Troubleshooting

### Login no persiste después de recargar
- Verificar que token se guarde en `localStorage` con key `access_token`
- Verificar que `JwtAuthProvider` busque en `localStorage` primero

### Usuario no redirige después de login
- Verificar que `postLoginRedirectPath` se limpie después de usar
- Verificar que recarga se ejecute después de navegación

### Logout no limpia todo
- Verificar que se llame con `removeStorage: true`
- Verificar que ambos storages se limpien
- Verificar que se ejecute recarga después de logout

---

Última actualización: 2025-11-07

