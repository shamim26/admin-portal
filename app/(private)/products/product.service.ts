import apiClient from "@/services/apiClient";
import { GetProductDto, Product } from "./product.dto";

export class ProductService {
  static async getProducts(options?: GetProductDto) {
    const response = await apiClient.get("/products", { params: options });
    return response;
  }

  static async getProductById(id: number) {
    const response = await apiClient.get(`/products/${id}`);
    return response;
  }

  static async createProduct(productData: Partial<Product>) {
    const response = await apiClient.post("/products", productData);
    return response;
  }

  static async updateProduct(id: number, productData: Partial<Product>) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response;
  }

  static async deleteProduct(id: number) {
    const response = await apiClient.delete(`/products/${id}`);
    return response;
  }
}
