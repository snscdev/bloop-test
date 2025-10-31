import type { NavMainProps } from '../types';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { useRouter, usePathname } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { ProductCard } from '../product-card';
import { productCardItems } from '../product-cards-config';

// ----------------------------------------------------------------------

export type NavMobileProps = NavMainProps & {
  onClose: () => void;
};

export function NavMobile({ onClose }: NavMobileProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [comprarExpanded, setComprarExpanded] = useState(false);
  const [initialPathname] = useState(pathname);

  useEffect(() => {
    // Solo cerrar si el pathname cambió (navegación), no en el montaje inicial
    if (pathname !== initialPathname) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const navItems = [
    { number: '01', title: 'Comprar', hasDropdown: true },
    { number: '02', title: 'Reparar', path: '/reparar' },
    { number: '03', title: 'Conócenos', path: '/about-us' },
    { number: '04', title: 'Ayuda', path: '/faqs' },
  ];

  return (
    <Box sx={{ py: 0 }}>
      {/* Card de Intercambio siempre visible */}
      <Card
        sx={{
          mb: 3,
          overflow: 'hidden',
          border: 'none',
          boxShadow: '0 4px 8.3px 0 rgba(0, 0, 0, 0.04)',
        }}
      >
        <CardActionArea
          onClick={() => handleNavigate('/intercambio')}
          sx={{
            height: 140,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            p: 2.5,
            position: 'relative',
            background: '#FFF',
            '&:hover': {
              '& .icon-intercambio': {
                transform: 'scale(1.1)',
              },
              '& .img-telefonos': {
                transform: 'scale(1.05) rotate(-3deg)',
              },
            },
          }}
        >
          {/* SVG líneas en esquina superior derecha */}
          <Box
            component="img"
            src="/assets/background/cards/linesMobile.svg"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 176,
              height: 104,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Ícono de intercambio en esquina superior izquierda */}
          <Box
            component="img"
            src="/assets/background/cards/VectorIntercabio.svg"
            className="icon-intercambio"
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: 30,
              height: 24,
              pointerEvents: 'none',
              zIndex: 1,
              transition: 'transform 0.3s ease-in-out',
            }}
          />

          {/* Imagen de teléfonos en esquina inferior derecha */}
          <Box
            component="img"
            src="/assets/background/cards/telefonosIntercambio.png"
            className="img-telefonos"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              height: '100%',
              width: 'auto',
              pointerEvents: 'none',
              zIndex: 1,
              transition: 'transform 0.3s ease-in-out',
              transformOrigin: 'bottom right',
            }}
          />

          <Typography
            sx={{
              maxWidth: '50%',
              color: '#7F746A',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: '20px',
              letterSpacing: '-0.14px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            Ten una oferta de intercambio en solo 2 minutos
          </Typography>
        </CardActionArea>
      </Card>

      {/* Lista de navegación */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {navItems.map((item) => (
          <Box key={item.number}>
            <Box
              onClick={() => {
                if (item.hasDropdown) {
                  setComprarExpanded(!comprarExpanded);
                } else if (item.path) {
                  handleNavigate(item.path);
                }
              }}
              sx={{
                py: 2.5,
                px: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                  {item.number}.
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {item.title}
                </Typography>
              </Box>

              {item.hasDropdown && (
                <Iconify
                  icon={
                    comprarExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                  }
                  width={20}
                />
              )}
            </Box>

            {/* Submenu de Comprar */}
            {item.hasDropdown && (
              <Collapse in={comprarExpanded}>
                <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {productCardItems.map((cardItem) => (
                    <ProductCard key={cardItem.path} item={cardItem} onNavigate={handleNavigate} />
                  ))}
                </Box>
              </Collapse>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
