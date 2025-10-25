'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import useAuthStore from 'src/store/AuthStore';

// ----------------------------------------------------------------------

const UpdatePasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(1, { message: 'La contraseña es requerida' })
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    confirmPassword: zod.string().min(1, { message: 'Por favor confirma tu contraseña' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type UpdatePasswordSchemaType = zod.infer<typeof UpdatePasswordSchema>;

// ----------------------------------------------------------------------

export function CustomUpdatePasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { validatePasswordChange } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      await validatePasswordChange(token, email, data.password);
      router.push(paths.auth.signIn);
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : 'Error al actualizar la contraseña');
    }
  });

  if (!token || !email) {
    return (
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        <Alert severity="error">
          Link inválido. Por favor solicita un nuevo enlace para restablecer tu contraseña.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <div>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Crear nueva contraseña
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingresa tu nueva contraseña para {email}
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
            name="password"
            label="Nueva contraseña"
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
            name="confirmPassword"
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    <Iconify
                      icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Actualizar contraseña
          </LoadingButton>
        </Box>
      </Form>
    </Box>
  );
}
