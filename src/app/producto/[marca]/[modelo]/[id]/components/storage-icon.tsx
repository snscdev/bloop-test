import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type StorageIconProps = {
  capacity: string;
  width?: number;
  height?: number;
};

export function StorageIcon({ capacity, width = 28, height = 28 }: StorageIconProps) {
  // Normalizar capacidad para comparación (lowercase, sin espacios)
  const normalizedCapacity = capacity.toLowerCase().replace(/\s/g, '');

  // 64GB: cuarto de círculo relleno
  if (normalizedCapacity === '64gb') {
    return (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M14 24.5C12.6211 24.5 11.2557 24.2284 9.98182 23.7007C8.7079 23.1731 7.55039 22.3996 6.57538 21.4246C5.60036 20.4496 4.82694 19.2921 4.29926 18.0182C3.77159 16.7443 3.5 15.3789 3.5 14L14 14V24.5Z"
          fill="#7F746A"
        />
        <circle cx="14" cy="14" r="13.5" stroke="#7F746A" strokeDasharray="2 2" />
      </Box>
    );
  }

  // 128GB: medio círculo relleno
  if (normalizedCapacity === '128gb') {
    return (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M14 24.5C11.2152 24.5 8.54451 23.3938 6.57538 21.4246C4.60625 19.4555 3.5 16.7848 3.5 14C3.5 11.2152 4.60625 8.54451 6.57538 6.57538C8.54451 4.60625 11.2152 3.5 14 3.5V14V24.5Z"
          fill="#7F746A"
        />
        <circle cx="14" cy="14" r="13.5" stroke="#7F746A" strokeDasharray="2 2" />
      </Box>
    );
  }

  // 256GB: tres cuartos de círculo relleno
  if (normalizedCapacity === '256gb') {
    return (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M14 24.5C11.9233 24.5 9.89323 23.8842 8.16651 22.7304C6.4398 21.5767 5.09398 19.9368 4.29926 18.0182C3.50454 16.0996 3.29661 13.9884 3.70175 11.9516C4.1069 9.91475 5.10693 8.04383 6.57538 6.57538C8.04383 5.10693 9.91475 4.1069 11.9516 3.70175C13.9884 3.29661 16.0996 3.50455 18.0182 4.29927C19.9368 5.09399 21.5767 6.4398 22.7304 8.16651C23.8842 9.89323 24.5 11.9233 24.5 14L14 14V24.5Z"
          fill="#7F746A"
        />
        <circle cx="14" cy="14" r="13.5" stroke="#7F746A" strokeDasharray="2 2" />
      </Box>
    );
  }

  // 512GB: círculo completo relleno
  if (normalizedCapacity === '512gb') {
    return (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 27 27"
        fill="none"
      >
        <circle cx="13.5" cy="13.5" r="10.125" fill="#7F746A" />
        <circle cx="13.5" cy="13.5" r="13" stroke="#7F746A" strokeDasharray="2 2" />
      </Box>
    );
  }

  // 1TB: círculo con anillo relleno
  if (normalizedCapacity === '1tb') {
    return (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 27 27"
        fill="none"
      >
        <circle cx="13.5" cy="13.5" r="9.625" stroke="#7F746A" />
        <circle cx="13.5" cy="13.5" r="6" fill="#7F746A" stroke="#7F746A" />
        <circle cx="13.5" cy="13.5" r="13" stroke="#7F746A" strokeDasharray="2 2" />
      </Box>
    );
  }

  // 2TB: círculo con doble anillo
  if (normalizedCapacity === '2tb') {
    return (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 27 27"
        fill="none"
      >
        <circle cx="13.5" cy="13.5" r="9.625" stroke="#7F746A" />
        <circle cx="13.5" cy="13.5" r="6" stroke="#7F746A" />
        <circle cx="13.5" cy="13.5" r="4" stroke="#7F746A" />
        <circle cx="13.5" cy="13.5" r="13" stroke="#7F746A" strokeDasharray="2 2" />
      </Box>
    );
  }

  // Default: círculo vacío si no coincide con ninguna capacidad
  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
    >
      <circle cx="14" cy="14" r="13.5" stroke="#7F746A" strokeDasharray="2 2" />
    </Box>
  );
}
