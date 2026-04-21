import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, Clock, CheckCircle2, Truck, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/components/common/EmptyState";

const statusConfig = {
  placed: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: <Clock className="h-3.5 w-3.5" /> },
  confirmed: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  dispatched: { color: "bg-purple-100 text-purple-700 border-purple-200", icon: <Truck className="h-3.5 w-3.5" /> },
  delivered: { color: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  delayed: { color: "bg-red-100 text-red-700 border-red-200", icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

const Orders = () => {
  const { orders } = useOrders();
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => {
          if (filter === "active") return ["placed", "confirmed", "dispatched"].includes(o.status);
          if (filter === "delivered") return o.status === "delivered";
          if (filter === "delayed") return o.status === "delayed";
          return true;
        });

  const counts = {
    all: orders.length,
    active: orders.filter((o) => ["placed", "confirmed", "dispatched"].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    delayed: orders.filter((o) => o.status === "delayed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Package className="h-6 w-6" /> My Orders
        </h1>
        <p className="text-sm text-muted-foreground mb-6">Track and manage all your orders</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["all", "active", "delivered", "delayed"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize flex-shrink-0 gap-1.5"
            >
              {f}
              <span className="text-xs opacity-70">({counts[f]})</span>
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No orders found"
            subtitle="Orders you place will appear here"
            actionLabel="Start Shopping"
            actionTo="/"
          />
        ) : (
          <div className="space-y-3 animate-fade-in">
            {filtered.map((order) => {
              const config = statusConfig[order.status] || statusConfig.placed;
              return (
                <Link to={`/order/${order.id}`} key={order.id} className="block">
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-bold text-sm">{order.id}</span>
                            <Badge className={`${config.color} gap-1`} variant="secondary">
                              {config.icon}
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>
                              {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="font-semibold text-foreground">
                              ₹{(order.total ?? 0).toLocaleString()}
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span>{format(new Date(order.createdAt), "dd MMM yyyy")}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
