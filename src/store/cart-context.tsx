'use client';

import type { CartContextValue, CartItem, Cart } from 'src/types/cart';

import { useMemo, useState, useCallback, createContext } from 'react';

// ----------------------------------------------------------------------

export const CartContext = createContext<CartContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function CartProvider({ children }: Props) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
  });

  const addItem = useCallback((item: Omit<CartItem, 'cantidad'>) => {
    setCart((prev) => {
      // Si es un servicio y ya hay uno en el carrito, reemplazarlo
      if (item.type === 'servicio') {
        const otherItems = prev.items.filter((i) => i.type !== 'servicio');
        const newItem: CartItem = { ...item, cantidad: 1 };
        const newItems = [...otherItems, newItem];
        const newTotal = newItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

        return {
          items: newItems,
          total: newTotal,
        };
      }

      // Si es un producto, verificar si ya existe para incrementar cantidad
      const existingIndex = prev.items.findIndex((i) => i.id === item.id);

      if (existingIndex !== -1) {
        const newItems = [...prev.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          cantidad: newItems[existingIndex].cantidad + 1,
        };
        const newTotal = newItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

        return {
          items: newItems,
          total: newTotal,
        };
      }

      // Agregar nuevo producto
      const newItem: CartItem = { ...item, cantidad: 1 };
      const newItems = [...prev.items, newItem];
      const newTotal = newItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

      return {
        items: newItems,
        total: newTotal,
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.id !== id);
      const newTotal = newItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

      return {
        items: newItems,
        total: newTotal,
      };
    });
  }, []);

  const updateQuantity = useCallback((id: string, cantidad: number) => {
    setCart((prev) => {
      if (cantidad <= 0) {
        // Si la cantidad es 0 o negativa, eliminar el item
        const newItems = prev.items.filter((item) => item.id !== id);
        const newTotal = newItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

        return {
          items: newItems,
          total: newTotal,
        };
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

      const newTotal = newItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

      return {
        items: newItems,
        total: newTotal,
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
    });
  }, []);

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
