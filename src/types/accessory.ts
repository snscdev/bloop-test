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
  modelId?: string;
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

export type AccessoryBrandVariant = {
  brandId: string;
  brandName: string;
  brandSlug: string;
  models: AccessoryModelOption[];
  colorOptions: AccessoryColorOption[];
  variants: AccessoryVariant[];
  gallery: AccessoryImage[];
  price: number;
  heroImage: AccessoryImage;
};

export type Accessory = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  currency: string;
  brandVariants: AccessoryBrandVariant[];
  compatibility: string[];
  highlights: string[];
};

export type AccessorySummary = {
  id: string;
  name: string;
  slug: string;
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
  heroImage: AccessoryImage;
};


