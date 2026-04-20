import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getProductById, getPriceForQuantity } from "@/data/mock";
import { readStorageItem, writeStorageItem } from "@/utils/storage-keys";
const CartContext = createContext(void 0);
const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = readStorageItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    writeStorageItem("cart", JSON.stringify(items));
  }, [items]);
  const addItem = useCallback((productId, supplierId, quantity) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      const product = getProductById(productId);
      if (!product) return prev;
      const newQty = existing ? existing.quantity + quantity : quantity;
      const unitPrice = getPriceForQuantity(product, newQty);
      const item = { productId, supplierId, quantity: newQty, unitPrice, totalPrice: unitPrice * newQty };
      if (existing) {
        return prev.map((i) => i.productId === productId ? item : i);
      }
      return [...prev, item];
    });
  }, []);
  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems(
      (prev) => prev.map((i) => {
        if (i.productId !== productId) return i;
        const product = getProductById(productId);
        const unitPrice = product ? getPriceForQuantity(product, quantity) : i.unitPrice;
        return { ...i, quantity, unitPrice, totalPrice: unitPrice * quantity };
      })
    );
  }, []);
  const clearCart = useCallback(() => setItems([]), []);
  const getGroupedBySuppier = useCallback(() => {
    return items.reduce((acc, item) => {
      (acc[item.supplierId] ||= []).push(item);
      return acc;
    }, {});
  }, [items]);
  return <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount: items.length, getGroupedBySuppier }}>{children}</CartContext.Provider>;
};
const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
export {
  CartProvider,
  useCart
};
