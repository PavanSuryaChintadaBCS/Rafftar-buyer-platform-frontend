import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SupplierCard from "@/components/SupplierCard";
import { searchProducts, searchSuppliers } from "@/data/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Building2 } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const productResults = searchProducts(query);
  const supplierResults = searchSuppliers(query);

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
      </main>
    </div>
  );
};

export default SearchResults;
