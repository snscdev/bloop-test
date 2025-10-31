// ----------------------------------------------------------------------

export type CartItemType = 'producto' | 'servicio';

export type CartItem = {
  id: string;
  type: CartItemType;
  marca?: string; // Solo para productos
  modelo?: string; // Solo para productos
  servicio?: string; // Solo para servicios
  nombre: string;
  precio: number;
  cantidad: number; // Siempre 1 para servicios
  imagen?: string;
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
