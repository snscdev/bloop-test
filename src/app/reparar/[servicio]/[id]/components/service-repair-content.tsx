'use client';

import type { ReactNode } from 'react';
import type { CartItem } from 'src/types/cart';
import type { ReplacementOption } from './replacement-quality-section';

import { useRouter } from 'next/navigation';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import { useCart } from 'src/hooks/use-cart';

import { DeviceSelectionSection } from './device-selection-section';
import { ServiceCheckoutSection } from './service-checkout-section';
import { ReplacementQualitySection } from './replacement-quality-section';

// ----------------------------------------------------------------------

type Step = {
  title: string;
  description: string;
  icon: ReactNode;
};

type DeviceBrand = {
  id: string;
  name: string;
  models: { id: string; name: string }[];
};

type ServiceRepairContentProps = {
  serviceSlug: string;
  serviceId: string;
  steps: Step[];
  brands: DeviceBrand[];
  replacementOptions: ReplacementOption[];
};

const BASE_SERVICE_PRICE = 7999;

const SERVICE_GALLERY = [
  'https://images.unsplash.com/photo-1527698266440-12104e498b76?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580894897200-51f28ccf6368?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580894897202-15d0f7c8b378?auto=format&fit=crop&w=1200&q=80',
];

export function ServiceRepairContent({
  serviceSlug,
  serviceId,
  steps,
  brands,
  replacementOptions,
}: ServiceRepairContentProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const defaultBrand = brands[0];
  const defaultModel = defaultBrand?.models[0];

  const [selectedBrand, setSelectedBrand] = useState({
    id: defaultBrand?.id ?? '',
    name: defaultBrand?.name ?? '',
  });
  const [selectedModel, setSelectedModel] = useState({
    id: defaultModel?.id ?? '',
    name: defaultModel?.name ?? '',
  });

  const [selectedReplacementId, setSelectedReplacementId] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const availableReplacements = useMemo(
    () =>
      replacementOptions.filter((option) => {
        if (!option.availableFor) return true;
        const { brands: allowedBrands, models } = option.availableFor;
        return allowedBrands.includes(selectedBrand.id) && models.includes(selectedModel.id);
      }),
    [replacementOptions, selectedBrand.id, selectedModel.id]
  );

  const selectedReplacement = useMemo(
    () => availableReplacements.find((option) => option.id === selectedReplacementId),
    [availableReplacements, selectedReplacementId]
  );

  const guaranteeText =
    selectedReplacement?.benefits.find((benefit) => benefit.toLowerCase().includes('garant')) ??
    'Garantía 90 días';

  const totalPrice = useMemo(() => {
    if (!selectedReplacement) {
      return BASE_SERVICE_PRICE;
    }
    return selectedReplacement.price + BASE_SERVICE_PRICE;
  }, [selectedReplacement]);

  const [isBuying, setIsBuying] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Refs para scroll automático
  const replacementSectionRef = useRef<HTMLDivElement>(null);
  const checkoutSectionRef = useRef<HTMLDivElement>(null);

  const handleDeviceSelectionChange = useCallback(
    (selection: { brandId: string; brandName: string; modelId: string; modelName: string }) => {
      setSelectedBrand({ id: selection.brandId, name: selection.brandName });
      setSelectedModel({ id: selection.modelId, name: selection.modelName });
      // Reset replacement selection when device changes
      setSelectedReplacementId('');
    },
    []
  );

  // Auto-select first available replacement when available options change
  useEffect(() => {
    if (availableReplacements.length > 0 && !selectedReplacementId) {
      setSelectedReplacementId(availableReplacements[0].id);
    } else if (availableReplacements.length > 0 && selectedReplacementId) {
      // Check if current selection is still valid
      const isCurrentSelectionValid = availableReplacements.some(
        (option) => option.id === selectedReplacementId
      );
      if (!isCurrentSelectionValid) {
        setSelectedReplacementId(availableReplacements[0].id);
      }
    }
  }, [availableReplacements, selectedReplacementId]);

  const handleSelectReplacement = useCallback((id: string) => {
    setSelectedReplacementId(id);
    // Scroll al checkout después de seleccionar repuesto
    setTimeout(() => {
      checkoutSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }, []);

  const handleDeviceContinue = useCallback(() => {
    // Scroll a la sección de repuestos
    replacementSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleAddToCart = async () => {
    if (isAdding) {
      return;
    }

    // Validar que se hayan seleccionado dispositivo y repuesto
    if (!selectedBrand.id || !selectedModel.id || !selectedReplacement) {
      console.warn('Debes seleccionar marca, modelo y repuesto antes de agregar al carrito.');
      return;
    }

    setIsAdding(true);
    try {
      // Construir ID único para el item del carrito
      const cartItemId = `service-${serviceId}-${selectedBrand.id}-${selectedModel.id}-${selectedReplacement.id}`;

      // Construir nombre descriptivo del servicio
      const serviceName = `${serviceSlug.replace(/-/g, ' ')} - ${selectedBrand.name} ${selectedModel.name}`;

      // Construir el objeto CartItem
      const item: Omit<CartItem, 'cantidad'> = {
        id: cartItemId,
        type: 'servicio',
        servicio: serviceSlug,
        nombre: serviceName,
        precio: totalPrice,
        imagen: selectedReplacement.image || SERVICE_GALLERY[0],
        options: {
          model: {
            id: selectedModel.id,
            name: `${selectedBrand.name} ${selectedModel.name}`,
          },
          accessories: [
            {
              id: selectedReplacement.id,
              name: selectedReplacement.name,
            },
          ],
        },
      };

      // Agregar al carrito
      addItem(item);

      // Redirigir al carrito
      router.push('/cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (paymentLoading) return;
    if (typeof window === 'undefined') return;

    // Validar que se hayan seleccionado dispositivo y repuesto
    if (!selectedBrand.id || !selectedModel.id || !selectedReplacement) {
      console.warn('Debes seleccionar marca, modelo y repuesto antes de proceder con la compra.');
      return;
    }

    try {
      setPaymentLoading(true);
      setIsBuying(true);
      setPaymentError(null);

      // TODO: Implementar createPaymentSession para servicios
      // Por ahora, agregamos al carrito y redirigimos
      await handleAddToCart();

      // En producción, aquí iría:
      // const paymentUrl = await createServicePaymentSession({
      //   serviceId,
      //   brandId: selectedBrand.id,
      //   modelId: selectedModel.id,
      //   replacementId: selectedReplacement.id,
      //   totalPrice,
      //   successUrl: `https://bloop-test.vercel.app`,
      //   cancelUrl: `https://bloop-test.vercel.app`,
      // });
      // window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ocurrió un error al procesar el pago.';
      setPaymentError(message);
      console.error('Error en handleBuyNow:', error);
    } finally {
      setPaymentLoading(false);
      setIsBuying(false);
    }
  };

  const serviceTitle = `Servicio - ${selectedModel.name || 'Tu dispositivo'}`;
  const chips = [
    { label: 'Reemplazo de pantalla', icon: 'pantalla' },
    selectedReplacement
      ? { label: selectedReplacement.name, icon: 'solar:display-outline' }
      : undefined,
  ].filter(Boolean) as { label: string; icon?: string }[];

  return (
    <>
      <DeviceSelectionSection
        steps={steps}
        brands={brands}
        defaultBrandId={selectedBrand.id}
        defaultModelId={selectedModel.id}
        onSelectionChange={handleDeviceSelectionChange}
        onContinue={handleDeviceContinue}
      />

      <Box ref={replacementSectionRef}>
        <ReplacementQualitySection
          options={availableReplacements}
          subtitle="Comparamos componentes según origen, garantía y experiencia visual para que elijas el ideal."
          selectedOptionId={selectedReplacementId}
          onSelectOption={handleSelectReplacement}
        />
      </Box>

      {/* Solo mostrar checkout cuando dispositivo y repuesto estén seleccionados */}
      {selectedBrand.id && selectedModel.id && selectedReplacement && (
        <Box ref={checkoutSectionRef}>
          <ServiceCheckoutSection
            title="Tu servicio técnico"
            serviceName={serviceTitle}
            tags={chips}
            guaranteeLabel={guaranteeText}
            gallery={SERVICE_GALLERY}
            totalPrice={totalPrice}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            isBuying={isBuying}
            isAdding={isAdding}
            disabled={!selectedReplacement}
          />
        </Box>
      )}
    </>
  );
}
