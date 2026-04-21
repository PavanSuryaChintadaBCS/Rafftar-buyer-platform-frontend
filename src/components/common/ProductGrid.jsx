
import { memo } from "react";
import ProductCard from "@/components/product/ProductCard";

export const ProductGrid = memo(function ProductGrid({
  products,
  buyerType,
  isUnlocked,
  isLoggedIn,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{ "--delay": `${i * 100}ms` }}
        >
          <ProductCard
            product={product}
            buyerType={buyerType}
            isUnlocked={isUnlocked}
            isLoggedIn={isLoggedIn}
          />
        </div>
      ))}
    </div>
  );
});