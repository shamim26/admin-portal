export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  featuredImage: string;
  images: string[];
  brand: string;
  size: string[];
  colors: string[];
  quantity: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

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
  color?: string;
  size?: string;
}
