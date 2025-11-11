import type { Accessory } from 'src/store/product-checkout-store';

import Box from '@mui/material/Box';

import { AccessoryCard } from './accessory-card';
import { AccessoryGallery } from './accessory-gallery';

// ----------------------------------------------------------------------

type AccessorySectionProps = {
  accessory: Accessory;
  isSelected: boolean;
  selectedColorId: string;
  onToggle: () => void;
  onColorSelect: (colorId: string) => void;
  formatPrice: (price: number) => string;
  isLoaded?: boolean;
};

export function AccessorySection({
  accessory,
  isSelected,
  selectedColorId,
  onToggle,
  onColorSelect,
  formatPrice,
  isLoaded = true,
}: AccessorySectionProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        mb: 6,
      }}
    >
      {/* Card del lado izquierdo */}
      <Box sx={{ width: { xs: '100%', md: '23%' } }}>
        <AccessoryCard
          accessory={accessory}
          isSelected={isSelected}
          onToggle={onToggle}
          formatPrice={formatPrice}
        />
      </Box>

      {/* Gallery del lado derecho */}
      <Box sx={{ width: { xs: '100%', md: '77%' } }}>
        <AccessoryGallery
          images={accessory.gallery}
          availableColors={accessory.availableColors}
          selectedColorId={selectedColorId}
          onColorSelect={onColorSelect}
          isLoaded={isLoaded}
        />
      </Box>
    </Box>
  );
}
