'use client';

import { useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();
  const { authenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (authenticated) {
        // Si está autenticado, redirigir al dashboard
        router.replace(CONFIG.auth.redirectPath);
      } else {
        // Si no está autenticado, redirigir al login
        router.replace(paths.auth.signIn);
      }
    }
  }, [authenticated, loading, router]);

  // Mostrar splash screen mientras se determina el estado de autenticación
  return <SplashScreen />;
}
