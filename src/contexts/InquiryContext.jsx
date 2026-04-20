import { createContext, useContext, useState, useCallback } from "react";
const InquiryContext = createContext(void 0);
const InquiryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map(
          (i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);
  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems(
      (prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity } : i)
    );
  }, []);
  const clearCart = useCallback(() => setItems([]), []);
  return <InquiryContext.Provider
    value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount: items.length }}
  >{children}</InquiryContext.Provider>;
};
const useInquiry = () => {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used within InquiryProvider");
  return ctx;
};
export {
  InquiryProvider,
  useInquiry
};
