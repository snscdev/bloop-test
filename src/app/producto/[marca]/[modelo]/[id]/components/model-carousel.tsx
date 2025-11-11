'use client';

import type { ProductModel } from 'src/store/product-checkout-store';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Carousel, useCarousel } from 'src/components/carousel';

import { ModelCard } from './model-card';

// ----------------------------------------------------------------------

type ModelCarouselProps = {
  models: ProductModel[];
  selectedModelId: string;
  hoveredModelId: string | null;
  onSelectModel: (id: string) => void;
  onHoverModel: (id: string | null) => void;
  formatPrice: (price: number) => string;
  isLoaded: boolean;
};

export function ModelCarousel({
  models,
  selectedModelId,
  hoveredModelId,
  onSelectModel,
  onHoverModel,
  formatPrice,
  isLoaded,
}: ModelCarouselProps) {
  const carousel = useCarousel({
    loop: false,
    align: 'center',
    slidesToShow: {
      xs: 1,
      sm: 1,
      md: 3,
    },
    slideSpacing: '40px',
  });

  return (
    <Box>
      {/* Carrusel */}
      <Box sx={{ mb: 4 }}>
        <Carousel carousel={carousel}>
          {models.map((model) => (
            <Box
              key={model.id}
              sx={{
                height: '100%',
                pointerEvents: isLoaded ? 'auto' : 'none',
                opacity: isLoaded ? 1 : 0.5,
                display: 'flex',
                justifyContent: 'center',
                px: { xs: 2, md: 0 },
              }}
            >
              <ModelCard
                model={model}
                isSelected={selectedModelId === model.id}
                isHovered={hoveredModelId === model.id}
                onClick={() => onSelectModel(model.id)}
                onMouseEnter={() => onHoverModel(model.id)}
                onMouseLeave={() => onHoverModel(null)}
                formatPrice={formatPrice}
                isLoaded={isLoaded}
              />
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* Botones de navegación - Debajo del carrusel */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        {/* Botón Anterior */}
        <IconButton
          onClick={carousel.arrows.onClickPrev}
          disabled={carousel.arrows.disablePrev}
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'white',
            border: '1px solid #E0E0E0',
            '&:hover': {
              bgcolor: 'white',
              borderColor: '#7F746A',
            },
            '&:disabled': {
              opacity: 0.3,
            },
          }}
        >
          <Box
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            width="16px"
            height="13px"
            viewBox="0 0 16 13"
            fill="none"
            sx={{
              transform: 'rotate(-180deg)',
            }}
          >
            <path
              d="M0.750006 6.08333L14.9722 6.08333M14.9722 6.08333L9.6389 11.4167M14.9722 6.08333L9.6389 0.75"
              stroke="#7F746A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Box>
        </IconButton>

        {/* Botón Siguiente */}
        <IconButton
          onClick={carousel.arrows.onClickNext}
          disabled={carousel.arrows.disableNext}
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'white',
            border: '1px solid #E0E0E0',
            '&:hover': {
              bgcolor: 'white',
              borderColor: '#7F746A',
            },
            '&:disabled': {
              opacity: 0.3,
            },
          }}
        >
          <Box
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            width="16px"
            height="13px"
            viewBox="0 0 16 13"
            fill="none"
          >
            <path
              d="M0.750006 6.08333L14.9722 6.08333M14.9722 6.08333L9.6389 11.4167M14.9722 6.08333L9.6389 0.75"
              stroke="#7F746A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Box>
        </IconButton>
      </Box>
    </Box>
  );
}
