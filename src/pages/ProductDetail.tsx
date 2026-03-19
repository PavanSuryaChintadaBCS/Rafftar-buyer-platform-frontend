import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { getProductById, getSupplierById } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, MapPin, ShoppingCart, MessageSquare } from "lucide-react";
import { useInquiry } from "@/contexts/InquiryContext";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { productId } = useParams();
  const product = getProductById(productId || "");
  const supplier = product ? getSupplierById(product.supplierId) : undefined;
  const { addItem } = useInquiry();

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
      </div>
    );
  }

  const handleAddToInquiry = () => {
    addItem(product);
    toast({ title: "Added to Inquiry", description: `${product.name} added to your inquiry cart.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-secondary/30 rounded-xl flex items-center justify-center">
            <img src={product.image} alt={product.name} className="h-32 w-32 opacity-40" />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">₹{product.price}</span>
              <span className="text-muted-foreground">/{product.unit}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

            <div className="flex gap-3 pt-2">
              <Button className="gap-2" onClick={handleAddToInquiry}>
                <ShoppingCart className="h-4 w-4" /> Add to Inquiry
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" /> Contact Supplier
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Specifications */}
          <div>
            <h2 className="text-lg font-bold mb-3">Specifications</h2>
            <Table>
              <TableBody>
                {Object.entries(product.specifications).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium text-muted-foreground">{key}</TableCell>
                    <TableCell>{val}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Bulk Pricing */}
          <div>
            <h2 className="text-lg font-bold mb-3">Bulk Pricing</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price per {product.unit}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.bulkPricing.map((tier, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {tier.maxQty ? `${tier.minQty} – ${tier.maxQty}` : `${tier.minQty}+`}
                    </TableCell>
                    <TableCell className="font-semibold">₹{tier.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Supplier Card */}
        {supplier && (
          <Card className="mt-10">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start">
              <div className="h-16 w-16 rounded-lg bg-secondary/40 flex items-center justify-center flex-shrink-0">
                <img src={supplier.logo} alt={supplier.name} className="h-8 w-8 opacity-40" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{supplier.name}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {supplier.location}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {supplier.rating}</span>
                  <span>Est. {supplier.established}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{supplier.description}</p>
                <Link to={`/supplier/${supplier.id}`}>
                  <Button variant="outline" size="sm" className="mt-3">View All Products</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
