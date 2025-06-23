import apiClient from "@/services/apiClient";
import { Product } from "./product.dto";

export class ProductService {
  static async getProducts() {
    const response = await apiClient.get("/products");
    return response.data;
  }

  static async getProductById(id: number) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  }

  static async createProduct(productData: Partial<Product>) {
    const response = await apiClient.post("/products", productData);
    return response.data;
  }

  static async updateProduct(id: number, productData: Partial<Product>) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  }

  static async deleteProduct(id: number) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  }
}
