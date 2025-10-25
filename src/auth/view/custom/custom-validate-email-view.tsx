'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import useAuthStore from 'src/store/AuthStore';

import { Form, Field } from 'src/components/hook-form';

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
  const { validateEmail, setEmailRegistered } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const response = await validateEmail(data.email);
      setEmailRegistered(data.email);

      // Redirigir según el provider
      if (response.provider === 'password') {
        // Login con contraseña
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
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
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
    </Box>
  );
}
