import { useInquiry } from "@/contexts/InquiryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
const InquiryCart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useInquiry();
  const handleSubmit = () => {
    toast({ title: "Inquiry Submitted!", description: "Your inquiry has been sent to the suppliers. They will contact you shortly." });
    clearCart();
  };
  return <div className="min-h-screen bg-background"><main className="container mx-auto px-4 py-6 max-w-2xl"><h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShoppingCart className="h-6 w-6" /> Inquiry Cart
        </h1>{items.length === 0 ? <div className="text-center py-20"><ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" /><p className="text-muted-foreground">Your inquiry cart is empty.</p><p className="text-sm text-muted-foreground mt-1">Browse products and add them to your inquiry.</p></div> : <div className="space-y-4">{items.map((item) => <Card key={item.product.id}><CardContent className="p-4 flex gap-4 items-center"><div className="h-16 w-16 bg-secondary/30 rounded-lg flex items-center justify-center flex-shrink-0"><img src={item.product.image} alt={item.product.name} className="h-8 w-8 opacity-40" /></div><div className="flex-1 min-w-0"><h3 className="font-semibold text-sm truncate">{item.product.name}</h3><p className="text-xs text-muted-foreground">{item.product.supplierName}</p><p className="text-sm font-bold mt-1">₹{item.product.price}/{item.product.unit}</p></div><div className="flex items-center gap-2"><Input
    type="number"
    min={1}
    value={item.quantity}
    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
    className="w-20 h-9 text-center"
  /><Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></CardContent></Card>)}<div className="flex justify-end pt-4"><Button onClick={handleSubmit} className="px-8">
                Submit Inquiry ({items.length} items)
              </Button></div></div>}</main></div>;
};
export default InquiryCart;
