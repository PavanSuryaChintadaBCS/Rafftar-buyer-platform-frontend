import { useParams } from "react-router-dom";
import { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
const TicketView = () => {
  const { ticketId } = useParams();
  const { tickets, addTicketMessage, resolveTicket } = useOrders();
  const ticket = tickets.find((t) => t.id === ticketId);
  const [reply, setReply] = useState("");
  if (!ticket) {
    return <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Ticket not found.</p></div></div>;
  }
  const handleSend = () => {
    if (!reply.trim()) return;
    addTicketMessage(ticket.id, reply, "buyer");
    setReply("");
    setTimeout(() => {
      addTicketMessage(ticket.id, "Thank you for the update. We're looking into it right away.", "admin");
    }, 3e3);
  };
  const handleResolve = () => {
    resolveTicket(ticket.id);
    toast.success("Ticket resolved!");
  };
  return <div className="min-h-screen bg-background"><main className="container mx-auto px-4 py-6 max-w-2xl"><div className="flex items-center justify-between mb-6"><div><h1 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="h-5 w-5" /> {ticket.id}</h1><p className="text-sm text-muted-foreground">
              Order {ticket.orderId} · <span className="capitalize">{ticket.type}</span> issue
            </p></div><div className="flex items-center gap-2"><Badge variant={ticket.status === "open" ? "default" : "secondary"}>{ticket.status}</Badge>{ticket.status === "open" && <Button variant="outline" size="sm" onClick={handleResolve} className="gap-1"><CheckCircle2 className="h-3 w-3" /> Resolve
              </Button>}</div></div>{
    /* Chat */
  }<Card><CardContent className="p-4"><div className="space-y-3 max-h-96 overflow-y-auto mb-4">{ticket.messages.map((msg) => <div key={msg.id} className={cn("flex", msg.sender === "buyer" ? "justify-end" : "justify-start")}><div className={cn(
    "max-w-[75%] rounded-xl px-4 py-2",
    msg.sender === "buyer" ? "bg-primary text-primary-foreground" : "bg-secondary"
  )}><p className="text-sm">{msg.text}</p><p className={cn("text-xs mt-1", msg.sender === "buyer" ? "text-primary-foreground/70" : "text-muted-foreground")}>{format(new Date(msg.timestamp), "hh:mm a")}</p></div></div>)}</div>{ticket.status === "open" && <div className="flex gap-2"><Textarea
    value={reply}
    onChange={(e) => setReply(e.target.value)}
    placeholder="Type your message..."
    rows={2}
    className="flex-1"
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }}
  /><Button onClick={handleSend} className="self-end">Send</Button></div>}</CardContent></Card></main></div>;
};
export default TicketView;
