import { create } from 'zustand';

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
};

// Color con código hex
export type ColorOption = {
  id: string;
  name: string;
  colorCode: string; // "#1E3A8A"
};

// Accesorio con colores disponibles
export type Accessory = {
  id: string;
  name: string;
  image: string;
  price: number;
  availableColors: ColorOption[]; // Colores disponibles para el accesorio
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
  reset: () => void;
};

// ============================================================================
// Mock Backend Functions - Simular llamadas al backend
// ============================================================================

// 1. Cuando selecciona ESTADO → Carga MODELOS disponibles
const fetchModelsForCondition = async (
  productId: string,
  conditionId: string
): Promise<ProductModel[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // iPhone
  if (productId === 'iphone-13-pro-max-001') {
    if (conditionId === 'new') {
      return [
        {
          id: 'model-13',
          name: 'iPhone 13',
          image: '/assets/images/mock/product-3.webp',
          price: 0,
          details: {
            screenSize: '6.1 pulgadas',
            camera: 'Dual cámara 12MP',
            otherDetail: 'Chip A15 Bionic',
          },
        },
        {
          id: 'model-13-pro',
          name: 'iPhone 13 Pro',
          image: '/assets/images/mock/product-2.webp',
          price: 0,
          details: {
            screenSize: '6.1 pulgadas ProMotion',
            camera: 'Triple cámara 12MP Pro',
            otherDetail: 'Chip A15 Bionic con GPU de 5 núcleos',
          },
        },
        {
          id: 'model-13-pro-max',
          name: 'iPhone 13 Pro Max',
          image: '/assets/images/mock/product-1.webp',
          price: 0,
          details: {
            screenSize: '6.7 pulgadas ProMotion',
            camera: 'Triple cámara 12MP Pro',
            otherDetail: 'Mayor duración de batería',
          },
        },
      ];
    }
    // Refurbished - solo algunos modelos disponibles
    return [
      {
        id: 'model-13-pro',
        name: 'iPhone 13 Pro (Reacondicionado)',
        image: '/assets/images/mock/product-5.webp',
        price: 0,
        details: {
          screenSize: '6.1 pulgadas (pantalla verificada)',
          camera: 'Triple cámara 12MP (calibrada)',
          otherDetail: 'Batería reemplazada al 100%',
        },
      },
      {
        id: 'model-13-pro-max',
        name: 'iPhone 13 Pro Max (Reacondicionado)',
        image: '/assets/images/mock/product-4.webp',
        price: 0,
        details: {
          screenSize: '6.7 pulgadas (pantalla verificada)',
          camera: 'Triple cámara 12MP (calibrada)',
          otherDetail: 'Batería reemplazada al 100%',
        },
      },
    ];
  }

  // Samsung
  if (productId === 's23-ultra-001') {
    return [
      {
        id: 'model-s23',
        name: 'Galaxy S23',
        image: '/assets/images/mock/product-8.webp',
        price: 0,
        details: {
          screenSize: '6.1 pulgadas Dynamic AMOLED',
          camera: 'Triple cámara 50MP',
          otherDetail: 'Snapdragon 8 Gen 2',
        },
      },
      {
        id: 'model-s23-plus',
        name: 'Galaxy S23 Plus',
        image: '/assets/images/mock/product-7.webp',
        price: 0,
        details: {
          screenSize: '6.6 pulgadas Dynamic AMOLED',
          camera: 'Triple cámara 50MP',
          otherDetail: 'Mayor batería',
        },
      },
      {
        id: 'model-s23-ultra',
        name: 'Galaxy S23 Ultra',
        image: '/assets/images/mock/product-6.webp',
        price: 0,
        details: {
          screenSize: '6.8 pulgadas Dynamic AMOLED 2X',
          camera: 'Quad cámara 200MP con zoom óptico 10x',
          otherDetail: 'Snapdragon 8 Gen 2 con S Pen integrado',
        },
      },
    ];
  }

  // AirPods
  if (productId === 'airpods-pro-2gen-001') {
    return [
      {
        id: 'model-airpods-pro-2',
        name: 'AirPods Pro (2da Gen)',
        image: '/assets/images/mock/product-18.webp',
        price: 0,
        details: {
          screenSize: '',
          camera: 'Cancelación activa de ruido adaptable',
          otherDetail: 'Chip H2 con audio espacial personalizado',
        },
      },
    ];
  }

  return [];
};

// 2. Cuando selecciona MODELO → Carga ALMACENAMIENTO
const fetchStorageForModel = async (
  productId: string,
  modelId: string,
  conditionId: string
): Promise<StorageOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  // iPhone
  if (productId === 'iphone-13-pro-max-001') {
    // Nuevo tiene más opciones que refurbished
    if (conditionId === 'new') {
      return [
        { id: 'storage-128', name: '128GB', price: 0 },
        { id: 'storage-256', name: '256GB', price: 3000 },
        { id: 'storage-512', name: '512GB', price: 6000 },
        { id: 'storage-1tb', name: '1TB', price: 9000 },
      ];
    }
    // Refurbished solo hasta 512GB
    return [
      { id: 'storage-128', name: '128GB', price: 0 },
      { id: 'storage-256', name: '256GB', price: 2500 },
      { id: 'storage-512', name: '512GB', price: 5000 },
    ];
  }

  // Samsung
  if (productId === 's23-ultra-001') {
    return [
      { id: 'storage-256', name: '256GB', price: 0 },
      { id: 'storage-512', name: '512GB', price: 4000 },
      { id: 'storage-1tb', name: '1TB', price: 8000 },
    ];
  }

  // AirPods no tienen almacenamiento
  return [];
};

