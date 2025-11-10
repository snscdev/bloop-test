import { create } from 'zustand';

import * as productService from 'src/services/product-service';

// Types

// Variante del banner (mini, pro, pro-max)
export type ProductVariant = {
  id: string;
  label: string;
};

// Estado con precio propio
export type ProductCondition = {
  id: string;
  name: string; // "Nuevo" o "Refurbished"
  price: number;
  description: string;
  images: string[]; // Array para carrusel
};

// Almacenamiento
export type StorageOption = {
  id: string;
  name: string; // "128GB"
  price: number;
  icon?: string; // SVG data-uri o URL
  iconType?: string; // "data-uri" u otro tipo
  isDefault?: boolean;
  isAvailable?: boolean;
};

// Modelo con detalles específicos
export type ProductModel = {
  id: string;
  name: string;
  image: string;
  price: number;
  details: {
    screenSize: string; // "6.7 pulgadas"
    camera: string; // "Triple cámara 48MP"
    otherDetail?: string; // Detalle adicional opcional
  };
  gallery?: string[]; // Imágenes para el carrusel de checkout
  isDefault?: boolean;
  isAvailable?: boolean;
};

// Color con código hex y gradiente
export type ColorOption = {
  id: string;
  name: string;
  colorCode: string; // "#1E3A8A" o gradient del backend: "linear-gradient(...)"
  gradient?: string; // CSS gradient string (opcional, se usa colorCode si no existe)
  isDefault?: boolean;
  isAvailable?: boolean;
};

// Accesorio con colores disponibles
export type Accessory = {
  id: string;
  name: string;
  image: string;
  price: number;
  availableColors: ColorOption[]; // Colores disponibles para el accesorio
  gallery: string[]; // Array de URLs de imágenes para el carrusel
};

// Estado de carga para cada sección
type LoadingState = {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
};

// Datos iniciales (carga inmediata)
export type InitialProductData = {
  id: string;
  marca: string;
  modelo: string;
  bannerBackgroundImage: string;
  bannerVariants: ProductVariant[];
  thumbnailImage: string;
  conditions: ProductCondition[]; // Ya vienen en carga inicial (Nuevo/Refurbished)
};

// Producto completo con datos que se cargan progresivamente
export type ProductData = InitialProductData & {
  models?: ProductModel[]; // Se carga al seleccionar estado
  storage?: StorageOption[]; // Se carga al seleccionar modelo
  colors?: ColorOption[]; // Se carga al seleccionar almacenamiento
  accessories?: Accessory[]; // Se carga al seleccionar color
};

// Opciones seleccionadas
export type SelectedOptions = {
  conditionId: string;
  storageId: string;
  modelId: string;
  colorId: string;
  accessoryIds: string[]; // IDs de accesorios seleccionados
  accessoryColors: Record<string, string>; // {accessoryId: colorId}
};

type ProductCheckoutState = {
  // Product data
  product: ProductData | null;

  // Selected options
  selectedOptions: SelectedOptions;

  // Current checkout step (0-5)
  currentStep: number;

  // Computed price
  totalPrice: number;

  // Estados de carga por sección
  loadingStates: {
    models: LoadingState; // Se carga al seleccionar estado
    storage: LoadingState; // Se carga al seleccionar modelo
    colors: LoadingState; // Se carga al seleccionar almacenamiento
    accessories: LoadingState; // Se carga al seleccionar color
  };

  // Actions
  setInitialProduct: (data: InitialProductData) => void;
  setCondition: (conditionId: string) => Promise<void>; // Carga modelos
  setModel: (modelId: string) => Promise<void>; // Carga almacenamiento
  setStorage: (storageId: string) => Promise<void>; // Carga colores
  setColor: (colorId: string) => Promise<void>; // Carga accesorios
  toggleAccessory: (accessoryId: string) => void;
  setAccessoryColor: (accessoryId: string, colorId: string) => void;
  setCurrentStep: (step: number) => void;
  calculateTotalPrice: () => number;
  createPaymentSession: (params: { successUrl: string; cancelUrl: string }) => Promise<string>;
  reset: () => void;
};

// ============================================================================
// Backend Functions - Llamadas reales al API
// ============================================================================

// 1. Cuando selecciona ESTADO → Carga MODELOS disponibles
const fetchModelsForCondition = async (
  productId: string,
  conditionId: string
): Promise<ProductModel[]> => {
  const response = await productService.fetchModels(productId, conditionId);
  return response.models;
};

