export interface Supplier {
  id: string;
  name: string;
  logo: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  established: number;
  productCount: number;
  rafftarPricing: boolean;
  tags: string[];
}

export interface BulkPricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  rating: number;
  reviewCount: number;
  description: string;
  specifications: Record<string, string>;
  bulkPricing: BulkPricingTier[];
  inStock: boolean;
  moq: number;
  tags: string[];
  rafftarDiscount: number; // percentage discount for Rafftar buyers
}

export interface InquiryItem {
  product: Product;
  quantity: number;
}

export interface CartItem {
  productId: string;
  supplierId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
}

export interface OrderTimelineEntry {
  status: string;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: "placed" | "confirmed" | "dispatched" | "delivered" | "delayed";
  timeline: OrderTimelineEntry[];
  createdAt: string;
  address: Address;
  deliveryDate: string;
  subtotal: number;
  logistics: number;
  tax: number;
  total: number;
  approvalRequired: boolean;
}

export interface TicketMessage {
  id: string;
  sender: "buyer" | "admin";
  text: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  orderId: string;
  type: "delay" | "quality" | "quantity" | "invoice";
  messages: TicketMessage[];
  status: "open" | "resolved";
  createdAt: string;
}

export type BuyerType = "standard" | "rafftar";

export interface Buyer {
  isLoggedIn: boolean;
  isKYCVerified: boolean;
  type: BuyerType;
  name: string;
}
