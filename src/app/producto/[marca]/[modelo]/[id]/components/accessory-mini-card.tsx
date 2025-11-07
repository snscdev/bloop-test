import type { Accessory, ColorOption } from 'src/store/product-checkout-store';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type AccessoryMiniCardProps = {
  accessory: Accessory;
  selectedColor: ColorOption;
  onRemove: () => void;
  formatPrice: (price: number) => string;
};

export function AccessoryMiniCard({
  accessory,
  selectedColor,
  onRemove,
  formatPrice,
}: AccessoryMiniCardProps) {
  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        background: '#FFF',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        p: 1.5,
      }}
    >
      {/* Botón eliminar - esquina superior derecha */}
      <IconButton
        onClick={onRemove}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          bgcolor: '#F5F5F5',
          zIndex: 1,
          '&:hover': {
            bgcolor: '#E0E0E0',
          },
        }}
      >
        <Iconify icon="mdi:close" width={16} sx={{ color: '#7F746A' }} />
      </IconButton>

      {/* Imagen del accesorio - arriba */}
      <Box
        sx={{
          width: '100%',
          height: 79,
          borderRadius: '8px',
          overflow: 'hidden',
          mb: 1.5,
        }}
      >
        <Box
          component="img"
          src={accessory.image}
          alt={accessory.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Contenido - abajo */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Nombre del accesorio */}
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#7F746A',
            lineHeight: 1.2,
          }}
        >
          {accessory.name}
        </Typography>

        {/* Precio */}
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#7F746A',
          }}
        >
          {formatPrice(accessory.price)}
        </Typography>
      </Box>
    </Card>
  );
}
