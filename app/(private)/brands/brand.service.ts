import apiClient from "@/services/apiClient";
import { GetBrandDto } from "./brand.dto";

export class BrandService {
  static async getBrands(options?: GetBrandDto) {
    const response = await apiClient.get("/brands", { params: options });
    return response.data;
  }

  static async getBrandById(id: string) {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data;
  }

  static async createBrand(data: FormData) {
    const response = await apiClient.post("/brands", data);
    return response.data;
  }

  static async updateBrand(id: string, data: FormData) {
    const response = await apiClient.put(`/brands/${id}`, data);
    return response.data;
  }

  static async deleteBrand(id: string) {
    const response = await apiClient.delete(`/brands/${id}`);
    return response.data;
  }
}
