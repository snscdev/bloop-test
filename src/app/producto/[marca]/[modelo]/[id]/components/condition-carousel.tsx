'use client';

import Box from '@mui/material/Box';

import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

type ConditionCarouselProps = {
  images: string[];
  conditionName: string;
};

export function ConditionCarousel({ images, conditionName }: ConditionCarouselProps) {
  const carousel = useCarousel({
    loop: true,
    slideSpacing: '20px',
  });

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Carousel carousel={carousel}>
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              width: '100%',
              height: { xs: 300, sm: 400, md: 500 },
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

      <CarouselArrowFloatButtons
        onClickPrev={carousel.arrows.onClickPrev}
        onClickNext={carousel.arrows.onClickNext}
        disablePrev={carousel.arrows.disablePrev}
        disableNext={carousel.arrows.disableNext}
        slotProps={{
          prevBtn: {
            sx: {
              left: 16,
              bgcolor: 'background.paper',
              opacity: 0.8,
              '&:hover': {
                opacity: 1,
                bgcolor: 'background.paper',
              },
            },
          },
          nextBtn: {
            sx: {
              right: 16,
              bgcolor: 'background.paper',
              opacity: 0.8,
              '&:hover': {
                opacity: 1,
                bgcolor: 'background.paper',
              },
            },
          },
        }}
      />
    </Box>
  );
}
