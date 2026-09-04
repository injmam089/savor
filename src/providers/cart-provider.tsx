'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  id?: string;
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  isVeg: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { data: session, status } = useSession();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      const fetchCart = async () => {
        try {
          const res = await fetch('/api/cart');
          if (res.ok) {
            const data = await res.json();
            setItems(data.items || []);
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          setInitialized(true);
        }
      };
      fetchCart();
    } else {
      const savedCart = localStorage.getItem('savor-cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from local storage', e);
        }
      }
      setInitialized(true);
    }
  }, [session, status]);

  useEffect(() => {
    if (!initialized) return;
    if (!session?.user) {
      localStorage.setItem('savor-cart', JSON.stringify(items));
    }
  }, [items, session, initialized]);

  const addItem = async (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });

    if (session?.user) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ menuItemId: item.menuItemId, quantity: item.quantity }),
        });
      } catch (error) {
        console.error('Failed to add item to remote cart', error);
      }
    }
  };

  const removeItem = async (menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    if (session?.user) {
      try {
        await fetch(`/api/cart/${menuItemId}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Failed to remove item from remote cart', error);
      }
    }
  };

  const updateQuantity = async (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    );
    if (session?.user) {
      try {
        await fetch(`/api/cart/${menuItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        });
      } catch (error) {
        console.error('Failed to update remote cart item', error);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (session?.user) {
      try {
        await fetch('/api/cart', { method: 'DELETE' });
      } catch (error) {
        console.error('Failed to clear remote cart', error);
      }
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
