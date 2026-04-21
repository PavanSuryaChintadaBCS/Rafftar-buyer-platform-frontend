// ─── Route paths ────────────────────────────────────────────────────────────
/** Route path literals — single source of truth for navigation and router config. */
export const ROUTES = {
  HOME:     "/",
  LOGIN:    "/login",
  SEARCH:   "/search",
  CATEGORY: "/category/:categoryId",
  PRODUCT:  "/product/:productId",
  SUPPLIER: "/supplier/:supplierId",
  INQUIRY:  "/inquiry",
  CART:     "/cart",
  CHECKOUT: "/checkout",
  ORDERS:   "/orders",
  ORDER:    "/order/:orderId",
  TICKET:   "/ticket/:ticketId",
  KYC:      "/kyc",
};

// ─── App-wide limits & magic numbers ────────────────────────────────────────
export const APP = {
  /** Name shown in the browser tab and OG tags. */
  NAME: "Bharat Buildcon",
  /** Tagline used on login and marketing surfaces. */
  TAGLINE: "B2B construction materials marketplace",
  /** Logistics fee applied to every order (3 %). */
  LOGISTICS_RATE: 0.03,
  /** GST rate applied to every order (18 %). */
  GST_RATE: 0.18,
  /** Maximum number of support-ticket attachments per submission. */
  MAX_TICKET_ATTACHMENTS: 5,
  /** Delay in ms before the KYC nudge dialog appears on a product page. */
  KYC_PROMPT_DELAY_MS: 2 * 60 * 1000,
  /** Minimum characters before a search query fires. */
  MIN_SEARCH_LENGTH: 2,
};

// ─── Buyer types ─────────────────────────────────────────────────────────────
export const BUYER_TYPE = {
  STANDARD: "standard",
  RAFFTAR:  "rafftar",
};

// ─── Order status flow ───────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PLACED:     "placed",
  CONFIRMED:  "confirmed",
  DISPATCHED: "dispatched",
  DELIVERED:  "delivered",
  DELAYED:    "delayed",
};

export const ORDER_STATUS_FLOW = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.DISPATCHED,
  ORDER_STATUS.DELIVERED,
];

// ─── Ticket types ────────────────────────────────────────────────────────────
export const TICKET_TYPE = {
  DELAY:    "delay",
  QUALITY:  "quality",
  QUANTITY: "quantity",
  INVOICE:  "invoice",
};
