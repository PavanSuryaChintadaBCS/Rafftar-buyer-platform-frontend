/**
 * Offline / localStorage service.
 *
 * Responsibilities:
 *  - Defines canonical storage key names (one place to change them).
 *  - Migrates legacy key names on first read.
 *  - Exposes typed read/write helpers used by all contexts.
 */

// ─── Key maps ─────────────────────────────────────────────────────────────────

/** Current canonical localStorage keys. */
export const STORAGE_KEYS = {
  buyer:        "bharat_buildcon_buyer",
  cart:         "bharat_buildcon_cart",
  orders:       "bharat_buildcon_orders",
  tickets:      "bharat_buildcon_tickets",
  orderCounter: "bharat_buildcon_order_counter",
};

/** Legacy keys from the old "buildmart" brand — migrated on first read. */
const LEGACY_KEYS = {
  buyer:        "buildmart_buyer",
  cart:         "buildmart_cart",
  orders:       "buildmart_orders",
  tickets:      "buildmart_tickets",
  orderCounter: "buildmart_order_counter",
};

// ─── Core read/write ──────────────────────────────────────────────────────────

/**
 * Reads a stored value, migrating the legacy key if needed.
 *
 * @param {keyof STORAGE_KEYS} key
 * @returns {string | null}
 */
export function readStorageItem(key) {
  const canonical = STORAGE_KEYS[key];
  const legacy    = LEGACY_KEYS[key];
  try {
    let value = localStorage.getItem(canonical);
    if (value == null && legacy) {
      value = localStorage.getItem(legacy);
      if (value != null) {
        localStorage.setItem(canonical, value);
        localStorage.removeItem(legacy);
      }
    }
    return value;
  } catch {
    return null;
  }
}

/**
 * Writes a value and removes the legacy key if it still exists.
 *
 * @param {keyof STORAGE_KEYS} key
 * @param {string} value
 */
export function writeStorageItem(key, value) {
  const canonical = STORAGE_KEYS[key];
  const legacy    = LEGACY_KEYS[key];
  try {
    localStorage.setItem(canonical, value);
    if (legacy) localStorage.removeItem(legacy);
  } catch {
    /* quota exceeded or private browsing — fail silently */
  }
}

/**
 * Removes a stored value (both canonical and legacy keys).
 *
 * @param {keyof STORAGE_KEYS} key
 */
export function removeStorageItem(key) {
  const canonical = STORAGE_KEYS[key];
  const legacy    = LEGACY_KEYS[key];
  try {
    localStorage.removeItem(canonical);
    if (legacy) localStorage.removeItem(legacy);
  } catch {
    /* ignore */
  }
}

/**
 * Clears all app-owned keys from localStorage (used on logout).
 */
export function clearAllStorage() {
  Object.keys(STORAGE_KEYS).forEach(removeStorageItem);
}

// ─── Typed JSON helpers ───────────────────────────────────────────────────────

/**
 * Reads and JSON-parses a stored value.
 * Returns `null` if the key is missing or the value is not valid JSON.
 *
 * @template T
 * @param {keyof STORAGE_KEYS} key
 * @returns {T | null}
 */
export function readJsonItem(key) {
  const raw = readStorageItem(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * JSON-stringifies a value and writes it to storage.
 *
 * @param {keyof STORAGE_KEYS} key
 * @param {*} value
 */
export function writeJsonItem(key, value) {
  writeStorageItem(key, JSON.stringify(value));
}