// 3. Cuando selecciona ALMACENAMIENTO → Carga COLORES
const fetchColorsForStorage = async (
  productId: string,
  storageId: string
): Promise<ColorOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (productId === 'iphone-13-pro-max-001') {
    return [
      {
        id: 'color-blue',
        name: 'Azul Sierra',
        colorCode:
          'linear-gradient(180deg, #1A2A44 0%, #2D405B 20.31%, #0A1727 38.22%, #4A556E 55.29%)',
      },
      {
        id: 'color-graphite',
        name: 'Grafito',
        colorCode: 'linear-gradient(180deg, #54524F 0%, #3A3835 50%, #54524F 100%)',
      },
      {
        id: 'color-gold',
        name: 'Oro',
        colorCode: 'linear-gradient(180deg, #F4E8CE 0%, #E8D4A8 50%, #D4BD88 100%)',
      },
      { id: 'color-silver', name: 'Plata', colorCode: '#E3E4E5' },
    ];
  }

  if (productId === 's23-ultra-001') {
    return [
      {
        id: 'color-black',
        name: 'Phantom Black',
        colorCode: 'linear-gradient(180deg, #1A1A1A 0%, #000000 100%)',
      },
      { id: 'color-cream', name: 'Cream', colorCode: '#F5EDD6' },
      {
        id: 'color-green',
        name: 'Green',
        colorCode: 'linear-gradient(180deg, #C7D8C6 0%, #A8C4A7 100%)',
      },
      {
        id: 'color-lavender',
        name: 'Lavender',
        colorCode: 'linear-gradient(180deg, #E6DFF0 0%, #D4C8E1 100%)',
      },
    ];
  }

  if (productId === 'airpods-pro-2gen-001') {
    return [{ id: 'color-white', name: 'Blanco', colorCode: '#FFFFFF' }];
  }

  return [];
};

// 4. Cuando selecciona COLOR → Carga ACCESORIOS
const fetchAccessoriesForColor = async (
  productId: string,
  colorId: string
): Promise<Accessory[]> => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (productId === 'iphone-13-pro-max-001') {
    return [
      {
        id: 'case-apple-1',
        name: 'Funda MagSafe',
        image: '/assets/images/mock/product-10.webp',
        price: 1290,
        availableColors: [
          { id: 'case-black', name: 'Negro', colorCode: '#000000' },
          {
            id: 'case-blue',
            name: 'Azul',
            colorCode: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)',
          },
          {
            id: 'case-red',
            name: 'Rojo',
            colorCode: 'linear-gradient(180deg, #DC2626 0%, #EF4444 100%)',
          },
        ],
      },
      {
        id: 'charger-apple-1',
        name: 'Cargador 20W',
        image: '/assets/images/mock/product-11.webp',
        price: 590,
        availableColors: [{ id: 'charger-white', name: 'Blanco', colorCode: '#FFFFFF' }],
      },
      {
        id: 'cable-apple-1',
        name: 'Cable USB-C a Lightning',
        image: '/assets/images/mock/product-12.webp',
        price: 490,
        availableColors: [{ id: 'cable-white', name: 'Blanco', colorCode: '#FFFFFF' }],
      },
      {
        id: 'airpods-1',
        name: 'AirPods Pro',
        image: '/assets/images/mock/product-13.webp',
        price: 6990,
        availableColors: [{ id: 'airpods-white', name: 'Blanco', colorCode: '#FFFFFF' }],
      },
    ];
  }

  if (productId === 's23-ultra-001') {
    return [
      {
        id: 'case-samsung-1',
        name: 'Funda Protectora',
        image: '/assets/images/mock/product-14.webp',
        price: 890,
        availableColors: [
          { id: 'case-black', name: 'Negro', colorCode: '#000000' },
          {
            id: 'case-green',
            name: 'Verde',
            colorCode: 'linear-gradient(180deg, #2D5016 0%, #4A7C2E 100%)',
          },
        ],
      },
      {
        id: 'charger-samsung-1',
        name: 'Cargador Rápido 45W',
        image: '/assets/images/mock/product-15.webp',
        price: 790,
        availableColors: [{ id: 'charger-white', name: 'Blanco', colorCode: '#FFFFFF' }],
      },
      {
        id: 'spen-1',
        name: 'S Pen de Repuesto',
        image: '/assets/images/mock/product-16.webp',
        price: 1290,
        availableColors: [
          { id: 'spen-black', name: 'Negro', colorCode: '#000000' },
          { id: 'spen-white', name: 'Blanco', colorCode: '#FFFFFF' },
        ],
      },
      {
        id: 'buds-1',
        name: 'Galaxy Buds2 Pro',
        image: '/assets/images/mock/product-17.webp',
        price: 4990,
        availableColors: [
          { id: 'buds-graphite', name: 'Grafito', colorCode: '#4A4A4A' },
          { id: 'buds-white', name: 'Blanco', colorCode: '#FFFFFF' },
        ],
      },
    ];
  }

  if (productId === 'airpods-pro-2gen-001') {
    return [
      {
        id: 'case-airpods-1',
        name: 'Estuche de Silicona',
        image: '/assets/images/mock/product-21.webp',
        price: 490,
        availableColors: [
          { id: 'case-white', name: 'Blanco', colorCode: '#FFFFFF' },
          { id: 'case-black', name: 'Negro', colorCode: '#000000' },
        ],
      },
      {
        id: 'strap-airpods-1',
        name: 'Correa para Estuche',
        image: '/assets/images/mock/product-22.webp',
        price: 290,
        availableColors: [{ id: 'strap-black', name: 'Negro', colorCode: '#000000' }],
      },
      {
        id: 'tips-airpods-1',
        name: 'Puntas de Repuesto (4 pares)',
        image: '/assets/images/mock/product-23.webp',
        price: 390,
        availableColors: [{ id: 'tips-white', name: 'Blanco', colorCode: '#FFFFFF' }],
      },
    ];
  }

  return [];
};

