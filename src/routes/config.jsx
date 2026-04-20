// src/routes/config.jsx
import { lazy } from "react";
import { ROUTES } from "@/utils/constants";

const pages = {
  Index:           lazy(() => import("@/pages/home/Index.jsx")),
  SearchResults:   lazy(() => import("@/pages/catalog/SearchResults.jsx")),
  ProductListing:  lazy(() => import("@/pages/catalog/ProductListing.jsx")),
  ProductDetail:   lazy(() => import("@/pages/catalog/ProductDetail.jsx")),
  SupplierProfile: lazy(() => import("@/pages/supplier/SupplierProfile.jsx")),
  InquiryCart:     lazy(() => import("@/pages/cart/InquiryCart.jsx")),
  Cart:            lazy(() => import("@/pages/cart/Cart.jsx")),
  Checkout:        lazy(() => import("@/pages/cart/Checkout.jsx")),
  Orders:          lazy(() => import("@/pages/orders/Orders.jsx")),
  OrderDetail:     lazy(() => import("@/pages/orders/OrderDetail.jsx")),
  TicketView:      lazy(() => import("@/pages/orders/TicketView.jsx")),
  KYC:             lazy(() => import("@/pages/auth/KYC.jsx")),
  Login:           lazy(() => import("@/pages/auth/Login.jsx")),
  NotFound:        lazy(() => import("@/pages/NotFound.jsx")),
};

export const publicLayoutRoutes = [
  { path: ROUTES.HOME,     Component: pages.Index },
  { path: ROUTES.SEARCH,   Component: pages.SearchResults },
  { path: ROUTES.CATEGORY, Component: pages.ProductListing },
  { path: ROUTES.PRODUCT,  Component: pages.ProductDetail },
  { path: ROUTES.SUPPLIER, Component: pages.SupplierProfile },
  { path: ROUTES.INQUIRY,  Component: pages.InquiryCart },
  { path: ROUTES.CART,     Component: pages.Cart },
  { path: ROUTES.CHECKOUT, Component: pages.Checkout },
  { path: ROUTES.ORDERS,   Component: pages.Orders },
  { path: ROUTES.ORDER,    Component: pages.OrderDetail },
  { path: ROUTES.TICKET,   Component: pages.TicketView },
  { path: ROUTES.KYC,      Component: pages.KYC },
];

export const standaloneRoutes = [{ path: ROUTES.LOGIN, Component: pages.Login }];

export { pages };
