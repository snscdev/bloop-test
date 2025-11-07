'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

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
  } = useProductCheckoutStore();

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

        {/* Carrusel de modelos o placeholders */}
        {product.models && product.models.length > 0 ? (
          <ModelCarousel
            models={product.models}
            selectedModelId={selectedOptions.modelId}
            hoveredModelId={hoveredModelId}
            onSelectModel={(id) => loadingStates.models.isLoaded && setModel(id)}
            onHoverModel={setHoveredModelId}
            formatPrice={formatPrice}
            isLoaded={loadingStates.models.isLoaded}
          />
        ) : (
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexDirection: 'row' }}>
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                sx={{
                  width: 400,
                  height: 300,
                  opacity: 0.3,
                  bgcolor: '#E0E0E0',
                  pointerEvents: 'none',
                  display: { xs: i > 1 ? 'none' : 'block', md: 'block' },
                }}
              >
                <CardContent>
                  <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="40%" sx={{ mb: 3 }} />
                  <Skeleton variant="rectangular" width="100%" height={280} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton variant="rectangular" width={60} height={40} />
                    <Skeleton variant="rectangular" width={60} height={40} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
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
            gap: 4,
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
            {/* Cards de almacenamiento en columna o placeholders */}
            {product.storage && product.storage.length > 0
              ? product.storage.map((storage) => (
                  <Card
                    key={storage.id}
                    onClick={() => loadingStates.storage.isLoaded && setStorage(storage.id)}
                    onMouseEnter={() => setHoveredStorageId(storage.id)}
                    onMouseLeave={() => setHoveredStorageId(null)}
                    sx={{
                      display: 'flex',
                      height: 68,
                      padding: '18px',
                      background: '#F8F8F8',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: loadingStates.storage.isLoaded ? 'pointer' : 'not-allowed',
                      opacity: loadingStates.storage.isLoaded ? 1 : 0.4,
                      border: '1px solid',
                      borderColor: selectedOptions.storageId === storage.id ? '#7F746A' : 'divider',
                      transition: 'all 0.2s',
                      borderRadius: '18px',
                      pointerEvents: loadingStates.storage.isLoaded ? 'auto' : 'none',
                      '&:hover': {
                        borderColor: loadingStates.storage.isLoaded ? '#7F746A' : 'divider',
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
                        state={
                          selectedOptions.storageId === storage.id
                            ? 'selected'
                            : hoveredStorageId === storage.id
                              ? 'hover'
                              : 'default'
                        }
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
                ))
              : // Placeholders cuando no hay datos
                [1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    sx={{
                      display: 'flex',
                      height: 68,
                      padding: '18px',
                      opacity: 0.3,
                      bgcolor: '#E0E0E0',
                      pointerEvents: 'none',
                    }}
                  >
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  </Card>
                ))}
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

        {/* Carrusel de colores o placeholders */}
        {product.colors && product.colors.length > 0 ? (
          <ColorCarousel
            colors={product.colors}
            selectedColorId={selectedOptions.colorId}
            hoveredColorId={hoveredColorId}
            onSelectColor={(id) => loadingStates.colors.isLoaded && setColor(id)}
            onHoverColor={setHoveredColorId}
            isLoaded={loadingStates.colors.isLoaded}
          />
        ) : (
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                sx={{
                  width: { xs: 280, sm: 300 },
                  height: { xs: 280, sm: 300 },
                  opacity: 0.3,
                  bgcolor: '#E0E0E0',
                  pointerEvents: 'none',
                  display: { xs: i > 1 ? 'none' : 'block', sm: 'block' },
                }}
              >
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </Card>
            ))}
          </Box>
        )}
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

        {/* Mapear cada accesorio como AccessorySection o placeholders */}
        {product.accessories && product.accessories.length > 0
          ? product.accessories.map((accessory) => {
              const isSelected = selectedOptions.accessoryIds.includes(accessory.id);
              const selectedColorId =
                selectedAccessoryColors[accessory.id] ||
                (accessory.availableColors.length > 0 ? accessory.availableColors[0].id : '');

              return (
                <AccessorySection
                  key={accessory.id}
                  accessory={accessory}
                  isSelected={isSelected}
                  selectedColorId={selectedColorId}
                  onToggle={() => {
                    // Si no está seleccionado y tiene colores, asignar el primer color
                    if (!isSelected && accessory.availableColors.length > 0) {
                      const colorToSet =
                        selectedAccessoryColors[accessory.id] || accessory.availableColors[0].id;
                      setAccessoryColor(accessory.id, colorToSet);
                    }
                    toggleAccessory(accessory.id);
                  }}
                  onColorSelect={(colorId) => {
                    // Actualizar el estado local y el store
                    setSelectedAccessoryColors((prev) => ({
                      ...prev,
                      [accessory.id]: colorId,
                    }));
                    setAccessoryColor(accessory.id, colorId);
                  }}
                  formatPrice={formatPrice}
                />
              );
            })
          : // Placeholders cuando no hay datos
            [1].map((i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 4,
                  mb: 6,
                  opacity: 0.3,
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', md: '23%' },
                    height: { xs: 400, md: 380 },
                    bgcolor: '#E0E0E0',
                    borderRadius: '15px',
                  }}
                >
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </Box>
                <Box
                  sx={{
                    width: { xs: '100%', md: '77%' },
                    height: { xs: 300, md: 380 },
                    bgcolor: '#E0E0E0',
                    borderRadius: '15px',
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </Box>
              </Box>
            ))}
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
                  condition={product.conditions.find((c) => c.id === selectedOptions.conditionId)!}
                  storage={product.storage?.find((s) => s.id === selectedOptions.storageId)}
                  color={product.colors?.find((c) => c.id === selectedOptions.colorId)}
                  accessories={
                    selectedOptions.accessoryIds
                      .map((accId) => {
                        const accessory = product.accessories?.find((a) => a.id === accId);
                        const colorId = selectedOptions.accessoryColors[accId];
                        const selectedColor = accessory?.availableColors.find(
                          (c) => c.id === colorId
                        );
                        if (!accessory || !selectedColor) return null;
                        return { accessory, selectedColor };
                      })
                      .filter(Boolean) as Array<{ accessory: any; selectedColor: any }>
                  }
                  totalPrice={totalPrice}
                  formatPrice={formatPrice}
                  onRemoveAccessory={(accessoryId) => {
                    toggleAccessory(accessoryId);
                  }}
                  onBuyNow={() => {
                    // TODO: Implement buy now action
                    console.log('Comprar ahora');
                  }}
                  onAddToCart={() => {
                    // TODO: Implement add to cart action
                    console.log('Agregar al carrito');
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
    </Container>
  );
}
