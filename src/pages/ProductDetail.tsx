import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { getProductById, getSupplierById, getPriceForQuantity } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getProductImage } from "@/data/images";
import { Star, MapPin, ShoppingCart, MessageSquare, AlertTriangle, Lock, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useBuyer } from "@/contexts/BuyerContext";
import { toast } from "sonner";
import { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const KYC_PROMPT_DELAY = 2 * 60 * 1000; // 2 minutes

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = getProductById(productId || "");
  const supplier = product ? getSupplierById(product.supplierId) : undefined;
  const { addItem } = useCart();
  const { buyer } = useBuyer();
  const [quantity, setQuantity] = useState(product?.moq || 1);
  const [showKYCPrompt, setShowKYCPrompt] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2-minute KYC prompt for logged-in but non-KYC users
  useEffect(() => {
    if (buyer.isLoggedIn && !buyer.isKYCVerified) {
      timerRef.current = setTimeout(() => {
        setShowKYCPrompt(true);
      }, KYC_PROMPT_DELAY);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [buyer.isLoggedIn, buyer.isKYCVerified]);

  const pricing = useMemo(() => {
    if (!product) return { unitPrice: 0, totalPrice: 0, savings: 0, rafftarPrice: 0 };
    const unitPrice = getPriceForQuantity(product, quantity);
    const baseTotal = product.price * quantity;
    const totalPrice = unitPrice * quantity;
    const savings = baseTotal - totalPrice;
    const rafftarPrice = buyer.type === "rafftar" && product.rafftarDiscount > 0
      ? Math.round(unitPrice * (1 - product.rafftarDiscount / 100))
      : 0;
    return { unitPrice, totalPrice, savings, rafftarPrice };
  }, [product, quantity, buyer.type]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!buyer.isLoggedIn) {
      toast.error("Please login to add items to cart.");
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    if (!buyer.isKYCVerified) {
      toast.error("Complete KYC to add items to cart.");
      navigate("/kyc");
      return;
    }
    if (quantity < product.moq) {
      toast.error(`Minimum order quantity is ${product.moq} ${product.unit}`);
      return;
    }
    addItem(product.id, product.supplierId, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const showPrice = buyer.isLoggedIn && buyer.isKYCVerified;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* KYC Prompt Dialog */}
      <Dialog open={showKYCPrompt} onOpenChange={setShowKYCPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Full Pricing & Ordering</DialogTitle>
            <DialogDescription>
              You've been browsing for a while! Complete your KYC verification to unlock pricing, bulk discounts, and place orders.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowKYCPrompt(false)} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={() => navigate("/kyc")} className="flex-1">
              Complete KYC
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-secondary/10 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={getProductImage(product.category)} alt={product.name} className="h-full w-full object-cover" />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
              {product.rafftarDiscount > 0 && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Zap className="h-3 w-3" /> Rafftar Eligible
                </Badge>
              )}
              {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            {/* Pricing */}
            {showPrice ? (
              <div className="bg-accent/50 rounded-lg p-4 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">₹{pricing.rafftarPrice || pricing.unitPrice}</span>
                  <span className="text-muted-foreground">/{product.unit}</span>
                  {pricing.rafftarPrice > 0 && (
                    <span className="text-sm line-through text-muted-foreground">₹{pricing.unitPrice}</span>
                  )}
                </div>
                {pricing.rafftarPrice > 0 && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Rafftar discount: {product.rafftarDiscount}% off
                  </p>
                )}
                {pricing.savings > 0 && (
                  <p className="text-xs text-primary">You save ₹{Math.round(pricing.savings)} on bulk pricing!</p>
                )}
                <p className="text-sm font-semibold">Total: ₹{Math.round(pricing.rafftarPrice ? pricing.rafftarPrice * quantity : pricing.totalPrice)}</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!buyer.isLoggedIn) {
                    navigate("/login", { state: { from: `/product/${product.id}` } });
                  } else {
                    navigate("/kyc");
                  }
                }}
                className="w-full bg-secondary/50 rounded-lg p-4 flex items-center gap-2 hover:bg-secondary/70 transition-colors cursor-pointer text-left"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {!buyer.isLoggedIn ? "Login to see pricing →" : "Complete KYC to unlock pricing →"}
                </span>
              </button>
            )}

            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

            {/* Quantity + MOQ */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity ({product.unit})</label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={product.moq}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28"
                />
                {quantity < product.moq && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> MOQ: {product.moq}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="gap-2" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" /> Contact Supplier
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Specifications */}
          <div>
            <h2 className="text-lg font-bold mb-3">Specifications</h2>
            <Table>
              <TableBody>
                {Object.entries(product.specifications).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium text-muted-foreground">{key}</TableCell>
                    <TableCell>{val}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Bulk Pricing */}
          <div>
            <h2 className="text-lg font-bold mb-3">Bulk Pricing</h2>
            {showPrice ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price per {product.unit}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.bulkPricing.map((tier, i) => (
                    <TableRow key={i} className={quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty) ? "bg-primary/5" : ""}>
                      <TableCell>{tier.maxQty ? `${tier.minQty} – ${tier.maxQty}` : `${tier.minQty}+`}</TableCell>
                      <TableCell className="font-semibold">₹{tier.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <button
                onClick={() => {
                  if (!buyer.isLoggedIn) navigate("/login", { state: { from: `/product/${product.id}` } });
                  else navigate("/kyc");
                }}
                className="w-full text-center py-8 text-muted-foreground text-sm hover:bg-secondary/30 rounded-lg transition-colors cursor-pointer"
              >
                <Lock className="h-5 w-5 mx-auto mb-2" />
                {!buyer.isLoggedIn ? "Login to view pricing →" : "Complete KYC to view pricing →"}
              </button>
            )}
          </div>
        </div>

        {/* Supplier Card */}
        {supplier && (
          <Card className="mt-10">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start">
              <div className="h-16 w-16 rounded-lg bg-secondary/40 flex items-center justify-center flex-shrink-0">
                <img src={supplier.logo} alt={supplier.name} className="h-8 w-8 opacity-40" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{supplier.name}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {supplier.location}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {supplier.rating}</span>
                  <span>Est. {supplier.established}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{supplier.description}</p>
                <Link to={`/supplier/${supplier.id}`}>
                  <Button variant="outline" size="sm" className="mt-3">View All Products</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
