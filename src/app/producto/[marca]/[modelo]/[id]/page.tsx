'use client';

import type { CartItem } from 'src/types/cart';
import type {
  Accessory,
  ColorOption,
  ProductModel,
  StorageOption,
} from 'src/store/product-checkout-store';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useCart } from 'src/hooks/use-cart';

import { getInitialProductData, useProductCheckoutStore } from 'src/store/product-checkout-store';
// import { useRequireAuth } from 'src/hooks/use-require-auth'; // Descomentar para requerir autenticación

import { NuevoIcon } from './components/nuevo-icon';
import { StorageIcon } from './components/storage-icon';
import { ColorCarousel } from './components/color-carousel';
import { VerifiedModal } from './components/verified-modal';
import { ModelCarousel } from './components/model-carousel';
import { SelectionCircle } from './components/selection-circle';
import { RefurbishedIcon } from './components/refurbished-icon';
import { CheckoutSummary } from './components/checkout-summary';
import { AccessorySection } from './components/accessory-section';
import { CheckoutCarousel } from './components/checkout-carousel';
import { ConditionCarousel } from './components/condition-carousel';
import { ProductHeroBanner } from './components/product-hero-banner';

// ----------------------------------------------------------------------

const MODEL_PLACEHOLDER_MODELS: ProductModel[] = [
  {
    id: 'placeholder-model-1',
    name: 'Edición Estándar',
    image: '/assets/background/cards/modelo.png',
    price: 22999,
    details: {
      screenSize: 'Pantalla 6.1”',
      camera: 'Cámara dual 12 MP',
      otherDetail: 'Chip A15 Bionic',
    },
    gallery: ['/assets/background/cards/modelo.png'],
  },
  {
    id: 'placeholder-model-2',
    name: 'Edición Plus',
    image: '/assets/background/cards/modelo.png',
    price: 25999,
    details: {
      screenSize: 'Pantalla 6.7”',
      camera: 'Cámara triple 48 MP',
      otherDetail: 'Batería de larga duración',
    },
    gallery: ['/assets/background/cards/modelo.png'],
  },
  {
    id: 'placeholder-model-3',
    name: 'Edición Pro',
    image: '/assets/background/cards/modelo.png',
    price: 29999,
    details: {
      screenSize: 'Pantalla 6.8”',
      camera: 'Cámara ProRAW 48 MP',
      otherDetail: '120 Hz ProMotion',
    },
    gallery: ['/assets/background/cards/modelo.png'],
  },
];

const STORAGE_PLACEHOLDERS: StorageOption[] = [
  { id: 'storage-128', name: '128 GB', price: 0 },
  { id: 'storage-256', name: '256 GB', price: 1800 },
  { id: 'storage-512', name: '512 GB', price: 3600 },
];

const COLOR_PLACEHOLDERS: ColorOption[] = [
  {
    id: 'color-arena',
    name: 'Arena',
    colorCode: '#D6C2A6',
    gradient: '#D6C2A6',
  },
  {
    id: 'color-lavanda',
    name: 'Lavanda',
    colorCode: '#C7C1E4',
    gradient: '#C7C1E4',
  },
  {
    id: 'color-grafito',
    name: 'Grafito',
    colorCode: '#3A3A3A',
    gradient: '#3A3A3A',
  },
  {
    id: 'color-marfil',
    name: 'Marfil',
    colorCode: '#F4F1EE',
    gradient: '#F4F1EE',
  },
];

const ACCESSORY_PLACEHOLDERS: Accessory[] = [
  {
    id: 'placeholder-accessory-1',
    name: 'Funda magnética premium',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    price: 899,
    availableColors: COLOR_PLACEHOLDERS.slice(0, 3),
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ marca: string; modelo: string; id: string }>;
};

