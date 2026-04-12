import { Star, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/types";
import { Link, useNavigate } from "react-router-dom";
import { getProductImage } from "@/data/images";
import { useBuyer } from "@/contexts/BuyerContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { buyer } = useBuyer();
  const navigate = useNavigate();
  const showPrice = buyer.isLoggedIn && buyer.isKYCVerified;

  return (
    <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60">
      <div className="aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
        <img
          src={getProductImage(product.category)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        {showPrice ? (
          <div className="flex items-baseline gap-1">
            {buyer.type === "rafftar" && product.rafftarDiscount > 0 ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ₹{Math.round(product.price * (1 - product.rafftarDiscount / 100))}
                </span>
                <span className="text-xs text-muted-foreground line-through">₹{product.price}</span>
                <span className="text-xs text-primary font-medium">-{product.rafftarDiscount}%</span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">₹{product.price}</span>
            )}
            <span className="text-xs text-muted-foreground">/{product.unit}</span>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!buyer.isLoggedIn) {
                navigate("/login", { state: { from: `/product/${product.id}` } });
              } else {
                navigate("/kyc");
              }
            }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Lock className="h-3 w-3" />
            {!buyer.isLoggedIn ? "Login to see price" : "Complete KYC for price"}
          </button>
        )}
        <p className="text-xs text-muted-foreground truncate">{product.supplierName}</p>
        <Link to={`/product/${product.id}`}>
          <Button size="sm" className="w-full mt-1 hover:scale-[1.02] transition-transform" variant="outline">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
