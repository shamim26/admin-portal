import apiClient from "@/services/apiClient";
import { Order } from "./order.dto";

export class OrderService {
  static async getOrders(params?: Record<string, any>) {
    const response = await apiClient.get("/orders", { params });
    return response.data;
  }

  static async getOrderById(id: string) {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }

  static async updateOrder(id: string, orderData: Partial<Order>) {
    const response = await apiClient.put(`/orders/${id}`, orderData);
    return response.data;
  }

  static async deleteOrder(id: string) {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  }

  static async updateOrderStatus(id: string, status: string) {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  }

  static async updateOrdersStatusBulk(orderIds: string[], status: string) {
    const response = await apiClient.post("/orders/bulk/status", {
      orderIds,
      status,
    });
    return response.data;
  }
}
