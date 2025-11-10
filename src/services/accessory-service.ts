import type {
  Accessory,
  AccessoryBrandOption,
  AccessoryColorOption,
  AccessoryModelOption,
  AccessorySummary,
  AccessoryVariant,
} from 'src/types/accessory';

// ----------------------------------------------------------------------
// Mocks de accesorios. En ausencia de backend, estos datos simulan
// la respuesta que se utilizará en la página de detalle.
// ----------------------------------------------------------------------

type AccessoryMockPayload = Accessory & {
  brandOptions: AccessoryBrandOption[];
  colorOptions: AccessoryColorOption[];
  variants: AccessoryVariant[];
};

const BASE_IMAGES = {
  magsafeGray: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
  magsafeSand: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  magsafeLavender: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
  magsafeBlack: 'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=800&q=80',
};

const samsungGalaxyS24PlusModels: AccessoryModelOption[] = [
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

const samsungBrandOption: AccessoryBrandOption = {
  id: 'samsung',
  name: 'Samsung',
  slug: 'samsung',
  models: samsungGalaxyS24PlusModels,
};

const magsafeColorOptions: AccessoryColorOption[] = [
  { id: 'gris-claro', name: 'Gris claro', value: 'gris-claro', hex: '#D9D4CF' },
  { id: 'arena', name: 'Arena', value: 'arena', hex: '#D6C2A6' },
  { id: 'lavanda', name: 'Lavanda', value: 'lavanda', hex: '#C7C1E4' },
  { id: 'negro', name: 'Negro', value: 'negro', hex: '#1F1F1F' },
  { id: 'blanco', name: 'Blanco', value: 'blanco', hex: '#F6F6F6' },
];

const magsafeVariants: AccessoryVariant[] = [
  {
    id: 'magsafe-gris-claro',
    colorId: 'gris-claro',
    price: 22999,
    stock: 12,
    images: [
      {
        id: 'magsafe-gris-claro-hero',
        url: BASE_IMAGES.magsafeGray,
        alt: 'Funda con Magsave gris claro vista frontal',
      },
      {
        id: 'magsafe-gris-claro-lateral',
        url: 'https://images.unsplash.com/photo-1510554310709-fe70c28322f0?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda con Magsave gris claro vista lateral',
      },
      {
        id: 'magsafe-gris-claro-uso',
        url: 'https://images.unsplash.com/photo-1600180758890-6ff9e7cc98f6?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda con Magsave gris claro en una mano',
      },
    ],
  },
  {
    id: 'magsafe-arena',
    colorId: 'arena',
    price: 22999,
    stock: 6,
    images: [
      {
        id: 'magsafe-arena-hero',
        url: BASE_IMAGES.magsafeSand,
        alt: 'Funda con Magsave arena vista frontal',
      },
      {
        id: 'magsafe-arena-lateral',
        url: 'https://images.unsplash.com/photo-1511288598650-4c6777e02528?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda con Magsave arena vista lateral',
      },
      {
        id: 'magsafe-arena-detalle',
        url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda con Magsave arena detalle',
      },
    ],
  },
  {
    id: 'magsafe-lavanda',
    colorId: 'lavanda',
    price: 22999,
    stock: 8,
    images: [
      {
        id: 'magsafe-lavanda-hero',
        url: BASE_IMAGES.magsafeLavender,
        alt: 'Funda con Magsave lavanda vista frontal',
      },
      {
        id: 'magsafe-lavanda-lateral',
        url: 'https://images.unsplash.com/photo-1539880675189-65c868d2ab89?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda con Magsave lavanda vista lateral',
      },
      {
        id: 'magsafe-lavanda-uso',
        url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
        alt: 'Funda con Magsave lavanda en uso',
      },
    ],
  },
  {
    id: 'magsafe-negro',
    colorId: 'negro',
    price: 22999,
    stock: 15,
    images: [
      {
        id: 'magsafe-negro-hero',
        url: BASE_IMAGES.magsafeBlack,
        alt: 'Funda con Magsave negra vista frontal',
      },
      {
        id: 'magsafe-negro-detalle',
        url: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80',
        alt: 'Detalle de la funda con Magsave negra',
      },
      {
        id: 'magsafe-negro-uso',
        url: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80',
        alt: 'Persona sosteniendo funda con Magsave negra',
      },
    ],
  },
];

const ACCESSORY_MOCKS: AccessoryMockPayload[] = [
  {
    id: 'magsafe-case-samsung-galaxy-s24-plus',
    slug: 'magsafe-case-samsung-galaxy-s24-plus',
    name: 'Funda con Magsave',
    shortDescription: 'Protección premium compatible con Magsave.',
    description:
      'La funda con Magsave para Galaxy S24 Plus combina un diseño esbelto con una protección resistente y soporte total para accesorios magnéticos. El acabado texturizado ofrece un agarre seguro y minimiza las marcas de uso.',
    price: 22999,
    currency: 'MXN',
    brand: {
      id: 'samsung',
      name: 'Samsung',
      slug: 'samsung',
    },
    model: {
      id: 'galaxy-s24-plus',
      name: 'Galaxy S24 Plus',
      slug: 'galaxy-s24-plus',
    },
    heroImage: {
      id: 'magsafe-hero',
      url: BASE_IMAGES.magsafeGray,
      alt: 'Funda con Magsave gris claro en una mano',
    },
    gallery: [
      {
        id: 'magsafe-gallery-1',
        url: BASE_IMAGES.magsafeGray,
        alt: 'Funda con Magsave gris claro',
      },
      {
        id: 'magsafe-gallery-2',
        url: BASE_IMAGES.magsafeSand,
        alt: 'Funda con Magsave arena',
      },
      {
        id: 'magsafe-gallery-3',
        url: BASE_IMAGES.magsafeLavender,
        alt: 'Funda con Magsave lavanda',
      },
      {
        id: 'magsafe-gallery-4',
        url: BASE_IMAGES.magsafeBlack,
        alt: 'Funda con Magsave negra',
      },
    ],
    compatibility: [
      'Samsung Galaxy S24 Plus',
      'Samsung Galaxy S24 Ultra',
      'Cargadores magnéticos Magsave',
      'Soportes magnéticos para auto',
    ],
    highlights: [
      'Diseño ultrafino con agarre texturizado',
      'Protección de cámara elevada',
      '100% compatible con accesorios Magsave',
      'Materiales flexibles que absorben impactos',
    ],
    brandOptions: [samsungBrandOption],
    colorOptions: magsafeColorOptions,
    variants: magsafeVariants,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAccessoryById = async (id: string): Promise<Accessory | null> => {
  await delay(150);
  const accessory = ACCESSORY_MOCKS.find((item) => item.id === id);
  return accessory ?? null;
};

export const listAccessorySummaries = async (): Promise<AccessorySummary[]> => {
  await delay(150);
  return ACCESSORY_MOCKS.map(
    ({ id, name, slug, price, currency, brand, model, heroImage }) => ({
      id,
      name,
      slug,
      price,
      currency,
      brand,
      model,
      heroImage,
    })
  );
};

export const getAccessoryVariant = (
  accessory: Accessory,
  colorId: string
): AccessoryVariant | undefined => accessory.variants.find((variant) => variant.colorId === colorId);

export const getAccessoryDefaultSelections = (accessory: Accessory) => {
  const defaultBrand = accessory.brandOptions.find((brand) => brand.id === accessory.brand.id);
  const defaultModel = defaultBrand?.models.find((model) => model.id === accessory.model.id);
  const firstColor = accessory.colorOptions[0];
  const variant = firstColor ? getAccessoryVariant(accessory, firstColor.id) : undefined;

  return {
    brandId: defaultBrand?.id ?? accessory.brandOptions[0]?.id ?? accessory.brand.id,
    modelId: defaultModel?.id ?? accessory.model.id,
    colorId: firstColor?.id ?? '',
    variant,
  };
};


