# Rafftar Frontend Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganise the `src/` folder structure, deduplicate repeated UI patterns, and extract reusable components — zero functional or visual regressions.

**Architecture:** Files move from flat `src/pages/` and `src/container/` into domain-grouped sub-folders (`pages/home/`, `pages/catalog/`, `pages/cart/`, etc.) while shared business logic moves into `src/lib/pricing.js` and `src/hooks/useAuthGuard.js`. New `src/components/common/` components (EmptyState, SectionHeader, PriceLockGate, ProductGrid, SupplierGrid) absorb repeated patterns from pages. The `@/` alias (→ `src/`) is untouched.

**Tech Stack:** React 18, Vite, React Router v6, TanStack Query v5, shadcn/ui, Tailwind CSS, Bun

---

## File Map (created / modified)

| File | Action |
|---|---|
| `src/lib/pricing.js` | CREATE — shared order-total utilities |
| `src/hooks/useAuthGuard.js` | CREATE — auth-redirect hook |
| `src/components/common/EmptyState.jsx` | CREATE |
| `src/components/common/SectionHeader.jsx` | CREATE |
| `src/components/common/PriceLockGate.jsx` | CREATE |
| `src/components/common/ProductGrid.jsx` | CREATE |
| `src/components/common/SupplierGrid.jsx` | CREATE |
| `src/app/AppProviders.jsx` | MOVE (was `src/container/providers.jsx`) |
| `src/app/App.jsx` | MOVE (was `src/container/index.jsx`) |
| `src/components/layout/PublicLayout.jsx` | MOVE (was `src/container/PublicLayout.jsx`) |
| `src/components/product/ProductCard.jsx` | MOVE + refactor (PriceLockGate) |
| `src/components/product/FilterSidebar.jsx` | MOVE (unchanged) |
| `src/components/supplier/SupplierCard.jsx` | MOVE (unchanged) |
| `src/contexts/CartContext.jsx` | MODIFY — fix typo `getGroupedBySuppier` → `getGroupedBySupplier` |
| `src/pages/catalog/ProductDetail.jsx` | MOVE (unchanged) |
| `src/pages/catalog/ProductListing.jsx` | MOVE + import path update |
| `src/pages/catalog/SearchResults.jsx` | MOVE + import path update |
| `src/pages/supplier/SupplierProfile.jsx` | MOVE + import path update |
| `src/pages/home/Index.jsx` | MOVE + SectionHeader/ProductGrid/SupplierGrid refactor |
| `src/pages/cart/Cart.jsx` | MOVE + useAuthGuard + calcOrderTotals + EmptyState |
| `src/pages/cart/Checkout.jsx` | MOVE + useAuthGuard + calcOrderTotals |
| `src/pages/cart/InquiryCart.jsx` | MOVE + EmptyState |
| `src/pages/orders/Orders.jsx` | MOVE + EmptyState |
| `src/pages/orders/OrderDetail.jsx` | MOVE (unchanged) |
| `src/pages/orders/TicketView.jsx` | MOVE (unchanged) |
| `src/pages/auth/Login.jsx` | MOVE (unchanged) |
| `src/pages/auth/KYC.jsx` | MOVE (unchanged) |
| `src/pages/NotFound.jsx` | MOVE (unchanged) |
| `src/routes/config.jsx` | MODIFY — update lazy import paths |
| `src/routes/index.jsx` | MODIFY — update PublicLayout import |
| `src/main.jsx` | MODIFY — update App import |
| `src/container/` | DELETE (after all moves confirmed) |
| `src/resources/` | DELETE |
| `src/components/ProductCard.jsx` | DELETE |
| `src/components/FilterSidebar.jsx` | DELETE |
| `src/components/SupplierCard.jsx` | DELETE |

---

## Task 1: Create shared utility `src/lib/pricing.js`

**Files:**
- Create: `src/lib/pricing.js`

- [ ] **Step 1: Write the file**

```js
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
```

- [ ] **Step 2: Verify file exists**

```bash
ls src/lib/pricing.js
```

Expected: file path printed with no error.

- [ ] **Step 3: Commit**

```bash
git add src/lib/pricing.js
git commit -m "feat: add shared pricing utility (calcOrderTotals, effectiveUnitPrice)"
```

---

## Task 2: Create `src/hooks/useAuthGuard.js`

**Files:**
- Create: `src/hooks/useAuthGuard.js`

- [ ] **Step 1: Write the file**

```js
// src/hooks/useAuthGuard.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBuyer } from "@/contexts/BuyerContext";

export function useAuthGuard({ from = "/cart" } = {}) {
  const { buyer } = useBuyer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!buyer.isLoggedIn) {
      navigate("/login", { state: { from } });
    } else if (!buyer.isKYCVerified) {
      navigate("/kyc");
    }
  }, [buyer.isLoggedIn, buyer.isKYCVerified, navigate, from]);

  return {
    buyer,
    ready: buyer.isLoggedIn && buyer.isKYCVerified,
  };
}
```

- [ ] **Step 2: Verify file exists**

```bash
ls src/hooks/useAuthGuard.js
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAuthGuard.js
git commit -m "feat: add useAuthGuard hook to centralise auth-redirect logic"
```

---

## Task 3: Create common components (EmptyState, SectionHeader, PriceLockGate)

> These three are independent. Create all three then commit once.

**Files:**
- Create: `src/components/common/EmptyState.jsx`
- Create: `src/components/common/SectionHeader.jsx`
- Create: `src/components/common/PriceLockGate.jsx`

- [ ] **Step 1: Write `src/components/common/EmptyState.jsx`**

```jsx
// src/components/common/EmptyState.jsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function EmptyState({ icon, title, subtitle, actionLabel, actionTo }) {
  return (
    <div className="text-center py-20 animate-fade-in">
      {icon && (
        <div className="mx-auto mb-4 text-muted-foreground/30">{icon}</div>
      )}
      <p className="text-lg font-medium text-muted-foreground">{title}</p>
      {subtitle && (
        <p className="text-sm text-muted-foreground/70 mt-1">{subtitle}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button className="mt-6">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/common/SectionHeader.jsx`**

```jsx
// src/components/common/SectionHeader.jsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SectionHeader({ icon, title, viewAllTo }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {viewAllTo && (
        <Link to={viewAllTo}>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-1 hover:scale-105 transition-transform"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/common/PriceLockGate.jsx`**

