import { useState, useCallback } from "react";
import { BuyerContext } from "./buyerContextInstance";
import { readStorageItem, writeStorageItem } from "@/utils";

const defaultBuyer = {
  isLoggedIn: false,
  isKYCVerified: false,
  type: "standard",
  name: "",
  email: "",
  id: null,
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

export const BuyerProvider = ({ children }) => {
  const [buyer, setBuyer] = useState(parseSavedBuyer);

  const update = useCallback((updater) => {
    setBuyer((prev) => {
      const next = updater(prev);
      writeStorageItem("buyer", JSON.stringify(next));
      return next;
    });
  }, []);

  // Accepts a buyer object from the real API: { id, email, buyer_type, is_kyc_verified }
  const login = useCallback((buyerData) => {
    update(() => ({
      isLoggedIn: true,
      id:            buyerData.id            ?? null,
      email:         buyerData.email         ?? "",
      name:          buyerData.name          ?? buyerData.email?.split("@")[0] ?? "User",
      type:          buyerData.buyer_type    ?? "standard",
      isKYCVerified: buyerData.is_kyc_verified ?? false,
    }));
  }, [update]);

  const logout = useCallback(async () => {
    try {
      // Dynamically import to avoid circular dep at module load time
      const { httpService } = await import("@/utils/http-service");
      await httpService.logout();
    } catch {
      localStorage.removeItem("auth_token");
    }
    update(() => ({ ...defaultBuyer }));
  }, [update]);

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
