
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import SupplierCard from "@/components/supplier/SupplierCard";
import { mockApi } from "@/utils/mock-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Building2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const suggestions = ["Cement", "TMT Steel", "Tiles", "Bricks", "Plumbing Pipes", "LED Lights"];

// debounce hook
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim();
  const debouncedQuery = useDebounce(query, 400);

  const navigate = useNavigate();

  const { data, isPending, isError } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => mockApi.searchCatalog(debouncedQuery),
    enabled: !!debouncedQuery,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const productResults = useMemo(() => data?.products ?? [], [data]);
  const supplierResults = useMemo(() => data?.suppliers ?? [], [data]);

  const noResults = useMemo(
    () =>
      !isPending &&
      debouncedQuery &&
      productResults.length === 0 &&
      supplierResults.length === 0,
    [isPending, debouncedQuery, productResults, supplierResults]
  );

  const defaultTab = productResults.length ? "products" : "suppliers";

  //  Empty query state
  if (!query) {
    return (
      <div className="page-shell">
        <main className="page-container py-6 sm:py-8 text-center">
          <p className="text-lg font-semibold mb-4">Start searching for products or suppliers</p>
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
        </main>
      </div>
    );
  }

  if (isPending && !data) {
    return (
      <div className="page-shell">
        <main className="page-container py-6 sm:py-8">
          <Skeleton className="mb-4 h-10 w-full max-w-md" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-shell">
        <main className="page-container py-6 sm:py-8 text-center">
          <p className="text-lg font-semibold mb-2">Something went wrong</p>
          <p className="text-sm text-muted-foreground mb-4">
            Please try again later
          </p>
          <Button onClick={() => navigate(0)}>Retry</Button>
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
            <p className="text-sm text-muted-foreground mb-6">
              Try searching for something else
            </p>
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
          <Tabs defaultValue={defaultTab}>
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