// 2. Cuando selecciona MODELO → Carga ALMACENAMIENTO
const fetchStorageForModel = async (
  productId: string,
  modelId: string,
  conditionId: string
): Promise<StorageOption[]> => {
  const response = await productService.fetchStorage(productId, modelId, conditionId);
  return response.storage;
};

// 3. Cuando selecciona ALMACENAMIENTO → Carga COLORES
const fetchColorsForStorage = async (
  productId: string,
  storageId: string,
  modelId: string,
  conditionId: string
): Promise<ColorOption[]> => {
  const response = await productService.fetchColors(productId, storageId, modelId, conditionId);
  // El backend devuelve colorCode que puede ser un color sólido o un gradiente
  // Mantenemos compatibilidad con el código existente
  return response.colors.map((color) => ({
    ...color,
    gradient: color.colorCode, // Usar colorCode como gradient para compatibilidad
  }));
};

// 4. Cuando selecciona COLOR → Carga ACCESORIOS
const fetchAccessoriesForColor = async (
  productId: string,
  colorId: string,
  modelId: string,
  storageId: string
): Promise<Accessory[]> => {
  const response = await productService.fetchAccessories(productId, colorId, modelId, storageId);
  // El backend devuelve colorCode, agregamos gradient para compatibilidad
  return response.accessories.map((accessory) => ({
    ...accessory,
    availableColors: accessory.availableColors.map((color) => ({
      ...color,
      gradient: color.colorCode, // Usar colorCode como gradient para compatibilidad
    })),
  }));
};

// ============================================================================
// Initial Data - Datos iniciales de productos desde el backend
// ============================================================================

export const getInitialProductData = async (id: string): Promise<InitialProductData | null> => {
  try {
    const data = await productService.fetchInitialProduct(id);
    return data;
  } catch (error) {
    console.error('Error fetching initial product data:', error);
    return null;
  }
};

// ============================================================================
// Zustand Store - Implementación con carga progresiva
// ============================================================================

