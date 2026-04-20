import { useParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { getSupplierById, getProductsBySupplier } from "@/data/mock";
import { Star, MapPin, Calendar, Package } from "lucide-react";
const SupplierProfile = () => {
  const { supplierId } = useParams();
  const supplier = getSupplierById(supplierId || "");
  const supplierProducts = getProductsBySupplier(supplierId || "");
  if (!supplier) {
    return <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Supplier not found.</p></div></div>;
  }
  return <div className="min-h-screen bg-background"><main className="container mx-auto px-4 py-6"><div className="bg-card rounded-xl border p-6 md:p-8 mb-8"><div className="flex flex-col sm:flex-row gap-5 items-start"><div className="h-20 w-20 rounded-xl bg-secondary/40 flex items-center justify-center flex-shrink-0"><img src={supplier.logo} alt={supplier.name} className="h-10 w-10 opacity-40" /></div><div><h1 className="text-2xl font-bold">{supplier.name}</h1><div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {supplier.location}</span><span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> {supplier.rating} ({supplier.reviewCount} reviews)</span><span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Est. {supplier.established}</span><span className="flex items-center gap-1"><Package className="h-4 w-4" /> {supplier.productCount} products</span></div><p className="text-muted-foreground mt-3 max-w-2xl">{supplier.description}</p></div></div></div><h2 className="text-xl font-bold mb-4">Products by {supplier.name}</h2><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{supplierProducts.map((p) => <ProductCard key={p.id} product={p} />)}</div></main></div>;
};
export default SupplierProfile;
