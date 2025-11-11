import type {
  Accessory,
  AccessoryBrandOption,
  AccessoryBrandVariant,
  AccessoryColorOption,
  AccessoryModelOption,
  AccessorySummary,
  AccessoryVariant,
} from 'src/types/accessory';

// ----------------------------------------------------------------------
// Mocks de accesorios. En ausencia de backend, estos datos simulan
// la respuesta que se utilizará en la página de detalle.
// ----------------------------------------------------------------------

const BASE_IMAGES = {
  magsafeGray: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
  magsafeSand: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  magsafeLavender: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
  magsafeBlack: 'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=800&q=80',
};

// Modelos para Apple
const appleModels: AccessoryModelOption[] = [
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    slug: 'iphone-15',
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
  },
];

// Modelos para Samsung
const samsungModels: AccessoryModelOption[] = [
  {
    id: 'galaxy-s24-plus',
    name: 'Galaxy S24 Plus',
    slug: 'galaxy-s24-plus',
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    slug: 'galaxy-s24-ultra',
  },
];

// Colores específicos para Apple
const appleColorOptions: AccessoryColorOption[] = [
  { id: 'gris-sideral', name: 'Gris Sideral', value: 'gris-sideral', hex: '#54524F' },
  { id: 'azul-pacifico', name: 'Azul Pacífico', value: 'azul-pacifico', hex: '#3C5F74' },
  { id: 'medianoche', name: 'Medianoche', value: 'medianoche', hex: '#1F1F1F' },
  { id: 'blanco-estelar', name: 'Blanco Estelar', value: 'blanco-estelar', hex: '#F6F6F6' },
];

// Colores específicos para Samsung
const samsungColorOptions: AccessoryColorOption[] = [
  { id: 'phantom-gray', name: 'Phantom Gray', value: 'phantom-gray', hex: '#5F5F5F' },
  { id: 'phantom-black', name: 'Phantom Black', value: 'phantom-black', hex: '#1F1F1F' },
  { id: 'cream', name: 'Cream', value: 'cream', hex: '#D6C2A6' },
  { id: 'lavender', name: 'Lavender', value: 'lavender', hex: '#C7C1E4' },
];

// Variantes para Apple
const appleVariants: AccessoryVariant[] = [
  {
    id: 'magsafe-apple-gris-sideral',
    colorId: 'gris-sideral',
    price: 24999,
    stock: 10,
    images: [
      {
        id: 'apple-gris-sideral-1',
        url: BASE_IMAGES.magsafeGray,
        alt: 'Funda MagSafe gris sideral para iPhone',
      },
      {
        id: 'apple-gris-sideral-2',
        url: 'https://images.unsplash.com/photo-1510554310709-fe70c28322f0?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda MagSafe gris sideral vista lateral',
      },
    ],
  },
  {
    id: 'magsafe-apple-azul-pacifico',
    colorId: 'azul-pacifico',
    price: 24999,
    stock: 8,
    images: [
      {
        id: 'apple-azul-1',
        url: 'https://images.unsplash.com/photo-1539880675189-65c868d2ab89?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda MagSafe azul pacífico para iPhone',
      },
    ],
  },
  {
    id: 'magsafe-apple-medianoche',
    colorId: 'medianoche',
    price: 24999,
    stock: 12,
    images: [
      {
        id: 'apple-medianoche-1',
        url: BASE_IMAGES.magsafeBlack,
        alt: 'Funda MagSafe medianoche para iPhone',
      },
    ],
  },
  {
    id: 'magsafe-apple-blanco-estelar',
    colorId: 'blanco-estelar',
    price: 24999,
    stock: 15,
    images: [
      {
        id: 'apple-blanco-1',
        url: 'https://images.unsplash.com/photo-1600180758890-6ff9e7cc98f6?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda MagSafe blanco estelar para iPhone',
      },
    ],
  },
];

// Variantes para Samsung
const samsungVariants: AccessoryVariant[] = [
  {
    id: 'magsafe-samsung-phantom-gray',
    colorId: 'phantom-gray',
    price: 22999,
    stock: 12,
    images: [
      {
        id: 'samsung-gray-1',
        url: BASE_IMAGES.magsafeGray,
        alt: 'Funda MagSafe Phantom Gray para Galaxy',
      },
      {
        id: 'samsung-gray-2',
        url: 'https://images.unsplash.com/photo-1510554310709-fe70c28322f0?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda MagSafe Phantom Gray vista lateral',
      },
    ],
  },
  {
    id: 'magsafe-samsung-phantom-black',
    colorId: 'phantom-black',
    price: 22999,
    stock: 15,
    images: [
      {
        id: 'samsung-black-1',
        url: BASE_IMAGES.magsafeBlack,
        alt: 'Funda MagSafe Phantom Black para Galaxy',
      },
    ],
  },
  {
    id: 'magsafe-samsung-cream',
    colorId: 'cream',
    price: 22999,
    stock: 6,
    images: [
      {
        id: 'samsung-cream-1',
        url: BASE_IMAGES.magsafeSand,
        alt: 'Funda MagSafe Cream para Galaxy',
      },
    ],
  },
  {
    id: 'magsafe-samsung-lavender',
    colorId: 'lavender',
    price: 22999,
    stock: 8,
    images: [
      {
        id: 'samsung-lavender-1',
        url: BASE_IMAGES.magsafeLavender,
        alt: 'Funda MagSafe Lavender para Galaxy',
      },
    ],
  },
];

