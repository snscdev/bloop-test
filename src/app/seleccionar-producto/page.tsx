'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function SeleccionarProductoPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Seleccionar Producto
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          No hay productos seleccionados.
        </Typography>
      </Box>
    </Container>
  );
}
