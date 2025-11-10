'use client';

import type { Cart, CartItem, CartContextValue } from 'src/types/cart';

import { useMemo, useState, useEffect, useCallback, createContext } from 'react';

// ----------------------------------------------------------------------

export const CartContext = createContext<CartContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function CartProvider({ children }: Props) {
  const CART_STORAGE_KEY = 'bloop-cart';

  const calculateTotal = useCallback(
    (items: CartItem[]) => items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
    []
  );

  const createCartState = useCallback(
    (items: CartItem[]): Cart => ({
      items,
      total: calculateTotal(items),
    }),
    [calculateTotal]
  );

  const [cart, setCart] = useState<Cart>(() => createCartState([]));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsed = JSON.parse(storedCart) as Cart;
        const persistedItems = Array.isArray(parsed.items) ? parsed.items : [];
        setCart(createCartState(persistedItems));
      }
    } catch (error) {
      console.error('Error al restaurar el carrito desde localStorage', error);
      setCart(createCartState([]));
    } finally {
      setIsHydrated(true);
    }
  }, [CART_STORAGE_KEY, createCartState]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage', error);
    }
  }, [CART_STORAGE_KEY, cart, isHydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, 'cantidad'>) => {
      setCart((prev) => {
        // Si es un servicio y ya hay uno en el carrito, reemplazarlo
        if (item.type === 'servicio') {
          const otherItems = prev.items.filter((i) => i.type !== 'servicio');
          const newItem: CartItem = { ...item, cantidad: 1 };
          const newItems = [...otherItems, newItem];

          return createCartState(newItems);
        }

        // Si es un producto, verificar si ya existe para incrementar cantidad
        const existingIndex = prev.items.findIndex((i) => i.id === item.id);

        if (existingIndex !== -1) {
          const newItems = [...prev.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            cantidad: newItems[existingIndex].cantidad + 1,
          };

          return createCartState(newItems);
        }

        // Agregar nuevo producto
        const newItem: CartItem = { ...item, cantidad: 1 };
        const newItems = [...prev.items, newItem];

        return createCartState(newItems);
      });
    },
    [createCartState]
  );

  const removeItem = useCallback(
    (id: string) => {
      setCart((prev) => {
        const newItems = prev.items.filter((item) => item.id !== id);

        return createCartState(newItems);
      });
    },
    [createCartState]
  );

  const updateQuantity = useCallback(
    (id: string, cantidad: number) => {
      setCart((prev) => {
        if (cantidad <= 0) {
          // Si la cantidad es 0 o negativa, eliminar el item
          const newItems = prev.items.filter((item) => item.id !== id);

          return createCartState(newItems);
        }

        const newItems = prev.items.map((item) => {
          if (item.id === id) {
            // No permitir cambiar cantidad de servicios
            if (item.type === 'servicio') {
              return item;
            }
            return { ...item, cantidad };
          }
          return item;
        });

        return createCartState(newItems);
      });
    },
    [createCartState]
  );

  const clearCart = useCallback(() => {
    setCart(createCartState([]));
  }, [createCartState]);

  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.cantidad, 0),
    [cart.items]
  );

  const value = useMemo(
    () => ({
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
    }),
    [cart, addItem, removeItem, updateQuantity, clearCart, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
