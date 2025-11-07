import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type SelectionCircleProps = {
  state: 'default' | 'hover' | 'selected';
  sx?: SxProps<Theme>;
  color?: string;
};

export function SelectionCircle({ state, sx, color = 'white' }: SelectionCircleProps) {
  if (state === 'selected') {
    return (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        viewBox="0 0 28 28"
        fill="none"
        sx={sx}
      >
        <circle cx="14" cy="14" r="12" stroke={color} strokeWidth="4" />
        <circle cx="14" cy="14" r="5" fill={color} />
      </Box>
    );
  }

  if (state === 'hover') {
    return (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        viewBox="0 0 28 28"
        fill="none"
        sx={sx}
      >
        <circle
          cx="14"
          cy="14"
          r="10"
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="8"
        />
      </Box>
    );
  }

  // Default state
  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      sx={sx}
    >
      <circle
        cx="14"
        cy="14"
        r="12.5"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="3"
      />
    </Box>
  );
}
