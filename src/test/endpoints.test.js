import { describe, it, expect } from "vitest";
import {
  API_ROOT,
  ENDPOINTS,
} from "@/utils/endpoints";

describe("ENDPOINTS — path correctness against backend REST_URLS", () => {
  // Auth
  it("register maps to /auth/register",  () => expect(ENDPOINTS.register).toBe("/auth/register"));
  it("login maps to /auth/login",        () => expect(ENDPOINTS.login).toBe("/auth/login"));
  it("refresh maps to /auth/refresh",    () => expect(ENDPOINTS.refresh).toBe("/auth/refresh"));
  it("logout maps to /auth/logout",      () => expect(ENDPOINTS.logout).toBe("/auth/logout"));
  it("authMe maps to /auth/me",          () => expect(ENDPOINTS.authMe).toBe("/auth/me"));

  // Buyers
  it("buyersMe maps to /buyers/me",      () => expect(ENDPOINTS.buyersMe).toBe("/buyers/me"));

  // KYC
  it("kycSubmit maps to /kyc/submit",    () => expect(ENDPOINTS.kycSubmit).toBe("/kyc/submit"));
  it("kycStatus maps to /kyc/status",    () => expect(ENDPOINTS.kycStatus).toBe("/kyc/status"));
  it("kycResubmit maps to /kyc/resubmit",() => expect(ENDPOINTS.kycResubmit).toBe("/kyc/resubmit"));

  // Addresses
  it("addresses maps to /addresses",              () => expect(ENDPOINTS.addresses).toBe("/addresses"));
  it("addressById interpolates id correctly",     () => expect(ENDPOINTS.addressById("abc")).toBe("/addresses/abc"));

  // Cart
  it("cart maps to /cart",                           () => expect(ENDPOINTS.cart).toBe("/cart"));
  it("cartItems maps to /cart/items",                () => expect(ENDPOINTS.cartItems).toBe("/cart/items"));
  it("cartItemByProduct interpolates productId",     () => expect(ENDPOINTS.cartItemByProduct("p1")).toBe("/cart/items/p1"));

  // Orders
  it("orders maps to /orders",                          () => expect(ENDPOINTS.orders).toBe("/orders"));
  it("ordersCheckout maps to /orders/checkout",         () => expect(ENDPOINTS.ordersCheckout).toBe("/orders/checkout"));
  it("orderById interpolates id correctly",             () => expect(ENDPOINTS.orderById("o1")).toBe("/orders/o1"));
  it("orderCancel uses /orders/:id/cancel path",        () => expect(ENDPOINTS.orderCancel("o1")).toBe("/orders/o1/cancel"));

  // Categories
  it("categories maps to /categories",              () => expect(ENDPOINTS.categories).toBe("/categories"));

  // Products
  it("products maps to /products",                          () => expect(ENDPOINTS.products).toBe("/products"));
  it("productsSearch maps to /products/search",             () => expect(ENDPOINTS.productsSearch).toBe("/products/search"));
  it("productById interpolates productId correctly",         () => expect(ENDPOINTS.productById("prod-123")).toBe("/products/prod-123"));

  // Suppliers
  it("suppliers maps to /suppliers",                          () => expect(ENDPOINTS.suppliers).toBe("/suppliers"));
  it("supplierById interpolates supplierPgId correctly",      () => expect(ENDPOINTS.supplierById("sup-1")).toBe("/suppliers/sup-1"));
  it("supplierProducts uses /suppliers/:id/products path",    () => expect(ENDPOINTS.supplierProducts("sup-1")).toBe("/suppliers/sup-1/products"));

  // Tickets
  it("tickets maps to /tickets",                                   () => expect(ENDPOINTS.tickets).toBe("/tickets"));
  it("ticketsByUser interpolates userId correctly",                 () => expect(ENDPOINTS.ticketsByUser("u1")).toBe("/tickets/user/u1"));
  it("ticketById interpolates id correctly",                        () => expect(ENDPOINTS.ticketById("t1")).toBe("/tickets/t1"));
  it("ticketStatus uses /tickets/:id/status path",                  () => expect(ENDPOINTS.ticketStatus("t1")).toBe("/tickets/t1/status"));
  it("ticketAssign uses /tickets/:id/assign path",                  () => expect(ENDPOINTS.ticketAssign("t1")).toBe("/tickets/t1/assign"));
  it("ticketResolve uses /tickets/:id/resolve path",                () => expect(ENDPOINTS.ticketResolve("t1")).toBe("/tickets/t1/resolve"));
  it("ticketMessages uses /tickets/:id/messages path",              () => expect(ENDPOINTS.ticketMessages("t1")).toBe("/tickets/t1/messages"));

  // Inquiries
  it("inquiries maps to /inquiries",         () => expect(ENDPOINTS.inquiries).toBe("/inquiries"));

  // Search
  it("search maps to /search",               () => expect(ENDPOINTS.search).toBe("/search"));

  // API root includes /api/v1
  it("API_ROOT contains /api/v1",            () => expect(API_ROOT).toContain("/api/v1"));
});
