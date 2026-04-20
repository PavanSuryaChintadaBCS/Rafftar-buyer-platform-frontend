import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useBuyer } from "@/contexts/BuyerContext";
import { getProductById, getSupplierById } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, Zap, AlertTriangle, ArrowRight, Minus, Plus, ShieldCheck } from "lucide-react";
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
  const logistics = Math.round(subtotal * 0.03);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + logistics + gst;
  return <div className="min-h-screen bg-background"><main className="container mx-auto px-4 py-6 max-w-4xl"><div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="h-6 w-6" /> Cart
            </h1>{items.length > 0 && <p className="text-sm text-muted-foreground mt-1">{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>}</div>{items.length > 0 && <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
              Clear All
            </Button>}</div>{items.length === 0 ? <div className="text-center py-20 animate-fade-in"><ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" /><p className="text-lg font-medium text-muted-foreground">Your cart is empty</p><p className="text-sm text-muted-foreground/70 mt-1">Browse our catalog and add products to get started</p><Link to="/"><Button className="mt-6">Browse Products</Button></Link></div> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">{
    /* Items column */
  }<div className="lg:col-span-2 space-y-4">{Object.entries(grouped).map(([supplierId, supplierItems]) => {
    const supplier = getSupplierById(supplierId);
    return <Card key={supplierId}><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2">{supplier?.name || supplierId}{supplier?.rafftarPricing && buyer.type === "rafftar" && <Badge variant="secondary" className="gap-1 text-xs"><Zap className="h-3 w-3" /> Rafftar
                          </Badge>}</CardTitle></CardHeader><CardContent className="space-y-0 divide-y">{supplierItems.map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      const belowMoq = item.quantity < product.moq;
      const unitPrice = buyer.type === "rafftar" && product.rafftarDiscount > 0 ? Math.round(item.unitPrice * (1 - product.rafftarDiscount / 100)) : item.unitPrice;
      return <div key={item.productId} className="flex gap-4 items-start py-4 first:pt-0 last:pb-0"><Link to={`/product/${product.id}`} className="h-16 w-16 bg-secondary/30 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-secondary/50 transition-colors"><img src={product.image} alt={product.name} className="h-8 w-8 opacity-40" /></Link><div className="flex-1 min-w-0"><Link to={`/product/${product.id}`}><h3 className="font-semibold text-sm truncate hover:text-primary transition-colors">{product.name}</h3></Link><p className="text-xs text-muted-foreground mt-0.5">₹{unitPrice}/{product.unit}</p>{belowMoq && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertTriangle className="h-3 w-3" /> Min. order: {product.moq} {product.unit}</p>}<div className="flex items-center gap-2 mt-2"><Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
      ><Minus className="h-3 w-3" /></Button><Input
        type="number"
        min={1}
        value={item.quantity}
        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
        className="w-16 h-7 text-center text-sm"
      /><Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
      ><Plus className="h-3 w-3" /></Button></div></div><div className="text-right flex-shrink-0"><p className="text-sm font-bold">₹{Math.round(unitPrice * item.quantity).toLocaleString()}</p><Button
        variant="ghost"
        size="sm"
        onClick={() => removeItem(item.productId)}
        className="text-destructive hover:text-destructive h-7 px-2 mt-1"
      ><Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                              </Button></div></div>;
    })}</CardContent></Card>;
  })}</div>{
    /* Summary sidebar */
  }<div className="lg:col-span-1"><Card className="sticky top-6"><CardHeader className="pb-3"><CardTitle className="text-base">Order Summary</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal ({items.length} items)</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Logistics (est. 3%)</span><span>₹{logistics.toLocaleString()}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (18%)</span><span>₹{gst.toLocaleString()}</span></div><Separator /><div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toLocaleString()}</span></div><Button className="w-full gap-2 mt-2" size="lg" onClick={() => navigate("/checkout")}>
                    Proceed to Checkout <ArrowRight className="h-4 w-4" /></Button><div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1"><ShieldCheck className="h-3.5 w-3.5" /><span>Secure checkout with GST invoice</span></div></CardContent></Card></div></div>}</main></div>;
};
export default Cart;
