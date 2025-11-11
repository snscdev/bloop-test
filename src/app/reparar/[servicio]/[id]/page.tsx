import type { Metadata } from 'next';

import Container from '@mui/material/Container';

import { CONFIG } from 'src/global-config';

import { ServiceHeroBanner } from './components/service-hero-banner';
import { ServiceRepairContent } from './components/service-repair-content';
import {
  StepReceiveIcon,
  StepDeliverIcon,
  StepConfirmIcon,
  StepChooseModelIcon,
} from './components/device-selection-section';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Servicio Técnico - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ servicio: string; id: string }>;
};

const STEPS = [
  {
    title: 'Elige el modelo',
    description:
      'Selecciona el modelo de tu dispositivo y valida precio, cobertura y disponibilidad del servicio.',
    icon: <StepChooseModelIcon />,
  },
  {
    title: 'Confirma tu solicitud',
    description: 'Agrega el servicio al carrito y agenda la reparación completando tus datos.',
    icon: <StepConfirmIcon />,
  },
  {
    title: 'Entrega tu dispositivo',
    description:
      'Recibe un kit de envío o llévalo a un punto Bloop autorizado para iniciar el proceso.',
    icon: <StepDeliverIcon />,
  },
  {
    title: 'Recibe tu dispositivo',
    description: 'Te devolvemos tu equipo reparado, probado y con la garantía del servicio Bloop.',
    icon: <StepReceiveIcon />,
  },
];

const DEVICE_BRANDS = [
  {
    id: 'samsung',
    name: 'Samsung',
    models: [
      { id: 'galaxy-s24-plus', name: 'Galaxy S24 Plus' },
      { id: 'galaxy-s24-ultra', name: 'Galaxy S24 Ultra' },
      { id: 'galaxy-z-flip-5', name: 'Galaxy Z Flip 5' },
    ],
  },
  {
    id: 'apple',
    name: 'Apple',
    models: [
      { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max' },
      { id: 'iphone-15-plus', name: 'iPhone 15 Plus' },
      { id: 'iphone-14', name: 'iPhone 14' },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    models: [
      { id: 'pixel-8-pro', name: 'Pixel 8 Pro' },
      { id: 'pixel-7a', name: 'Pixel 7a' },
    ],
  },
];

const REPLACEMENT_OPTIONS = [
  {
    id: 'original',
    name: 'Pantalla original',
    price: 14999,
    description: 'Repuesto certificado por el fabricante con calibración original.',
    image:
      'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=800&q=80',
    benefits: ['100% original', 'True Tone compatible', 'Garantía 90 días'],
    isRecommended: true,
    availableFor: {
      brands: ['samsung', 'apple'],
      models: ['galaxy-s24-plus', 'galaxy-s24-ultra', 'iphone-15-pro-max', 'iphone-15-plus'],
    },
  },
  {
    id: 'premium',
    name: 'Alta calidad',
    price: 12999,
    description: 'Componentes premium calibrados para colores vibrantes y brillo uniforme.',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    benefits: ['Excelente calidad', 'Colores vibrantes', 'Garantía 60 días'],
    availableFor: {
      brands: ['samsung', 'apple', 'google'],
      models: ['galaxy-s24-plus', 'galaxy-z-flip-5', 'iphone-14', 'pixel-8-pro'],
    },
  },
  {
    id: 'economy',
    name: 'Económica',
    price: 6999,
    description: 'La opción más accesible para recuperar funcionalidad completa del equipo.',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    benefits: ['Funcionalidad completa', 'Touch responsivo', 'Garantía 30 días'],
    availableFor: {
      brands: ['samsung', 'google'],
      models: ['galaxy-z-flip-5', 'pixel-7a'],
    },
  },
];

export default async function ReparacionPage({ params }: Props) {
  const { servicio, id } = await params;

  return (
    <Container sx={{ py: { xs: 5, md: 8 }, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <ServiceHeroBanner
        title="Servicio técnico"
        description={servicio.replace(/-/g, ' ')}
        backgroundImage="/assets/background/banner/servicioTecnico.png"
      />

      <ServiceRepairContent
        serviceSlug={servicio}
        serviceId={id}
        steps={STEPS}
        brands={DEVICE_BRANDS}
        replacementOptions={REPLACEMENT_OPTIONS}
      />
    </Container>
  );
}
