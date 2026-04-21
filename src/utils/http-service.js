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
 * @param {object} [opts] - fetch options (method, body, etc.)
 */
async function request(path, opts = {}) {
  const url = `${API_ROOT}${path}`;
  const token = localStorage.getItem("auth_token");

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
    ...opts,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
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
 */
export const httpService = {

  // ── Catalog ────────────────────────────────────────────────────────────────

  async getCatalog() {
    if (IS_MOCK) {
      await delay(90);
      return { categories, suppliers, products };
    }
    return request(ENDPOINTS.catalog);
  },

  // ── Products ───────────────────────────────────────────────────────────────

  async getProductById(id) {
    if (IS_MOCK) {
      await delay(70);
      return getProductById(id) ?? null;
    }
    return request(ENDPOINTS.productById(id));
  },

  async getProductsByCategory(categoryId) {
    if (IS_MOCK) {
      await delay(80);
      return getProductsByCategory(categoryId);
    }
    return request(ENDPOINTS.productsByCategory(categoryId));
  },

  async getProductsBySupplier(supplierId) {
    if (IS_MOCK) {
      await delay(80);
      return getProductsBySupplier(supplierId);
    }
    return request(ENDPOINTS.productsBySupplier(supplierId));
  },

  // ── Suppliers ──────────────────────────────────────────────────────────────

  async getSupplierById(id) {
    if (IS_MOCK) {
      await delay(70);
      return getSupplierById(id) ?? null;
    }
    return request(ENDPOINTS.supplierById(id));
  },

  // ── Search ─────────────────────────────────────────────────────────────────

  async searchCatalog(query) {
    if (IS_MOCK) {
      await delay(100);
      const q = (query || "").trim();
      return {
        products: searchProducts(q),
        suppliers: searchSuppliers(q),
      };
    }
    return request(ENDPOINTS.search(query));
  },

  // ── Addresses ─────────────────────────────────────────────────────────────

  async listAddresses() {
    if (IS_MOCK) {
      await delay(50);
      return mockAddresses;
    }
    return request(ENDPOINTS.addresses);
  },

  // ── Auth ───────────────────────────────────────────────────────────────────

  async login(payload) {
    if (IS_MOCK) {
      await delay(1200);
      return { name: payload.name, token: "mock_token_123" };
    }
    return request(ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async sendOtp(phone) {
    if (IS_MOCK) {
      await delay(1000);
      return { success: true };
    }
    return request(ENDPOINTS.loginOtp, {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(phone, otp, name) {
    if (IS_MOCK) {
      await delay(1200);
      return { name, token: "mock_token_otp" };
    }
    return request(ENDPOINTS.verifyOtp, {
      method: "POST",
      body: JSON.stringify({ phone, otp, name }),
    });
  },

  async signup(payload) {
    if (IS_MOCK) {
      await delay(1500);
      return { name: payload.name, token: "mock_token_signup" };
    }
    return request(ENDPOINTS.signup, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // ── KYC ───────────────────────────────────────────────────────────────────

  async submitKyc(payload) {
    if (IS_MOCK) {
      await delay(2000);
      return { verified: true };
    }
    return request(ENDPOINTS.kycSubmit, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // ── Helpers (pure — same in mock and real) ────────────────────────────────

  getPriceForQuantity,
  highlightMatch,
};

// ─── Named alias kept for backward compat ─────────────────────────────────────
// Old code that imports `mockApi` will still work unchanged.
export const mockApi = httpService;
