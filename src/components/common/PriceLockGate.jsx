import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuyer } from "@/contexts/BuyerContext";

export function PriceLockGate({ children, productId, className = "" }) {
  const { buyer } = useBuyer();
  const navigate = useNavigate();

  const isUnlocked = buyer.isLoggedIn && buyer.isKYCVerified;

  if (isUnlocked) return children;

  const handleClick = (e) => {
    e.preventDefault();
    if (!buyer.isLoggedIn) {
      navigate("/login", { state: { from: productId ? `/product/${productId}` : "/" } });
    } else {
      navigate("/kyc");
    }
  };

  const label = !buyer.isLoggedIn
    ? "Login to see price"
    : "Complete KYC for price";

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors ${className}`}
    >
      <Lock className="h-3 w-3" />
      {label}
    </button>
  );
}
