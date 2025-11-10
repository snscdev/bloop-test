'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

// ----------------------------------------------------------------------

export type ProductCardItem = {
  title: string;
  path: string;
  bgGradient: string;
  image: string;
  imagePosition?: 'top' | 'bottom';
  iconSvg: string;
};

type Props = {
  item: ProductCardItem;
  onNavigate: (path: string) => void;
  sx?: SxProps<Theme>;
};

export function ProductCard({ item, onNavigate, sx }: Props) {
  return (
    <Card
      sx={[
        {
          borderRadius: '26px',
          overflow: 'hidden',
          border: 'none',
          width: 1,
          position: 'relative',
          background: item.bgGradient,
          '&:hover': {
            [`& .product-image-${item.title.toLowerCase()}`]: {
              transform: 'scale(1.09)',
            },
            [`& .product-icon-${item.title.toLowerCase()}`]: {
              transform: 'scale(1.1)',
            },
            '& .blur-overlay': {
              backdropFilter: 'blur(0px)',
              WebkitBackdropFilter: 'blur(0px)',
            },
            '& .product-button': {
              opacity: 1,
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Imagen del producto */}
      <Box
        component="img"
        src={item.image}
        className={`product-image-${item.title.toLowerCase()}`}
        sx={{
          position: 'absolute',
          ...(item.imagePosition === 'bottom' ? { bottom: 0, right: 0 } : { top: 0, right: 0 }),
          height: '80%',
          width: 'auto',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'transform 0.3s ease-in-out',
          transformOrigin: item.imagePosition === 'bottom' ? 'bottom right' : 'top right',
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
          borderRadius: '26px',
          pointerEvents: 'none',
          zIndex: 0.5,
          background: 'transparent',
          maskImage: 'linear-gradient(to top, black 0%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 60%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          transition: 'backdrop-filter 0.4s ease-in-out, -webkit-backdrop-filter 0.4s ease-in-out',
        }}
      />

      <CardActionArea
        onClick={() => onNavigate(item.path)}
        sx={{
          height: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: 2,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            position: 'relative',
            zIndex: 1,
            justifyContent: 'flex-end',
          }}
        >
          {/* Ícono SVG en esquina superior izquierda */}
          {item.iconSvg && (
            <Box
              component="img"
              src={item.iconSvg}
              className={`product-icon-${item.title.toLowerCase()}`}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 'auto',
                height: 'auto',
                pointerEvents: 'none',
                zIndex: 2,
                transform: 'scale(0.85)',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
          )}

          {/* Botón con el nombre del producto */}
          <Box
            className="product-button"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 18px',
              borderRadius: '27px',
              opacity: 0.4,
              background: 'rgba(255, 255, 255, 0.20)',
              backdropFilter: 'blur(15px)',
              transition: 'opacity 0.3s ease-in-out',
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                color: '#FFF',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: '20px',
                letterSpacing: '-0.14px',
              }}
            >
              {item.title}
            </Typography>
            <Box
              component="svg"
              width="16px"
              height="16px"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
