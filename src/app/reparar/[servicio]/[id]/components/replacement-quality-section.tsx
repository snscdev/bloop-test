'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { SelectionCircle } from 'src/app/producto/[marca]/[modelo]/[id]/components/selection-circle';

import { Carousel, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

export type ReplacementOption = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  benefits: string[];
  isRecommended?: boolean;
  availableFor?: {
    brands: string[];
    models: string[];
  };
};

type ReplacementQualitySectionProps = {
  options: ReplacementOption[];
  title?: string;
  subtitle?: string;
  selectedOptionId?: string;
  onSelectOption?: (id: string) => void;
};

export function ReplacementQualitySection({
  options,
  title = 'Elige la calidad del repuesto',
  subtitle = 'Selecciona la opción que mejor se adapte a tus necesidades',
  selectedOptionId,
  onSelectOption,
}: ReplacementQualitySectionProps) {
  const [internalSelectedId, setInternalSelectedId] = useState(options[0]?.id ?? '');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selectedId = selectedOptionId ?? internalSelectedId;

  const carousel = useCarousel({
    loop: false,
    align: 'center',
    slidesToShow: {
      xs: 1,
      sm: 1,
      md: 3,
    },
    slideSpacing: '32px',
  });

  const formatPrice = useMemo(
    () => (value: number) =>
      new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
      }).format(value),
    []
  );

  return (
    <Box
      sx={{
        py: { xs: 6, md: 4 },
        px: { xs: 2, md: 4 },
        backgroundColor: '#F8F8F8',
      }}
    >
      {/* Encabezado */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mb: 6 }}>
        <Box
          sx={{
            borderRadius: '10px',
            display: 'flex',
            width: 'fit-content',
            padding: '10px 37px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            background: '#FFFFFF',
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
            Repuesto
          </Typography>
        </Box>

        <Typography
          sx={{
            textAlign: 'center',
            fontSize: { xs: '32px', md: '48px' },
            fontWeight: 500,
            letterSpacing: '-0.96px',
            color: '#A49A8F',
          }}
        >
          <span style={{ color: '#7F746A' }}>Elige la calidad </span> del repuesto
        </Typography>
      </Box>

      {/* Carrusel */}
      {options.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <Carousel carousel={carousel}>
            {options.map((option) => {
              const isSelected = selectedId === option.id;
              const isHovered = hoveredId === option.id;

              return (
                <Box
                  key={option.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    px: { xs: 1.5, md: 0 },
                  }}
                >
                  {/* Wrapper con borde gradiente */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: { xs: 280, sm: 320 },
                      height: { xs: 420, sm: 481 },
                      borderRadius: '34px',
                      padding: isSelected || isHovered ? '2px' : '0px',
                      background:
                        isSelected || isHovered
                          ? 'linear-gradient(322deg, rgba(208, 203, 194, 0.26) -1.74%, rgba(127, 116, 106, 0.48) 63.01%)'
                          : 'transparent',
                      transition: 'all 0.3s',
                      mx: 'auto',
                    }}
                  >
                    <Card
                      onClick={() => {
                        if (onSelectOption) {
                          onSelectOption(option.id);
                        } else {
                          setInternalSelectedId(option.id);
                        }
                      }}
                      onMouseEnter={() => setHoveredId(option.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      sx={{
                        cursor: 'pointer',
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        borderRadius: '34px',
                        background: '#FFF',
                        overflow: 'hidden',
                        border: 'none',
                        transition: 'all 0.3s',
                        '&:hover': {
                          [`& .replacement-image-${option.id}`]: {
                            transform: 'translateX(-50%) scale(1.09)',
                          },
                          '& .blur-overlay': {
                            backdropFilter: 'blur(0px)',
                            WebkitBackdropFilter: 'blur(0px)',
                          },
                        },
                      }}
                    >
                      {/* Imagen de fondo */}
                      <Box
                        component="img"
                        src={option.image}
                        alt={option.name}
                        className={`replacement-image-${option.id}`}
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: '100%',
                          height: '70%',
                          objectFit: 'contain',
                          transform: 'translateX(-50%)',
                          zIndex: 0,
                          transition: 'transform 0.3s ease-in-out',
                        }}
                      />

                      {/* Overlay con blur gradual */}
                      <Box
                        className="blur-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '34px',
                          pointerEvents: 'none',
                          zIndex: 0.5,
                          background: 'transparent',
                          maskImage: 'linear-gradient(to top, black 0%, transparent 60%)',
                          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 60%)',
                          backdropFilter: 'blur(30px)',
                          WebkitBackdropFilter: 'blur(30px)',
                          transition:
                            'backdrop-filter 0.4s ease-in-out, -webkit-backdrop-filter 0.4s ease-in-out',
                        }}
                      />

                      {/* Círculo de selección superior derecha */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 24,
                          right: 24,
                          zIndex: 3,
                        }}
                      >
                        <SelectionCircle
                          state={isSelected ? 'selected' : isHovered ? 'hover' : 'default'}
                          color="#7F746A"
                        />
                      </Box>

                      {/* Badge Recomendado superior izquierda */}
                      {option.isRecommended && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 24,
                            left: 24,
                            zIndex: 3,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '999px',
                            backgroundColor: '#F3F9FF',
                            color: '#5A7B9A',
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: 0.3,
                            textTransform: 'uppercase',
                          }}
                        >
                          Recomendado
                        </Box>
                      )}

                      {/* Nombre y Precio - Parte superior */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: option.isRecommended ? 64 : 24,
                          left: 24,
                          zIndex: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#7F746A',
                            fontSize: '24px',
                            fontWeight: 600,
                            lineHeight: '31px',
                            mb: 0.5,
                          }}
                        >
                          {option.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#7F746A',
                            fontSize: '24px',
                            fontWeight: 500,
                            lineHeight: '32px',
                          }}
                        >
                          {formatPrice(option.price)}
                        </Typography>
                      </Box>

                      {/* Chips de beneficios - Esquina inferior izquierda */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 24,
                          left: 24,
                          zIndex: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          alignItems: 'flex-start',
                        }}
                      >
                        {option.benefits.slice(0, 2).map((benefit) => (
                          <Chip
                            key={benefit}
                            label={benefit}
                            sx={{
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(224, 224, 224, 0.5)',
                              '& .MuiChip-label': {
                                px: 1,
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#7F746A',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Card>
                  </Box>
                </Box>
              );
            })}
          </Carousel>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: '#7C6F63',
              fontSize: 20,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            No hay repuestos disponibles
          </Typography>
          <Typography
            sx={{
              color: '#9C9084',
              fontSize: 16,
              textAlign: 'center',
              maxWidth: 400,
              lineHeight: 1.5,
            }}
          >
            Selecciona una marca y modelo de dispositivo para ver las opciones de repuesto
            disponibles.
          </Typography>
        </Box>
      )}

      {/* Navegación */}
      {options.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <IconButton
            onClick={carousel.arrows.onClickPrev}
            disabled={carousel.arrows.disablePrev}
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#FFFFFF',
              border: '1px solid #E0E0E0',
              '&:hover': {
                bgcolor: '#FFFFFF',
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
              sx={{ transform: 'rotate(-180deg)' }}
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

          <IconButton
            onClick={carousel.arrows.onClickNext}
            disabled={carousel.arrows.disableNext}
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#FFFFFF',
              border: '1px solid #E0E0E0',
              '&:hover': {
                bgcolor: '#FFFFFF',
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
      )}
    </Box>
  );
}
