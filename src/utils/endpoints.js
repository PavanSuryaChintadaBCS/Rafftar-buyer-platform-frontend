/**
 * API endpoint configuration.
 *
 * HOW TO SWITCH FROM MOCK TO REAL BACKEND
 * ────────────────────────────────────────
 * 1. Set BASE_URL to your actual API base, e.g.:
 *      export const BASE_URL = "https://api.rafftar.com";
 * 2. Set IS_MOCK = false.
 * 3. In http-service.js, the real fetch branch will activate automatically.
 * 4. No other file needs to change.
 */

/** Set to false when you are ready to hit a real backend. */
export const IS_MOCK = true;

/** Base URL for all API requests. Empty string = same origin (for mock/proxy). */
export const BASE_URL = "http://localhost:3000";

/** API version prefix appended to BASE_URL. */
export const API_VERSION = "/api/v1";

/** Full resolved API root. */
export const API_ROOT = `${BASE_URL}${API_VERSION}`;

// ─── Endpoint paths ───────────────────────────────────────────────────────────
// All paths are relative to API_ROOT.
// Usage: `${API_ROOT}${ENDPOINTS.login}`

export const ENDPOINTS = {
  // Auth
  register:               "/auth/register",
  login:                  "/auth/login",
  refresh:                "/auth/refresh",
  logout:                 "/auth/logout",
  authMe:                 "/auth/me",

  // Buyers
  buyersMe:               "/buyers/me",

  // KYC
  kycSubmit:              "/kyc/submit",
  kycStatus:              "/kyc/status",
  kycResubmit:            "/kyc/resubmit",

  // Addresses
  addresses:              "/addresses",
  addressById:            (id)            => `/addresses/${id}`,

  // Cart
  cart:                   "/cart",
  cartItems:              "/cart/items",
  cartItemByProduct:      (productId)     => `/cart/items/${productId}`,

  // Orders
  orders:                 "/orders",
  ordersCheckout:         "/orders/checkout",
  orderById:              (id)            => `/orders/${id}`,
  orderCancel:            (id)            => `/orders/${id}/cancel`,

  // Categories
  categories:             "/categories",

  // Products
  products:               "/products",
  productsSearch:         "/products/search",
  productById:            (productId)     => `/products/${productId}`,

  // Suppliers
  suppliers:              "/suppliers",
  supplierById:           (supplierPgId)  => `/suppliers/${supplierPgId}`,
  supplierProducts:       (supplierPgId)  => `/suppliers/${supplierPgId}/products`,

  // Tickets
  tickets:                "/tickets",
  ticketsByUser:          (userId)        => `/tickets/user/${userId}`,
  ticketById:             (id)            => `/tickets/${id}`,
  ticketStatus:           (id)            => `/tickets/${id}/status`,
  ticketAssign:           (id)            => `/tickets/${id}/assign`,
  ticketResolve:          (id)            => `/tickets/${id}/resolve`,
  ticketMessages:         (id)            => `/tickets/${id}/messages`,

  // Inquiries
  inquiries:              "/inquiries",

  // Search (combined — supports ?q=&type=all|products|suppliers)
  search:                 "/search",
};
