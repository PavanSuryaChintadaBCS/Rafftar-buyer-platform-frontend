import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useOrders } from "@/contexts/OrderContext";
import { getProductById } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2, Clock, Truck, Package, AlertTriangle, MessageSquare, Zap } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusIcons: Record<string, React.ReactNode> = {
  "Order Placed": <Clock className="h-4 w-4" />,
  "Confirmed": <CheckCircle2 className="h-4 w-4" />,
  "Dispatched": <Truck className="h-4 w-4" />,
  "Delivered": <Package className="h-4 w-4" />,
};

const progressMap: Record<string, number> = {
  placed: 15,
  confirmed: 40,
  dispatched: 70,
  delivered: 100,
  delayed: 50,
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const { getOrder, progressOrder, createTicket, getTicketsForOrder } = useOrders();
  const navigate = useNavigate();
  const order = getOrder(orderId || "");
  const tickets = getTicketsForOrder(orderId || "");

  const [ticketType, setTicketType] = useState<string>("delay");
  const [ticketMessage, setTicketMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Simulate auto-progression
  useEffect(() => {
    if (!order || order.status === "delivered") return;
    const timer = setTimeout(() => {
      progressOrder(order.id);
      toast.info(`Order ${order.id} status updated!`);
    }, 15000); // progress every 15s
    return () => clearTimeout(timer);
  }, [order?.status, order?.id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Order not found.</p>
        </div>
      </div>
    );
  }

  const handleRaiseTicket = () => {
    if (!ticketMessage.trim()) return;
    const ticket = createTicket(order.id, ticketType as any, ticketMessage);
    toast.success(`Ticket ${ticket.id} raised!`);
    setTicketMessage("");
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{order.id}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>
          <Badge variant="secondary" className="text-sm capitalize">{order.status}</Badge>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Progress value={progressMap[order.status] || 0} className="h-2 mb-4" />
            <div className="space-y-3">
              {order.timeline.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 text-primary">
                    {statusIcons[entry.status] || <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{entry.status}</p>
                    <p className="text-xs text-muted-foreground">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), "dd MMM, hh:mm a")}</p>
                  </div>
                </div>
              ))}
              {order.status !== "delivered" && (
                <div className="flex items-start gap-3 opacity-30">
                  <div className="mt-0.5"><Clock className="h-4 w-4" /></div>
                  <p className="text-sm">Waiting for next update...</p>
                </div>
              )}
            </div>
            {order.status !== "delivered" && (
              <Button variant="outline" size="sm" className="mt-4 gap-1" onClick={() => { progressOrder(order.id); toast.info("Status updated!"); }}>
                <Zap className="h-3 w-3" /> Simulate Next Step
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.items.map((item) => {
              const product = getProductById(item.productId);
              return (
                <div key={item.productId} className="flex justify-between text-sm py-1 border-b last:border-0">
                  <span className="truncate flex-1">{product?.name || item.productId} × {item.quantity}</span>
                  <span className="font-medium">₹{item.totalPrice.toLocaleString()}</span>
                </div>
              );
            })}
            <div className="pt-2 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Logistics</span><span>₹{order.logistics.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>₹{order.tax.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>₹{order.total.toLocaleString()}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <Card className="mb-6">
          <CardContent className="p-4 text-sm">
            <p className="font-medium">{order.address.label}</p>
            <p className="text-muted-foreground">{order.address.line1}, {order.address.city} – {order.address.pin}</p>
            <p className="mt-2 font-medium">Expected Delivery: {format(new Date(order.deliveryDate), "PPP")}</p>
          </CardContent>
        </Card>

        {/* Raise Ticket */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tickets.length > 0 ? (
              <div className="space-y-2 mb-4">
                {tickets.map((t) => (
                  <Link to={`/ticket/${t.id}`} key={t.id}>
                    <div className="flex items-center justify-between p-2 rounded-lg border hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{t.id} – <span className="capitalize">{t.type}</span></p>
                        <p className="text-xs text-muted-foreground">{t.messages.length} messages</p>
                      </div>
                      <Badge variant={t.status === "open" ? "default" : "secondary"}>{t.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No tickets raised for this order.</p>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <MessageSquare className="h-3 w-3" /> Raise a Ticket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Raise Support Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Issue Type</label>
                    <Select value={ticketType} onValueChange={setTicketType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delay">Delivery Delay</SelectItem>
                        <SelectItem value="quality">Quality Issue</SelectItem>
                        <SelectItem value="quantity">Quantity Mismatch</SelectItem>
                        <SelectItem value="invoice">Invoice Problem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Describe the issue</label>
                    <Textarea value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} placeholder="Explain your issue..." rows={3} />
                  </div>
                  <Button onClick={handleRaiseTicket} className="w-full">Submit Ticket</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderDetail;
