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

// Tipos auxiliares para validación de inventario
export type ValidateInventoryPayload = {
  conditionId: string;
  modelId: string;
  storageId?: string;
  colorId?: string;
  quantity: number;
};

export type ValidateInventoryResponse = {
  available: boolean;
  variantId?: string;
  locationId?: string;
  price?: number;
  stock?: number;
  reserved?: number;
  availableQuantity?: number;
};

// Tipos para creación de sesiones de pago
export type PaymentSessionItem = {
  variantId: string;
  quantity: number;
  productName: string;
  price: number;
};

export type CreatePaymentSessionPayload = {
  items: PaymentSessionItem[];
  locationId?: string;
  amount: number;
  currency: string;
  productName: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export type CreatePaymentSessionResponse = {
  id: string;
  externalId: string;
  amount: number;
  currency: string;
  productName: string;
  successUrl: string;
  cancelUrl: string;
  appName: string;
  userId: string;
  userEmail: string;
  status: string;
  metadata?: Record<string, string>;
  paymentUrl: string;
  locationId?: string;
  items: Array<{
    id: string;
    variantId: string;
    quantity: number;
    price: number;
    productName: string;
    locationId?: string;
  }>;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

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

/**
 * Valida inventario para las opciones seleccionadas del usuario
 * POST /products/{productHandle}/validate-inventory
 */
export const validateProductInventory = async (
  productHandle: string,
  payload: ValidateInventoryPayload
): Promise<ValidateInventoryResponse> => {
  const response = await axiosInstance.post<ValidateInventoryResponse>(
    `/products/${productHandle}/validate-inventory`,
    payload
  );
  return response.data;
};

/**
 * Crea una sesión de pago
 * POST /payment-sessions/create
 */
export const createPaymentSession = async (
  payload: CreatePaymentSessionPayload
): Promise<CreatePaymentSessionResponse> => {
  const response = await axiosInstance.post<CreatePaymentSessionResponse>(
    '/payment-sessions/create',
    payload
  );
  return response.data;
};
