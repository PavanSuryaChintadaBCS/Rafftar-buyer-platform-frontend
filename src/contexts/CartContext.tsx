import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CartItem } from "@/data/types";
import { getProductById, getPriceForQuantity } from "@/data/mock";

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, supplierId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  getGroupedBySuppier: () => Record<string, CartItem[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("buildmart_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("buildmart_cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((productId: string, supplierId: string, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      const product = getProductById(productId);
      if (!product) return prev;
      const newQty = existing ? existing.quantity + quantity : quantity;
      const unitPrice = getPriceForQuantity(product, newQty);
      const item: CartItem = { productId, supplierId, quantity: newQty, unitPrice, totalPrice: unitPrice * newQty };
      if (existing) {
        return prev.map((i) => (i.productId === productId ? item : i));
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId !== productId) return i;
        const product = getProductById(productId);
        const unitPrice = product ? getPriceForQuantity(product, quantity) : i.unitPrice;
        return { ...i, quantity, unitPrice, totalPrice: unitPrice * quantity };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getGroupedBySuppier = useCallback(() => {
    return items.reduce<Record<string, CartItem[]>>((acc, item) => {
      (acc[item.supplierId] ||= []).push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount: items.length, getGroupedBySuppier }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
