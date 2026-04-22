
import { createContext, useContext, useState, useCallback } from "react";
import { readStorageItem, writeStorageItem } from "@/utils";

const defaultBuyer = {
  isLoggedIn: false,
  isKYCVerified: false,
  type: "standard",
  name: "",
};

function parseSavedBuyer() {
  try {
    const raw = readStorageItem("buyer");
    if (!raw) return defaultBuyer;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : defaultBuyer;
  } catch {
    return defaultBuyer;
  }
}

const BuyerContext = createContext(undefined);

const BuyerProvider = ({ children }) => {
  const [buyer, setBuyer] = useState(parseSavedBuyer);

  const update = useCallback((updater) => {
    setBuyer((prev) => {
      const next = updater(prev);
      writeStorageItem("buyer", JSON.stringify(next));
      return next;
    });
  }, []);

  const login = useCallback(
    (name) => {
      const loginName = name || "User";
      const isRajesh = loginName.toLowerCase().includes("rajesh");
      update((prev) => ({
        ...prev,
        isLoggedIn: true,
        name: loginName,
        type: isRajesh ? "rafftar" : "standard",
        isKYCVerified: isRajesh ? true : prev.isKYCVerified,
      }));
    },
    [update]
  );

  const logout = useCallback(
    () => update(() => ({ ...defaultBuyer })),
    [update]
  );

  const toggleKYC = useCallback(
    () => update((prev) => ({ ...prev, isKYCVerified: !prev.isKYCVerified })),
    [update]
  );

  const setBuyerType = useCallback(
    (type) => update((prev) => ({ ...prev, type })),
    [update]
  );

  return (
    <BuyerContext.Provider value={{ buyer, login, logout, toggleKYC, setBuyerType }}>
      {children}
    </BuyerContext.Provider>
  );
};

const useBuyer = () => {
  const ctx = useContext(BuyerContext);
  if (!ctx) throw new Error("useBuyer must be used within BuyerProvider");
  return ctx;
};

export { BuyerProvider, useBuyer };
