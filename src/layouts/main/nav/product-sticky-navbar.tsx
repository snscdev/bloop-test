'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';

import { useProductCheckoutStore } from 'src/store/product-checkout-store';

// ----------------------------------------------------------------------

type Props = {
  isVisible: boolean;
  sx?: SxProps<Theme>;
};

export function ProductStickyNavbar({ isVisible, sx }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { product, selectedOptions, totalPrice, loadingStates } = useProductCheckoutStore();

  if (!product) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);

  // Indicador de carga si alguna sección está cargando
  const isAnyLoading = Object.values(loadingStates).some((state) => state.isLoading);

  // Obtener los nombres de las opciones seleccionadas
  const selectedCondition = product.conditions.find((c) => c.id === selectedOptions.conditionId);
  const selectedModel = product.models?.find((m) => m.id === selectedOptions.modelId);
  const selectedStorage = product.storage?.find((s) => s.id === selectedOptions.storageId);
  const selectedColor = product.colors?.find((c) => c.id === selectedOptions.colorId);

  const handleBuyNow = () => {
    // TODO: Implement buy now action
    console.log('Comprar ahora');
  };

  return (
    <Box
      sx={[
        {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 54,
          zIndex: theme.zIndex.appBar + 1,
          background: '#F8F8F8',
          backdropFilter: 'blur(15.6px)',
          borderBottom: '1px solid #F0F0F0',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s ease-in-out',
          pointerEvents: isVisible ? 'auto' : 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          maxWidth: 1280,
          height: '100%',
          mx: 'auto',
          px: { xs: 2, md: 7 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left side - Product info (desktop only) */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {/* Product image */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'background.neutral',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={product.thumbnailImage}
                alt={product.modelo}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  // Fallback si la imagen no carga
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>

            {/* Product name */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                color: '#7F746A',
                whiteSpace: 'nowrap',
              }}
            >
              {product.modelo}
            </Typography>

            {/* Chips - Selected options (Estado → Modelo → Almacenamiento → Color) */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
              {/* 1. Estado chip */}
              {selectedCondition && (
                <Chip
                  label={selectedCondition.name}
                  size="small"
                  sx={{
                    height: 26,
                    px: 1,
                    borderRadius: '20px',
                    background: '#FFF',
                    border: '1px solid #E0E0E0',
                    fontSize: '13px',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}

              {/* 2. Modelo chip */}
              {selectedModel && (
                <Chip
                  label={selectedModel.name}
                  size="small"
                  sx={{
                    height: 26,
                    px: 1,
                    borderRadius: '20px',
                    background: '#FFF',
                    border: '1px solid #E0E0E0',
                    fontSize: '13px',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}

              {/* 3. Almacenamiento chip */}
              {selectedStorage && (
                <Chip
                  label={selectedStorage.name}
                  size="small"
                  sx={{
                    height: 26,
                    px: 1,
                    borderRadius: '20px',
                    background: '#FFF',
                    border: '1px solid #E0E0E0',
                    fontSize: '13px',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}

              {/* 4. Color chip */}
              {selectedColor && (
                <Chip
                  label={selectedColor.name}
                  size="small"
                  sx={{
                    height: 26,
                    px: 1,
                    borderRadius: '20px',
                    background: '#FFF',
                    border: '1px solid #E0E0E0',
                    fontSize: '13px',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Right side - Price and button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            ...(isMobile && { flex: 1, justifyContent: 'space-between' }),
          }}
        >
          {/* Price with loading indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAnyLoading && <CircularProgress size={16} sx={{ color: '#7F746A' }} />}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '18px', md: '20px' },
                color: '#7F746A',
                whiteSpace: 'nowrap',
              }}
            >
              {formatPrice(totalPrice)}
            </Typography>
          </Box>

          {/* Buy button */}
          <Button
            variant="contained"
            onClick={handleBuyNow}
            sx={{
              height: 40,
              px: 3,
              borderRadius: '27px',
              background: '#7F746A',
              color: '#FFF',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: '#6A6359',
              },
            }}
          >
            Comprar ahora
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
