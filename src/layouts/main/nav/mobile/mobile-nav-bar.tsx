'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { NavMainProps } from '../types';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { NavMobile } from './nav-mobile';
import { CartButton } from '../cart-button';
import { UserMenuButton } from '../user-menu-button';

// ----------------------------------------------------------------------

type MobileNavBarProps = {
  data: NavMainProps['data'];
  layoutQuery?: Breakpoint;
};

export function MobileNavBar({ data, layoutQuery = 'md' }: MobileNavBarProps) {
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  return (
    <Box
      sx={(theme) => ({
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        px: 2,
        pt: 2,
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: open ? '100%' : '100%',
          mx: 'auto',
          borderRadius: open ? '20px' : '40px',
          border: '1px solid #F4F3F2',
          background: '#F8F8F8',
          backdropFilter: 'blur(15.6px)',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {/* Barra superior */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 54,
            px: 3,
            flexShrink: 0,
          }}
        >
          {/* Left: Hamburger button (solo cuando está cerrado) */}
          {!open && (
            <IconButton onClick={onOpen} sx={{ p: 0.5 }}>
              <Iconify icon={'solar:hamburger-menu-linear' as any} width={24} />
            </IconButton>
          )}

          {/* Center: Logo */}
          <Box
            sx={{
              position: open ? 'static' : 'absolute',
              left: open ? 'auto' : '46%',
              transform: open ? 'none' : 'translateX(-50%)',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Logo isSingle={false} sx={{ width: '65%' }} />
          </Box>

          {/* Right: User + Cart buttons or Close button */}
          {!open ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UserMenuButton />
              <CartButton />
            </Box>
          ) : (
            <IconButton onClick={onClose} sx={{ p: 0.5 }}>
              <Iconify icon={'eva:close-fill' as any} width={28} />
            </IconButton>
          )}
        </Box>

        {/* Contenido expandible */}
        {open && (
          <Box
            sx={{
              px: 3,
              pb: 3,
              maxHeight: 'calc(100vh - 120px)',
              overflow: 'auto',
              // Ocultar scrollbars pero mantener funcionalidad
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none', // Para Firefox
              msOverflowStyle: 'none', // Para IE y Edge
            }}
          >
            <NavMobile data={data} onClose={onClose} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
