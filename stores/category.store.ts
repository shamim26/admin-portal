import { Category } from "@/app/(private)/categories/category.dto";
import { create } from "zustand";

type CategoryStore = {
  categories: Category[];
  currentCategory: Category | null;
  setCategories: (categories: Category[]) => void;
  setCurrentCategory: (currentCategory: Category | null) => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  currentCategory: null,
  setCategories: (categories) => set({ categories }),
  setCurrentCategory: (currentCategory) => set({ currentCategory }),
}));
