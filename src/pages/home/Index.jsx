// // src/pages/home/Index.jsx
//111

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/CategoryGrid";
// import { mockApi } from "@/utils/mock-api";
import { mockApi } from "@/utils";
import { Flame, Sparkles, Star, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/common/ProductGrid";
import { SupplierGrid } from "@/components/common/SupplierGrid";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CategoryShowcase } from "@/components/common/CategoryShowcase";
import { useBuyer } from "@/contexts/BuyerContext";

const Index = () => {
  const { buyer } = useBuyer();

  const { data, isPending, isError } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => mockApi.getCatalog(),
  });

  

  const products = useMemo(() => data?.products || [], [data]);
const suppliers = useMemo(() => data?.suppliers || [], [data]);
const categories = useMemo(() => data?.categories || [], [data]);

  //Derived data (memoized)
  const trendingProducts = useMemo(
    () => products.filter((p) => p.rating >= 4.5).slice(0, 4),
    [products]
  );

  const newArrivals = useMemo(
    () =>
      products
        .filter((p) =>
          ["paint", "wood", "hardware", "waterproofing"].includes(p.category)
        )
        .slice(0, 4),
    [products]
  );

  const bestDeals = useMemo(
    () => products.filter((p) => p.rafftarDiscount >= 5).slice(0, 4),
    [products]
  );

  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
    [products]
  );

  const popularSuppliers = useMemo(
    () => suppliers.filter((s) => s.rating >= 4.4).slice(0, 4),
    [suppliers]
  );

  

  const categoryHighlights = useMemo(() => {
    return categories.slice(0, 6).map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: products.filter((p) => p.category === cat.id).length,
    }));
  }, [categories, products]);


  
  // Buyer state
  const buyerType = buyer.type;
  const isLoggedIn = buyer.isLoggedIn;
  const isUnlocked = buyer.isLoggedIn && buyer.isKYCVerified;

  // Loading
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
    return <p className="text-center">Failed to load</p>;
  }

  return (
    <div className="page-shell">
      <main className="page-container py-6 sm:py-8">
        <HeroSearch />
        <CategoryGrid />

        {/* Trending */}
        <section className="py-8">
          <SectionHeader
            icon={<Flame className="h-5 w-5 text-primary" />}
            title="Trending Now"
            viewAllTo="/search?q=trending"
          />
          <ProductGrid
            products={trendingProducts}
            buyerType={buyerType}
            isUnlocked={isUnlocked}
            isLoggedIn={isLoggedIn}
          />
        </section>

        {/* Category Showcase */}
        <CategoryShowcase categoryHighlights={categoryHighlights} />

        {/*  New Arrivals */}
        <section className="py-8">
          <SectionHeader
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            title="New Arrivals"
            viewAllTo="/search?q=paint"
          />
          <ProductGrid
            products={newArrivals}
            buyerType={buyerType}
            isUnlocked={isUnlocked}
            isLoggedIn={isLoggedIn}
          />
        </section>

        {/*  Best Deals  */}
        <section className="py-6">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/30 border border-primary/20 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Best Bulk Deals</h2>
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                Up to 6% off
              </span>
            </div>
            <ProductGrid
              products={bestDeals}
              buyerType={buyerType}
              isUnlocked={isUnlocked}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </section>

        {/*  Top Rated */}
        <section className="py-8">
          <SectionHeader
            icon={<Star className="h-5 w-5 fill-primary text-primary" />}
            title="Top Rated Products"
            viewAllTo="/category/cement"
          />
          <ProductGrid
            products={topRated}
            animationBase={80}
            buyerType={buyerType}
            isUnlocked={isUnlocked}
            isLoggedIn={isLoggedIn}
          />
        </section>

        {/* Suppliers */}
        <section className="py-8 pb-16">
          <SectionHeader title="Popular Suppliers" />
          <SupplierGrid suppliers={popularSuppliers} />
        </section>
      </main>
    </div>
  );
};

export default Index;

