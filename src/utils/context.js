/**
 * React Query cache key factory.
 * Import these instead of writing raw string arrays in useQuery / useMutation calls.
 *
 * Usage:
 *   useQuery({ queryKey: QUERY_KEYS.catalog(), ... })
 *   useQuery({ queryKey: QUERY_KEYS.product(id), ... })
 */
export const QUERY_KEYS = {
  /** Full product + supplier + category catalog. */
  catalog: ()           => ["catalog"],
  /** Single product detail. */
  product: (id)         => ["product", id],
  /** Single supplier detail. */
  supplier: (id)        => ["supplier", id],
  /** Products belonging to a category. */
  categoryProducts: (categoryId) => ["products", "category", categoryId],
  /** Products belonging to a supplier. */
  supplierProducts: (supplierId) => ["products", "supplier", supplierId],
  /** Search results for a query string. */
  search: (query)       => ["search", query],
  /** Saved delivery addresses. */
  addresses: ()         => ["addresses"],
};

/**
 * Default stale times (ms) for different data categories.
 * Pass as `staleTime` in useQuery options.
 */
export const STALE_TIME = {
  /** Catalog data — changes infrequently. */
  CATALOG:   5 * 60 * 1000,   // 5 min
  /** Search results — semi-dynamic. */
  SEARCH:    60 * 1000,        // 1 min
  /** User-specific data — always fresh. */
  USER:      0,
};
