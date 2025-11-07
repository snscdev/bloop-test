'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { SelectionCircle } from './selection-circle';

// ----------------------------------------------------------------------

type ModelCardProps = {
  model: {
    id: string;
    name: string;
    image: string;
    price: number;
    details: {
      screenSize: string;
      camera: string;
      otherDetail?: string;
    };
  };
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  formatPrice: (price: number) => string;
};

export function ModelCard({
  model,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  formatPrice,
}: ModelCardProps) {
  const [imageSrc, setImageSrc] = useState(model.image || '/assets/background/cards/modelo.png');

  const handleImageError = () => {
    setImageSrc('/assets/background/cards/modelo.png');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: 350, sm: 400 },
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
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
            [`& .model-image-${model.id}`]: {
              transform: 'translateX(-50%) scale(1.09)',
            },
            '& .blur-overlay': {
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            },
          },
        }}
      >
        {/* Imagen de fondo */}
        <Box
          component="img"
          src={imageSrc}
          alt={model.name}
          className={`model-image-${model.id}`}
          onError={handleImageError}
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
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(0px)',
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

        {/* Nombre y Precio - Esquina superior izquierda */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
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
            {model.name}
          </Typography>
          <Typography
            sx={{
              color: '#7F746A',
              fontSize: '24px',
              fontWeight: 500,
              lineHeight: '32px',
            }}
          >
            {formatPrice(model.price)}
          </Typography>
        </Box>

        {/* Chips de información - Esquina inferior derecha */}
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
          {model.details.screenSize && (
            <Chip
              icon={<Iconify icon="solar:smartphone-outline" width={18} />}
              label={model.details.screenSize}
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
          )}
          {model.details.camera && (
            <Chip
              icon={<Iconify icon="solar:camera-outline" width={18} />}
              label={model.details.camera}
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
          )}
        </Box>
      </Card>
    </Box>
  );
}
