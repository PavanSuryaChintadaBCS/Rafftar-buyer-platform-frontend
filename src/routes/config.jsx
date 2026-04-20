import { lazy } from "react";
import { ROUTES } from "@/utils/constants";

/** Lazy page modules — code-split like production dashboards. */
const pages = {
  Index: lazy(() => import("@/pages/Index.jsx")),
  SearchResults: lazy(() => import("@/pages/SearchResults.jsx")),
  ProductListing: lazy(() => import("@/pages/ProductListing.jsx")),
  ProductDetail: lazy(() => import("@/pages/ProductDetail.jsx")),
  SupplierProfile: lazy(() => import("@/pages/SupplierProfile.jsx")),
  InquiryCart: lazy(() => import("@/pages/InquiryCart.jsx")),
  Cart: lazy(() => import("@/pages/Cart.jsx")),
  Checkout: lazy(() => import("@/pages/Checkout.jsx")),
  Orders: lazy(() => import("@/pages/Orders.jsx")),
  OrderDetail: lazy(() => import("@/pages/OrderDetail.jsx")),
  TicketView: lazy(() => import("@/pages/TicketView.jsx")),
  KYC: lazy(() => import("@/pages/KYC.jsx")),
  Login: lazy(() => import("@/pages/Login.jsx")),
  NotFound: lazy(() => import("@/pages/NotFound.jsx")),
};

/** Routes rendered inside `PublicLayout` (reference: grouped route tables in `routes/config`). */
export const publicLayoutRoutes = [
  { path: ROUTES.HOME, Component: pages.Index },
  { path: ROUTES.SEARCH, Component: pages.SearchResults },
  { path: ROUTES.CATEGORY, Component: pages.ProductListing },
  { path: ROUTES.PRODUCT, Component: pages.ProductDetail },
  { path: ROUTES.SUPPLIER, Component: pages.SupplierProfile },
  { path: ROUTES.INQUIRY, Component: pages.InquiryCart },
  { path: ROUTES.CART, Component: pages.Cart },
  { path: ROUTES.CHECKOUT, Component: pages.Checkout },
  { path: ROUTES.ORDERS, Component: pages.Orders },
  { path: ROUTES.ORDER, Component: pages.OrderDetail },
  { path: ROUTES.TICKET, Component: pages.TicketView },
  { path: ROUTES.KYC, Component: pages.KYC },
];

/** Auth-free routes (no `PublicLayout` chrome). */
export const standaloneRoutes = [{ path: ROUTES.LOGIN, Component: pages.Login }];

export { pages };
