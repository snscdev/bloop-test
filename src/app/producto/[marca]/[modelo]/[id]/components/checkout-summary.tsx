import type {
  Accessory,
  ColorOption,
  StorageOption,
  ProductCondition,
} from 'src/store/product-checkout-store';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { NuevoIcon } from './nuevo-icon';
import { StorageIcon } from './storage-icon';
import { RefurbishedIcon } from './refurbished-icon';
import { AccessoryMiniCard } from './accessory-mini-card';

// ----------------------------------------------------------------------

type CheckoutSummaryProps = {
  modelName: string;
  condition: ProductCondition;
  storage?: StorageOption;
  color?: ColorOption;
  accessories: {
    accessory: Accessory;
    selectedColor: ColorOption;
  }[];
  totalPrice: number;
  formatPrice: (price: number) => string;
  onRemoveAccessory: (accessoryId: string) => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  isProcessingPayment?: boolean;
  paymentError?: string | null;
  isAddToCartDisabled?: boolean;
};

export function CheckoutSummary({
  modelName,
  condition,
  storage,
  color,
  accessories,
  totalPrice,
  formatPrice,
  onRemoveAccessory,
  onBuyNow,
  onAddToCart,
  isProcessingPayment = false,
  paymentError = null,
  isAddToCartDisabled = false,
}: CheckoutSummaryProps) {
  // Determinar texto del total según cantidad de accesorios
  const getTotalText = () => {
    if (accessories.length === 0) return 'Total smartphone';
    if (accessories.length === 1) return 'Total smartphone + Accesorio';
    return 'Total smartphone + Accesorios';
  };

  // Detectar si el modelo incluye "Plus"
  const hasPlus = modelName.toLowerCase().includes('plus');

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: '15px',
        background: 'transparent',
        boxShadow: 'none',
        p: 0,
      }}
    >
      {/* Nombre del modelo + chip Plus */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#7F746A',
            lineHeight: 1.2,
          }}
        >
          {modelName}
        </Typography>
        {hasPlus && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 24,
              px: 1.5,
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '12px',
              background: '#F8F8F8',
              color: '#7F746A',
              border: '1px solid #E0E0E0',
            }}
          >
            Plus
          </Box>
        )}
      </Box>

      {/* Row de chips: Estado, Almacenamiento, Color */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {/* Chip de Estado (Refurbished/Nuevo) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            height: 32,
            borderRadius: '8px',
            border: '1px solid #7F746A',
            background: '#FFF',
            px: 1.5,
            py: 0.5,
          }}
        >
          {condition.name === 'Refurbished' ? (
            <Box
              sx={{
                position: 'relative',
                top: 6,
              }}
            >
              <RefurbishedIcon width={26} height={26} color="#7F746A" />
            </Box>
          ) : (
            <NuevoIcon width={20} height={20} color="#7F746A" />
          )}
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#7F746A',
              whiteSpace: 'nowrap',
            }}
          >
            {condition.name}
          </Typography>
        </Box>

        {/* Chip de Almacenamiento */}
        {storage && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              height: 32,
              borderRadius: '8px',
              border: '1px solid #7F746A',
              background: '#FFF',
              px: 1.5,
              py: 0.5,
            }}
          >
            <StorageIcon capacity={storage.name} width={16} height={16} />
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#7F746A',
                whiteSpace: 'nowrap',
              }}
            >
              {storage.name}
            </Typography>
          </Box>
        )}

        {/* Chip de Color */}
        {color && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              height: 32,
              borderRadius: '8px',
              border: '1px solid #7F746A',
              background: '#FFF',
              px: 1.5,
              py: 0.5,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: color.gradient,
                border: '1px solid #E0E0E0',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#7F746A',
                whiteSpace: 'nowrap',
              }}
            >
              {color.name}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Texto del total (dinámico) */}
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#A49A8F',
          mb: 1,
        }}
      >
        {getTotalText()}
      </Typography>

      {/* Precio grande */}
      <Typography
        sx={{
          fontSize: '36px',
          fontWeight: 700,
          color: '#7F746A',
          mb: 2,
          lineHeight: 1,
        }}
      >
        {formatPrice(totalPrice)}
      </Typography>

      {/* Lista de accesorios - Después del precio, antes de los botones */}
      {accessories.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 3 }}>
          {accessories.map(({ accessory, selectedColor }) => (
            <AccessoryMiniCard
              key={accessory.id}
              accessory={accessory}
              selectedColor={selectedColor}
              onRemove={() => onRemoveAccessory(accessory.id)}
              formatPrice={formatPrice}
            />
          ))}
        </Box>
      )}

      {/* Botones */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onBuyNow}
          disabled={isProcessingPayment}
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
          {isProcessingPayment ? 'Procesando...' : 'Comprar ahora'}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onAddToCart}
          disabled={isAddToCartDisabled}
          sx={{
            height: 48,
            borderRadius: '27px',
            border: '2px solid #7F746A',
            color: '#7F746A',
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              border: '2px solid #6A6359',
              background: 'transparent',
            },
          }}
        >
          Agregar al carrito
        </Button>
      </Box>

      {paymentError && (
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'error.main',
            mb: 2,
          }}
        >
          {paymentError}
        </Typography>
      )}

      {/* Viene con */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#7F746A',
            }}
          >
            Viene con
          </Typography>
          <Iconify icon="mdi:information-outline" width={16} sx={{ color: '#A49A8F' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="mdi:cable-data" width={18} sx={{ color: '#A49A8F' }} />
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#A49A8F',
            }}
          >
            Cable compatible
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
