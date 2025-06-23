import apiClient from "@/services/apiClient";
import { Order } from "./order.dto";

export class OrderService {
  static async getOrders() {
    const response = await apiClient.get("/orders");
    return response.data;
  }

  static async getOrderById(id: number) {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }

  static async createOrder(orderData: Partial<Order>) {
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  }

  static async updateOrder(id: number, orderData: Partial<Order>) {
    const response = await apiClient.put(`/orders/${id}`, orderData);
    return response.data;
  }

  static async deleteOrder(id: number) {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  }

  static async updateOrderStatus(id: number, status: string) {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
}
