import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import SupplierCard from "@/components/SupplierCard";
import { products, suppliers } from "@/data/mock";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const featuredProducts = products.slice(0, 8);
  const popularSuppliers = suppliers.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4">
        <HeroSearch />
        <CategoryGrid />

        {/* Featured Products */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/category/cement">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Popular Suppliers */}
        <section className="py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Suppliers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularSuppliers.map((s) => (
              <SupplierCard key={s.id} supplier={s} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
