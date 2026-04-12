import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useBuyer } from "@/contexts/BuyerContext";
import { useOrders } from "@/contexts/OrderContext";
import { getProductById } from "@/data/mock";
import { mockAddresses } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { buyer } = useBuyer();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [addressId, setAddressId] = useState(mockAddresses[0].id);
  const [deliveryDate, setDeliveryDate] = useState<Date>(addDays(new Date(), 5));
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [step, setStep] = useState<"address" | "summary">("address");

  useEffect(() => {
    if (!buyer.isLoggedIn) {
      navigate("/login", { state: { from: "/checkout" } });
    } else if (!buyer.isKYCVerified) {
      navigate("/kyc");
    }
  }, [buyer.isLoggedIn, buyer.isKYCVerified, navigate]);

  if (!buyer.isLoggedIn || !buyer.isKYCVerified) return null;

  const selectedAddress = mockAddresses.find((a) => a.id === addressId)!;

  const totals = useMemo(() => {
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
    const tax = Math.round(subtotal * 0.18);
    return { subtotal, logistics, tax, total: subtotal + logistics + tax };
  }, [items, buyer.type]);

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    const order = placeOrder(items, selectedAddress, deliveryDate.toISOString(), approvalRequired);
    clearCart();
    toast.success(`Order ${order.id} placed successfully!`);
    navigate(`/order/${order.id}`);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex gap-2 mb-8">
          {["address", "summary"].map((s) => (
            <div key={s} className={cn("flex-1 h-1.5 rounded-full", step === s || (s === "address" && step === "summary") ? "bg-primary" : "bg-secondary")} />
          ))}
        </div>

        {step === "address" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={addressId} onValueChange={setAddressId} className="space-y-3">
                  {mockAddresses.map((a) => (
                    <div key={a.id} className={cn("flex items-start gap-3 p-3 rounded-lg border cursor-pointer", addressId === a.id && "border-primary bg-primary/5")}>
                      <RadioGroupItem value={a.id} id={a.id} className="mt-1" />
                      <Label htmlFor={a.id} className="cursor-pointer flex-1">
                        <p className="font-semibold text-sm">{a.label}</p>
                        <p className="text-xs text-muted-foreground">{a.line1}, {a.line2}</p>
                        <p className="text-xs text-muted-foreground">{a.city}, {a.state} – {a.pin}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(deliveryDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={(d) => d && setDeliveryDate(d)}
                      disabled={(d) => d < addDays(new Date(), 2)}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Require Approval</p>
                  <p className="text-xs text-muted-foreground">Simulate manager approval before order is confirmed</p>
                </div>
                <Switch checked={approvalRequired} onCheckedChange={setApprovalRequired} />
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={() => setStep("summary")}>
              Continue to Summary
            </Button>
          </div>
        )}

        {step === "summary" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  let unitPrice = item.unitPrice;
                  if (buyer.type === "rafftar" && product.rafftarDiscount > 0) {
                    unitPrice = Math.round(unitPrice * (1 - product.rafftarDiscount / 100));
                  }
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="truncate flex-1">{product.name} × {item.quantity}</span>
                      <span className="font-medium">₹{(unitPrice * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{totals.subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Logistics</span><span>₹{totals.logistics.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{totals.tax.toLocaleString()}</span></div>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totals.total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-sm">
                <p className="font-medium mb-1">Delivering to: {selectedAddress.label}</p>
                <p className="text-muted-foreground">{selectedAddress.line1}, {selectedAddress.city} – {selectedAddress.pin}</p>
                <p className="mt-2 font-medium">Expected: {format(deliveryDate, "PPP")}</p>
                {approvalRequired && <p className="text-primary text-xs mt-1">⚠ This order requires manager approval</p>}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("address")} className="flex-1">Back</Button>
              <Button onClick={handlePlaceOrder} className="flex-1 gap-2">
                <CheckCircle2 className="h-4 w-4" /> Place Order
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
