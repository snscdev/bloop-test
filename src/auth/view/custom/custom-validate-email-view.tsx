'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import useAuthStore from 'src/store/AuthStore';
import { setStorage, KeysLocalStorage } from 'src/store/localStorage';

import { Form, Field } from 'src/components/hook-form';
import { Iconify, type IconifyProps } from 'src/components/iconify';

// ----------------------------------------------------------------------

const EmailSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'El email es requerido' })
    .email('El email debe ser válido'),
});

type EmailSchemaType = zod.infer<typeof EmailSchema>;

// ----------------------------------------------------------------------

export function CustomValidateEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { validateEmail, setEmailRegistered, fetchUser, postLoginRedirectPath } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');

  // Auth0 hooks
  const { loginWithPopup, getAccessTokenSilently } = useAuth0();

  // Verificar si Auth0 está configurado
  const { domain, clientId, callbackUrl } = CONFIG.auth0;
  const hasAuth0Config = !!(domain && clientId && callbackUrl);

  const returnTo = searchParams.get('returnTo');

  const methods = useForm<EmailSchemaType>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setErrorMsg('');
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
      let redirectPath = paths.selectProduct;

      // Usar returnTo si existe
      if (returnTo) {
        redirectPath = returnTo;
      } else if (postLoginRedirectPath && !postLoginRedirectPath.startsWith('/auth')) {
        redirectPath = postLoginRedirectPath;
      }

      router.push(redirectPath);
    } catch (error) {
      console.error('Error en login con Google:', error);
      setErrorMsg(error instanceof Error ? error.message : 'Error al iniciar sesión con Google');
    }
  }, [loginWithPopup, getAccessTokenSilently, fetchUser, returnTo, postLoginRedirectPath, router]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const response = await validateEmail(data.email);
      setEmailRegistered(data.email);

      // Redirigir según el provider
      if (response.provider === 'password' || response.provider === 'Username-Password-Authentication') {
        // Login con contraseña (backend local o Auth0 database)
        router.push(paths.auth.signInPassword);
      } else if (response.provider && response.provider !== 'none') {
        // Cualquier provider social (auth0, google, google-oauth2, etc.)
        router.push(paths.auth.signInSocial);
      } else {
        // Si no existe el usuario o no tiene provider, redirigir a signup
        router.push(paths.auth.signUp);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : 'Error al validar el email');
    }
  });

  return (
    <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
      <div>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Iniciar sesión
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingresa tu email para continuar
        </Typography>
      </div>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="email"
            label="Email"
            placeholder="ejemplo@correo.com"
            InputLabelProps={{ shrink: true }}
            autoComplete="email"
          />

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Continuar
          </LoadingButton>
        </Box>
      </Form>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          ¿No tienes cuenta?{' '}
          <Button variant="text" color="primary" onClick={() => router.push(paths.auth.signUp)}>
            Regístrate
          </Button>
        </Typography>
      </Box>

      {hasAuth0Config && (
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
          Iniciar con Google
        </Button>
      )}
    </Box>
  );
}
