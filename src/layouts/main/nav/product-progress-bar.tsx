'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

type Step = {
  id: string;
  label: string;
  mobileLabel?: string;
};

const STEPS: Step[] = [
  { id: 'step-0', label: 'Estado', mobileLabel: '1' },
  { id: 'step-1', label: 'Modelo', mobileLabel: '2' },
  { id: 'step-2', label: 'Almacenamiento', mobileLabel: '3' },
  { id: 'step-3', label: 'Color', mobileLabel: '4' },
  { id: 'step-4', label: 'Accesorios', mobileLabel: '5' },
  { id: 'step-5', label: 'Pago', mobileLabel: '6' },
];

type Props = {
  activeSection: string | null;
  isVisible: boolean;
  sx?: SxProps<Theme>;
};

export function ProductProgressBar({ activeSection, isVisible, sx }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const activeStepIndex = STEPS.findIndex((step) => step.id === activeSection);
  const progress = activeStepIndex >= 0 ? ((activeStepIndex + 1) / STEPS.length) * 100 : 0;

  const handleStepClick = (stepId: string) => {
    const element = document.getElementById(stepId);
    if (element) {
      // Account for sticky navbar (54px) + progress bar (48px) = 102px
      const offsetTop = element.offsetTop - (isMobile ? 102 : 110);
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      sx={[
        {
          position: 'fixed',
          top: 54, // Justo debajo de la sticky navbar
          left: 0,
          right: 0,
          height: 48,
          zIndex: theme.zIndex.appBar,
          background: '#FFF',
          borderBottom: '1px solid #F0F0F0',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s ease-in-out',
          pointerEvents: isVisible ? 'auto' : 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          maxWidth: 1280,
          height: '100%',
          mx: 'auto',
          px: { xs: 2, md: 7 },
        }}
      >
        {/* Steps */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            gap: { xs: 1, md: 2 },
          }}
        >
          {STEPS.map((step, index) => {
            const isActive = step.id === activeSection;
            const isPassed = activeStepIndex > index;

            return (
              <Box
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    '& .step-label': {
                      color: '#7F746A',
                    },
                  },
                }}
              >
                <Typography
                  className="step-label"
                  sx={{
                    fontSize: { xs: '12px', md: '14px' },
                    fontWeight: isActive || isPassed ? 600 : 500,
                    color: isActive ? '#7F746A' : isPassed ? '#A39D95' : '#C4C0BA',
                    textAlign: 'center',
                    transition: 'color 0.2s ease-in-out',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {isMobile ? step.mobileLabel : step.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Progress bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#F0F0F0',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${progress}%`,
              background: '#7F746A',
              transition: 'width 0.3s ease-in-out',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
