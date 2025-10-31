'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export function UserMenuButton({ sx }: Props) {
  const router = useRouter();
  const { user, authenticated } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!authenticated) {
      router.push('/auth/sign-in');
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/dashboard/user/account');
    handleClose();
  };

  const handleOrders = () => {
    router.push('/dashboard/order');
    handleClose();
  };

  const handleLogout = () => {
    // TODO: Implementar logout
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} sx={sx}>
        {authenticated && user?.photoURL ? (
          <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 32, height: 32 }} />
        ) : (
          <SvgIcon sx={{ width: 24, height: 24 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18.5588 19.5488C17.5654 16.8918 15.0036 15 12 15C8.99638 15 6.4346 16.8918 5.44117 19.5488M18.5588 19.5488C20.6672 17.7154 22 15.0134 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.0134 3.33285 17.7154 5.44117 19.5488M18.5588 19.5488C16.8031 21.0756 14.5095 22 12 22C9.49052 22 7.19694 21.0756 5.44117 19.5488M15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9Z"
                stroke="#7F746A"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </SvgIcon>
        )}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: { width: 200, p: 1 },
          },
        }}
      >
        {authenticated && user && (
          <>
            <Typography variant="subtitle2" sx={{ px: 1.5, py: 1 }}>
              {user.displayName || user.email}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </>
        )}

        <MenuList>
          <MenuItem onClick={handleProfile}>
            <Iconify icon="solar:user-bold-duotone" width={20} sx={{ mr: 1.5 }} />
            Mi Perfil
          </MenuItem>

          <MenuItem onClick={handleOrders}>
            <Iconify icon="solar:bag-bold-duotone" width={20} sx={{ mr: 1.5 }} />
            Mis Pedidos
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:logout-bold-duotone" width={20} sx={{ mr: 1.5 }} />
            Cerrar Sesión
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
