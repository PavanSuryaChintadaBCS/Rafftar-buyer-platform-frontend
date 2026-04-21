// import { memo } from "react";
// import { Star } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { getProductImage } from "@/data/images";
// import { useBuyer } from "@/contexts/BuyerContext";
// import { PriceLockGate } from "@/components/common/PriceLockGate";

// const ProductCard = memo(function ProductCard({ product }) {
//   const { buyer } = useBuyer();

//   const discountedPrice =
//     buyer.type === "rafftar" && product.rafftarDiscount > 0
//       ? Math.round(product.price * (1 - product.rafftarDiscount / 100))
//       : null;

//   return (
//     <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60">
//       <div className="aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
//         <img
//           src={getProductImage(product.category)}
//           alt={product.name}
//           loading="lazy"
//           className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
//         />
//       </div>

//       <CardContent className="p-4 space-y-2">
//         <p className="text-xs text-muted-foreground uppercase tracking-wide">
//           {product.category}
//         </p>

//         <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
//           {product.name}
//         </h3>

//         <div className="flex items-center gap-1">
//           <Star className="h-3.5 w-3.5 fill-primary text-primary" />
//           <span className="text-xs font-medium">{product.rating}</span>
//           <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
//         </div>

//         <PriceLockGate productId={product.id}>
//           <div className="flex items-baseline gap-1">
//             {discountedPrice ? (
//               <>
//                 <span className="text-lg font-bold text-primary">
//                   ₹{discountedPrice}
//                 </span>
//                 <span className="text-xs text-muted-foreground line-through">
//                   ₹{product.price}
//                 </span>
//                 <span className="text-xs text-primary font-medium">
//                   -{product.rafftarDiscount}%
//                 </span>
//               </>
//             ) : (
//               <span className="text-lg font-bold text-foreground">
//                 ₹{product.price}
//               </span>
//             )}
//             <span className="text-xs text-muted-foreground">/{product.unit}</span>
//           </div>
//         </PriceLockGate>

//         <p className="text-xs text-muted-foreground truncate">{product.supplierName}</p>

//         <Link to={`/product/${product.id}`}>
//           <Button
//             size="sm"
//             className="w-full mt-1 hover:scale-[1.02] transition-transform"
//             variant="outline"
//           >
//             View Details
//           </Button>
//         </Link>
//       </CardContent>
//     </Card>
//   );
// });

// export default ProductCard;


import { memo } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getProductImage } from "@/data/images";
import { PriceLockGate } from "@/components/common/PriceLockGate";

const ProductCard = memo(function ProductCard({
  product,
  buyerType,
  isUnlocked,
  isLoggedIn,
}) {
  const discountedPrice =
    buyerType === "rafftar" && product.rafftarDiscount > 0
      ? Math.round(product.price * (1 - product.rafftarDiscount / 100))
      : null;

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
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </p>

        <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <PriceLockGate
          productId={product.id}
          isUnlocked={isUnlocked}
          isLoggedIn={isLoggedIn}
        >
          <div className="flex items-baseline gap-1">
            {discountedPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ₹{discountedPrice}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.price}
                </span>
                <span className="text-xs text-primary font-medium">
                  -{product.rafftarDiscount}%
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                ₹{product.price}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              /{product.unit}
            </span>
          </div>
        </PriceLockGate>

        <p className="text-xs text-muted-foreground truncate">
          {product.supplierName}
        </p>

        <Link to={`/product/${product.id}`}>
          <Button
            size="sm"
            className="w-full mt-1 hover:scale-[1.02] transition-transform"
            variant="outline"
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
});

export default ProductCard;