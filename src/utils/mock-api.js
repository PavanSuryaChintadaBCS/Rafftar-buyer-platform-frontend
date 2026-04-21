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

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Async mock API — mirrors a real HTTP client; swap for `utils/http-service` later.
 */
export const mockApi = {
  async getCatalog() {
    await delay(90);
    return { categories, suppliers, products };
  },

  async getProductById(id) {
    await delay(70);
    return getProductById(id) ?? null;
  },

  async getSupplierById(id) {
    await delay(70);
    return getSupplierById(id) ?? null;
  },

  async getProductsByCategory(categoryId) {
    await delay(80);
    return getProductsByCategory(categoryId);
  },

  async getProductsBySupplier(supplierId) {
    await delay(80);
    return getProductsBySupplier(supplierId);
  },

  async searchCatalog(query) {
    await delay(100);
    const q = (query || "").trim();
    return {
      products: searchProducts(q),
      suppliers: searchSuppliers(q),
    };
  },

  async listAddresses() {
    await delay(50);
    return mockAddresses;
  },

  getPriceForQuantity,
  highlightMatch,
};
