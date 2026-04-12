import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import SupplierCard from "@/components/SupplierCard";
import { products, suppliers, categories } from "@/data/mock";
import { ArrowRight, Flame, Sparkles, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getProductImage } from "@/data/images";

const Index = () => {
  // Different curated sections
  const trendingProducts = products.filter(p => p.rating >= 4.5).slice(0, 4);
  const newArrivals = products.filter(p => ["paint", "wood", "hardware", "waterproofing"].includes(p.category)).slice(0, 4);
  const bestDeals = products.filter(p => p.rafftarDiscount >= 5).slice(0, 4);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const popularSuppliers = suppliers.filter(s => s.rating >= 4.4).slice(0, 4);

  // Category-wise highlights: pick 1 random product per category for the banner
  const categoryHighlights = categories.slice(0, 6).map(cat => {
    const catProducts = products.filter(p => p.category === cat.id);
    return { category: cat, product: catProducts[0], count: catProducts.length };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4">
        <HeroSearch />
        <CategoryGrid />

        {/* Trending Now */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            <Link to="/search?q=trending">
              <Button variant="ghost" size="sm" className="text-primary gap-1 hover:scale-105 transition-transform">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {trendingProducts.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">New Arrivals</h2>
            </div>
            <Link to="/search?q=paint">
              <Button variant="ghost" size="sm" className="text-primary gap-1 hover:scale-105 transition-transform">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newArrivals.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>

        {/* Best Deals Banner */}
        <section className="py-6">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/30 border border-primary/20 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Best Bulk Deals</h2>
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-medium">Up to 6% off</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {bestDeals.map((p, i) => (
                <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Rated Products */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <h2 className="text-2xl font-bold">Top Rated Products</h2>
            </div>
            <Link to="/category/cement">
              <Button variant="ghost" size="sm" className="text-primary gap-1 hover:scale-105 transition-transform">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {topRated.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>

        {/* Popular Suppliers */}
        <section className="py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Suppliers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularSuppliers.map((s, i) => (
              <div key={s.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <SupplierCard supplier={s} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
