import type { Accessory } from 'src/store/product-checkout-store';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type AccessoryCardProps = {
  accessory: Accessory;
  isSelected: boolean;
  onToggle: () => void;
  formatPrice: (price: number) => string;
};

export function AccessoryCard({
  accessory,
  isSelected,
  onToggle,
  formatPrice,
}: AccessoryCardProps) {
  return (
    <Card
      sx={{
        position: 'relative',
        width: { xs: '100%', md: 320 },
        height: { xs: 400, md: 380 },
        borderRadius: '15px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 3,
      }}
    >
      {/* Imagen de fondo */}
      <Box
        component="img"
        src={accessory.image}
        alt={accessory.name}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Overlay oscuro */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      />

      {/* Contenido superior */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          sx={{
            color: 'white',
            fontSize: { xs: '24px', md: '28px' },
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {accessory.name}
        </Typography>
        <Typography
          sx={{
            color: 'white',
            fontSize: { xs: '20px', md: '24px' },
            fontWeight: 500,
          }}
        >
          {formatPrice(accessory.price)}
        </Typography>
      </Box>

      {/* Botón en la parte inferior */}
      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={onToggle}
          startIcon={
            isSelected ? (
              <Iconify icon="mdi:check" width={20} />
            ) : (
              <Iconify icon="mdi:plus" width={20} />
            )
          }
          sx={{
            width: { xs: '100%', md: 200 },
            height: 48,
            borderRadius: 2,
            bgcolor: isSelected ? '#4CAF50' : '#7F746A',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              bgcolor: isSelected ? '#45A049' : '#6A5F57',
            },
          }}
        >
          {isSelected ? 'Agregado' : 'Agregar'}
        </Button>
      </Box>
    </Card>
  );
}
