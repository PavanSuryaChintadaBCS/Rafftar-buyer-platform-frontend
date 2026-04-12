import React, { createContext, useContext, useState, useCallback } from "react";
import { Buyer, BuyerType } from "@/data/types";

interface BuyerContextType {
  buyer: Buyer;
  login: () => void;
  logout: () => void;
  toggleKYC: () => void;
  setBuyerType: (type: BuyerType) => void;
}

const defaultBuyer: Buyer = {
  isLoggedIn: true,
  isKYCVerified: true,
  type: "standard",
  name: "Rajesh Kumar",
};

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const BuyerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buyer, setBuyer] = useState<Buyer>(() => {
    const saved = localStorage.getItem("buildmart_buyer");
    return saved ? JSON.parse(saved) : defaultBuyer;
  });

  const persist = (b: Buyer) => {
    setBuyer(b);
    localStorage.setItem("buildmart_buyer", JSON.stringify(b));
  };

  const login = useCallback(() => persist({ ...buyer, isLoggedIn: true }), [buyer]);
  const logout = useCallback(() => persist({ ...buyer, isLoggedIn: false }), [buyer]);
  const toggleKYC = useCallback(() => persist({ ...buyer, isKYCVerified: !buyer.isKYCVerified }), [buyer]);
  const setBuyerType = useCallback((type: BuyerType) => persist({ ...buyer, type }), [buyer]);

  return (
    <BuyerContext.Provider value={{ buyer, login, logout, toggleKYC, setBuyerType }}>
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyer = () => {
  const ctx = useContext(BuyerContext);
  if (!ctx) throw new Error("useBuyer must be used within BuyerProvider");
  return ctx;
};
