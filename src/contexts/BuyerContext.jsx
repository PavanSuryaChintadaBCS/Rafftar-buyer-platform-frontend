
import { createContext, useContext, useState, useCallback } from "react";
import { readStorageItem, writeStorageItem } from "@/utils/storage-keys";
const defaultBuyer = {
  isLoggedIn: false,
  isKYCVerified: false,
  type: "standard",
  name: ""
};
const BuyerContext = createContext(void 0);
const BuyerProvider = ({ children }) => {
  const [buyer, setBuyer] = useState(() => {
    const saved = readStorageItem("buyer");
    return saved ? JSON.parse(saved) : defaultBuyer;
  });
  const persist = (b) => {
    setBuyer(b);
    writeStorageItem("buyer", JSON.stringify(b));
  };
  const login = useCallback((name) => {
    const loginName = name || "User";
    const isRajesh = loginName.toLowerCase().includes("rajesh");
    persist({
      ...buyer,
      isLoggedIn: true,
      name: loginName,
      type: isRajesh ? "rafftar" : "standard",
      // Rajesh is pre-verified, others need KYC
      isKYCVerified: isRajesh ? true : buyer.isKYCVerified
    });
  }, [buyer]);
  const logout = useCallback(() => persist({ ...defaultBuyer }), []);
  const toggleKYC = useCallback(() => persist({ ...buyer, isKYCVerified: !buyer.isKYCVerified }), [buyer]);
  const setBuyerType = useCallback((type) => persist({ ...buyer, type }), [buyer]);
  return <BuyerContext.Provider value={{ buyer, login, logout, toggleKYC, setBuyerType }}>{children}</BuyerContext.Provider>;
};
const useBuyer = () => {
  const ctx = useContext(BuyerContext);
  if (!ctx) throw new Error("useBuyer must be used within BuyerProvider");
  return ctx;
};
export {
  BuyerProvider,
  useBuyer
};
