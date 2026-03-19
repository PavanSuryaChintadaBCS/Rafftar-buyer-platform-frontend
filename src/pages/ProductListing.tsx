import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { getProductsByCategory, products, categories } from "@/data/mock";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductListing = () => {
  const { categoryId } = useParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryId ? [categoryId] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");

  const categoryName = categories.find((c) => c.id === categoryId)?.name || "All Products";

  const filtered = useMemo(() => {
    let items = selectedCategories.length > 0
      ? products.filter((p) => selectedCategories.includes(p.category))
      : categoryId
      ? getProductsByCategory(categoryId)
      : products;

    items = items.filter((p) => p.price <= priceRange[1] && p.rating >= minRating);

    if (sortBy === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") items.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") items.sort((a, b) => b.rating - a.rating);

    return items;
  }, [selectedCategories, priceRange, minRating, sortBy, categoryId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
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
