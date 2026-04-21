
import {
  createContext, useContext, useState, useCallback, useMemo, useEffect
} from "react";
import { readStorageItem, writeStorageItem } from "@/utils/storage-keys";
import { safeParse } from "@/utils/persist";
import { getProductById, getPriceForQuantity } from "@/data/mock";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() =>
    safeParse(readStorageItem("cart"), [])
  );

  useEffect(() => {
    writeStorageItem("cart", JSON.stringify(items));
  }, [items]);

  const update = useCallback((fn) => {
    setItems((prev) => fn(prev));
  }, []);

  const addItem = useCallback((productId, supplierId, qty) => {
    const quantity = Math.max(1, Math.floor(qty));

    update((prev) => {
      const existing = prev.find(
        (i) => i.productId === productId && i.supplierId === supplierId
      );

      const product = getProductById(productId);
      if (!product) return prev;

      const newQty = existing ? existing.quantity + quantity : quantity;
      const unitPrice = getPriceForQuantity(product, newQty);

      // const item = { productId, supplierId, quantity: newQty, unitPrice };

      const item = {
        productId,
        supplierId,
        quantity: newQty,
        unitPrice,
        totalPrice: unitPrice * newQty
      };

      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.supplierId === supplierId ? item : i
        );
      }

      return [...prev, item];
    });
  }, [update]);

  const removeItem = useCallback((productId, supplierId) => {
    update((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.supplierId === supplierId)
      )
    );
  }, [update]);

  const updateQuantity = useCallback((productId, supplierId, qty) => {
    if (qty <= 0) return removeItem(productId, supplierId);

    update((prev) =>
      prev.map((i) => {
        if (i.productId !== productId || i.supplierId !== supplierId) return i;

        const product = getProductById(productId);
        const unitPrice = product
          ? getPriceForQuantity(product, qty)
          : i.unitPrice;

        return { ...i, quantity: qty, unitPrice };
      })
    );
  }, [update, removeItem]);

  const grouped = useMemo(() => {
    return items.reduce((acc, item) => {
      (acc[item.supplierId] ||= []).push(item);
      return acc;
    }, {});
  }, [items]);

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart: () => setItems([]),
    itemCount: items.length,
    grouped
  }), [items, addItem, removeItem, updateQuantity, grouped]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};