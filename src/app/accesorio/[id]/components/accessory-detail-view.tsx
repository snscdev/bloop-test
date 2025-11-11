'use client';

import type { CartItem } from 'src/types/cart';
import type {
  Accessory,
  AccessoryBrandOption,
  AccessoryModelOption,
  AccessoryColorOption,
  AccessoryBrandVariant,
} from 'src/types/accessory';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';

import { useCart } from 'src/hooks/use-cart';

import {
  getAccessoryVariant,
  getAccessoryBrandVariant,
  getAccessoryDefaultSelections,
} from 'src/services/accessory-service';

import { Iconify } from 'src/components/iconify';

import { AccessoryGallery } from './accessory-gallery';

// ----------------------------------------------------------------------

type Props = {
  accessory: Accessory;
};

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);

const getBrandOptionById = (brands: AccessoryBrandOption[], id: string) =>
  brands.find((brand) => brand.id === id);

const getModelOptionById = (models: AccessoryModelOption[], id: string) =>
  models.find((model) => model.id === id);

const getColorOptionById = (colors: AccessoryColorOption[], id: string) =>
  colors.find((color) => color.id === id);

export function AccessoryDetailView({ accessory }: Props) {
  const router = useRouter();
  const { addItem } = useCart();

  const defaults = useMemo(() => getAccessoryDefaultSelections(accessory), [accessory]);

  const [selectedBrandId, setSelectedBrandId] = useState(defaults.brandId);
  const [selectedModelId, setSelectedModelId] = useState(defaults.modelId);
  const [selectedColorId, setSelectedColorId] = useState(defaults.colorId);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loadingBrandVariant, setLoadingBrandVariant] = useState(false);
  const [currentBrandVariant, setCurrentBrandVariant] = useState<AccessoryBrandVariant | null>(
    defaults.brandVariant ?? null
  );

  // Usar datos de currentBrandVariant en lugar de accessory directamente
  const colorOptions = currentBrandVariant?.colorOptions ?? [];
  const modelOptions = currentBrandVariant?.models ?? [];
  const brandOptions: AccessoryBrandOption[] = useMemo(
    () =>
      accessory.brandVariants.map((bv) => ({
        id: bv.brandId,
        name: bv.brandName,
        slug: bv.brandSlug,
        models: bv.models,
      })),
    [accessory.brandVariants]
  );

  const selectedBrand = useMemo(
    () => getBrandOptionById(brandOptions, selectedBrandId) ?? brandOptions[0],
    [brandOptions, selectedBrandId]
  );

  const selectedModel = useMemo(
    () => getModelOptionById(modelOptions, selectedModelId) ?? modelOptions[0],
    [modelOptions, selectedModelId]
  );

  const selectedColor = useMemo(
    () => getColorOptionById(colorOptions, selectedColorId) ?? colorOptions[0],
    [colorOptions, selectedColorId]
  );

  const activeVariant = useMemo(
    () =>
      selectedColor && currentBrandVariant
        ? getAccessoryVariant(currentBrandVariant, selectedColor.id)
        : currentBrandVariant?.variants[0],
    [currentBrandVariant, selectedColor]
  );

  const galleryImages = activeVariant?.images.length
    ? activeVariant.images
    : (currentBrandVariant?.gallery ?? []);

  const maxQuantity = activeVariant?.stock ?? 1;
  const isOutOfStock = (activeVariant?.stock ?? 0) <= 0;
  const currentPrice = activeVariant?.price ?? currentBrandVariant?.price ?? 0;

  useEffect(() => {
    if (selectedBrand && !modelOptions.some((model) => model.id === selectedModelId)) {
      const firstModel = modelOptions[0];
      if (firstModel) {
        setSelectedModelId(firstModel.id);
      }
    }
  }, [modelOptions, selectedBrand, selectedModelId]);

  useEffect(() => {
    if (selectedColor && selectedColor.id !== selectedColorId) {
      setSelectedColorId(selectedColor.id);
    }
  }, [selectedColor, selectedColorId]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeVariant?.id]);

  useEffect(() => {
    setQuantity((prev) => Math.min(prev, Math.max(1, maxQuantity)));
  }, [maxQuantity]);

  // Función para cargar variante de marca
  const loadBrandVariant = useCallback(
    async (brandId: string) => {
      setLoadingBrandVariant(true);
      try {
        const variant = await getAccessoryBrandVariant(accessory.id, brandId);
        if (variant) {
          setCurrentBrandVariant(variant);
          // Reset selecciones
          setSelectedColorId(variant.colorOptions[0]?.id ?? '');
          setActiveImageIndex(0);
          // Seleccionar primer modelo disponible
          const firstModel = variant.models[0];
          if (firstModel) {
            setSelectedModelId(firstModel.id);
          }
        }
      } catch (error) {
        console.error('Error loading brand variant:', error);
      } finally {
        setLoadingBrandVariant(false);
      }
    },
    [accessory.id]
  );

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, maxQuantity || prev + 1));
  };

  const handleSelectColor = (colorId: string) => {
    setSelectedColorId(colorId);
  };

  const handleSelectBrand = async (brandId: string) => {
    setSelectedBrandId(brandId);
    await loadBrandVariant(brandId);
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  const createCartItem = useCallback((): Omit<CartItem, 'cantidad'> | null => {
    if (!activeVariant || !selectedColor || !currentBrandVariant) {
      return null;
    }

    const image = activeVariant.images[0] ?? currentBrandVariant.heroImage;
    const cartItemId = [
      'accessory',
      accessory.id,
      activeVariant.id,
      selectedBrand?.id ?? 'brand',
      selectedModel?.id ?? 'model',
    ].join('|');

    return {
      id: cartItemId,
      type: 'producto',
      productId: accessory.id,
      marca: selectedBrand?.name ?? currentBrandVariant.brandName,
      modelo: selectedModel?.name ?? modelOptions[0]?.name ?? 'Unknown',
      nombre: accessory.name,
      precio: activeVariant.price,
      imagen: image.url,
      options: {
        condition: {
          id: 'accessory-default-condition',
          name: 'Accesorio',
        },
        model: selectedModel
          ? {
              id: selectedModel.id,
              name: selectedModel.name,
            }
          : undefined,
        color: {
          id: selectedColor.id,
          name: selectedColor.name,
          value: selectedColor.hex ?? selectedColor.value,
        },
      },
    };
  }, [
    accessory,
    activeVariant,
    selectedBrand,
    selectedModel,
    selectedColor,
    currentBrandVariant,
    modelOptions,
  ]);

  const addAccessoryToCart = useCallback(
    async (shouldRedirect: boolean) => {
      const item = createCartItem();
      if (!item) {
        return;
      }

      for (let i = 0; i < quantity; i += 1) {
        addItem(item);
      }

      if (shouldRedirect) {
        router.push('/cart');
      }
    },
    [addItem, createCartItem, quantity, router]
  );

  const handleAddToCart = async () => {
    if (addingToCart) {
      return;
    }
    setAddingToCart(true);
    try {
      await addAccessoryToCart(true);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || addingToCart) {
      return;
    }
    setAddingToCart(true);
    try {
      await addAccessoryToCart(true);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 6, md: 10 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 6, md: 10 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <Box>
          <AccessoryGallery
            images={galleryImages}
            activeIndex={activeImageIndex}
            onChange={setActiveImageIndex}
            isLoading={loadingBrandVariant}
          />
        </Box>

        <Box>
          <Stack spacing={4}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip
                  color="default"
                  variant="outlined"
                  label="Apple compatible"
                  icon={<Iconify icon="ri:apple-fill" width={20} />}
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    borderColor: alpha('#C1C1C1', 0.6),
                  }}
                />
                <Chip
                  color="default"
                  variant="outlined"
                  label={selectedBrand?.name ?? currentBrandVariant?.brandName ?? 'Samsung'}
                  icon={<Iconify icon="ri:samsung-fill" width={20} />}
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    borderColor: alpha('#C1C1C1', 0.6),
                  }}
                />
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {accessory.name}
              </Typography>

              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {formatCurrency(currentPrice, accessory.currency)}
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {accessory.description}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={3}>
              {loadingBrandVariant ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Color
                  </Typography>

                  <Stack direction="row" spacing={1.5} flexWrap="wrap" rowGap={2}>
                    {colorOptions.map((color) => {
                      const isSelected = color.id === selectedColorId;
                      return (
                        <ButtonBase
                          key={color.id}
                          onClick={() => handleSelectColor(color.id)}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: isSelected ? 'primary.main' : 'transparent',
                            boxShadow: isSelected
                              ? '0 12px 24px rgba(161, 137, 111, 0.25)'
                              : '0 6px 12px rgba(161, 137, 111, 0.12)',
                            transition: (theme) =>
                              theme.transitions.create(['transform', 'box-shadow', 'border-color']),
                            transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              bgcolor: color.hex ?? color.value,
                              border: '1px solid',
                              borderColor: '#ECECEC',
                            }}
                          />
                        </ButtonBase>
                      );
                    })}
                  </Stack>
                </Stack>
              )}

              <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  select
                  fullWidth
                  label="Marca"
                  value={selectedBrandId}
                  onChange={(event) => handleSelectBrand(event.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  {brandOptions.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Modelo"
                  value={selectedModelId}
                  onChange={(event) => handleSelectModel(event.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  {modelOptions.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Cantidad
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IconButton
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Iconify icon="solar:minus-bold" width={20} />
                  </IconButton>

                  <Typography variant="h6" sx={{ minWidth: 32, textAlign: 'center' }}>
                    {quantity}
                  </Typography>

                  <IconButton
                    onClick={handleIncreaseQuantity}
                    disabled={isOutOfStock || quantity >= maxQuantity}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Iconify icon="solar:plus-bold" width={20} />
                  </IconButton>

                  <Typography variant="body2" sx={{ color: 'text.secondary', ml: 2 }}>
                    Disponible: {activeVariant?.stock ?? 0} piezas
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <Button
                size="large"
                variant="contained"
                color="warning"
                fullWidth
                onClick={handleBuyNow}
                disabled={isOutOfStock || addingToCart}
                sx={{
                  borderRadius: 10,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {addingToCart ? (
                  <Box
                    component="span"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
                  >
                    <CircularProgress size={18} color="inherit" />
                    Procesando...
                  </Box>
                ) : (
                  'Comprar ahora'
                )}
              </Button>

              <Button
                size="large"
                variant="outlined"
                fullWidth
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                sx={{
                  borderRadius: 10,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {addingToCart ? (
                  <Box
                    component="span"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
                  >
                    <CircularProgress size={18} color="inherit" />
                    Agregando...
                  </Box>
                ) : (
                  'Agregar al carrito'
                )}
              </Button>
            </Stack>

            <Divider />

            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Lo que obtienes
                </Typography>

                <Stack spacing={1}>
                  {accessory.highlights.map((highlight) => (
                    <Stack key={highlight} direction="row" spacing={1.5} alignItems="flex-start">
                      <Iconify icon="solar:check-circle-bold" width={22} color="#9C8B7A" />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {highlight}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Compatibilidad
                </Typography>

                <Stack spacing={1}>
                  {accessory.compatibility.map((item) => (
                    <Typography key={item} variant="body2" sx={{ color: 'text.secondary' }}>
                      • {item}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