```jsx
// src/components/common/PriceLockGate.jsx
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuyer } from "@/contexts/BuyerContext";

export function PriceLockGate({ children, productId, className = "" }) {
  const { buyer } = useBuyer();
  const navigate = useNavigate();

  const isUnlocked = buyer.isLoggedIn && buyer.isKYCVerified;

  if (isUnlocked) return children;

  const handleClick = (e) => {
    e.preventDefault();
    if (!buyer.isLoggedIn) {
      navigate("/login", { state: { from: productId ? `/product/${productId}` : "/" } });
    } else {
      navigate("/kyc");
    }
  };

  const label = !buyer.isLoggedIn
    ? "Login to see price"
    : "Complete KYC for price";

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors ${className}`}
    >
      <Lock className="h-3 w-3" />
      {label}
    </button>
  );
}
```

- [ ] **Step 4: Verify all three files exist**

```bash
ls src/components/common/
```

Expected output includes: `EmptyState.jsx  PriceLockGate.jsx  SectionHeader.jsx`

- [ ] **Step 5: Commit**

```bash
git add src/components/common/
git commit -m "feat: add EmptyState, SectionHeader, PriceLockGate common components"
```

---

## Task 4: Move and refactor `ProductCard`, `FilterSidebar`, `SupplierCard`

**Files:**
- Create: `src/components/product/ProductCard.jsx` (moved + PriceLockGate refactor)
- Create: `src/components/product/FilterSidebar.jsx` (moved, unchanged)
- Create: `src/components/supplier/SupplierCard.jsx` (moved, unchanged)

- [ ] **Step 1: Write `src/components/product/ProductCard.jsx`**

```jsx
// src/components/product/ProductCard.jsx
import { memo } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getProductImage } from "@/data/images";
import { useBuyer } from "@/contexts/BuyerContext";
import { PriceLockGate } from "@/components/common/PriceLockGate";

