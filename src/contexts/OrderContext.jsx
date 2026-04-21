import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { readStorageItem, writeStorageItem } from "@/utils/storage-keys";
import { safeParse } from "@/utils/persist";

const OrderContext = createContext(undefined);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() =>
    safeParse(readStorageItem("orders"), [])
  );

  const [tickets, setTickets] = useState(() =>
    safeParse(readStorageItem("tickets"), [])
  );

  const [counter, setCounter] = useState(() =>
    parseInt(readStorageItem("orderCounter") || "1000", 10)
  );

  useEffect(() => {
    writeStorageItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    writeStorageItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    writeStorageItem("orderCounter", String(counter));
  }, [counter]);

  const addTicketMessage = useCallback((ticketId, text, sender) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: `msg_${Date.now()}_${Math.random()}`,
                  sender,
                  text,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : t
      )
    );
  }, []);

  const placeOrder = useCallback(
    (items, address, deliveryDate, approvalRequired) => {
      let order;

      setCounter((prev) => {
        const next = prev + 1;

        const subtotal = (items || []).reduce(
          (s, i) => s + (i.totalPrice || i.unitPrice * i.quantity),
          0
        );

        const logistics = Math.round(subtotal * 0.03);
        const tax = Math.round(subtotal * 0.18);
        const now = new Date().toISOString();

        order = {
          id: `ORD${next}`,
          items,
          status: "placed",
          createdAt: now,
          address,
          deliveryDate,
          approvalRequired,
          subtotal,
          logistics,
          tax,
          total: subtotal + logistics + tax,
          timeline: [
            {
              status: "Order Placed",
              timestamp: now,
              description: "Your order has been placed successfully.",
            },
          ],
        };

        return next;
      });

      setOrders((prev) => [order, ...prev]);

      return order;
    },
    []
  );

  const progressOrder = useCallback((id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;

        const flow = ["placed", "confirmed", "dispatched", "delivered"];
        const idx = flow.indexOf(o.status);
        if (idx === -1 || idx >= flow.length - 1) return o;

        const next = flow[idx + 1];

        const descriptions = {
          confirmed: "Supplier has confirmed your order.",
          dispatched: "Order dispatched and on the way.",
          delivered: "Order delivered successfully.",
        };

        return {
          ...o,
          status: next,
          timeline: [
            ...o.timeline,
            {
              status: next.charAt(0).toUpperCase() + next.slice(1),
              timestamp: new Date().toISOString(),
              description: descriptions[next] || "",
            },
          ],
        };
      })
    );
  }, []);

  const getOrder = useCallback(
    (id) => orders.find((o) => o.id === id),
    [orders]
  );

  const createTicket = useCallback(
    (orderId, type, message) => {
      const ticket = {
        id: `TKT${Date.now()}`,
        orderId,
        type,
        status: "open",
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: "buyer",
            text: message,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setTickets((prev) => [ticket, ...prev]);

      setTimeout(() => {
        addTicketMessage(
          ticket.id,
          "We received your request. Our team will respond shortly.",
          "admin"
        );
      }, 2000);

      return ticket;
    },
    [addTicketMessage]
  );

  const resolveTicket = useCallback((ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: "resolved" } : t
      )
    );
  }, []);

  const getTicketsForOrder = useCallback(
    (orderId) => tickets.filter((t) => t.orderId === orderId),
    [tickets]
  );

  const value = useMemo(
    () => ({
      orders,
      tickets,
      placeOrder,
      getOrder,
      progressOrder,
      createTicket,
      addTicketMessage,
      resolveTicket,
      getTicketsForOrder,
    }),
    [
      orders,
      tickets,
      placeOrder,
      getOrder,
      progressOrder,
      createTicket,
      addTicketMessage,
      resolveTicket,
      getTicketsForOrder,
    ]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx)
    throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
