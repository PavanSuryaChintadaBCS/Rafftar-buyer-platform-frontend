import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/types";
import { Link } from "react-router-dom";
import { getProductImage } from "@/data/images";
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 border-border/60">
      <div className="aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
        <img
          src={getProductImage(product.category)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-110 transition-transform"
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
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground">₹{product.price}</span>
          <span className="text-xs text-muted-foreground">/{product.unit}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{product.supplierName}</p>
        <Link to={`/product/${product.id}`}>
          <Button size="sm" className="w-full mt-1" variant="outline">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
