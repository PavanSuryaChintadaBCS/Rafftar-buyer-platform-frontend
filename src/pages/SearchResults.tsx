import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SupplierCard from "@/components/SupplierCard";
import { searchProducts, searchSuppliers } from "@/data/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Building2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const suggestions = ["Cement", "TMT Steel", "Tiles", "Bricks", "Plumbing Pipes", "LED Lights"];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();

  const productResults = searchProducts(query);
  const supplierResults = searchSuppliers(query);
  const noResults = productResults.length === 0 && supplierResults.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
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
                <Button key={s} variant="outline" size="sm" onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}>
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
                <p className="text-muted-foreground text-center py-12">No products found for "{query}"</p>
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
                <p className="text-muted-foreground text-center py-12">No suppliers found for "{query}"</p>
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
