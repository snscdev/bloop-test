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

const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'El email es requerido' })
    .email('El email debe ser válido'),
});

type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

// ----------------------------------------------------------------------

export function CustomResetPasswordView() {
  const router = useRouter();
  const { sendEmailChangePassword } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
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
      setSuccessMsg('');
      await sendEmailChangePassword(data.email);
      setSuccessMsg('Hemos enviado un correo con instrucciones para restablecer tu contraseña');
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : 'Error al enviar el correo');
    }
  });

  return (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <div>
        <Typography variant="h5" sx={{ mb: 1 }}>
          ¿Olvidaste tu contraseña?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingresa tu email y te enviaremos instrucciones para restablecerla
        </Typography>
      </div>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
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
            Enviar instrucciones
          </LoadingButton>
        </Box>
      </Form>

      <Box sx={{ textAlign: 'center' }}>
        <Button variant="text" color="primary" onClick={() => router.push(paths.auth.signIn)}>
          ← Volver al inicio
        </Button>
      </Box>
    </Box>
  );
}
