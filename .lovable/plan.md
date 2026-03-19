

## B2B Construction Materials Marketplace

A modern, minimalistic marketplace for construction materials with dual search results (products + suppliers).

### Pages & Navigation

1. **Home Page** — Clean header with logo, prominent search bar, location selector, login button. Category grid (cement, steel, bricks, tiles, sand, electricals, plumbing). Featured products carousel. Popular suppliers section.

2. **Search Results Page** — Tabbed UI: "Products" | "Suppliers" tabs. Product cards show image, name, price/unit, supplier, rating, "View Details" CTA. Supplier cards show company name, logo, location, rating, product count, "View Supplier" CTA. Client-side search across product names, supplier names, and categories.

3. **Product Listing Page** — Grid layout with sidebar filters (category, price range, rating, location) and sorting (price, rating, newest). Reuses product card component.

4. **Product Detail Page** — Product image, description, bulk pricing tiers table, supplier info card, "Contact Supplier" and "Add to Inquiry" CTAs.

5. **Supplier Profile Page** — Company info, rating, location, product grid from that supplier.

6. **Inquiry Cart** — Selected items list, quantity inputs, "Submit Inquiry" button (mock toast confirmation).

### Mock Data

~30 products across 7 categories, linked to ~10 suppliers. Each supplier has 3-5 products. Data includes name, category, price, unit, rating, location, supplier reference.

### UI/UX

- Swiggy-inspired minimal design: clean whites, subtle shadows, orange/amber accent color
- Prominent centered search bar on home page
- Smooth page transitions via React Router
- Fully mobile responsive
- Tailwind CSS throughout

### Components

- Header (search bar, logo, location, nav)
- CategoryGrid, ProductCard, SupplierCard
- SearchResults with tabs
- FilterSidebar, SortDropdown
- BulkPricingTable, InquiryCart

