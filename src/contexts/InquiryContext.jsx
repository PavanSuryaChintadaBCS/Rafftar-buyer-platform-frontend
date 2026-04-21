
import {
  createContext, useContext, useState, useCallback, useMemo, useEffect
} from "react";
import { readStorageItem, writeStorageItem } from "@/utils/storage-keys";
import { safeParse } from "@/utils/persist";

const InquiryContext = createContext(undefined);

export const InquiryProvider = ({ children }) => {
  const [items, setItems] = useState(() =>
    safeParse(readStorageItem("inquiry"), [])
  );

  useEffect(() => {
    writeStorageItem("inquiry", JSON.stringify(items));
  }, [items]);

  const update = useCallback((fn) => {
    setItems((prev) => fn(prev));
  }, []);

  const addItem = useCallback((productId, qty = 1) => {
    const quantity = Math.max(1, Math.floor(qty));

    update((prev) => {
      const existing = prev.find((i) => i.productId === productId);

      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, { productId, quantity }];
    });
  }, [update]);

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem: (id) =>
      setItems((p) => p.filter((i) => i.productId !== id)),
    updateQuantity: (id, q) =>
      setItems((p) =>
        p.map((i) => (i.productId === id ? { ...i, quantity: q } : i))
      ),
    clearInquiry: () => setItems([]),
    itemCount: items.length
  }), [items, addItem]);

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
};

export const useInquiry = () => {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used within InquiryProvider");
  return ctx;
};