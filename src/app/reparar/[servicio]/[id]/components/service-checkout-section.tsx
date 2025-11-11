'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

type ServiceCheckoutSectionProps = {
  title: string;
  serviceName: string;
  tags: { label: string; icon?: string }[];
  gallery: string[];
  guaranteeLabel: string;
  totalPrice: number;
  onBuyNow?: () => Promise<void> | void;
  onAddToCart?: () => Promise<void> | void;
  isBuying?: boolean;
  isAdding?: boolean;
  disabled?: boolean;
};

export function ServiceCheckoutSection({
  title,
  serviceName,
  tags,
  gallery,
  guaranteeLabel,
  totalPrice,
  onBuyNow,
  onAddToCart,
  isBuying,
  isAdding,
  disabled,
}: ServiceCheckoutSectionProps) {
  const carousel = useCarousel({
    loop: false,
    slidesToShow: 1,
    slideSpacing: '0px',
  });

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
      }).format(totalPrice),
    [totalPrice]
  );

  const handleBuy = () => {
    if (disabled || isBuying) {
      return;
    }
    onBuyNow?.();
  };

  const handleAddToCart = () => {
    if (disabled || isAdding) {
      return;
    }
    onAddToCart?.();
  };

  return (
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
        Tu servicio técnico está listo
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
          <Box
            sx={{
              position: 'relative',
              borderRadius: '40px',
              overflow: 'hidden',
              p: { xs: 2.5, md: 3.5 },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ position: 'relative', borderRadius: '32px', overflow: 'hidden' }}>
              <Carousel carousel={carousel}>
                {gallery.map((image, index) => (
                  <Box
                    key={image}
                    sx={{
                      width: '100%',
                      height: { xs: 260, md: 460 },
                      backgroundColor: '#F5F3EF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`${serviceName} ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </Box>
                ))}
              </Carousel>

              <IconButton
                onClick={carousel.arrows.onClickPrev}
                disabled={carousel.arrows.disablePrev}
                sx={{
                  position: 'absolute',
                  left: { xs: 10, md: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 48,
                  height: 48,
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(127, 116, 106, 0.2)',
                  color: '#7C6F63',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    borderColor: '#7C6F63',
                  },
                  '&:disabled': {
                    opacity: 0.3,
                  },
                }}
              >
                <Iconify icon="solar:alt-arrow-left-linear" width={22} />
              </IconButton>

              <IconButton
                onClick={carousel.arrows.onClickNext}
                disabled={carousel.arrows.disableNext}
                sx={{
                  position: 'absolute',
                  right: { xs: 10, md: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 48,
                  height: 48,
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(127, 116, 106, 0.2)',
                  color: '#7C6F63',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    borderColor: '#7C6F63',
                  },
                  '&:disabled': {
                    opacity: 0.3,
                  },
                }}
              >
                <Iconify icon="solar:alt-arrow-right-linear" width={22} />
              </IconButton>

              <Box
                sx={{
                  position: 'absolute',
                  left: 20,
                  bottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(10px)',
                  color: '#7C6F63',
                  fontWeight: 600,
                }}
              >
                <Iconify icon="solar:shield-check-linear" width={18} />
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{guaranteeLabel}</Typography>
              </Box>
            </Box>

            <CarouselDotButtons
              scrollSnaps={carousel.dots.scrollSnaps}
              selectedIndex={carousel.dots.selectedIndex}
              onClickDot={carousel.dots.onClickDot}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                '& .dot': {
                  width: 32,
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: 'rgba(127, 116, 106, 0.25)',
                },
                '& .dot-active': {
                  backgroundColor: '#7C6F63',
                },
              }}
            />
          </Box>
        </Box>

        {/* Resumen derecha en desktop, abajo en mobile */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Box
            sx={{
              borderRadius: '21px',
              backgroundColor: '#FFFFFF',
              padding: '20px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography
                sx={{
                  color: '#7C6F63',
                  fontSize: { xs: '20px', md: '24px' },
                  fontWeight: 600,
                }}
              >
                {serviceName}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {tags.map((tag) => (
                  <Box
                    key={tag.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: '#F8F8F8',
                      borderRadius: '10px',
                      padding: '6px 12px',
                    }}
                  >
                    {tag.icon === 'pantalla' ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_1965_21954)">
                          <path
                            d="M9.9165 15.5832H4.8165M4.8165 15.5832C3.62639 15.5832 3.03134 15.5832 2.57677 15.3516C2.17693 15.1478 1.85185 14.8227 1.64812 14.4229C1.4165 13.9683 1.4165 13.3733 1.4165 12.1832M4.8165 15.5832H5.09984C6.28995 15.5832 6.885 15.5832 7.33957 15.3516C7.73941 15.1478 8.06449 14.8227 8.26823 14.4229C8.49984 13.9683 8.49984 13.3733 8.49984 12.1832V11.8998C8.49984 10.7097 8.49984 10.1147 8.26823 9.66011C8.06449 9.26026 7.73941 8.93518 7.33957 8.73145C6.885 8.49984 6.28995 8.49984 5.09984 8.49984H4.8165C3.62639 8.49984 3.03134 8.49984 2.57677 8.73145C2.17693 8.93518 1.85185 9.26026 1.64812 9.66011C1.4165 10.1147 1.4165 10.7097 1.4165 11.8998V12.1832M1.4165 12.1832V7.08317M7.08317 1.4165H9.9165M15.5832 7.08317V9.9165M12.7498 15.5832C13.4086 15.5832 13.7379 15.5832 14.0082 15.5108C14.7415 15.3143 15.3143 14.7415 15.5108 14.0082C15.5832 13.7379 15.5832 13.4086 15.5832 12.7498M15.5832 4.24984C15.5832 3.59111 15.5832 3.26174 15.5108 2.99151C15.3143 2.25819 14.7415 1.6854 14.0082 1.48891C13.7379 1.4165 13.4086 1.4165 12.7498 1.4165M4.24984 1.4165C3.59111 1.4165 3.26174 1.4165 2.99151 1.48891C2.25819 1.6854 1.6854 2.25819 1.48891 2.99151C1.4165 3.26174 1.4165 3.59111 1.4165 4.24984"
                            stroke="#7F746A"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1965_21954">
                            <rect width="17" height="17" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                      >
                        <path
                          d="M7.875 10.5L9.625 12.25L13.5625 8.3125M8.05166 18.0258C8.33844 17.9878 8.62814 18.0656 8.8566 18.2416L9.90942 19.0495C10.2575 19.3168 10.7416 19.3168 11.0886 19.0495L12.1813 18.2105C12.3855 18.054 12.6431 17.9849 12.8978 18.019L14.2646 18.1988C14.6992 18.2562 15.1182 18.0141 15.2863 17.6087L15.8123 16.3371C15.9105 16.0989 16.099 15.9103 16.3372 15.8121L17.6088 15.2861C18.0142 15.1189 18.2562 14.6989 18.1989 14.2643L18.0258 12.947C17.9879 12.6602 18.0657 12.3705 18.2416 12.142L19.0495 11.0892C19.3168 10.7411 19.3168 10.257 19.0495 9.90988L18.2105 8.81713C18.054 8.61297 17.985 8.35534 18.019 8.10062L18.1989 6.73372C18.2562 6.29915 18.0142 5.88013 17.6088 5.71194L16.3372 5.18598C16.099 5.08779 15.9105 4.89918 15.8123 4.661L15.2863 3.38936C15.1191 2.98396 14.6992 2.74188 14.2646 2.79924L12.8978 2.9791C12.6431 3.0141 12.3855 2.94507 12.1823 2.78952L11.0896 1.95052C10.7416 1.68316 10.2575 1.68316 9.9104 1.95052L8.81771 2.78952C8.61356 2.94507 8.35594 3.0141 8.10124 2.98104L6.73441 2.80119C6.29986 2.74383 5.88087 2.9859 5.71269 3.39131L5.18773 4.66294C5.08858 4.90016 4.89998 5.08876 4.66278 5.18793L3.39122 5.71291C2.98583 5.8811 2.74377 6.30012 2.80113 6.73469L2.98097 8.10159C3.01403 8.35631 2.945 8.61394 2.78946 8.81713L1.9505 9.90988C1.68317 10.2579 1.68317 10.7421 1.9505 11.0892L2.78946 12.1819C2.94598 12.3861 3.015 12.6437 2.98097 12.8984L2.80113 14.2653C2.74377 14.6999 2.98583 15.1189 3.39122 15.2871L4.66278 15.813C4.90095 15.9112 5.08955 16.0998 5.18773 16.338L5.71366 17.6097C5.88087 18.0151 6.30084 18.2571 6.73538 18.1998L8.05166 18.0258Z"
                          stroke="#7F746A"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#7F746A' }}>
                      {tag.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>

            <Typography
              sx={{
                fontSize: { xs: '32px', md: '40px' },
                fontWeight: 600,
                color: '#7C6F63',
              }}
            >
              {formattedPrice}
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="contained"
                onClick={handleBuy}
                disabled={disabled || isBuying}
                sx={{
                  height: 56,
                  borderRadius: '999px',
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: '#876F5C',
                  fontSize: 16,
                  '&:hover': {
                    backgroundColor: '#765F4E',
                  },
                }}
              >
                {isBuying ? 'Procesando...' : 'Comprar ahora'}
              </Button>

              <Button
                variant="outlined"
                onClick={handleAddToCart}
                disabled={disabled || isAdding}
                sx={{
                  height: 56,
                  borderRadius: '999px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: 16,
                  borderColor: '#7C6F63',
                  color: '#7C6F63',
                  '&:hover': {
                    borderColor: '#7C6F63',
                    backgroundColor: 'rgba(124, 111, 99, 0.08)',
                  },
                }}
              >
                {isAdding ? 'Agregando...' : 'Agregar al carrito'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
