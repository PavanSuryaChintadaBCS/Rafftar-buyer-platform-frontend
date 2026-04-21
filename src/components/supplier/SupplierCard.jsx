import { memo } from "react";
import { Star, MapPin, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SupplierCard = memo(function SupplierCard({ supplier }) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/60">
      <CardContent className="p-5 flex gap-4">
        <div className="h-16 w-16 rounded-lg bg-secondary/40 flex items-center justify-center flex-shrink-0">
          <img src={supplier.logo} alt={supplier.name} className="h-8 w-8 opacity-40" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="font-semibold text-base leading-tight">{supplier.name}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {supplier.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" /> {supplier.rating} ({supplier.reviewCount})
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" /> {supplier.productCount} products
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{supplier.description}</p>
          <Link to={`/supplier/${supplier.id}`}>
            <Button size="sm" variant="outline" className="mt-1">
              View Supplier
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

export default SupplierCard;
