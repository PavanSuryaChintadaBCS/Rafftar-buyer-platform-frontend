import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useBuyer } from "@/contexts/BuyerContext";
import { getProductById, getSupplierById, getPriceForQuantity } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart, Zap, AlertTriangle, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getGroupedBySuppier } = useCart();
  const { buyer } = useBuyer();
  const navigate = useNavigate();
  const grouped = getGroupedBySuppier();

  useEffect(() => {
    if (!buyer.isLoggedIn) {
      navigate("/login", { state: { from: "/cart" } });
    } else if (!buyer.isKYCVerified) {
      navigate("/kyc");
    }
  }, [buyer.isLoggedIn, buyer.isKYCVerified, navigate]);

  if (!buyer.isLoggedIn || !buyer.isKYCVerified) return null;

  const subtotal = items.reduce((s, i) => {
    const product = getProductById(i.productId);
    if (!product) return s;
    let unitPrice = i.unitPrice;
    if (buyer.type === "rafftar" && product.rafftarDiscount > 0) {
      unitPrice = Math.round(unitPrice * (1 - product.rafftarDiscount / 100));
    }
    return s + unitPrice * i.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" /> Cart
          </h1>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/">
              <Button variant="outline" className="mt-4">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([supplierId, supplierItems]) => {
              const supplier = getSupplierById(supplierId);
              return (
                <Card key={supplierId}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      {supplier?.name || supplierId}
                      {supplier?.rafftarPricing && buyer.type === "rafftar" && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Zap className="h-3 w-3" /> Rafftar
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supplierItems.map((item) => {
                      const product = getProductById(item.productId);
                      if (!product) return null;
                      const belowMoq = item.quantity < product.moq;
                      const unitPrice = buyer.type === "rafftar" && product.rafftarDiscount > 0
                        ? Math.round(item.unitPrice * (1 - product.rafftarDiscount / 100))
                        : item.unitPrice;
                      return (
                        <div key={item.productId} className="flex gap-3 items-center py-2 border-b last:border-0">
                          <Link to={`/product/${product.id}`} className="h-14 w-14 bg-secondary/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img src={product.image} alt={product.name} className="h-7 w-7 opacity-40" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${product.id}`}>
                              <h3 className="font-semibold text-sm truncate hover:text-primary">{product.name}</h3>
                            </Link>
                            <p className="text-xs text-muted-foreground">₹{unitPrice}/{product.unit}</p>
                            {belowMoq && (
                              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                                <AlertTriangle className="h-3 w-3" /> MOQ: {product.moq}
                              </p>
                            )}
                          </div>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                            className="w-20 h-9 text-center"
                          />
                          <p className="text-sm font-bold w-24 text-right">₹{Math.round(unitPrice * item.quantity)}</p>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}

            {/* Summary */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Logistics (est. 3%)</span>
                  <span>₹{Math.round(subtotal * 0.03).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{Math.round(subtotal * 0.18).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{Math.round(subtotal * 1.21).toLocaleString()}</span>
                </div>
                <Button className="w-full mt-2 gap-2" size="lg" onClick={() => navigate("/checkout")}>
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
