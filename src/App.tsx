import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InquiryProvider } from "@/contexts/InquiryContext";
import { BuyerProvider } from "@/contexts/BuyerContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import Index from "./pages/Index.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import ProductListing from "./pages/ProductListing.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import SupplierProfile from "./pages/SupplierProfile.tsx";
import InquiryCart from "./pages/InquiryCart.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import Orders from "./pages/Orders.tsx";
import OrderDetail from "./pages/OrderDetail.tsx";
import TicketView from "./pages/TicketView.tsx";
import Login from "./pages/Login.tsx";
import KYC from "./pages/KYC.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BuyerProvider>
        <CartProvider>
          <OrderProvider>
            <InquiryProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/kyc" element={<KYC />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/category/:categoryId" element={<ProductListing />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/supplier/:supplierId" element={<SupplierProfile />} />
                  <Route path="/inquiry" element={<InquiryCart />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/order/:orderId" element={<OrderDetail />} />
                  <Route path="/ticket/:ticketId" element={<TicketView />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </InquiryProvider>
          </OrderProvider>
        </CartProvider>
      </BuyerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
