import { Order } from "@/app/(private)/orders/order.dto";
import { OrderService } from "@/app/(private)/orders/order.service";
import { create } from "zustand";

type OrderStore = {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  updatePage: (page: number) => void;
  fetchOrders: () => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
};

const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  totalPages: 0,
  currentPage: 1,
  updatePage: (page: number) => set({ currentPage: page }),
  fetchOrders: async () => {
    const response = await OrderService.getOrders();
    set({
      orders: response.data.payload.orders,
      totalPages: response.data.payload.totalPages,
      currentPage: response.data.payload.currentPage,
    });
  },
  deleteOrder: async (id: string) => {
    const response = await OrderService.deleteOrder(id);
    set({ orders: response.data.payload.orders });
  },
}));

export default useOrderStore;
