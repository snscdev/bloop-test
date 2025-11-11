'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { varFade, AnimateText, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

type ServiceHeroBannerProps = {
  title: string;
  description: string;
  backgroundImage: string;
};

export function ServiceHeroBanner({ title, description, backgroundImage }: ServiceHeroBannerProps) {
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
        sx={{
          position: 'relative',
          height: { xs: 180, md: 309 },
          width: '100%',
          mt: { xs: 6, md: 0 },
          borderRadius: '40px',
          background:
            'linear-gradient(172deg,rgba(127, 116, 106, 0.17) 41.52%, rgba(187, 187, 187, 0.56) 91.01%)',
          overflow: 'hidden',
          mb: { xs: 2, md: 6 },
          cursor: 'pointer',
          '&:hover .background-image': {
            transform: 'translate(-50%, -50%) scale(1.05)',
          },
        }}
      >
        <Box
          component="img"
          src={backgroundImage}
          alt="background"
          className="background-image"
          sx={{
            position: 'absolute',
            width: { xs: '100%', md: '100%' },
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '100%',
            // objectFit: 'contain',
            zIndex: 0,
            transition: 'transform 0.4s ease-in-out',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(9px)',
            maskImage:
              'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,2) 100%)',
            WebkitMaskImage:
              'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,2) 100%)',
            zIndex: 1,
            borderRadius: '40px',
          }}
        />

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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
              color: '#FFF',
              maxWidth: { xs: '100%', md: '70%' },
            }}
          >
            <AnimateText
              component="h1"
              textContent={title}
              variants={varFade('in')}
              repeatDelayMs={600}
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: { xs: '36px', md: '72px' },
                fontWeight: 500,
                lineHeight: { xs: '44px', md: '84px' },
              }}
            />

            <Typography
              component={m.p}
              variants={varFade('in', { distance: 16, transitionIn: { delay: 0.6 } })}
              sx={{
                mt: 1.5,
                fontSize: { xs: '16px', md: '20px' },
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </MotionContainer>
  );
}
