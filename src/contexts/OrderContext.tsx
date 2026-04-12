import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Order, Ticket, TicketMessage, CartItem, Address } from "@/data/types";

interface OrderContextType {
  orders: Order[];
  tickets: Ticket[];
  placeOrder: (items: CartItem[], address: Address, deliveryDate: string, approvalRequired: boolean) => Order;
  getOrder: (id: string) => Order | undefined;
  progressOrder: (id: string) => void;
  createTicket: (orderId: string, type: Ticket["type"], message: string) => Ticket;
  addTicketMessage: (ticketId: string, text: string, sender: "buyer" | "admin") => void;
  resolveTicket: (ticketId: string) => void;
  getTicketsForOrder: (orderId: string) => Ticket[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

let orderCounter = parseInt(localStorage.getItem("buildmart_order_counter") || "1000", 10);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("buildmart_orders");
    return saved ? JSON.parse(saved) : [];
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem("buildmart_tickets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem("buildmart_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("buildmart_tickets", JSON.stringify(tickets)); }, [tickets]);

  const placeOrder = useCallback((items: CartItem[], address: Address, deliveryDate: string, approvalRequired: boolean): Order => {
    orderCounter++;
    localStorage.setItem("buildmart_order_counter", String(orderCounter));
    const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
    const logistics = Math.round(subtotal * 0.03);
    const tax = Math.round(subtotal * 0.18);
    const now = new Date().toISOString();
    const order: Order = {
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
      approvalRequired,
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const progressOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const statusFlow: Order["status"][] = ["placed", "confirmed", "dispatched", "delivered"];
        const currentIdx = statusFlow.indexOf(o.status);
        if (currentIdx >= statusFlow.length - 1) return o;
        const nextStatus = statusFlow[currentIdx + 1];
        const descriptions: Record<string, string> = {
          confirmed: "Supplier has confirmed your order.",
          dispatched: "Your order has been dispatched and is on its way.",
          delivered: "Order delivered successfully!",
        };
        return {
          ...o,
          status: nextStatus,
          timeline: [
            ...o.timeline,
            { status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1), timestamp: new Date().toISOString(), description: descriptions[nextStatus] || "" },
          ],
        };
      })
    );
  }, []);

  const createTicket = useCallback((orderId: string, type: Ticket["type"], message: string): Ticket => {
    const ticket: Ticket = {
      id: `TKT${Date.now()}`,
      orderId,
      type,
      status: "open",
      createdAt: new Date().toISOString(),
      messages: [{ id: `msg_${Date.now()}`, sender: "buyer", text: message, timestamp: new Date().toISOString() }],
    };
    setTickets((prev) => [ticket, ...prev]);
    // Simulate admin reply after 3s
    setTimeout(() => {
      addTicketMessage(ticket.id, getAutoReply(type), "admin");
    }, 3000);
    return ticket;
  }, []);

  const addTicketMessage = useCallback((ticketId: string, text: string, sender: "buyer" | "admin") => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, messages: [...t.messages, { id: `msg_${Date.now()}_${Math.random()}`, sender, text, timestamp: new Date().toISOString() }] }
          : t
      )
    );
  }, []);

  const resolveTicket = useCallback((ticketId: string) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: "resolved" as const } : t)));
  }, []);

  const getTicketsForOrder = useCallback((orderId: string) => tickets.filter((t) => t.orderId === orderId), [tickets]);

  return (
    <OrderContext.Provider value={{ orders, tickets, placeOrder, getOrder, progressOrder, createTicket, addTicketMessage, resolveTicket, getTicketsForOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

function getAutoReply(type: Ticket["type"]): string {
  const replies: Record<string, string> = {
    delay: "We apologize for the delay. Our logistics team is looking into this and will update you within 24 hours.",
    quality: "Thank you for reporting this. Please share photos of the defective items and we'll arrange a replacement.",
    quantity: "We're checking with the warehouse. If there's a shortage, we'll dispatch the remaining items ASAP.",
    invoice: "Our accounts team will review and send the corrected invoice within 2 business days.",
  };
  return replies[type] || "Thank you for reaching out. We'll get back to you shortly.";
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
