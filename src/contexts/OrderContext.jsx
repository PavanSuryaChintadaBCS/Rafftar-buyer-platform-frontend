import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { readStorageItem, writeStorageItem } from "@/utils/storage-keys";

const OrderContext = createContext(void 0);
let orderCounter = parseInt(readStorageItem("orderCounter") || "1000", 10);
const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = readStorageItem("orders");
    return saved ? JSON.parse(saved) : [];
  });
  const [tickets, setTickets] = useState(() => {
    const saved = readStorageItem("tickets");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    writeStorageItem("orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    writeStorageItem("tickets", JSON.stringify(tickets));
  }, [tickets]);
  const placeOrder = useCallback((items, address, deliveryDate, approvalRequired) => {
    orderCounter++;
    writeStorageItem("orderCounter", String(orderCounter));
    const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
    const logistics = Math.round(subtotal * 0.03);
    const tax = Math.round(subtotal * 0.18);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const order = {
      id: `ORD${orderCounter}`,
      items,
      status: "placed",
      timeline: [{ status: "Order Placed", timestamp: now, description: "Your order has been placed successfully." }],
      createdAt: now,
      address,
      deliveryDate,
      subtotal,
      logistics,
      tax,
      total: subtotal + logistics + tax,
      approvalRequired
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);
  const getOrder = useCallback((id) => orders.find((o) => o.id === id), [orders]);
  const progressOrder = useCallback((id) => {
    setOrders(
      (prev) => prev.map((o) => {
        if (o.id !== id) return o;
        const statusFlow = ["placed", "confirmed", "dispatched", "delivered"];
        const currentIdx = statusFlow.indexOf(o.status);
        if (currentIdx >= statusFlow.length - 1) return o;
        const nextStatus = statusFlow[currentIdx + 1];
        const descriptions = {
          confirmed: "Supplier has confirmed your order.",
          dispatched: "Your order has been dispatched and is on its way.",
          delivered: "Order delivered successfully!"
        };
        return {
          ...o,
          status: nextStatus,
          timeline: [
            ...o.timeline,
            { status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1), timestamp: (/* @__PURE__ */ new Date()).toISOString(), description: descriptions[nextStatus] || "" }
          ]
        };
      })
    );
  }, []);
  const createTicket = useCallback((orderId, type, message) => {
    const ticket = {
      id: `TKT${Date.now()}`,
      orderId,
      type,
      status: "open",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      messages: [{ id: `msg_${Date.now()}`, sender: "buyer", text: message, timestamp: (/* @__PURE__ */ new Date()).toISOString() }]
    };
    setTickets((prev) => [ticket, ...prev]);
    setTimeout(() => {
      addTicketMessage(ticket.id, getAutoReply(type), "admin");
    }, 3e3);
    return ticket;
  }, []);
  const addTicketMessage = useCallback((ticketId, text, sender) => {
    setTickets(
      (prev) => prev.map(
        (t) => t.id === ticketId ? { ...t, messages: [...t.messages, { id: `msg_${Date.now()}_${Math.random()}`, sender, text, timestamp: (/* @__PURE__ */ new Date()).toISOString() }] } : t
      )
    );
  }, []);
  const resolveTicket = useCallback((ticketId) => {
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: "resolved" } : t));
  }, []);
  const getTicketsForOrder = useCallback((orderId) => tickets.filter((t) => t.orderId === orderId), [tickets]);
  return <OrderContext.Provider value={{ orders, tickets, placeOrder, getOrder, progressOrder, createTicket, addTicketMessage, resolveTicket, getTicketsForOrder }}>{children}</OrderContext.Provider>;
};
function getAutoReply(type) {
  const replies = {
    delay: "We apologize for the delay. Our logistics team is looking into this and will update you within 24 hours.",
    quality: "Thank you for reporting this. Please share photos of the defective items and we'll arrange a replacement.",
    quantity: "We're checking with the warehouse. If there's a shortage, we'll dispatch the remaining items ASAP.",
    invoice: "Our accounts team will review and send the corrected invoice within 2 business days."
  };
  return replies[type] || "Thank you for reaching out. We'll get back to you shortly.";
}
const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
export {
  OrderProvider,
  useOrders
};