const ProductCard = memo(function ProductCard({ product }) {
  const { buyer } = useBuyer();

  const discountedPrice =
    buyer.type === "rafftar" && product.rafftarDiscount > 0
      ? Math.round(product.price * (1 - product.rafftarDiscount / 100))
      : null;

  return (
    <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60">
      <div className="aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
        <img
          src={getProductImage(product.category)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </p>

        <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <PriceLockGate productId={product.id}>
          <div className="flex items-baseline gap-1">
            {discountedPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ₹{discountedPrice}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.price}
                </span>
                <span className="text-xs text-primary font-medium">
                  -{product.rafftarDiscount}%
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                ₹{product.price}
              </span>
            )}
            <span className="text-xs text-muted-foreground">/{product.unit}</span>
          </div>
        </PriceLockGate>

        <p className="text-xs text-muted-foreground truncate">{product.supplierName}</p>

        <Link to={`/product/${product.id}`}>
          <Button
            size="sm"
            className="w-full mt-1 hover:scale-[1.02] transition-transform"
            variant="outline"
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
```

- [ ] **Step 2: Write `src/components/product/FilterSidebar.jsx`** (copy unchanged from `src/components/FilterSidebar.jsx`)

```jsx
// src/components/product/FilterSidebar.jsx
import { categories } from "@/data/mock";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const FilterSidebar = ({
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
}) => {
  const toggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== catId));
    } else {
      onCategoriesChange([...selectedCategories, catId]);
    }
  };

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <Slider
          min={0}
          max={5000}
          step={50}
          value={[priceRange[1]]}
          onValueChange={([v]) => onPriceRangeChange([0, v])}
          className="mb-2"
        />
        <p className="text-xs text-muted-foreground">Up to ₹{priceRange[1]}</p>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Min Rating</h3>
        <div className="flex gap-2">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onMinRatingChange(r)}
              className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                minRating === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {r === 0 ? "All" : `${r}+`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
```

- [ ] **Step 3: Write `src/components/supplier/SupplierCard.jsx`** (copy unchanged from `src/components/SupplierCard.jsx`)

```jsx
// src/components/supplier/SupplierCard.jsx
import { memo } from "react";
import { Star, MapPin, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SupplierCard = memo(function SupplierCard({ supplier }) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/60">
      <CardContent className="p-5 flex gap-4">
        <div className="h-16 w-16 rounded-lg bg-secondary/40 flex items-center justify-center flex-shrink-0">
          <img src={supplier.logo} alt={supplier.name} className="h-8 w-8 opacity-40" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="font-semibold text-base leading-tight">{supplier.name}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {supplier.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" /> {supplier.rating} ({supplier.reviewCount})
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" /> {supplier.productCount} products
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{supplier.description}</p>
          <Link to={`/supplier/${supplier.id}`}>
            <Button size="sm" variant="outline" className="mt-1">
              View Supplier
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

export default SupplierCard;
```

- [ ] **Step 4: Verify all three new component files exist**

```bash
ls src/components/product/ && ls src/components/supplier/
```

Expected: `FilterSidebar.jsx  ProductCard.jsx` and `SupplierCard.jsx`

- [ ] **Step 5: Commit**

```bash
git add src/components/product/ src/components/supplier/
git commit -m "refactor: move ProductCard, FilterSidebar, SupplierCard to domain subdirectories"
```

---

## Task 5: Create `ProductGrid` and `SupplierGrid`

**Files:**
- Create: `src/components/common/ProductGrid.jsx`
- Create: `src/components/common/SupplierGrid.jsx`

- [ ] **Step 1: Write `src/components/common/ProductGrid.jsx`**

```jsx
// src/components/common/ProductGrid.jsx
import ProductCard from "@/components/product/ProductCard";

export function ProductGrid({
  products,
  columns = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  animationBase = 100,
}) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{ animationDelay: `${i * animationBase}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/common/SupplierGrid.jsx`**

```jsx
// src/components/common/SupplierGrid.jsx
import SupplierCard from "@/components/supplier/SupplierCard";

export function SupplierGrid({
  suppliers,
  columns = "grid-cols-1 md:grid-cols-2",
  animationBase = 100,
}) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {suppliers.map((supplier, i) => (
        <div
          key={supplier.id}
          className="animate-fade-in"
          style={{ animationDelay: `${i * animationBase}ms` }}
        >
          <SupplierCard supplier={supplier} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
ls src/components/common/
```

Expected: `EmptyState.jsx  PriceLockGate.jsx  ProductGrid.jsx  SectionHeader.jsx  SupplierGrid.jsx`

- [ ] **Step 4: Commit**

```bash
git add src/components/common/ProductGrid.jsx src/components/common/SupplierGrid.jsx
git commit -m "feat: add ProductGrid and SupplierGrid common components"
```

---

## Task 6: Create `src/app/` structure and `src/components/layout/PublicLayout.jsx`

**Files:**
- Create: `src/app/AppProviders.jsx`
- Create: `src/app/App.jsx`
- Create: `src/components/layout/PublicLayout.jsx`

- [ ] **Step 1: Write `src/app/AppProviders.jsx`** (content identical to `src/container/providers.jsx`)

```jsx
// src/app/AppProviders.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InquiryProvider } from "@/contexts/InquiryContext";
import { BuyerProvider } from "@/contexts/BuyerContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BuyerProvider>
          <CartProvider>
            <OrderProvider>
              <InquiryProvider>
                <Toaster />
                <Sonner />
                {children}
              </InquiryProvider>
            </OrderProvider>
          </CartProvider>
        </BuyerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Write `src/app/App.jsx`** (content mirrors `src/container/index.jsx`)

```jsx
// src/app/App.jsx
import AppProviders from "./AppProviders";
import AppRoutes from "@/routes";

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
```

- [ ] **Step 3: Write `src/components/layout/PublicLayout.jsx`** (content identical to `src/container/PublicLayout.jsx`)

```jsx
// src/components/layout/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

export function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
```

- [ ] **Step 4: Verify directories and files**

```bash
ls src/app/ && ls src/components/layout/
```

Expected: `App.jsx  AppProviders.jsx` and `PublicLayout.jsx`

- [ ] **Step 5: Commit**

```bash
git add src/app/ src/components/layout/
git commit -m "refactor: move app shell and layout from src/container to src/app and src/components/layout"
```

---

## Task 7: Fix typo in `src/contexts/CartContext.jsx`

**Files:**
- Modify: `src/contexts/CartContext.jsx` — rename `getGroupedBySuppier` → `getGroupedBySupplier` (2 occurrences: function definition on line 45 and context value object on line 51)

- [ ] **Step 1: Apply the fix** — in `src/contexts/CartContext.jsx` make two replacements:

Replace (line 45):
```js
const getGroupedBySuppier = useCallback(() => {
```
With:
```js
const getGroupedBySupplier = useCallback(() => {
```

Replace (line 51, inside the JSX context value):
```js
getGroupedBySuppier }}>{children}</CartContext.Provider>;
```
With:
```js
getGroupedBySupplier }}>{children}</CartContext.Provider>;
```

The full file after edit:
```jsx
// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getProductById, getPriceForQuantity } from "@/data/mock";
import { readStorageItem, writeStorageItem } from "@/utils/storage-keys";

const CartContext = createContext(void 0);

const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = readStorageItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    writeStorageItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((productId, supplierId, quantity) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      const product = getProductById(productId);
      if (!product) return prev;
      const newQty = existing ? existing.quantity + quantity : quantity;
      const unitPrice = getPriceForQuantity(product, newQty);
      const item = { productId, supplierId, quantity: newQty, unitPrice, totalPrice: unitPrice * newQty };
      if (existing) {
        return prev.map((i) => i.productId === productId ? item : i);
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems(
      (prev) => prev.map((i) => {
        if (i.productId !== productId) return i;
        const product = getProductById(productId);
        const unitPrice = product ? getPriceForQuantity(product, quantity) : i.unitPrice;
        return { ...i, quantity, unitPrice, totalPrice: unitPrice * quantity };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getGroupedBySupplier = useCallback(() => {
    return items.reduce((acc, item) => {
      (acc[item.supplierId] ||= []).push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount: items.length, getGroupedBySupplier }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export { CartProvider, useCart };
```

- [ ] **Step 2: Verify typo is fixed**

```bash
grep -n "getGroupedBySupplier\|getGroupedBySuppier" src/contexts/CartContext.jsx
```

Expected: two lines with `getGroupedBySupplier`, zero with `getGroupedBySuppier`.

- [ ] **Step 3: Commit**

```bash
git add src/contexts/CartContext.jsx
git commit -m "fix: correct CartContext typo getGroupedBySuppier -> getGroupedBySupplier"
```

---

## Task 8: Move unchanged pages to domain subdirectories

Move six pages that require **no content changes** (all `@/` imports already resolve correctly).

**Files:**
- Create: `src/pages/catalog/ProductDetail.jsx`
- Create: `src/pages/orders/OrderDetail.jsx`
- Create: `src/pages/orders/TicketView.jsx`
- Create: `src/pages/auth/Login.jsx`
- Create: `src/pages/auth/KYC.jsx`
- Create: `src/pages/NotFound.jsx`

For each: copy the file content exactly as-is from the original location. All `@/` imports inside these files resolve unchanged.

- [ ] **Step 1: Copy `src/pages/catalog/ProductDetail.jsx`**

Copy the full content from current `src/pages/ProductDetail.jsx` (157 lines) to the new path. Content is identical.

- [ ] **Step 2: Copy `src/pages/orders/OrderDetail.jsx`**

Copy the full content from current `src/pages/OrderDetail.jsx` (109 lines) to the new path.

- [ ] **Step 3: Copy `src/pages/orders/TicketView.jsx`**

Copy the full content from current `src/pages/TicketView.jsx` (54 lines) to the new path.

- [ ] **Step 4: Copy `src/pages/auth/Login.jsx`**

Copy the full content from current `src/pages/Login.jsx` (121 lines) to the new path.

- [ ] **Step 5: Copy `src/pages/auth/KYC.jsx`**

Copy the full content from current `src/pages/KYC.jsx` (87 lines) to the new path.

- [ ] **Step 6: Copy `src/pages/NotFound.jsx`**

Copy the full content from current `src/pages/NotFound.jsx` (12 lines) to the new path. (Stays at top level of pages/, not in a subdomain folder.)

- [ ] **Step 7: Verify all six files exist**

```bash
ls src/pages/catalog/ProductDetail.jsx src/pages/orders/OrderDetail.jsx src/pages/orders/TicketView.jsx src/pages/auth/Login.jsx src/pages/auth/KYC.jsx src/pages/NotFound.jsx
```

Expected: all six paths printed without error.

- [ ] **Step 8: Commit**

```bash
git add src/pages/catalog/ProductDetail.jsx src/pages/orders/OrderDetail.jsx src/pages/orders/TicketView.jsx src/pages/auth/Login.jsx src/pages/auth/KYC.jsx src/pages/NotFound.jsx
git commit -m "refactor: move unchanged pages to domain subdirectories (catalog, orders, auth)"
```

---

## Task 9: Move and refactor `src/pages/cart/Cart.jsx`

Three changes from original: (1) typo fix for `getGroupedBySupplier`, (2) replace auth-guard `useEffect` with `useAuthGuard`, (3) replace inline totals with `calcOrderTotals`, (4) replace empty-state block with `<EmptyState>`.

**Files:**
- Create: `src/pages/cart/Cart.jsx`

- [ ] **Step 1: Write `src/pages/cart/Cart.jsx`**

```jsx
// src/pages/cart/Cart.jsx
import { useCart } from "@/contexts/CartContext";
import { getProductById, getSupplierById } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, Zap, AlertTriangle, ArrowRight, Minus, Plus, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { calcOrderTotals } from "@/lib/pricing";
import { EmptyState } from "@/components/common/EmptyState";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getGroupedBySupplier } = useCart();
  const { buyer, ready } = useAuthGuard({ from: "/cart" });
  const navigate = useNavigate();

  if (!ready) return null;

  const grouped = getGroupedBySupplier();
  const { subtotal, logistics, tax: gst, total } = calcOrderTotals(items, getProductById, buyer.type);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" /> Cart
            </h1>
            {items.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {items.length} item{items.length > 1 ? "s" : ""} in your cart
              </p>
            )}
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-16 w-16" />}
            title="Your cart is empty"
            subtitle="Browse our catalog and add products to get started"
            actionLabel="Browse Products"
            actionTo="/"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Items column */}
            <div className="lg:col-span-2 space-y-4">
              {Object.entries(grouped).map(([supplierId, supplierItems]) => {
                const supplier = getSupplierById(supplierId);
                return (
                  <Card key={supplierId}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        {supplier?.name || supplierId}
                        {supplier?.rafftarPricing && buyer.type === "rafftar" && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Zap className="h-3 w-3" /> Rafftar
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-0 divide-y">
                      {supplierItems.map((item) => {
                        const product = getProductById(item.productId);
                        if (!product) return null;
                        const belowMoq = item.quantity < product.moq;
                        const unitPrice =
                          buyer.type === "rafftar" && product.rafftarDiscount > 0
                            ? Math.round(item.unitPrice * (1 - product.rafftarDiscount / 100))
                            : item.unitPrice;
                        return (
                          <div key={item.productId} className="flex gap-4 items-start py-4 first:pt-0 last:pb-0">
                            <Link
                              to={`/product/${product.id}`}
                              className="h-16 w-16 bg-secondary/30 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-secondary/50 transition-colors"
                            >
                              <img src={product.image} alt={product.name} className="h-8 w-8 opacity-40" />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link to={`/product/${product.id}`}>
                                <h3 className="font-semibold text-sm truncate hover:text-primary transition-colors">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                ₹{unitPrice}/{product.unit}
                              </p>
                              {belowMoq && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                  <AlertTriangle className="h-3 w-3" /> Min. order: {product.moq} {product.unit}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                  className="w-16 h-7 text-center text-sm"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold">
                                ₹{Math.round(unitPrice * item.quantity).toLocaleString()}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.productId)}
                                className="text-destructive hover:text-destructive h-7 px-2 mt-1"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Logistics (est. 3%)</span>
                    <span>₹{logistics.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <Button className="w-full gap-2 mt-2" size="lg" onClick={() => navigate("/checkout")}>
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Secure checkout with GST invoice</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
```

- [ ] **Step 2: Verify key imports are present and old imports absent**

```bash
grep -n "useAuthGuard\|calcOrderTotals\|EmptyState\|getGroupedBySupplier\|getGroupedBySuppier\|useBuyer" src/pages/cart/Cart.jsx
```

Expected: `useAuthGuard`, `calcOrderTotals`, `EmptyState`, `getGroupedBySupplier` all appear; `getGroupedBySuppier` and `useBuyer` do NOT appear.

- [ ] **Step 3: Commit**

```bash
git add src/pages/cart/Cart.jsx
git commit -m "refactor: move Cart page, apply useAuthGuard + calcOrderTotals + EmptyState"
```

---

## Task 10: Move and refactor `src/pages/cart/Checkout.jsx`

Changes: replace auth-guard `useEffect` with `useAuthGuard`, replace `useMemo` totals with `calcOrderTotals`.

**Files:**
- Create: `src/pages/cart/Checkout.jsx`

- [ ] **Step 1: Write `src/pages/cart/Checkout.jsx`**

```jsx
// src/pages/cart/Checkout.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { getProductById, mockAddresses } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { calcOrderTotals } from "@/lib/pricing";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { buyer, ready } = useAuthGuard({ from: "/checkout" });
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [addressId, setAddressId] = useState(mockAddresses[0].id);
  const [deliveryDate, setDeliveryDate] = useState(addDays(new Date(), 5));
  const [step, setStep] = useState("address");

  const selectedAddress = mockAddresses.find((a) => a.id === addressId);

  const totals = useMemo(
    () => calcOrderTotals(items, getProductById, buyer.type),
    [items, buyer.type]
  );

  if (!ready) return null;

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    const order = placeOrder(items, selectedAddress, deliveryDate.toISOString(), false);
    clearCart();
    toast.success(`Order ${order.id} placed successfully!`);
    navigate(`/order/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex gap-2 mb-8">
          {["address", "summary"].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-1.5 rounded-full",
                step === s || (s === "address" && step === "summary") ? "bg-primary" : "bg-secondary"
              )}
            />
          ))}
        </div>

        {step === "address" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={addressId} onValueChange={setAddressId} className="space-y-3">
                  {mockAddresses.map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer",
                        addressId === a.id && "border-primary bg-primary/5"
                      )}
                    >
                      <RadioGroupItem value={a.id} id={a.id} className="mt-1" />
                      <Label htmlFor={a.id} className="cursor-pointer flex-1">
                        <p className="font-semibold text-sm">{a.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.line1}, {a.line2}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.city}, {a.state} – {a.pin}
                        </p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(deliveryDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={(d) => d && setDeliveryDate(d)}
                      disabled={(d) => d < addDays(new Date(), 2)}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={() => setStep("summary")}>
              Continue to Summary
            </Button>
          </div>
        )}

        {step === "summary" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  let unitPrice = item.unitPrice;
                  if (buyer.type === "rafftar" && product.rafftarDiscount > 0) {
                    unitPrice = Math.round(unitPrice * (1 - product.rafftarDiscount / 100));
                  }
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="truncate flex-1">
                        {product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Logistics</span>
                    <span>₹{totals.logistics.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{totals.tax.toLocaleString()}</span>
                  </div>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totals.total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-sm">
                <p className="font-medium mb-1">Delivering to: {selectedAddress.label}</p>
                <p className="text-muted-foreground">
                  {selectedAddress.line1}, {selectedAddress.city} – {selectedAddress.pin}
                </p>
                <p className="mt-2 font-medium">Expected: {format(deliveryDate, "PPP")}</p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("address")} className="flex-1">
                Back
              </Button>
              <Button onClick={handlePlaceOrder} className="flex-1 gap-2">
                <CheckCircle2 className="h-4 w-4" /> Place Order
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
```

- [ ] **Step 2: Verify**

```bash
grep -n "useAuthGuard\|calcOrderTotals\|useBuyer\|useEffect" src/pages/cart/Checkout.jsx
```

Expected: `useAuthGuard` and `calcOrderTotals` present; `useBuyer` and `useEffect` absent.

- [ ] **Step 3: Commit**

```bash
git add src/pages/cart/Checkout.jsx
git commit -m "refactor: move Checkout page, apply useAuthGuard + calcOrderTotals"
```

---

## Task 11: Move and refactor `Orders.jsx` and `InquiryCart.jsx` (EmptyState)

**Files:**
- Create: `src/pages/orders/Orders.jsx`
- Create: `src/pages/cart/InquiryCart.jsx`

- [ ] **Step 1: Write `src/pages/orders/Orders.jsx`**

```jsx
// src/pages/orders/Orders.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, Clock, CheckCircle2, Truck, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/components/common/EmptyState";

const statusConfig = {
  placed: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: <Clock className="h-3.5 w-3.5" /> },
  confirmed: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  dispatched: { color: "bg-purple-100 text-purple-700 border-purple-200", icon: <Truck className="h-3.5 w-3.5" /> },
  delivered: { color: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  delayed: { color: "bg-red-100 text-red-700 border-red-200", icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

const Orders = () => {
  const { orders } = useOrders();
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => {
          if (filter === "active") return ["placed", "confirmed", "dispatched"].includes(o.status);
          if (filter === "delivered") return o.status === "delivered";
          if (filter === "delayed") return o.status === "delayed";
          return true;
        });

  const counts = {
    all: orders.length,
    active: orders.filter((o) => ["placed", "confirmed", "dispatched"].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    delayed: orders.filter((o) => o.status === "delayed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Package className="h-6 w-6" /> My Orders
        </h1>
        <p className="text-sm text-muted-foreground mb-6">Track and manage all your orders</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["all", "active", "delivered", "delayed"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize flex-shrink-0 gap-1.5"
            >
              {f}
              <span className="text-xs opacity-70">({counts[f]})</span>
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No orders found"
            subtitle="Orders you place will appear here"
            actionLabel="Start Shopping"
            actionTo="/"
          />
        ) : (
          <div className="space-y-3 animate-fade-in">
            {filtered.map((order) => {
              const config = statusConfig[order.status] || statusConfig.placed;
              return (
                <Link to={`/order/${order.id}`} key={order.id} className="block">
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-bold text-sm">{order.id}</span>
                            <Badge className={`${config.color} gap-1`} variant="secondary">
                              {config.icon}
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>
                              {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="font-semibold text-foreground">
                              ₹{order.total.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span>{format(new Date(order.createdAt), "dd MMM yyyy")}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
```

- [ ] **Step 2: Write `src/pages/cart/InquiryCart.jsx`**

```jsx
// src/pages/cart/InquiryCart.jsx
import { useInquiry } from "@/contexts/InquiryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/common/EmptyState";

const InquiryCart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useInquiry();

  const handleSubmit = () => {
    toast({
      title: "Inquiry Submitted!",
      description: "Your inquiry has been sent to the suppliers. They will contact you shortly.",
    });
    clearCart();
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" /> Inquiry Cart
        </h1>

        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-12 w-12" />}
            title="Your inquiry cart is empty."
            subtitle="Browse products and add them to your inquiry."
          />
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4 flex gap-4 items-center">
                  <div className="h-16 w-16 bg-secondary/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-8 w-8 opacity-40"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.supplierName}</p>
                    <p className="text-sm font-bold mt-1">
                      ₹{item.product.price}/{item.product.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                      }
                      className="w-20 h-9 text-center"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSubmit} className="px-8">
                Submit Inquiry ({items.length} items)
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InquiryCart;
```

- [ ] **Step 3: Verify EmptyState is used in both files**

```bash
grep -n "EmptyState" src/pages/orders/Orders.jsx src/pages/cart/InquiryCart.jsx
```

Expected: both files show `EmptyState` import and usage.

- [ ] **Step 4: Commit**

```bash
git add src/pages/orders/Orders.jsx src/pages/cart/InquiryCart.jsx
git commit -m "refactor: move Orders and InquiryCart, apply EmptyState"
```

---

## Task 12: Move pages with import-path updates only (ProductListing, SearchResults, SupplierProfile)

Three pages that only need their component import paths updated to point to new component locations.

**Files:**
- Create: `src/pages/catalog/ProductListing.jsx`
- Create: `src/pages/catalog/SearchResults.jsx`
- Create: `src/pages/supplier/SupplierProfile.jsx`

- [ ] **Step 1: Write `src/pages/catalog/ProductListing.jsx`**

Change `import ProductCard from "@/components/ProductCard"` → `"@/components/product/ProductCard"` and `import FilterSidebar from "@/components/FilterSidebar"` → `"@/components/product/FilterSidebar"`. All other content is identical to original `src/pages/ProductListing.jsx`.

```jsx
// src/pages/catalog/ProductListing.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import { getProductsByCategory } from "@/data/mock";
import { mockApi } from "@/utils/mock-api";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const ProductListing = () => {
  const { categoryId } = useParams();
  const { data: catalog, isPending } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => mockApi.getCatalog(),
  });
  const [selectedCategories, setSelectedCategories] = useState(categoryId ? [categoryId] : []);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");

  const categories = catalog?.categories ?? [];
  const categoryName = categories.find((c) => c.id === categoryId)?.name || "All Products";

  const filtered = useMemo(() => {
    const products = catalog?.products ?? [];
    let items =
      selectedCategories.length > 0
        ? products.filter((p) => selectedCategories.includes(p.category))
        : categoryId
          ? getProductsByCategory(categoryId)
          : products;
    items = items.filter((p) => p.price <= priceRange[1] && p.rating >= minRating);
    if (sortBy === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") items.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") items.sort((a, b) => b.rating - a.rating);
    return items;
  }, [catalog, selectedCategories, priceRange, minRating, sortBy, categoryId]);

  if (isPending || !catalog) {
    return (
      <div className="page-shell">
        <main className="page-container py-6 sm:py-8">
          <Skeleton className="mb-6 h-10 w-48" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
            <Skeleton className="hidden h-96 rounded-xl md:block" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <main className="page-container py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl font-bold sm:text-2xl">{categoryName}</h1>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          <FilterSidebar
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            minRating={minRating}
            onMinRatingChange={setMinRating}
          />
          <div>
            <p className="text-sm text-muted-foreground mb-4">{filtered.length} products</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductListing;
```

- [ ] **Step 2: Write `src/pages/catalog/SearchResults.jsx`**

Change `import ProductCard from "@/components/ProductCard"` → `"@/components/product/ProductCard"` and `import SupplierCard from "@/components/SupplierCard"` → `"@/components/supplier/SupplierCard"`. All other content identical to original `src/pages/SearchResults.jsx`.

```jsx
// src/pages/catalog/SearchResults.jsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product/ProductCard";
import SupplierCard from "@/components/supplier/SupplierCard";
import { mockApi } from "@/utils/mock-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Building2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const suggestions = ["Cement", "TMT Steel", "Tiles", "Bricks", "Plumbing Pipes", "LED Lights"];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const { data, isPending } = useQuery({
    queryKey: ["search", query],
    queryFn: () => mockApi.searchCatalog(query),
  });
  const productResults = data?.products ?? [];
  const supplierResults = data?.suppliers ?? [];
  const noResults = !isPending && productResults.length === 0 && supplierResults.length === 0;

  if (isPending) {
    return (
      <div className="page-shell">
        <main className="page-container py-6 sm:py-8">
          <Skeleton className="mb-4 h-10 w-full max-w-md" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <main className="page-container py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold sm:text-2xl">
            Results for "<span className="text-primary">{query}</span>"
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {productResults.length} products · {supplierResults.length} suppliers
          </p>
        </div>

        {noResults ? (
          <div className="text-center py-16">
            <SearchX className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg font-semibold mb-1">No results found for "{query}"</p>
            <p className="text-sm text-muted-foreground mb-6">Try searching for something else</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="products">
            <TabsList className="mb-6">
              <TabsTrigger value="products" className="gap-1.5">
                <Package className="h-4 w-4" /> Products ({productResults.length})
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="gap-1.5">
                <Building2 className="h-4 w-4" /> Suppliers ({supplierResults.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              {productResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No products found for "{query}"
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {productResults.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="suppliers">
              {supplierResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No suppliers found for "{query}"
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplierResults.map((s) => (
                    <SupplierCard key={s.id} supplier={s} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
```

- [ ] **Step 3: Write `src/pages/supplier/SupplierProfile.jsx`**

Change `import ProductCard from "@/components/ProductCard"` → `"@/components/product/ProductCard"`. All other content identical to original `src/pages/SupplierProfile.jsx`.

```jsx
// src/pages/supplier/SupplierProfile.jsx
import { useParams } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import { getSupplierById, getProductsBySupplier } from "@/data/mock";
import { Star, MapPin, Calendar, Package } from "lucide-react";

const SupplierProfile = () => {
  const { supplierId } = useParams();
  const supplier = getSupplierById(supplierId || "");
  const supplierProducts = getProductsBySupplier(supplierId || "");

  if (!supplier) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Supplier not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-xl border p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="h-20 w-20 rounded-xl bg-secondary/40 flex items-center justify-center flex-shrink-0">
              <img src={supplier.logo} alt={supplier.name} className="h-10 w-10 opacity-40" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{supplier.name}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {supplier.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" /> {supplier.rating} ({supplier.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Est. {supplier.established}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" /> {supplier.productCount} products
                </span>
              </div>
              <p className="text-muted-foreground mt-3 max-w-2xl">{supplier.description}</p>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Products by {supplier.name}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {supplierProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SupplierProfile;
```

- [ ] **Step 4: Verify import paths point to new locations**

```bash
grep -n "components/ProductCard\|components/SupplierCard\|components/FilterSidebar" src/pages/catalog/ProductListing.jsx src/pages/catalog/SearchResults.jsx src/pages/supplier/SupplierProfile.jsx
```

Expected: all matches show `/product/ProductCard`, `/supplier/SupplierCard`, or `/product/FilterSidebar` — none use the old flat paths.

- [ ] **Step 5: Commit**

```bash
git add src/pages/catalog/ProductListing.jsx src/pages/catalog/SearchResults.jsx src/pages/supplier/SupplierProfile.jsx
git commit -m "refactor: move ProductListing, SearchResults, SupplierProfile; update component import paths"
```

---

## Task 13: Move and refactor `src/pages/home/Index.jsx`

Replace five repeated section-header + product/supplier-grid blocks with the new shared components. Visual output must be identical.

**Files:**
- Create: `src/pages/home/Index.jsx`

- [ ] **Step 1: Write `src/pages/home/Index.jsx`**

```jsx
// src/pages/home/Index.jsx
import { useQuery } from "@tanstack/react-query";
import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/CategoryGrid";
import { mockApi } from "@/utils/mock-api";
import { Flame, Sparkles, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductImage } from "@/data/images";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/common/ProductGrid";
import { SupplierGrid } from "@/components/common/SupplierGrid";
import { SectionHeader } from "@/components/common/SectionHeader";

const Index = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => mockApi.getCatalog(),
  });

  if (isPending) {
    return (
      <div className="page-shell">
        <main className="page-container section-y space-y-6">
          <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page-shell">
        <main className="page-container section-y">
          <p className="text-center text-sm text-muted-foreground">
            Unable to load catalog. Please refresh.
          </p>
        </main>
      </div>
    );
  }

  const { products, suppliers, categories } = data;
  const trendingProducts = products.filter((p) => p.rating >= 4.5).slice(0, 4);
  const newArrivals = products
    .filter((p) => ["paint", "wood", "hardware", "waterproofing"].includes(p.category))
    .slice(0, 4);
  const bestDeals = products.filter((p) => p.rafftarDiscount >= 5).slice(0, 4);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const popularSuppliers = suppliers.filter((s) => s.rating >= 4.4).slice(0, 4);
  const categoryHighlights = categories.slice(0, 6).map((cat) => {
    const catProducts = products.filter((p) => p.category === cat.id);
    return { category: cat, product: catProducts[0], count: catProducts.length };
  });

  return (
    <div className="page-shell">
      <main className="page-container py-6 sm:py-8">
        <HeroSearch />
        <CategoryGrid />

        {/* Trending Now */}
        <section className="py-8">
          <SectionHeader
            icon={<Flame className="h-5 w-5 text-primary" />}
            title="Trending Now"
            viewAllTo="/search?q=trending"
          />
          <ProductGrid products={trendingProducts} />
        </section>

        {/* Category Showcase Banner */}
        <section className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categoryHighlights.map((item, i) => (
              <Link
                key={item.category.id}
                to={`/category/${item.category.id}`}
                className="group relative rounded-xl overflow-hidden h-40 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={getProductImage(item.category.id)}
                  alt={item.category.name}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-primary-foreground text-sm font-bold">{item.category.name}</p>
                  <p className="text-primary-foreground/70 text-xs">{item.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-8">
          <SectionHeader
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            title="New Arrivals"
            viewAllTo="/search?q=paint"
          />
          <ProductGrid products={newArrivals} />
        </section>

        {/* Best Bulk Deals — keep custom styled wrapper, no SectionHeader */}
        <section className="py-6">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/30 border border-primary/20 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Best Bulk Deals</h2>
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                Up to 6% off
              </span>
            </div>
            <ProductGrid products={bestDeals} />
          </div>
        </section>

        {/* Top Rated Products */}
        <section className="py-8">
          <SectionHeader
            icon={<Star className="h-5 w-5 fill-primary text-primary" />}
            title="Top Rated Products"
            viewAllTo="/category/cement"
          />
          <ProductGrid products={topRated} animationBase={80} />
        </section>

        {/* Popular Suppliers */}
        <section className="py-8 pb-16">
          <SectionHeader title="Popular Suppliers" />
          <SupplierGrid suppliers={popularSuppliers} />
        </section>
      </main>
    </div>
  );
};

export default Index;
```

- [ ] **Step 2: Verify new component imports and removal of old ones**

```bash
grep -n "ProductGrid\|SupplierGrid\|SectionHeader\|ProductCard\|SupplierCard\|ArrowRight\|Button" src/pages/home/Index.jsx
```

Expected: `ProductGrid`, `SupplierGrid`, `SectionHeader` present. `ProductCard`, `SupplierCard`, `ArrowRight`, `Button` are NOT directly imported (they're used inside the common components).

- [ ] **Step 3: Commit**

```bash
git add src/pages/home/Index.jsx
git commit -m "refactor: move Index/home page, apply SectionHeader + ProductGrid + SupplierGrid"
```

---

## Task 14: Update routing files

**Files:**
- Modify: `src/routes/config.jsx` — all lazy import paths
- Modify: `src/routes/index.jsx` — `PublicLayout` import

- [ ] **Step 1: Write `src/routes/config.jsx`**

```jsx
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
```

- [ ] **Step 2: Edit `src/routes/index.jsx`** — change only the `PublicLayout` import line

Change:
```jsx
import { PublicLayout } from "@/container/PublicLayout";
```
To:
```jsx
import { PublicLayout } from "@/components/layout/PublicLayout";
```

Leave all other lines in `src/routes/index.jsx` unchanged (the `BrowserRouter`, `Suspense`, `Routes`, `RouteFallback`, and the render JSX all stay identical).

- [ ] **Step 3: Verify routes import correct locations**

```bash
grep -n "container\|pages/home\|pages/catalog\|pages/cart\|pages/orders\|pages/auth\|pages/supplier\|components/layout" src/routes/config.jsx src/routes/index.jsx
```

Expected:
- `config.jsx`: all `@/pages/` paths use new sub-directories; no `@/pages/Index`, `@/pages/Cart`, etc.
- `index.jsx`: `@/components/layout/PublicLayout`; no `@/container/PublicLayout`.

- [ ] **Step 4: Commit**

```bash
git add src/routes/config.jsx src/routes/index.jsx
git commit -m "refactor: update route lazy-imports to new page paths; update PublicLayout import"
```

---

## Task 15: Update `src/main.jsx`

**Files:**
- Modify: `src/main.jsx`

- [ ] **Step 1: Write `src/main.jsx`**

```jsx
// src/main.jsx
import { createRoot } from "react-dom/client";
import App from "@/app/App";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
```

- [ ] **Step 2: Verify**

```bash
grep "import App" src/main.jsx
```

Expected: `import App from "@/app/App";`

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx
git commit -m "refactor: update main.jsx to import App from src/app/"
```

---

## Task 16: Delete old files and folders

> ⚠️ Only run this task after confirming the dev server starts cleanly (Task 17 verification).

**Files to delete:**
- `src/container/` (entire directory)
- `src/resources/` (entire directory)
- `src/components/ProductCard.jsx`
- `src/components/FilterSidebar.jsx`
- `src/components/SupplierCard.jsx`
- All original flat page files in `src/pages/` that have been moved to sub-directories

- [ ] **Step 1: Delete the old container directory**

```bash
rm -rf src/container
```

- [ ] **Step 2: Delete the empty resources directory**

```bash
rm -rf src/resources
```

- [ ] **Step 3: Delete old component files**

```bash
rm src/components/ProductCard.jsx src/components/FilterSidebar.jsx src/components/SupplierCard.jsx
```

- [ ] **Step 4: Delete old flat page files (they've all been moved)**

```bash
rm src/pages/Index.jsx src/pages/Cart.jsx src/pages/Checkout.jsx src/pages/Orders.jsx src/pages/InquiryCart.jsx src/pages/ProductDetail.jsx src/pages/ProductListing.jsx src/pages/SearchResults.jsx src/pages/SupplierProfile.jsx src/pages/OrderDetail.jsx src/pages/TicketView.jsx src/pages/Login.jsx src/pages/KYC.jsx
```

Note: `src/pages/NotFound.jsx` was moved to the same directory (`src/pages/NotFound.jsx`) so it does NOT need to be deleted.

- [ ] **Step 5: Verify no old imports remain**

```bash
grep -r "from \"@/container" src/ && echo "FAIL: old container imports remain" || echo "OK: no container imports"
grep -r "from \"@/components/ProductCard\"" src/ && echo "FAIL: old ProductCard path remains" || echo "OK"
grep -r "from \"@/components/SupplierCard\"" src/ && echo "FAIL: old SupplierCard path remains" || echo "OK"
grep -r "from \"@/components/FilterSidebar\"" src/ && echo "FAIL: old FilterSidebar path remains" || echo "OK"
```

All four `grep` calls should return no output (exit 1 caught by `|| echo "OK"`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: delete src/container, src/resources, and old flat component/page files"
```

---

## Task 17: Final verification

- [ ] **Step 1: Start the dev server and confirm no import/build errors**

```bash
bun run dev
```

Expected: Vite starts successfully, no "Failed to resolve import" or "Module not found" errors in the terminal output.

- [ ] **Step 2: Manual smoke test checklist** (open browser at http://localhost:5173)

| Route | What to check |
|---|---|
| `/` | HeroSearch, CategoryGrid, 5 product sections, supplier section all render |
| `/search?q=cement` | Products tab shows cards; Suppliers tab shows supplier cards |
| `/category/cement` | Filter sidebar works; product cards render |
| `/product/[any-id]` | Price lock shown when not logged in; pricing visible after KYC |
| `/login` | All 3 tabs (Login, OTP, Sign Up) render; login as "Rajesh Kumar" works |
| `/kyc` | 3-step flow completes; navigates home after |
| `/cart` | Redirects to login when logged out; shows items when logged in |
| `/checkout` | 2-step flow works; places order and navigates to order detail |
| `/orders` | Order list renders; empty state shows when no orders |
| `/order/[id]` | Timeline, items, raise ticket dialog all work |
| `/inquiry` | Inquiry cart renders; submit clears cart |
| `/supplier/[id]` | Supplier profile header + product grid renders |
| `/not-a-real-route` | 404 page renders |

- [ ] **Step 3: Run build to confirm zero import errors**

```bash
bun run build
```

Expected: `dist/` generated without errors. Build output shows code-split chunks for each page.

---

## Self-Review Against Spec

### Spec Coverage Check

| Spec Section | Plan Task |
|---|---|
| 1A: src/container → src/app + src/components/layout | Task 6 |
| 1A: Pages flat → domain-grouped | Tasks 8, 9, 10, 11, 12, 13 |
| 1A: src/resources deleted | Task 16 |
| 1A: use-toast duplicate | Not in scope (spec says ui/ copy is a one-liner re-export; both are kept per ground rule #5 - ui/ is untouched) |
| 1B: Inline JSX unformatted | All task steps write formatted multi-line JSX |
| 1B: PriceLockGate | Task 3 (create) + Task 4 (apply to ProductCard) |
| 1B: calcOrderTotals | Task 1 (create) + Task 9, 10 (apply) |
| 1B: useAuthGuard | Task 2 (create) + Task 9, 10 (apply) |
| 1B: EmptyState | Task 3 (create) + Task 9, 11 (apply) |
| 1B: ProductGrid | Task 5 (create) + Task 13 (apply) |
| 1B: SupplierGrid | Task 5 (create) + Task 13 (apply) |
| 1B: SectionHeader | Task 3 (create) + Task 13 (apply) |
| 1B: getGroupedBySuppier typo | Task 7 |
| 1B: Dead import getProductsByCategory | Left in ProductListing — it's used in the filter useMemo as a fallback (`categoryId ? getProductsByCategory(categoryId) : products`) so it is NOT dead |
| 3A: main.jsx | Task 15 |
| 3B: App.jsx | Task 6 |
| 3C: AppProviders.jsx | Task 6 |
| 3D: PublicLayout.jsx | Task 6 |
| 3E: pricing.js | Task 1 |
| 3F: useAuthGuard.js | Task 2 |
| 3G: EmptyState.jsx | Task 3 |
| 3H: SectionHeader.jsx | Task 3 |
| 3I: PriceLockGate.jsx | Task 3 |
| 3J: ProductGrid.jsx | Task 5 |
| 3K: SupplierGrid.jsx | Task 5 |
| 3L: ProductCard.jsx | Task 4 |
| 3M: FilterSidebar.jsx | Task 4 |
| 3N: SupplierCard.jsx | Task 4 |
| 3O: CartContext typo | Task 7 |
| 3P: routes/config.jsx | Task 14 |
| 3Q: routes/index.jsx | Task 14 |
| 3R: Import path updates | Tasks 12, 13 |
| 3S: Cart.jsx | Task 9 |
| 3T: Checkout.jsx | Task 10 |
| 3U: Index.jsx | Task 13 |
| 3V: EmptyState in Cart/Orders/InquiryCart | Tasks 9, 11 |
| Delete src/container + src/resources | Task 16 |

### Placeholder Scan
No TBD, TODO, or vague instructions — every step has complete code or exact commands.

### Type Consistency
- `calcOrderTotals` returns `{ subtotal, logistics, tax, total }` — Cart.jsx uses `tax: gst` rename ✓
- `useAuthGuard` returns `{ buyer, ready }` — both Cart.jsx and Checkout.jsx use both fields ✓
- `getGroupedBySupplier` — fixed in CartContext (Task 7) and destructured correctly in Cart (Task 9) ✓
- `PriceLockGate` props: `{ children, productId, className }` — ProductCard passes `productId={product.id}` ✓
- `EmptyState` props: `{ icon, title, subtitle, actionLabel, actionTo }` — all usages pass correct props ✓
