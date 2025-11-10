// ----------------------------------------------------------------------

export type AccessoryImage = {
  id: string;
  url: string;
  alt: string;
};

export type AccessoryColorOption = {
  id: string;
  name: string;
  value: string;
  hex?: string;
};

export type AccessoryVariant = {
  id: string;
  colorId: string;
  images: AccessoryImage[];
  price: number;
  stock: number;
  sku?: string;
};

export type AccessoryModelOption = {
  id: string;
  name: string;
  slug: string;
};

export type AccessoryBrandOption = {
  id: string;
  name: string;
  slug: string;
  models: AccessoryModelOption[];
};

export type Accessory = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: string;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  model: {
    id: string;
    name: string;
    slug: string;
  };
  brandOptions: AccessoryBrandOption[];
  colorOptions: AccessoryColorOption[];
  variants: AccessoryVariant[];
  heroImage: AccessoryImage;
  gallery: AccessoryImage[];
  compatibility: string[];
  highlights: string[];
};

export type AccessorySummary = Pick<
  Accessory,
  'id' | 'name' | 'slug' | 'price' | 'currency' | 'brand' | 'model' | 'heroImage'
>;


