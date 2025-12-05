import { GetProductDto, Product } from "@/app/(private)/products/product.dto";
import { ProductService } from "@/app/(private)/products/product.service";
import { create } from "zustand";

type ProductStore = {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;

  // Pagination State
  totalPages: number;
  currentPage: number;
  totalProducts: number;

  // Actions
  fetchAllProducts: (options?: GetProductDto) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // State setters
  setPage: (page: number) => void;
};

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  totalProducts: 0,

  setPage: (page: number) => set({ currentPage: page }),

  fetchAllProducts: async (options?: GetProductDto) => {
    set({ loading: true, error: null });
    try {
      const response = await ProductService.getProducts(options);

      const payload = response.data?.payload;

      if (payload) {
        set({
          products: payload.products,
          totalPages: payload.totalPages,
          currentPage: payload.currentPage,
          totalProducts: payload.totalProducts || 0,
        });
      } else {
        // Fallback or error if structure is unexpected
        set({ error: "Invalid response structure" });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch products" });
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await ProductService.getProductById(id);
      const payload = response.data?.payload;
      if (payload) {
        set({ currentProduct: payload });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch product" });
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (productData: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      const response = await ProductService.createProduct(productData);
      if (response.status === 200) {
        set((state) => ({
          products: [...state.products, response.data.payload],
        }));
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to create product" });
      throw error; // Re-throw so component can handle success/failure UI
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      const response = await ProductService.updateProduct(id, productData);

      if (response.status === 200) {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
          currentProduct:
            state.currentProduct?.id === id
              ? { ...state.currentProduct, ...productData }
              : state.currentProduct,
        }));
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to update product" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await ProductService.deleteProduct(id);
      if (response.status === 200) {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to delete product" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductStore;
