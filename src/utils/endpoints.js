/**
 * API endpoint configuration.
 *
 * HOW TO SWITCH FROM MOCK TO REAL BACKEND
 * ────────────────────────────────────────
 * 1. Set BASE_URL to your actual API base, e.g.:
 *      export const BASE_URL = "https://api.bharatbuildcon.com/v1";
 * 2. Set IS_MOCK = false.
 * 3. In http-service.js, the real fetch branch will activate automatically.
 * 4. No other file needs to change.
 */

/** Set to false when you are ready to hit a real backend. */
export const IS_MOCK = true;

/** Base URL for all API requests. Empty string = same origin (for mock/proxy). */
export const BASE_URL = "";

/** API version prefix appended to BASE_URL. */
export const API_VERSION = "/api/v1";

/** Full resolved API root. */
export const API_ROOT = `${BASE_URL}${API_VERSION}`;

// ─── Endpoint paths ───────────────────────────────────────────────────────────
// All paths are relative to API_ROOT.
// Usage: `${API_ROOT}${ENDPOINTS.catalog}`

export const ENDPOINTS = {
  // Catalog
  catalog:                "/catalog",
  categories:             "/categories",

  // Products
  products:               "/products",
  productById:            (id)         => `/products/${id}`,
  productsByCategory:     (categoryId) => `/products?category=${categoryId}`,
  productsBySupplier:     (supplierId) => `/products?supplier=${supplierId}`,
  searchProducts:         (q)          => `/products/search?q=${encodeURIComponent(q)}`,

  // Suppliers
  suppliers:              "/suppliers",
  supplierById:           (id)         => `/suppliers/${id}`,
  searchSuppliers:        (q)          => `/suppliers/search?q=${encodeURIComponent(q)}`,

  // Search (combined)
  search:                 (q)          => `/search?q=${encodeURIComponent(q)}`,

  // Auth
  login:                  "/auth/login",
  loginOtp:               "/auth/otp/send",
  verifyOtp:              "/auth/otp/verify",
  signup:                 "/auth/signup",
  logout:                 "/auth/logout",

  // Buyer / KYC
  buyerProfile:           "/buyer/profile",
  kycSubmit:              "/buyer/kyc",
  kycStatus:              "/buyer/kyc/status",

  // Cart / Checkout
  cart:                   "/cart",
  checkout:               "/checkout",

  // Orders
  orders:                 "/orders",
  orderById:              (id)         => `/orders/${id}`,
  orderProgress:          (id)         => `/orders/${id}/progress`,

  // Support tickets
  tickets:                "/tickets",
  ticketById:             (id)         => `/tickets/${id}`,
  ticketMessages:         (id)         => `/tickets/${id}/messages`,

  // Addresses
  addresses:              "/addresses",
};
