'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CardActionArea from '@mui/material/CardActionArea';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { ProductCard } from './product-card';
import { productCardItems } from './product-cards-config';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export function ShopMenuDropdown({ sx }: Props) {
  const router = useRouter();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    handleClose();
  };

  const open = Boolean(anchorEl);

  // Cerrar el menú cuando cambie de desktop a mobile
  useEffect(() => {
    if (isMobile && open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const intercambioItem = {
    title: 'Intercambio',
    subtitle: 'Ten una oferta de intercambio en solo 2 minutos',
    path: '/intercambio',
    bgColor: '#F4F3F2',
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleClick}
        endIcon={
          <Iconify
            icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            width={16}
          />
        }
        sx={[
          {
            color: '#7F746A',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '20px',
            letterSpacing: '-0.14px',
            mr: 5,
            textTransform: 'none',
            gap: 0.5,
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#7F746A',
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        Comprar
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 1280,
              height: 226,
              padding: '19px 18px',
              mt: 1.5,
              borderRadius: '34px',
              background: '#F8F8F8',
              boxShadow: '0 12px 19px 0 rgba(0, 0, 0, 0.07)',
              left: '50% !important',
              transform: 'translateX(-50%) !important',
            },
          },
        }}
      >
        <Grid container spacing={2.5}>
          {/* Card de Intercambio */}
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex' }}>
            <Card
              sx={(theme) => ({
                width: 1,
                height: 180,
                borderRadius: '26px',
                overflow: 'hidden',
                position: 'relative',
                background: intercambioItem.bgColor,
                boxShadow: 'none',
                '&::before': {
                  ...theme.mixins.borderGradient({
                    padding: '1px',
                    color: `linear-gradient(to top left, #FFFFFF,#7F746A)`,
                  }),
                },
              })}
            >
              <CardActionArea
                onClick={() => handleNavigate(intercambioItem.path)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 0,
                  position: 'relative',
                  '&:hover': {
                    '& .icon-intercambio-desktop': {
                      transform: 'scale(1.15)',
                    },
                    '& .flecha-intercambio-desktop': {
                      transform: 'scale(1.1) translateX(4px)',
                    },
                  },
                }}
              >
                {/* Card de Intercambio (pequeña, vertical) */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '100%',
                    p: 2.25,
                    position: 'relative',
                  }}
                >
                  {/* SVG de líneas en esquina superior derecha */}
                  <Box
                    component="img"
                    src="/assets/background/cards/intercabioDesktopLines.svg"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 90,
                      height: 93,
                      pointerEvents: 'none',
                      zIndex: 0,
                    }}
                  />

                  {/* Ícono de intercambio en esquina superior izquierda */}
                  <Box
                    component="img"
                    src="/assets/background/cards/VectorIntercabio.svg"
                    className="icon-intercambio-desktop"
                    sx={{
                      position: 'absolute',
                      top: 18,
                      left: 18,
                      width: 30,
                      height: 24,
                      pointerEvents: 'none',
                      zIndex: 1,
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />

                  {/* Flecha en esquina inferior derecha */}
                  <Box
                    component="img"
                    src="/assets/background/cards/flechaIntercabio.svg"
                    className="flecha-intercambio-desktop"
                    sx={{
                      position: 'absolute',
                      bottom: 18,
                      right: 18,
                      width: 18,
                      height: 14,
                      pointerEvents: 'none',
                      zIndex: 1,
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />

                  {/* Texto en la parte inferior */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 1,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#7F746A',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        maxWidth: '80%',
                        lineHeight: '20px',
                        letterSpacing: '-0.14px',
                        flex: 1,
                      }}
                    >
                      {intercambioItem.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Cards de productos usando componente reutilizable */}
          {productCardItems.map((item) => (
            <Grid key={item.path} size={{ xs: 12, sm: 3.3 }} sx={{ display: 'flex' }}>
              <ProductCard item={item} onNavigate={handleNavigate} />
            </Grid>
          ))}
        </Grid>
      </Popover>
    </>
  );
}
