import { IS_MOCK, API_ROOT, ENDPOINTS } from "./endpoints";
import {
  categories,
  suppliers,
  products,
  mockAddresses,
  searchProducts,
  searchSuppliers,
  getProductsByCategory,
  getProductsBySupplier,
  getSupplierById,
  getProductById,
  getPriceForQuantity,
  highlightMatch,
} from "@/data/mock";

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Simulated network delay for mock mode. */
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Base fetch wrapper — used in real (non-mock) mode.
 * Adds auth headers, handles non-2xx errors, and parses JSON.
 *
 * @param {string} path   - relative endpoint path (from ENDPOINTS)
 * @param {object} [opts] - fetch options (method, body, headers, etc.)
 */
async function request(path, opts = {}) {
  const url = `${API_ROOT}${path}`;
  const token = localStorage.getItem("auth_token");

  const hasBody = opts.body !== undefined && opts.body !== null;
  const isFormData = opts.body instanceof FormData;

  const res = await fetch(url, {
    ...opts,                          // caller's method/body/etc come first
    headers: {
      ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,               // caller can add extra headers on top
    },
    credentials: "include",          // always last so it can't be overridden
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    const err = new Error(error.message || `HTTP ${res.status}`);
    err.code = error.error;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * The single service object used by all pages and hooks.
 * All components import from here — never from @/data/mock directly.
 *
 * MOCK MODE  (IS_MOCK = true):  returns in-memory data after a small delay.
 * REAL MODE  (IS_MOCK = false): hits the actual REST API via `request()`.
 *
 * Backend response envelope: { success: true, data: {...}, meta?: {...} }
 * Service methods unwrap `data` so callers receive the domain objects directly.
 */
export const httpService = {

  // ── Catalog (mock only — real mode fetches each resource individually) ──────

  async getCatalog() {
    if (IS_MOCK) {
      await delay(90);
      return { categories, suppliers, products };
    }
    const [cats, sups, prods] = await Promise.all([
      request(ENDPOINTS.categories),
      request(ENDPOINTS.suppliers),
      request(ENDPOINTS.products),
    ]);
    return {
      categories: cats.data?.categories ?? cats,
      suppliers:  sups.data?.suppliers  ?? sups,
      products:   prods.data            ?? prods,
    };
  },

  // ── Categories ────────────────────────────────────────────────────────────

  async getCategories() {
    if (IS_MOCK) {
      await delay(60);
      return categories;
    }
    const res = await request(ENDPOINTS.categories);
    return res.data?.categories ?? res;
  },

  // ── Products ───────────────────────────────────────────────────────────────

  async getProducts(params = {}) {
    if (IS_MOCK) {
      await delay(80);
      return { data: products, meta: { total: products.length, page: 1, limit: 50 } };
    }
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, v);
    });
    const query = qs.toString() ? `?${qs}` : "";
    const res = await request(`${ENDPOINTS.products}${query}`);
    return res;
  },

  async getProductById(id) {
    if (IS_MOCK) {
      await delay(70);
      return getProductById(id) ?? null;
    }
    const res = await request(ENDPOINTS.productById(id));
    return res.data?.product ?? res.data ?? res;
  },

  async getProductsByCategory(categoryId) {
    if (IS_MOCK) {
      await delay(80);
      return getProductsByCategory(categoryId);
    }
    const res = await request(`${ENDPOINTS.products}?category=${encodeURIComponent(categoryId)}`);
    return res.data ?? res;
  },

  async getProductsBySupplier(supplierId) {
    if (IS_MOCK) {
      await delay(80);
      return getProductsBySupplier(supplierId);
    }
    const res = await request(`${ENDPOINTS.products}?supplierId=${encodeURIComponent(supplierId)}`);
    return res.data ?? res;
  },

  async searchProducts(q, params = {}) {
    if (IS_MOCK) {
      await delay(100);
      return searchProducts(q);
    }
    const qs = new URLSearchParams({ q, ...params });
    const res = await request(`${ENDPOINTS.productsSearch}?${qs}`);
    return res;
  },

  // ── Suppliers ──────────────────────────────────────────────────────────────

  async getSuppliers(params = {}) {
    if (IS_MOCK) {
      await delay(70);
      return { data: { suppliers }, meta: { total: suppliers.length } };
    }
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, v);
    });
    const query = qs.toString() ? `?${qs}` : "";
    const res = await request(`${ENDPOINTS.suppliers}${query}`);
    return res;
  },

  async getSupplierById(id) {
    if (IS_MOCK) {
      await delay(70);
      return getSupplierById(id) ?? null;
    }
    const res = await request(ENDPOINTS.supplierById(id));
    return res.data?.supplier ?? res.data ?? res;
  },

  async getSupplierProducts(supplierPgId, params = {}) {
    if (IS_MOCK) {
      await delay(80);
      return getProductsBySupplier(supplierPgId);
    }
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, v);
    });
    const query = qs.toString() ? `?${qs}` : "";
    const res = await request(`${ENDPOINTS.supplierProducts(supplierPgId)}${query}`);
    return res.data ?? res;
  },

  // ── Search (combined products + suppliers) ─────────────────────────────────

  async searchCatalog(query, type = "all") {
    if (IS_MOCK) {
      await delay(100);
      const q = (query || "").trim();
      return {
        products:  searchProducts(q),
        suppliers: searchSuppliers(q),
      };
    }
    const qs = new URLSearchParams({ q: query, type });
    const res = await request(`${ENDPOINTS.search}?${qs}`);
    return res;
  },

  // ── Auth ───────────────────────────────────────────────────────────────────

  async register(payload) {
    if (IS_MOCK) {
      await delay(1500);
      return { buyer: { email: payload.email }, token: "mock_token_register" };
    }
    const res = await request(ENDPOINTS.register, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.data?.token) localStorage.setItem("auth_token", res.data.token);
    return res.data ?? res;
  },

  async login(payload) {
    if (IS_MOCK) {
      await delay(1200);
      return { name: payload.name, token: "mock_token_123" };
    }
    const res = await request(ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.data?.token) localStorage.setItem("auth_token", res.data.token);
    return res.data ?? res;
  },

  async refreshToken() {
    if (IS_MOCK) {
      await delay(300);
      return { token: "mock_token_refreshed" };
    }
    const res = await request(ENDPOINTS.refresh, { method: "POST" });
    if (res.data?.token) localStorage.setItem("auth_token", res.data.token);
    return res.data ?? res;
  },

  async logout() {
    if (IS_MOCK) {
      await delay(300);
      return { success: true };
    }
    const res = await request(ENDPOINTS.logout, { method: "POST" });
    localStorage.removeItem("auth_token");
    return res;
  },

  async getAuthMe() {
    if (IS_MOCK) {
      await delay(200);
      return null;
    }
    const res = await request(ENDPOINTS.authMe);
    return res.data?.buyer ?? res.data ?? res;
  },

  async getBuyerProfile() {
    if (IS_MOCK) {
      await delay(200);
      return null;
    }
    const res = await request(ENDPOINTS.buyersMe);
    return res.data?.buyer ?? res.data ?? res;
  },

  // ── KYC ───────────────────────────────────────────────────────────────────

  async submitKyc(payload) {
    if (IS_MOCK) {
      await delay(2000);
      return { verified: true };
    }
    const isFormData = payload instanceof FormData;
    const res = await request(ENDPOINTS.kycSubmit, {
      method: "POST",
      body: isFormData ? payload : JSON.stringify(payload),
    });
    return res.data?.kyc ?? res.data ?? res;
  },

  async getKycStatus() {
    if (IS_MOCK) {
      await delay(500);
      return null;
    }
    const res = await request(ENDPOINTS.kycStatus);
    return res.data?.kyc ?? res.data ?? res;
  },

  async resubmitKyc(payload) {
    if (IS_MOCK) {
      await delay(2000);
      return { verified: true };
    }
    const isFormData = payload instanceof FormData;
    const res = await request(ENDPOINTS.kycResubmit, {
      method: "POST",
      body: isFormData ? payload : JSON.stringify(payload),
    });
    return res.data?.kyc ?? res.data ?? res;
  },

  // ── Addresses ─────────────────────────────────────────────────────────────

  async listAddresses() {
    if (IS_MOCK) {
      await delay(50);
      return mockAddresses;
    }
    const res = await request(ENDPOINTS.addresses);
    return res.data?.addresses ?? res.data ?? res;
  },

  async createAddress(payload) {
    if (IS_MOCK) {
      await delay(500);
      return { id: `addr_${Date.now()}`, ...payload };
    }
    const res = await request(ENDPOINTS.addresses, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data?.address ?? res.data ?? res;
  },

  async updateAddress(id, payload) {
    if (IS_MOCK) {
      await delay(400);
      return { id, ...payload };
    }
    const res = await request(ENDPOINTS.addressById(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data?.address ?? res.data ?? res;
  },

  async deleteAddress(id) {
    if (IS_MOCK) {
      await delay(400);
      return { success: true };
    }
    const res = await request(ENDPOINTS.addressById(id), { method: "DELETE" });
    return res;
  },

  // ── Cart ──────────────────────────────────────────────────────────────────

  async getCart() {
    if (IS_MOCK) {
      await delay(50);
      return { items: [] };
    }
    const res = await request(ENDPOINTS.cart);
    return res.data ?? res;
  },

  async addCartItem(payload) {
    if (IS_MOCK) {
      await delay(200);
      return payload;
    }
    const res = await request(ENDPOINTS.cartItems, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data ?? res;
  },

  async updateCartItem(productId, payload) {
    if (IS_MOCK) {
      await delay(200);
      return payload;
    }
    const res = await request(ENDPOINTS.cartItemByProduct(productId), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data ?? res;
  },

  async removeCartItem(productId) {
    if (IS_MOCK) {
      await delay(200);
      return { success: true };
    }
    const res = await request(ENDPOINTS.cartItemByProduct(productId), {
      method: "DELETE",
    });
    return res;
  },

  // ── Orders ────────────────────────────────────────────────────────────────

  async checkout(deliveryAddressId) {
    if (IS_MOCK) {
      await delay(1000);
      return { order: { id: `ord_${Date.now()}`, status: "placed" } };
    }
    const res = await request(ENDPOINTS.ordersCheckout, {
      method: "POST",
      body: JSON.stringify({ deliveryAddressId }),
    });
    return res.data ?? res;
  },

  async getOrders() {
    if (IS_MOCK) {
      await delay(300);
      return { orders: [] };
    }
    const res = await request(ENDPOINTS.orders);
    return res.data ?? res;
  },

  async getOrderById(id) {
    if (IS_MOCK) {
      await delay(200);
      return null;
    }
    const res = await request(ENDPOINTS.orderById(id));
    return res.data?.order ?? res.data ?? res;
  },

  async cancelOrder(id) {
    if (IS_MOCK) {
      await delay(500);
      return { order: { id, status: "cancelled" } };
    }
    const res = await request(ENDPOINTS.orderCancel(id), { method: "PATCH" });
    return res.data ?? res;
  },

  // ── Tickets ───────────────────────────────────────────────────────────────

  async getTickets(params = {}) {
    if (IS_MOCK) {
      await delay(300);
      return { data: [], meta: { total: 0 } };
    }
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, v);
    });
    const query = qs.toString() ? `?${qs}` : "";
    const res = await request(`${ENDPOINTS.tickets}${query}`);
    return res;
  },

  async getTicketsByUser(userId, params = {}) {
    if (IS_MOCK) {
      await delay(300);
      return { data: [], meta: { total: 0 } };
    }
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, v);
    });
    const query = qs.toString() ? `?${qs}` : "";
    const res = await request(`${ENDPOINTS.ticketsByUser(userId)}${query}`);
    return res;
  },

  async createTicket(payload) {
    if (IS_MOCK) {
      await delay(600);
      return {
        id: `tkt_${Date.now()}`,
        status: "open",
        messages: [{ id: `msg_${Date.now()}`, text: payload.message, sender_type: "buyer" }],
      };
    }
    const res = await request(ENDPOINTS.tickets, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data ?? res;
  },

  async getTicketById(id) {
    if (IS_MOCK) {
      await delay(200);
      return null;
    }
    const res = await request(ENDPOINTS.ticketById(id));
    return res.data ?? res;
  },

  async updateTicketStatus(id, status, agentId) {
    if (IS_MOCK) {
      await delay(400);
      return { id, status };
    }
    const res = await request(ENDPOINTS.ticketStatus(id), {
      method: "PATCH",
      body: JSON.stringify({ status, ...(agentId ? { agentId } : {}) }),
    });
    return res.data ?? res;
  },

  async assignTicket(id, agentId) {
    if (IS_MOCK) {
      await delay(400);
      return { id, status: "in_progress", assigned_to: agentId };
    }
    const res = await request(ENDPOINTS.ticketAssign(id), {
      method: "PATCH",
      body: JSON.stringify({ agentId }),
    });
    return res.data ?? res;
  },

  async resolveTicket(id) {
    if (IS_MOCK) {
      await delay(400);
      return { id, status: "resolved" };
    }
    const res = await request(ENDPOINTS.ticketResolve(id), { method: "PATCH" });
    return res.data ?? res;
  },

  async getTicketMessages(id) {
    if (IS_MOCK) {
      await delay(200);
      return [];
    }
    const res = await request(ENDPOINTS.ticketMessages(id));
    return res.data ?? res;
  },

  async addTicketMessage(id, text) {
    if (IS_MOCK) {
      await delay(300);
      return { id: `msg_${Date.now()}`, text, sender_type: "buyer" };
    }
    const res = await request(ENDPOINTS.ticketMessages(id), {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    return res.data ?? res;
  },

  // ── Inquiries ─────────────────────────────────────────────────────────────

  async createInquiry(payload) {
    if (IS_MOCK) {
      await delay(600);
      return {
        id: `inq_${Date.now()}`,
        items: payload.items,
      };
    }
    const res = await request(ENDPOINTS.inquiries, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data ?? res;
  },

  async getInquiries() {
    if (IS_MOCK) {
      await delay(300);
      return [];
    }
    const res = await request(ENDPOINTS.inquiries);
    return res.data ?? res;
  },

  // ── Helpers (pure — same in mock and real) ────────────────────────────────

  getPriceForQuantity,
  highlightMatch,
};

// ─── Named alias kept for backward compat ─────────────────────────────────────
export const mockApi = httpService;
