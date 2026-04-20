// src/hooks/useAuthGuard.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBuyer } from "@/contexts/BuyerContext";

export function useAuthGuard({ from = "/cart" } = {}) {
  const { buyer } = useBuyer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!buyer.isLoggedIn) {
      navigate("/login", { state: { from } });
    } else if (!buyer.isKYCVerified) {
      navigate("/kyc");
    }
  }, [buyer.isLoggedIn, buyer.isKYCVerified, navigate, from]);

  return {
    buyer,
    ready: buyer.isLoggedIn && buyer.isKYCVerified,
  };
}
