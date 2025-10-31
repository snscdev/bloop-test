import type { NavMainProps } from './main/nav/types';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  {
    title: 'Comprar',
    path: paths.tienda.producto.root,
    icon: <Iconify width={22} icon="solar:cart-3-bold-duotone" />,
    children: [
      {
        subheader: 'Productos',
        items: [
          { title: 'Apple', path: '/producto/apple' },
          { title: 'Samsung', path: '/producto/samsung' },
          { title: 'Accesorios', path: '/producto/accesorios' },
        ],
      },
      {
        subheader: 'Servicios',
        items: [{ title: 'Intercambio Rápido', path: '/intercambio' }],
      },
    ],
  },
  {
    title: 'Reparar',
    path: paths.tienda.reparar.root,
    icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
  },
  {
    title: 'Conócenos',
    path: paths.about,
    icon: <Iconify width={22} icon="solar:users-group-rounded-bold-duotone" />,
  },
  {
    title: 'Ayuda',
    path: paths.faqs,
    icon: <Iconify width={22} icon="solar:question-circle-bold-duotone" />,
  },
];
