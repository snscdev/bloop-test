import type { ProductCardItem } from './product-card';

export const productCardItems: ProductCardItem[] = [
  {
    title: 'Apple',
    path: '/producto/apple',
    bgGradient:
      'linear-gradient(180deg, rgba(208, 203, 194, 0.81) 0%, rgba(127, 116, 106, 0.89) 100%)',
    image: '/assets/background/cards/Apple.png',
    iconSvg: '/assets/background/cards/IconApple.svg',
  },
  {
    title: 'Samsung',
    path: '/producto/samsung',
    bgGradient: 'linear-gradient(259deg, rgba(152, 177, 198, 0.72) -5.86%, #8596A9 58.11%)',
    image: '/assets/background/cards/samsung.png',
    imagePosition: 'bottom',
    iconSvg: '/assets/background/cards/IconSamsung.svg',
  },
  {
    title: 'Accesorios',
    path: '/producto/accesorios',
    bgGradient: 'linear-gradient(173deg, #D5D5D5 5.29%, #949494 58.6%)',
    image: '/assets/background/cards/Accesorios.png',
    iconSvg: '/assets/background/cards/iconoAccesorios.svg',
  },
];
