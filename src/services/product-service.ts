import type {
  ModelsResponse,
  ColorsResponse,
  StorageResponse,
  AccessoriesResponse,
  InitialProductResponse,
} from 'src/types/api-products';

import { createAxiosInstance } from 'src/lib/axios';

// ============================================================================
// Servicio de Productos - Llamadas al Backend
// ============================================================================

const axiosInstance = createAxiosInstance({ useBackendUrl: true });

/**
 * Obtiene los datos iniciales de un producto
 * GET /products/{productId}/initial
 */
export const fetchInitialProduct = async (productId: string): Promise<InitialProductResponse> => {
  const response = await axiosInstance.get<InitialProductResponse>(
    `/products/${productId}/initial`
  );
  return response.data;
};

/**
 * Obtiene los modelos disponibles para una condición específica
 * GET /products/{productId}/conditions/{conditionId}/models
 */
export const fetchModels = async (
  productId: string,
  conditionId: string
): Promise<ModelsResponse> => {
  const response = await axiosInstance.get<ModelsResponse>(
    `/products/${productId}/conditions/${conditionId}/models`
  );
  return response.data;
};

/**
 * Obtiene las opciones de almacenamiento para un modelo y condición específicos
 * GET /products/{productId}/models/{modelId}/conditions/{conditionId}/storage
 */
export const fetchStorage = async (
  productId: string,
  modelId: string,
  conditionId: string
): Promise<StorageResponse> => {
  const response = await axiosInstance.get<StorageResponse>(
    `/products/${productId}/models/${modelId}/conditions/${conditionId}/storage`
  );
  return response.data;
};

/**
 * Obtiene los colores disponibles para un almacenamiento específico
 * GET /products/{productId}/storage/{storageId}/colors?modelId={modelId}&conditionId={conditionId}
 */
export const fetchColors = async (
  productId: string,
  storageId: string,
  modelId: string,
  conditionId: string
): Promise<ColorsResponse> => {
  const response = await axiosInstance.get<ColorsResponse>(
    `/products/${productId}/storage/${storageId}/colors`,
    {
      params: {
        modelId,
        conditionId,
      },
    }
  );
  return response.data;
};

/**
 * Obtiene los accesorios disponibles para un color específico
 * GET /products/{productId}/colors/{colorId}/accessories?modelId={modelId}&storageId={storageId}
 */
export const fetchAccessories = async (
  productId: string,
  colorId: string,
  modelId: string,
  storageId: string
): Promise<AccessoriesResponse> => {
  const response = await axiosInstance.get<AccessoriesResponse>(
    `/products/${productId}/colors/${colorId}/accessories`,
    {
      params: {
        modelId,
        storageId,
      },
    }
  );
  return response.data;
};
