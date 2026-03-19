export interface Supplier {
  id: string;
  name: string;
  logo: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  established: number;
  productCount: number;
}

export interface BulkPricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  rating: number;
  reviewCount: number;
  description: string;
  specifications: Record<string, string>;
  bulkPricing: BulkPricingTier[];
  inStock: boolean;
}

export interface InquiryItem {
  product: Product;
  quantity: number;
}
