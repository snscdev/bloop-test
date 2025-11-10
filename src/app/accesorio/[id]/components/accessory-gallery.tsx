'use client';

import type { AccessoryImage } from 'src/types/accessory';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type AccessoryGalleryProps = {
  images: AccessoryImage[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export function AccessoryGallery({ images, activeIndex, onChange }: AccessoryGalleryProps) {
  const total = images.length;
  const hasMultipleImages = total > 1;

  const handlePrev = () => {
    if (!hasMultipleImages) {
      return;
    }
    const nextIndex = activeIndex === 0 ? total - 1 : activeIndex - 1;
    onChange(nextIndex);
  };

  const handleNext = () => {
    if (!hasMultipleImages) {
      return;
    }
    const nextIndex = activeIndex === total - 1 ? 0 : activeIndex + 1;
    onChange(nextIndex);
  };

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 5,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: '0 20px 40px rgba(50, 50, 71, 0.05)',
          pt: { xs: '75%', md: '80%' },
        }}
      >
        {activeImage && (
          <Box
            component="img"
            src={activeImage.url}
            alt={activeImage.alt}
            sx={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              position: 'absolute',
              objectFit: 'cover',
            }}
          />
        )}

        {hasMultipleImages && (
          <>
            <IconButton
              size="large"
              onClick={handlePrev}
              sx={{
                left: 16,
                top: '50%',
                position: 'absolute',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.9)',
                boxShadow: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
              }}
            >
              <Iconify icon="solar:alt-arrow-left-bold" width={22} />
            </IconButton>

            <IconButton
              size="large"
              onClick={handleNext}
              sx={{
                right: 16,
                top: '50%',
                position: 'absolute',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.9)',
                boxShadow: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
              }}
            >
              <Iconify icon="solar:alt-arrow-right-bold" width={22} />
            </IconButton>
          </>
        )}
      </Box>

      {hasMultipleImages && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ flexWrap: 'wrap', rowGap: 1.5 }}
        >
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <ButtonBase
                key={image.id ?? image.url}
                onClick={() => onChange(index)}
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: isActive ? 'primary.main' : alpha('#C9C9C9', 0.6),
                  position: 'relative',
                  transition: (theme) => theme.transitions.create(['transform', 'border-color']),
                  boxShadow: isActive ? '0px 12px 24px rgba(125, 125, 125, 0.2)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'none',
                }}
              >
                <Box
                  component="img"
                  src={image.url}
                  alt={image.alt}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </ButtonBase>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
