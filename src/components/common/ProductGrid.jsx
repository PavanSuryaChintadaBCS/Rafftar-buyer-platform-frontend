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
