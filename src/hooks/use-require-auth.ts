'use client';

import { useEffect } from 'react';

import { useRouter, usePathname } from 'src/routes/hooks';

import useAuthStore from 'src/store/AuthStore';
import { getStorage, KeysLocalStorage } from 'src/store/localStorage';

/**
 * Hook para proteger rutas que requieren autenticación
 * 
 * Uso:
 * ```tsx
 * function ProtectedPage() {
 *   useRequireAuth();
 *   // resto del componente
 * }
 * ```
 * 
 * Si el usuario no está autenticado:
 * - Guarda la ruta actual en postLoginRedirectPath
 * - Redirige al usuario a /auth/sign-in
 * - Después del login, el usuario será redirigido de vuelta a esta ruta
 */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { setPostLoginRedirectPath } = useAuthStore();

  useEffect(() => {
    const accessToken = getStorage(KeysLocalStorage.keyAccessToken);

    if (!accessToken) {
      // Guardar la ruta actual para redirección post-login
      setPostLoginRedirectPath(pathname);
      
      // Redirigir al login
      router.push('/auth/sign-in');
    }
  }, [pathname, router, setPostLoginRedirectPath]);
}

