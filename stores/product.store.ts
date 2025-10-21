import { GetProductDto, Product } from "@/app/(private)/products/product.dto";
import { ProductService } from "@/app/(private)/products/product.service";
import { create } from "zustand";

type ProductStore = {
  products: Product[];
  totalPages: number;
  currentPage: number;
  updatePage: (page: number) => void;
  fetchAllProducts: (options?: GetProductDto) => Promise<Product[]>;
  addProduct: (product: Product) => void;
};

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  totalPages: 0,
  currentPage: 1,
  updatePage: (page: number) => set({ currentPage: page }),
  fetchAllProducts: async (options?: GetProductDto) => {
    const response = await ProductService.getProducts(options);
    set({
      products: response.data.payload.products,
      totalPages: response.data.payload.totalPages,
      currentPage: response.data.payload.currentPage,
    });
    return response.data.payload;
  },
  addProduct: (product: Product) => {
    
    set((state) => ({
      products: [...state.products, product],
    }));
  },
}));

export default useProductStore;
