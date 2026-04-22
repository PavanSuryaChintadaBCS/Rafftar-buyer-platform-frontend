import { useContext } from "react";
import { BuyerContext } from "@/contexts/buyerContextInstance";

export const useBuyer = () => {
  const ctx = useContext(BuyerContext);
  if (!ctx) throw new Error("useBuyer must be used within BuyerProvider");
  return ctx;
};