// ============================================================================
// Mock Initial Data - Datos iniciales de productos
// ============================================================================

export const getInitialProductData = (id: string): InitialProductData | null => {
  const mockInitialData: Record<string, InitialProductData> = {
    'iphone-13-pro-max-001': {
      id: 'iphone-13-pro-max-001',
      marca: 'Apple',
      modelo: 'iPhone 13 Pro Max',
      bannerBackgroundImage: '/assets/background/banner/iPhone.png',
      bannerVariants: [
        { id: 'mini', label: 'mini' },
        { id: 'pro', label: 'PRO' },
        { id: 'pro-max', label: 'PRO MAX' },
      ],
      thumbnailImage: '/assets/images/mock/product-1.webp',
      // ESTADOS vienen en carga inicial (Nuevo/Refurbished)
      conditions: [
        {
          id: 'new',
          name: 'Nuevo',
          price: 22990,
          description: 'Producto completamente nuevo con garantía completa del fabricante',
          images: [
            '/assets/images/mock/product-1.webp',
            '/assets/images/mock/product-2.webp',
            '/assets/images/mock/product-3.webp',
          ],
        },
        {
          id: 'refurbished',
          name: 'Refurbished',
          price: 19541,
          description: 'Producto reacondicionado certificado con garantía de 6 meses',
          images: ['/assets/images/mock/product-4.webp', '/assets/images/mock/product-5.webp'],
        },
      ],
    },

    's23-ultra-001': {
      id: 's23-ultra-001',
      marca: 'Samsung',
      modelo: 'Galaxy S23 Ultra',
      bannerBackgroundImage: '/assets/background/banner/Samsung.png',
      bannerVariants: [
        { id: 'standard', label: 'Standard' },
        { id: 'plus', label: 'Plus' },
        { id: 'ultra', label: 'Ultra' },
      ],
      thumbnailImage: '/assets/images/mock/product-6.webp',
      conditions: [
        {
          id: 'new',
          name: 'Nuevo',
          price: 24990,
          description: 'Producto completamente nuevo con garantía completa del fabricante',
          images: [
            '/assets/images/mock/product-6.webp',
            '/assets/images/mock/product-7.webp',
            '/assets/images/mock/product-8.webp',
          ],
        },
        {
          id: 'refurbished',
          name: 'Refurbished',
          price: 21241,
          description: 'Producto reacondicionado certificado con garantía de 6 meses',
          images: ['/assets/images/mock/product-9.webp'],
        },
      ],
    },

    'airpods-pro-2gen-001': {
      id: 'airpods-pro-2gen-001',
      marca: 'Apple',
      modelo: 'AirPods Pro (2da Generación)',
      bannerBackgroundImage: '/assets/background/banner/iPhone.png',
      bannerVariants: [],
      thumbnailImage: '/assets/images/mock/product-18.webp',
      conditions: [
        {
          id: 'new',
          name: 'Nuevo',
          price: 6990,
          description: 'Producto completamente nuevo con garantía completa del fabricante',
          images: ['/assets/images/mock/product-18.webp', '/assets/images/mock/product-19.webp'],
        },
        {
          id: 'refurbished',
          name: 'Refurbished',
          price: 5941,
          description: 'Producto reacondicionado certificado con garantía de 6 meses',
          images: ['/assets/images/mock/product-20.webp'],
        },
      ],
    },
  };

  return mockInitialData[id] || null;
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
      get().calculateTotalPrice();
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
    const { product } = get();
    if (!product) return;

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
      const colors = await fetchColorsForStorage(product.id, storageId);
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
    const { product } = get();
    if (!product) return;

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
      const accessories = await fetchAccessoriesForColor(product.id, colorId);
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