export default function ProductoPage({ params }: Props) {
  const {
    product,
    selectedOptions,
    totalPrice,
    loadingStates,
    setInitialProduct,
    setCondition,
    setStorage,
    setModel,
    setColor,
    toggleAccessory,
    setAccessoryColor,
    createPaymentSession,
  } = useProductCheckoutStore();
  const { addItem } = useCart();

  // OPCIONAL: Descomentar la siguiente línea para requerir autenticación en esta página
  // useRequireAuth();

  const [verifiedModalOpen, setVerifiedModalOpen] = useState(false);
  const [hoveredConditionId, setHoveredConditionId] = useState<string | null>(null);
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null);
  const [hoveredStorageId, setHoveredStorageId] = useState<string | null>(null);
  const [hoveredColorId, setHoveredColorId] = useState<string | null>(null);
  const [selectedAccessoryColors, setSelectedAccessoryColors] = useState<Record<string, string>>(
    {}
  );
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Cargar producto según el ID de la ruta (sin auto-selección)
  useEffect(() => {
    const loadProduct = async () => {
      const { id } = await params;
      const initialData = await getInitialProductData(id);
      if (initialData) {
        setInitialProduct(initialData);
        // NO auto-seleccionar nada
      }
    };
    loadProduct();
  }, [params, setInitialProduct]);

  if (!product) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);

  const selectedCondition = product.conditions.find((c) => c.id === selectedOptions.conditionId);
  const selectedModel = product.models?.find((m) => m.id === selectedOptions.modelId);
  const selectedStorage = product.storage?.find((s) => s.id === selectedOptions.storageId);
  const selectedColor = product.colors?.find((c) => c.id === selectedOptions.colorId);
  const selectedAccessories =
    selectedOptions.accessoryIds
      .map((accId) => {
        const accessory = product.accessories?.find((a) => a.id === accId);
        if (!accessory) {
          return null;
        }

        const colorId = selectedOptions.accessoryColors[accId];
        const accessoryColor =
          accessory.availableColors.find((color) => color.id === colorId) ??
          accessory.availableColors[0];

        if (!accessoryColor) {
          return null;
        }

        return {
          accessory,
          selectedColor: accessoryColor,
        };
      })
      .filter(
        (
          item
        ): item is {
          accessory: Accessory;
          selectedColor: ColorOption;
        } => Boolean(item)
      ) ?? [];

  const modelCarouselData: ProductModel[] =
    product.models && product.models.length > 0 ? product.models : MODEL_PLACEHOLDER_MODELS;
  const modelCarouselLoaded =
    Boolean(product.models && product.models.length > 0) && loadingStates.models.isLoaded;

  const storageOptionsList: StorageOption[] =
    product.storage && product.storage.length > 0 ? product.storage : STORAGE_PLACEHOLDERS;
  const storageLoaded =
    Boolean(product.storage && product.storage.length > 0) && loadingStates.storage.isLoaded;

  const colorOptionsList: ColorOption[] =
    product.colors && product.colors.length > 0 ? product.colors : COLOR_PLACEHOLDERS;
  const colorCarouselLoaded =
    Boolean(product.colors && product.colors.length > 0) && loadingStates.colors.isLoaded;

  const accessoryList: Accessory[] =
    product.accessories && product.accessories.length > 0
      ? product.accessories
      : ACCESSORY_PLACEHOLDERS;
  const accessoriesLoaded =
    Boolean(product.accessories && product.accessories.length > 0) &&
    loadingStates.accessories.isLoaded;

  const handleBuyNow = async () => {
    if (paymentLoading) return;
    if (typeof window === 'undefined') return;

    try {
      setPaymentLoading(true);
      setPaymentError(null);

      const paymentUrl = await createPaymentSession({
        successUrl: `https://bloop-test.vercel.app`, //  /${origin}/success`,
        cancelUrl: `https://bloop-test.vercel.app`, //  /${origin}/cancel`,
      });

      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ocurrió un error al procesar el pago.';
      setPaymentError(message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedCondition || !selectedModel || !selectedStorage || !selectedColor) {
      console.warn(
        'Debes seleccionar estado, modelo, almacenamiento y color antes de agregar al carrito.'
      );
      return;
    }

    const accessoriesForCart = selectedAccessories.map(
      ({ accessory, selectedColor: accessoryColor }) => ({
        id: accessory.id,
        name: accessory.name,
        color: accessoryColor
          ? {
              id: accessoryColor.id,
              name: accessoryColor.name,
              value: accessoryColor.gradient ?? accessoryColor.colorCode,
            }
          : undefined,
      })
    );

    const itemIdParts = [
      product.id,
      selectedCondition.id,
      selectedModel.id,
      selectedStorage.id,
      selectedColor.id,
      ...accessoriesForCart
        .map((item) => `${item.id}:${item.color?.id ?? 'default'}`)
        .sort((a, b) => a.localeCompare(b)),
    ];

    const cartItemId = itemIdParts.join('|');

    const cartItemName = [product.modelo, selectedStorage?.name, selectedColor?.name]
      .filter(Boolean)
      .join(' · ');

    const item: Omit<CartItem, 'cantidad'> = {
      id: cartItemId,
      type: 'producto',
      productId: product.id,
      marca: product.marca,
      modelo: product.modelo,
      nombre: cartItemName || product.modelo,
      precio: totalPrice,
      imagen: selectedModel.image || product.thumbnailImage,
      options: {
        condition: { id: selectedCondition.id, name: selectedCondition.name },
        model: { id: selectedModel.id, name: selectedModel.name },
        storage: { id: selectedStorage.id, name: selectedStorage.name },
        color: {
          id: selectedColor.id,
          name: selectedColor.name,
          value: selectedColor.gradient ?? selectedColor.colorCode,
        },
        accessories: accessoriesForCart,
      },
    };

    addItem(item);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Product Hero Banner */}
      <ProductHeroBanner
        productName={product.modelo}
        backgroundImage={
          // product.bannerBackgroundImage ||
          product.marca.toLowerCase().includes('apple')
            ? '/assets/background/banner/iPhone.png'
            : '/assets/background/banner/Samsung.png'
        }
        variants={product.bannerVariants}
      />

      {/* Step 0: Estado (siempre visible, ya cargado) */}
      <Box id="step-0" sx={{ minHeight: '70vh', py: 6 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
          }}
        >
          {/* Lado izquierdo: Carrusel de imágenes (solo aparece cuando hay estado seleccionado) */}
          <Box
            sx={{
              width: {
                xs: '100%',
                md: selectedOptions.conditionId ? '42%' : '0%',
              },
              opacity: selectedOptions.conditionId ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              order: { xs: 2, md: 1 },
            }}
          >
            {selectedOptions.conditionId && (
              <ConditionCarousel
                images={
                  product.conditions.find((c) => c.id === selectedOptions.conditionId)?.images || []
                }
                conditionName={
                  product.conditions.find((c) => c.id === selectedOptions.conditionId)?.name || ''
                }
              />
            )}
          </Box>

          {/* Lado derecho: Chips, título y cards de estados */}
          <Box
            sx={{
              width: {
                xs: '100%',
                md: selectedOptions.conditionId ? '58%' : '100%',
              },
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              order: { xs: 1, md: 2 },
            }}
          >
            {/* Chip informativo */}
            <Box sx={{ mb: 2 }}>
              {/* <Chip label="Selección de estado" variant="outlined" size="small" /> */}
              <Box
                sx={{
                  borderRadius: '10px',
                  display: 'flex',
                  width: 'fit-content',
                  padding: '10px 37px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#F8F8F8',
                }}
              >
                <Typography
                  sx={{
                    color: '#7F746A',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '24px',
                    letterSpacing: '-0.16px',
                  }}
                >
                  Selección de estado
                </Typography>
              </Box>
            </Box>

            {/* Título */}
            <Typography
              sx={{
                color: '#A49A8F',
                fontWeight: 500,
                letterSpacing: '-0.96px',
                mb: 3,
                fontSize: { xs: '32px', md: '48px' },
                lineHeight: { xs: '40px', md: '60px' },
              }}
            >
              <span style={{ color: '#7F746A' }}>Selecciona</span> el estado del{' '}
              {product.marca?.toLowerCase() === 'apple' ? 'iPhone' : 'Smartphone'}
            </Typography>

            {/* Chip Reacondicionado verificado */}
            <Box sx={{ mb: 4 }}>
              <Box
                onClick={() => setVerifiedModalOpen(true)}
                sx={{
                  borderRadius: '25px',
                  display: 'flex',
                  width: 'fit-content',
                  padding: '8px 13px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  border: ' 1px solid #98B1C6',
                  background: '#F3F9FF',
                  cursor: 'pointer',
                  '&:hover': {
                    background: '#E8F4FF',
                  },
                }}
              >
                <Box
                  component="img"
                  src="/assets/icons/apps/ic-check.svg"
                  alt="verificado"
                  sx={{ width: 17, height: 17 }}
                />
                <Typography
                  sx={{
                    color: '#597391',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '20px',
                    letterSpacing: '-0.14px',
                  }}
                >
                  Reacondicionado verificado
                </Typography>
                <Box
                  component="img"
                  src="/assets/icons/apps/ic-left.svg"
                  alt="ver más"
                  sx={{ width: 8, height: 15 }}
                />
              </Box>
            </Box>

            {/* Cards de estados */}
            <Grid container spacing={3}>
              {product.conditions.map((condition) => (
                <Grid size={{ xs: 12, sm: selectedOptions.conditionId ? 5 : 3 }} key={condition.id}>
                  <Card
                    onClick={() => setCondition(condition.id)}
                    onMouseEnter={() => setHoveredConditionId(condition.id)}
                    onMouseLeave={() => setHoveredConditionId(null)}
                    sx={{
                      cursor: 'pointer',
                      width: { xs: '100%', sm: 296 },
                      height: { xs: 196, md: 296 },
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '89px',
                      flexShrink: 0,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      willChange: 'transform',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    {/* Capa 1: Imagen de fondo específica */}
                    <Box
                      component="img"
                      src={
                        condition.id === 'new'
                          ? '/assets/background/cards/nuevo.png'
                          : '/assets/background/cards/usado.png'
                      }
                      alt={condition.name}
                      sx={{
                        position: 'absolute',
                        top: 20,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        zIndex: 0,
                      }}
                    />

                    {/* Capa 2: Gradiente + Blur */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background:
                          'linear-gradient(322deg, rgba(208, 203, 194, 0.26) -1.74%, rgba(127, 116, 106, 0.48) 63.01%)',
                        backdropFilter:
                          selectedOptions.conditionId === condition.id
                            ? 'blur(30.45px)'
                            : 'blur(21.45px)',
                        zIndex: 1,
                      }}
                    />

                    {/* Círculo de selección superior derecha (siempre visible) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 3,
                      }}
                    >
                      <SelectionCircle
                        state={
                          selectedOptions.conditionId === condition.id
                            ? 'selected'
                            : hoveredConditionId === condition.id
                              ? 'hover'
                              : 'default'
                        }
                      />
                    </Box>

                    {/* Ícono superior izquierda */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 3,
                      }}
                    >
                      {condition.id === 'new' ? (
                        <NuevoIcon width={64} height={64} />
                      ) : (
                        <RefurbishedIcon width={68} height={64} />
                      )}
                    </Box>

                    {/* Contenido pegado abajo y alineado a la izquierda */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 24,
                        left: 24,
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: 'white',
                          textAlign: 'left',
                        }}
                      >
                        {condition.name}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: 'white',
                          textAlign: 'left',
                        }}
                      >
                        A partir de {formatPrice(condition.price)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Modal de Reacondicionado Verificado */}
        <VerifiedModal open={verifiedModalOpen} onClose={() => setVerifiedModalOpen(false)} />
      </Box>

      {/* Step 1: Modelo (disabled hasta seleccionar estado) */}
      <Box
        id="step-1"
        sx={{
          minHeight: '70vh',
          py: 8,
          bgcolor: '#F8F8F8',
          px: 3,
        }}
      >
        {/* Chip superior */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              borderRadius: '10px',
              display: 'flex',
              width: 'fit-content',
              padding: '10px 37px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              background: '#FFF',
            }}
          >
            <Typography
              sx={{
                color: '#7F746A',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '24px',
                letterSpacing: '-0.16px',
              }}
            >
              Modelo
            </Typography>
          </Box>
        </Box>

        {/* Título */}
        <Typography
          sx={{
            color: '#A49A8F',
            fontWeight: 500,
            letterSpacing: '-0.96px',
            mb: 6,
            textAlign: 'center',
            fontSize: { xs: '32px', md: '48px' },
            lineHeight: { xs: '40px', md: '60px' },
          }}
        >
          <span style={{ color: '#7F746A' }}>Selecciona</span> el modelo
        </Typography>

        <ModelCarousel
          models={modelCarouselData}
          selectedModelId={modelCarouselLoaded ? selectedOptions.modelId : ''}
          hoveredModelId={modelCarouselLoaded ? hoveredModelId : null}
          onSelectModel={(id) => {
            if (modelCarouselLoaded) {
              setModel(id);
            }
          }}
          onHoverModel={(id) => {
            if (modelCarouselLoaded) {
              setHoveredModelId(id);
            }
          }}
          formatPrice={formatPrice}
          isLoaded={modelCarouselLoaded}
        />
      </Box>

      {/* Step 2: Almacenamiento (disabled hasta seleccionar modelo) */}
      <Box
        id="step-2"
        sx={{
          minHeight: '70vh',
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Layout de dos columnas */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 4, md: 12 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
          }}
        >
          {/* Lado izquierdo: Chip y Título */}
          <Box
            sx={{
              width: { xs: '100%', md: '40%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {/* Chip */}
            <Box
              sx={{
                borderRadius: '10px',
                display: 'flex',
                width: 'fit-content',
                padding: '10px 37px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                background: '#F8F8F8',
              }}
            >
              <Typography
                sx={{
                  color: '#7F746A',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '24px',
                  letterSpacing: '-0.16px',
                }}
              >
                Almacenamiento
              </Typography>
            </Box>

            {/* Título */}
            <Typography
              sx={{
                color: '#A49A8F',
                fontSize: { xs: '32px', md: '48px' },
                fontWeight: 500,
                lineHeight: { xs: '40px', md: '60px' },
                letterSpacing: '-0.96px',
                textAlign: 'left',
              }}
            >
              <span style={{ color: '#7F746A' }}>Selecciona</span> el almacenamiento
            </Typography>
          </Box>

          {/* Lado derecho: Cards de almacenamiento */}
          <Box
            sx={{
              width: { xs: '100%', md: '60%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {/* Cards de almacenamiento en columna */}
            {storageOptionsList.map((storage) => {
              const isSelected = storageLoaded && selectedOptions.storageId === storage.id;
              const isHovered = storageLoaded && hoveredStorageId === storage.id;

              return (
                <Card
                  key={storage.id}
                  onClick={() => {
                    if (storageLoaded) {
                      setStorage(storage.id);
                    }
                  }}
                  onMouseEnter={() => {
                    if (storageLoaded) {
                      setHoveredStorageId(storage.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (storageLoaded) {
                      setHoveredStorageId(null);
                    }
                  }}
                  sx={{
                    display: 'flex',
                    height: 68,
                    padding: '18px',
                    background: '#F8F8F8',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: storageLoaded ? 'pointer' : 'default',
                    opacity: storageLoaded ? 1 : 0.5,
                    border: '1px solid',
                    borderColor: isSelected ? '#7F746A' : 'divider',
                    transition: 'all 0.2s',
                    borderRadius: '18px',
                    pointerEvents: storageLoaded ? 'auto' : 'none',
                    '&:hover': {
                      borderColor: storageLoaded ? '#7F746A' : 'divider',
                    },
                  }}
                >
                  {/* Contenido de la card: SelectionCircle, Icon, Capacidad, Precio */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      height: '100%',
                    }}
                  >
                    {/* SelectionCircle */}
                    <SelectionCircle
                      color="#7F746A"
                      state={isSelected ? 'selected' : isHovered ? 'hover' : 'default'}
                    />

                    {/* StorageIcon */}
                    <StorageIcon capacity={storage.name} width={28} height={28} />

                    {/* Capacidad */}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#7F746A',
                      }}
                    >
                      {storage.name}
                    </Typography>
                  </Box>

                  {/* Precio */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#7F746A',
                      }}
                    >
                      {storage.price > 0 ? `+${formatPrice(storage.price)}` : 'Incluido'}
                    </Typography>
                  </Box>
                </Card>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Step 3: Color */}
      <Box id="step-3" sx={{ minHeight: '70vh', py: 6 }}>
        {/* Chip superior */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              borderRadius: '10px',
              display: 'flex',
              width: 'fit-content',
              padding: '10px 37px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              background: '#F8F8F8',
            }}
          >
            <Typography
              sx={{
                color: '#7F746A',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '24px',
                letterSpacing: '-0.16px',
              }}
            >
              Color
            </Typography>
          </Box>
        </Box>

        {/* Título */}
        <Typography
          sx={{
            color: '#A49A8F',
            fontWeight: 500,
            letterSpacing: '-0.96px',
            mb: 6,
            textAlign: 'center',
            fontSize: { xs: '32px', md: '48px' },
            lineHeight: { xs: '40px', md: '60px' },
          }}
        >
          <span style={{ color: '#7F746A' }}>Escoge</span> el color de tu smartphone
        </Typography>

        <ColorCarousel
          colors={colorOptionsList}
          selectedColorId={colorCarouselLoaded ? selectedOptions.colorId : ''}
          hoveredColorId={colorCarouselLoaded ? hoveredColorId : null}
          onSelectColor={(id) => {
            if (colorCarouselLoaded) {
              setColor(id);
            }
          }}
          onHoverColor={(id) => {
            if (colorCarouselLoaded) {
              setHoveredColorId(id);
            }
          }}
          isLoaded={colorCarouselLoaded}
        />
      </Box>

      {/* Step 4: Accesorios */}
      <Box id="step-4" sx={{ minHeight: '70vh', py: 6 }}>
        {/* Chip superior */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              borderRadius: '10px',
              display: 'flex',
              width: 'fit-content',
              padding: '10px 37px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              background: '#F8F8F8',
            }}
          >
            <Typography
              sx={{
                color: '#7F746A',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '24px',
                letterSpacing: '-0.16px',
              }}
            >
              Accesorios
            </Typography>
          </Box>
        </Box>

        {/* Título */}
        <Typography
          sx={{
            color: '#A49A8F',
            fontWeight: 500,
            letterSpacing: '-0.96px',
            mb: 6,
            textAlign: 'center',
            fontSize: { xs: '32px', md: '48px' },
            lineHeight: { xs: '40px', md: '60px' },
          }}
        >
          <span style={{ color: '#7F746A' }}>Agrega</span> accesorios para tu smartphone
        </Typography>

        {/* Mapear cada accesorio como AccessorySection */}
        {accessoryList.map((accessory) => {
          const isSelected =
            accessoriesLoaded && selectedOptions.accessoryIds.includes(accessory.id);
          const baseColorId =
            accessory.availableColors.length > 0 ? accessory.availableColors[0].id : '';
          const selectedColorId = accessoriesLoaded
            ? selectedAccessoryColors[accessory.id] ||
              selectedOptions.accessoryColors[accessory.id] ||
              baseColorId
            : baseColorId;

          const handleToggle = () => {
            if (!accessoriesLoaded) {
              return;
            }

            if (!isSelected && accessory.availableColors.length > 0) {
              const colorToSet =
                selectedAccessoryColors[accessory.id] || accessory.availableColors[0].id;
              setAccessoryColor(accessory.id, colorToSet);
            }

            toggleAccessory(accessory.id);
          };

          const handleColorSelect = (colorId: string) => {
            if (!accessoriesLoaded) {
              return;
            }

            setSelectedAccessoryColors((prev) => ({
              ...prev,
              [accessory.id]: colorId,
            }));
            setAccessoryColor(accessory.id, colorId);
          };

          return (
            <Box
              key={accessory.id}
              sx={{
                opacity: accessoriesLoaded ? 1 : 0.5,
                pointerEvents: accessoriesLoaded ? 'auto' : 'none',
              }}
            >
              <AccessorySection
                accessory={accessory}
                isSelected={isSelected}
                selectedColorId={selectedColorId}
                onToggle={handleToggle}
                onColorSelect={handleColorSelect}
                formatPrice={formatPrice}
              />
            </Box>
          );
        })}
      </Box>

      {/* Step 5: Resumen y Pago - Solo visible cuando todo está seleccionado */}
      {selectedOptions.conditionId &&
        selectedOptions.modelId &&
        selectedOptions.storageId &&
        selectedOptions.colorId && (
          <Box id="step-5" sx={{ minHeight: '70vh', py: 6 }}>
            {/* Chip superior */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  borderRadius: '10px',
                  display: 'flex',
                  width: 'fit-content',
                  padding: '10px 37px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#F8F8F8',
                }}
              >
                <Typography
                  sx={{
                    color: '#7F746A',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '24px',
                    letterSpacing: '-0.16px',
                  }}
                >
                  Resultado
                </Typography>
              </Box>
            </Box>

            {/* Título */}
            <Typography
              sx={{
                color: '#7F746A',
                fontSize: '48px',
                fontWeight: 500,
                lineHeight: '60px',
                letterSpacing: '-0.96px',
                mb: 6,
                textAlign: 'center',
              }}
            >
              Tu smartphone esta listo
            </Typography>

            {/* Layout responsive: Mobile columna, Desktop fila */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
              }}
            >
              {/* Carrusel izquierda en desktop, arriba en mobile */}
              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <CheckoutCarousel
                  images={
                    product.models?.find((model) => model.id === selectedOptions.modelId)
                      ?.gallery || [product.thumbnailImage]
                  }
                />
              </Box>

              {/* Resumen derecha en desktop, abajo en mobile */}
              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <CheckoutSummary
                  modelName={product.modelo || 'Smartphone'}
                  condition={selectedCondition!}
                  storage={selectedStorage}
                  color={selectedColor}
                  accessories={selectedAccessories}
                  totalPrice={totalPrice}
                  formatPrice={formatPrice}
                  onRemoveAccessory={(accessoryId) => {
                    toggleAccessory(accessoryId);
                  }}
                  onBuyNow={handleBuyNow}
                  onAddToCart={handleAddToCart}
                  isAddToCartDisabled={
                    !selectedCondition || !selectedModel || !selectedStorage || !selectedColor
                  }
                  isProcessingPayment={paymentLoading}
                  paymentError={paymentError}
                />
              </Box>
            </Box>
          </Box>
        )}
    </Container>
  );
}
