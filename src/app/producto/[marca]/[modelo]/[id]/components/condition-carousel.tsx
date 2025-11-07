'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

type ConditionCarouselProps = {
  images: string[];
  conditionName: string;
};

export function ConditionCarousel({ images, conditionName }: ConditionCarouselProps) {
  const carousel = useCarousel({
    loop: true,
    slideSpacing: '0px',
  });

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          width: '100%',
          height: { xs: 300, md: 515 },
        }}
      >
        <Carousel carousel={carousel}>
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                width: '100%',
                height: { xs: 300, md: 620 },
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`${conditionName} - imagen ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Carousel>

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
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
          position: 'absolute',
          bottom: 15,
          left: 0,
          right: 0,
        }}
      >
        <CarouselDotButtons
          variant="rounded"
          color="white"
          scrollSnaps={carousel.dots.scrollSnaps}
          selectedIndex={carousel.dots.selectedIndex}
          onClickDot={carousel.dots.onClickDot}
        />
      </Box>
    </Box>
  );
}
