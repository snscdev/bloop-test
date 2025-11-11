'use client';

import type { ColorOption } from 'src/store/product-checkout-store';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';

import { AccessoryColorCircle } from './accessory-color-circle';

// ----------------------------------------------------------------------

type AccessoryGalleryProps = {
  images: string[];
  availableColors: ColorOption[];
  selectedColorId: string;
  onColorSelect: (colorId: string) => void;
  isLoaded?: boolean;
};

export function AccessoryGallery({
  images,
  availableColors,
  selectedColorId,
  onColorSelect,
  isLoaded = true,
}: AccessoryGalleryProps) {
  const carousel = useCarousel({
    loop: true,
    slidesToShow: 1,
    slideSpacing: '0px',
  });

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Carrusel de imágenes */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '15px',
          overflow: 'hidden',
          width: '100%',
          height: { xs: 300, md: 380 },
        }}
      >
        <Carousel carousel={carousel}>
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                width: '100%',
                height: { xs: 300, md: 380 },
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`Imagen ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isLoaded ? 'none' : 'grayscale(100%) brightness(1.1)',
                }}
              />
            </Box>
          ))}
        </Carousel>

        {/* Colores flotantes - Esquina superior izquierda */}
        {availableColors.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 2,
              display: 'flex',
              gap: 1,
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              padding: 1,
              borderRadius: 2,
            }}
          >
            {availableColors.map((color) => (
              <AccessoryColorCircle
                key={color.id}
                color={color}
                isSelected={selectedColorId === color.id}
                onClick={() => onColorSelect(color.id)}
              />
            ))}
          </Box>
        )}

        {/* Botón Anterior (izquierda) */}
        <IconButton
          onClick={carousel.arrows.onClickPrev}
          disabled={carousel.arrows.disablePrev}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 48,
            height: 48,
            bgcolor: 'white',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'white',
              boxShadow: 4,
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

        {/* Botón Siguiente (derecha) */}
        <IconButton
          onClick={carousel.arrows.onClickNext}
          disabled={carousel.arrows.disableNext}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 48,
            height: 48,
            bgcolor: 'white',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'white',
              boxShadow: 4,
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

      {/* Dots indicadores abajo */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}
      >
        <CarouselDotButtons
          variant="rounded"
          scrollSnaps={carousel.dots.scrollSnaps}
          selectedIndex={carousel.dots.selectedIndex}
          onClickDot={carousel.dots.onClickDot}
        />
      </Box>
    </Box>
  );
}
