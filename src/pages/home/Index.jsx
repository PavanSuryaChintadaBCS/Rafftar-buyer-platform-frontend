import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/CategoryGrid";
import { mockApi } from "@/utils/http-service";
import { Flame, Sparkles, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductImage } from "@/data/images";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/common/ProductGrid";
import { SupplierGrid } from "@/components/common/SupplierGrid";
import { SectionHeader } from "@/components/common/SectionHeader";
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
    return categories.slice(0, 6).map((cat) => {
      const catProducts = products.filter((p) => p.category === cat.id);
      return {
        category: cat,
        product: catProducts[0],
        count: catProducts.length,
      };
    });
  }, [categories, products]);

  const buyerType = buyer.type;
  const isLoggedIn = buyer.isLoggedIn;
  const isUnlocked = buyer.isLoggedIn && buyer.isKYCVerified;

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
                  <p className="text-primary-foreground text-sm font-bold">
                    {item.category.name}
                  </p>
                  <p className="text-primary-foreground/70 text-xs">
                    {item.count} products
                  </p>
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
          <ProductGrid
            products={newArrivals}
            buyerType={buyerType}
            isUnlocked={isUnlocked}
            isLoggedIn={isLoggedIn}
          />
        </section>

        {/* Best Bulk Deals */}
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

        {/* Top Rated */}
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
