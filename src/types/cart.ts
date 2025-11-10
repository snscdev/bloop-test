// ----------------------------------------------------------------------

export type CartItemType = 'producto' | 'servicio';

export type CartAccessoryOption = {
  id: string;
  name: string;
  color?: {
    id: string;
    name: string;
    value?: string;
  };
};

export type CartItemOptions = {
  condition?: {
    id: string;
    name: string;
  };
  model?: {
    id: string;
    name: string;
  };
  storage?: {
    id: string;
    name: string;
  };
  color?: {
    id: string;
    name: string;
    value?: string;
  };
  accessories?: CartAccessoryOption[];
};

export type CartItem = {
  id: string;
  type: CartItemType;
  productId?: string;
  marca?: string; // Solo para productos
  modelo?: string; // Solo para productos
  servicio?: string; // Solo para servicios
  nombre: string;
  precio: number;
  cantidad: number; // Siempre 1 para servicios
  imagen?: string;
  options?: CartItemOptions;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export type CartContextValue = {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'cantidad'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  clearCart: () => void;
  itemCount: number;
};
