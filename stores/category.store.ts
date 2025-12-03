import { CategoryDTO } from "@/app/(private)/categories/category.dto";
import { CategoryService } from "@/app/(private)/categories/category.service";
import { create } from "zustand";

type CategoryStore = {
  categories: CategoryDTO[];
  currentCategory: CategoryDTO | null;
  loading: boolean;
  error: string | null;

  // Pagination & Search State
  currentPage: number;
  totalPages: number;
  totalCategories: number;
  limit: number;
  search: string;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;

  fetchCategories: () => Promise<void>;
  createCategory: (name: string, parent?: string) => Promise<void>;
  updateCategory: (id: string, name: string, parent?: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categories: CategoryDTO[]) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,

  // Default Pagination State
  currentPage: 1,
  totalPages: 1,
  totalCategories: 0,
  limit: 10,
  search: "",

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchCategories();
  },

  setSearch: (search) => {
    set({ search, currentPage: 1 }); // Reset to page 1 on search
    get().fetchCategories();
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    const { currentPage, limit, search } = get();

    try {
      const response = await CategoryService.getCategories({
        page: currentPage,
        limit,
        search,
      });

      if (response.success) {
        set({
          categories: response.payload.categories,
          currentPage: response.payload.pagination.currentPage,
          totalPages: response.payload.pagination.totalPages,
          totalCategories: response.payload.pagination.totalCategories,
        });
      } else {
        set({ error: response.message || "Failed to fetch categories" });
      }
    } catch (error: any) {
      set({ error: error.message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (name: string, parent?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await CategoryService.createCategory(name, parent);
      if (response.success) {
        // Optimistic update or re-fetch
        await get().fetchCategories();
      } else {
        set({ error: response.message || "Failed to create category" });
      }
    } catch (error: any) {
      set({ error: error.message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id: string, name: string, parent?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await CategoryService.updateCategory(id, name, parent);
      if (response.success) {
        await get().fetchCategories();
      } else {
        set({ error: response.message || "Failed to update category" });
      }
    } catch (error: any) {
      set({ error: error.message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await CategoryService.deleteCategory(id);
      if (response.success) {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      } else {
        set({ error: response.message || "Failed to delete category" });
      }
    } catch (error: any) {
      set({ error: error.message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },

  reorderCategories: async (newCategories: CategoryDTO[]) => {
    // Optimistic update
    set({ categories: newCategories });

    try {
      const orderMap = newCategories.map((cat, index) => ({
        id: cat.id,
        order: index,
      }));

      const response = await CategoryService.reorderCategories(orderMap);

      if (!response.success) {
        // Revert on failure (optional, or just show error)
        set({ error: response.message || "Failed to reorder categories" });
        await get().fetchCategories(); // Re-fetch to restore correct order
      }
    } catch (error: any) {
      set({ error: error.message || "An error occurred during reordering" });
      await get().fetchCategories();
    }
  },
}));
