import apiClient from "@/services/apiClient";

export class CategoryService {
  static async getCategories() {
    const response = await apiClient.get("/categories");
    return response.data;
  }

  static async getCategoryById(id: string) {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  }

  static async createCategory(name: string, parent?: string) {
    const response = await apiClient.post("/categories", { name, parent });
    return response.data;
  }

  static async updateCategory(id: string, name: string, parent?: string) {
    const response = await apiClient.put(`/categories/${id}`, { name, parent });
    return response.data;
  }

  static async deleteCategory(id: string) {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  }

  static async reorderCategories(categories: { id: string; order: number }[]) {
    const response = await apiClient.post("/categories/reorder", {
      categories,
    });
    return response.data;
  }
}
