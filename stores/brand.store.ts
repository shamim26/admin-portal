import { create } from "zustand";
import { BrandDTO, GetBrandDto } from "@/app/(private)/brands/brand.dto";
import { BrandService } from "@/app/(private)/brands/brand.service";

type BrandStore = {
  brands: BrandDTO[];
  allBrands: BrandDTO[];
  currentBrand: BrandDTO | null;
  loading: boolean;
  error: string | null;

  currentPage: number;
  totalPages: number;
  totalBrands: number;
  limit: number;
  search: string;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;

  fetchBrands: (options?: GetBrandDto) => Promise<void>;
  fetchAllBrands: () => Promise<void>;
  createBrand: (data: FormData) => Promise<void>;
  updateBrand: (id: string, data: FormData) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
};

export const useBrandStore = create<BrandStore>((set, get) => ({
  brands: [],
  allBrands: [],
  currentBrand: null,
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalBrands: 0,
  limit: 10,
  search: "",

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchBrands();
  },

  setSearch: (search) => {
    set({ search, currentPage: 1 });
    get().fetchBrands();
  },

  fetchBrands: async (options) => {
    set({ loading: true, error: null });
    const { currentPage, limit, search } = get();
    
    // Merge provided options or use state
    const params = {
      page: options?.page || currentPage,
      limit: options?.limit || limit,
      search: options?.search !== undefined ? options.search : search,
    };

    try {
      const response = await BrandService.getBrands(params);
      if (response.success) {
        set({
          brands: response.payload.brands,
          currentPage: response.payload.pagination.currentPage,
          totalPages: response.payload.pagination.totalPages,
          totalBrands: response.payload.pagination.totalItems,
        });
      } else {
        set({ error: response.message || "Failed to fetch brands" });
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },

  fetchAllBrands: async () => {
    set({ loading: true, error: null });
    try {
      const response = await BrandService.getBrands({ limit: 1000, page: 1 });
      if (response.success) {
        set({ allBrands: response.payload.brands });
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },

  createBrand: async (data: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await BrandService.createBrand(data);
      if (response.success) {
        await get().fetchBrands();
      } else {
        set({ error: response.message || "Failed to create brand" });
        throw new Error(response.message);
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message || "An error occurred" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateBrand: async (id: string, data: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await BrandService.updateBrand(id, data);
      if (response.success) {
        await get().fetchBrands();
      } else {
        set({ error: response.message || "Failed to update brand" });
        throw new Error(response.message);
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message || "An error occurred" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteBrand: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await BrandService.deleteBrand(id);
      if (response.success) {
        set((state) => ({
          brands: state.brands.filter((b) => b._id !== id),
        }));
      } else {
        set({ error: response.message || "Failed to delete brand" });
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },
}));
