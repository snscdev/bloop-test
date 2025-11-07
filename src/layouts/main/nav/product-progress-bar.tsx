'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useProductCheckoutStore } from 'src/store/product-checkout-store';

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

  // Obtener las selecciones del usuario del store
  const { selectedOptions } = useProductCheckoutStore();

  // Determinar si todos los pasos requeridos están completos
  const allRequiredSelected =
    !!selectedOptions.conditionId &&
    !!selectedOptions.modelId &&
    !!selectedOptions.storageId &&
    !!selectedOptions.colorId;

  // Encontrar el índice del paso activo por scroll
  const activeStepIndex = STEPS.findIndex((step) => step.id === activeSection);

  // Determinar hasta dónde puede avanzar la barra basándose en las selecciones
  // La regla: puedes ver el paso siguiente al último que completaste
  let maxAllowedStep = 0; // Por defecto, siempre puedes ver Estado (step-0)

  if (allRequiredSelected) {
    // Si tiene todo seleccionado, puede llegar hasta Pago (step-5, índice 5)
    maxAllowedStep = 5;
  } else if (selectedOptions.colorId) {
    // Si seleccionó color, puede ver hasta Accesorios (step-4, índice 4)
    maxAllowedStep = 4;
  } else if (selectedOptions.storageId) {
    // Si seleccionó almacenamiento, puede ver hasta Color (step-3, índice 3)
    maxAllowedStep = 3;
  } else if (selectedOptions.modelId) {
    // Si seleccionó modelo, puede ver hasta Almacenamiento (step-2, índice 2)
    maxAllowedStep = 2;
  } else if (selectedOptions.conditionId) {
    // Si seleccionó estado, puede ver hasta Modelo (step-1, índice 1)
    maxAllowedStep = 1;
  }

  // La barra avanza según el scroll, pero no puede ir más allá de lo permitido por las selecciones
  const effectiveStepIndex = Math.min(activeStepIndex, maxAllowedStep);
  const progress = effectiveStepIndex >= 0 ? ((effectiveStepIndex + 1) / STEPS.length) * 100 : 0;

  const handleStepClick = (stepId: string) => {
    const element = document.getElementById(stepId);
    if (element) {
      // Account for sticky navbar (54px) + progress bar (48px) + margen (20px) = 122px
      const offsetTop = element.offsetTop - 122;

      // Realizar el scroll suave
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });

      // El scroll suave toma tiempo, pero el hook useScrollSpy
      // debería detectar el cambio automáticamente a medida que scrollea
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
            // Un paso está "passed" si está completado Y el progreso ya pasó por ahí
            const isPassed = index < effectiveStepIndex;

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
