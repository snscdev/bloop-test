'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { ProductVariant } from 'src/store/product-checkout-store';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { varFade, AnimateText, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  productName: string;
  backgroundImage: string;
  variants: ProductVariant[];
  sx?: SxProps<Theme>;
};

export function ProductHeroBanner({ productName, backgroundImage, variants, sx }: Props) {
  return (
    <MotionContainer
      sx={{
        gap: 3,
        width: 1,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        component={m.div}
        variants={varFade('in')}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        sx={[
          {
            position: 'relative',
            height: { xs: 129, md: 309 },
            width: '100%',
            mt: { xs: 6, md: 0 },
            borderRadius: '40px',
            background: 'linear-gradient(172deg, #F9F9F9 41.52%, rgba(187, 187, 187, 0.56) 91.01%)',
            overflow: 'hidden',
            mb: { xs: 2, md: 6 },
            cursor: 'pointer',
            '&:hover .background-image': {
              transform: 'translate(-50%, -50%) scale(1.05)',
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {/* Background Image */}
        {backgroundImage && (
          <Box
            component="img"
            src={backgroundImage}
            alt="background"
            className="background-image"
            sx={{
              position: 'absolute',
              width: { xs: '100%', md: '80%' },
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '100%',
              objectFit: { xs: 'cover', md: 'cover' },
              zIndex: 0,
              transition: 'transform 0.4s ease-in-out',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}

        {/* Gradient Blur Overlay (de izquierda a derecha) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(4px)',
            maskImage:
              'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage:
              'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 100%)',
            zIndex: 1,
            borderRadius: '40px',
          }}
        />

        {/* Content Container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, md: 6 },
          }}
        >
          {/* Center Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              ml: { xs: 0, md: 8 },
            }}
          >
            {/* Product Title */}
            <AnimateText
              component="h1"
              textContent={productName}
              variants={varFade('in')}
              repeatDelayMs={600}
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: { xs: '36px', md: '80px' },
                fontWeight: 500,
                lineHeight: { xs: '44px', md: '88px' },
                textAlign: 'center',
                position: 'relative',
                color: '#FFF',
                overflow: 'visible',
              }}
            />

            {/* Variant Chips */}
            <Box
              component={m.div}
              variants={varFade('in', { transitionIn: { delay: 1.2 } })}
              sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {variants.map((variant) => (
                <Chip
                  key={variant.id}
                  label={variant.label}
                  sx={{
                    height: 16,
                    px: '10px',
                    py: '0px',
                    borderRadius: '16px',
                    background: 'transparent',
                    border: '1px solid #FFF',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#FFF',
                    textTransform: 'capitalize',
                    letterSpacing: '0.05em',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </MotionContainer>
  );
}
