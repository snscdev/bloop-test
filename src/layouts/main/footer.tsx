import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _socials } from 'src/_mock';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const LINKS = [
  { name: 'Comprar', href: '/productos' },
  { name: 'Reparar', href: '/reparacion' },
  { name: 'Conócenos', href: paths.about },
  { name: 'Ayuda', href: '/ayuda' },
  { name: 'Contacto', href: paths.contact },
  { name: 'FAQs', href: paths.faqs },
];

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.vars.palette.background.default,
}));

export type FooterProps = React.ComponentProps<typeof FooterRoot>;

export function Footer({
  sx,
  layoutQuery = 'md',
  ...other
}: FooterProps & { layoutQuery?: Breakpoint }) {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  return (
    <FooterRoot
      sx={[
        {
          maxHeight: { xs: '330px', md: '430px' },
          overflow: 'hidden',
          background: '#A49A8F',
          py: { xs: 6, md: 8 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container>
        {/* Iconos de redes sociales */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            mb: 4,
          }}
        >
          {_socials.map((social) => (
            <IconButton
              key={social.label}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {social.value === 'twitter' && <Iconify icon="socials:twitter" width={24} />}
              {social.value === 'facebook' && <Iconify icon="socials:facebook" width={24} />}
              {social.value === 'instagram' && <Iconify icon="socials:instagram" width={24} />}
              {social.value === 'linkedin' && <Iconify icon="socials:linkedin" width={24} />}
            </IconButton>
          ))}
        </Box>

        {/* Enlaces de navegación */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: { xs: 2, md: 4 },
            mb: 6,
          }}
        >
          {LINKS.map((link) => (
            <Link
              key={link.name}
              component={RouterLink}
              href={link.href}
              underline="none"
              sx={{
                color: 'white',
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              {link.name}
            </Link>
          ))}
        </Box>

        {/* Logo grande centrado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            top: { xs: 60, md: -60 },
          }}
        >
          <Logo
            isSingle={false}
            color="white"
            width={smUp ? 1000 : 200}
            height={smUp ? 400 : 120}
          />
        </Box>
      </Container>
    </FooterRoot>
  );
}

// ----------------------------------------------------------------------

export function HomeFooter({ sx, ...other }: FooterProps) {
  return (
    <FooterRoot
      sx={[
        {
          py: 5,
          textAlign: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container>
        <Logo />
        <Box sx={{ mt: 1, typography: 'caption' }}>
          © All rights reserved.
          <br /> made by
          <Link href="https://minimals.cc/"> minimals.cc </Link>
        </Box>
      </Container>
    </FooterRoot>
  );
}
