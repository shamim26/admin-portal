import apiClient from "@/services/apiClient";
import { GetProductDto, Product } from "./product.dto";

export class ProductService {
  static async getProducts(options?: GetProductDto) {
    const response = await apiClient.get("/products", { params: options });
    return response;
  }

  static async getStats() {
    return await apiClient.get("/products/stats");
  }

  static async getProductById(id: string) {
    const response = await apiClient.get(`/products/${id}`);
    return response;
  }

  static async createProduct(productData: Partial<Product> | FormData) {
    const response = await apiClient.post("/products", productData);
    return response;
  }

  static async updateProduct(
    id: string,
    productData: Partial<Product> | FormData,
  ) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response;
  }

  static async deleteProduct(id: string) {
    const response = await apiClient.delete(`/products/${id}`);
    return response;
  }

  static async importProducts(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/products/import", formData);
    return response;
  }
}
