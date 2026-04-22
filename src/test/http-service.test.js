/**
 * http-service integration contract tests.
 *
 * Mock mode: verifies that each service method resolves without error and returns
 * the expected shape.
 *
 * Real mode: verifies that the correct URL and HTTP method are used by spying on
 * the global fetch.  These run with IS_MOCK patched to false via vi.mock.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock mode tests ────────────────────────────────────────────────────────────

describe("httpService — mock mode", () => {
  let httpService;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock("@/utils/endpoints", () => ({
      IS_MOCK:    true,
      BASE_URL:   "",
      API_VERSION:"/api/v1",
      API_ROOT:   "/api/v1",
      ENDPOINTS:  {
        register:          "/auth/register",
        login:             "/auth/login",
        refresh:           "/auth/refresh",
        logout:            "/auth/logout",
        authMe:            "/auth/me",
        buyersMe:          "/buyers/me",
        kycSubmit:         "/kyc/submit",
        kycStatus:         "/kyc/status",
        kycResubmit:       "/kyc/resubmit",
        addresses:         "/addresses",
        addressById:       (id) => `/addresses/${id}`,
        cart:              "/cart",
        cartItems:         "/cart/items",
        cartItemByProduct: (id) => `/cart/items/${id}`,
        orders:            "/orders",
        ordersCheckout:    "/orders/checkout",
        orderById:         (id) => `/orders/${id}`,
        orderCancel:       (id) => `/orders/${id}/cancel`,
        categories:        "/categories",
        products:          "/products",
        productsSearch:    "/products/search",
        productById:       (id) => `/products/${id}`,
        suppliers:         "/suppliers",
        supplierById:      (id) => `/suppliers/${id}`,
        supplierProducts:  (id) => `/suppliers/${id}/products`,
        tickets:           "/tickets",
        ticketsByUser:     (uid) => `/tickets/user/${uid}`,
        ticketById:        (id) => `/tickets/${id}`,
        ticketStatus:      (id) => `/tickets/${id}/status`,
        ticketAssign:      (id) => `/tickets/${id}/assign`,
        ticketResolve:     (id) => `/tickets/${id}/resolve`,
        ticketMessages:    (id) => `/tickets/${id}/messages`,
        inquiries:         "/inquiries",
        search:            "/search",
      },
    }));
    const mod = await import("@/utils/http-service");
    httpService = mod.httpService;
  });

  afterEach(() => {
    vi.doUnmock("@/utils/endpoints");
    vi.resetModules();
  });

  // Auth
  it("login resolves in mock mode", async () => {
    const res = await httpService.login({ email: "a@b.com", password: "pass1234" });
    expect(res).toBeDefined();
  });

  it("register resolves in mock mode", async () => {
    const res = await httpService.register({ email: "a@b.com", password: "pass1234" });
    expect(res).toBeDefined();
  });

  it("logout resolves in mock mode", async () => {
    const res = await httpService.logout();
    expect(res).toBeDefined();
  });

  it("getAuthMe resolves to null in mock mode", async () => {
    const res = await httpService.getAuthMe();
    expect(res).toBeNull();
  });

  it("getBuyerProfile resolves to null in mock mode", async () => {
    const res = await httpService.getBuyerProfile();
    expect(res).toBeNull();
  });

  // KYC
  it("submitKyc resolves in mock mode", async () => {
    const res = await httpService.submitKyc({ companyName: "Acme", gstin: "29ABCDE1234F1Z5", businessType: "manufacturer" });
    expect(res).toBeDefined();
  });

  it("getKycStatus resolves to null in mock mode", async () => {
    const res = await httpService.getKycStatus();
    expect(res).toBeNull();
  });

  it("resubmitKyc resolves in mock mode", async () => {
    const res = await httpService.resubmitKyc({ companyName: "Acme", gstin: "29ABCDE1234F1Z5", businessType: "manufacturer" });
    expect(res).toBeDefined();
  });

  // Addresses
  it("listAddresses returns an array in mock mode", async () => {
    const res = await httpService.listAddresses();
    expect(Array.isArray(res)).toBe(true);
  });

  it("createAddress resolves with an id in mock mode", async () => {
    const res = await httpService.createAddress({ line1: "12 Main St", city: "Mumbai", state: "Maharashtra", pincode: "400001" });
    expect(res.id).toBeDefined();
  });

  it("updateAddress resolves in mock mode", async () => {
    const res = await httpService.updateAddress("addr1", { city: "Pune" });
    expect(res).toBeDefined();
  });

  it("deleteAddress resolves in mock mode", async () => {
    const res = await httpService.deleteAddress("addr1");
    expect(res).toBeDefined();
  });

  // Cart
  it("getCart returns items array in mock mode", async () => {
    const res = await httpService.getCart();
    expect(res.items).toBeDefined();
  });

  it("addCartItem resolves in mock mode", async () => {
    const res = await httpService.addCartItem({ productId: "p1", quantity: 2 });
    expect(res).toBeDefined();
  });

  it("removeCartItem resolves in mock mode", async () => {
    const res = await httpService.removeCartItem("p1");
    expect(res).toBeDefined();
  });

  // Orders
  it("checkout resolves with order in mock mode", async () => {
    const res = await httpService.checkout("addr-1");
    expect(res.order).toBeDefined();
    expect(res.order.status).toBe("placed");
  });

  it("getOrders returns orders array in mock mode", async () => {
    const res = await httpService.getOrders();
    expect(res.orders).toBeDefined();
    expect(Array.isArray(res.orders)).toBe(true);
  });

  it("cancelOrder resolves with cancelled status in mock mode", async () => {
    const res = await httpService.cancelOrder("o1");
    expect(res.order.status).toBe("cancelled");
  });

  // Tickets
  it("getTickets returns data array in mock mode", async () => {
    const res = await httpService.getTickets();
    expect(res.data).toBeDefined();
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("createTicket resolves with open status in mock mode", async () => {
    const res = await httpService.createTicket({ orderId: "o1", type: "delay", message: "Help" });
    expect(res.status).toBe("open");
    expect(Array.isArray(res.messages)).toBe(true);
  });

  it("resolveTicket returns resolved status in mock mode", async () => {
    const res = await httpService.resolveTicket("t1");
    expect(res.status).toBe("resolved");
  });

  it("addTicketMessage returns message in mock mode", async () => {
    const res = await httpService.addTicketMessage("t1", "Hello");
    expect(res.text).toBe("Hello");
  });

  it("getTicketMessages returns array in mock mode", async () => {
    const res = await httpService.getTicketMessages("t1");
    expect(Array.isArray(res)).toBe(true);
  });

  // Inquiries
  it("createInquiry resolves with id in mock mode", async () => {
    const res = await httpService.createInquiry({
      contact: { name: "Test", email: "t@t.com", phone: "+919876543210" },
      items: [{ productName: "Cement", quantity: 10 }],
    });
    expect(res.id).toBeDefined();
  });

  it("getInquiries returns array in mock mode", async () => {
    const res = await httpService.getInquiries();
    expect(Array.isArray(res)).toBe(true);
  });

  // Catalog / Search
  it("getCatalog returns categories, suppliers, products in mock mode", async () => {
    const res = await httpService.getCatalog();
    expect(Array.isArray(res.categories)).toBe(true);
    expect(Array.isArray(res.suppliers)).toBe(true);
    expect(Array.isArray(res.products)).toBe(true);
  });

  it("searchCatalog returns products and suppliers in mock mode", async () => {
    const res = await httpService.searchCatalog("cement");
    expect(res.products).toBeDefined();
    expect(res.suppliers).toBeDefined();
  });

  // Supplier products
  it("getSupplierProducts resolves in mock mode", async () => {
    const res = await httpService.getSupplierProducts("sup-1");
    expect(Array.isArray(res)).toBe(true);
  });
});

// ── Real mode — fetch URL / method verification ────────────────────────────────

describe("httpService — real mode fetch targets", () => {
  let httpService;
  let fetchSpy;

  const makeOkResponse = (data) =>
    Promise.resolve(
      new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock("@/utils/endpoints", () => ({
      IS_MOCK:    false,
      BASE_URL:   "",
      API_VERSION:"/api/v1",
      API_ROOT:   "/api/v1",
      ENDPOINTS:  {
        register:          "/auth/register",
        login:             "/auth/login",
        refresh:           "/auth/refresh",
        logout:            "/auth/logout",
        authMe:            "/auth/me",
        buyersMe:          "/buyers/me",
        kycSubmit:         "/kyc/submit",
        kycStatus:         "/kyc/status",
        kycResubmit:       "/kyc/resubmit",
        addresses:         "/addresses",
        addressById:       (id) => `/addresses/${id}`,
        cart:              "/cart",
        cartItems:         "/cart/items",
        cartItemByProduct: (id) => `/cart/items/${id}`,
        orders:            "/orders",
        ordersCheckout:    "/orders/checkout",
        orderById:         (id) => `/orders/${id}`,
        orderCancel:       (id) => `/orders/${id}/cancel`,
        categories:        "/categories",
        products:          "/products",
        productsSearch:    "/products/search",
        productById:       (id) => `/products/${id}`,
        suppliers:         "/suppliers",
        supplierById:      (id) => `/suppliers/${id}`,
        supplierProducts:  (id) => `/suppliers/${id}/products`,
        tickets:           "/tickets",
        ticketsByUser:     (uid) => `/tickets/user/${uid}`,
        ticketById:        (id) => `/tickets/${id}`,
        ticketStatus:      (id) => `/tickets/${id}/status`,
        ticketAssign:      (id) => `/tickets/${id}/assign`,
        ticketResolve:     (id) => `/tickets/${id}/resolve`,
        ticketMessages:    (id) => `/tickets/${id}/messages`,
        inquiries:         "/inquiries",
        search:            "/search",
      },
    }));

    fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
      const str = url.toString();
      if (str.includes("/auth/refresh")) {
        return makeOkResponse({ token: "new-token" });
      }
      return makeOkResponse({});
    });

    const mod = await import("@/utils/http-service");
    httpService = mod.httpService;
  });

  afterEach(() => {
    vi.doUnmock("@/utils/endpoints");
    vi.resetModules();
    fetchSpy.mockRestore();
  });

  it("login POSTs to /api/v1/auth/login", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ token: "t", buyer: { email: "a@b.com" } }));
    await httpService.login({ email: "a@b.com", password: "pass1234" });
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/auth/login");
    expect(opts.method).toBe("POST");
  });

  it("register POSTs to /api/v1/auth/register", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ buyer: { email: "a@b.com" } }));
    await httpService.register({ email: "a@b.com", password: "pass1234" });
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/auth/register");
    expect(opts.method).toBe("POST");
  });

  it("logout POSTs to /api/v1/auth/logout", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({}));
    await httpService.logout();
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/auth/logout");
    expect(opts.method).toBe("POST");
  });

  it("getAuthMe GETs /api/v1/auth/me", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ buyer: {} }));
    await httpService.getAuthMe();
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/auth/me");
  });

  it("getKycStatus GETs /api/v1/kyc/status", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ kyc: {} }));
    await httpService.getKycStatus();
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/kyc/status");
  });

  it("submitKyc POSTs to /api/v1/kyc/submit", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ kyc: {} }));
    await httpService.submitKyc({ companyName: "Acme" });
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/kyc/submit");
    expect(opts.method).toBe("POST");
  });

  it("resubmitKyc POSTs to /api/v1/kyc/resubmit", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ kyc: {} }));
    await httpService.resubmitKyc({ companyName: "Acme" });
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/kyc/resubmit");
    expect(opts.method).toBe("POST");
  });

  it("listAddresses GETs /api/v1/addresses", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ addresses: [] }));
    await httpService.listAddresses();
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/addresses");
  });

  it("createAddress POSTs to /api/v1/addresses", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ address: {} }));
    await httpService.createAddress({ line1: "1 Main St", city: "Mumbai", state: "MH", pincode: "400001" });
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/addresses");
    expect(opts.method).toBe("POST");
  });

  it("updateAddress PATCHes /api/v1/addresses/:id", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ address: {} }));
    await httpService.updateAddress("addr1", { city: "Pune" });
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/addresses/addr1");
    expect(opts.method).toBe("PATCH");
  });

  it("deleteAddress DELETEs /api/v1/addresses/:id", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({}));
    await httpService.deleteAddress("addr1");
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/addresses/addr1");
    expect(opts.method).toBe("DELETE");
  });

  it("checkout POSTs to /api/v1/orders/checkout with deliveryAddressId", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ order: {} }));
    await httpService.checkout("addr-abc");
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/orders/checkout");
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toMatchObject({ deliveryAddressId: "addr-abc" });
  });

  it("cancelOrder PATCHes /api/v1/orders/:id/cancel", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ order: {} }));
    await httpService.cancelOrder("o1");
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/orders/o1/cancel");
    expect(opts.method).toBe("PATCH");
  });

  it("getOrders GETs /api/v1/orders", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ orders: [] }));
    await httpService.getOrders();
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/orders");
  });

  it("getOrderById GETs /api/v1/orders/:id", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ order: {} }));
    await httpService.getOrderById("o1");
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/orders/o1");
  });

  it("createTicket POSTs to /api/v1/tickets with orderId, type, message", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ ticket_number: "BB-TKT-1", status: "open", messages: [] }));
    await httpService.createTicket({ orderId: "o1", type: "delay", message: "late" });
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/tickets");
    expect(opts.method).toBe("POST");
    const body = JSON.parse(opts.body);
    expect(body.orderId).toBe("o1");
    expect(body.type).toBe("delay");
    expect(body.message).toBe("late");
  });

  it("resolveTicket PATCHes /api/v1/tickets/:id/resolve", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ status: "resolved" }));
    await httpService.resolveTicket("t1");
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/tickets/t1/resolve");
    expect(opts.method).toBe("PATCH");
  });

  it("updateTicketStatus PATCHes /api/v1/tickets/:id/status", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ status: "in_progress" }));
    await httpService.updateTicketStatus("t1", "in_progress", "agent-uuid");
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/tickets/t1/status");
    expect(opts.method).toBe("PATCH");
    const body = JSON.parse(opts.body);
    expect(body.status).toBe("in_progress");
    expect(body.agentId).toBe("agent-uuid");
  });

  it("assignTicket PATCHes /api/v1/tickets/:id/assign", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ status: "in_progress" }));
    await httpService.assignTicket("t1", "agent-uuid");
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/tickets/t1/assign");
    expect(opts.method).toBe("PATCH");
    expect(JSON.parse(opts.body)).toMatchObject({ agentId: "agent-uuid" });
  });

  it("addTicketMessage POSTs to /api/v1/tickets/:id/messages", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ text: "hello", sender_type: "buyer" }));
    await httpService.addTicketMessage("t1", "hello");
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/tickets/t1/messages");
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toMatchObject({ text: "hello" });
  });

  it("getTicketMessages GETs /api/v1/tickets/:id/messages", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse([]));
    await httpService.getTicketMessages("t1");
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/tickets/t1/messages");
  });

  it("createInquiry POSTs to /api/v1/inquiries", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ id: "inq-1", items: [] }));
    await httpService.createInquiry({
      contact: { name: "Test", email: "t@t.com", phone: "+919876543210" },
      items: [{ productName: "Cement", quantity: 10 }],
    });
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/inquiries");
    expect(opts.method).toBe("POST");
  });

  it("getInquiries GETs /api/v1/inquiries", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse([]));
    await httpService.getInquiries();
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/inquiries");
  });

  it("searchCatalog uses /api/v1/search with ?q= param", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse([]));
    await httpService.searchCatalog("cement");
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toContain("/api/v1/search");
    expect(url).toContain("q=cement");
  });

  it("getProductsBySupplier uses supplierId query param (not supplier)", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse([]));
    await httpService.getProductsBySupplier("sup-1");
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toContain("supplierId=sup-1");
    expect(url).not.toContain("supplier=sup-1");
  });

  it("getSupplierProducts GETs /api/v1/suppliers/:id/products", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse([]));
    await httpService.getSupplierProducts("sup-1");
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/suppliers/sup-1/products");
  });

  it("getTicketsByUser GETs /api/v1/tickets/user/:userId", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse({ data: [], meta: { total: 0 } }));
    await httpService.getTicketsByUser("user-123");
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/tickets/user/user-123");
  });
});
