// ============================================================================
// Tipos de Respuesta del API de Productos
// ============================================================================

// Respuesta del endpoint: GET /api/v1/products/{id}/initial
export type InitialProductResponse = {
  id: string;
  marca: string;
  modelo: string;
  bannerBackgroundImage: string;
  bannerVariants: Array<{
    id: string;
    label: string;
  }>;
  thumbnailImage: string;
  conditions: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
  }>;
};

// Respuesta del endpoint: GET /api/v1/products/{id}/conditions/{conditionId}/models
export type ModelsResponse = {
  models: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    details: {
      screenSize: string;
      camera: string;
      otherDetail: string;
    };
    isDefault: boolean;
    isAvailable: boolean;
  }>;
};

// Respuesta del endpoint: GET /api/v1/products/{id}/models/{modelId}/conditions/{conditionId}/storage
export type StorageResponse = {
  storage: Array<{
    id: string;
    name: string;
    price: number;
    icon: string;
    iconType: string;
    isDefault: boolean;
    isAvailable: boolean;
  }>;
};

// Respuesta del endpoint: GET /api/v1/products/{id}/storage/{storageId}/colors
// Query params: modelId, conditionId
export type ColorsResponse = {
  colors: Array<{
    id: string;
    name: string;
    colorCode: string;
    isDefault: boolean;
    isAvailable: boolean;
  }>;
};

// Respuesta del endpoint: GET /api/v1/products/{id}/colors/{colorId}/accessories
// Query params: modelId, storageId
export type AccessoriesResponse = {
  accessories: Array<{
    id: string;
    name: string;
    image: string;
    gallery: string[];
    price: number;
    availableColors: Array<{
      id: string;
      name: string;
      colorCode: string;
    }>;
  }>;
};

