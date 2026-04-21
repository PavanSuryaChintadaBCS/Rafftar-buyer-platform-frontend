import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { getProductById } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertTriangle,
  MessageSquare,
  Zap,
  Paperclip,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusIcons = {
  "Order Placed": <Clock className="h-4 w-4" />,
  Confirmed: <CheckCircle2 className="h-4 w-4" />,
  Dispatched: <Truck className="h-4 w-4" />,
  Delivered: <Package className="h-4 w-4" />,
};

const progressMap = {
  placed: 15,
  confirmed: 40,
  dispatched: 70,
  delivered: 100,
  delayed: 50,
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const { getOrder, progressOrder, createTicket, getTicketsForOrder } =
    useOrders();

  const navigate = useNavigate();

  const order = getOrder(orderId || "");
  const tickets = getTicketsForOrder(orderId || "");

  const orderIdSafe = order?.id;
  const orderStatus = order?.status;

  const [ticketType, setTicketType] = useState("delay");
  const [ticketMessage, setTicketMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!orderIdSafe || orderStatus === "delivered") return;

    const timer = setTimeout(() => {
      progressOrder(orderIdSafe);
      toast.info(`Order ${orderIdSafe} status updated!`);
    }, 15000);

    return () => clearTimeout(timer);
  }, [orderIdSafe, orderStatus, progressOrder]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Order not found.</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);

    if (attachments.length + files.length > 5) {
      toast.error("Maximum 5 attachments allowed");
      return;
    }

    setAttachments((prev) => [...prev, ...files]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRaiseTicket = () => {
    if (!ticketMessage.trim()) return;

    const ticket = createTicket(order.id, ticketType, ticketMessage);

    toast.success(
      `Ticket ${ticket.id} raised${
        attachments.length > 0
          ? ` with ${attachments.length} attachment(s)`
          : ""
      }!`
    );

    setTicketMessage("");
    setAttachments([]);
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{order.id}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on{" "}
              {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>

          <Badge variant="secondary" className="text-sm capitalize">
            {order.status}
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Progress
              value={progressMap[order.status] || 0}
              className="h-2 mb-4"
            />

            <div className="space-y-3">
              {order.timeline.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 text-primary">
                    {statusIcons[entry.status] || (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-sm">{entry.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(entry.timestamp),
                        "dd MMM, hh:mm a"
                      )}
                    </p>
                  </div>
                </div>
              ))}

              {order.status !== "delivered" && (
                <div className="flex items-start gap-3 opacity-30">
                  <Clock className="h-4 w-4 mt-0.5" />
                  <p className="text-sm">Waiting for next update...</p>
                </div>
              )}
            </div>

            {order.status !== "delivered" && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1"
                onClick={() => {
                  progressOrder(order.id);
                  toast.info("Status updated!");
                }}
              >
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
                <div
                  key={item.productId}
                  className="flex justify-between text-sm py-1 border-b last:border-0"
                >
                  <span className="truncate flex-1">
                    {product?.name || item.productId} × {item.quantity}
                  </span>

                  <span className="font-medium">
                    ₹{item.totalPrice.toLocaleString()}
                  </span>
                </div>
              );
            })}

            <div className="pt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Logistics</span>
                <span>₹{order.logistics.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">GST</span>
                <span>₹{order.tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery */}
        <Card className="mb-6">
          <CardContent className="p-4 text-sm">
            <p className="font-medium">{order.address.label}</p>
            <p className="text-muted-foreground">
              {order.address.line1}, {order.address.city} –{" "}
              {order.address.pin}
            </p>
            <p className="mt-2 font-medium">
              Expected Delivery:{" "}
              {format(new Date(order.deliveryDate), "PPP")}
            </p>
          </CardContent>
        </Card>

        {/* Tickets */}
        {order.status === "delivered" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Support Tickets
              </CardTitle>
            </CardHeader>

            <CardContent>
              {tickets.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {tickets.map((t) => (
                    <Link to={`/ticket/${t.id}`} key={t.id}>
                      <div className="flex items-center justify-between p-2 rounded-lg border hover:bg-secondary/50">
                        <div>
                          <p className="text-sm font-medium">
                            {t.id} –{" "}
                            <span className="capitalize">{t.type}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.messages.length} messages
                          </p>
                        </div>

                        <Badge
                          variant={
                            t.status === "open" ? "default" : "secondary"
                          }
                        >
                          {t.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  No tickets raised for this order.
                </p>
              )}

              <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) setAttachments([]);
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Raise a Ticket
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
                      <Textarea
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="Explain your issue..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Attachments (optional)</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-3 w-3" /> Add Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">Images, PDF, DOC – max 5 files</p>
                      {attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {attachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs bg-secondary/50 rounded px-2 py-1">
                              <Paperclip className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="truncate flex-1">{file.name}</span>
                              <span className="text-muted-foreground flex-shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                              <button onClick={() => removeAttachment(i)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button onClick={handleRaiseTicket} className="w-full">
                      Submit Ticket
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default OrderDetail;
