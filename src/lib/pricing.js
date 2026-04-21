// src/lib/pricing.js
export const LOGISTICS_RATE = 0.03;
export const GST_RATE = 0.18;

export function effectiveUnitPrice(item, product, buyerType) {
  if (buyerType === "rafftar" && product?.rafftarDiscount > 0) {
    return Math.round(item.unitPrice * (1 - product.rafftarDiscount / 100));
  }
  return item.unitPrice;
}

export function calcOrderTotals(items, getProductById, buyerType) {
  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + effectiveUnitPrice(item, product, buyerType) * item.quantity;
  }, 0);
  const logistics = Math.round(subtotal * LOGISTICS_RATE);
  const tax = Math.round(subtotal * GST_RATE);
  return { subtotal, logistics, tax, total: subtotal + logistics + tax };
}
