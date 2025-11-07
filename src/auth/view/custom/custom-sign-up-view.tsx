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

const SignupSchema = zod.object({
  name: zod.string().min(1, { message: 'El nombre es requerido' }),
  phone: zod.string().min(1, { message: 'El teléfono es requerido' }),
  email: zod
    .string()
    .min(1, { message: 'El email es requerido' })
    .email('El email debe ser válido'),
  password: zod
    .string()
    .min(1, { message: 'La contraseña es requerida' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  address: zod.string().min(1, { message: 'La dirección es requerida' }),
  zipCode: zod.string().min(1, { message: 'El código postal es requerido' }),
  country: zod.string().min(1, { message: 'El país es requerido' }),
  state: zod.string().min(1, { message: 'El estado es requerido' }),
  city: zod.string().min(1, { message: 'La ciudad es requerida' }),
});

type SignupSchemaType = zod.infer<typeof SignupSchema>;

// ----------------------------------------------------------------------

export function CustomSignUpView() {
  const router = useRouter();
  const { signup, login, emailRegistered, postLoginRedirectPath, clearPostLoginRedirectPath } =
    useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: emailRegistered || '',
      password: '',
      address: '',
      zipCode: '',
      country: '',
      state: '',
      city: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      // Crear el usuario
      await signup(data);

      // Hacer login automático con las credenciales
      await login(data.email, data.password);

      // Determinar ruta de redirección
      let redirectPath = paths.selectProduct;

      // Si hay una ruta guardada para post-login, usarla
      if (postLoginRedirectPath && !postLoginRedirectPath.startsWith('/auth')) {
        redirectPath = postLoginRedirectPath;
        // Limpiar el path guardado después de usarlo
        clearPostLoginRedirectPath();
      }

      // Redirigir y recargar para sincronizar AuthContext
      router.push(redirectPath);

      // Pequeño delay para asegurar la navegación antes de recargar
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : 'Error al registrarse');
    }
  });

  return (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <div>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Crear cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completa tus datos para registrarte
        </Typography>
      </div>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 2.5, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="name"
            label="Nombre completo"
            placeholder="Juan Pérez"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Text
            name="email"
            label="Email"
            placeholder="ejemplo@correo.com"
            InputLabelProps={{ shrink: true }}
            autoComplete="email"
          />

          <Field.Text
            name="phone"
            label="Teléfono"
            placeholder="+52 123 456 7890"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Text
            name="password"
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
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

          <Field.Text
            name="address"
            label="Dirección"
            placeholder="Calle y número"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Field.Text
              name="zipCode"
              label="Código Postal"
              placeholder="12345"
              InputLabelProps={{ shrink: true }}
            />

            <Field.Text
              name="city"
              label="Ciudad"
              placeholder="Ciudad"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Field.Text
              name="state"
              label="Estado"
              placeholder="Estado"
              InputLabelProps={{ shrink: true }}
            />

            <Field.Text
              name="country"
              label="País"
              placeholder="México"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Crear cuenta
          </LoadingButton>
        </Box>
      </Form>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          ¿Ya tienes cuenta?{' '}
          <Button variant="text" color="primary" onClick={() => router.push(paths.auth.signIn)}>
            Inicia sesión
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
