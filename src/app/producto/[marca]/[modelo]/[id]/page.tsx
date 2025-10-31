'use client';

import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { getInitialProductData, useProductCheckoutStore } from 'src/store/product-checkout-store';

import { varFade } from 'src/components/animate';

import { VerifiedModal } from './components/verified-modal';
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

  const [verifiedModalOpen, setVerifiedModalOpen] = useState(false);

  // Cargar producto según el ID de la ruta (sin auto-selección)
  useEffect(() => {
    const loadProduct = async () => {
      const { id } = await params;
      const initialData = getInitialProductData(id);
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
        backgroundImage={product.bannerBackgroundImage}
        variants={product.bannerVariants}
      />

      {/* Step 0: Estado (siempre visible, ya cargado) */}
      <Box
        id="step-0"
        component={m.div}
        variants={varFade('inUp')}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        sx={{ minHeight: '70vh', py: 6 }}
      >
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
                fontSize: '48px',
                fontWeight: 500,
                lineHeight: '60px',
                letterSpacing: '-0.96px',
                mb: 3,
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
                <Grid
                  size={{ xs: 12, sm: selectedOptions.conditionId ? 6 : 3.5 }}
                  key={condition.id}
                >
                  <Card
                    onClick={() => setCondition(condition.id)}
                    sx={{
                      cursor: 'pointer',
                      width: { xs: '100%', sm: 296 },
                      height: 296,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '24px',
                      flexShrink: 0,
                      border: 2,
                      borderColor:
                        selectedOptions.conditionId === condition.id ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      {/* Imagen principal del estado */}
                      {condition.images[0] && (
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: 2,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            component="img"
                            src={condition.images[0]}
                            alt={condition.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {condition.name}
                        </Typography>
                        <Radio checked={selectedOptions.conditionId === condition.id} />
                      </Box>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                        A partir de {formatPrice(condition.price)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Modal de Reacondicionado Verificado */}
        <VerifiedModal open={verifiedModalOpen} onClose={() => setVerifiedModalOpen(false)} />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Step 1: Modelo (disabled hasta seleccionar estado) */}
      <Box
        id="step-1"
        component={m.div}
        variants={varFade('inUp')}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        sx={{ minHeight: '70vh', py: 6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Elige tu modelo
        </Typography>

        {/* Loading state */}
        {loadingStates.models.isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {loadingStates.models.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loadingStates.models.error}
          </Alert>
        )}

        {/* Info - esperando selección anterior */}
        {!loadingStates.models.isLoaded && !loadingStates.models.isLoading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Selecciona un estado para ver modelos disponibles
          </Alert>
        )}

        <Grid container spacing={3}>
          {product.models && product.models.length > 0
            ? product.models.map((model) => (
                <Grid size={{ xs: 12 }} key={model.id}>
                  <Card
                    onClick={() => loadingStates.models.isLoaded && setModel(model.id)}
                    sx={{
                      cursor: loadingStates.models.isLoaded ? 'pointer' : 'not-allowed',
                      opacity: loadingStates.models.isLoaded ? 1 : 0.4,
                      border: 2,
                      borderColor:
                        selectedOptions.modelId === model.id ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      pointerEvents: loadingStates.models.isLoaded ? 'auto' : 'none',
                      '&:hover': {
                        borderColor: loadingStates.models.isLoaded ? 'primary.main' : 'divider',
                        transform: loadingStates.models.isLoaded ? 'translateY(-4px)' : 'none',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 200,
                            height: 200,
                            borderRadius: 2,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            component="img"
                            src={model.image}
                            alt={model.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {model.name}
                            </Typography>
                            <Radio checked={selectedOptions.modelId === model.id} />
                          </Box>
                          {model.price > 0 && (
                            <Typography
                              variant="h6"
                              color="primary.main"
                              sx={{ fontWeight: 700, mb: 2 }}
                            >
                              +{formatPrice(model.price)}
                            </Typography>
                          )}
                          {model.details.screenSize && (
                            <Typography variant="body1" color="text.secondary" paragraph>
                              {model.details.screenSize}
                            </Typography>
                          )}
                          {model.details.camera && (
                            <Typography variant="body1" color="text.secondary" paragraph>
                              {model.details.camera}
                            </Typography>
                          )}
                          {model.details.otherDetail && (
                            <Typography variant="body1" color="text.secondary">
                              {model.details.otherDetail}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : // Placeholder cuando no hay datos
              !loadingStates.models.isLoading && (
                <Grid size={{ xs: 12 }}>
                  <Card sx={{ opacity: 0.3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Skeleton variant="rectangular" width={200} height={200} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
                          <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
                          <Skeleton variant="text" width="80%" />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Step 2: Almacenamiento (disabled hasta seleccionar modelo) */}
      <Box
        id="step-2"
        component={m.div}
        variants={varFade('inUp')}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        sx={{ minHeight: '70vh', py: 6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Almacenamiento
        </Typography>

        {/* Loading state */}
        {loadingStates.storage.isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {loadingStates.storage.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loadingStates.storage.error}
          </Alert>
        )}

        {/* Info - esperando selección anterior */}
        {!loadingStates.storage.isLoaded && !loadingStates.storage.isLoading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Selecciona un modelo para ver almacenamientos disponibles
          </Alert>
        )}

        <Grid container spacing={3}>
          {product.storage && product.storage.length > 0
            ? product.storage.map((storage) => (
                <Grid size={{ xs: 6, sm: 3 }} key={storage.id}>
                  <Card
                    onClick={() => loadingStates.storage.isLoaded && setStorage(storage.id)}
                    sx={{
                      cursor: loadingStates.storage.isLoaded ? 'pointer' : 'not-allowed',
                      opacity: loadingStates.storage.isLoaded ? 1 : 0.4,
                      border: 2,
                      borderColor:
                        selectedOptions.storageId === storage.id ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      pointerEvents: loadingStates.storage.isLoaded ? 'auto' : 'none',
                      '&:hover': {
                        borderColor: loadingStates.storage.isLoaded ? 'primary.main' : 'divider',
                        transform: loadingStates.storage.isLoaded ? 'translateY(-4px)' : 'none',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {storage.name}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {storage.price > 0 ? `+${formatPrice(storage.price)}` : 'Incluido'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : // Placeholders cuando no hay datos
              !loadingStates.storage.isLoading &&
              [1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 6, sm: 3 }} key={i}>
                  <Card sx={{ opacity: 0.3 }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Skeleton variant="text" sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Step 3: Color */}
      <Box
        id="step-3"
        component={m.div}
        variants={varFade('inUp')}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        sx={{ minHeight: '70vh', py: 6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Color
        </Typography>

        {/* Loading state */}
        {loadingStates.colors.isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {loadingStates.colors.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loadingStates.colors.error}
          </Alert>
        )}

        {/* Info - esperando selección anterior */}
        {!loadingStates.colors.isLoaded && !loadingStates.colors.isLoading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Selecciona el almacenamiento para ver colores disponibles
          </Alert>
        )}

        <Grid container spacing={3}>
          {product.colors && product.colors.length > 0
            ? product.colors.map((color) => (
                <Grid size={{ xs: 6, sm: 3 }} key={color.id}>
                  <Card
                    onClick={() => loadingStates.colors.isLoaded && setColor(color.id)}
                    sx={{
                      cursor: loadingStates.colors.isLoaded ? 'pointer' : 'not-allowed',
                      opacity: loadingStates.colors.isLoaded ? 1 : 0.5,
                      border: 2,
                      borderColor:
                        selectedOptions.colorId === color.id ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      pointerEvents: loadingStates.colors.isLoaded ? 'auto' : 'none',
                      '&:hover': {
                        borderColor: loadingStates.colors.isLoaded ? 'primary.main' : 'divider',
                        transform: loadingStates.colors.isLoaded ? 'translateY(-4px)' : 'none',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: color.colorCode,
                          mx: 'auto',
                          mb: 2,
                          border: '2px solid',
                          borderColor: 'divider',
                        }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {color.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : // Placeholders cuando no hay datos
              !loadingStates.colors.isLoading &&
              [1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 6, sm: 3 }} key={i}>
                  <Card sx={{ opacity: 0.3 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Skeleton
                        variant="circular"
                        width={60}
                        height={60}
                        sx={{ mx: 'auto', mb: 2 }}
                      />
                      <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Step 4: Accesorios */}
      <Box
        id="step-4"
        component={m.div}
        variants={varFade('inUp')}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        sx={{ minHeight: '70vh', py: 6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Accesorios
        </Typography>

        {/* Loading state */}
        {loadingStates.accessories.isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {loadingStates.accessories.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loadingStates.accessories.error}
          </Alert>
        )}

        {/* Info - esperando selección anterior */}
        {!loadingStates.accessories.isLoaded && !loadingStates.accessories.isLoading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Selecciona un color para ver accesorios disponibles
          </Alert>
        )}

        <Grid container spacing={3}>
          {product.accessories && product.accessories.length > 0
            ? product.accessories.map((accessory) => {
                const isSelected = selectedOptions.accessoryIds.includes(accessory.id);
                const selectedColorId = selectedOptions.accessoryColors[accessory.id];
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={accessory.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: 2,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent>
                        {/* Imagen del accesorio */}
                        <Box
                          sx={{
                            width: '100%',
                            height: 150,
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: 2,
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6">{accessory.name}</Typography>
                          <Chip
                            label={formatPrice(accessory.price)}
                            color={isSelected ? 'primary' : 'default'}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Accesorio original compatible con {product.modelo}
                        </Typography>

                        {/* Selector de colores si hay más de uno disponible */}
                        {accessory.availableColors.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                              {accessory.availableColors.length > 1
                                ? 'Colores disponibles:'
                                : 'Color:'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {accessory.availableColors.map((color) => (
                                <Chip
                                  key={color.id}
                                  label={color.name}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isSelected || accessory.availableColors.length === 1) {
                                      setAccessoryColor(accessory.id, color.id);
                                      if (!isSelected) {
                                        toggleAccessory(accessory.id);
                                      }
                                    }
                                  }}
                                  disabled={!isSelected && accessory.availableColors.length > 1}
                                  sx={{
                                    background:
                                      selectedColorId === color.id
                                        ? color.colorCode
                                        : 'rgba(0,0,0,0.08)',
                                    color:
                                      selectedColorId === color.id
                                        ? color.colorCode.startsWith('#') &&
                                          (color.colorCode === '#FFFFFF' ||
                                            color.colorCode === '#ffffff')
                                          ? '#000'
                                          : '#FFF'
                                        : 'text.primary',
                                    border:
                                      selectedColorId === color.id ? '2px solid' : '1px solid',
                                    borderColor:
                                      selectedColorId === color.id ? 'primary.main' : 'divider',
                                    '&:hover': {
                                      background:
                                        selectedColorId === color.id
                                          ? color.colorCode
                                          : 'rgba(0,0,0,0.12)',
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* Botón para agregar/quitar */}
                        <Button
                          fullWidth
                          variant={isSelected ? 'contained' : 'outlined'}
                          onClick={() => {
                            if (!isSelected && accessory.availableColors.length > 0) {
                              setAccessoryColor(accessory.id, accessory.availableColors[0].id);
                            }
                            toggleAccessory(accessory.id);
                          }}
                          sx={{
                            borderRadius: '27px',
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          {isSelected ? 'Quitar' : 'Agregar'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            : // Placeholders cuando no hay datos
              !loadingStates.accessories.isLoading &&
              [1, 2].map((i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Card sx={{ opacity: 0.3 }}>
                    <CardContent>
                      <Skeleton variant="rectangular" width="100%" height={150} sx={{ mb: 2 }} />
                      <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
                      <Skeleton variant="rectangular" width="100%" height={40} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Step 5: Pago */}
      <Box
        id="step-5"
        component={m.div}
        variants={varFade('inUp')}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        sx={{ minHeight: '70vh', py: 6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Resumen y Pago
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tu selección
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Estado:</Typography>
                  <Typography fontWeight={600}>
                    {product.conditions?.find((c) => c.id === selectedOptions.conditionId)?.name ||
                      '-'}
                  </Typography>
                </Box>
                {product.storage && product.storage.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Almacenamiento:</Typography>
                    <Typography fontWeight={600}>
                      {product.storage.find((s) => s.id === selectedOptions.storageId)?.name || '-'}
                    </Typography>
                  </Box>
                )}
                {product.models && product.models.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Modelo:</Typography>
                    <Typography fontWeight={600}>
                      {product.models.find((model) => model.id === selectedOptions.modelId)?.name ||
                        '-'}
                    </Typography>
                  </Box>
                )}
                {product.colors && product.colors.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Color:</Typography>
                    <Typography fontWeight={600}>
                      {product.colors.find((c) => c.id === selectedOptions.colorId)?.name || '-'}
                    </Typography>
                  </Box>
                )}
                {selectedOptions.accessoryIds.length > 0 && product.accessories && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Accesorios:
                    </Typography>
                    {selectedOptions.accessoryIds.map((accId) => {
                      const acc = product.accessories!.find((a) => a.id === accId);
                      const colorId = selectedOptions.accessoryColors[accId];
                      const color = acc?.availableColors.find((c) => c.id === colorId);
                      return (
                        <Box
                          key={accId}
                          sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                        >
                          <Typography variant="body2">
                            {acc?.name}
                            {color && ` - ${color.name}`}
                          </Typography>
                          <Typography variant="body2">{formatPrice(acc?.price || 0)}</Typography>
                        </Box>
                      );
                    })}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ position: 'sticky', top: 120 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
                  {formatPrice(totalPrice)}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '27px',
                    textTransform: 'none',
                  }}
                >
                  Proceder al pago
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
