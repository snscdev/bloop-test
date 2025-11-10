'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export default function PaymentCanceledPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF4F4 0%, #FFFFFF 100%)',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 520,
          width: '100%',
          borderRadius: '24px',
          p: { xs: 4, md: 6 },
          boxShadow: '0px 30px 80px rgba(39, 34, 28, 0.08)',
          textAlign: 'center',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(231, 76, 60, 0.12)',
            }}
          >
            <Iconify icon="solar:close-circle-bold" width={48} sx={{ color: '#E74C3C' }} />
          </Box>

          <Stack spacing={1}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#534D45',
              }}
            >
              Pago cancelado
            </Typography>
            <Typography
              sx={{
                color: '#7F746A',
                fontSize: '16px',
                lineHeight: 1.5,
              }}
            >
              Tu pago no se completó. Puedes intentarlo nuevamente o volver al catálogo para seguir
              explorando opciones.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', mt: 2 }}>
            <Button
              component={Link}
              href="/"
              variant="contained"
              fullWidth
              sx={{
                height: 48,
                borderRadius: '27px',
                background: '#7F746A',
                color: '#FFF',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: '#6A6359',
                },
              }}
            >
              Volver al inicio
            </Button>
            <Button
              component={Link}
              href="/producto"
              variant="outlined"
              fullWidth
              sx={{
                height: 48,
                borderRadius: '27px',
                border: '2px solid #7F746A',
                color: '#7F746A',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#6A6359',
                  background: 'transparent',
                },
              }}
            >
              Intentar nuevamente
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
