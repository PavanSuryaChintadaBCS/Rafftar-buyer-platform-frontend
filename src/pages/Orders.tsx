import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  placed: "bg-blue-100 text-blue-700",
  confirmed: "bg-amber-100 text-amber-700",
  dispatched: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  delayed: "bg-red-100 text-red-700",
};

const Orders = () => {
  const { orders } = useOrders();
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => {
    if (filter === "active") return ["placed", "confirmed", "dispatched"].includes(o.status);
    if (filter === "delivered") return o.status === "delivered";
    if (filter === "delayed") return o.status === "delayed";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="h-6 w-6" /> My Orders
        </h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["all", "active", "delivered", "delayed"].map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize flex-shrink-0">
              {f}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No orders found.</p>
            <Link to="/">
              <Button variant="outline" className="mt-4">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <Link to={`/order/${order.id}`} key={order.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-sm">{order.id}</span>
                          <Badge className={statusColors[order.status] || ""} variant="secondary">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""} · ₹{order.total.toLocaleString()} · {format(new Date(order.createdAt), "dd MMM yyyy")}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
