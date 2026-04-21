import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

export const PriceLockGate = memo(function PriceLockGate({
  children,
  productId,
  isUnlocked,
  isLoggedIn,
  className = "",
}) {
  const navigate = useNavigate();

  if (isUnlocked) return children;

  const handleClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: productId ? `/product/${productId}` : "/" },
      });
    } else {
      navigate("/kyc");
    }
  };

  const label = !isLoggedIn
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
});
