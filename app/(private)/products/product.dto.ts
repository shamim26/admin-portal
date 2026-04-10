export interface ProductVariantOption {
  name: string;
  values: string[];
  _id?: string;
}

export interface ProductVariant {
  sku: string;
  price: number;
  stock: number;
  options: ProductVariantOption[];
  _id?: string;
}

export interface ProductPricing {
  basePrice: number;
  compareAtPrice: number;
  _id?: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
  _id?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;

  // References
  category: string; // ID
  brand: string; // ID
  tags?: string[];

  // Media
  images: string[];

  // Complex fields
  pricing: ProductPricing;
  variants: ProductVariant[];
  specifications: ProductSpecification[];

  warranty?: string;

  isFeatured: boolean;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface GetProductDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  stockStatus?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  // Deprecated/Removed fields from model, but keeping if backend supports them directly or via variant lookup
  // colors? sizes?
  // Backend model doesn't expose them directly on Product, they are in variants.
  // But filters might use them.
  color?: string;
  size?: string;
}