export const useProductCheckoutStore = create<ProductCheckoutState>((set, get) => ({
  // Initial state
  product: null,
  selectedOptions: {
    conditionId: '',
    modelId: '',
    storageId: '',
    colorId: '',
    accessoryIds: [],
    accessoryColors: {},
  },
  currentStep: 0,
  totalPrice: 0,
  loadingStates: {
    models: { isLoading: false, isLoaded: false, error: null },
    storage: { isLoading: false, isLoaded: false, error: null },
    colors: { isLoading: false, isLoaded: false, error: null },
    accessories: { isLoading: false, isLoaded: false, error: null },
  },

  // Actions - Sin selecciones automáticas
  setInitialProduct: (data) => {
    set({
      product: data,
      selectedOptions: {
        conditionId: '', // VACÍO
        modelId: '', // VACÍO
        storageId: '', // VACÍO
        colorId: '', // VACÍO
        accessoryIds: [],
        accessoryColors: {},
      },
      totalPrice: 0, // Precio en 0 hasta que seleccione
      loadingStates: {
        models: { isLoading: false, isLoaded: false, error: null },
        storage: { isLoading: false, isLoaded: false, error: null },
        colors: { isLoading: false, isLoaded: false, error: null },
        accessories: { isLoading: false, isLoaded: false, error: null },
      },
    });
  },

  // 1. Usuario selecciona ESTADO → Carga MODELOS
  setCondition: async (conditionId) => {
    const { product } = get();
    if (!product) return;

    set((state) => ({
      selectedOptions: {
        conditionId,
        modelId: '',
        storageId: '',
        colorId: '',
        accessoryIds: [],
        accessoryColors: {},
      },
      loadingStates: {
        models: { isLoading: true, isLoaded: false, error: null },
        storage: { isLoading: false, isLoaded: false, error: null },
        colors: { isLoading: false, isLoaded: false, error: null },
        accessories: { isLoading: false, isLoaded: false, error: null },
      },
      product: {
        ...state.product!,
        models: undefined,
        storage: undefined,
        colors: undefined,
        accessories: undefined,
      },
    }));

    try {
      const models = await fetchModelsForCondition(product.id, conditionId);
      set((state) => ({
        product: { ...state.product!, models },
        loadingStates: {
          ...state.loadingStates,
          models: { isLoading: false, isLoaded: true, error: null },
        },
      }));
      get().calculateTotalPrice();
    } catch {
      set((state) => ({
        loadingStates: {
          ...state.loadingStates,
          models: { isLoading: false, isLoaded: false, error: 'Error al cargar modelos' },
        },
      }));
    }
  },

  // 2. Usuario selecciona MODELO → Carga ALMACENAMIENTO
  setModel: async (modelId) => {
    const { product, selectedOptions } = get();
    if (!product || !selectedOptions.conditionId) return;

    set((state) => ({
      selectedOptions: {
        ...state.selectedOptions,
        modelId,
        storageId: '',
        colorId: '',
        accessoryIds: [],
        accessoryColors: {},
      },
      loadingStates: {
        ...state.loadingStates,
        storage: { isLoading: true, isLoaded: false, error: null },
        colors: { isLoading: false, isLoaded: false, error: null },
        accessories: { isLoading: false, isLoaded: false, error: null },
      },
      product: {
        ...state.product!,
        storage: undefined,
        colors: undefined,
        accessories: undefined,
      },
    }));

    try {
      const storage = await fetchStorageForModel(product.id, modelId, selectedOptions.conditionId);
      set((state) => ({
        product: { ...state.product!, storage },
        loadingStates: {
          ...state.loadingStates,
          storage: { isLoading: false, isLoaded: true, error: null },
        },
      }));

      // Auto-seleccionar el almacenamiento con precio 0 (incluido) y cargar colores
      const includedStorage = storage.find((s) => s.price === 0);
      if (includedStorage) {
        // Llamar a setStorage para seleccionar y cargar colores automáticamente
        await get().setStorage(includedStorage.id);
      } else {
        get().calculateTotalPrice();
      }
    } catch {
      set((state) => ({
        loadingStates: {
          ...state.loadingStates,
          storage: { isLoading: false, isLoaded: false, error: 'Error al cargar almacenamiento' },
        },
      }));
    }
  },

  // 3. Usuario selecciona ALMACENAMIENTO → Carga COLORES
  setStorage: async (storageId) => {
    const { product, selectedOptions } = get();
    if (!product || !selectedOptions.modelId || !selectedOptions.conditionId) return;

    set((state) => ({
      selectedOptions: {
        ...state.selectedOptions,
        storageId,
        colorId: '',
        accessoryIds: [],
        accessoryColors: {},
      },
      loadingStates: {
        ...state.loadingStates,
        colors: { isLoading: true, isLoaded: false, error: null },
        accessories: { isLoading: false, isLoaded: false, error: null },
      },
      product: {
        ...state.product!,
        colors: undefined,
        accessories: undefined,
      },
    }));

    try {
      const colors = await fetchColorsForStorage(
        product.id,
        storageId,
        selectedOptions.modelId,
        selectedOptions.conditionId
      );
      set((state) => ({
        product: { ...state.product!, colors },
        loadingStates: {
          ...state.loadingStates,
          colors: { isLoading: false, isLoaded: true, error: null },
        },
      }));
      get().calculateTotalPrice();
    } catch {
      set((state) => ({
        loadingStates: {
          ...state.loadingStates,
          colors: { isLoading: false, isLoaded: false, error: 'Error al cargar colores' },
        },
      }));
    }
  },

  // 4. Usuario selecciona COLOR → Carga ACCESORIOS
  setColor: async (colorId) => {
    const { product, selectedOptions } = get();
    if (!product || !selectedOptions.modelId || !selectedOptions.storageId) return;

    set((state) => ({
      selectedOptions: {
        ...state.selectedOptions,
        colorId,
        accessoryIds: [],
        accessoryColors: {},
      },
      loadingStates: {
        ...state.loadingStates,
        accessories: { isLoading: true, isLoaded: false, error: null },
      },
      product: {
        ...state.product!,
        accessories: undefined,
      },
    }));

    try {
      const accessories = await fetchAccessoriesForColor(
        product.id,
        colorId,
        selectedOptions.modelId,
        selectedOptions.storageId
      );
      set((state) => ({
        product: { ...state.product!, accessories },
        loadingStates: {
          ...state.loadingStates,
          accessories: { isLoading: false, isLoaded: true, error: null },
        },
      }));
    } catch {
      set((state) => ({
        loadingStates: {
          ...state.loadingStates,
          accessories: { isLoading: false, isLoaded: false, error: 'Error al cargar accesorios' },
        },
      }));
    }
  },

  toggleAccessory: (accessoryId) => {
    set((state) => {
      const accessoryIds = state.selectedOptions.accessoryIds.includes(accessoryId)
        ? state.selectedOptions.accessoryIds.filter((id) => id !== accessoryId)
        : [...state.selectedOptions.accessoryIds, accessoryId];

      // Si se remueve, también remover el color seleccionado
      const accessoryColors = { ...state.selectedOptions.accessoryColors };
      if (!accessoryIds.includes(accessoryId)) {
        delete accessoryColors[accessoryId];
      }

      return {
        selectedOptions: { ...state.selectedOptions, accessoryIds, accessoryColors },
      };
    });
    get().calculateTotalPrice();
  },

  setAccessoryColor: (accessoryId, colorId) => {
    set((state) => ({
      selectedOptions: {
        ...state.selectedOptions,
        accessoryColors: {
          ...state.selectedOptions.accessoryColors,
          [accessoryId]: colorId,
        },
      },
    }));
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  calculateTotalPrice: () => {
    const state = get();
    const { product, selectedOptions } = state;

    if (!product) return 0;

    let total = 0;

    // 1. Precio base del estado seleccionado
    const condition = product.conditions?.find((c) => c.id === selectedOptions.conditionId);
    if (condition) total += condition.price;

    // 2. Precio del almacenamiento (incremento)
    const storage = product.storage?.find((s) => s.id === selectedOptions.storageId);
    if (storage) total += storage.price;

    // 3. Precio de accesorios
    selectedOptions.accessoryIds.forEach((accId) => {
      const accessory = product.accessories?.find((a) => a.id === accId);
      if (accessory) total += accessory.price;
    });

    set({ totalPrice: total });
    return total;
  },

  createPaymentSession: async ({ successUrl, cancelUrl }) => {
    const state = get();
    const { product, selectedOptions } = state;

    if (!product) throw new Error('Producto no disponible.');

    const { conditionId, modelId, storageId, colorId } = selectedOptions;
    if (!conditionId || !modelId) {
      throw new Error('Selecciona un estado y un modelo antes de continuar.');
    }

    const selectedCondition = product.conditions?.find((c) => c.id === conditionId);
    const selectedModel = product.models?.find((m) => m.id === modelId);
    const selectedStorage = storageId ? product.storage?.find((s) => s.id === storageId) : null;
    const selectedColor = colorId ? product.colors?.find((c) => c.id === colorId) : null;

    // Recalcular total para asegurar datos frescos
    const recalculatedTotal = get().calculateTotalPrice();
    const baseTotal = recalculatedTotal || state.totalPrice;
    if (!baseTotal) {
      throw new Error('No se pudo calcular el total del pedido.');
    }

    const quantity = 1;

    const inventoryValidation = await productService.validateProductInventory(product.id, {
      conditionId,
      modelId,
      storageId: storageId || undefined,
      colorId: colorId || undefined,
      quantity,
    });

    if (!inventoryValidation.available || !inventoryValidation.variantId) {
      throw new Error('No hay inventario disponible para esta configuración.');
    }

    const itemPrice = inventoryValidation.price ?? baseTotal;
    const locationId = inventoryValidation.locationId;

    const detailedProductName = [
      product.modelo,
      selectedModel?.name,
      selectedStorage?.name,
      selectedColor?.name,
      selectedCondition?.name,
    ]
      .filter(Boolean)
      .join(' - ');

    const paymentPayload = {
      items: [
        {
          variantId: inventoryValidation.variantId,
          quantity,
          productName: detailedProductName || product.modelo,
          price: itemPrice,
        },
      ],
      locationId,
      amount: itemPrice * quantity,
      currency: 'ARS',
      productName: product.modelo,
      successUrl,
      cancelUrl,
    };

    const paymentSession = await productService.createPaymentSession(paymentPayload);

    if (!paymentSession.paymentUrl) {
      throw new Error('No se pudo iniciar la sesión de pago.');
    }

    return paymentSession.paymentUrl;
  },

  reset: () => {
    const state = get();
    if (!state.product) return;

    set({
      selectedOptions: {
        conditionId: '',
        modelId: '',
        storageId: '',
        colorId: '',
        accessoryIds: [],
        accessoryColors: {},
      },
      currentStep: 0,
      totalPrice: 0,
      loadingStates: {
        models: { isLoading: false, isLoaded: false, error: null },
        storage: { isLoading: false, isLoaded: false, error: null },
        colors: { isLoading: false, isLoaded: false, error: null },
        accessories: { isLoading: false, isLoaded: false, error: null },
      },
    });
  },
}));
