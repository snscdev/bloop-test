'use client';

import type { MouseEvent } from 'react';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useCart } from 'src/hooks/use-cart';

import { NuevoIcon } from 'src/app/producto/[marca]/[modelo]/[id]/components/nuevo-icon';
import { StorageIcon } from 'src/app/producto/[marca]/[modelo]/[id]/components/storage-icon';
import { RefurbishedIcon } from 'src/app/producto/[marca]/[modelo]/[id]/components/refurbished-icon';
import {
  createPaymentSession,
  type PaymentSessionItem,
  validateProductInventory,
} from 'src/services/product-service';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem } = useCart();
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const formatPrice = useCallback(
    (price: number) =>
      new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
      }).format(price),
    []
  );

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

  const handleCheckout = useCallback(async () => {
    if (isCheckoutProcessing) {
      return;
    }

    setIsCheckoutProcessing(true);
    setCheckoutError(null);

    try {
      const sessionItems: PaymentSessionItem[] = [];
      let totalAmount = 0;
      let locationId: string | undefined;
      const productNames: string[] = [];

      for (const item of cart.items) {
        if (!item.productId) {
          console.warn('El item del carrito no tiene productId asociado', item);
          continue;
        }

        const conditionId = item.options?.condition?.id;
        const modelId = item.options?.model?.id;

        if (!conditionId || !modelId) {
          throw new Error(
            `Faltan datos de inventario para ${item.nombre}. Selecciona nuevamente sus opciones.`
          );
        }

        const inventoryResponse = await validateProductInventory(item.productId, {
          conditionId,
          modelId,
          storageId: item.options?.storage?.id || undefined,
          colorId: item.options?.color?.id || undefined,
          quantity: item.cantidad,
        });

        if (!inventoryResponse.available || !inventoryResponse.variantId) {
          throw new Error(`No hay inventario disponible para ${item.nombre}.`);
        }

        const unitPrice = inventoryResponse.price ?? item.precio;
        const quantity = item.cantidad;

        if (!unitPrice || unitPrice <= 0) {
          throw new Error(`No se pudo obtener el precio de ${item.nombre}.`);
        }

        sessionItems.push({
          variantId: inventoryResponse.variantId,
          quantity,
          productName: item.nombre,
          price: unitPrice,
        });

        totalAmount += unitPrice * quantity;

        if (!locationId && inventoryResponse.locationId) {
          locationId = inventoryResponse.locationId;
        }

        productNames.push(item.nombre);
      }

      if (sessionItems.length === 0) {
        throw new Error('No se encontraron productos válidos para procesar el pago.');
      }

      if (totalAmount <= 0) {
        throw new Error('No se pudo calcular el total del carrito.');
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const successUrl = origin
        ? 'https://bloop-test.vercel.app/checkout/success'
        : `${origin}/success`;
      const cancelUrl = origin
        ? 'https://bloop-test.vercel.app/checkout/cancel'
        : `${origin}/cancel`;

      const paymentSession = await createPaymentSession({
        items: sessionItems,
        locationId,
        amount: totalAmount,
        currency: 'MXN',
        productName:
          productNames.length === 1
            ? productNames[0]
            : `Carrito bloop (${productNames.length} artículos)`,
        successUrl,
        cancelUrl,
      });

      if (!paymentSession.paymentUrl) {
        throw new Error('No se pudo iniciar la sesión de pago.');
      }

      if (typeof window !== 'undefined') {
        window.open(paymentSession.paymentUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ocurrió un error al iniciar la compra.';
      setCheckoutError(message);
      console.error('Error al iniciar checkout desde el carrito:', error);
    } finally {
      setIsCheckoutProcessing(false);
    }
  }, [cart.items, isCheckoutProcessing]);

  const hasItems = cart.items.length > 0;

  return (
    <Box sx={{ background: '#FFFFFF' }}>
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 6, md: 8 },
        }}
      >
        <Box sx={{ mb: 5 }}>
          <Typography
            sx={{
              fontSize: { xs: '32px', md: '48px' },
              fontWeight: 500,
              color: '#7F746A',
              lineHeight: 1.2,
            }}
          >
            Tu carrito
          </Typography>

          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#A49A8F',
              mt: 1,
            }}
          >
            Revisa los productos y completa tu compra cuando estés listo.
          </Typography>
        </Box>

        {hasItems ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 8,
            }}
          >
            <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '60%' } }}>
              <Stack spacing={3}>
                {cart.items.map((item) => {
                  const accessoriesSummary = item.options?.accessories
                    ?.map((accessory) =>
                      accessory.color?.name
                        ? `${accessory.name} (${accessory.color.name})`
                        : accessory.name
                    )
                    .join(', ');

                  const conditionName = item.options?.condition?.name;
                  const storageName = item.options?.storage?.name;
                  const colorOption = item.options?.color;

                  return (
                    <Card
                      key={item.id}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        borderBottom: '1px solid #EFECE9',
                        paddingBottom: 2,
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                        boxShadow: 'none',
                        borderRadius: '0',
                        gap: 4,
                      }}
                    >
                      <Box
                        component="img"
                        src={item.imagen}
                        alt={item.nombre}
                        sx={{
                          width: { xs: '100%', md: 150 },
                          height: { xs: 220, md: 158 },
                          objectFit: 'cover',
                          borderRadius: '28px',
                        }}
                      />

                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'flex-start' },
                            gap: { xs: 2, sm: 3 },
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                            <Typography
                              sx={{
                                fontSize: '12px',
                                fontWeight: 600,
                                letterSpacing: '1.2px',
                                textTransform: 'uppercase',
                                color: '#B6ACA3',
                              }}
                            >
                              PRODUCTO
                            </Typography>

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: { xs: '26px', md: '16px' },
                                  fontWeight: 600,
                                  color: '#7F746A',
                                  lineHeight: 1.1,
                                }}
                              >
                                {item.modelo || item.nombre}
                              </Typography>

                              {/* {variantName && (
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    px: 1.75,
                                    py: 0.5,
                                    borderRadius: '999px',
                                    border: '1px solid #D9D1C9',
                                    background: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#7F746A',
                                    letterSpacing: '0.6px',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {variantName}
                                </Box>
                              )} */}
                            </Box>
                          </Box>

                          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography
                              sx={{
                                fontSize: '12px',
                                fontWeight: 600,
                                letterSpacing: '1.2px',
                                textTransform: 'uppercase',
                                color: '#B6ACA3',
                              }}
                            >
                              Total
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: '28px', md: '24px' },
                                fontWeight: 700,
                                color: '#7F746A',
                              }}
                            >
                              {formatPrice(item.precio * item.cantidad)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}
                        >
                          {conditionName && (
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.75,
                                py: 0.75,
                                borderRadius: '8px',
                                border: '1.5px solid #D9D1C9',
                                background: '#FFFFFF',
                                color: '#7F746A',
                                fontSize: '14px',
                                fontWeight: 600,
                              }}
                            >
                              {conditionName.toLowerCase() === 'refurbished' ? (
                                <Box
                                  sx={{
                                    position: 'relative',
                                    top: 6,
                                  }}
                                >
                                  <RefurbishedIcon width={22} height={22} color="#7F746A" />
                                </Box>
                              ) : (
                                <NuevoIcon width={18} height={18} color="#7F746A" />
                              )}
                              {conditionName}
                            </Box>
                          )}

                          {storageName && (
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.75,
                                py: 0.75,
                                borderRadius: '8px',
                                border: '1.5px solid #D9D1C9',
                                background: '#FFFFFF',
                                color: '#7F746A',
                                fontSize: '14px',
                                fontWeight: 600,
                              }}
                            >
                              <StorageIcon capacity={storageName} width={16} height={16} />
                              {storageName}
                            </Box>
                          )}

                          {colorOption && (
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.75,
                                py: 0.75,
                                borderRadius: '8px',
                                border: '1.5px solid #D9D1C9',
                                background: '#FFFFFF',
                                color: '#7F746A',
                                fontSize: '14px',
                                fontWeight: 600,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: '50%',
                                  border: '1.5px solid #E0D9D1',
                                  background: colorOption.value || '#E0E0E0',
                                }}
                              />
                              {colorOption.name}
                            </Box>
                          )}
                        </Box>

                        {accessoriesSummary && (
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#C0B8B0',
                            }}
                          >
                            Accesorios incluidos: {accessoriesSummary}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 'auto',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              background: '#F4F1EE',
                              borderRadius: '999px',
                              px: 1.5,
                              py: 0.5,
                            }}
                          >
                            <IconButton
                              onClick={(event) => handleDecrease(event, item.id, item.cantidad)}
                              sx={{
                                width: 32,
                                height: 32,
                                color: '#7F746A',
                              }}
                            >
                              <Iconify icon="mdi:minus" width={20} />
                            </IconButton>

                            <Typography
                              sx={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#7F746A',
                                minWidth: 20,
                                textAlign: 'center',
                              }}
                            >
                              {item.cantidad}
                            </Typography>

                            <IconButton
                              onClick={(event) => handleIncrease(event, item.id, item.cantidad)}
                              sx={{
                                width: 32,
                                height: 32,
                                color: '#7F746A',
                              }}
                            >
                              <Iconify icon="mdi:plus" width={20} />
                            </IconButton>
                          </Box>

                          <IconButton
                            onClick={(event) => handleRemove(event, item.id)}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '14px',
                              background: '#F4F1EE',
                              color: '#B0A79E',
                              '&:hover': {
                                background: '#E3DDD7',
                                color: '#7F746A',
                              },
                            }}
                          >
                            <Iconify icon="mdi:trash-can-outline" width={20} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  );
                })}
              </Stack>
            </Box>

            <Box
              sx={{
                width: { xs: '100%', md: '40%' },
                flexShrink: 0,
              }}
            >
              <Card
                sx={{
                  borderRadius: '24px',
                  background: '#FFFFFF',
                  border: '2px solid #A49A8F',
                  boxShadow: 'none',
                  px: { xs: 3, md: 3.5 },
                  py: { xs: 3, md: 4 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#7F746A',
                    mb: 3,
                  }}
                >
                  Resumen
                </Typography>

                <Stack spacing={2.5} sx={{ mb: 3 }}>
                  {cart.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ maxWidth: '70%' }}>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#7F746A',
                          }}
                        >
                          {item.nombre}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#A49A8F',
                          }}
                        >
                          Cantidad: {item.cantidad}
                        </Typography>
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
                  ))}
                </Stack>

                <Divider sx={{ borderColor: '#E5E1DC', mb: 3 }} />

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#A49A8F',
                      }}
                    >
                      Subtotal
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#7F746A',
                      }}
                    >
                      {formatPrice(cart.total)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#A49A8F',
                      }}
                    >
                      Envío
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#7F746A',
                      }}
                    >
                      {formatPrice(0)}
                    </Typography>
                  </Box>
                </Stack>

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
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#7F746A',
                    }}
                  >
                    Total a pagar
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#7F746A',
                    }}
                  >
                    {formatPrice(cart.total)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  disabled={isCheckoutProcessing}
                  onClick={handleCheckout}
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
                  {isCheckoutProcessing ? 'Validando...' : 'Iniciar compra'}
                </Button>

                {checkoutError && (
                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'error.main',
                    }}
                  >
                    {checkoutError}
                  </Typography>
                )}
              </Card>
            </Box>
          </Box>
        ) : (
          <Card
            sx={{
              borderRadius: '24px',
              background: '#FFFFFF',
              border: '1px solid #EFECE9',
              boxShadow: '0px 12px 24px rgba(0,0,0,0.06)',
              px: { xs: 3, md: 4 },
              py: { xs: 5, md: 6 },
              textAlign: 'center',
            }}
          >
            <Stack spacing={2.5} alignItems="center">
              <Iconify icon="mdi:cart-outline" width={64} sx={{ color: '#C8C1B9' }} />
              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#7F746A',
                }}
              >
                Tu carrito está vacío
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#A49A8F',
                  maxWidth: 360,
                }}
              >
                Busca el smartphone ideal y agrégalo al carrito para continuar con el proceso de
                compra.
              </Typography>
              <Button
                onClick={() => router.push('/')}
                sx={{
                  height: 48,
                  borderRadius: '27px',
                  border: '2px solid #7F746A',
                  color: '#7F746A',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  '&:hover': {
                    border: '2px solid #6A6359',
                    background: 'transparent',
                  },
                }}
              >
                Volver al inicio
              </Button>
            </Stack>
          </Card>
        )}
      </Container>
    </Box>
  );
}
