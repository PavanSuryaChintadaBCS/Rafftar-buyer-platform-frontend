import React, { createContext, useContext, useState, useCallback } from "react";
import { Buyer, BuyerType } from "@/data/types";

interface BuyerContextType {
  buyer: Buyer;
  login: (name?: string) => void;
  logout: () => void;
  toggleKYC: () => void;
  setBuyerType: (type: BuyerType) => void;
}

const defaultBuyer: Buyer = {
  isLoggedIn: false,
  isKYCVerified: false,
  type: "standard",
  name: "",
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

  const login = useCallback((name?: string) => {
    const loginName = name || "User";
    const isRajesh = loginName.toLowerCase().includes("rajesh");
    persist({
      ...buyer,
      isLoggedIn: true,
      name: loginName,
      type: isRajesh ? "rafftar" : "standard",
      // Rajesh is pre-verified, others need KYC
      isKYCVerified: isRajesh ? true : buyer.isKYCVerified,
    });
  }, [buyer]);

  const logout = useCallback(() => persist({ ...defaultBuyer }), []);
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
