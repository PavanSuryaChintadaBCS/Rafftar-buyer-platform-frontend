import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
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
  const [priceRange, setPriceRange] = useState([0, 5e3]);
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
  return <div className="page-shell"><main className="page-container py-6 sm:py-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"><h1 className="text-xl font-bold sm:text-2xl">{categoryName}</h1><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent><SelectItem value="rating">Top Rated</SelectItem><SelectItem value="price-asc">Price: Low → High</SelectItem><SelectItem value="price-desc">Price: High → Low</SelectItem></SelectContent></Select></div><div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8"><FilterSidebar
    selectedCategories={selectedCategories}
    onCategoriesChange={setSelectedCategories}
    priceRange={priceRange}
    onPriceRangeChange={setPriceRange}
    minRating={minRating}
    onMinRatingChange={setMinRating}
  /><div><p className="text-sm text-muted-foreground mb-4">{filtered.length} products</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div></div></div></main></div>;
};
export default ProductListing;