// BrandVariant para Apple
const appleBrandVariant: AccessoryBrandVariant = {
  brandId: 'apple',
  brandName: 'Apple',
  brandSlug: 'apple',
  models: appleModels,
  price: 24999,
  heroImage: {
    id: 'apple-hero',
    url: BASE_IMAGES.magsafeGray,
    alt: 'Funda MagSafe para iPhone',
  },
  gallery: [
    {
      id: 'apple-gallery-1',
      url: BASE_IMAGES.magsafeGray,
      alt: 'Funda MagSafe gris para iPhone',
    },
    {
      id: 'apple-gallery-2',
      url: 'https://images.unsplash.com/photo-1539880675189-65c868d2ab89?auto=format&fit=crop&w=800&q=80',
      alt: 'Funda MagSafe azul para iPhone',
    },
    {
      id: 'apple-gallery-3',
      url: BASE_IMAGES.magsafeBlack,
      alt: 'Funda MagSafe negra para iPhone',
    },
  ],
  colorOptions: appleColorOptions,
  variants: appleVariants,
};

// BrandVariant para Samsung
const samsungBrandVariant: AccessoryBrandVariant = {
  brandId: 'samsung',
  brandName: 'Samsung',
  brandSlug: 'samsung',
  models: samsungModels,
  price: 22999,
  heroImage: {
    id: 'samsung-hero',
    url: BASE_IMAGES.magsafeGray,
    alt: 'Funda MagSafe para Galaxy',
  },
  gallery: [
    {
      id: 'samsung-gallery-1',
      url: BASE_IMAGES.magsafeGray,
      alt: 'Funda MagSafe Phantom Gray para Galaxy',
    },
    {
      id: 'samsung-gallery-2',
      url: BASE_IMAGES.magsafeSand,
      alt: 'Funda MagSafe Cream para Galaxy',
    },
    {
      id: 'samsung-gallery-3',
      url: BASE_IMAGES.magsafeLavender,
      alt: 'Funda MagSafe Lavender para Galaxy',
    },
    {
      id: 'samsung-gallery-4',
      url: BASE_IMAGES.magsafeBlack,
      alt: 'Funda MagSafe Phantom Black para Galaxy',
    },
  ],
  colorOptions: samsungColorOptions,
  variants: samsungVariants,
};

const ACCESSORY_MOCKS: Accessory[] = [
  {
    id: 'magsafe-case-universal',
    slug: 'magsafe-case-universal',
    name: 'Funda con MagSafe',
    shortDescription: 'Protección premium compatible con MagSafe.',
    description:
      'La funda con MagSafe combina un diseño esbelto con una protección resistente y soporte total para accesorios magnéticos. El acabado texturizado ofrece un agarre seguro y minimiza las marcas de uso. Compatible con iPhone y Galaxy.',
    currency: 'MXN',
    brandVariants: [appleBrandVariant, samsungBrandVariant],
    compatibility: [
      'iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max',
      'Samsung Galaxy S24 Plus, Galaxy S24 Ultra',
      'Cargadores magnéticos MagSafe',
      'Soportes magnéticos para auto',
    ],
    highlights: [
      'Diseño ultrafino con agarre texturizado',
      'Protección de cámara elevada',
      '100% compatible con accesorios MagSafe',
      'Materiales flexibles que absorben impactos',
    ],
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAccessoryById = async (id: string): Promise<Accessory | null> => {
  await delay(150);
  const accessory = ACCESSORY_MOCKS.find((item) => item.id === id);
  return accessory ?? null;
};

export const getAccessoryBrandVariant = async (
  accessoryId: string,
  brandId: string
): Promise<AccessoryBrandVariant | null> => {
  await delay(150);
  const accessory = ACCESSORY_MOCKS.find((item) => item.id === accessoryId);
  const brandVariant = accessory?.brandVariants.find((variant) => variant.brandId === brandId);
  return brandVariant ?? null;
};

export const listAccessorySummaries = async (): Promise<AccessorySummary[]> => {
  await delay(150);
  return ACCESSORY_MOCKS.map((accessory) => {
    const firstBrand = accessory.brandVariants[0];
    const firstModel = firstBrand?.models[0];
    return {
      id: accessory.id,
      name: accessory.name,
      slug: accessory.slug,
      price: firstBrand?.price ?? 0,
      currency: accessory.currency,
      brand: {
        id: firstBrand?.brandId ?? '',
        name: firstBrand?.brandName ?? '',
        slug: firstBrand?.brandSlug ?? '',
      },
      model: {
        id: firstModel?.id ?? '',
        name: firstModel?.name ?? '',
        slug: firstModel?.slug ?? '',
      },
      heroImage: firstBrand?.heroImage ?? {
        id: '',
        url: '',
        alt: '',
      },
    };
  });
};

export const getAccessoryVariant = (
  brandVariant: AccessoryBrandVariant,
  colorId: string
): AccessoryVariant | undefined =>
  brandVariant.variants.find((variant) => variant.colorId === colorId);

export const getAccessoryDefaultSelections = (accessory: Accessory) => {
  const firstBrandVariant = accessory.brandVariants[0];
  const firstModel = firstBrandVariant?.models[0];
  const firstColor = firstBrandVariant?.colorOptions[0];
  const variant = firstColor ? getAccessoryVariant(firstBrandVariant, firstColor.id) : undefined;

  return {
    brandId: firstBrandVariant?.brandId ?? '',
    modelId: firstModel?.id ?? '',
    colorId: firstColor?.id ?? '',
    variant,
    brandVariant: firstBrandVariant,
  };
};


