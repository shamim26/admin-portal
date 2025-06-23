import apiClient from "@/services/apiClient";

export class CategoryService {
  static async getCategories() {
    const response = await apiClient.get("/categories");
    return response.data;
  }

  static async getCategoryById(id: number) {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  }

  static async createCategory(name: string) {
    const response = await apiClient.post("/categories", { name });
    return response.data;
  }

  static async updateCategory(id: number, name: string) {
    const response = await apiClient.put(`/categories/${id}`, { name });
    return response.data;
  }

  static async deleteCategory(id: number) {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  }
}
