'use client';

import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import useAuthStore from 'src/store/AuthStore';
import { setStorage, KeysLocalStorage } from 'src/store/localStorage';

import { Iconify, type IconifyProps } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Componente cuando Auth0 NO está disponible
function Auth0NotConfigured() {
  const router = useRouter();

  return (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Alert severity="error">
        Auth0 no está configurado. Por favor configura las variables de entorno de Auth0 para usar
        login social.
      </Alert>
      <Button variant="contained" color="primary" onClick={() => router.push(paths.auth.signIn)}>
        ← Volver
      </Button>
    </Box>
  );
}

// Componente cuando Auth0 está disponible
function Auth0LoginContent() {
  const { loginWithPopup, getAccessTokenSilently } = useAuth0();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { emailRegistered, postLoginRedirectPath, fetchUser } = useAuthStore();

  const returnTo = searchParams.get('returnTo');

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      await loginWithPopup({
        authorizationParams: {
          connection: 'google-oauth2',
        },
      });

      // Obtener el access token
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: CONFIG.auth0.audience,
        },
      });

      // Guardar token en localStorage
      setStorage(KeysLocalStorage.keyAccessToken, accessToken);

      // Obtener datos del usuario del backend
      await fetchUser();

      // Validar y redirigir a la ruta deseada
      let redirectPath = CONFIG.auth.redirectPath;

      // Solo usar returnTo si es una ruta válida del dashboard
      if (returnTo && returnTo.startsWith('/dashboard')) {
        redirectPath = returnTo;
      } else if (postLoginRedirectPath && postLoginRedirectPath.startsWith('/dashboard')) {
        redirectPath = postLoginRedirectPath;
      }

      router.push(redirectPath);
    } catch (error) {
      console.error('Error en login social:', error);
    }
  }, [loginWithPopup, getAccessTokenSilently, fetchUser, returnTo, postLoginRedirectPath, router]);

  return (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <div>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Continuar con Google
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emailRegistered && `Continúa como ${emailRegistered}`}
        </Typography>
      </div>

      <Button
        fullWidth
        color="inherit"
        size="large"
        variant="outlined"
        onClick={handleSignInWithGoogle}
        startIcon={
          <Iconify
            icon={'flat-color-icons:google' as IconifyProps['icon']}
            width={24}
            sx={{ '& > *': { flexShrink: 0 } }}
          />
        }
      >
        Iniciar sesión con Google
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Button variant="text" color="primary" onClick={() => router.push(paths.auth.signIn)}>
          ← Volver
        </Button>
      </Box>
    </Box>
  );
}

// Componente principal que decide cuál renderizar
export function CustomAuth0LoginView() {
  const { domain, clientId, callbackUrl } = CONFIG.auth0;
  const hasAuth0Config = !!(domain && clientId && callbackUrl);

  if (!hasAuth0Config) {
    return <Auth0NotConfigured />;
  }

  return <Auth0LoginContent />;
}
