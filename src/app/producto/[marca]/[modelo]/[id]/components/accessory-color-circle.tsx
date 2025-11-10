import type { ColorOption } from 'src/store/product-checkout-store';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type AccessoryColorCircleProps = {
  color: ColorOption;
  isSelected: boolean;
  onClick: () => void;
};

export function AccessoryColorCircle({ color, isSelected, onClick }: AccessoryColorCircleProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: color.gradient,
        border: isSelected ? '2px solid white' : 'none',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
        },
      }}
    />
  );
}




