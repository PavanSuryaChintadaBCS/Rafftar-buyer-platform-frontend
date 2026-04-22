import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InquiryProvider } from "@/contexts/InquiryContext";
import { BuyerProvider } from "@/contexts/BuyerContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BuyerProvider>
          <CartProvider>
            <OrderProvider>
              <InquiryProvider>
                <Toaster />
                <Sonner />
                {children}
              </InquiryProvider>
            </OrderProvider>
          </CartProvider>
        </BuyerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
