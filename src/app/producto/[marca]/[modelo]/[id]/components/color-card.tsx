import type { ColorOption } from 'src/store/product-checkout-store';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';

import { SelectionCircle } from './selection-circle';

// ============================================================================
// Types
// ============================================================================

interface ColorCardProps {
  color: ColorOption;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// ============================================================================
// Gradient Parser - Convertir CSS gradient a SVG
// ============================================================================

interface GradientStop {
  offset: string;
  color: string;
}

/**
 * Parsea un string de gradiente CSS y extrae los stops
 * Ejemplo: "linear-gradient(180deg, #1A2A44 29.83%, #2D405B 36.09%)"
 */
function parseGradientStops(gradientString: string | undefined): GradientStop[] {
  // Si no hay gradiente, retornar gradiente por defecto
  if (!gradientString) {
    return [
      { offset: '0', color: '#E3E4E5' },
      { offset: '1', color: '#C0C1C2' },
    ];
  }

  try {
    // Extraer la parte entre paréntesis
    const match = gradientString.match(/linear-gradient\([^)]+\)/);
    if (!match) return [];

    // Extraer los stops (después del ángulo)
    const content = match[0].replace(/linear-gradient\(|\)/g, '');
    const parts = content.split(',').map((s) => s.trim());

    // Remover el primer elemento si es el ángulo (e.g., "180deg")
    const stops = parts.filter((part) => !part.includes('deg'));

    // Parsear cada stop
    return stops.map((stop) => {
      // Formato esperado: "#1A2A44 29.83%" o "#1A2A44"
      const stopMatch = stop.match(/(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\s*(\d+(?:\.\d+)?)?%?/);
      if (!stopMatch) return { offset: '0', color: '#000000' };

      const color = stopMatch[1];
      const offset = stopMatch[2] || '0';

      return {
        offset: (parseFloat(offset) / 100).toString(),
        color,
      };
    });
  } catch {
    // Fallback en caso de error
    return [
      { offset: '0', color: '#E3E4E5' },
      { offset: '1', color: '#C0C1C2' },
    ];
  }
}

// ============================================================================
// ColorCard Component
// ============================================================================

export function ColorCard({
  color,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ColorCardProps) {
  const gradientStops = useMemo(() => parseGradientStops(color.gradient), [color.gradient]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: 280, sm: 300 },
        height: { xs: 280, sm: 300 },
        borderRadius: '34px',
        padding: isSelected || isHovered ? '2px' : '0px',
        background:
          isSelected || isHovered
            ? 'linear-gradient(322deg, rgba(208, 203, 194, 0.26) -1.74%, rgba(127, 116, 106, 0.48) 63.01%)'
            : 'transparent',
        transition: 'all 0.3s',
        mx: 'auto',
      }}
    >
      <Card
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '34px',
          overflow: 'hidden',
          border: 'none',
          transition: 'all 0.3s',
        }}
      >
        {/* Fondo con gradiente */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: color.gradient,
            zIndex: 0,
          }}
        />

        {/* SVG con bandas y efectos encima del fondo */}
        <Box
          component="svg"
          width="300"
          height="300"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <g filter={`url(#filter0_d_${color.id})`}>
            <rect
              x="136.376"
              y="43.0571"
              width="28.8633"
              height="691.688"
              fill={`url(#paint0_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter1_d_${color.id})`}>
            <rect
              x="108.553"
              y="58.5176"
              width="27.8324"
              height="691.688"
              fill={`url(#paint1_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter2_d_${color.id})`}>
            <rect
              width="27.8324"
              height="691.688"
              transform="matrix(-1 0 0 1 193.081 58.5176)"
              fill={`url(#paint2_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter3_d_${color.id})`}>
            <rect
              x="77.6165"
              y="17.2842"
              width="30.9249"
              height="743.229"
              fill={`url(#paint3_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter4_d_${color.id})`}>
            <rect
              width="28.8633"
              height="743.229"
              transform="matrix(-1 0 0 1 221.929 17.2842)"
              fill={`url(#paint4_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter5_d_${color.id})`}>
            <rect
              x="48.7592"
              y="-12.6079"
              width="28.8633"
              height="801.986"
              fill={`url(#paint5_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter6_d_${color.id})`}>
            <rect
              width="28.8633"
              height="801.986"
              transform="matrix(-1 0 0 1 250.799 -12.6079)"
              fill={`url(#paint6_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter7_d_${color.id})`}>
            <rect
              x="18.8605"
              y="-70.335"
              width="29.8941"
              height="918.47"
              fill={`url(#paint7_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter8_d_${color.id})`}>
            <rect
              width="29.8941"
              height="918.47"
              transform="matrix(-1 0 0 1 280.698 -70.335)"
              fill={`url(#paint8_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter9_d_${color.id})`}>
            <rect
              x="-10"
              y="-126"
              width="28.8633"
              height="1030.83"
              fill={`url(#paint9_linear_${color.id})`}
            />
          </g>
          <g filter={`url(#filter10_d_${color.id})`}>
            <rect
              width="28.8633"
              height="1030.83"
              transform="matrix(-1 0 0 1 309.559 -126)"
              fill={`url(#paint10_linear_${color.id})`}
            />
          </g>

          <defs>
            {/* Filtros de blur */}
            <filter
              id={`filter0_d_${color.id}`}
              x="36.3758"
              y="-56.9429"
              width="228.863"
              height="891.688"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter1_d_${color.id}`}
              x="8.55344"
              y="-41.4824"
              width="227.832"
              height="891.688"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter2_d_${color.id}`}
              x="65.2491"
              y="-41.4824"
              width="227.832"
              height="891.688"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter3_d_${color.id}`}
              x="-22.3835"
              y="-82.7158"
              width="230.925"
              height="943.229"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter4_d_${color.id}`}
              x="93.0658"
              y="-82.7158"
              width="228.863"
              height="943.229"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter5_d_${color.id}`}
              x="-51.2408"
              y="-112.608"
              width="228.863"
              height="1001.99"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter6_d_${color.id}`}
              x="121.936"
              y="-112.608"
              width="228.863"
              height="1001.99"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter7_d_${color.id}`}
              x="-81.1395"
              y="-170.335"
              width="229.894"
              height="1118.47"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter8_d_${color.id}`}
              x="150.804"
              y="-170.335"
              width="229.894"
              height="1118.47"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter9_d_${color.id}`}
              x="-110"
              y="-226"
              width="228.863"
              height="1230.83"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter10_d_${color.id}`}
              x="180.695"
              y="-226"
              width="228.863"
              height="1230.83"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="50" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>

            {/* Gradientes - Todos usan los mismos stops del backend */}
            <linearGradient
              id={`paint0_linear_${color.id}`}
              x1="150.807"
              y1="43.0571"
              x2="150.807"
              y2="734.745"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint1_linear_${color.id}`}
              x1="122.47"
              y1="58.5176"
              x2="122.47"
              y2="750.205"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint2_linear_${color.id}`}
              x1="13.9162"
              y1="0"
              x2="13.9162"
              y2="691.688"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint3_linear_${color.id}`}
              x1="93.079"
              y1="17.2842"
              x2="93.079"
              y2="760.513"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint4_linear_${color.id}`}
              x1="14.4316"
              y1="0"
              x2="14.4316"
              y2="743.229"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint5_linear_${color.id}`}
              x1="63.1909"
              y1="-12.6079"
              x2="63.1909"
              y2="789.378"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint6_linear_${color.id}`}
              x1="14.4316"
              y1="0"
              x2="14.4316"
              y2="801.986"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint7_linear_${color.id}`}
              x1="33.8076"
              y1="-70.335"
              x2="33.8076"
              y2="848.135"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint8_linear_${color.id}`}
              x1="14.947"
              y1="0"
              x2="14.947"
              y2="918.47"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint9_linear_${color.id}`}
              x1="4.43163"
              y1="-126"
              x2="4.43163"
              y2="904.831"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <linearGradient
              id={`paint10_linear_${color.id}`}
              x1="14.4316"
              y1="0"
              x2="14.4316"
              y2="1030.83"
              gradientUnits="userSpaceOnUse"
            >
              {gradientStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
        </Box>

        {/* SelectionCircle - Esquina superior derecha */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 3,
          }}
        >
          <SelectionCircle state={isSelected ? 'selected' : isHovered ? 'hover' : 'default'} />
        </Box>

        {/* Chip con nombre del color - Abajo centrado */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <Chip
            label={color.name}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '80px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              '& .MuiChip-label': {
                px: 3,
                py: 1,
                fontSize: '16px',
                fontWeight: 600,
                color: '#7F746A',
              },
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}
