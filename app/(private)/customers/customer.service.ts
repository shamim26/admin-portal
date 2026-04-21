import apiClient from "@/services/apiClient";
import { GetCustomerDTO } from "./customer.dto";

export class CustomerService {
  static async getCustomers(params?: GetCustomerDTO) {
    const response = await apiClient.get("/users", { params });
    return response.data;
  }

  static async getCustomerById(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  static async banCustomer(id: string) {
    const response = await apiClient.patch(`/users/${id}/ban`);
    return response.data;
  }

  static async unbanCustomer(id: string) {
    const response = await apiClient.patch(`/users/${id}/unban`);
    return response.data;
  }

  static async updateRole(id: string, role: string) {
    const response = await apiClient.patch(`/users/${id}/role`, { role });
    return response.data;
  }
}
