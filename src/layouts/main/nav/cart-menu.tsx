'use client';

import type { MouseEvent } from 'react';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useCart } from 'src/hooks/use-cart';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
};

export function CartMenu({ anchorEl, open, onClose }: Props) {
  const router = useRouter();
  const { cart, updateQuantity, removeItem } = useCart();

  const formatPrice = useCallback(
    (price: number) =>
      new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
      }).format(price),
    []
  );

  const handleNavigateToCart = useCallback(() => {
    onClose();
    router.push('/cart');
  }, [onClose, router]);

  const handleDecrease = useCallback(
    (event: MouseEvent<HTMLButtonElement>, itemId: string, currentQuantity: number) => {
      event.stopPropagation();
      updateQuantity(itemId, currentQuantity - 1);
    },
    [updateQuantity]
  );

  const handleIncrease = useCallback(
    (event: MouseEvent<HTMLButtonElement>, itemId: string, currentQuantity: number) => {
      event.stopPropagation();
      updateQuantity(itemId, currentQuantity + 1);
    },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (event: MouseEvent<HTMLButtonElement>, itemId: string) => {
      event.stopPropagation();
      removeItem(itemId);
    },
    [removeItem]
  );

  const hasItems = cart.items.length > 0;

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      disableScrollLock
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            maxWidth: { xs: 360, sm: 546 },
            width: '100%',
            borderRadius: '24px',
            background: '#FFFFFF',
            boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          maxHeight: { xs: 'calc(100vh - 160px)', sm: 540 },
          minHeight: hasItems ? 0 : 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            sx={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#7F746A',
            }}
          >
            Mi carrito
          </Typography>

          <IconButton onClick={onClose} sx={{ color: '#7F746A' }}>
            <Iconify icon="mdi:close" width={22} />
          </IconButton>
        </Box>

        {hasItems ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                pr: 1,
                mr: -1,
                mb: 3,
              }}
            >
              <Stack spacing={2.5}>
                {cart.items.map((item) => {
                  const isService = item.type === 'servicio';
                  
                  const optionHighlights = [
                    item.options?.condition?.name,
                    item.options?.storage?.name,
                    item.options?.color?.name,
                  ]
                    .filter(Boolean)
                    .join(' · ');

                  // Solo mostrar accesorios si NO es un servicio
                  const accessoriesSummary = !isService
                    ? item.options?.accessories
                        ?.map((accessory) =>
                          accessory.color?.name
                            ? `${accessory.name} (${accessory.color.name})`
                            : accessory.name
                        )
                        .join(', ')
                    : undefined;

                  return (
                    <Box
                      key={item.id}
                      onClick={handleNavigateToCart}
                      sx={{
                        background: '#FFFFFF',
                        px: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        cursor: 'pointer',
                        borderBottom: '1px solid #EFECE9',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                        py: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={item.imagen}
                          alt={item.nombre}
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: '16px',
                            objectFit: 'cover',
                            backgroundColor: '#F0F0F0',
                            flexShrink: 0,
                          }}
                        />

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: '#7F746A',
                              mb: 0.5,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {item.nombre}
                          </Typography>

                          {optionHighlights && (
                            <Typography
                              sx={{
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#A49A8F',
                              }}
                            >
                              {optionHighlights}
                            </Typography>
                          )}

                          {accessoriesSummary && (
                            <Typography
                              sx={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#C0B8B0',
                                mt: 0.5,
                              }}
                            >
                              Accesorios: {accessoriesSummary}
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#7F746A',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatPrice(item.precio * item.cantidad)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 1,
                        }}
                      >
                        {/* Solo mostrar contador si NO es un servicio */}
                        {!isService && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              background: '#F4F1EE',
                              borderRadius: '999px',
                              px: 1,
                              py: 0.5,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(event) => handleDecrease(event, item.id, item.cantidad)}
                              sx={{
                                width: 28,
                                height: 28,
                                color: '#7F746A',
                              }}
                            >
                              <Iconify icon="mdi:minus" width={18} />
                            </IconButton>

                            <Typography
                              sx={{
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#7F746A',
                                minWidth: 20,
                                textAlign: 'center',
                              }}
                            >
                              {item.cantidad}
                            </Typography>

                            <IconButton
                              size="small"
                              onClick={(event) => handleIncrease(event, item.id, item.cantidad)}
                              sx={{
                                width: 28,
                                height: 28,
                                color: '#7F746A',
                              }}
                            >
                              <Iconify icon="mdi:plus" width={18} />
                            </IconButton>
                          </Box>
                        )}

                        <IconButton
                          onClick={(event) => handleRemove(event, item.id)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '12px',
                            background: '#F4F1EE',
                            color: '#B0A79E',
                            '&:hover': {
                              background: '#E3DDD7',
                              color: '#7F746A',
                            },
                          }}
                        >
                          <Iconify icon="mdi:trash-can-outline" width={18} />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Divider sx={{ borderColor: '#E5E1DC', mb: 3 }} />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#7F746A',
                }}
              >
                Total a pagar
              </Typography>

              <Typography
                sx={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#7F746A',
                }}
              >
                {formatPrice(cart.total)}
              </Typography>
            </Box>

            <Button
              fullWidth
              onClick={handleNavigateToCart}
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
              Ver carrito
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              py: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 2,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="49"
              height="48"
              viewBox="0 0 49 48"
              fill="none"
            >
              <path
                d="M15.4023 0.5C23.641 0.500138 30.3037 7.05684 30.3037 15.126C30.3037 23.1951 23.641 29.7518 15.4023 29.752C7.16359 29.752 0.5 23.1952 0.5 15.126C0.500028 7.05675 7.1636 0.5 15.4023 0.5Z"
                stroke="#A49A8F"
              />
              <path
                d="M32.6631 0.5C40.9017 0.500138 47.5644 7.05684 47.5645 15.126C47.5645 23.1951 40.9017 29.7518 32.6631 29.752C24.4243 29.752 17.7607 23.1952 17.7607 15.126C17.7608 7.05675 24.4243 0.5 32.6631 0.5Z"
                stroke="#A49A8F"
              />
              <path
                d="M15.4023 18.248C23.641 18.2482 30.3037 24.8049 30.3037 32.874C30.3037 40.9432 23.641 47.4999 15.4023 47.5C7.16359 47.5 0.5 40.9433 0.5 32.874C0.500028 24.8048 7.1636 18.248 15.4023 18.248Z"
                stroke="#A49A8F"
              />
              <path
                d="M32.6631 18.248C40.9017 18.2482 47.5644 24.8049 47.5645 32.874C47.5645 40.9432 40.9017 47.4999 32.6631 47.5C24.4243 47.5 17.7607 40.9433 17.7607 32.874C17.7608 24.8048 24.4243 18.248 32.6631 18.248Z"
                stroke="#A49A8F"
              />
            </svg>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#7F746A',
              }}
            >
              Tu carrito está vacío
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#A49A8F',
                maxWidth: 280,
              }}
            >
              Agrega productos para verlos aquí y continuar con tu compra.
            </Typography>
          </Box>
        )}
      </Box>
    </Popover>
  );
}
