/** localStorage keys — migrated from legacy `buildmart_*` on first read. */
export const STORAGE_KEYS = {
  buyer: "bharat_buildcon_buyer",
  cart: "bharat_buildcon_cart",
  orders: "bharat_buildcon_orders",
  tickets: "bharat_buildcon_tickets",
  orderCounter: "bharat_buildcon_order_counter",
};

const LEGACY = {
  buyer: "buildmart_buyer",
  cart: "buildmart_cart",
  orders: "buildmart_orders",
  tickets: "buildmart_tickets",
  orderCounter: "buildmart_order_counter",
};

export function readStorageItem(key) {
  const k = STORAGE_KEYS[key];
  const legacy = LEGACY[key];
  try {
    let v = localStorage.getItem(k);
    if (v == null && legacy) {
      v = localStorage.getItem(legacy);
      if (v != null) {
        localStorage.setItem(k, v);
        localStorage.removeItem(legacy);
      }
    }
    return v;
  } catch {
    return null;
  }
}

export function writeStorageItem(key, value) {
  const k = STORAGE_KEYS[key];
  const legacy = LEGACY[key];
  try {
    localStorage.setItem(k, value);
    if (legacy) localStorage.removeItem(legacy);
  } catch {
    /* ignore */
  }
}
