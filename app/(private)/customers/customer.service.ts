import apiClient from "@/services/apiClient";
import { Customer } from "./customer.dto";

export class CustomerService {
  static async getCustomers() {
    const response = await apiClient.get("/users");
    return response.data;
  }

  static async getCustomerById(id: number) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  static async createCustomer(customerData: Partial<Customer>) {
    const response = await apiClient.post("/users", customerData);
    return response.data;
  }

  static async updateCustomer(id: number, customerData: Partial<Customer>) {
    const response = await apiClient.put(`/users/${id}`, customerData);
    return response.data;
  }

  static async deleteCustomer(id: number) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }

  static async banCustomer(id: number) {
    const response = await apiClient.patch(`/users/${id}/ban`);
    return response.data;
  }

  static async unbanCustomer(id: number) {
    const response = await apiClient.patch(`/users/${id}/unban`);
    return response.data;
  }
}
