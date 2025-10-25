'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import useAuthStore from 'src/store/AuthStore';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const LoginSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'El email es requerido' })
    .email('El email debe ser válido'),
  password: zod
    .string()
    .min(1, { message: 'La contraseña es requerida' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginSchemaType = zod.infer<typeof LoginSchema>;

// ----------------------------------------------------------------------

export function CustomSignInView() {
  const router = useRouter();
  const { login, emailRegistered, postLoginRedirectPath } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: emailRegistered || '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      await login(data.email, data.password);

      // Validar y redirigir a la ruta deseada
      let redirectPath = paths.dashboard.root;

      // Solo usar postLoginRedirectPath si es una ruta válida del dashboard
      if (postLoginRedirectPath && postLoginRedirectPath.startsWith('/dashboard')) {
        redirectPath = postLoginRedirectPath;
      }

      router.push(redirectPath);
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  });

  return (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <div>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Inicia sesión con tu contraseña
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emailRegistered && `Continúa como ${emailRegistered}`}
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
            disabled
          />

          <Box>
            <Field.Text
              name="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              type={showPassword ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => router.push(paths.auth.resetPassword)}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </Box>
          </Box>

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Iniciar sesión
          </LoadingButton>
        </Box>
      </Form>

      <Box sx={{ textAlign: 'center' }}>
        <Button variant="text" color="primary" onClick={() => router.push(paths.auth.signIn)}>
          ← Volver
        </Button>
      </Box>
    </Box>
  );
}
