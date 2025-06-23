export type Product = {
  id: number;
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
